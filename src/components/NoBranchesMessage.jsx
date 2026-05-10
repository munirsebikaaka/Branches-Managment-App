import { Link } from "react-router-dom";
import { MapPinOff, ArrowRight } from "lucide-react";

const NoBranches = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center font-['Outfit',_sans-serif]">
      <div className="mb-6">
        <MapPinOff className="text-[#94a3b8] mx-auto mb-4" size={48} />
        <h3 className="text-xl font-bold text-[#0f172a]">
          No Branches Available
        </h3>
        <p className="text-[#64748b] mt-2 max-w-sm">
          You cannot create a worker until you have registered a branch in the
          system.
        </p>
      </div>

      <Link
        to="/add-branch"
        className="flex items-center justify-center gap-2 px-8 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.95]">
        Go to Create Branches
        <ArrowRight size={18} />
      </Link>
    </div>
  );
};

export default NoBranches;
