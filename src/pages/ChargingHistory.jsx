import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import ResponsiveNav from "../components/ResponsiveNav";
import Blur from "../components/Blur";
import LoadingPage from "../components/LoadingPage";
import FetchedError from "../components/FefchError";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import { useProductsContext } from "../utils/context/CreateProductContext";
import HistoryButtons from "../components/charging/HistoryButtons";
import { formatDateTime } from "../utils/format";
import SaleButton from "../ui/SaleButton";
import Search from "../components/Search";
import {
  filterAppData,
  getNames,
  handleDeleteProduct,
  markAsTaken,
} from "../services/pages/PagesFunctionalities";
import { useLocation } from "react-router-dom";

const ChargingHistory = () => {
  const { user } = useAuthContext();
  const { chargingData, setChargingData, loading, branches } =
    useProductsContext();
  const [view, setView] = useState("at_shop");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [takingId, setTakingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const recordsForUser = useMemo(
    () =>
      user?.role === "owner"
        ? chargingData
        : chargingData.filter((record) => record.branchId === user?.branchId),
    [chargingData, user],
  );

  const visibleRecords = useMemo(
    () => recordsForUser.filter((record) => record.status === view),
    [recordsForUser, view],
  );

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlBranchId = queryParams.get("branchId");

  const getBranchName = useMemo(() => getNames(branches), [branches]);

  const filteredRecords = useMemo(() => {
    return filterAppData(
      visibleRecords,
      user,
      urlBranchId,
      getBranchName,
      search,
    );
  }, [visibleRecords, user, getBranchName, urlBranchId, search]);

  const excuteMarkAsTaken = (record) => {
    markAsTaken(record, setError, setTakingId, setChargingData, user);
  };

  const executeDeleteTakenPhone = (record) => {
    handleDeleteProduct(record, setChargingData, "charging", setDeletingId);
  };

  if (loading) {
    return (
      <LoadingPage
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-background font-font-family relative">
      <Blur setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 p-4 md:p-12 md:ml-64">
        <div className="max-w-6xl mx-auto space-y-6">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />

          <Search
            title={"Sales history"}
            urlBranchId={urlBranchId}
            getBranchName={getBranchName}
            search={search}
            setSearch={setSearch}
          />

          <FetchedError />

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <HistoryButtons view={view} setView={setView} />

          {filteredRecords.length === 0 ? (
            <div className="rounded-2xl border border-border-color bg-white p-12 text-center text-[#64748b]">
              No
              {view === "at_shop"
                ? "phones waiting at the shop"
                : "taken phones"}
              yet.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex  flex-col  lg:flex-row lg:justify-between gap-3 bg-white p-5 md:px-6 md:py-4 rounded-2xl border border-border-color shadow-sm hover:border-[#4f46e5]/30 transition-colors">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#94a3b8]">
                      Device model
                    </p>
                    <p className="text-[#475569] text-sm">
                      {record.deviceModel}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#94a3b8]">
                      Device owner
                    </p>
                    <p className="text-[#475569] text-sm">
                      {record.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#94a3b8]">
                      Owner contact
                    </p>
                    <p className="text-[#475569] text-sm">{record.contact}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#94a3b8]">
                      time
                    </p>
                    <p className="text-[#475569] text-sm">
                      {formatDateTime(record.receivedAt)}
                    </p>
                  </div>

                  {view === "at_shop" && (
                    <div className="flex items-center justify-end gap-3 w-full lg:w-auto">
                      <SaleButton
                        onClick={() => excuteMarkAsTaken(record)}
                        disabled={takingId === record.id}
                        text={
                          takingId === record.id
                            ? "Confirming... "
                            : "Take phone"
                        }
                      />
                    </div>
                  )}

                  {view === "taken" && (
                    <div className="flex items-center justify-end w-full lg:w-auto">
                      <button
                        onClick={() => executeDeleteTakenPhone(record)}
                        disabled={deletingId === record.id}
                        className="text-red-500 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                        {deletingId === record.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChargingHistory;
