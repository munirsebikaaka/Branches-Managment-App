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
import ChargingReceipt from "../assets/ChargingReceipt";

const inputNames = {
  customerName: "Name",
  contact: "Contact",
  deviceModel: "Device model",
  price: "Price",
};
const RecordCharging = () => {
  const { user } = useAuthContext();
  const { chargingData, setChargingData, loading } = useProductsContext();
  const [formData, setFormData] = useState({
    customerName: "",
    contact: "",
    deviceModel: "",
    price: "",
    paidOnArrival: false,
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [onBlurErrors, setOnBlurErrors] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);

  const handleCloseReceipt = () => {
    setIsReceiptVisible(false);
    setReceipt(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue =
      name === "contact" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
  };
  const handleBlur = createHandleBlur(inputNames, setOnBlurErrors);

  const isSubmitButtonDissabled =
    formData.customerName.length < 1 ||
    !/^\d{4,10}$/.test(formData.contact) ||
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
      const usedOwnerCodes = new Set(
        chargingData.map((phone) => String(phone.phoneOwnerCode)),
      );
      let phoneOwnerCode;
      do {
        phoneOwnerCode = Math.floor(100000 + Math.random() * 900000);
      } while (usedOwnerCodes.has(String(phoneOwnerCode)));

      const record = {
        customerName: formData.customerName.trim(),
        contact: formData.contact.trim(),
        deviceModel: formData.deviceModel.trim(),
        price: +formData.price,
        paidOnArrival: formData.paidOnArrival,
        branchId: user?.branchId,
        receivedAt: new Date().toISOString(),
        createdBy: user?.id,
        phoneOwnerCode,
        status: "at_shop",
      };
      const response = await postData(record, "charging");
      const createdRecord = {
        id: response?.data?.name || Date.now().toString(),
        ...record,
      };
      setChargingData((prev) => [createdRecord, ...prev]);
      setReceipt(createdRecord);
      setIsReceiptVisible(true);
      setFormData((prev) => ({
        ...prev,
        customerName: "",
        contact: "",
        deviceModel: "",
        price: "",
        paidOnArrival: false,
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
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:ml-64 lg:p-10">
        <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />
        {isReceiptVisible && receipt ? (
          <ChargingReceipt
            receipt={receipt}
            isVisible={isReceiptVisible}
            onClose={handleCloseReceipt}
          />
        ) : (
          <div className="mx-auto max-w-2xl space-y-6">
          <FetchedError />

          <FormsHeader
            header={"Record a phone details for charging"}
            description={
              "Get all the requested information for security purposes"
            }
          />

          <div className="overflow-hidden rounded-2xl border border-border-color bg-white shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-8">
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
                    type: "tel",
                    inputMode: "numeric",
                    value: formData.contact,
                    onChange: handleChange,
                    placeholder: "e.g. 0701234567",
                    minLength: 4,
                    maxLength: 10,
                    pattern: "[0-9]{4,10}",
                    required: true,
                    onBlur: handleBlur,
                  }}
                  error={onBlurErrors.contact}
                />
                <p className="-mt-4 text-xs text-header-description md:col-span-2">
                  Enter 4 to 10 digits.
                </p>
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
              <label className="flex items-center gap-3 rounded-xl border border-border-color p-4 text-sm text-header-color">
                <input
                  type="checkbox"
                  name="paidOnArrival"
                  checked={formData.paidOnArrival}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      paidOnArrival: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-action-color"
                />
                Customer paid the charging fee when dropping off the phone
              </label>
              <Error message={error}>{error}</Error>
              <Button disabled={isSubmitButtonDissabled}>
                {submitting ? "Submitting..." : "Submit phone details"}
              </Button>
            </form>
          </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RecordCharging;
