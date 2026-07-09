import { useState } from "react";
import { authenticateUser, registerUser } from "../utils/auth";
import { fetchData, postData } from "../utils/api";
import { getFriendlyErrorMessage } from "../utils/errorMessages";
import { AuthContext } from "../utils/context/CreateAuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password, setAuthenticateError) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authenticateUser(
        email,
        password,
        setAuthenticateError,
      );
      const uid = response.localId;

      const users = await fetchData(setError, "users");
      const userData = users.find((u) => u.id === uid);
      if (!userData) throw new Error("User data not found");

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError(getFriendlyErrorMessage(err, "login"));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, name) => {
    setError(null);
    setLoading(true);
    try {
      const users = await fetchData(setError, "users");
      const ownerExists = users.some((u) => u.role === "owner");

      if (ownerExists) {
        setLoading(false);
        return;
      }

      const response = await registerUser(email, password, setError);
      const uid = response.localId;
      const userData = {
        id: uid,
        name,
        email,
        role: "owner",
        createdAt: new Date().toISOString(),
      };

      await postData(userData, "users");
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
    } catch (err) {
      setError(getFriendlyErrorMessage(err, "signup"));
    } finally {
      setLoading(false);
    }
  };

  const registerWorker = async (
    email,
    password,
    name,
    branchId,
    role = "worker",
    workerId,
  ) => {
    setError(null);
    try {
      const response = await registerUser(email, password);
      const uid = response.localId;
      const userData = {
        id: uid,
        name,
        email,
        role,
        branchId,
        workerId,
        createdAt: new Date().toISOString(),
      };

      await postData(userData, "users");
      return userData;
    } catch (err) {
      setError(getFriendlyErrorMessage(err, "signup"));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    loading,
    error,
    login,
    signUp,
    registerWorker,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
