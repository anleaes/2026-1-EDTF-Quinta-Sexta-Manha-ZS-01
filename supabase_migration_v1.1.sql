-- ============================================================
-- SCRIPT DE MIGRAÇÃO — v1.0 → v1.1
-- Execute este script se você já tinha o banco criado antes.
-- Ele adiciona owner_id nas tabelas existentes e atualiza as
-- políticas de segurança sem apagar seus dados.
-- ============================================================

-- ── PASSO 1: Adicionar owner_id nas tabelas existentes ────────
-- "IF NOT EXISTS" garante que não vai falhar se a coluna já existir.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.sales
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.inventory_adjustments
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- ── PASSO 2: Preencher owner_id nos registros existentes ──────
-- Pega o primeiro usuário admin encontrado na tabela profiles
-- e atribui como dono de todos os registros antigos.
DO $$
DECLARE
  v_owner_id UUID;
BEGIN
  SELECT id INTO v_owner_id FROM public.profiles LIMIT 1;

  IF v_owner_id IS NOT NULL THEN
    UPDATE public.products SET owner_id = v_owner_id WHERE owner_id IS NULL;
    UPDATE public.sales    SET owner_id = v_owner_id WHERE owner_id IS NULL;
    UPDATE public.inventory_adjustments SET owner_id = v_owner_id WHERE owner_id IS NULL;
    RAISE NOTICE 'owner_id preenchido para o usuário: %', v_owner_id;
  ELSE
    RAISE NOTICE 'Nenhum usuário encontrado em profiles. Registros antigos ficaram sem owner_id.';
  END IF;
END;
$$;

-- ── PASSO 3: Criar índice único por código por loja ───────────
DROP INDEX IF EXISTS public.products_owner_code_idx;
CREATE UNIQUE INDEX IF NOT EXISTS products_owner_code_idx
  ON public.products(owner_id, code)
  WHERE owner_id IS NOT NULL;

-- ── PASSO 4: Criar função e trigger de set_owner_id ──────────
CREATE OR REPLACE FUNCTION public.set_owner_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.owner_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_products_owner ON public.products;
CREATE TRIGGER set_products_owner
  BEFORE INSERT ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_owner_id();

DROP TRIGGER IF EXISTS set_sales_owner ON public.sales;
CREATE TRIGGER set_sales_owner
  BEFORE INSERT ON public.sales
  FOR EACH ROW EXECUTE FUNCTION public.set_owner_id();

DROP TRIGGER IF EXISTS set_adjustments_owner ON public.inventory_adjustments;
CREATE TRIGGER set_adjustments_owner
  BEFORE INSERT ON public.inventory_adjustments
  FOR EACH ROW EXECUTE FUNCTION public.set_owner_id();

-- ── PASSO 5: Adicionar product_name em inventory_adjustments ──
ALTER TABLE public.inventory_adjustments
  ADD COLUMN IF NOT EXISTS product_name TEXT NOT NULL DEFAULT '';

-- ── PASSO 6: RPC get_inventory_value (atualizada) ─────────────
CREATE OR REPLACE FUNCTION public.get_inventory_value()
RETURNS NUMERIC AS $$
  SELECT COALESCE(SUM(stock * price), 0)
  FROM public.products
  WHERE status = 'Ativo'
    AND (owner_id = auth.uid() OR owner_id IS NULL);
$$ LANGUAGE SQL SECURITY DEFINER;

