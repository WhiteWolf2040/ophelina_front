// Sidebar.jsx - Versión con Context API
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/LogoWhite.png";
import "./Sidebar.css";
import { logout } from "../config/auth";
import { useUser } from "../contexts/UserContext";

// Iconos
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  
  // Obtener datos del contexto
  const { modules, loading, clearUserData } = useUser();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleLogout = async () => {
    await logout();
    clearUserData(); // Limpiar los datos del contexto
    navigate("/login");
  };

  if (loading) {
    return (
      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-log">
            <img src={logo} alt="Ophelia Logo" className="log-image" />
          </div>
        </div>
        <div className="sidebar-loading">Cargando...</div>
      </aside>
    );
  }

  return (
    <>
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <MenuIcon className="menu-icon" />
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-log">
            <img src={logo} alt="Ophelia Logo" className="log-image" />
          </div>

          <button className="collapse-btn" onClick={toggleCollapse}>
            <MenuIcon className="collapse-icon" />
          </button>

          <button className="close-btn" onClick={closeSidebar}>
            <CloseIcon />
          </button>
        </div>

        <nav className="sidebar-menu">
          {modules.length > 0 ? (
            modules.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path} 
                className="sidebar-link" 
                onClick={closeSidebar}
              >
                {item.icon}
                {!isCollapsed && <span>{item.text}</span>}
              </NavLink>
            ))
          ) : (
            <div className="sidebar-no-modules">
              {!isCollapsed && <span>No hay módulos disponibles</span>}
            </div>
          )}

          {/* Botón de cerrar sesión siempre visible */}
          <NavLink to="#" className="sidebar-link cerrar-sesion" onClick={handleLogout}>
            <LogoutIcon />
            {!isCollapsed && <span>Cerrar sesión</span>}
          </NavLink>
        </nav>

        {!isCollapsed && (
          <div className="sidebar-footer">
            <p>Versión 2.0.0</p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;