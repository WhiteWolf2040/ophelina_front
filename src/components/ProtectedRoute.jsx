// src/components/ProtectedRoute.jsx - VERSIÓN FUSIONADA (Docker Base + Mejoras Local)
import { Navigate, useSearchParams } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "../config/auth";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [searchParams] = useSearchParams();
  
  //  OBTENER PARÁMETROS DE STRIPE (DE DOCKER)
  const sessionId = searchParams.get('session_id');
  const paymentStatus = searchParams.get('payment');
  
  console.log(' ProtectedRoute - Verificando acceso...');
  console.log(' session_id:', sessionId);
  console.log(' payment:', paymentStatus);
  
  //  PERMITIR ACCESO SI VIENE DE PAGO EXITOSO (DE DOCKER)
  // (incluso si el token no es válido, el usuario ya inició sesión antes)
  if (sessionId && paymentStatus === 'success') {
    console.log(' Pago exitoso detectado - Permitiendo acceso para procesar pago');
    
    // Verificar si al menos existe un token (aunque esté expirado)
    const token = localStorage.getItem('token');
    if (token) {
      // Permitir acceso para procesar el pago
      return children;
    } else {
      // Si no hay token, redirigir a login con los parámetros
      console.log(' No hay token - Redirigiendo a login');
      return <Navigate to={`/login?session_id=${sessionId}&payment=success`} replace />;
    }
  }

  //  Si no está logueado → login (MEJORADO CON LOCAL)
  if (!isAuthenticated()) {
    console.log(' Usuario no autenticado - Redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  //  MEJORADO CON LOCAL: Obtener usuario y validar roles
  const user = getCurrentUser();
  console.log('👤 Usuario autenticado:', user?.rol);

  //  Validar roles (MEJORADO CON LOCAL)
  if (allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.rol)) {
      console.log(' Rol no autorizado - Redirigiendo...');
    
      //  MEJORADO CON LOCAL: Verificar si el usuario tiene permisos de dashboard
      const tieneDashboard = user?.permisos?.includes('ver_dashboard') || 
                            user?.rol === 'Administrador' || 
                            user?.rol === 'Admin' ||
                            user?.rol === 'Dueño';
      
      if (user?.rol === "Cliente") {
        return <Navigate to="/homecliente" replace />;
      } else if (tieneDashboard) {
        // Si tiene permisos de dashboard pero no está en allowedRoles, ir a home
        return <Navigate to="/home" replace />;
      } else {
        // Si no tiene ningún permiso, ir a homecliente
        return <Navigate to="/homecliente" replace />;
      }
    }
  }

  console.log(' Acceso permitido');
  return children;
}