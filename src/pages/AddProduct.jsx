import { useState } from "react";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import { useProductsContext } from "../utils/context/CreateProductContext";
import { Sidebar } from "../components/Sidebar";
import { postData } from "../utils/api";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { toast } from "react-toastify";
import {
  createHandleBlur,
  isAddProductsFormValid,
} from "../services/form/FormValidations";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import ResponsiveNav from "../components/ResponsiveNav";
import Error from "../components/Error";
import Blur from "../components/Blur";
import FormsHeader from "../components/FormsHeader";
import { getNames } from "../services/pages/PagesFunctionalities";

const inputNames = {
  name: "Product name",
  category: "Product category",
  buyingPrice: "Buying price",
  sellingPrice: "Selling price",
  quantity: "Product quantity",
};
const AddProduct = () => {
  const { user } = useAuthContext();
  const { branches, setProducts } = useProductsContext();
  const branchNames = getNames(branches);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    buyingPrice: "",
    sellingPrice: "",
    quantity: "",
  });
  const [onBlurErrors, setOnBlurErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = createHandleBlur(inputNames, setOnBlurErrors);

  const isSubmitButtonDissabled =
    formData.name.length < 1 ||
    formData.category.length < 1 ||
    formData.buyingPrice.length < 1 ||
    formData.sellingPrice.length < 1 ||
    formData.quantity.length < 1 ||
    loading;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAddProductsFormValid(formData, setError)) return;

    setLoading(true);
    setError("");

    try {
      const product = {
        ...formData,
        branchId: user?.role === "owner" ? formData.branchId : user?.branchId,
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

      setFormData((prev) => ({
        ...prev,
        name: "",
        category: "",
        buyingPrice: "",
        sellingPrice: "",
        quantity: "",
      }));
    } catch (err) {
      setError(getFriendlyErrorMessage(err, "general"));
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "text-sm font-semibold text-[#475569] mb-1.5 block pl-2.5";

  const inputClass =
    "w-full px-4 py-2.5 bg-white border border-border-color rounded-lg text-header-color text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] placeholder:text-[#94a3b8]";

  return (
    <div className="flex min-h-screen bg-background font-font-family relative">
      <Blur setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 p-6 md:p-12 md:ml-64">
        <div className="max-w-2xl mx-auto">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />

          <FormsHeader
            header={"Add New Product"}
            description={
              "Fill in the details below to restock or add a new item to your branch."
            }
          />

          <div className="bg-white rounded-2xl border border-border-color p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Product Name"
                inputConfig={{
                  type: "text",
                  name: "name",
                  value: formData.name,
                  onChange: handleChange,
                  placeholder: "e.g. iPhone 14 Pro",
                  onBlur: handleBlur,
                }}
                error={onBlurErrors.name}
              />

              <Input
                label="Category"
                inputConfig={{
                  type: "text",
                  name: "category",
                  value: formData.category,
                  onChange: handleChange,
                  placeholder: "e.g. Electronics, Phones, Accessories",
                  onBlur: handleBlur,
                }}
                error={onBlurErrors.category}
              />

              {user?.role === "owner" && (
                <div className="flex flex-col items-start">
                  <label className={labelClass}>Select Branch</label>
                  <select
                    name="branchId"
                    className={inputClass}
                    value={formData.branchId}
                    onChange={handleChange}>
                    <option value="">-- Choose a branch --</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branchNames[branch.id]}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user?.role === "owner" && (
                  <Input
                    label="Buy Price"
                    inputConfig={{
                      type: "number",
                      name: "buyingPrice",
                      value: formData.buyingPrice,
                      onChange: handleChange,
                      placeholder: "0.00",
                      onBlur: handleBlur,
                    }}
                    error={onBlurErrors.buyingPrice}
                  />
                )}

                <Input
                  label="Sell Price"
                  inputConfig={{
                    type: "number",
                    name: "sellingPrice",
                    value: formData.sellingPrice,
                    onChange: handleChange,
                    placeholder: "0.00",
                    onBlur: handleBlur,
                  }}
                  error={onBlurErrors.sellingPrice}
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
                  onBlur: handleBlur,
                }}
                error={onBlurErrors.quantity}
              />

              <Error message={error}>{error}</Error>

              <Button disabled={isSubmitButtonDissabled}>
                {loading ? "Adding Product..." : "Add Product"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;
