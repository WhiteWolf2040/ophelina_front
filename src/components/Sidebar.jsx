// Sidebar.jsx - Versión corregida
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/LogoWhite.png";
import "./Sidebar.css";
import { logout } from "../config/auth";
import permissionService from "../services/permisoService";

// Iconos
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
  const [visibleMenus, setVisibleMenus] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const calcularMenusVisibles = () => {
      const menus = [];
      
      // Obtener permisos
      const permisos = permissionService.getPermissions();
      console.log('Permisos disponibles:', permisos);
      
      // Dashboard - requiere permiso ver_dashboard
      if (permisos.includes('ver_dashboard')) {
        menus.push({ path: "/home", icon: <HomeIcon />, text: "Home" });
      }
      
      // Clientes - requiere permiso ver_clientes
      if (permisos.includes('ver_clientes')) {
        menus.push({ path: "/clientes", icon: <PeopleIcon />, text: "Clientes" });
      }
      
      // Pagos - requiere permiso ver_pagos
      if (permisos.includes('ver_pagos')) {
        menus.push({ path: "/pagos", icon: <PaymentsIcon />, text: "Pagos" });
      }
      
      // Empeños - requiere permiso ver_empenos
      if (permisos.includes('ver_empenos')) {
        menus.push({ path: "/empenos", icon: <DiamondIcon />, text: "Empeños" });
      }
      
      // Inventario - requiere permiso ver_inventario
      if (permisos.includes('ver_inventario')) {
        menus.push({ path: "/inventario", icon: <InventoryIcon />, text: "Inventario" });
      }
      
      // Tienda - requiere permiso ver_tienda
      if (permisos.includes('ver_tienda')) {
        menus.push({ path: "/tienda", icon: <StorefrontIcon />, text: "Tienda en línea" });
      }
      
      // Reportes - requiere permiso ver_reportes
      if (permisos.includes('ver_reportes')) {
        menus.push({ path: "/reportes", icon: <BarChartIcon />, text: "Reportes" });
      }
      
      // Roles - verifica si tiene permisos de roles (cualquiera de estos)
      const tienePermisoRoles = permisos.includes('gestionar_roles') || 
                                  permisos.includes('Rol') || 
                                  permisos.includes('ver_roles');
      if (tienePermisoRoles) {
        menus.push({ path: "/roles", icon: <SecurityIcon />, text: "Roles" });
      }
      
      // Permisos - verifica si tiene permisos de permisos
      const tienePermisoPermisos = permisos.includes('gestionar_roles') || 
                                    permisos.includes('Permiso') || 
                                    permisos.includes('ver_permisos');
      if (tienePermisoPermisos) {
        menus.push({ path: "/permisos", icon: <VpnKeyIcon />, text: "Permisos" });
      }
      
      // Configuración - requiere permiso ver_configuracion
      if (permisos.includes('ver_configuracion')) {
        menus.push({ path: "/configuracion", icon: <SettingsIcon />, text: "Configuración" });
      }
      
      setVisibleMenus(menus);
    };
    
    calcularMenusVisibles();
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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
          {visibleMenus.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path} 
              className="sidebar-link" 
              onClick={closeSidebar}
            >
              {item.icon}
              {!isCollapsed && <span>{item.text}</span>}
            </NavLink>
          ))}

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