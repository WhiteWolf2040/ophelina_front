// OpheliaLogin.jsx - CON CONTEXT API
import React, { useState, useEffect } from "react";
import "./OpheliaLogin.css";
import logo from "../assets/ophelina_logo-sinFondo.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../config/auth";
import { useUser } from "../contexts/UserContext";

export default function OpheliaLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { refreshUserData } = useUser();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paymentStatus = searchParams.get('payment');
    
    console.log('🔍 Parámetros en login:', { sessionId, paymentStatus });
    
    if (sessionId && paymentStatus === 'success') {
      console.log('✅ Pago detectado en login!');
      localStorage.setItem('pending_session_id', sessionId);
      localStorage.setItem('pending_payment', 'success');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      console.log('📊 Respuesta completa del login:', result);
      
      if (result.success) {
        const userData = result.data?.usuario || result.data || result;
        
        console.log('👤 Datos del usuario:', userData);
        console.log('🎭 Rol del usuario:', userData.rol);
        
        // Guardar token
        if (result.data?.token) {
          localStorage.setItem('token', result.data.token);
        }

        // Guardar datos en localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (userData.permisos) {
          localStorage.setItem('permisos', JSON.stringify(userData.permisos));
        } else {
          localStorage.setItem('permisos', JSON.stringify([]));
        }
        
        if (userData.modulos) {
          localStorage.setItem('modulos', JSON.stringify(userData.modulos));
        } else {
          localStorage.setItem('modulos', JSON.stringify([]));
        }
        
        if (userData.id_empresa) {
          localStorage.setItem('empresa_id', userData.id_empresa);
        }

        // 🔥 REFRESCAR EL CONTEXTO
        console.log('🔄 Refrescando contexto del usuario...');
        await refreshUserData();

        // VERIFICAR PAGO PENDIENTE
        const pendingSessionId = localStorage.getItem('pending_session_id');
        const pendingPayment = localStorage.getItem('pending_payment');
        
        if (pendingSessionId && pendingPayment === 'success') {
          console.log('💰 Pago pendiente detectado');
          localStorage.setItem('stripe_session_id', pendingSessionId);
          localStorage.removeItem('pending_session_id');
          localStorage.removeItem('pending_payment');
          
          setLoading(false);
          window.location.href = `/home?session_id=${pendingSessionId}&payment=success`;
          return;
        }

        // ==========================================
        // ✅ REDIRECCIÓN SIMPLIFICADA POR ROL
        // ==========================================
        setLoading(false);
        
        // 🔥 Si es Cliente -> /homecliente
        if (userData.rol === 'Cliente') {
          console.log('🏠 Cliente detectado - Redirigiendo a /homecliente');
          navigate("/homecliente");
        } 
        // 🔥 Si es Administrador, Gerente, Cajero, etc. -> /home
        else {
          console.log('🏠 Admin/Empleado detectado - Redirigiendo a /home');
          navigate("/home");
        }
        
      } else {
        setError(result.message || "Error al iniciar sesión");
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      setError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <img src={logo} alt="Ophelia Logo" className="logo-image" />
      </div>
      
      <div className="r">
        <p className="title">Iniciar Sesión</p>

        {error && <div className="error-message">{error}</div>}

        <form className="form" onSubmit={handleLogin}>
          <input 
            type="email" 
            name="email"
            className="input" 
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <input 
            type="password" 
            name="password"
            className="input" 
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <p className="page-link">
            <span className="page-link-label">
              ¿Olvidaste tu contraseña?
            </span>
          </p>

          <button 
            type="submit" 
            className="form-btn"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}