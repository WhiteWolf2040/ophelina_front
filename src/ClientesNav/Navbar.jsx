import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import "./Editprofilemodal.css"; // Todo en minúsculas excepto la E
import logo from "../assets/O_blue.png";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

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

  // 🔔 Estados de notificaciones (vienen del backend)
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

  // 🔹 Sincronizar campos de edición cuando se abre el modal
  const openEditModal = () => {
    setEditName(userName);
    setEditEmail(userEmail);
    setEditPhone(userPhone);
    setMessage({ text: "", type: "" });
    setShowEditModal(true);
    setShowDropdown(false);
  };

  const closeEditModal = () => {
    if (isSaving) return; // no cerrar mientras guarda
    setShowEditModal(false);
    setMessage({ text: "", type: "" });
  };

  // 🔹 Guardar cambios con llamada al backend
  const saveUserInfo = async () => {
    if (!editEmail.trim() || !editPhone.trim()) {
      setMessage({ text: "Correo y teléfono son obligatorios", type: "error" });
      return;
    }

    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const result = await updateProfile(editEmail.trim(), editPhone.trim());

      if (result.success) {
        const updatedUser = result.data;
        setUserName(updatedUser.nombre || updatedUser.name || editName);
        setUserEmail(updatedUser.correo || updatedUser.email || editEmail);
        setUserPhone(updatedUser.telefono || updatedUser.phone || editPhone);

        setMessage({ text: "✅ Perfil actualizado correctamente", type: "success" });

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

  // 🔹 Cerrar el dropdown si haces click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Con el modal abierto: bloquear el scroll de la página y cerrar con Escape
  useEffect(() => {
    if (!showEditModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !isSaving) {
        setShowEditModal(false);
        setMessage({ text: "", type: "" });
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showEditModal, isSaving]);

  // 🔹 Click en el fondo oscuro (no dentro del modal) = cerrar
  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) closeEditModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveUserInfo();
  };

  // 🔹 Modal: se renderiza en <body> con un portal para que no quede
  //    atrapado dentro del <nav> sticky (que crea su propio stacking context)
  const editModal = (
    <div className="pf-overlay" onMouseDown={handleOverlayMouseDown}>
      <div
        className="pf-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pf-title"
      >
        <header className="pf-header">
          <h3 id="pf-title">Editar perfil</h3>
          <button
            type="button"
            className="pf-close"
            onClick={closeEditModal}
            aria-label="Cerrar"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </header>

        <form className="pf-form" onSubmit={handleSubmit}>
          <div className="pf-body">
            {/* Nombre: solo lectura */}
            <div className="pf-field">
              <label htmlFor="pf-name">Nombre completo</label>
              <div className="pf-input-wrap">
                <input id="pf-name" type="text" value={editName} readOnly disabled />
                <PersonIcon className="pf-input-icon" sx={{ fontSize: 20 }} />
              </div>
              <small className="pf-hint">El nombre no se puede modificar</small>
            </div>

            <div className="pf-field">
              <label htmlFor="pf-email">Correo electrónico</label>
              <div className="pf-input-wrap">
                <input
                  id="pf-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="tu@email.com"
                />
                <EmailIcon className="pf-input-icon" sx={{ fontSize: 20 }} />
              </div>
            </div>

            <div className="pf-field">
              <label htmlFor="pf-phone">Teléfono</label>
              <div className="pf-input-wrap">
                <input
                  id="pf-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+52 555 123 4567"
                />
                <PhoneIcon className="pf-input-icon" sx={{ fontSize: 20 }} />
              </div>
            </div>

            {message.text && (
              <div className={`pf-message pf-message--${message.type}`}>
                {message.text}
              </div>
            )}
          </div>

          <footer className="pf-footer">
            <button
              type="button"
              className="pf-btn pf-btn--cancel"
              onClick={closeEditModal}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button type="submit" className="pf-btn pf-btn--save" disabled={isSaving}>
              <SaveIcon sx={{ fontSize: 18 }} />
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );

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

              <div className="notification-list-scroll">
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
              </div>

              <div className="divider"></div>

              <div className="logout-section" onClick={handleLogout}>
                <LogoutIcon sx={{ fontSize: 20, marginRight: "8px" }} />
                <p>Cerrar sesión</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showEditModal && createPortal(editModal, document.body)}
    </nav>
  );
}
