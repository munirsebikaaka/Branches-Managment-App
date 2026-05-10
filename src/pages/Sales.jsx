import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useProductsContext } from "../utils/context/CreateProductContext";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import { Search } from "lucide-react";
import ResponsiveNav from "../components/ResponsiveNav";
import OwnerBackButton from "../ui/OwnerBackButton";
import LoadingPage from "../components/LoadingPage";
import FetchedError from "../components/FefchError";
import { getNames } from "../services/pages/PagesFunctionalities";

const Sales = () => {
  const { user } = useAuthContext();
  const { salesData, loading, branches } = useProductsContext();
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlBranchId = queryParams.get("branchId");

  const getBranchName = useMemo(() => getNames(branches), [branches]);

  const filteredSales = useMemo(() => {
    let filtered = salesData || [];

    if (user?.role === "owner" && urlBranchId) {
      filtered = filtered.filter((sale) => sale.branchId === urlBranchId);
    } else if (user?.role === "worker") {
      filtered = filtered.filter((sale) => sale.branchId === user.branchId);
    }

    if (search.trim()) {
      filtered = filtered.filter((sale) =>
        sale.productName?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return [...filtered].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }, [salesData, user, search, urlBranchId]);

  if (loading) {
    return (
      <LoadingPage
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-['Outfit',_sans-serif] relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 p-4 md:p-12 md:ml-64 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />

          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#0f172a]">
                Sales History
              </h2>
              <p className="text-[#64748b] text-sm">
                {user?.role === "owner"
                  ? urlBranchId
                    ? `Viewing Branch: ${getBranchName[urlBranchId] || "..."}`
                    : "Viewing records across all branches"
                  : `Branch: ${getBranchName[user?.branchId] || "..."}`}
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                size={16}
              />
              <input
                type="text"
                placeholder="Search sales..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 bg-white"
              />
            </div>
          </div>

          <FetchedError />

          <div className="space-y-4">
            <div className="hidden md:grid md:grid-cols-6 gap-4 px-6 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs font-bold text-[#94a3b8] uppercase">
              <span>Product</span>
              <span>Qty</span>
              <span>Price</span>
              <span>Total</span>
              <span>Date</span>
              {user?.role === "owner" && <span>Branch</span>}
            </div>

            {filteredSales.length === 0 ? (
              <div className="bg-white p-10 text-center rounded-2xl border border-[#e2e8f0] text-[#64748b]">
                No sales found.
              </div>
            ) : (
              filteredSales.map((sale) => (
                <div
                  key={sale.id}
                  className="bg-white p-5 md:px-6 md:py-4 rounded-2xl border border-[#e2e8f0] shadow-sm hover:border-[#4f46e5]/30 transition-colors grid grid-cols-2 md:grid-cols-6 gap-y-3 gap-x-4 items-center">
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                      Product
                    </p>
                    <p className="font-semibold text-[#0f172a]">
                      {sale.productName}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                      Qty
                    </p>
                    <p className="text-[#475569] text-sm">
                      {sale.quantity} units
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                      Price
                    </p>
                    <p className="text-[#475569] text-sm">${sale.price}</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                      Total
                    </p>
                    <p className="text-[#4f46e5] font-semibold text-sm">
                      ${sale.total}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                      Date
                    </p>
                    <p className="text-[#475569] text-sm">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {user?.role === "owner" && (
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                        Branch
                      </p>
                      <span className="inline-block bg-slate-100 text-[#64748b] px-2 py-1 rounded text-[11px] font-medium">
                        {getBranchName[sale.branchId] || "Unknown"}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          <OwnerBackButton user={user} />
        </div>
      </main>
    </div>
  );
};

export default Sales;
