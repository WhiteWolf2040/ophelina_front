// OpheliaLogin.jsx
import React, { useState, useEffect } from "react";
import "./OpheliaLogin.css";
import logo from "../assets/ophelina_logo-sinFondo.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../config/auth";

export default function OpheliaLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ CAPTURAR PARÁMETROS DE STRIPE AL CARGAR EL LOGIN
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paymentStatus = searchParams.get('payment');
    
    console.log('🔍 Parámetros en login:', { sessionId, paymentStatus });
    
    if (sessionId && paymentStatus === 'success') {
      console.log('✅ Pago detectado en login!');
      // Guardar en localStorage para usarlo después del login
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

    // login DE auth.js
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Guardar permisos y módulos en localStorage
      if (result.data.permisos) {
        localStorage.setItem('permisos', JSON.stringify(result.data.permisos));
      }
      if (result.data.modulos) {
        localStorage.setItem('modulos', JSON.stringify(result.data.modulos));
      }
      
      // ✅ VERIFICAR SI HAY PAGO PENDIENTE
      const pendingSessionId = localStorage.getItem('pending_session_id');
      const pendingPayment = localStorage.getItem('pending_payment');
      
      if (pendingSessionId && pendingPayment === 'success') {
        console.log('✅ Pago pendiente detectado, redirigiendo a /home con parámetros');
        localStorage.removeItem('pending_session_id');
        localStorage.removeItem('pending_payment');
        // Redirigir a /home con los parámetros de pago
        window.location.href = `/home?session_id=${pendingSessionId}&payment=success`;
        setLoading(false);
        return;
      }
      
      // Redirigir según los permisos
      if (result.data.permisos?.includes('ver_dashboard')) {
        navigate("/home");
      } else {
        navigate("/homecliente");
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
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