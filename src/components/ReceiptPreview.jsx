import { useMemo } from "react";
import { useProductsContext } from "../utils/context/CreateProductContext";
import {
  formatMoney,
  formatReceiptDate,
  formatReceiptTime,
} from "../utils/format";
import { getNames } from "../services/pages/PagesFunctionalities";
import { MessageCircle, X } from "lucide-react";

const ReceiptPreview = ({ sale, isVisible, onClose }) => {
  const { workers, branches } = useProductsContext();
  const workInSaleCharge = useMemo(() => {
    const worker = workers
      ?.filter((w) => w.role === "worker")
      ?.find((w) => w.branchId === sale?.branchId);
    return worker;
  }, [workers, sale?.branchId]);

  const getBranchName = useMemo(() => getNames(branches), [branches]);
  const branchLocation = useMemo(
    () => branches.find((branch) => branch.id === workInSaleCharge?.branchId),
    [branches, workInSaleCharge],
  );

  const defaultVat = 1000;

  if (!isVisible || !sale) return null;

  const branchName = getBranchName[sale.branchId];
  const receiptMessage = [
    "Auntie's Shops - Sales Receipt",
    `Branch: ${branchName}`,
    branchLocation?.branchLocation
      ? `Location: ${branchLocation.branchLocation}`
      : null,
    `Receipt: ${sale.saleRecieptNumber}`,
    `Date: ${formatReceiptDate(sale.createdAt)} ${formatReceiptTime(sale.createdAt)}`,
    workInSaleCharge?.name ? `Served by: ${workInSaleCharge.name}` : null,
    "",
    "Items:",
    ...sale.items.map(
      (item) =>
        `- ${item.productName}: ${item.quantity} x ${formatMoney(item.price)} = ${formatMoney(+item.price * +item.quantity)}`,
    ),
    "",
    `Subtotal: ${formatMoney(sale.total)}`,
    `VAT: ${formatMoney(defaultVat)}`,
    `Grand total: ${formatMoney(sale.total + defaultVat)}`,
    "",
    "Thank you for supporting Auntie's Shops!",
  ]
    .filter((line) => line !== null)
    .join("\n");
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(receiptMessage)}`;

  return (
    <div className="mx-auto w-full p-4 sm:max-w-3xl sm:p-5 lg:max-w-4xl">
      <div className="mx-auto flex w-full flex-col rounded-2xl border border-border-color bg-white p-4 sm:p-5">
        <div className="text-center mb-5 mt-8 space-y-4 border-b-4 border-dashed border-header-color pb-4 px-4">
          <h2 className="text-5xl font-bold capitalize text-header-color">
            Auntie's Shops kampala uganda
          </h2>
          <p className="capitalize text-3xl text-center text-header-color">
            {`${branchLocation.branchLocation}`} <span>.</span>{" "}
            {`${getBranchName[sale.branchId]}`}
          </p>

          <p className="text-3xl text-center text-header-color">
            Tel:0778452410/{workInSaleCharge.phoneNumber}
          </p>
        </div>
        <div className="text-center mb-5 space-y-2 border-b-4 border-dashed border-header-color pb-3 px-4">
          <h2 className="text-5xl font-bold capitalize text-header-color">
            SALES RECEIPT
          </h2>
          <p className="text-3xl text-center text-header-color">
            Amounts in UGX
          </p>
        </div>
        <div className="mb-5 space-y-2 border-b-4 border-dashed border-header-color pb-3 px-4">
          <h2 className="text-4xl font-bold capitalize text-header-color">
            Receipt: {sale.saleRecieptNumber}
          </h2>
          <p className="text-3xl text-header-color">
            Date: {formatReceiptDate(sale.createdAt)},{" "}
            {formatReceiptTime(sale.createdAt)}
          </p>
          <p className="capitalize text-header-color">
            Served by: {workInSaleCharge?.name}
          </p>
        </div>
        <div className="">
          <div className="grid grid-cols-4 gap-2 font-bold text-3xl text-header-color border-b-4 border-dashed border-header-color mb-5 pb-3">
            <span>Items</span>
            <span>Qty</span>
            <span>Rate</span>
            <span className="text-right">Total</span>
          </div>

          {sale?.items.map((item, index) => (
            <div
              key={`${item.productId}-${index}`}
              className="grid grid-cols-4 gap-2 py-1 text-2xl text-header-color capitalize">
              <span className="min-w-0 ">{item.productName}</span>
              <span>{item.quantity}</span>
              <span>{formatMoney(item.price)}</span>
              <span className="text-right">
                {formatMoney(+item.price * +item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t-4 border-dashed border-header-color mt-3 pt-5 text-2xl text-header-color space-y-3 px-4">
          <div className="flex justify-between items-center">
            <p>Subtotal</p>
            <p>{formatMoney(sale?.total)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p>VAT</p>
            <p>{formatMoney(defaultVat)}</p>
          </div>
        </div>
        <div className="flex justify-between items-center border-y-4 border-dashed border-header-color mt-3 pt-5 pb-3 px-4 font-bold text-4xl text-header-color">
          <p>GRAND TOTAL</p>
          <p>{formatMoney(sale?.total + defaultVat)}</p>
        </div>{" "}
        <div className="flex justify-between items-center border-b-4 border-dashed border-header-color  mt-3 pb-3 px-4 text-3xl text-header-color">
          <p>Paid via:</p>
        </div>
        <div className="border-b-4 text-3xl py-4 border-dashed border-header-color px-4">
          <p className="text-center text-header-color font-bold">
            THANK YOU FOR SUPPORTING AUNTIE'S SHOPS!
          </p>
        </div>
        <div className="mt-4 flex justify-end gap-3 print-hidden">
          <a
            href={whatsappUrl}
            target="_blank"
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
            <MessageCircle size={16} aria-hidden="true" />
            Share Reciept
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-color px-4 py-2 text-sm font-semibold text-header-color">
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreview;
