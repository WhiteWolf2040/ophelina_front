// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "../config/auth";

export default function ProtectedRoute({ children, allowedRoles = [] }) {

  //  Si no está logueado → login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();

  // Validar roles
  if (allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.rol)) {

      if (user?.rol === "Cliente") {
        return <Navigate to="/homecliente" replace />;
      }

      return <Navigate to="/home" replace />;
    }
  }

  return children;
}