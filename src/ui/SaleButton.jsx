const SaleButton = ({ onClick, text, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="text-action-color text-xs font-semibold">
      {text}
    </button>
  );
};
export default SaleButton;
