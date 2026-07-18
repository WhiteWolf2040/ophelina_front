// components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/LogoWhite.png";
import "./Sidebar.css";
import { logout } from "../config/auth";
import { useUser } from "../contexts/UserContext";
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

// Iconos
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PaymentsIcon from '@mui/icons-material/Payments';
import DiamondIcon from '@mui/icons-material/Diamond';
import InventoryIcon from '@mui/icons-material/Inventory';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { modules, loading, clearUserData } = useUser();

  // Mapeo de módulos en español
  const moduleMap = {
    'home': { path: '/home', icon: <HomeIcon />, text: 'Home' },
    'dashboard': { path: '/home', icon: <HomeIcon />, text: 'Home' },
    'clientes': { path: '/clientes', icon: <PeopleIcon />, text: 'Clientes' },
    'pagos': { path: '/pagos', icon: <PaymentsIcon />, text: 'Pagos' },
    'empenos': { path: '/empenos', icon: <DiamondIcon />, text: 'Empeños' },
    'inventario': { path: '/inventario', icon: <InventoryIcon />, text: 'Inventario' },
    'tienda': { path: '/tienda', icon: <StorefrontIcon />, text: 'Tienda en línea' },
    'reportes': { path: '/reportes', icon: <BarChartIcon />, text: 'Reportes' },
    'roles': { path: '/roles', icon: <SecurityIcon />, text: 'Roles' },
    'permisos': { path: '/permisos', icon: <VpnKeyIcon />, text: 'Permisos' },
    'configuracion': { path: '/configuracion', icon: <SettingsIcon />, text: 'Configuración' }
  };

  const getModuleName = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    if (typeof item === 'object') {
      if (item.modulo && typeof item.modulo === 'string') return item.modulo;
      if (item.nombre && typeof item.nombre === 'string') return item.nombre;
      if (item.text && typeof item.text === 'string') return item.text;
      if (item.path && typeof item.path === 'string') {
        const parts = item.path.split('/');
        return parts[parts.length - 1] || '';
      }
    }
    return String(item);
  };

  const getMenus = () => {
    if (!modules || modules.length === 0) {
      return [
        { path: '/home', icon: <HomeIcon />, text: 'Home' },
        { path: '/clientes', icon: <PeopleIcon />, text: 'Clientes' },
        { path: '/pagos', icon: <PaymentsIcon />, text: 'Pagos' },
        { path: '/empenos', icon: <DiamondIcon />, text: 'Empeños' },
        { path: '/tienda', icon: <StorefrontIcon />, text: 'Tienda en línea' },
        { path: '/reportes', icon: <BarChartIcon />, text: 'Reportes' },
        { path: '/roles', icon: <SecurityIcon />, text: 'Roles' },
        { path: '/permisos', icon: <VpnKeyIcon />, text: 'Permisos' },
        { path: '/configuracion', icon: <SettingsIcon />, text: 'Configuración' }
      ];
    }

    const result = [];
    const seen = new Set();

    for (const item of modules) {
      const name = getModuleName(item);
      if (!name) continue;
      
      const normalized = String(name).toLowerCase().trim();
      let mapped = moduleMap[normalized];
      
      if (!mapped) {
        for (const [key, value] of Object.entries(moduleMap)) {
          if (normalized.includes(key) || key.includes(normalized)) {
            mapped = value;
            break;
          }
        }
      }
      
      if (mapped && !seen.has(mapped.path)) {
        seen.add(mapped.path);
        result.push(mapped);
      } else if (!mapped) {
        const display = name.charAt(0).toUpperCase() + name.slice(1);
        const path = `/${normalized}`;
        if (!seen.has(path)) {
          seen.add(path);
          result.push({ path, icon: <HomeIcon />, text: display });
        }
      }
    }

    return result;
  };

  const menuItems = getMenus();

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(!isOpen);
    }
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    clearUserData();
    navigate("/login");
  };

  if (loading) {
    return (
      <aside className="sidebar">
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
      {/* Botón hamburguesa - SOLO visible en móvil */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <MenuIcon />
      </button>

      {/* Overlay oscuro al abrir en móvil */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-log">
            <img src={logo} alt="Ophelia Logo" className="log-image" />
          </div>
          <button className="close-btn" onClick={closeSidebar}>
            <CloseIcon />
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path} 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                {item.icon}
                <span>{item.text}</span>
              </NavLink>
            ))
          ) : (
            <div className="sidebar-no-modules">No hay módulos disponibles</div>
          )}

          <NavLink to="#" className="sidebar-link cerrar-sesion" onClick={handleLogout}>
            <LogoutIcon />
            <span>Cerrar sesión</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <p>Versión 2.0.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;