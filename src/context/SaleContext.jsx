import { useState } from "react";
import { SaleContext } from "../utils/context/CreateSaleContext";

export const SaleProvider = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState({
    productId: "",
    quantity: "",
    price: "",
  });
  const [calculatedQuantity, setCalculatedQuantity] = useState(0);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [error, setError] = useState("");

  return (
    <SaleContext.Provider
      value={{
        selectedProducts,
        setSelectedProducts,
        selectedItem,
        setSelectedItem,
        calculatedQuantity,
        setCalculatedQuantity,
        showUpdateButton,
        setShowUpdateButton,
        error,
        setError,
      }}>
      {children}
    </SaleContext.Provider>
  );
};
