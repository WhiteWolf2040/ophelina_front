// components/Sidebar.jsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from "react";
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { modules, loading, clearUserData } = useUser();

  // Mapeo de módulos en español (FORZADO)
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

  // 🔥 CORRECCIÓN: Forzar nombres en español
  const getMenus = () => {
    if (!modules || modules.length === 0) {
      // Si no hay módulos, mostrar los del plan Premium por defecto
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

    return modules
      .map(item => {
        // Si el módulo viene como objeto o string
        const moduleName = typeof item === 'string' ? item : item.modulo || item.nombre || item;
        const normalizedName = moduleName.toLowerCase().trim();
        
        // Buscar en el mapa, si no existe, usar el nombre original
        const mapped = moduleMap[normalizedName];
        if (mapped) {
          return mapped;
        }
        
        // Si no está en el mapa, intentar encontrar por coincidencia parcial
        for (const [key, value] of Object.entries(moduleMap)) {
          if (normalizedName.includes(key) || key.includes(normalizedName)) {
            return value;
          }
        }
        
        // Si no se encuentra, crear un item genérico
        return {
          path: `/${normalizedName}`,
          icon: <HomeIcon />,
          text: moduleName.charAt(0).toUpperCase() + moduleName.slice(1)
        };
      })
      .filter(item => item !== undefined);
  };

  const menuItems = getMenus();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (window.innerWidth <= 768) {
      setIsCollapsed(!isCollapsed);
    }
  };
  
  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
      setIsCollapsed(false);
    }
  };
  
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleLogout = async () => {
    await logout();
    clearUserData();
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
        {isOpen ? <CloseIcon /> : <MenuIcon />}
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
          {menuItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path} 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              {item.icon}
              {!isCollapsed && <span>{item.text}</span>}
            </NavLink>
          ))}

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