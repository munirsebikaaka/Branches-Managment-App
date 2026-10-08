import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../../utils/context/CreateAuthContext";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import {
  createHandleBlur,
  isLoginFormValid,
} from "../../services/form/FormValidations";
import { getFriendlyErrorMessage } from "../../utils/errorMessages";
import Error from "../../components/Error";

const inputNames = {
  email: "Email",
  password: "Password",
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isCheckingUserRole, setIsCheckingUserRole] = useState(false);
  const [localError, setLocalError] = useState("");
  const [onBlurErrors, setOnBlurErrors] = useState({});
  const { login, error: authError, loading } = useAuthContext();

  const onChangeValue = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = createHandleBlur(inputNames, setOnBlurErrors);

  const authenticationError = localError ? localError : authError;
  const navigate = useNavigate();

  const isSubmitButtonDissabled =
    formData.email.length < 1 ||
    formData.password.length < 1 ||
    loading ||
    isCheckingUserRole;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    setLocalError("");

    if (!isLoginFormValid({ email, password })) return;

    try {
      setIsCheckingUserRole(true);
      const user = await login(email.trim(), password.trim(), setLocalError);
      if (user?.role === "owner") {
        navigate("/owner");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setLocalError(getFriendlyErrorMessage(err, "login"));
    } finally {
      setIsCheckingUserRole(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-font-family p-6">
      <div className="w-full max-w-md bg-white rounded-[2rem] border border-border-color shadow-2xl shadow-indigo-100/50 p-10 z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <h1 className="text-2xl text-white">A</h1>
          </div>
          <h3 className="text-2xl font-bold text-header-color">
            Auntie's Products
          </h3>
          <p className="text-header-description text-sm mt-1">
            Please sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            inputConfig={{
              type: "email",
              name: "email",
              placeholder: "your@email.com",
              onBlur: handleBlur,
              value: formData.email,
              onChange: onChangeValue,
            }}
            error={onBlurErrors?.email}
          />

          <div className="relative">
            <Input
              label="Password"
              inputConfig={{
                type: "password",
                name: "password",
                placeholder: "••••••••",
                onBlur: handleBlur,
                value: formData.password,
                onChange: onChangeValue,
              }}
              error={onBlurErrors?.password}
            />
          </div>

          <Error message={authenticationError}>
            Login Failed: {authenticationError}
          </Error>

          <Button disabled={isSubmitButtonDissabled}>
            {loading || isCheckingUserRole ? "Signing in..." : "Sign In"}
          </Button>
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
