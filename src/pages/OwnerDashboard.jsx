import { useState, useMemo } from "react";
import { Sidebar } from "../components/Sidebar";
import { Users } from "lucide-react";
import StatCard from "../components/dashboard/DarshboardCard";
import ResponsiveNav from "../components/ResponsiveNav";
import DashboardHeader from "../components/dashboard/DashboardHead";
import DashboardStats from "../components/dashboard/DashboardStats";
import LoadingPage from "../components/LoadingPage";
import { dashboardStats } from "../services/pages/PagesFunctionalities";
import { useProductsContext } from "../utils/context/CreateProductContext";
import Workers from "../components/dashboard/Workers";
import FetchedError from "../components/FefchError";
import RecentSales from "../components/dashboard/RecentSales";

const OwnerDashboard = () => {
  const { salesData, chargingData, loading, workers } = useProductsContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <div className="flex min-h-screen bg-[#f8fafc] font-['Outfit',_sans-serif] relative">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] md:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="flex-1 p-6 md:p-12 md:ml-64 transition-all duration-300">
          <div className="mx-auto space-y-10">
            <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />
            <DashboardHeader title={"Auntie's Dashboard"}>
              Overview of all branches and workers
            </DashboardHeader>

            <FetchedError />

            <DashboardStats
              stats={stats}
              statsCount={stats.totalDinamic}
              statsCountTitle={"Total Workers"}
              statsCountIcon={<Users />}
            />

            <p className="text-lg font-bold text-[#0f172a]">
              Click on the worker to see worker's analytics.
            </p>

            <Workers onlyWorkers={onlyWorkers} />
            <RecentSales filteredSales={salesData} />
          </div>
        </main>
      </div>
    </>
  );
};

export default OwnerDashboard;
