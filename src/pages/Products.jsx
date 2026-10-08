import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useProductsContext } from "../utils/context/CreateProductContext";
import { useAuthContext } from "../utils/context/CreateAuthContext";
import ResponsiveNav from "../components/ResponsiveNav";
import LoadingPage from "../components/LoadingPage";
import OwnerBackButton from "../ui/OwnerBackButton";
import FetchedError from "../components/FefchError";
import {
  filterAppData,
  getNames,
  handleDeleteProduct,
} from "../services/pages/PagesFunctionalities";
import Blur from "../components/Blur";
import {  Trash2 } from "lucide-react";
import Search from "../components/Search";

const Products = () => {
  const { user } = useAuthContext();
  const { products, setProducts, loading, branches } = useProductsContext();
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlBranchId = queryParams.get("branchId");

  const getBranchName = useMemo(() => getNames(branches), [branches]);
  const filteredProducts = useMemo(() => {
    return filterAppData(products, user, urlBranchId, getBranchName, search);
  }, [products, user, search, urlBranchId, getBranchName]);

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
      <main className="flex-1 min-h-screen md:ml-64 transition-all duration-300">
        <div className="w-full p-6 md:p-10 lg:p-12 space-y-10">
          <ResponsiveNav onClick={() => setIsSidebarOpen(true)} />

          <Search
            title={"Products history"}
            urlBranchId={urlBranchId}
            getBranchName={getBranchName}
            search={search}
            setSearch={setSearch}
          />

          <FetchedError />

          <div className="space-y-4">
            <div className="space-y-4">
              {filteredProducts.length === 0 ? (
                <div className="bg-white p-10 text-center rounded-2xl border border-border-color text-[#64748b]">
                  No products found.
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col gap-3 rounded-2xl border border-border-color bg-white p-5 shadow-sm transition-colors hover:border-action-color/30 lg:flex-row lg:items-center lg:justify-between md:px-6 md:py-4">
                    <div className="min-w-0 lg:flex-1">
                      <p className="text-[10px] uppercase font-bold text-[#94a3b8]">
                        Product
                      </p>
                      <p className="font-semibold text-header-color">
                        {product.name}
                      </p>
                    </div>

                    <div className="lg:w-32">
                      <p className="text-[10px] uppercase font-bold text-[#94a3b8]">
                        Category
                      </p>
                      <p className="text-[#475569] text-sm">
                        {product.category}
                      </p>
                    </div>

                    <div className="lg:w-24">
                      <p className="text-[10px] uppercase font-bold text-[#94a3b8]">
                        Stock
                      </p>
                      <p
                        className={`text-sm md:text-xs lg:text-ms font-medium ${product.quantity < 5 ? "text-red-500" : "text-[#475569]"}`}>
                        {product.quantity} units
                      </p>
                    </div>

                    {user?.role === "owner" && (
                      <div className="lg:w-32">
                        <p className="text-[10px] uppercase font-bold text-[#94a3b8]">
                          Cost Price
                        </p>
                        <p className="text-[#475569] text-sm md:text-xs lg:text-sm">
                          UGX {product.buyingPrice}
                        </p>
                      </div>
                    )}

                    <div className="lg:w-32">
                      <p className="text-[10px] uppercase font-bold text-[#94a3b8]">
                        Sell Price
                      </p>
                      <p className="text-[#475569] text-sm md:text-xs lg:text-sm">
                        UGX {product.sellingPrice}
                      </p>
                    </div>

                    {user?.role === "owner" && (
                      <div className="lg:w-32 lg:text-left">
                        <p className="text-[10px] uppercase font-bold text-[#94a3b8]">
                          Branch
                        </p>
                        <span className="inline-block bg-slate-100 text-[#64748b] px-2 py-1 rounded text-[11px] font-medium">
                          {getBranchName[product.branchId]}
                        </span>
                      </div>
                    )}

                    <button
                      disabled={deletingProductId === product.id}
                      onClick={() =>
                        handleDeleteProduct(
                          product,
                          setProducts,
                          "products",
                          setDeletingProductId,
                        )
                      }
                      className="self-end rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 lg:self-auto">
                      {deletingProductId === product.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                      ) : (
                        <Trash2 size={16} aria-hidden="true" />
                      )}
                    </button>
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
