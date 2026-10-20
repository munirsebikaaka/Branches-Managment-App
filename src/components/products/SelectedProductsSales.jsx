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
}) => {
  const recieptTotal = useMemo(
    () =>
      selectedProducts
        .map((sale) => sale.quantity * sale.price)
        .reduce((sum, item) => sum + item, 0),

    [selectedProducts],
  );

  console.log(recieptTotal);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-app-text">
        Products in this sale
      </h4>

      {selectedProducts.length === 0 ? (
        <div className="text-sm text-app-text-muted">
          No products added yet.
        </div>
      ) : (
        selectedProducts.map((item, i) => (
          <div
            key={item.productId}
            className="flex items-center justify-between rounded-xl border border-border-color px-3 py-2 text-sm">
            <div>
              <p className="font-medium text-header-color">
                {item.productName}
              </p>
              <p className="text-header-description">
                Quantity: {item.quantity}; Each at:
                {formatMoney(+item.price)}
              </p>
            </div>

            <p>Total:{formatMoney(item.quantity * item.price)}</p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => removeSelectedProduct(i, setSelectedProducts)}
                className="text-xs text-red-500 font-medium hover:text-red-600">
                <Trash2 size={16} />
              </button>

              <SaleButton
                text={"Update"}
                onClick={() =>
                  updateSelectedProductForm(
                    item.productId,
                    selectedProducts,
                    setSelectedItem,
                    setShowUpdateButton,
                  )
                }
              />
            </div>
          </div>
        ))
      )}

      <h2>Reciept total amount{formatMoney(recieptTotal)}</h2>
    </div>
  );
};
export default SelectedProductsSales;
