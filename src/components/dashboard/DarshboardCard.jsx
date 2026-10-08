const StatCard = ({ title, value, icon, colorClass, subtitle }) => {
  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-2xl border border-border-color shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${colorClass.bg} ${colorClass.text}`}>
          {icon}
        </div>
        {subtitle && (
          <span className="text-[10px] font-bold text-[#94a3b8] uppercase">
            {subtitle}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-header-description">{title}</h3>
      <p className="text-xl font-bold text-header-color mt-1">{value}</p>
    </div>
  );
};
export default StatCard;
