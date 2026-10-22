import { Trash2 } from "lucide-react";
import {
  removeSelectedProduct,
  updateSelectedProductForm,
} from "../../services/pages/PagesFunctionalities";
import SaleButton from "../../ui/SaleButton";
import { formatMoney } from "../../utils/format";
import { useMemo } from "react";

const SelectedProductsSales = ({
  selectedProducts,
  setSelectedProducts,
  setSelectedItem,
  setShowUpdateButton,
  setError,
  onChoosePaymentMethod,
  paymentMethod,
}) => {
  const recieptTotal = useMemo(
    () =>
      selectedProducts
        .map((sale) => sale.quantity * sale.price)
        .reduce((sum, item) => sum + item, 0),

    [selectedProducts],
  );

  return (
    <section className="min-w-0 space-y-4 rounded-2xl border border-border-color bg-white p-4 shadow-sm sm:p-6">
      <div>
        <h4 className="text-lg font-bold text-header-color">
          Products in this sale
        </h4>
        <p className="mt-1 text-sm text-header-description">
          Review quantities and totals before continuing.
        </p>
      </div>

      {selectedProducts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-color bg-background p-6 text-center text-sm text-header-description">
          No products added yet.
        </div>
      ) : (
        selectedProducts.map((item, i) => (
          <div
            key={item.productId}
            className="relative flex items-end justify-between gap-2 rounded-xl border border-border-color p-4 text-sm">
            <div className="min-w-0">
              <p className="break-words font-semibold text-header-color">
                {item.productName}
              </p>
              <p className="mt-1 text-xs text-header-description">
                QTY: {item.quantity}
              </p>
              <p className="mt-1 text-xs text-header-description">
                Price each: {formatMoney(+item.price)}
              </p>
              <p className="mt-1 text-xs text-header-description">
                Total price: {formatMoney(item.quantity * item.price)}
              </p>
            </div>

            <SaleButton
              text={"Update"}
              onClick={() =>
                updateSelectedProductForm(
                  item.productId,
                  selectedProducts,
                  setSelectedItem,
                  setShowUpdateButton,
                  setError,
                )
              }
            />
            <button
              type="button"
              onClick={() => removeSelectedProduct(i, setSelectedProducts)}
              aria-label={`Remove ${item.productName}`}
              className="absolute top-0 right-0 rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600">
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </div>
        ))
      )}

      <div className="border-t border-border-color pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-header-description">
            Sale total
          </span>
          <span className="text-xl font-bold text-header-color">
            {formatMoney(recieptTotal)}
          </span>
        </div>
        {paymentMethod && (
          <p className="mt-2 text-right text-xs font-medium text-action-color">
            Payment method selected
          </p>
        )}
        <button
          type="button"
          onClick={onChoosePaymentMethod}
          disabled={selectedProducts.length === 0}
          className="mt-4 w-full rounded-xl bg-action-color px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3730a3] disabled:cursor-not-allowed disabled:opacity-50">
          {paymentMethod ? "Change payment method" : "Choose payment method"}
        </button>
      </div>
    </section>
  );
};
export default SelectedProductsSales;
