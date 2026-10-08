import { useState, useMemo } from "react";
import { Sidebar } from "../components/Sidebar";
import { postData } from "../utils/api";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import { useProductsContext } from "../utils/context/CreateProductContext";
import Button from "../ui/Button";
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
} from "../services/pages/PagesFunctionalities";
import FormsHeader from "../components/FormsHeader";
import { createHandleBlur } from "../services/form/FormValidations";
import SelectedProductsSales from "../components/products/SelectedProductsSales";
const inputNames = {
  productId: "ProductId",
  quantity: "Quantity",
  price: "Price",
};
const RecordSale = () => {
  const { user } = useAuthContext();

  const { products, loading, setProducts, setSalesData } = useProductsContext();

  const [error, setError] = useState("");
  const [onBlurErrors, setOnBlurErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeBranchId = user?.branchId;

  const [selectedItem, setSelectedItem] = useState({
    productId: "",
    quantity: "",
    price: "",
  });
  const handleBlur = createHandleBlur(inputNames, setOnBlurErrors);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [calculatedQuantity, setCalculatedQuantity] = useState(0);

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

  const isSubmitButtonDissabled =
    selectedProducts.length === 0 || loading || submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedProducts.length) {
      setError("Add at least one product to the sale.");
      return;
    }

    try {
      setSubmitting(true);

      const items = saleItems(selectedProducts, salesProducts);
      const saleTotal = items.reduce((sum, item) => sum + item.total, 0);

      const sale = {
        items,
        total: saleTotal,
        branchId: activeBranchId,
        createdBy: user?.id,
        createdAt: new Date().toISOString(),
      };

      const saleResponse = await postData(sale, "sales");
      const createdSale = {
        id: saleResponse?.data?.name || Date.now().toString(),
        ...sale,
      };

      setSalesData((prev) => [createdSale, ...prev]);
      await updateDatabaseAndUi(salesProducts, setProducts, items);

      toast.success("Sale recorded successfully!");
      setSelectedProducts([]);
    } catch (err) {
      setError(getFriendlyErrorMessage(err, "general"));
    } finally {
      setSubmitting(false);
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

  const labelClass = "block text-sm font-semibold text-app-text-soft mb-1.5";
  const inputClass =
    "w-full px-4 py-2.5 bg-app-surface border border-border-color rounded-lg text-app-text text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary";

  return (
    <div className="flex min-h-screen bg-app-bg font-font-family relative">
      <Blur setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 p-6 md:p-12 md:ml-64">
        <div className="max-w-2xl mx-auto">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />
          <FetchedError />

          <FormsHeader
            header={" Record New Sale"}
            description={"Select a product and enter the transaction details."}
          />
          <div className="bg-app-surface rounded-2xl border border-border-color">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <SaleButton
                  onClick={handleAddToSale}
                  text={"+ Add Product to Sale"}
                />
              </div>

              <SelectedProductsSales
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
              />

              <Error message={error}>{error}</Error>

              <Button disabled={isSubmitButtonDissabled}>
                {submitting ? "Processing..." : "Complete Sale"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecordSale;
