import { useEffect, useState } from "react";
import { fetchData } from "../utils/api";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import { ProductsContext } from "../utils/context/CreateProductContext";

const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [chargingData, setChargingData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppData = async () => {
      setLoading(true);
      try {
        const allProducts = await fetchData(setError, "products");
        setProducts(allProducts);
        const sales = await fetchData(setError, "sales");
        setSalesData(sales);
        const charging = await fetchData(setError, "charging");
        setChargingData(charging);
        const branches = await fetchData(setError, "branches");
        setBranches(branches);
        const allWorkers = await fetchData(setError, "users");
        setWorkers(allWorkers);
      } catch (err) {
        setError(getFriendlyErrorMessage(err, "fetch"));
      } finally {
        setLoading(false);
      }
    };

    fetchAppData();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        setProducts,
        salesData,
        setSalesData,
        chargingData,
        setChargingData,
        branches,
        setBranches,
        workers,
        setWorkers,
        loading,
        error,
        setError,
      }}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsProvider;
