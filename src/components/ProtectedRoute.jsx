// src/components/ProtectedRoute.jsx
import { Navigate, useSearchParams } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "../config/auth";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [searchParams] = useSearchParams();
  
  // ✅ OBTENER PARÁMETROS DE STRIPE
  const sessionId = searchParams.get('session_id');
  const paymentStatus = searchParams.get('payment');
  
  console.log('🔒 ProtectedRoute - Verificando acceso...');
  console.log('📌 session_id:', sessionId);
  console.log('📌 payment:', paymentStatus);
  
  // ✅ PERMITIR ACCESO SI VIENE DE PAGO EXITOSO
  // (incluso si el token no es válido, el usuario ya inició sesión antes)
  if (sessionId && paymentStatus === 'success') {
    console.log('✅ Pago exitoso detectado - Permitiendo acceso para procesar pago');
    
    // Verificar si al menos existe un token (aunque esté expirado)
    const token = localStorage.getItem('token');
    if (token) {
      // Permitir acceso para procesar el pago
      return children;
    } else {
      // Si no hay token, redirigir a login con los parámetros
      console.log('⚠️ No hay token - Redirigiendo a login');
      return <Navigate to={`/login?session_id=${sessionId}&payment=success`} replace />;
    }
  }

  // 🔒 Si no está logueado → login
  if (!isAuthenticated()) {
    console.log('🔒 Usuario no autenticado - Redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();
  console.log('👤 Usuario autenticado:', user?.rol);

  // 🔒 Validar roles
  if (allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.rol)) {
      console.log('🔒 Rol no autorizado - Redirigiendo...');
      if (user?.rol === "Cliente") {
        return <Navigate to="/homecliente" replace />;
      }
      return <Navigate to="/home" replace />;
    }
  }

  console.log('✅ Acceso permitido');
  return children;
}