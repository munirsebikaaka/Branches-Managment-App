const Blur = ({ setIsSidebarOpen, isSidebarOpen }) => {
  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] transition-opacity duration-300 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};
export default Blur;
