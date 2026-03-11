// Sidebar.jsx - Versión Mejorada
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/LogoWhite.png";
import "./Sidebar.css";

// Importar iconos de MUI
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PaymentsIcon from '@mui/icons-material/Payments';
import DiamondIcon from '@mui/icons-material/Diamond';
import InventoryIcon from '@mui/icons-material/Inventory';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Botón de menú móvil con icono MUI */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <MenuIcon className="menu-icon" />
      </button>

      {/* Overlay oscuro */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-log">
            <img src={logo} alt="Ophelia Logo" className="log-image" />
            
          </div>
          
          {/* Botón de colapsar (solo desktop) */}
          <button className="collapse-btn" onClick={toggleCollapse}>
            <MenuIcon className="collapse-icon" />
          </button>
          
          {/* Botón cerrar móvil */}
          <button className="close-btn" onClick={closeSidebar}>
            <CloseIcon />
          </button>
        </div>

        <nav className="sidebar-menu">
          <NavLink to="/home" className="sidebar-link" onClick={closeSidebar}>
            <HomeIcon className="sidebar-icon" />
            {!isCollapsed && <span className="link-text">Home</span>}
          </NavLink>

          <NavLink to="/clientes" className="sidebar-link" onClick={closeSidebar}>
            <PeopleIcon className="sidebar-icon" />
            {!isCollapsed && <span className="link-text">Clientes</span>}
          </NavLink>

          <NavLink to="/pagos" className="sidebar-link" onClick={closeSidebar}>
            <PaymentsIcon className="sidebar-icon" />
            {!isCollapsed && <span className="link-text">Pagos</span>}
          </NavLink>

          <NavLink to="/empenos" className="sidebar-link" onClick={closeSidebar}>
            <DiamondIcon className="sidebar-icon" />
            {!isCollapsed && <span className="link-text">Empeños</span>}
          </NavLink>

          <NavLink to="/inventario" className="sidebar-link" onClick={closeSidebar}>
            <InventoryIcon className="sidebar-icon" />
            {!isCollapsed && <span className="link-text">Inventario</span>}
          </NavLink>

          <NavLink to="/tienda" className="sidebar-link" onClick={closeSidebar}>
            <StorefrontIcon className="sidebar-icon" />
            {!isCollapsed && <span className="link-text">Tienda en línea</span>}
          </NavLink>

          <NavLink to="/reportes" className="sidebar-link" onClick={closeSidebar}>
            <BarChartIcon className="sidebar-icon" />
            {!isCollapsed && <span className="link-text">Reportes</span>}
          </NavLink>
          
           <NavLink to="/roles" className="sidebar-link" onClick={closeSidebar}>
          <SecurityIcon className="sidebar-icon" />
          {!isCollapsed && <span className="link-text">Roles</span>}
        </NavLink>

        <NavLink to="/permisos" className="sidebar-link" onClick={closeSidebar}>
          <VpnKeyIcon className="sidebar-icon" />
          {!isCollapsed && <span className="link-text">Permisos</span>}
        </NavLink>

          <NavLink to="/configuracion" className="sidebar-link" onClick={closeSidebar}>
            <SettingsIcon className="sidebar-icon" />
            {!isCollapsed && <span className="link-text">Configuración</span>}
          </NavLink>

          <NavLink to="/" className="sidebar-link cerrar-sesion" onClick={closeSidebar}>
            <LogoutIcon className="sidebar-icon" />
            {!isCollapsed && <span className="link-text">Cerrar sesión</span>}
          </NavLink>
        </nav>

        {/* Footer del sidebar con versión */}
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