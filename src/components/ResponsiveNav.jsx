import { Menu } from "lucide-react";

const ResponsiveNav = ({ onClick }) => {
  return (
    <div className="flex items-center justify-between md:hidden mb-6">
      <button
        onClick={onClick}
        className="p-2 bg-white border border-[#e2e8f0] rounded-lg text-[#0f172a] shadow-sm">
        <Menu size={24} />
      </button>
      <div className="font-bold text-[#0f172a]">Auntie's Shops</div>
    </div>
  );
};
export default ResponsiveNav;
