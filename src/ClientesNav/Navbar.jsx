import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/O_blue.png";
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Usuario dinámico (luego backend)
  const [userName, setUserName] = useState("Suemy Gamboa");
  const [userEmail, setUserEmail] = useState("suemy.gamboa@email.com");
  const [userPhone, setUserPhone] = useState("+52 555 123 4567");
  
  // Estados para edición
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);
  const [editPhone, setEditPhone] = useState(userPhone);

  const handleToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const openEditModal = () => {
    setEditName(userName);
    setEditEmail(userEmail);
    setEditPhone(userPhone);
    setShowEditModal(true);
    setShowDropdown(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const saveUserInfo = () => {
    setUserName(editName);
    setUserEmail(editEmail);
    setUserPhone(editPhone);
    setShowEditModal(false);
  };

  // 🔹 Cerrar si haces click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowEditModal(false);
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

        {/* 🔥 LINKS VERSIÓN ESCRITORIO (TEXTO) */}
        <ul className="Ophe-navbar-links">
          <li>
            <NavLink
              to="/homecliente"
              className={({ isActive }) =>
                isActive
                  ? "Ophe-nav-item Ophe-active"
                  : "Ophe-nav-item"
              }
            >
              Inicio
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/misempenos"
              className={({ isActive }) =>
                isActive
                  ? "Ophe-nav-item Ophe-active"
                  : "Ophe-nav-item"
              }
            >
              Mis Empeños
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/tarjetas"
              className={({ isActive }) =>
                isActive
                  ? "Ophe-nav-item Ophe-active"
                  : "Ophe-nav-item"
              }
            >
              Tarjetas
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/ophelina"
              className={({ isActive }) =>
                isActive
                  ? "Ophe-nav-item Ophe-active"
                  : "Ophe-nav-item"
              }
            >
              Tienda
            </NavLink>
          </li>
        </ul>

        {/* 🔥 LINKS VERSIÓN MÓVIL (ICONOS) */}
        <ul className="Ophe-navbar-icons">
          <li>
            <NavLink
              to="/homecliente"
              className={({ isActive }) =>
                isActive
                  ? "Ophe-icon-item Ophe-icon-active"
                  : "Ophe-icon-item"
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
                isActive
                  ? "Ophe-icon-item Ophe-icon-active"
                  : "Ophe-icon-item"
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
                isActive
                  ? "Ophe-icon-item Ophe-icon-active"
                  : "Ophe-icon-item"
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
                isActive
                  ? "Ophe-icon-item Ophe-icon-active"
                  : "Ophe-icon-item"
              }
            >
              <StorefrontIcon />
              <span>Tienda</span>
            </NavLink>
          </li>
        </ul>

        {/* Usuario */}
        <div className="Ophe-navbar-user" ref={dropdownRef}>
          <div 
            className="Ophe-user-icon"
            onClick={handleToggle}
          >
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

              <div className="notification-item">
                <span className="bell-icon">
                  <NotificationsIcon sx={{ fontSize: 20, color: '#4A4A4A' }} />
                </span>
                <div className="notification-text">
                  <p className="main-text">Anillo de oro</p>
                  <p className="sub-text">Próximo en vencer</p>
                </div>
              </div>
              <div className="notification-item">
                <span className="bell-icon">
                  <NotificationsIcon sx={{ fontSize: 20, color: '#4A4A4A' }} />
                </span>
                <div className="notification-text">
                  <p className="main-text">Collar de plata</p>
                  <p className="sub-text">Vencido</p>
                </div>
              </div>
              <div className="notification-item">
                <span className="bell-icon">
                  <NotificationsIcon sx={{ fontSize: 20, color: '#4A4A4A' }} />
                </span>
                <div className="notification-text">
                  <p className="main-text">Arete de diamante</p>
                  <p className="sub-text">Nuevo articulo en tienda</p>
                </div>
              </div>
              <div className="divider"></div>

              <div 
                className="logout-section"
                onClick={handleLogout}
              >
                <LogoutIcon sx={{ fontSize: 20, marginRight: '8px' }} />
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

            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Nombre completo</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Tu nombre"
                />
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
            </div>
              <label></label> 
            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeEditModal}>Cancelar</button> 
              <button className="save-btn" onClick={saveUserInfo}>
                <SaveIcon sx={{ fontSize: 18}} />
                Guardar cambios
              </button> <label></label>
            </div>
            <label></label> 
          </div>
        </div>
      )}
    </nav>
  );
}