// components/Sidebar.jsx - VERSIÓN DEFINITIVA (CON MANEJO DE ERRORES)
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

// 🔥 MENÚS POR DEFECTO (SIEMPRE DISPONIBLES)
const DEFAULT_MENUS = [
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

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState(DEFAULT_MENUS);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Intentar obtener el contexto, pero si falla, usar valores por defecto
  let userContext;
  try {
    userContext = useUser();
  } catch (error) {
    console.log('⚠️ Contexto de usuario no disponible, usando menús por defecto');
    userContext = { modules: DEFAULT_MENUS, loading: false, clearUserData: () => {} };
  }

  const { modules, loading, clearUserData } = userContext;

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

  // 🔥 Función segura para obtener el nombre del módulo
  const getModuleName = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    if (typeof item === 'object') {
      const keys = ['modulo', 'nombre', 'name', 'text', 'label', 'id', 'key'];
      for (const key of keys) {
        if (item[key] && typeof item[key] === 'string') {
          return item[key];
        }
      }
      if (item.path && typeof item.path === 'string') {
        const parts = item.path.split('/');
        return parts[parts.length - 1] || '';
      }
    }
    return String(item);
  };

  // 🔥 Función para obtener los menús
  const getMenus = () => {
    // Si está cargando, mostrar los menús por defecto
    if (loading || !modules || modules.length === 0) {
      return DEFAULT_MENUS;
    }

    const result = [];
    const seen = new Set();

    for (const item of modules) {
      let name = getModuleName(item);
      if (!name) continue;
      
      const normalizedName = String(name).toLowerCase().trim();
      let mapped = moduleMap[normalizedName];
      
      if (!mapped) {
        for (const [key, value] of Object.entries(moduleMap)) {
          if (normalizedName.includes(key) || key.includes(normalizedName)) {
            mapped = value;
            break;
          }
        }
      }
      
      if (mapped && !seen.has(mapped.path)) {
        seen.add(mapped.path);
        result.push(mapped);
      } else if (!mapped) {
        const displayName = String(name).charAt(0).toUpperCase() + String(name).slice(1);
        const path = `/${normalizedName}`;
        if (!seen.has(path)) {
          seen.add(path);
          result.push({ path, icon: <HomeIcon />, text: displayName });
        }
      }
    }

    return result.length > 0 ? result : DEFAULT_MENUS;
  };

  // 🔥 Actualizar menús cuando cambien los módulos
  useEffect(() => {
    setIsLoading(true);
    const menus = getMenus();
    setMenuItems(menus);
    setIsLoading(false);
  }, [modules, loading]);

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
    if (clearUserData) clearUserData();
    navigate("/login");
  };

  // 🔥 Mostrar loader mientras carga
  if (loading || isLoading) {
    return (
      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-log">
            <img src={logo} alt="Ophelia Logo" className="log-image" />
          </div>
        </div>
        <div className="sidebar-loading">
          <div className="loader-spinner"></div>
          <span>Cargando...</span>
        </div>
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