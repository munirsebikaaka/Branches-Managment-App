import { Minus, Plus, Trash2 } from "lucide-react";
import { removeSelectedProduct } from "../../services/pages/PagesFunctionalities";
import SaleButton from "../../ui/SaleButton";
import { formatMoney } from "../../utils/format";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../utils/context/CreateAuthContext";
import { useProductsContext } from "../../utils/context/CreateProductContext";
import { useSaleContext } from "../../utils/context/CreateSaleContext";
import Blur from "../Blur";
import { Sidebar } from "../Sidebar";
import FetchedError from "../FefchError";
import FormsHeader from "../FormsHeader";

const SelectedProductsSales = () => {
  const {
    selectedProducts,
    setSelectedProducts,
    setSelectedItem,
    setCalculatedQuantity,
    setShowUpdateButton,
    setError,
  } = useSaleContext();
  const { products } = useProductsContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState("");
  const salesProducts = useMemo(
    () => products.filter((product) => product.branchId === user?.branchId),
    [products, user?.branchId],
  );

  const handleCartQuantityChange = (productId, change) => {
    const product = salesProducts.find((item) => item.id === productId);
    if (!product) return;

    setSelectedProducts((prev) =>
      prev.flatMap((item) => {
        if (item.productId !== productId) return item;
        const quantity = +item.quantity + change;
        if (quantity > +product.quantity) return item;
        return quantity > 0 ? [{ ...item, quantity }] : [];
      }),
    );
  };

  const handleEditCartProduct = (productId) => {
    const item = selectedProducts.find(
      (product) => product.productId === productId,
    );
    const product = salesProducts.find((entry) => entry.id === productId);
    if (!item || !product) return;

    const otherSelectedQuantity = selectedProducts
      .filter((entry) => entry.productId !== productId)
      .reduce((sum, entry) => sum + +entry.quantity, 0);

    setSelectedItem({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    });
    setCalculatedQuantity(+product.quantity - otherSelectedQuantity);
    setShowUpdateButton(true);
    setError("");
    navigate("/record-sale", { state: { returnToCartAfterUpdate: true } });
  };

  const recieptTotal = useMemo(
    () =>
      selectedProducts
        .map((sale) => sale.quantity * sale.price)
        .reduce((sum, item) => sum + item, 0),

    [selectedProducts],
  );

  return (
    <div className="relative flex min-h-screen bg-background font-font-family">
      <Blur setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:ml-64 lg:p-10">
        <FetchedError />
        <FormsHeader
          header={"Products in this sale"}
          description={"Review quantities and totals before continuing."}
        />

        <div className="rounded-2xl border border-border-color bg-white p-4 space-y-4">
          {selectedProducts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border-color bg-background p-6 text-center text-sm text-header-description">
              No products added yet.
            </div>
          ) : (
            selectedProducts.map((item, i) => (
              <div
                key={item.productId}
                className="relative flex items-end border  border-border-color rounded-xl p-2">
                <div className="min-w-0 flex-1">
                  <p className="capitalize font-semibold text-header-color">
                    {item.productName}
                  </p>
                  <p className="mt-1 text-xs text-header-description">
                    Price each: {formatMoney(+item.price)}
                  </p>
                  <p className="mt-1 text-xs text-header-description">
                    Total price: {formatMoney(item.quantity * item.price)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        handleCartQuantityChange(item.productId, -1)
                      }
                      className="rounded-md p-1 text-header-description transition-colors bg-slate-100">
                      <Minus size={16} />
                    </button>
                    <span className="text-center text-header-description">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleCartQuantityChange(item.productId, 1)
                      }
                      disabled={
                        +item.quantity >=
                        +(
                          salesProducts.find(
                            (product) => product.id === item.productId,
                          )?.quantity || 0
                        )
                      }
                      className="rounded-md p-1 text-header-description transition-colors bg-slate-100 disabled:opacity-40">
                      <Plus size={16} />
                    </button>
                  </div>
                  <SaleButton
                    text={"Edit price"}
                    onClick={() => handleEditCartProduct(item.productId)}
                  />
                </div>

                <button
                  onClick={() => removeSelectedProduct(i, setSelectedProducts)}
                  aria-label={`Remove ${item.productName}`}
                  className="absolute top-1 right-1 rounded-lg p-1 text-error-color transition-colors hover:bg-red-50 hover:text-red-600">
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
              <span className="text-xl font-semibold text-header-color">
                {formatMoney(recieptTotal)}
              </span>
            </div>

            <button
              onClick={() =>
                navigate("/choose-payment-method", {
                  state: { selectedProducts },
                })
              }
              disabled={selectedProducts.length === 0}
              className="mt-4 w-full rounded-xl bg-action-color px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3730a3] disabled:cursor-not-allowed disabled:opacity-50">
              Choose payment method
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
export default SelectedProductsSales;
