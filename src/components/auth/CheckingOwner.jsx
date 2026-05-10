import Loader from "../../ui/Loader";

const CheckingOwner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-['Outfit',_sans-serif]">
      <div className="z-10 flex flex-col items-center">
        <Loader />
        <h2 className="text-2xl font-bold text-[#0f172a] animate-pulse">
          Checking account status...
        </h2>
        <p className="text-[#64748b] mt-2">
          Checking if Owner Account already Exists.
        </p>
      </div>
    </div>
  );
};

export default CheckingOwner;
