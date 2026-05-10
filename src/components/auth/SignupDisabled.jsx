import { Link } from "react-router-dom";
import { ShieldAlert, MoveLeft } from "lucide-react";

const SignUpDisabled = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-['Outfit',_sans-serif] p-6">
      <div className="w-full max-w-md bg-white rounded-[2rem] border border-[#e2e8f0] shadow-2xl shadow-indigo-100/50 p-10 z-10 text-center">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
            <ShieldAlert className="text-amber-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[#0f172a]">
            Registration Locked
          </h2>
          <div className="h-1 w-12 bg-amber-400 rounded-full mt-2"></div>
        </div>

        <p className="text-[#64748b] leading-relaxed mb-8">
          An owner account already exists for this system. To maintain security,
          multiple owner registrations are currently{" "}
          <span className="font-semibold text-[#0f172a]">disabled</span>.
        </p>

        <div className="space-y-4">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all">
            <MoveLeft size={18} />
            Back to Login
          </Link>

          <p className="text-xs text-[#94a3b8]">
            For more infor, please contact your system developers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpDisabled;
