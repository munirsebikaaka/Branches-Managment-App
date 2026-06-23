import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../../utils/context/CreateAuthContext";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { isLoginFormValid } from "../../services/form/FormValidations";
import { getFriendlyErrorMessage } from "../../utils/errorMessages";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import Error from "../../components/Error";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingUserRole, setIsCheckingUserRole] = useState(false);
  const [localError, setLocalError] = useState("");

  const { login, error: authError, loading } = useAuthContext();

  const authenticationError = localError ? localError : authError;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!isLoginFormValid({ email, password }, setLocalError)) return;

    try {
      setIsCheckingUserRole(true);
      const user = await login(email.trim(), password.trim(), setLocalError);

      if (user.role === "owner") {
        navigate("/owner");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      setLocalError(getFriendlyErrorMessage(err, "login"));
    } finally {
      setIsCheckingUserRole(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-['Outfit',_sans-serif] p-6">
      <div className="w-full max-w-md bg-white rounded-[2rem] border border-[#e2e8f0] shadow-2xl shadow-indigo-100/50 p-10 z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <h1 className="text-2xl text-white">A</h1>
          </div>
          <h3 className="text-2xl font-bold text-[#0f172a]">
            Auntie's Products
          </h3>
          <p className="text-[#64748b] text-sm mt-1">
            Please sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            inputConfig={{
              type: "email",
              placeholder: "your@email.com",
              value: email,
              onChange: (e) => setEmail(e.target.value),
            }}
          />

          <div className="relative">
            <Input
              label="Password"
              inputConfig={{
                type: showPassword ? "text" : "password",
                placeholder: "••••••••",
                value: password,
                onChange: (e) => setPassword(e.target.value),
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[42px] text-[#94a3b8] hover:text-indigo-600 transition-colors">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Error message={authenticationError}>
            Login Failed: {authenticationError}
          </Error>

          <div className="pt-2">
            <Button disabled={loading || isCheckingUserRole}>
              {loading || isCheckingUserRole ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-[#f1f5f9] pt-6">
          <p className="text-[#64748b] text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
