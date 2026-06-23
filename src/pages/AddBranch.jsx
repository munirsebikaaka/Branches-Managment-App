import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { postData } from "../utils/api";
import { toast } from "react-toastify";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import { useProductsContext } from "../utils/context/CreateProductContext";
import { isAddBranchFormValid } from "../services/form/FormValidations";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import { Menu } from "lucide-react";
import ResponsiveNav from "../components/ResponsiveNav";
import Error from "../components/Error";

const AddBranch = () => {
  const { user } = useAuthContext();
  const { setBranches } = useProductsContext();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAddBranchFormValid(formData, setErrorMessage)) return;

    setLoading(true);

    try {
      const newBranch = {
        branchName: formData.name.trim(),
        branchLocation: formData.location.trim(),
        createdBy: user?.id,
        createdAt: new Date().toISOString(),
      };

      const response = await postData(newBranch, "branches");
      const createdBranch = {
        id: response?.data?.name || Date.now().toString(),
        ...newBranch,
      };

      setBranches((prev) => [createdBranch, ...prev]);
      toast.success("Branch added successfully!");

      setFormData({
        name: "",
        location: "",
      });
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(getFriendlyErrorMessage(err, "general"));
    } finally {
      setLoading(false);
    }
  };

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
        <div className="max-w-4xl mx-auto">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />

          <div className="bg-white rounded-3xl shadow-sm border border-[#e2e8f0] p-8 md:p-12">
            <div className="flex flex-col items-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
                Add New Branch
              </h3>
              <p className="text-[#64748b] mt-3">
                Expand your business by adding a new branch location.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 max-w-lg mx-auto">
              <Input
                label="Branch Name"
                inputConfig={{
                  type: "text",
                  name: "name",
                  value: formData.name,
                  onChange: handleChange,
                  placeholder: "e.g Kasubi Store",
                }}
              />

              <Input
                label="Branch Location"
                inputConfig={{
                  type: "text",
                  name: "location",
                  value: formData.location,
                  onChange: handleChange,
                  placeholder: "e.g Kampala, Uganda",
                }}
              />

              <Error message={errorMessage}>{errorMessage}</Error>
              <div className={!errorMessage && "pt-4"}>
                <Button disabled={loading}>
                  {loading ? "Adding Branch..." : "Add Branch"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddBranch;
