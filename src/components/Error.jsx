const Error = ({ children, message }) => {
  return (
    <>
      {message && (
        <div className="bg-red-50 text-error-color text-xs font-medium p-3 rounded-xl border border-red-100 text-center">
          {children}
        </div>
      )}
    </>
  );
};
export default Error;
