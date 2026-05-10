import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import RecordSale from "./pages/RecordSale";
import RecordCharging from "./pages/RecordCharging";
import { ManageWorkers } from "./pages/ManageWorkers";
import { ToastContainer } from "react-toastify";
import AddBranch from "./pages/AddBranch";
import OwnerDashboard from "./pages/OwnerDashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";

function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/add-product"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/record-sale"
          element={
            <ProtectedRoute>
              <RecordSale />
            </ProtectedRoute>
          }
        />
        <Route
          path="/record-charging"
          element={
            <ProtectedRoute>
              <RecordCharging />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-workers"
          element={
            <ProtectedRoute requiredRole="owner">
              <ManageWorkers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner"
          element={
            <ProtectedRoute requiredRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-branch"
          element={
            <ProtectedRoute requiredRole="owner">
              <AddBranch />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
