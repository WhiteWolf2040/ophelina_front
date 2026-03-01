import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/Ophelina_White.png";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>

      {/* Botón de hamburguesa para móvil */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Overlay oscuro cuando el menú está abierto */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src={logo} alt="Ophelia Logo" className="logo-image" />
          <button className="close-btn" onClick={closeSidebar}>×</button>
        </div>

        <nav className="sidebar-menu">
          <NavLink to="/home" className="sidebar-link" onClick={closeSidebar}>
            Dashboard
          </NavLink>
          <NavLink to="/clientes" className="sidebar-link" onClick={closeSidebar}>
            Clientes
          </NavLink>
          <NavLink to="/pagos" className="sidebar-link" onClick={closeSidebar}>
            Pagos
          </NavLink>
          <NavLink to="/empenos" className="sidebar-link" onClick={closeSidebar}>
            Empeños
          </NavLink>
          <NavLink to="/inventario" className="sidebar-link" onClick={closeSidebar}>
            Inventario
          </NavLink>
          <NavLink to="/tienda" className="sidebar-link" onClick={closeSidebar}>
            Tienda en líneax|
          </NavLink>
          <NavLink to="/reportes" className="sidebar-link" onClick={closeSidebar}>
            Reportes
          </NavLink>
          <NavLink to="/configuraciones" className="sidebar-link" onClick={closeSidebar}>
            Configuraciones
          </NavLink>
          <NavLink to="/" className="sidebar-link cerrar-sesion" onClick={closeSidebar}>
            Cerrar sesión
          </NavLink>
        </nav>
      </aside>

    </>
  );
};

export default Sidebar;