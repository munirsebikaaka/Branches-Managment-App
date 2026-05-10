const Input = ({ label, inputConfig }) => {
  const labelClass = "text-sm font-semibold text-[#475569] mb-1.5 block pl-2.5";
  const inputClass =
    "w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[#0f172a] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] placeholder:text-[#94a3b8]";

  return (
    <div className="flex flex-col items-start">
      <label className={labelClass}>{label}</label>
      <input className={inputClass} {...inputConfig} />
    </div>
  );
};

export default Input;
