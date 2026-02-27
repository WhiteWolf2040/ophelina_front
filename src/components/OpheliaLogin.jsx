import React from "react";
import "./OpheliaLogin.css";
import logo from "../assets/ophelina_logo-sinFondo.png";
import { Link, useNavigate } from "react-router-dom";

export default function OpheliaLogin() {

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // evita que recargue la página

    // Aquí después irá tu lógica real de login
    // Por ahora solo redirige al home
    navigate("/home");
  };

  return (
    <div className="login-container">
      <div className="overlay-pattern"></div>

      <div className="left-section">
        <img src={logo} alt="Ophelia Logo" className="logo-image" />
      </div>

      <div className="form-container">
        <p className="title">Iniciar Sesión</p>

        <form className="form" onSubmit={handleLogin}>
          <input type="email" className="input" placeholder="Email" />
          <input type="password" className="input" placeholder="Contraseña" />

          <p className="page-link">
            <span className="page-link-label">
              ¿Olvidaste tu contraseña?
            </span>
          </p>

          <button type="submit" className="form-btn">
            Ingresar
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