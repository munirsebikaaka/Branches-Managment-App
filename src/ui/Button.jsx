const Button = ({ children, disabled }) => {
  return (
    <div className="pt-4 flex gap-4">
      <button
        type="submit"
        disabled={disabled}
        className="flex-[2] px-6 py-3 bg-[#4f46e5] text-white font-semibold rounded-xl shadow-lg shadow-indigo-100 hover:bg-[#3730a3] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
        {children}
      </button>
    </div>
  );
};

export default Button;
