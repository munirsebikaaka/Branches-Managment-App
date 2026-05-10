import { useProductsContext } from "../utils/context/CreateProductContext";

const FetchedError = () => {
  const { error } = useProductsContext();
  return (
    <>
      {error && (
        <div className="bg-red-50 text-red-500 text-sm p-4 mb-4 rounded-xl text-center border border-red-100">
          Unable to fetch data: {error}!
        </div>
      )}
    </>
  );
};
export default FetchedError;
