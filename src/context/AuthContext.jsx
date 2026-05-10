import { useState } from "react";
import { authenticateUser, registerUser } from "../utils/auth";
import { fetchData, postData } from "../utils/api";
import { AuthContext } from "../utils/context/CreateAuthContext";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("authToken") || null;
  });

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
      const authToken = response.idToken;
      const uid = response.localId;

      const users = await fetchData(setError, "users");
      const userData = users.find((u) => u.id === uid);

      if (!userData) throw new Error("User data not found");

      setUser(userData);
      setToken(authToken);

      localStorage.setItem("authToken", authToken);
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
    } catch (err) {
      if (
        err.message ===
        "Cannot read properties of undefined (reading 'idToken')"
      ) {
        setError("Login failed: Network Error!");
      }
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
      const authToken = response.idToken;

      setUser(userData);
      setToken(authToken);
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
    } catch (err) {
      if (
        err.message === "Cannot read properties of undefined (reading 'data')"
      ) {
        setError("Sign Up Failed: Network Error!");
      }
    } finally {
      setLoading(true);
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
      setError(err.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    signUp,
    registerWorker,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
