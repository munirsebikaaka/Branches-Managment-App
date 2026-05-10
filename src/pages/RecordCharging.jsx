import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import { Sidebar } from "../components/Sidebar";
import { postData } from "../utils/api";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { toast } from "react-toastify";
import { isRecordChargingFormValid } from "../services/form/FormValidations";
import { Menu } from "lucide-react";
import ResponsiveNav from "../components/ResponsiveNav";

const RecordCharging = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

  const [formData, setFormData] = useState({
    phonesCharged: "",
    pricePerPhone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isRecordChargingFormValid(formData, setError)) return;

    setLoading(true);
    setError("");

    try {
      const total = formData.phonesCharged * formData.pricePerPhone;

      const charging = {
        phonesCharged: formData.phonesCharged,
        pricePerPhone: formData.pricePerPhone,
        total,
        branchId: user?.branchId,
        createdBy: user?.id,
        createdAt: new Date().toISOString(),
      };

      await postData(charging, "charging");

      toast.success("Charging activity recorded successfully!");

      setFormData({
        phonesCharged: "",
        pricePerPhone: "",
      });

      navigate("/dashboard");
    } catch (err) {
      if (err.message) {
        setError("Failed to record charging activity. Please try again.");
      }
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
        <div className="max-w-2xl mx-auto">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />

          <div className="flex flex-col items-center mb-8">
            <h3 className="text-3xl font-bold text-[#0f172a]">
              Record Phone Charging
            </h3>
            <p className="text-[#64748b] mt-1">
              Log the daily charging services provided at your branch.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="bg-[#f8fafc] px-8 py-4 border-b border-[#e2e8f0]">
              <h2 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
                Service Details
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={"Phones Charged"}
                  inputConfig={{
                    type: "number",
                    name: "phonesCharged",
                    value: formData.phonesCharged,
                    onChange: handleChange,
                    placeholder: "e.g., 10",
                    required: true,
                  }}
                />

                <Input
                  label={"Price Per Phone ($)"}
                  inputConfig={{
                    type: "number",
                    name: "pricePerPhone",
                    value: formData.pricePerPhone,
                    onChange: handleChange,
                    placeholder: "0.00",
                    step: "0.01",
                    required: true,
                  }}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <Button disabled={loading}>
                {loading ? "Saving Activity..." : "Record Charging"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecordCharging;
