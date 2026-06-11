import { type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
  trend?: number;          // percentual (positivo = alta, negativo = queda)
  trendLabel?: string;
  delay?: number;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  iconBg = "bg-blue-100",
  trend,
  trendLabel,
  delay = 0,
  className,
}: StatsCardProps) {
  const hasTrend = trend !== undefined;
  const isPositive = (trend ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "bg-white rounded-xl border border-border p-6 hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconBg)}>
          {icon}
        </div>
        {hasTrend && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
              isPositive
                ? "text-green-700 bg-green-50"
                : "text-red-700 bg-red-50"
            )}
          >
            {isPositive ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            {Math.abs(trend ?? 0)}%
          </span>
        )}
      </div>

      <p className="text-2xl font-bold text-foreground mb-1 leading-none">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>

      {trendLabel && (
        <p className="text-xs text-muted-foreground mt-2">{trendLabel}</p>
      )}
    </motion.div>
  );
}
