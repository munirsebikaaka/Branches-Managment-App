import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../../utils/context/CreateAuthContext";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { toast } from "react-toastify";
import { fetchData } from "../../utils/api";
import SignUpDisabled from "../../components/auth/SignupDisabled";
import CheckingOwner from "../../components/auth/CheckingOwner";
import {
  createHandleBlur,
  isSignUpFormValid,
} from "../../services/form/FormValidations";
import { getFriendlyErrorMessage } from "../../utils/errorMessages";
import { UserPlus } from "lucide-react";
import Error from "../../components/Error";

const inputNames = {
  email: "Email",
  password: "Password",
  confirmPassword: "Confirm password",
  name: "Name",
};
const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [onBlurErrors, setOnBlurErrors] = useState({});
  const [ownerExists, setOwnerExists] = useState(false);
  const [error, setError] = useState("");
  const [checkIsOwnerHasAccount, setCheckIsOwnerHasAccount] = useState(true);

  const { signUp, error: authError } = useAuthContext();

  const authenticationError = validationError
    ? validationError
    : error
      ? error
      : authError;

  const navigate = useNavigate();

  const isSubmitButtonDissabled =
    formData.email.length < 1 ||
    formData.password.length < 1 ||
    formData.confirmPassword.length < 1 ||
    formData.name.length < 1 ||
    loading;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationError("");
    setError("");
  };
  const handleBlur = createHandleBlur(inputNames, setOnBlurErrors);

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
        formData.password.trim(),
        formData.name.trim(),
      );

      if (!user) {
        throw new Error("Account creation failed");
      }

      toast.success("Account created successfully!");
      navigate("/owner");
    } catch (err) {
      setError(getFriendlyErrorMessage(err, "signup"));

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
        setError(getFriendlyErrorMessage(err, "fetch"));
      } finally {
        setCheckIsOwnerHasAccount(false);
      }
    };

    checkOwner();
  }, []);

  if (checkIsOwnerHasAccount) return <CheckingOwner />;
  if (ownerExists) return <SignUpDisabled />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-font-family p-6 relative overflow-hidden">
      <div className="w-full max-w-xl bg-white rounded-[2rem] border border-border-color shadow-2xl shadow-indigo-100/50 p-10 z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-100">
            <UserPlus className="text-white" size={28} />
          </div>
          <h3 className="text-2xl font-bold text-header-color">
            Auntie's Signup Page
          </h3>
          <p className="text-header-description text-sm mt-2 text-center">
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
              onBlur: handleBlur,
              value: formData.name,
              onChange: handleChange,
            }}
            error={onBlurErrors.name}
          />

          <Input
            label="Email"
            inputConfig={{
              type: "email",
              name: "email",
              placeholder: "owner@business.com",
              onBlur: handleBlur,
              value: formData.email,
              onChange: handleChange,
            }}
            error={onBlurErrors.email}
          />

          <Input
            label="Password"
            inputConfig={{
              type: "password",
              name: "password",
              placeholder: "••••••••",
              onBlur: handleBlur,
              value: formData.password,
              onChange: handleChange,
            }}
            error={onBlurErrors.password}
          />

          <Input
            label="Confirm Password"
            inputConfig={{
              type: "password",
              name: "confirmPassword",
              placeholder: "••••••••",
              onBlur: handleBlur,
              value: formData.confirmPassword,
              onChange: handleChange,
            }}
            error={onBlurErrors.confirmPassword}
          />

          <Error message={authenticationError}>{authenticationError}</Error>

          <Button disabled={isSubmitButtonDissabled}>
            {loading ? "Creating Account..." : "Register as Owner"}
          </Button>
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
