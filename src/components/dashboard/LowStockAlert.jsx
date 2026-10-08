import { AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LowStockAlert = ({ products, branchId }) => {
  const navigate = useNavigate();
  const lowStockProducts = products.filter((product) => product.quantity < 5);
  const navigateToProducts = () =>
    navigate(branchId ? `/products?branchId=${branchId}` : "/products");

  if (lowStockProducts.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <AlertTriangle className="mt-0.5 text-amber-600" size={22} />
        <div className="min-w-0">
          <p className="font-bold">
            {lowStockProducts.length} products need restocking
          </p>

          {lowStockProducts.map((product, index) => (
            <div key={`${product.id}-${index}`}>
              <p className="mt-1 break-words text-sm text-amber-800">
                {product.name} ({product.quantity})
              </p>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={navigateToProducts}
        className="flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700">
        View products
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default LowStockAlert;
