import { useState, useMemo } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { ArchiveRestore } from "lucide-react";
import { useProductsContext } from "../utils/context/CreateProductContext";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import ResponsiveNav from "../components/ResponsiveNav";
import DashboardHeader from "../components/dashboard/DashboardHead";
import DashboardStats from "../components/dashboard/DashboardStats";
import LoadingPage from "../components/LoadingPage";
import {
  dashboardStats,
  getNames,
} from "../services/pages/PagesFunctionalities";
import RecentSales from "../components/dashboard/RecentSales";
import OwnerBackButton from "../ui/OwnerBackButton";
import FetchedError from "../components/FefchError";
import Blur from "../components/Blur";
import ReceiptPreview from "../components/ReceiptPreview";
import LowStockAlert from "../components/dashboard/LowStockAlert";

const Dashboard = () => {
  const { user } = useAuthContext();
  const { products, salesData, chargingData, loading, branches, workers } =
    useProductsContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const selectedBranchId = queryParams.get("branchId");

  const activeBranchId =
    user?.role === "owner" && selectedBranchId
      ? selectedBranchId
      : user?.branchId;

  const getBranchName = useMemo(() => getNames(branches), [branches]);

  const workerName = useMemo(() => {
    const manager = workers?.find((w) => w.branchId === activeBranchId);
    return manager ? manager.name : "Manager";
  }, [workers, activeBranchId]);

  const filteredSales = useMemo(
    () => salesData.filter((c) => c.branchId === activeBranchId),
    [salesData, activeBranchId],
  );
  const filteredCharging = useMemo(
    () => chargingData.filter((c) => c.branchId === activeBranchId),
    [chargingData, activeBranchId],
  );
  const filteredProducts = useMemo(
    () => products.filter((p) => p.branchId === activeBranchId),
    [products, activeBranchId],
  );

  const stats = useMemo(() => {
    return dashboardStats(filteredSales, filteredCharging, filteredProducts);
  }, [filteredSales, filteredCharging, filteredProducts]);

  if (
    user?.role !== "owner" &&
    selectedBranchId &&
    selectedBranchId !== user?.branchId
  ) {
    return <Navigate to="/dashboard" />;
  }

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
        <div className="max-w-6xl mx-auto">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />
          <FetchedError />

          <div className="mb-8">
            <DashboardHeader
              title={`${getBranchName[activeBranchId]} Dashboard`}>
              Worker:{" "}
              <span className="text-header-color font-semibold">
                {workerName}
              </span>
            </DashboardHeader>
          </div>

          <div className="mb-8">
            <LowStockAlert
              products={filteredProducts}
              branchId={activeBranchId}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={() => navigate(`/products?branchId=${activeBranchId}`)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow-md active:scale-95">
              View Products in Branch
            </button>
            <button
              onClick={() => navigate(`/sales?branchId=${activeBranchId}`)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition shadow-md active:scale-95">
              View Branch Sales
            </button>
          </div>

          <DashboardStats
            stats={stats}
            statsCount={stats.totalDinamic}
            statsCountTitle={"Inventory"}
            statsCountIcon={<ArchiveRestore />}
          />
          <RecentSales
            filteredSales={filteredSales}
            onViewReceipt={setSelectedReceipt}
          />
          <OwnerBackButton user={user} />
        </div>
      </main>

      {selectedReceipt && (
        <ReceiptPreview
          sale={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
