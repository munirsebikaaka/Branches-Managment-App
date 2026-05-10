import { useMemo } from "react";
import { useProductsContext } from "../../utils/context/CreateProductContext";
import { useNavigate } from "react-router-dom";
import { getNames } from "../../services/pages/PagesFunctionalities";

const Workers = ({ onlyWorkers }) => {
  const navigate = useNavigate();

  const { branches } = useProductsContext();

  const getBranchName = useMemo(() => getNames(branches), [branches]);

  const goToBranchDashboard = (branchId) => {
    navigate(`/dashboard?branchId=${branchId}`);
  };
  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-6 text-[#0f172a]">Workers</h3>
      {onlyWorkers.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">
          No workers found
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {onlyWorkers.map((worker) => (
            <div
              key={worker.id}
              className="grid grid-cols-1 items-center lg:grid-cols-2 p-4 border border-[#f1f5f9] rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition cursor-pointer group"
              onClick={() => goToBranchDashboard(worker.branchId)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm uppercase group-hover:bg-indigo-100 group-hover:text-indigo-600 transition">
                  {worker.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-[#0f172a] text-sm md:text-base capitalize">
                    {worker.name}
                  </p>
                  <p className="text-xs md:text-sm text-[#64748b]">
                    {worker.email}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 mt-2">
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md uppercase">
                  {getBranchName[worker.branchId]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Workers;
