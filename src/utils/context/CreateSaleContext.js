import { createContext, useContext } from "react";

export const SaleContext = createContext(null);

export const useSaleContext = () => {
  const context = useContext(SaleContext);

  if (!context) {
    throw new Error("useSaleContext must be used within a SaleProvider");
  }

  return context;
};
