import { formatMoney, formatReceiptDate } from "../utils/format";

const ChargingReceipt = ({ receipt, setReceipt, printReceipt }) => {
  return (
    <>
      {receipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#4f46e5]">
                  Charging ticket
                </p>
                <h2 className="text-2xl font-bold text-[#0f172a] mt-1">
                  {receipt.chargingNumber}
                </h2>
              </div>
              <button
                onClick={() => setReceipt(null)}
                className="text-[#64748b]">
                Close
              </button>
            </div>
            <div className="border-y border-dashed border-[#cbd5e1] my-5 py-4 space-y-2 text-sm">
              <p>
                <b>Customer:</b> {receipt.customerName}
              </p>
              <p>
                <b>Phone:</b> {receipt.deviceModel}
              </p>
              <p>
                <b>Received:</b> {formatReceiptDate(receipt.receivedAt)}
              </p>
              <p>
                <b>Charging fee:</b> {formatMoney(receipt.price)}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => printReceipt(receipt)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0f172a] text-white text-sm font-semibold">
                <Printer size={16} /> Print ticket
              </button>
              <button
                onClick={() => setReceipt(null)}
                className="px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-sm font-semibold">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ChargingReceipt;
