import { useProductsContext } from "../utils/context/CreateProductContext";
import { getFriendlyErrorMessage } from "../utils/errorMessages";

const FetchedError = () => {
  const { error } = useProductsContext();
  return (
    <>
      {error && (
        <div className="bg-red-50 text-red-500 text-sm p-4 mb-4 rounded-xl text-center border border-red-100">
          {typeof error === "string"
            ? error
            : getFriendlyErrorMessage(error, "fetch")}
        </div>
      )}
    </>
  );
};
export default FetchedError;
