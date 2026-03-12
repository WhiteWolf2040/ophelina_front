// OpheliaLogin.jsx
import React, { useState } from "react";
import "./OpheliaLogin.css";
import logo from "../assets/ophelina_logo-sinFondo.png";
import { Link, useNavigate } from "react-router-dom";
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

    // 👇 USA LA FUNCIÓN login DE auth.js
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Redirigir según el rol
      if (result.data.rol === 'Dueño' || result.data.rol === 'Administrador') {
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

        <p className="sign-up-label">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="sign-up-link">
            Regístrate
          </Link>
        </p>

        <div className="buttons-container">
          <div className="google-login-button">
            <span>Continuar con Google</span>
          </div>
        </div>
      </div>
    </div>
  );
}