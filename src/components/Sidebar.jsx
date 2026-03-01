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
      {/* Botón hamburguesa para móvil */}
      <button 
        className={`sidebar-toggle ${isOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
        aria-label="Menú"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src={logo} alt="Ophelia Logo" className="logo-image" />
          
        </div>

        <nav className="sidebar-menu">
          <NavLink 
            to="/home" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Dashboard
          </NavLink>

          <NavLink 
            to="/clientes" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Clientes
          </NavLink>

          <NavLink 
            to="/pagos" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Pagos
          </NavLink>

          <NavLink 
            to="/empenos" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Empeños
          </NavLink>
          
          <NavLink 
            to="/inventario" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Inventario
          </NavLink>

          <NavLink 
            to="/tienda" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Tienda en línea
          </NavLink>

          <NavLink 
            to="/reportes" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Reportes
          </NavLink>

          <NavLink 
            to="/configuracion" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Configuraciones
          </NavLink>

          <NavLink 
            to="/" 
            className="sidebar-link logout"
            onClick={closeSidebar}
          >
            Cerrar sesión
          </NavLink>
        </nav>
      </div>

      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;