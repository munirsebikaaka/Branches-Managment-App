import { Navigate } from "react-router-dom";
import { useAuthContext } from "../utils/context/CreateAuthContext";

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
