import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { deleteData, postData, updateData } from "../utils/api";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import { useProductsContext } from "../utils/context/CreateProductContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { toast } from "react-toastify";
import { isRecordSaleFormValid } from "../services/form/FormValidations";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import ResponsiveNav from "../components/ResponsiveNav";
import LoadingPage from "../components/LoadingPage";
import FetchedError from "../components/FefchError";
import Error from "../components/Error";

const RecordSale = () => {
  const { user } = useAuthContext();

  const { products, loading, setProducts, setSalesData } = useProductsContext();

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeBranchId = user?.branchId;

  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    price: "",
  });

  const salesProducts = useMemo(() => {
    return products.filter((product) => product.branchId === activeBranchId);
  }, [products, activeBranchId]);

  const selectedProduct = salesProducts.find(
    (p) => p.id === formData.productId,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "price"
          ? value === ""
            ? ""
            : +value
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isRecordSaleFormValid(formData, selectedProduct, setError)) return;

    if (!selectedProduct) {
      setError("Selected product not found.");
      return;
    }

    try {
      setSubmitting(true);

      const total = formData.quantity * formData.price;
      const newQuantity = selectedProduct.quantity - formData.quantity;

      const sale = {
        productId: formData.productId,
        productName: selectedProduct.name,
        quantity: formData.quantity,
        price: formData.price,
        total,
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

      if (newQuantity <= 0) {
        await deleteData("products", selectedProduct.id);
        setProducts((prev) =>
          prev.filter((item) => item.id !== selectedProduct.id),
        );
        toast.warning(`${selectedProduct.name} is now out of stock!`);
      } else {
        await updateData("products", selectedProduct.id, {
          quantity: newQuantity,
        });
        setProducts((prev) =>
          prev.map((item) =>
            item.id === selectedProduct.id
              ? { ...item, quantity: newQuantity }
              : item,
          ),
        );
      }

      toast.success("Sale recorded successfully!");
      navigate(`/dashboard?branchId=${activeBranchId}`);
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

  const labelClass = "block text-sm font-semibold text-[#475569] mb-1.5";
  const inputClass =
    "w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[#0f172a] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]";

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-['Outfit',_sans-serif] relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 p-6 md:p-12 md:ml-64 transition-all duration-300">
        <div className="max-w-2xl mx-auto">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />
          <FetchedError />
          <div className="flex flex-col items-center mb-8">
            <h3 className="text-3xl font-bold text-[#0f172a]">
              Record New Sale
            </h3>
            <p className="text-[#64748b] mt-1">
              Select a product and enter the transaction details.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className={labelClass}>Select Product</label>
                <select
                  name="productId"
                  className={inputClass}
                  value={formData.productId}
                  onChange={handleChange}>
                  <option value="">-- Choose from inventory --</option>
                  {salesProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Available: {product.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={"Quantity Sold"}
                  inputConfig={{
                    type: "number",
                    name: "quantity",
                    value: formData.quantity,
                    onChange: handleChange,
                    placeholder: "0",
                  }}
                />
                <Input
                  label={"Price Per Unit"}
                  inputConfig={{
                    type: "number",
                    name: "price",
                    value: formData.price,
                    onChange: handleChange,
                    placeholder: "0.00",
                    step: "0.01",
                  }}
                />
              </div>
              <Error message={error}>{error}</Error>
              <Button disabled={loading || submitting}>
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
