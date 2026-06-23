const SalesTable = ({ filteredSales, getBranchName }) => {
  return (
    <div className="space-y-4">
      <div className="hidden md:grid md:grid-cols-6 gap-4 px-6 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs font-bold text-[#94a3b8] uppercase">
        <span>Product</span>
        <span>Qty</span>
        <span>Price</span>
        <span>Total</span>
        <span>Date</span>
        <span>Branch</span>
      </div>

      {filteredSales.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-2xl border border-[#e2e8f0] text-[#64748b]">
          No sales found.
        </div>
      ) : (
        filteredSales.map((sale) => (
          <div
            key={sale.id}
            className="bg-white p-5 md:px-6 md:py-4 rounded-2xl border border-[#e2e8f0] shadow-sm hover:border-[#4f46e5]/30 transition-colors grid grid-cols-2 md:grid-cols-6 gap-y-3 gap-x-4 items-center">
            <div className="col-span-2 md:col-span-1">
              <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                Product
              </p>
              <p className="font-semibold text-[#0f172a]">{sale.productName}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                Qty
              </p>
              <p className="text-[#475569] text-sm">{sale.quantity} units</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                Price
              </p>
              <p className="text-[#475569] text-sm">${sale.price}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                Total
              </p>
              <p className="text-[#4f46e5] font-semibold text-sm">
                ${sale.total}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                Date
              </p>
              <p className="text-[#475569] text-sm">
                {new Date(sale.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="col-span-2 md:col-span-1">
              <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                Branch
              </p>
              <span className="inline-block bg-slate-100 text-[#64748b] px-2 py-1 rounded text-[11px] font-medium">
                {getBranchName[sale.branchId]}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
export default SalesTable;
