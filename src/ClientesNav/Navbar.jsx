import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/O_blue.png";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

// 🔥 Importamos las funciones de autenticación
import {
  getCurrentUser,
  updateProfile,
  logout as authLogout,
  getNotificaciones,
} from "../config/auth";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Estados del usuario (se cargan desde localStorage)
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");

  // 🔹 Estados para edición
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // 🔹 Estados de carga y mensajes
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // type: "success" | "error"

  // 🔔 Estados de notificaciones (ahora vienen del backend)
  const [notificaciones, setNotificaciones] = useState([]);
  const [loadingNotificaciones, setLoadingNotificaciones] = useState(true);

  // 🔹 Cargar datos del usuario desde localStorage al montar
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserName(user.nombre || user.name || "Usuario");
      setUserEmail(user.correo || user.email || "");
      setUserPhone(user.telefono || user.phone || "");
    }
  }, []);

  // 🔔 Cargar notificaciones reales desde el backend al montar
  useEffect(() => {
    const cargarNotificaciones = async () => {
      setLoadingNotificaciones(true);
      const result = await getNotificaciones();
      if (result.success) {
        setNotificaciones(result.data);
      }
      setLoadingNotificaciones(false);
    };

    cargarNotificaciones();
  }, []);

  // 🔹 Sincronizar editName, editEmail, editPhone cuando se abre el modal
  const openEditModal = () => {
    setEditName(userName);
    setEditEmail(userEmail);
    setEditPhone(userPhone);
    setMessage({ text: "", type: "" }); // limpiar mensajes anteriores
    setShowEditModal(true);
    setShowDropdown(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setMessage({ text: "", type: "" });
  };

  // 🔹 Guardar cambios con llamada al backend
  const saveUserInfo = async () => {
    // Validación básica
    if (!editEmail.trim() || !editPhone.trim()) {
      setMessage({ text: "Correo y teléfono son obligatorios", type: "error" });
      return;
    }

    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const result = await updateProfile(editEmail.trim(), editPhone.trim());

      if (result.success) {
        // Actualizar los estados locales con los datos del backend
        const updatedUser = result.data;
        setUserName(updatedUser.nombre || updatedUser.name || editName);
        setUserEmail(updatedUser.correo || updatedUser.email || editEmail);
        setUserPhone(updatedUser.telefono || updatedUser.phone || editPhone);

        setMessage({ text: "✅ Perfil actualizado correctamente", type: "success" });

        // Cerrar el modal después de 1.5 segundos (para que vea el mensaje)
        setTimeout(() => {
          setShowEditModal(false);
          setMessage({ text: "", type: "" });
        }, 1500);
      } else {
        setMessage({ text: result.message || "Error al actualizar", type: "error" });
      }
    } catch (error) {
      setMessage({
        text: error.message || "Error de conexión con el servidor",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    authLogout();
    navigate("/login");
  };

  // 🔹 Cerrar si haces click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowEditModal(false);
        setMessage({ text: "", type: "" });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="Ophe-navbar">
      <div className="Ophe-navbar-container">
        {/* Logo */}
        <div className="Ophe-navbar-logo">
          <img src={logo} alt="Ophelina Logo" />
        </div>

        {/* 🔥 LINKS ESCRITORIO */}
        <ul className="Ophe-navbar-links">
          <li>
            <NavLink
              to="/homecliente"
              className={({ isActive }) =>
                isActive ? "Ophe-nav-item Ophe-active" : "Ophe-nav-item"
              }
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/misempenos"
              className={({ isActive }) =>
                isActive ? "Ophe-nav-item Ophe-active" : "Ophe-nav-item"
              }
            >
              Mis Empeños
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ophelina"
              className={({ isActive }) =>
                isActive ? "Ophe-nav-item Ophe-active" : "Ophe-nav-item"
              }
            >
              Tienda
            </NavLink>
          </li>
        </ul>

        {/* 🔥 LINKS MÓVIL (ICONOS) */}
        <ul className="Ophe-navbar-icons">
          <li>
            <NavLink
              to="/homecliente"
              className={({ isActive }) =>
                isActive ? "Ophe-icon-item Ophe-icon-active" : "Ophe-icon-item"
              }
            >
              <HomeIcon />
              <span>Inicio</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/misempenos"
              className={({ isActive }) =>
                isActive ? "Ophe-icon-item Ophe-icon-active" : "Ophe-icon-item"
              }
            >
              <ShoppingBagIcon />
              <span>Empeños</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tarjetas"
              className={({ isActive }) =>
                isActive ? "Ophe-icon-item Ophe-icon-active" : "Ophe-icon-item"
              }
            >
              <CreditCardIcon />
              <span>Tarjetas</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ophelina"
              className={({ isActive }) =>
                isActive ? "Ophe-icon-item Ophe-icon-active" : "Ophe-icon-item"
              }
            >
              <StorefrontIcon />
              <span>Tienda</span>
            </NavLink>
          </li>
        </ul>

        {/* Usuario */}
        <div className="Ophe-navbar-user" ref={dropdownRef}>
          <div className="Ophe-user-icon" onClick={handleToggle}>
            <PersonIcon sx={{ fontSize: 28 }} />
          </div>

          {showDropdown && (
            <div className="notification-dropdown gold-border">
              <div className="notification-header">
                <h4>{userName}</h4>
                <button className="edit-profile-btn" onClick={openEditModal}>
                  <EditIcon sx={{ fontSize: 16 }} />
                </button>
              </div>

              <div className="divider"></div>

              {/* 🔔 Notificaciones dinámicas desde el backend */}
              {loadingNotificaciones ? (
                <div className="notification-item">
                  <div className="notification-text">
                    <p className="sub-text">Cargando notificaciones...</p>
                  </div>
                </div>
              ) : notificaciones.length === 0 ? (
                <div className="notification-item">
                  <div className="notification-text">
                    <p className="sub-text">No tienes notificaciones</p>
                  </div>
                </div>
              ) : (
                notificaciones.map((notif, index) => (
                  <div className="notification-item" key={index}>
                    <span className="bell-icon">
                      <NotificationsIcon sx={{ fontSize: 20, color: "#4A4A4A" }} />
                    </span>
                    <div className="notification-text">
                      <p className="main-text">{notif.titulo}</p>
                      <p className="sub-text">{notif.subtitulo}</p>
                    </div>
                  </div>
                ))
              )}

              <div className="divider"></div>

              <div className="logout-section" onClick={handleLogout}>
                <LogoutIcon sx={{ fontSize: 20, marginRight: "8px" }} />
                <p>Cerrar sesión</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición de perfil */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal gold-border" ref={modalRef}>
            <div className="ophe-modal-header">
              <h3>Editar perfil</h3>
              <button className="close-modal-btn" onClick={closeEditModal}>
                <CloseIcon />
              </button>
            </div>

            <div className="modal-body">
              {/* Campo Nombre: BLOQUEADO (solo lectura) */}
              <div className="form-group">
                <label>Nombre completo</label>
                <input
                  type="text"
                  value={editName}
                  readOnly
                  disabled
                  style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                />
                <small style={{ color: "#888" }}>El nombre no se puede modificar</small>
              </div>

              <div className="form-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+52 555 123 4567"
                />
              </div>

              {/* Mensaje de éxito/error */}
              {message.text && (
                <div
                  className={`edit-message ${message.type}`}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    marginTop: "12px",
                    backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
                    color: message.type === "success" ? "#155724" : "#721c24",
                    border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                  }}
                >
                  {message.text}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeEditModal} disabled={isSaving}>
                Cancelar
              </button>
              <button
                className="save-btn"
                onClick={saveUserInfo}
                disabled={isSaving}
              >
                <SaveIcon sx={{ fontSize: 18 }} />
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
