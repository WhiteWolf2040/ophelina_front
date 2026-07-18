// src/components/ProtectedRoute.jsx - VERSIÓN CON CONTEXT API
import { Navigate, useSearchParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [searchParams] = useSearchParams();
  
  //  OBTENER DATOS DEL CONTEXTO
  const { isAuthenticated, loading, userData, modules } = useUser();
  
  // OBTENER PARÁMETROS DE STRIPE
  const sessionId = searchParams.get('session_id');
  const paymentStatus = searchParams.get('payment');
  
  console.log(' ProtectedRoute - Verificando acceso...');
  console.log(' isAuthenticated:', isAuthenticated);
  console.log(' loading:', loading);
  console.log(' userData:', userData);
  console.log(' modules:', modules);
  console.log('session_id:', sessionId);
  console.log('payment:', paymentStatus);
  
  //  ESPERAR A QUE CARGUEN LOS DATOS
  if (loading) {
    console.log(' Cargando datos del usuario...');
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
  
  // PERMITIR ACCESO SI VIENE DE PAGO EXITOSO
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
  //  SI NO ESTÁ AUTENTICADO → LOGIN
  if (!isAuthenticated || !userData) {
    console.log('❌ Usuario no autenticado - Redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  //  VALIDAR ROLES
  console.log(' Usuario autenticado:', userData.rol);
  console.log(' Roles permitidos:', allowedRoles);

  if (allowedRoles.length > 0) {
    if (!allowedRoles.includes(userData.rol)) {
      console.log(' Rol no autorizado - Redirigiendo...');
      
      // Verificar si tiene dashboard
      const tieneDashboard = userData.permisos?.includes('ver_dashboard') || 
                            userData.rol === 'Administrador' || 
                            userData.rol === 'Admin' ||
                            userData.rol === 'Dueño';
      
      if (userData.rol === "Cliente") {
        return <Navigate to="/homecliente" replace />;
      } else if (tieneDashboard) {
        return <Navigate to="/home" replace />;
      } else {
        return <Navigate to="/homecliente" replace />;
      }
    }
  }

  //  ACCESO PERMITIDO
  console.log(' Acceso permitido');
  return children;
}