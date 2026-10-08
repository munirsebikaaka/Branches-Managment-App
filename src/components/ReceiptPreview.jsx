import { useMemo } from "react";
import { useProductsContext } from "../utils/context/CreateProductContext";
import {
  formatMoney,
  formatReceiptDate,
  formatReceiptTime,
} from "../utils/format";
import SaleButton from "../ui/SaleButton";
import { getNames } from "../services/pages/PagesFunctionalities";

const ReceiptPreview = ({ sale, onClose }) => {
  const { workers, branches } = useProductsContext();
  const workInSaleCharge = useMemo(() => {
    const worker = workers
      ?.filter((w) => w.role === "worker")
      ?.find((w) => w.branchId === sale.branchId);
    return worker;
  }, [workers, sale.branchId]);

  const getBranchName = useMemo(() => getNames(branches), [branches]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
      <div className="flex w-[99%] sm:w-[70%] lg:w-[50%] flex-col rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-2xl sm:p-5">
        <div className="text-center mb-4">
          <p className="text-md font-black uppercase text-header-color">
            Auntie's Shops
          </p>
          <p className="capitalize">
            {getBranchName[workInSaleCharge.branchId]}
          </p>
        </div>

        <div className="border-t border-b border-dashed border-[#cbd5e1] py-3 my-4 text-xs text-[#334155] space-y-1">
          <p>
            Date:{" "}
            <span className="font-semibold">
              {formatReceiptDate(sale.createdAt)}
            </span>
          </p>
          <p>
            Time:{" "}
            <span className="font-semibold">
              {formatReceiptTime(sale.createdAt)}
            </span>
          </p>
          <p>
            Contact:{" "}
            <span className="font-semibold">{workInSaleCharge.workerId}</span>
          </p>
          <p>
            Served by:{" "}
            <span className="font-semibold capitalize">
              {workInSaleCharge.name}
            </span>
          </p>
        </div>

        <div className="space-y-2 text-xs text-[#334155]">
          <div className="grid grid-cols-4 gap-2 font-bold uppercase text-[#64748b]">
            <span>Product</span>
            <span>QTY</span>
            <span>Price</span>
            <span className="text-right">Total</span>
          </div>

          {sale?.items.map((item, index) => (
            <div
              key={`${item.productId}-${index}`}
              className="grid grid-cols-4 gap-2 py-1 text-[11px] border-b border-[#f1f5f9]">
              <span className="min-w-0">{item.productName}</span>
              <span>{item.quantity}</span>
              <span>{formatMoney(item.price)}</span>
              <span className="text-right">
                {formatMoney(+item.price * +item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-border-color mt-4 pt-4 text-right text-sm font-bold text-header-color">
          TOTAL: {formatMoney(sale?.total)}
        </div>

        <div className="mt-6 flex flex-col gap-3 text-center text-[11px] text-header-description sm:flex-row sm:items-center sm:justify-between">
          <p>Thank you for supprting Auntie's shops!</p>
          <SaleButton onClick={onClose} text={"Close"} />
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreview;
