// OpheliaLogin.jsx - VERSIÓN CORREGIDA
import React, { useState } from "react";
import "./OpheliaLogin.css";
import logo from "../assets/ophelina_logo-sinFondo.png";
import { useNavigate } from "react-router-dom";
import { login } from "../config/auth";

export default function OpheliaLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      
      // ============================================
      // VERIFICAR ESTRUCTURA DE LA RESPUESTA
      // ============================================
      console.log('Respuesta completa del login:', result);
      
      if (result.success) {
        // Obtener los datos del usuario de forma segura
        const userData = result.data?.usuario || result.data || result;
        
        console.log('Datos del usuario:', userData);
        
        // Guardar TODOS los datos del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Guardar permisos si existen
        if (userData.permisos) {
          localStorage.setItem('permisos', JSON.stringify(userData.permisos));
        } else {
          // Si no hay permisos, guardar array vacío
          localStorage.setItem('permisos', JSON.stringify([]));
        }
        
        // Guardar módulos si existen
        if (userData.modulos) {
          localStorage.setItem('modulos', JSON.stringify(userData.modulos));
        } else {
          localStorage.setItem('modulos', JSON.stringify([]));
        }
        
        // Guardar empresa_id
        if (userData.id_empresa) {
          localStorage.setItem('empresa_id', userData.id_empresa);
        }

        // Verificar si tiene token
        if (result.data?.token) {
          localStorage.setItem('token', result.data.token);
        }

        // Redirigir según el rol/permisos
        const tieneDashboard = userData.permisos?.includes('ver_dashboard') || 
                              userData.rol === 'Administrador' || 
                              userData.rol === 'Admin' ||
                              userData.rol === 'Dueño';
        
        if (tieneDashboard) {
          navigate("/home");
        } else {
          navigate("/homecliente");
        }
      } else {
        setError(result.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
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