const FormsHeader = ({ header, description }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      <h3 className="text-3xl font-bold text-header-color">{header}</h3>
      <p className="text-header-description mt-1 text-center">{description}</p>
    </div>
  );
};
export default FormsHeader;
