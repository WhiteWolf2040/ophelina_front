import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/O_blue.png";
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Usuario dinámico (luego backend)
  const userName = "Suemy Gamboa";

  const handleToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  // 🔹 Cerrar si haces click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
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

        {/* 🔥 TUS CATEGORÍAS COMPLETAS */}
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

        {/* Usuario */}
        <div className="Ophe-navbar-user" ref={dropdownRef}>
          <div 
            className="Ophe-user-icon"
            onClick={handleToggle}
          >
            <PersonIcon sx={{ fontSize: 28 }} />
          </div>
          
          {showDropdown && (
            <div className="notification-dropdown">

              <div className="notification-header">
                <h4>{userName}</h4>
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
    </nav>
  );
}