const HistoryButtons = ({ view, setView }) => {
  const buttonDetails = [
    {
      key: "at_shop",
      label: "Still at shop",
    },
    {
      key: "taken",
      label: "Taken phones",
    },
  ];
  return (
    <div className="flex gap-2 pb-3">
      {buttonDetails.map((button) => (
        <button
          key={button.key}
          onClick={() => setView(button.key)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            view === button.key
              ? "bg-action-color text-white"
              : "bg-white text-[#475569] border border-border-color"
          }`}>
          {button.label}
        </button>
      ))}
    </div>
  );
};
export default HistoryButtons;
