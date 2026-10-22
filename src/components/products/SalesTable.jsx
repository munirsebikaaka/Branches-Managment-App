import { useMemo, useState } from "react";
import {
  getNames,
  handleDeleteProduct,
} from "../../services/pages/PagesFunctionalities";
import { formatDateTime, formatMoney } from "../../utils/format";
import { useProductsContext } from "../../utils/context/CreateProductContext";
import SaleButton from "../../ui/SaleButton";
import { Trash2 } from "lucide-react";
import { useAuthContext } from "../../utils/context/CreateAuthContext";

const SalesTable = ({ filteredSales, onViewReceipt }) => {
  const { user } = useAuthContext();
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
          const itemCount = sale.items?.length ?? 0;
          return (
            <div
              key={sale.id}
              className="grid min-w-0 grid-cols-1 gap-4 rounded-2xl border border-border-color bg-white p-4 shadow-sm transition-colors hover:border-[#4f46e5]/30 sm:grid-cols-2 sm:p-5 lg:grid-cols-[1.2fr_0.7fr_1fr_1fr_1fr_auto] lg:items-center lg:gap-5">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
                  Date & Time
                </p>
                <p className="mt-1 text-sm text-[#475569]">
                  {formatDateTime(sale.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
                  Items
                </p>
                <p className="mt-1 text-sm font-medium text-[#475569]">
                  {itemCount} {itemCount === 1 ? "product" : "products"}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
                  Branch
                </p>
                <span className="mt-1 block text-sm text-[#475569]">
                  {getBranchName[sale.branchId]}
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
                  Payment
                </p>
                <span className="mt-1 block text-sm text-[#475569]">
                  {sale.paymentMethod
                    ? sale.paymentMethod
                        .split("_")
                        .map((word) =>
                          word === "mtn"
                            ? "MTN"
                            : word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")
                    : "—"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-border-color pt-3 sm:col-span-2 lg:col-span-1 lg:justify-end lg:border-0 lg:pt-0">
                <div className="lg:hidden">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
                    Total
                  </p>
                  <p className="text-sm font-semibold text-header-color">
                    {formatMoney(sale.total)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
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
                        user,
                      )
                    }
                    aria-label="Delete sale"
                    className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50">
                    {deletingSaleId === sale.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-red-500" />
                    ) : (
                      <Trash2 size={16} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <div className="hidden lg:block">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
                  Total
                </p>
                <p className="mt-1 text-sm font-semibold text-header-color">
                  {formatMoney(sale.total)}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default SalesTable;
