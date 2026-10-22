import { useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import ResponsiveNav from "../components/ResponsiveNav";
import Blur from "../components/Blur";
import FetchedError from "../components/FefchError";
import FormsHeader from "../components/FormsHeader";
import { formatMoney } from "../utils/format";
import SaleButton from "../ui/SaleButton";

const paymentMethods = [
  {
    id: "mtn_mobile_money",
    name: "MTN Mobile Money",
    description: "Customer pays using MTN MoMo.",
  },
  {
    id: "airtel_money",
    name: "Airtel Money",
    description: "Customer pays using Airtel Money.",
  },
  {
    id: "cash",
    name: "Cash",
    description: "Customer pays with cash in person.",
  },
];

const ChoosePaymentMethod = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProducts = location.state?.selectedProducts;
  const [paymentMethod, setPaymentMethod] = useState(
    location.state?.paymentMethod,
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const saleTotal = useMemo(
    () =>
      selectedProducts?.reduce(
        (total, product) => total + product.quantity * product.price,
        0,
      ),
    [selectedProducts],
  );

  const isSelected = (method) => paymentMethod === method.id;

  return (
    <div className="relative flex min-h-screen bg-background font-font-family">
      <Blur setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:ml-64 lg:p-10">
        <div className="mx-auto max-w-3xl">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />
          <FetchedError />

          <button
            onClick={() => navigate("/record-sale")}
            className="inline-flex items-center gap-1 rounded-lg py-2 pr-3 text-sm font-semibold text-header-description transition-colors hover:text-header-color">
            <ChevronLeft size={18} />
            Back to sale
          </button>

          <FormsHeader
            header="Choose a payment method"
            description="Select how the customer paid for this sale."
          />

          <section className="rounded-2xl border border-border-color bg-white p-4 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4 rounded-xl bg-background p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-header-description">
                  Amount due
                </p>
                <p className="mt-1 text-md font-semibold text-header-color sm:text-xl">
                  {formatMoney(saleTotal)}
                </p>
              </div>
              <span className="text-xs font-semibold text-action-color">
                {selectedProducts.length} products
              </span>
            </div>

            <div className="space-y-3">
              {paymentMethods.map((method) => {
                return (
                  <label
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-2 transition-colors sm:gap-4 ${
                      isSelected(method.id)
                        ? "border-action-color bg-indigo-50/60"
                        : "border-border-color hover:border-slate-300"
                    }`}>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-header-color">
                        {method.name}
                      </span>
                      <span className="mt-1 block text-xs text-header-description sm:text-sm">
                        {method.description}
                      </span>
                    </span>
                    {isSelected(method.id) && (
                      <CheckCircle2 size={20} className="text-action-color" />
                    )}
                  </label>
                );
              })}
            </div>

            <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
              Confirm MTN MoMo or Airtel Money payments with the provider before
              recording the sale. This selection records the method; it does not
              initiate a mobile-money charge.
            </p>
            <SaleButton text={"Continue with selected method"} onClick={""} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default ChoosePaymentMethod;
