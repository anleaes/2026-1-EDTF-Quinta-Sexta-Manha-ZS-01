import { DashboardStats } from "@/components/features/dashboard/DashboardStats";
import { SalesChart } from "@/components/features/dashboard/SalesChart";
import { CategoryChart } from "@/components/features/dashboard/CategoryChart";
import { RecentSalesTable } from "@/components/features/dashboard/RecentSalesTable";
import { AIInsightsCard } from "@/components/features/ai/AIInsightsCard";

export function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SalesChart />
            <CategoryChart />
          </div>
          <RecentSalesTable />
        </div>
        <div>
          <AIInsightsCard />
        </div>
      </div>
    </div>
  );
}
