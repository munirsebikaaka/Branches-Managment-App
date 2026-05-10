import {
  BatteryCharging,
  CircleDollarSign,
  LayoutDashboard,
} from "lucide-react";
import StatCard from "./DarshboardCard";

const DashboardStats = ({
  stats,
  statsCount,
  statsCountTitle,
  statsCountIcon,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
      <StatCard
        title="Product Sales"
        value={`UGX ${stats.totalSales.toFixed(2)}`}
        icon={<CircleDollarSign />}
        colorClass={{ bg: "bg-indigo-50", text: "text-[#4f46e5]" }}
      />
      <StatCard
        title="Charging Income"
        value={`UGX ${stats.totalCharging.toFixed(2)}`}
        icon={<BatteryCharging />}
        colorClass={{ bg: "bg-amber-50", text: "text-[#f59e0b]" }}
      />
      <StatCard
        title="Total Revenue"
        value={`UGX ${stats.totalRevenue.toFixed(2)}`}
        icon={<LayoutDashboard />}
        colorClass={{ bg: "bg-emerald-50", text: "text-[#10b981]" }}
      />
      <StatCard
        title={statsCountTitle}
        value={statsCount}
        icon={statsCountIcon}
        colorClass={{ bg: "bg-slate-50", text: "text-[#475569]" }}
      />
    </div>
  );
};
export default DashboardStats;
