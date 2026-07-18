// components/Sidebar.jsx - VERSIÓN CORREGIDA (maneja objetos y strings)
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
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  // 🔥 FUNCIÓN SEGURA PARA OBTENER EL NOMBRE DEL MÓDULO
  const getModuleName = (item) => {
    if (!item) return '';
    
    // Si es string, devolverlo
    if (typeof item === 'string') {
      return item;
    }
    
    // Si es objeto, buscar propiedades comunes
    if (typeof item === 'object') {
      // Buscar en diferentes propiedades donde pueda estar el nombre
      const possibleKeys = ['modulo', 'nombre', 'name', 'text', 'label', 'id', 'key'];
      for (const key of possibleKeys) {
        if (item[key] && typeof item[key] === 'string') {
          return item[key];
        }
      }
      
      // Si tiene path, extraer el nombre de la ruta
      if (item.path && typeof item.path === 'string') {
        const pathParts = item.path.split('/');
        return pathParts[pathParts.length - 1] || '';
      }
      
      // Si tiene icon y text, usar text
      if (item.text && typeof item.text === 'string') {
        return item.text;
      }
    }
    
    // Si nada funciona, convertir a string
    return String(item);
  };

  // 🔥 FUNCIÓN PARA OBTENER LOS MENÚS
  const getMenus = () => {
    // Si no hay módulos o está vacío, mostrar los del plan Premium por defecto
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
    
    for (const item of modules) {
      // Obtener el nombre del módulo de forma segura
      const moduleName = getModuleName(item);
      
      if (!moduleName) continue;
      
      // Normalizar: convertir a string y limpiar
      const normalizedName = String(moduleName).toLowerCase().trim();
      
      // Buscar en el mapa
      let mapped = moduleMap[normalizedName];
      
      // Si no se encuentra, buscar por coincidencia parcial
      if (!mapped) {
        for (const [key, value] of Object.entries(moduleMap)) {
          if (normalizedName.includes(key) || key.includes(normalizedName)) {
            mapped = value;
            break;
          }
        }
      }
      
      if (mapped) {
        result.push(mapped);
      } else {
        // Si no se encuentra, crear un item genérico
        const displayName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
        result.push({
          path: `/${normalizedName}`,
          icon: <HomeIcon />,
          text: displayName
        });
      }
    }
    
    // Eliminar duplicados por path
    const seen = new Set();
    return result.filter(item => {
      if (seen.has(item.path)) return false;
      seen.add(item.path);
      return true;
    });
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
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path} 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
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