-- ── PASSO 7: RPC restock_product (atualizada) ─────────────────
CREATE OR REPLACE FUNCTION public.restock_product(p_product_id BIGINT, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  IF p_quantity <= 0 THEN
    RAISE EXCEPTION 'A quantidade deve ser maior que zero';
  END IF;

  UPDATE public.products
  SET stock = stock + p_quantity,
      updated_at = now()
  WHERE id = p_product_id
    AND (owner_id = auth.uid() OR owner_id IS NULL);

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Produto não encontrado ou sem permissão';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── PASSO 8: RPC create_sale_and_deduct_stock (nova) ──────────
CREATE OR REPLACE FUNCTION public.create_sale_and_deduct_stock(
  p_product_id BIGINT,
  p_product_name TEXT,
  p_quantity INTEGER,
  p_total NUMERIC,
  p_customer TEXT,
  p_date TEXT
)
RETURNS TABLE(
  sale_id BIGINT,
  new_stock INTEGER
) AS $$
DECLARE
  v_current_stock INTEGER;
  v_sale_id BIGINT;
  v_new_stock INTEGER;
BEGIN
  -- Bloquear a linha do produto para evitar race conditions
  SELECT stock INTO v_current_stock
  FROM public.products
  WHERE id = p_product_id
    AND (owner_id = auth.uid() OR owner_id IS NULL)
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Produto não encontrado ou sem permissão';
  END IF;

  IF v_current_stock < p_quantity THEN
    RAISE EXCEPTION 'Estoque insuficiente. Disponível: %, solicitado: %',
      v_current_stock, p_quantity;
  END IF;

  -- Inserir a venda
  INSERT INTO public.sales (owner_id, date, product_id, product_name, quantity, total, customer)
  VALUES (auth.uid(), p_date, p_product_id, p_product_name, p_quantity, p_total, p_customer)
  RETURNING id INTO v_sale_id;

  -- Decrementar o estoque
  UPDATE public.products
  SET stock = stock - p_quantity,
      updated_at = now()
  WHERE id = p_product_id
  RETURNING stock INTO v_new_stock;

  RETURN QUERY SELECT v_sale_id, v_new_stock;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── PASSO 9: Trigger de criação de perfil (atualizado) ────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, store_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'admin',
    'Minha Loja'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── PASSO 10: Habilitar RLS ───────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_adjustments ENABLE ROW LEVEL SECURITY;

-- ── PASSO 11: Remover políticas antigas e criar novas ─────────
DROP POLICY IF EXISTS "Allow all actions for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Allow all actions for authenticated users" ON public.products;
DROP POLICY IF EXISTS "Allow all actions for authenticated users" ON public.sales;
DROP POLICY IF EXISTS "Allow all actions for authenticated users" ON public.inventory_adjustments;
DROP POLICY IF EXISTS "owner_access" ON public.products;
DROP POLICY IF EXISTS "owner_access" ON public.sales;
DROP POLICY IF EXISTS "owner_access" ON public.inventory_adjustments;
DROP POLICY IF EXISTS "profiles_owner" ON public.profiles;
DROP POLICY IF EXISTS "products_owner" ON public.products;
DROP POLICY IF EXISTS "sales_owner" ON public.sales;
DROP POLICY IF EXISTS "adjustments_owner" ON public.inventory_adjustments;

-- Profiles: cada usuário acessa apenas o próprio perfil
CREATE POLICY "profiles_owner" ON public.profiles
  FOR ALL TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Products: isolado por owner_id (com fallback para registros sem owner)
CREATE POLICY "products_owner" ON public.products
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR owner_id IS NULL)
  WITH CHECK (true);

-- Sales: isolado por owner_id
CREATE POLICY "sales_owner" ON public.sales
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR owner_id IS NULL)
  WITH CHECK (true);

-- Inventory adjustments: isolado por owner_id
CREATE POLICY "adjustments_owner" ON public.inventory_adjustments
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR owner_id IS NULL)
  WITH CHECK (true);

-- ── VIEW: low_stock_products (recriar para compatibilidade) ───
CREATE OR REPLACE VIEW public.low_stock_products AS
SELECT * FROM public.products
WHERE stock <= min_stock AND status = 'Ativo';

-- ── FIM DA MIGRAÇÃO ───────────────────────────────────────────
-- Verifique se os dados migraram corretamente com:
-- SELECT id, name, owner_id FROM public.products LIMIT 5;
-- SELECT id, product_name, owner_id FROM public.sales LIMIT 5;
