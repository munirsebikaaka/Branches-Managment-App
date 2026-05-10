import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../../utils/context/CreateAuthContext";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { toast } from "react-toastify";
import { fetchData } from "../../utils/api";
import SignUpDisabled from "../../components/auth/SignupDisabled";
import CheckingOwner from "../../components/auth/CheckingOwner";
import { isSignUpFormValid } from "../../services/form/FormValidations";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [ownerExists, setOwnerExists] = useState(false);
  const [error, setError] = useState("");
  const [checkIsOwnerHasAccount, setCheckIsOwnerHasAccount] = useState(true);

  const { signUp, error: authError } = useAuthContext();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setValidationError("");
    setError("");

    if (!isSignUpFormValid(formData, setValidationError)) {
      return;
    }

    setLoading(true);

    try {
      const user = await signUp(
        formData.email.trim(),
        formData.password,
        formData.name,
      );

      if (!user) {
        throw new Error("Account creation failed");
      }

      toast.success("Account created successfully!");

      navigate("/owner");
    } catch (err) {
      setError(`${err.message}`);

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkOwner = async () => {
      setCheckIsOwnerHasAccount(true);
      setError("");

      try {
        const users = await fetchData(setError, "users");
        const exists = users.some((user) => user.role === "owner");
        setOwnerExists(exists);
      } catch (err) {
        setError(err.message);
      } finally {
        setCheckIsOwnerHasAccount(false);
      }
    };

    checkOwner();
  }, []);

  if (checkIsOwnerHasAccount) return <CheckingOwner />;
  if (ownerExists) return <SignUpDisabled />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-['Outfit',_sans-serif] p-6 relative overflow-hidden">
      <div className="w-full max-w-xl bg-white rounded-[2rem] border border-[#e2e8f0] shadow-2xl shadow-indigo-100/50 p-10 z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-100">
            <UserPlus className="text-white" size={28} />
          </div>
          <h3 className="text-2xl font-bold text-[#0f172a]">
            Auntie's Signup Page
          </h3>
          <p className="text-[#64748b] text-sm mt-2 text-center">
            Create your acount as an owner
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            inputConfig={{
              type: "text",
              name: "name",
              placeholder: "John Doe",
              value: formData.name,
              onChange: handleChange,
            }}
          />

          <Input
            label="Email"
            inputConfig={{
              type: "email",
              name: "email",
              placeholder: "owner@business.com",
              value: formData.email,
              onChange: handleChange,
            }}
          />

          <div className="relative">
            <Input
              label="Password"
              inputConfig={{
                type: showPasswords ? "text" : "password",
                name: "password",
                placeholder: "••••••••",
                value: formData.password,
                onChange: handleChange,
              }}
            />
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute right-4 top-[42px] text-[#94a3b8] hover:text-indigo-600 transition-colors">
              {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
              inputConfig={{
                type: showPasswords ? "text" : "password",
                name: "confirmPassword",
                placeholder: "••••••••",
                value: formData.confirmPassword,
                onChange: handleChange,
              }}
            />
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute right-4 top-[42px] text-[#94a3b8] hover:text-indigo-600 transition-colors">
              {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {(validationError || authError || error) && (
            <div className="bg-red-50 text-red-500 text-xs font-medium p-3 rounded-xl border border-red-100 text-center">
              {validationError || authError || error}
            </div>
          )}

          <div className="pt-2">
            <Button
              disabled={loading}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
              {loading ? "Creating Account..." : "Register as Owner"}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-[#f1f5f9] pt-6">
          <p className="text-[#64748b] text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
