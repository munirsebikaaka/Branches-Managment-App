import Loader from "../ui/Loader";
import { Sidebar } from "./Sidebar";

const LoadingPage = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-['Outfit',_sans-serif] relative overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 md:ml-64 flex flex-col items-center justify-center z-10">
        <div className="relative">
          <Loader />
        </div>
        <p className="mt-6 text-[#94a3b8] font-medium tracking-wide animate-pulse">
          Fetching data...
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
