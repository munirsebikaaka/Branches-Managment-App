import { LayoutDashboard } from "lucide-react";

const DashboardHeader = ({ children, title }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-md sm:text-3xl font-bold text-header-color flex items-center gap-2 capitalize">
          <span className="p-2 rounded-lg bg-white border border-border-color shadow-sm text-[#475569]">
            <LayoutDashboard size={24} />
          </span>
          {title}
        </h2>
        <p className="text-header-description mt-1 capitalize">{children}</p>
      </div>
    </div>
  );
};
export default DashboardHeader;
