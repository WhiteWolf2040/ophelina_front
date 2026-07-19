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

// Menús por defecto
const DEFAULT_MENUS = [
  { path: '/home', icon: <HomeIcon />, text: 'Home' },
  { path: '/clientes', icon: <PeopleIcon />, text: 'Clientes' },
  { path: '/pagos', icon: <PaymentsIcon />, text: 'Pagos' },
  { path: '/empenos', icon: <DiamondIcon />, text: 'Empeños' },
  { path: '/tienda', icon: <StorefrontIcon />, text: 'Tienda en línea' },
  { path: '/tienda', icon: <StorefrontIcon />, text: 'Tienda en línea' },
  { path: '/reportes', icon: <BarChartIcon />, text: 'Reportes' },
  { path: '/roles', icon: <SecurityIcon />, text: 'Roles' },
  { path: '/permisos', icon: <VpnKeyIcon />, text: 'Permisos' },
  { path: '/configuracion', icon: <SettingsIcon />, text: 'Configuración' }
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  let userContext;
  try {
    userContext = useUser();
  } catch (e) {
    userContext = { modules: DEFAULT_MENUS, loading: false, clearUserData: () => {} };
  }

  const { modules, loading, clearUserData } = userContext;

  // Obtener menús de forma segura
  const getMenus = () => {
    if (!modules || modules.length === 0) return DEFAULT_MENUS;
    
    // Si los módulos ya tienen path e icon, usarlos
    if (modules[0]?.path) return modules;
    
    // Si son strings, mapearlos
    return modules.map(mod => {
      const name = typeof mod === 'string' ? mod : mod.modulo || mod.nombre || '';
      const normalized = String(name).toLowerCase().trim();
      const map = {
        'home': { path: '/home', icon: <HomeIcon />, text: 'Home' },
        'dashboard': { path: '/home', icon: <HomeIcon />, text: 'Home' },
        'clientes': { path: '/clientes', icon: <PeopleIcon />, text: 'Clientes' },
        'pagos': { path: '/pagos', icon: <PaymentsIcon />, text: 'Pagos' },
        'empenos': { path: '/empenos', icon: <DiamondIcon />, text: 'empenos' },
        'inventario': { path: '/inventario', icon: <InventoryIcon />, text: 'Inventario' },
        'tienda': { path: '/tienda', icon: <StorefrontIcon />, text: 'Tienda en línea' },
        'reportes': { path: '/reportes', icon: <BarChartIcon />, text: 'Reportes' },
        'roles': { path: '/roles', icon: <SecurityIcon />, text: 'Roles' },
        'permisos': { path: '/permisos', icon: <VpnKeyIcon />, text: 'Permisos' },
        'configuracion': { path: '/configuracion', icon: <SettingsIcon />, text: 'Configuración' }
      };
      return map[normalized] || { path: `/${normalized}`, icon: <HomeIcon />, text: name };
    });
  };

  const menuItems = getMenus();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleLogout = async () => {
    await logout();
    if (clearUserData) clearUserData();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="log-image" />
        </div>
        <div className="sidebar-loading">Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

   {isOpen && <div className="sidebar-overlay visible" onClick={closeSidebar}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Ophelia Logo" className="log-image" />
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
             <span className="link-text">{item.text}</span>
            </NavLink>
          ))}

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