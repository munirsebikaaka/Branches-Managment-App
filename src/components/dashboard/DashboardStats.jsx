import {
  BatteryCharging,
  CircleDollarSign,
  LayoutDashboard,
} from "lucide-react";
import { formatMoney } from "../../utils/format";
import StatCard from "./DarshboardCard";

const DashboardStats = ({
  stats,
  statsCount,
  statsCountTitle,
  statsCountIcon,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
      <StatCard
        title="Product Sales"
        value={formatMoney(stats.totalSales)}
        icon={<CircleDollarSign />}
        colorClass={{ bg: "bg-indigo-50", text: "text-[#4f46e5]" }}
      />
      <StatCard
        title="Charging Income"
        value={formatMoney(stats.totalCharging)}
        icon={<BatteryCharging />}
        colorClass={{ bg: "bg-amber-50", text: "text-[#f59e0b]" }}
      />
      <StatCard
        title="Total Revenue"
        value={formatMoney(stats.totalRevenue)}
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
