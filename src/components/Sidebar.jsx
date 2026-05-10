import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import {
  BadgePlus,
  BarChart3,
  BatteryCharging,
  CircleDollarSign,
  GitBranchPlus,
  LayoutDashboard,
  Package,
  Users,
  X,
} from "lucide-react";

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const camelCaseUserName =
    user?.name
      ?.split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ") || "User";

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
    text-sm font-medium
    ${
      isActive(path)
        ? "bg-[#4f46e5] text-white shadow-lg shadow-indigo-200"
        : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
    }
  `;

  return (
    <aside
      className={`
        fixed top-0 bottom-0 z-[50] w-64 bg-white border-r border-[#e2e8f0] 
        flex flex-col font-['Outfit',_sans-serif] transition-all duration-300 ease-in-out
        ${isOpen ? "left-0" : "-left-full"} 
        md:left-0
      `}>
      <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-[#4f46e5] rounded-md flex items-center justify-center text-white font-bold">
              A
            </div>
            <h2 className="text-sm font-bold text-[#0f172a] tracking-tight">
              Auntie's Shops
            </h2>
          </div>
          <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#94a3b8] px-1">
            Shop's System
          </p>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden p-1.5 text-[#64748b] hover:bg-slate-100 rounded-md">
          <X size={20} />
        </button>
      </div>

      <div className="mx-4 my-4 p-4 bg-[#f8fafc] rounded-xl border border-[#f1f5f9] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#e2e8f0] flex items-center justify-center text-[#475569] font-semibold uppercase shrink-0">
          {user?.name?.[0]}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-[#0f172a] truncate">
            {camelCaseUserName}
          </p>
          <span className="text-[11px] font-medium text-[#4f46e5] bg-indigo-50 px-1.5 py-0.5 rounded uppercase">
            {user?.role}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <Link
          className={navLinkClass(
            user?.role === "owner" ? "/owner" : "/dashboard",
          )}
          to={user?.role === "owner" ? "/owner" : "/dashboard"}
          onClick={() => setIsOpen(false)}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        {user?.role === "worker" && (
          <>
            <Link
              className={navLinkClass("/add-product")}
              to="/add-product"
              onClick={() => setIsOpen(false)}>
              <BadgePlus size={18} /> Add Product
            </Link>
            <Link
              className={navLinkClass("/record-sale")}
              to="/record-sale"
              onClick={() => setIsOpen(false)}>
              <CircleDollarSign size={18} /> Record Sale
            </Link>
            <Link
              className={navLinkClass("/record-charging")}
              to="/record-charging"
              onClick={() => setIsOpen(false)}>
              <BatteryCharging size={18} /> Record Charging
            </Link>
          </>
        )}

        <Link
          className={navLinkClass("/products")}
          to="/products"
          onClick={() => setIsOpen(false)}>
          <Package size={18} /> View Products
        </Link>

        <Link
          className={navLinkClass("/sales")}
          to="/sales"
          onClick={() => setIsOpen(false)}>
          <BarChart3 size={18} /> View Sales
        </Link>

        {user?.role === "owner" && (
          <div className="pt-6">
            <p className="text-[11px] font-bold text-[#94a3b8] uppercase px-4 mb-2">
              Management
            </p>
            <Link
              className={navLinkClass("/add-branch")}
              to="/add-branch"
              onClick={() => setIsOpen(false)}>
              <GitBranchPlus size={18} /> Add Branch
            </Link>
            <Link
              className={navLinkClass("/manage-workers")}
              to="/manage-workers"
              onClick={() => setIsOpen(false)}>
              <Users size={18} /> Register Workers
            </Link>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-[#f1f5f9]">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-[#ef4444] hover:bg-red-50 rounded-lg transition-colors">
          Logout
        </button>
      </div>
    </aside>
  );
};
