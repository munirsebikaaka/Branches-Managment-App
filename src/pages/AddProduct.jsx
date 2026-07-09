import { useState } from "react";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import { useProductsContext } from "../utils/context/CreateProductContext";
import { Sidebar } from "../components/Sidebar";
import { postData } from "../utils/api";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { toast } from "react-toastify";
import { isAddProductsFormValid } from "../services/form/FormValidations";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import ResponsiveNav from "../components/ResponsiveNav";
import Error from "../components/Error";

const CATEGORIES = [
  { value: "electronics", label: "Electronics" },
  { value: "phones", label: "Phones" },
  { value: "accessories", label: "Accessories" },
  { value: "other", label: "Other" },
];

const INITIAL_FORM_STATE = {
  name: "",
  category: "electronics",
  buyingPrice: "",
  sellingPrice: "",
  quantity: "",
};

const AddProduct = () => {
  const { user } = useAuthContext();
  const { setProducts } = useProductsContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: ["quantity", "buyingPrice", "sellingPrice"].includes(name)
        ? value === ""
          ? ""
          : +value
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAddProductsFormValid(formData, setError)) return;

    setLoading(true);
    setError("");

    try {
      const product = {
        ...formData,
        branchId: user?.branchId,
        createdBy: user?.id,
        createdAt: new Date().toISOString(),
      };

      const response = await postData(product, "products");

      const createdProduct = {
        id: response?.data?.name || Date.now().toString(),
        ...product,
      };

      setProducts((prev) => [createdProduct, ...prev]);

      toast.success("Product added successfully!");

      setFormData(INITIAL_FORM_STATE);
    } catch (err) {
      setError(getFriendlyErrorMessage(err, "general"));
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "text-sm font-semibold text-[#475569] mb-1.5 block pl-2.5";

  const inputClass =
    "w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[#0f172a] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] placeholder:text-[#94a3b8]";

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

          <div className="flex flex-col items-center mb-8">
            <h3 className="text-3xl font-bold text-[#0f172a]">
              Add New Product
            </h3>

            <p className="text-[#64748b] mt-1 text-center">
              Fill in the details below to restock or add a new item to your
              branch.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <Input
                label="Product Name"
                inputConfig={{
                  type: "text",
                  name: "name",
                  value: formData.name,
                  onChange: handleChange,
                  placeholder: "e.g. iPhone 12 Pro",
                }}
              />

              <div className="flex flex-col items-start">
                <label className={labelClass}>Category</label>

                <select
                  name="category"
                  className={inputClass}
                  value={formData.category}
                  onChange={handleChange}>
                  {CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Buy Price"
                  inputConfig={{
                    type: "number",
                    name: "buyingPrice",
                    value: formData.buyingPrice,
                    onChange: handleChange,
                    placeholder: "0.00",
                    step: "0.01",
                  }}
                />

                <Input
                  label="Sell Price"
                  inputConfig={{
                    type: "number",
                    name: "sellingPrice",
                    value: formData.sellingPrice,
                    onChange: handleChange,
                    placeholder: "0.00",
                    step: "0.01",
                  }}
                />
              </div>

              <Input
                label="Quantity in Stock"
                inputConfig={{
                  type: "number",
                  name: "quantity",
                  value: formData.quantity,
                  onChange: handleChange,
                  placeholder: "Enter amount",
                }}
              />

              <Error message={error}>{error}</Error>

              <Button disabled={loading}>
                {loading ? "Registering Product..." : "Confirm & Add Product"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;
