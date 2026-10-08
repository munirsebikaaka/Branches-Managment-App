import {
  CircleAlert,
  Eye,
  EyeOff,
  MessageCircleWarningIcon,
} from "lucide-react";
import { useState } from "react";

const Input = ({ label, inputConfig, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = inputConfig.type === "password";
  const isInputValueAvailable = inputConfig.value?.length > 0;

  const labelClass = "text-sm font-semibold text-[#475569] mb-1.5 block pl-2.5";
  const inputClass = `w-full px-4 py-2.5 bg-white border rounded-lg text-header-color text-sm transition-all focus:outline-none
${
  error && !isInputValueAvailable
    ? "border-error-color"
    : "border-border-color focus:border-action-color"
}`;

  return (
    <div className="flex flex-col items-start relative">
      <label className={labelClass}>{label}</label>
      <div className="relative w-full transition-all duration-300">
        <input
          className={inputClass}
          {...inputConfig}
          type={
            isPassword ? (showPassword ? "text" : "password") : inputConfig.type
          }
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737b89]">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && !isInputValueAvailable && (
        <>
          <p className="absolute right-[0] pr-2 text-sm text-error-color">
            {error}
          </p>
          <div
            className={`absolute ${isPassword ? "right-9" : "right-3"} text-error-color top-[58%]`}>
            <CircleAlert size={15} />
          </div>
        </>
      )}
    </div>
  );
};

export default Input;
