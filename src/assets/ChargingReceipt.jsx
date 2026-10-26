import { MessageCircle, Printer } from "lucide-react";
import {
  formatMoney,
  formatReceiptDate,
  formatReceiptTime,
} from "../utils/format";
import { useProductsContext } from "../utils/context/CreateProductContext";
import { getNames } from "../services/pages/PagesFunctionalities";

const ChargingReceipt = ({ receipt, isVisible, onClose }) => {
  const { branches } = useProductsContext();
  const branchNames = getNames(branches);

  if (!isVisible || !receipt) return null;

  const receiptMessage = [
    "Auntie's Shops - Phone Charging Receipt",
    `Branch: ${branchNames[receipt.branchId] || "Branch"}`,
    `Phone owner code: ${receipt.phoneOwnerCode}`,
    `Owner: ${receipt.customerName}`,
    `Contact: ${receipt.contact}`,
    `Phone: ${receipt.deviceModel}`,
    `Received: ${formatReceiptDate(receipt.receivedAt)} ${formatReceiptTime(receipt.receivedAt)}`,
    `Charging fee: ${formatMoney(receipt.price)}`,
    `Payment status: ${receipt.paidOnArrival ? "Paid at drop-off" : "Unpaid"}`,
    "",
    "Keep the owner code to identify and collect your phone.",
  ].join("\n");
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(receiptMessage)}`;

  return (
    <section className="printable-receipt mx-auto w-full max-w-md p-4">
      <div className="printable-receipt-card w-full rounded-2xl bg-white p-6 shadow-2xl">
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

        <div className="print-hidden flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-header-color px-4 py-2.5 text-sm font-semibold text-white">
            <Printer size={16} aria-hidden="true" />
            Print receipt
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
            <MessageCircle size={16} aria-hidden="true" />
            Share via WhatsApp
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-color px-4 py-2.5 text-sm font-semibold text-header-color">
            Done
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChargingReceipt;
