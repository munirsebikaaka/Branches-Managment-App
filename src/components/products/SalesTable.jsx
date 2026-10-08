import { useMemo, useState } from "react";
import {
  getNames,
  handleDeleteProduct,
} from "../../services/pages/PagesFunctionalities";
import { formatDateTime } from "../../utils/format";
import { useProductsContext } from "../../utils/context/CreateProductContext";
import SaleButton from "../../ui/SaleButton";
import { Trash2 } from "lucide-react";

const SalesTable = ({ filteredSales, onViewReceipt }) => {
  const { branches, setSalesData } = useProductsContext();

  const getBranchName = useMemo(() => getNames(branches), [branches]);
  const [deletingSaleId, setDeletingSaleId] = useState(null);

  return (
    <div className="space-y-4">
      {filteredSales?.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-2xl border border-border-color text-[#64748b]">
          No sales found.
        </div>
      ) : (
        filteredSales?.map((sale) => {
          const itemCount = sale.items.length;
          return (
            <div
              key={sale.id}
              className="flex flex-col lg:flex-row lg:justify-between gap-3 bg-white p-5 md:px-6 md:py-4 rounded-2xl border border-border-color shadow-sm hover:border-[#4f46e5]/30 transition-colors">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#94a3b8]">
                  Date & Time
                </p>
                <p className="text-[#475569] text-sm">
                  {formatDateTime(sale.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-[#94a3b8]">
                  Items
                </p>
                <p className="text-[#475569] text-sm font-medium">
                  {itemCount} products
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-[#94a3b8] ">
                  Branch
                </p>
                <span className="text-[#475569] text-sm">
                  {getBranchName[sale.branchId]}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2">
                <SaleButton
                  onClick={() => onViewReceipt && onViewReceipt(sale)}
                  text={"View Receipt"}
                />
                <button
                  disabled={deletingSaleId === sale.id}
                  onClick={() =>
                    handleDeleteProduct(
                      sale,
                      setSalesData,
                      "sales",
                      setDeletingSaleId,
                    )
                  }
                  className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Delete sale">
                  {deletingSaleId === sale.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                  ) : (
                    <Trash2 size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default SalesTable;
