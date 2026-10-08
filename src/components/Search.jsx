import { useAuthContext } from "../utils/context/CreateAuthContext";

const Search = ({ title, urlBranchId, getBranchName, search, setSearch }) => {
  const { user } = useAuthContext();

  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-header-color">{title} </h2>
        <p className="text-header-description text-sm capitalize">
          {user?.role === "owner"
            ? urlBranchId
              ? `Viewing Branch: ${getBranchName[urlBranchId]}`
              : "Viewing all branches"
            : `Branch: ${getBranchName[user?.branchId]}`}
        </p>
      </div>

      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-72 px-4 py-2.5 border border-border-color rounded-lg text-sm focus:outline-none bg-white"
      />
    </div>
  );
};
export default Search;
