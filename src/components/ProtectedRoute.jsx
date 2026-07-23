// src/components/ProtectedRoute.jsx - VERSIÓN CORREGIDA
import { Navigate, useSearchParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading, userData, modules } = useUser();
  
  const sessionId = searchParams.get('session_id');
  const paymentStatus = searchParams.get('payment');
  
  console.log('🔍 ProtectedRoute - Verificando acceso...');
  console.log('📌 isAuthenticated:', isAuthenticated);
  console.log('📌 loading:', loading);
  console.log('📌 userData:', userData);
  console.log('📌 modules:', modules);
  console.log('📌 session_id:', sessionId);
  console.log('📌 payment:', paymentStatus);
  console.log('📌 allowedRoles:', allowedRoles);
  
  // Esperar a que carguen los datos
  if (loading) {
    console.log('⏳ Cargando datos del usuario...');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Cargando...</div>
      </div>
    );
  }
  
  // Permitir acceso si viene de pago exitoso
  if (sessionId && paymentStatus === 'success') {
    console.log(' Pago exitoso detectado - Permitiendo acceso');
    const token = localStorage.getItem('token');
    if (token) {
      return children;
    } else {
      console.log(' No hay token - Redirigiendo a login');
      return <Navigate to={`/login?session_id=${sessionId}&payment=success`} replace />;
    }
  }
  
  // Si no está autenticado → LOGIN
  if (!isAuthenticated || !userData) {
    console.log(' Usuario no autenticado - Redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  console.log(' Usuario autenticado:', userData.rol);
  console.log(' Roles permitidos:', allowedRoles);

  // ==========================================
  //  VALIDACIÓN DE ROLES
  // ==========================================
  if (allowedRoles.length > 0) {
    if (!allowedRoles.includes(userData.rol)) {
      console.log(' Rol no autorizado - Redirigiendo...');
      
      //  REDIRECCIÓN CORRECTA SEGÚN ROL
      if (userData.rol === "Cliente") {
        console.log(' Cliente - Redirigiendo a /homecliente');
        return <Navigate to="/homecliente" replace />;
      } else {
        console.log(' Admin/Empleado - Redirigiendo a /home');
        return <Navigate to="/home" replace />;
      }
    }
  }

  // ==========================================
  //  SI allowedRoles ESTÁ VACÍO (ruta sin restricción de rol)
  // ==========================================
  // Verificar si el usuario tiene dashboard (admin/empleado)
  const tieneDashboard = userData.permisos?.includes('ver_dashboard') || 
                         userData.rol === 'Administrador' || 
                         userData.rol === 'Admin' ||
                         userData.rol === 'Dueño' ||
                         userData.rol === 'Gerente' ||
                         userData.rol === 'Cajero';

  //  REDIRECCIÓN CORRECTA SEGÚN ROL
  if (userData.rol === "Cliente") {
    console.log(' Cliente - Redirigiendo a /homecliente');
    return <Navigate to="/homecliente" replace />;
  } else if (tieneDashboard) {
    console.log(' Admin/Empleado - Redirigiendo a /home');
    return <Navigate to="/home" replace />;
  } else {
    // Fallback - si no tiene dashboard ni es cliente, va a homecliente
    console.log(' Fallback - Redirigiendo a /homecliente');
    return <Navigate to="/homecliente" replace />;
  }

  // ==========================================
  //  ACCESO PERMITIDO
  // ==========================================
  console.log(' Acceso permitido');
  return children;
}