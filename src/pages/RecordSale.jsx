import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { postData } from "../utils/api";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import { useProductsContext } from "../utils/context/CreateProductContext";
import Input from "../ui/Input";
import { toast } from "react-toastify";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import ResponsiveNav from "../components/ResponsiveNav";
import LoadingPage from "../components/LoadingPage";
import FetchedError from "../components/FefchError";
import Error from "../components/Error";
import Blur from "../components/Blur";
import SaleButton from "../ui/SaleButton";
import {
  handleAddProductToSale,
  saleItems,
  updateDatabaseAndUi,
  updateSelectedProduct,
} from "../services/pages/PagesFunctionalities";
import FormsHeader from "../components/FormsHeader";
import { createHandleBlur } from "../services/form/FormValidations";
import SelectedProductsSales from "../components/products/SelectedProductsSales";
import ReceiptPreview from "../components/ReceiptPreview";
import { formatMoney } from "../utils/format";
const inputNames = {
  productId: "ProductId",
  quantity: "Quantity",
  price: "Price",
};
const RecordSale = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { products, loading, setProducts, setSalesData } = useProductsContext();

  const [error, setError] = useState("");
  const [onBlurErrors, setOnBlurErrors] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  const activeBranchId = user?.branchId;

  const [selectedItem, setSelectedItem] = useState({
    productId: "",
    quantity: "",
    price: "",
  });
  const handleBlur = createHandleBlur(inputNames, setOnBlurErrors);

  const [selectedProducts, setSelectedProducts] = useState(
    () => location.state?.selectedProducts || [],
  );
  const [paymentMethod, setPaymentMethod] = useState(
    () => location.state?.paymentMethod || "",
  );
  const [calculatedQuantity, setCalculatedQuantity] = useState(0);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const salesProducts = useMemo(() => {
    return products.filter((product) => product.branchId === activeBranchId);
  }, [products, activeBranchId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelectedItem((prev) => {
      if (name === "productId") {
        const product = salesProducts.find((p) => p.id === value);
        const selectedQuantity = selectedProducts
          .filter((item) => item.productId === value)
          .reduce((sum, item) => sum + item.quantity, 0);

        setCalculatedQuantity(product?.quantity - selectedQuantity);

        return {
          ...prev,
          productId: value,
          price: product?.sellingPrice,
          quantity: "",
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const isProvidedQuantitySuported = useMemo(() => {
    const selectedProduct = salesProducts.find(
      (p) => p.id === selectedItem.productId,
    );

    if (selectedItem.quantity <= selectedProduct?.quantity) {
      return true;
    } else {
      return false;
    }
  }, [salesProducts, selectedItem]);

  const handleAddToSale = () => {
    handleAddProductToSale(
      selectedItem,
      salesProducts,
      setSelectedProducts,
      setSelectedItem,
      setError,
      selectedProducts,
      setCalculatedQuantity,
    );
  };

  const handleUpdateSelectedProduct = () => {
    updateSelectedProduct(
      setSelectedProducts,
      selectedItem,
      setSelectedItem,
      setShowUpdateButton,
    );
  };

  const totalPricePerSelectedItem = formatMoney(
    selectedItem?.quantity * selectedItem?.price,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedProducts.length) {
      setError("Add at least one product to the sale.");
      return;
    }

    if (!paymentMethod) {
      navigate("/choose-payment-method", {
        state: { selectedProducts },
      });
      return;
    }

    try {
      const items = saleItems(selectedProducts, salesProducts);
      const saleTotal = items.reduce((sum, item) => sum + item.total, 0);

      const sale = {
        items,
        total: saleTotal,
        paymentMethod,
        branchId: activeBranchId,
        createdBy: user?.id,
        createdAt: new Date().toISOString(),
        saleRecieptNumber: Math.floor(Math.random() * 100000),
      };

      const saleResponse = await postData(sale, "sales");
      const createdSale = {
        id: saleResponse?.data?.name || Date.now().toString(),
        ...sale,
      };
      setSelectedReceipt(createdSale);
      setSalesData((prev) => [createdSale, ...prev]);
      await updateDatabaseAndUi(salesProducts, setProducts, items);

      toast.success("Sale recorded successfully!");
      setSelectedProducts([]);
      setPaymentMethod("");
    } catch (err) {
      setError(getFriendlyErrorMessage(err, "general"));
    }
  };

  if (loading) {
    return (
      <LoadingPage
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    );
  }

  const labelClass = "mb-1.5 block text-sm font-semibold text-[#475569]";
  const inputClass =
    "w-full rounded-xl border border-border-color bg-white px-4 py-3 text-sm text-header-color transition-all focus:border-action-color focus:outline-none focus:ring-2 focus:ring-action-color/20";

  return (
    <div className="relative flex min-h-screen bg-background font-font-family">
      <Blur setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:ml-64 lg:p-10">
        <div className="mx-auto max-w-6xl">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />
          <FetchedError />

          <FormsHeader
            header={" Record New Sale"}
            description={"Select a product and enter the transaction details."}
          />

          <form
            onSubmit={handleSubmit}
            className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
            <div className="min-w-0 rounded-2xl border border-border-color bg-white p-4 shadow-sm sm:p-6">
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Select Product</label>
                  <select
                    name="productId"
                    className={inputClass}
                    value={selectedItem.productId}
                    onChange={handleChange}>
                    <option value="">-- Choose from inventory --</option>
                    {salesProducts.map((product) => {
                      const selectedQuantity = selectedProducts
                        .filter((item) => item.productId === product.id)
                        .reduce((sum, item) => sum + item.quantity, 0);
                      const availableQuantity =
                        product.id === selectedItem.productId
                          ? calculatedQuantity
                          : product.quantity - selectedQuantity;

                      return (
                        <option key={product.id} value={product.id}>
                          {product.name} (Available: {availableQuantity})
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label={"Quantity Sold"}
                    inputConfig={{
                      type: "number",
                      name: "quantity",
                      value: selectedItem.quantity,
                      onChange: handleChange,
                      placeholder: "0",
                      onBlur: handleBlur,
                    }}
                    error={onBlurErrors.quantity}
                  />
                  <Input
                    label={"Selling Price"}
                    inputConfig={{
                      type: "number",
                      name: "price",
                      value: selectedItem.price,
                      onChange: handleChange,
                      placeholder: "0.00",
                      onBlur: handleBlur,
                    }}
                    error={onBlurErrors.price}
                  />
                </div>
                {selectedItem.price > 0 && (
                  <p
                    className={`text-sm font-medium text-${isProvidedQuantitySuported ? "header-description" : "error-color"}`}>
                    {isProvidedQuantitySuported
                      ? `Item total: ${totalPricePerSelectedItem}`
                      : "The provided quantity is higher than the quantity in stock."}
                  </p>
                )}

                <Error message={error}>{error}</Error>

                {!showUpdateButton ? (
                  <SaleButton
                    onClick={handleAddToSale}
                    text={"+ Add Product to Sale"}
                  />
                ) : (
                  <SaleButton
                    onClick={handleUpdateSelectedProduct}
                    text={"Confirm Product Update"}
                  />
                )}
              </div>
            </div>

            <SelectedProductsSales
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              setSelectedItem={setSelectedItem}
              setShowUpdateButton={setShowUpdateButton}
              setError={setError}
              paymentMethod={paymentMethod}
              onChoosePaymentMethod={() => {
                setError("");
                navigate("/choose-payment-method", {
                  state: { selectedProducts, paymentMethod },
                });
              }}
            />
          </form>
        </div>
      </main>

      {selectedReceipt && (
        <ReceiptPreview
          sale={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};

export default RecordSale;
