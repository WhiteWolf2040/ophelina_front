// src/components/ProtectedRoute.jsx - VERSIÓN CORREGIDA
import { Navigate, useSearchParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading, userData, modules } = useUser();

  //  Si no está logueado → login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();

  // Validar roles
  if (allowedRoles.length > 0) {
    if (allowedRoles.includes(userData.rol)) {
      // ✅ Tiene el rol correcto para esta ruta: mostrar el contenido y salir
      return children;
    }

    // ❌ No tiene el rol correcto: redirige según su tipo de usuario
    if (userData.rol === "Cliente") {
      return <Navigate to="/homecliente" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  // ==========================================
  // Si la ruta NO tiene restricción de rol (allowedRoles vacío)
  // ==========================================
  const tieneDashboard =
    userData.permisos?.includes('ver_dashboard') ||
    ['Administrador', 'Admin', 'Dueño', 'Gerente', 'Cajero'].includes(userData.rol);

  if (userData.rol === "Cliente") {
    return <Navigate to="/homecliente" replace />;
  }
  if (tieneDashboard) {
    return <Navigate to="/home" replace />;
  }
  return <Navigate to="/homecliente" replace />;
}