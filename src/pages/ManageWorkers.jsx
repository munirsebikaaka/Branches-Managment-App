import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { toast } from "react-toastify";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import { useProductsContext } from "../utils/context/CreateProductContext";
import { isManageWorkersFormValid } from "../services/form/FormValidations";
import { Menu } from "lucide-react";
import ResponsiveNav from "../components/ResponsiveNav";
import NoBranches from "../components/NoBranchesMessage";

export const ManageWorkers = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    branchId: "",
    workerId: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { registerWorker, error } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState("");
  const { branches } = useProductsContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isManageWorkersFormValid(formData, setErrorMessage)) return;
    setLoading(true);

    try {
      await registerWorker(
        formData.email,
        formData.password,
        formData.name,
        formData.branchId,
        "worker",
        formData.workerId,
      );

      toast.success("Worker registered successfully");

      setFormData({
        email: "",
        password: "",
        name: "",
        branchId: "",
        workerId: "",
      });
      setErrorMessage("");
    } catch (err) {
      if (err.message) {
        setErrorMessage("Failed to register worker");
      }
    } finally {
      setLoading(false);
    }
  };

  const isBranchesCreateAlready = branches?.length > 0;

  if (!isBranchesCreateAlready) return <NoBranches />;

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
              Manage Workers
            </h3>
            <p className="text-[#64748b] mt-1">
              Add new workers and assign them to specific branches.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="bg-[#f8fafc] px-8 py-4 border-b border-[#e2e8f0]">
              <h2 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
                Worker Registration Form
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={"Full Name"}
                  inputConfig={{
                    type: "text",
                    name: "name",
                    value: formData.name,
                    onChange: handleChange,
                    placeholder: "John Doe",
                    required: true,
                  }}
                />
                <Input
                  label={"Email Address"}
                  inputConfig={{
                    type: "email",
                    name: "email",
                    value: formData.email,
                    onChange: handleChange,
                    placeholder: "test@gmail.com",
                    required: true,
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={"Worker ID / Staff Code"}
                  inputConfig={{
                    type: "text",
                    name: "workerId",
                    value: formData.workerId,
                    onChange: handleChange,
                    placeholder: "W-1002",
                    required: true,
                  }}
                />

                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">
                    Assign to Branch
                  </label>
                  <select
                    name="branchId"
                    value={formData.branchId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[#0f172a] text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all"
                    required>
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#f1f5f9]">
                <Input
                  label={"Password"}
                  inputConfig={{
                    type: "password",
                    name: "password",
                    value: formData.password,
                    onChange: handleChange,
                    placeholder: "••••••••",
                    required: true,
                  }}
                />

                <p className="mt-2 text-[11px] text-[#94a3b8]">
                  Workers can change this password for their own safety.
                </p>
              </div>

              {(errorMessage || error) && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-red-500 text-sm text-center">
                    {errorMessage || error}
                  </p>
                </div>
              )}

              <Button disabled={loading}>
                {loading ? "Registering..." : "Register Worker"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
