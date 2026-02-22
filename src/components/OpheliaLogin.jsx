import React from "react";
import "./OpheliaLogin.css";
import logo from "../assets/ophelina_logo-sinFondo.png";

export default function OpheliaLogin() {
  return (
    <div className="login-container">
      <div className="overlay-pattern"></div>

      {/* LEFT SIDE LOGO */}
      <div className="left-section">
        <img src={logo} alt="Ophelia Logo" className="logo-image" />
      </div>

      {/* RIGHT SIDE LOGIN */}
      <div className="form-container">
  <p className="title">Iniciar Sesión</p>

  <form className="form">
    <input type="email" className="input" placeholder="Email" />
    <input type="password" className="input" placeholder="Contraseña" />

    <p className="page-link">
      <span className="page-link-label">¿Olvidaste tu contraseña?</span>
    </p>

    <button type="submit" className="form-btn">Ingresar</button>
  </form>

  <p className="sign-up-label">
    ¿No tienes cuenta? <span className="sign-up-link">Regístrate</span>
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
