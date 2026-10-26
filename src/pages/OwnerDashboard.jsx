import { useState, useMemo } from "react";
import { Sidebar } from "../components/Sidebar";
import { Users } from "lucide-react";
import ResponsiveNav from "../components/ResponsiveNav";
import DashboardHeader from "../components/dashboard/DashboardHead";
import DashboardStats from "../components/dashboard/DashboardStats";
import LoadingPage from "../components/LoadingPage";
import {
  dashboardStats,
  getNames,
} from "../services/pages/PagesFunctionalities";
import { useProductsContext } from "../utils/context/CreateProductContext";
import Workers from "../components/dashboard/Workers";
import FetchedError from "../components/FefchError";
import RecentSales from "../components/dashboard/RecentSales";
import Blur from "../components/Blur";
import ReceiptPreview from "../components/ReceiptPreview";
import LowStockAlert from "../components/dashboard/LowStockAlert";

const OwnerDashboard = () => {
  const { products, salesData, chargingData, loading, workers, branches } =
    useProductsContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);

  const handleViewReceipt = (sale) => {
    setSelectedReceipt(sale);
    setIsReceiptVisible(true);
  };

  const handleCloseReceipt = () => {
    setIsReceiptVisible(false);
    setSelectedReceipt(null);
  };
  const getBranchName = useMemo(() => getNames(branches), [branches]);

  const onlyWorkers = useMemo(() => {
    return workers.filter((w) => w.role === "worker");
  }, [workers]);

  const stats = useMemo(() => {
    return dashboardStats(salesData, chargingData, onlyWorkers);
  }, [salesData, chargingData, onlyWorkers]);

  if (loading) {
    return (
      <LoadingPage
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    );
  }

  return (
    <>
      <div className="flex min-h-screen bg-background font-font-family relative">
        <Blur
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
        />

        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="flex-1 p-6 md:p-12 md:ml-64">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />
          {isReceiptVisible ? (
            <ReceiptPreview
              sale={selectedReceipt}
              isVisible={isReceiptVisible}
              onClose={handleCloseReceipt}
            />
          ) : (
            <div className="mx-auto space-y-10">
            <DashboardHeader title={"Auntie's Dashboard"}>
              Overview of all branches and workers
            </DashboardHeader>

            <FetchedError />

            <LowStockAlert products={products} />

            <DashboardStats
              stats={stats}
              statsCount={stats.totalDinamic}
              statsCountTitle={"Total Workers"}
              statsCountIcon={<Users />}
            />

            <p className="text-lg font-bold text-header-color">
              Click on the worker to see worker's analytics.
            </p>

            <Workers onlyWorkers={onlyWorkers} />
            <RecentSales
              filteredSales={salesData}
              onViewReceipt={handleViewReceipt}
              getBranchName={getBranchName}
            />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default OwnerDashboard;
