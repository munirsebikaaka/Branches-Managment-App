import { Printer } from "lucide-react";
import {
  formatMoney,
  formatReceiptDate,
  formatReceiptTime,
} from "../utils/format";
import { useProductsContext } from "../utils/context/CreateProductContext";
import { getNames } from "../services/pages/PagesFunctionalities";

const ChargingReceipt = ({ receipt, onClose }) => {
  const { branches } = useProductsContext();
  const branchNames = getNames(branches);

  return (
    <div className="printable-receipt fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="printable-receipt-card w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-action-color">
            Phone charging receipt
          </p>
          <h2 className="mt-1 text-2xl font-bold text-header-color">
            Auntie&apos;s Shops
          </h2>
          <p className="mt-1 text-sm text-header-description">
            {branchNames[receipt.branchId] || "Branch"}
          </p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-header-description">
            Phone owner code
          </p>
          <p className="text-3xl font-black tracking-widest text-header-color">
            {receipt.phoneOwnerCode}
          </p>
          <p className="mt-1 text-xs text-header-description">
            Keep this code to identify and collect your phone.
          </p>
        </div>

        <div className="my-5 space-y-2 border-y border-dashed border-border-color py-4 text-sm text-header-color">
          <p>
            <b>Owner:</b> {receipt.customerName}
          </p>
          <p>
            <b>Contact:</b> {receipt.contact}
          </p>
          <p>
            <b>Phone:</b> {receipt.deviceModel}
          </p>
          <p>
            <b>Received:</b> {formatReceiptDate(receipt.receivedAt)}{" "}
            {formatReceiptTime(receipt.receivedAt)}
          </p>
          <p>
            <b>Charging fee:</b> {formatMoney(receipt.price)}
          </p>
          <p>
            <b>Payment status:</b>{" "}
            {receipt.paidOnArrival ? "Paid at drop-off" : "Unpaid"}
          </p>
        </div>

        <div className="print-hidden flex gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-header-color px-4 py-2.5 text-sm font-semibold text-white">
            <Printer size={16} aria-hidden="true" />
            Print receipt
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-color px-4 py-2.5 text-sm font-semibold text-header-color">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChargingReceipt;
