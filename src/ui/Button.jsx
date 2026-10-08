const Button = ({ children, disabled }) => {
  return (
    <div className="pt-3">
      <button
        type="submit"
        disabled={disabled}
        className="w-full px-6 py-3 bg-action-color text-white font-semibold rounded-xl shadow-lg hover:bg-[#3730a3] disabled:opacity-80 transition-all">
        {children}
      </button>
    </div>
  );
};

export default Button;
