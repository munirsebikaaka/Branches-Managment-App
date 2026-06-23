import { useMemo } from "react";

const RecentSales = ({ filteredSales }) => {
  const recentSales = useMemo(() => {
    return [...filteredSales]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [filteredSales]);

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#0f172a] px-2">Recent Sales</h2>

        <div className="hidden md:grid md:grid-cols-4 gap-4 px-6 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
          <span>Product</span>
          <span>Quantity</span>
          <span>Price</span>
          <span>Date</span>
        </div>

        <div className="space-y-3">
          {recentSales.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-2xl border border-[#e2e8f0] text-[#64748b]">
              No sales recorded yet
            </div>
          ) : (
            recentSales.map((sale) => (
              <div
                key={sale.id}
                className="bg-white p-5 md:px-6 md:py-4 rounded-2xl border border-[#e2e8f0] shadow-sm hover:border-[#4f46e5]/30 transition-colors grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4 items-center">
                <div className="col-span-2 md:col-span-1">
                  <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                    Product
                  </p>
                  <p className="font-semibold text-[#0f172a]">
                    {sale.productName}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                    Quantity
                  </p>
                  <p className="text-[#475569] font-medium">
                    {sale.quantity} units
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                    Price
                  </p>
                  <p className="text-[#475569] font-semibold">
                    ${sale.price?.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                    Date
                  </p>
                  <p className="text-sm text-[#94a3b8]">
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default RecentSales;
