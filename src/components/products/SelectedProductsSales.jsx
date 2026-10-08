import { removeSelectedProduct } from "../../services/pages/PagesFunctionalities";

const SelectedProductsSales = ({ selectedProducts, setSelectedProducts }) => {
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
                Quantity: {item.quantity}; Selling Price: UGX {+item.price}
              </p>
            </div>

            <button
              onClick={() => removeSelectedProduct(i, setSelectedProducts)}
              className="text-xs text-red-500 font-medium hover:text-red-600">
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};
export default SelectedProductsSales;
