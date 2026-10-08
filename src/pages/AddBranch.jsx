import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { postData } from "../utils/api";
import { toast } from "react-toastify";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import { useProductsContext } from "../utils/context/CreateProductContext";
import {
  createHandleBlur,
  isAddBranchFormValid,
} from "../services/form/FormValidations";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import ResponsiveNav from "../components/ResponsiveNav";
import Error from "../components/Error";
import Blur from "../components/Blur";
import FormsHeader from "../components/FormsHeader";

const inputNames = {
  name: "Branch name",
  location: "Location",
};
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
  const [onBlurErrors, setOnBlurErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = createHandleBlur(inputNames, setOnBlurErrors);

  const isSubmitButtonDissabled =
    formData.name.length < 1 || formData.location.length < 1 || loading;

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
    <div className="flex min-h-screen bg-background font-font-family relative">
      <Blur setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 p-6 md:p-12 md:ml-64">
        <div className="max-w-2xl mx-auto">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />
          <FormsHeader
            header={"Add New Branch"}
            description={
              "Expand your business by adding a new branch location."
            }
          />

          <div className="bg-white rounded-2xl border border-border-color p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Branch Name"
                inputConfig={{
                  type: "text",
                  name: "name",
                  value: formData.name,
                  onChange: handleChange,
                  placeholder: "e.g Kibizi branch",
                  onBlur: handleBlur,
                }}
                error={onBlurErrors.name}
              />

              <Input
                label="Branch Location"
                inputConfig={{
                  type: "text",
                  name: "location",
                  value: formData.location,
                  onChange: handleChange,
                  placeholder: "e.g Kasubi",
                  onBlur: handleBlur,
                }}
                error={onBlurErrors.location}
              />

              <Error message={errorMessage}>{errorMessage}</Error>

              <Button disabled={isSubmitButtonDissabled}>
                {loading ? "Adding Branch..." : "Add Branch"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddBranch;
