// src/components/ProtectedRoute.jsx - VERSIÓN CORREGIDA
import { Navigate, useSearchParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading, userData, modules } = useUser();

  const sessionId = searchParams.get('session_id');
  const paymentStatus = searchParams.get('payment');

  // Esperar a que carguen los datos
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Cargando...</div>
      </div>
    );
  }

  // Permitir acceso si viene de pago exitoso
  if (sessionId && paymentStatus === 'success') {
    const token = localStorage.getItem('token');
    if (token) {
      return children;
    }
    return <Navigate to={`/login?session_id=${sessionId}&payment=success`} replace />;
  }

  // Si no está autenticado → LOGIN
  if (!isAuthenticated || !userData) {
    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // VALIDACIÓN DE ROLES (con return correcto)
  // ==========================================
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