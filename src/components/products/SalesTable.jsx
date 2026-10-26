import { handleReturnSale } from "../../services/pages/PagesFunctionalities";
import { formatDateTime } from "../../utils/format";
import { useProductsContext } from "../../utils/context/CreateProductContext";
import SaleButton from "../../ui/SaleButton";
import { Undo2 } from "lucide-react";
import { useAuthContext } from "../../utils/context/CreateAuthContext";

const SalesTable = ({ filteredSales, onViewReceipt, getBranchName }) => {
  const { user } = useAuthContext();
  const { products, setProducts, setSalesData } = useProductsContext();

  return (
    <div className="space-y-4">
      {filteredSales?.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-2xl border border-border-color text-[#64748b]">
          No sales found.
        </div>
      ) : (
        filteredSales?.map((sale) => {
          return (
            <div
              key={sale.id}
              className="flex items-center justify-between rounded-2xl border border-border-color bg-white p-4 shadow-sm transition-colors hover:border-indigo-200">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
                  Receipt number
                </p>
                <p className="mt-1 text-sm font-semibold text-[#475569]">
                  {sale?.saleRecieptNumber}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
                  Date & Time
                </p>
                <p className="mt-1 text-sm text-[#475569]">
                  {formatDateTime(sale.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
                  branch name
                </p>
                <p className="mt-1 text-sm text-[#475569]">
                  {getBranchName[sale.branchId]}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <SaleButton
                  onClick={() => onViewReceipt && onViewReceipt(sale)}
                  text={"View Receipt"}
                />
                <button
                  onClick={() =>
                    handleReturnSale(
                      sale,
                      products,
                      setProducts,
                      setSalesData,
                      user,
                    )
                  }
                  aria-label={
                    sale.status === "returned"
                      ? "Sale returned"
                      : "Return sale to stock"
                  }
                  title={
                    sale.status === "returned"
                      ? "Returned to stock"
                      : "Return to stock"
                  }
                  className="rounded-lg p-2 text-action-color transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50">
                  {/* <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-action-color" /> */}
                  <Undo2 size={16} aria-hidden="true" />
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
