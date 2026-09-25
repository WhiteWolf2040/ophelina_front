// OpheliaRegister.jsx
import React, { useState } from "react";
import "./OpheliaRegister.css";
import logo from "../assets/ophelina_logo-sinFondo.png";
import { Link } from "react-router-dom";
import { buscarCodigoPostal } from "../services/postalCodeService";
import api from "../config/api"; //  NUEVO IMPORT
import { setAuthData } from "../config/auth";

export default function OpheliaRegister() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    negocio_nombre: "",
    correo: "",
    password: "",
    rfc: "",
    codigo_postal: "",
    ciudad: "",
    estado: "",
    direccion: "",
    colonia: ""
  });

  const [opcionesColonia, setOpcionesColonia] = useState([]);
  const [error, setError] = useState("");
  const [buscandoCP, setBuscandoCP] = useState(false);
  const [cpEncontrado, setCpEncontrado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "codigo_postal") {
      setCpEncontrado(false);
      const cpLimpio = value.replace(/\D/g, "").slice(0, 5);

      setFormData(prev => ({ ...prev, codigo_postal: cpLimpio }));

      if (cpLimpio.length === 5) {
        buscarCodigoPostalHandler(cpLimpio);
      } else {
        setFormData(prev => ({ 
          ...prev, 
          ciudad: "", 
          estado: "",
          colonia: ""
        }));
        setOpcionesColonia([]);
      }
    }
  };

  const buscarCodigoPostalHandler = async (cp) => {
    setBuscandoCP(true);
    setError("");

    try {
      const resultado = await buscarCodigoPostal(cp);

      if (resultado && resultado.colonias && resultado.colonias.length > 0) {
        setFormData(prev => ({
          ...prev,
          ciudad: resultado.ciudad,
          estado: resultado.estado,
          colonia: resultado.colonias.length === 1
            ? resultado.colonias[0].colonia
            : ""
        }));
        setOpcionesColonia(resultado.colonias);
        setCpEncontrado(true);
      } else {
        setFormData(prev => ({ ...prev, ciudad: "", estado: "", colonia: "" }));
        setOpcionesColonia([]);
        setError("No encontramos ese código postal, verifica que sea correcto");
      }
    } catch (err) {
      setError("No se pudo verificar el código postal, revisa tu conexión");
    } finally {
      setBuscandoCP(false);
    }
  };

  //  handleSubmit ACTUALIZADO: ahora usa axios (api) en vez de fetch nativo
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.nombre ||
    !formData.correo ||
    !formData.password ||
    !formData.negocio_nombre ||
    !formData.rfc
  ) {
    setError("Por favor completa los campos obligatorios");
    return;
  }

  setError("");

  try {
    // 1. Registrar la empresa y usuario
    const response = await api.post("/register", {
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono,
      negocio_nombre: formData.negocio_nombre,
      correo: formData.correo,
      password: formData.password,
      rfc: formData.rfc,
      codigo_postal: formData.codigo_postal,
      ciudad: formData.ciudad,
      estado: formData.estado,
      direccion: formData.direccion,
      colonia: formData.colonia
    });

    const { token } = response.data;

    // 2. Guarda el token temporalmente para que el interceptor de axios lo mande en la siguiente petición
    localStorage.setItem("token", token);

    // 3. Trae los datos completos del usuario (rol, permisos, módulos) igual que en login
    const userResponse = await api.get("/user");
    const usuario = userResponse.data.data.usuario;

    // 4. Guarda todo con la misma función que usa el login
    setAuthData(token, usuario);

    // 5. Ahora sí manda al dashboard, ya con rol/módulos cargados
    window.location.href = "/home";

  } catch (err) {
    console.error("Error en registro:", err);
    console.error("Detalles de validación:", err.response?.data);
    setError(err.response?.data?.message || "Error de conexión con el servidor");
  }
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
          <div className="form-row">
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
          </div>

          <input
            type="text"
            name="negocio_nombre"
            placeholder="Nombre de tu casa de empeño *"
            className="input"
            value={formData.negocio_nombre}
            onChange={handleChange}
          />

          <div className="form-row">
            <input
              type="text"
              name="rfc"
              placeholder="RFC de tu negocio *"
              className="input"
              maxLength={13}
              value={formData.rfc}
              onChange={(e) =>
                handleChange({
                  target: { name: "rfc", value: e.target.value.toUpperCase() }
                })
              }
            />

            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              className="input"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-row form-row-cp">
            <div className="cp-field">
              <input
                type="text"
                name="codigo_postal"
                placeholder="Código postal *"
                className="input"
                maxLength={5}
                value={formData.codigo_postal}
                onChange={handleChange}
              />

              {buscandoCP && (
                <span className="cp-hint cp-hint-loading">Buscando…</span>
              )}

              {cpEncontrado && (
                <span className="cp-hint cp-hint-success">
                  <svg viewBox="0 0 20 20" width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 10.5L8 14.5L16 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {formData.estado}
                </span>
              )}
            </div>

            <input
              type="text"
              name="direccion"
              placeholder="Calle y número"
              className="input"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>

          {opcionesColonia.length > 1 && (
            <div className="form-row">
              <select
                name="colonia"
                className="input"
                value={formData.colonia}
                onChange={handleChange}
              >
                <option value="">Selecciona tu colonia *</option>
                {opcionesColonia.map((c, index) => (
                  <option key={index} value={c.colonia}>
                    {c.colonia}
                  </option>
                ))}
              </select>
            </div>
          )}

          {opcionesColonia.length === 1 && (
            <div className="form-row">
              <input
                type="text"
                name="colonia"
                className="input"
                value={formData.colonia}
                disabled
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
          )}

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

          <p className="page-link" style={{ textAlign: "center", marginTop: "12px" }}>
            <span className="page-link-label">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" style={{ color: "#2e66f3", textDecoration: "underline" }}>
                Inicia sesión
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}