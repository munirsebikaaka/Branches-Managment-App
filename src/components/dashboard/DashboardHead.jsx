import { LayoutDashboard } from "lucide-react";

const DashboardHeader = ({ children, title }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold text-[#0f172a] flex items-center gap-2 capitalize">
          <div className="p-2 rounded-lg bg-white border border-[#e2e8f0] shadow-sm text-[#475569]">
            <LayoutDashboard size={24} />
          </div>
          {title}
        </h2>
        <p className="text-[#64748b] mt-1 text-sm md:text-base capitalize">
          {children}
        </p>
      </div>
    </div>
  );
};
export default DashboardHeader;
