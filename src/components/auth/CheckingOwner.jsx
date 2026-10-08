import Loader from "../../ui/Loader";

const CheckingOwner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-font-family">
      <div className="z-10 flex flex-col items-center">
        <Loader />
        <h2 className="text-2xl font-bold text-header-color animate-pulse">
          Checking account status...
        </h2>
        <p className="text-header-description mt-1 text-sm">
          Checking if Owner Account already Exists.
        </p>
      </div>
    </div>
  );
};

export default CheckingOwner;
