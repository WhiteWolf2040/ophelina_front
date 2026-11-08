// Sidebar.jsx - Versión CORREGIDA con permisos reales
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/LogoWhite.png";
import "./Sidebar.css";
import { logout } from "../config/auth";
import { usePermissions } from "../hooks/usePermissions";

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
  
  // ============================================
  // HOOK DE PERMISOS - PARA VERIFICAR ACCESO
  // ============================================
  const { 
    hasPermission, 
    hasModule, 
    permisos, 
    modulos,
    userRole,
    loading 
  } = usePermissions();

  const navigate = useNavigate();

  // ============================================
  // DEFINICIÓN DE TODOS LOS MENÚS POSIBLES
  // ============================================
  const allMenus = [
    { 
      path: "/home", 
      icon: <HomeIcon />, 
      text: "Dashboard", 
      modulo: "dashboard",
      permission: null // Siempre visible
    },
    { 
      path: "/clientes", 
      icon: <PeopleIcon />, 
      text: "Clientes", 
      modulo: "clientes",
      permission: "ver_clientes"
    },
    { 
      path: "/empenos", 
      icon: <DiamondIcon />, 
      text: "Empeños", 
      modulo: "empenos",
      permission: "ver_empenos"
    },
    { 
      path: "/tienda", 
      icon: <StorefrontIcon />, 
      text: "Tienda", 
      modulo: "tienda",
      permission: "ver_tienda"
    },
    { 
      path: "/pagos", 
      icon: <PaymentsIcon />, 
      text: "Pagos", 
      modulo: "pagos",
      permission: "ver_pagos"
    },
    { 
      path: "/reportes", 
      icon: <BarChartIcon />, 
      text: "Reportes", 
      modulo: "reportes",
      permission: "ver_reportes"
    },
    { 
      path: "/configuracion", 
      icon: <SettingsIcon />, 
      text: "Configuración", 
      modulo: "configuracion",
      permission: "ver_configuracion"
    },
    { 
      path: "/roles", 
      icon: <SecurityIcon />, 
      text: "Roles", 
      modulo: "configuracion",
      permission: "ver_roles"
    },
    { 
      path: "/permisos", 
      icon: <VpnKeyIcon />, 
      text: "Permisos", 
      modulo: "configuracion",
      permission: "ver_permisos"
    }
  ];

  // ============================================
  // FILTRAR MENÚS POR PERMISOS DEL USUARIO
  // ============================================
  const getVisibleMenus = () => {
    // Si está cargando, mostrar solo Home
    if (loading) {
      return allMenus.filter(m => m.path === "/home");
    }

    // Administrador ve TODO
    if (userRole === 'Administrador' || userRole === 'Admin' || userRole === 'Dueño') {
      return allMenus;
    }

    // Para otros roles, filtrar por permisos
    return allMenus.filter(menu => {
      // Home siempre visible
      if (menu.path === "/home") return true;
      
      // Si tiene permiso específico
      if (menu.permission) {
        return hasPermission(menu.permission);
      }
      
      // Si tiene módulo
      if (menu.modulo) {
        return hasModule(menu.modulo);
      }
      
      return false;
    });
  };

  const visibleMenus = getVisibleMenus();

  // ============================================
  // FUNCIONES DEL SIDEBAR
  // ============================================
  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleLogout = async () => {
    await logout();
    // Limpiar permisos al cerrar sesión
    localStorage.removeItem('permisos');
    localStorage.removeItem('modulos');
    localStorage.removeItem('user');
    navigate("/login");
  };

  // ============================================
  // RENDER - ESTADO DE CARGA
  // ============================================
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

  // ============================================
  // RENDER - SIDEBAR COMPLETO
  // ============================================
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
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
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
            {userRole && (
              <p className="sidebar-rol">
                <small>Rol: {userRole}</small>
              </p>
            )}
            {permisos.length > 0 && (
              <p className="sidebar-permisos-count">
                <small>{permisos.length} permisos activos</small>
              </p>
            )}
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;