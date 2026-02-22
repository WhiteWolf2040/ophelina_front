import React, { useState } from "react";
import "./OpheliaRegister.css";
import logo from "../assets/ophelina_logo-sinFondo.png";
import { Link } from "react-router-dom";

export default function OpheliaRegister() {

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    correo: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica frontend
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.correo ||
      !formData.password
    ) {
      setError("Por favor completa los campos obligatorios");
      return;
    }

    setError("");

    console.log("Datos listos para enviar al backend:", formData);

    alert("Formulario validado correctamente (solo frontend)");

    // AQUÍ IRÍA LA PETICIÓN AL BACKEND
    /*
    fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    */
  };

  return (
    <div className="login-container">
      <div className="overlay-pattern"></div>

      <div className="left-section">
        <img src={logo} alt="Ophelia Logo" className="logo-image" />
      </div>

      <div className="form-container">
        <p className="title">Crear Cuenta</p>

        <form className="form" onSubmit={handleSubmit}>

          <input
            type="text"
            name="nombre"
            placeholder="Nombre *"
            className="input"
            value={formData.nombre}
            onChange={handleChange}
          />

          <input
            type="text"
            name="apellido"
            placeholder="Apellido *"
            className="input"
            value={formData.apellido}
            onChange={handleChange}
          />

          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            className="input"
            value={formData.telefono}
            onChange={handleChange}
          />

          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            className="input"
            value={formData.direccion}
            onChange={handleChange}
          />

          <input
            type="email"
            name="correo"
            placeholder="Correo *"
            className="input"
            value={formData.correo}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña *"
            className="input"
            value={formData.password}
            onChange={handleChange}
          />

          {error && (
            <p style={{ color: "red", fontSize: "12px", textAlign: "center" }}>
              {error}
            </p>
          )}

          <button type="submit" className="form-btn">
            Registrarse
          </button>

        </form>

        <div className="buttons-container">
          <div
            className="google-login-button"
            onClick={() => alert("Aquí iría la integración con Google")}
          >
            <span>Registrarse con Google</span>
          </div>
        </div>

      </div>
    </div>
  );
}