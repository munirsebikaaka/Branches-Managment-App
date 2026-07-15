import { useMemo } from "react";
import SalesTable from "../products/SalesTable";

const RecentSales = ({ filteredSales }) => {
  const recentSales = useMemo(() => {
    return [...filteredSales]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
  }, [filteredSales]);

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#0f172a] px-2">Recent Sales</h2>

        <div className="space-y-3">
          {recentSales.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-2xl border border-[#e2e8f0] text-[#64748b]">
              No sales recorded yet
            </div>
          ) : (
            <SalesTable filteredSales={recentSales} />
          )}
        </div>
      </div>
    </>
  );
};

export default RecentSales;
