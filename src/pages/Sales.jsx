import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useProductsContext } from "../utils/context/CreateProductContext";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import ResponsiveNav from "../components/ResponsiveNav";
import OwnerBackButton from "../ui/OwnerBackButton";
import LoadingPage from "../components/LoadingPage";
import FetchedError from "../components/FefchError";
import {
  filterAppData,
  getNames,
} from "../services/pages/PagesFunctionalities";
import SalesTable from "../components/products/SalesTable";
import ReceiptPreview from "../components/ReceiptPreview";
import Blur from "../components/Blur";
import Search from "../components/Search";

const Sales = () => {
  const { user } = useAuthContext();
  const { salesData, loading, branches } = useProductsContext();
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlBranchId = queryParams.get("branchId");

  const getBranchName = useMemo(() => getNames(branches), [branches]);

  const filteredSales = useMemo(() => {
    return filterAppData(salesData, user, urlBranchId, getBranchName, search);
  }, [salesData, user, search, urlBranchId, getBranchName]);

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

      <main className="flex-1 p-4 md:p-12 md:ml-64 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />

          <Search
            title={"Sales history"}
            urlBranchId={urlBranchId}
            getBranchName={getBranchName}
            search={search}
            setSearch={setSearch}
          />

          <FetchedError />

          <SalesTable
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

export default Sales;
