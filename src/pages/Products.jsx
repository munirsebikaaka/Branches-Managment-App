import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useProductsContext } from "../utils/context/CreateProductContext";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import ResponsiveNav from "../components/ResponsiveNav";
import LoadingPage from "../components/LoadingPage";
import OwnerBackButton from "../ui/OwnerBackButton";
import FetchedError from "../components/FefchError";
import { getNames } from "../services/pages/PagesFunctionalities";

const Products = () => {
  const { user } = useAuthContext();
  const { products, loading, branches } = useProductsContext();
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlBranchId = queryParams.get("branchId");

  console.log(location);
  console.log(urlBranchId);

  const getBranchName = useMemo(() => getNames(branches), [branches]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (user?.role === "owner" && urlBranchId) {
      filtered = products.filter((p) => p.branchId === urlBranchId);
    } else if (user?.role === "worker") {
      filtered = products.filter((p) => p.branchId === user.branchId);
    }

    if (search.trim()) {
      filtered = filtered.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return filtered;
  }, [products, user, search, urlBranchId]);

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
      <main className="flex-1 min-h-screen md:ml-64 transition-all duration-300">
        <div className="w-full p-6 md:p-10 lg:p-12 space-y-10">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />

          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#0f172a]">
                Products Inventory
              </h2>
              <p className="text-[#64748b] text-sm capitalize">
                {user?.role === "owner"
                  ? urlBranchId
                    ? `Viewing Branch: ${getBranchName[urlBranchId] || "..."}`
                    : "Viewing all branches"
                  : `Branch: ${getBranchName[user?.branchId] || "..."}`}
              </p>
            </div>

            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 px-4 py-2.5 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 bg-white"
            />
          </div>

          <FetchedError />

          <div className="space-y-4">
            <div
              className={`hidden md:grid gap-4 px-6 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs text-[#94a3b8] uppercase ${user?.role === "owner" ? "grid-cols-6" : "grid-cols-5"}`}>
              <span>Name</span>
              <span>Category</span>
              <span>Stock</span>
              <span> Price</span>
              <span>Sell Price</span>
              {user?.role === "owner" && <span>Branch</span>}
            </div>

            <div className="space-y-3">
              {filteredProducts.length === 0 ? (
                <div className="bg-white p-10 text-center rounded-2xl border border-[#e2e8f0] text-[#64748b]">
                  No products found.
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white p-5  md:px-6 md:py-4 rounded-2xl border border-[#e2e8f0] shadow-sm hover:border-[#4f46e5]/30 transition-colors grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 items-center justify-center  ${user?.role === "owner" ? "md:grid-cols-6" : "md:grid-cols-5"}`}>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                        Name
                      </p>
                      <p className="font-semibold text-[#0f172a]">
                        {product.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                        Category
                      </p>
                      <p className="text-[#475569] text-sm">
                        {product.category}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                        Stock
                      </p>
                      <p
                        className={`text-sm md:text-xs lg:text-ms font-medium ${product.quantity < 5 ? "text-red-500" : "text-[#475569]"}`}>
                        {product.quantity} units
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                        Price
                      </p>
                      <p className="text-[#475569] text-sm md:text-xs lg:text-sm">
                        UGX {product.buyingPrice}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                        Sell Price
                      </p>
                      <p className="text-[#4f46e5] font-semibold text-sm md:text-xs lg:text-sm">
                        UGX {product.sellingPrice}
                      </p>
                    </div>

                    {user?.role === "owner" && (
                      <div className="col-span-2 md:col-span-1 md:text-left">
                        <p className="text-[10px] uppercase font-bold text-[#94a3b8] md:hidden">
                          Branch
                        </p>
                        <span className="inline-block bg-slate-100 text-[#64748b] px-2 py-1 rounded text-[11px] font-medium">
                          {getBranchName[product.branchId] || "Unknown"}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8">
            <OwnerBackButton user={user} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;
