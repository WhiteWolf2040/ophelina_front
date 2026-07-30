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
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

// Menús por defecto (orden correcto)
const DEFAULT_MENUS = [
  { path: '/home', icon: <HomeIcon />, text: 'Home' },
  { path: '/clientes', icon: <PeopleIcon />, text: 'Clientes' },
  { path: '/pagos', icon: <PaymentsIcon />, text: 'Pagos' },
  { path: '/empenos', icon: <DiamondIcon />, text: 'Empeños' },
  { path: '/tienda', icon: <StorefrontIcon />, text: 'Tienda en línea' },
  { path: '/tienda/apartados', icon: <ShoppingBagIcon />, text: 'Apartados de clientes' },
  { path: '/inventario', icon: <InventoryIcon />, text: 'Inventario' },
  { path: '/reportes', icon: <BarChartIcon />, text: 'Reportes' },
  { path: '/roles', icon: <SecurityIcon />, text: 'Roles' },
  { path: '/permisos', icon: <VpnKeyIcon />, text: 'Permisos' },
  { path: '/configuracion', icon: <SettingsIcon />, text: 'Configuración' }
];

// ✅ ORDEN CORRECTO DE LOS MÓDULOS
const ORDEN_MODULOS = [
  'home', 'clientes', 'pagos', 'empenos', 
  'tienda', 'apartados', 'inventario', 
  'reportes', 'roles', 'permisos', 'configuracion'
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
    const map = {
      'home': { path: '/home', icon: <HomeIcon />, text: 'Home' },
      'dashboard': { path: '/home', icon: <HomeIcon />, text: 'Home' },
      'clientes': { path: '/clientes', icon: <PeopleIcon />, text: 'Clientes' },
      'pagos': { path: '/pagos', icon: <PaymentsIcon />, text: 'Pagos' },
      'empenos': { path: '/empenos', icon: <DiamondIcon />, text: 'Empeños' },
      'inventario': { path: '/inventario', icon: <InventoryIcon />, text: 'Inventario' },
      'tienda': { path: '/tienda', icon: <StorefrontIcon />, text: 'Tienda en línea' },
      'apartados': { path: '/tienda/apartados', icon: <ShoppingBagIcon />, text: 'Apartados de clientes' },
      'reportes': { path: '/reportes', icon: <BarChartIcon />, text: 'Reportes' },
      'roles': { path: '/roles', icon: <SecurityIcon />, text: 'Roles' },
      'permisos': { path: '/permisos', icon: <VpnKeyIcon />, text: 'Permisos' },
      'configuracion': { path: '/configuracion', icon: <SettingsIcon />, text: 'Configuración' }
    };
    
    // ✅ Mapear todos los módulos
    const menus = modules.map(mod => {
      const name = typeof mod === 'string' ? mod : mod.modulo || mod.nombre || '';
      const normalized = String(name).toLowerCase().trim();
      return map[normalized] || { path: `/${normalized}`, icon: <HomeIcon />, text: name };
    });

    // ✅ ORDENAR según el orden definido
    return menus.sort((a, b) => {
      const pathA = a.path.replace('/', '');
      const pathB = b.path.replace('/', '');
      const indexA = ORDEN_MODULOS.indexOf(pathA);
      const indexB = ORDEN_MODULOS.indexOf(pathB);
      
      // Si no está en el orden, ponerlo al final
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  const menuItems = getMenus();

  // ✅ DEBUG: Ver qué menús se están renderizando
  console.log('📋 Menús a renderizar:', menuItems.map(m => m.text));

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