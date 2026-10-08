import { useState } from "react";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar";
import ResponsiveNav from "../components/ResponsiveNav";
import Blur from "../components/Blur";
import LoadingPage from "../components/LoadingPage";
import FetchedError from "../components/FefchError";
import Error from "../components/Error";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import { useProductsContext } from "../utils/context/CreateProductContext";
import { postData } from "../utils/api";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import {
  createHandleBlur,
  isPhoneChargingFormValid,
} from "../services/form/FormValidations";
import FormsHeader from "../components/FormsHeader";

const inputNames = {
  customerName: "Name",
  contact: "Contact",
  deviceModel: "Device model",
  price: "Price",
};
const RecordCharging = () => {
  const { user } = useAuthContext();
  const { setChargingData, loading } = useProductsContext();
  const [formData, setFormData] = useState({
    customerName: "",
    contact: "",
    deviceModel: "",
    price: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [onBlurErrors, setOnBlurErrors] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleBlur = createHandleBlur(inputNames, setOnBlurErrors);

  const isSubmitButtonDissabled =
    formData.customerName.length < 1 ||
    formData.contact.length < 1 ||
    formData.deviceModel.length < 1 ||
    formData.price.length < 1 ||
    submitting ||
    loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isPhoneChargingFormValid(formData, setError)) return;
    setSubmitting(true);
    try {
      const record = {
        customerName: formData.customerName.trim(),
        contact: formData.contact.trim(),
        deviceModel: formData.deviceModel.trim(),
        price: +formData.price,
        branchId: user?.branchId,
        receivedAt: new Date().toISOString(),
        createdBy: user?.id,
        status: "at_shop",
      };
      const response = await postData(record, "charging");
      const createdRecord = {
        id: response?.data?.name || Date.now().toString(),
        ...record,
      };
      setChargingData((prev) => [createdRecord, ...prev]);
      setFormData((prev) => ({
        ...prev,
        customerName: "",
        contact: "",
        deviceModel: "",
        price: "",
      }));
      toast.success(`Phone recorded successfully.`);
    } catch (err) {
      setError(getFriendlyErrorMessage(err, "general"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <LoadingPage
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-font-family relative">
      <Blur setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 p-4 md:p-12 md:ml-64">
        <div className="max-w-2xl mx-auto space-y-6">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />
          <FetchedError />

          <FormsHeader
            header={"Record a phone details for charging"}
            description={
              "Get all the requested information for security purposes"
            }
          />

          <div className="bg-white rounded-2xl border border-border-color shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Customer name"
                  inputConfig={{
                    name: "customerName",
                    value: formData.customerName,
                    onChange: handleChange,
                    placeholder: "e.g. munir",
                    onBlur: handleBlur,
                  }}
                  error={onBlurErrors.customerName}
                />
                <Input
                  label="Phone number"
                  inputConfig={{
                    name: "contact",
                    value: formData.contact,
                    onChange: handleChange,
                    placeholder: "e.g. 070XXXXXXX",
                    onBlur: handleBlur,
                  }}
                  error={onBlurErrors.contact}
                />
                <Input
                  label="Device model"
                  inputConfig={{
                    name: "deviceModel",
                    value: formData.deviceModel,
                    onChange: handleChange,
                    placeholder: "e.g. Samsung NOTE10",
                    onBlur: handleBlur,
                  }}
                  error={onBlurErrors.deviceModel}
                />

                <Input
                  label="Charging price (UGX)"
                  inputConfig={{
                    type: "number",
                    name: "price",
                    value: formData.price,
                    onChange: handleChange,
                    placeholder: "500",
                    onBlur: handleBlur,
                  }}
                  error={onBlurErrors.price}
                />
              </div>
              <Error message={error}>{error}</Error>
              <Button disabled={isSubmitButtonDissabled}>
                {submitting ? "Submitting..." : "Submit phone details"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecordCharging;
