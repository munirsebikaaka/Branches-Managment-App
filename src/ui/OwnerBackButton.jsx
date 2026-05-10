import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OwnerBackButton = ({ user }) => {
  const navigate = useNavigate();

  return (
    <>
      {user?.role === "owner" && (
        <div className="mt-8">
          <button
            onClick={() => navigate("/owner")}
            className="inline-flex items-center gap-2 text-sm text-indigo-600 font-bold hover:text-indigo-800 transition active:translate-x-[-4px]">
            <MoveLeft size={18} /> Back to Owner Dashboard
          </button>
        </div>
      )}
    </>
  );
};
export default OwnerBackButton;
