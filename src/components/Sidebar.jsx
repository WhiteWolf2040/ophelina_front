// Sidebar.jsx - Versión corregida con módulos por plan
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/LogoWhite.png";
import "./Sidebar.css";
import { logout } from "../config/auth";
import api from "../config/api";

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
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Configuración de módulos visibles según el plan
  const modulesByPlan = {
    1: {  // Free Trial
      name: 'Free',
      menus: [
        { path: "/home", icon: <HomeIcon />, text: "Home", modulo: "home" },
        { path: "/clientes", icon: <PeopleIcon />, text: "Clientes", modulo: "clientes" },
        { path: "/empenos", icon: <DiamondIcon />, text: "Empeños", modulo: "empenos" }
      ]
    },
    3: {  // Profesional
      name: 'Profesional',
      menus: [
        { path: "/home", icon: <HomeIcon />, text: "Home", modulo: "home" },
        { path: "/clientes", icon: <PeopleIcon />, text: "Clientes", modulo: "clientes" },
        { path: "/pagos", icon: <PaymentsIcon />, text: "Pagos", modulo: "pagos" },
        { path: "/empenos", icon: <DiamondIcon />, text: "Empeños", modulo: "empenos" },
        { path: "/configuracion", icon: <SettingsIcon />, text: "Configuración", modulo: "configuracion" }
      ]
    },
    4: {  // Premium (Empresarial)
      name: 'Premium',
      menus: [
        { path: "/home", icon: <HomeIcon />, text: "Home", modulo: "home" },
        { path: "/clientes", icon: <PeopleIcon />, text: "Clientes", modulo: "clientes" },
        { path: "/pagos", icon: <PaymentsIcon />, text: "Pagos", modulo: "pagos" },
        { path: "/empenos", icon: <DiamondIcon />, text: "Empeños", modulo: "empenos" },
        { path: "/tienda", icon: <StorefrontIcon />, text: "Tienda en línea", modulo: "tienda" },
        { path: "/reportes", icon: <BarChartIcon />, text: "Reportes", modulo: "reportes" },
        { path: "/roles", icon: <SecurityIcon />, text: "Roles", modulo: "roles" },
        { path: "/permisos", icon: <VpnKeyIcon />, text: "Permisos", modulo: "permisos" },
        { path: "/configuracion", icon: <SettingsIcon />, text: "Configuración", modulo: "configuracion" }
      ]
    }
  };

  useEffect(() => {
    const cargarModulosPorPlan = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setVisibleMenus([]);
          setLoading(false);
          return;
        }

        const response = await api.get('/user');
        
        if (response.data.success) {
          const usuario = response.data.data.usuario;
          const planId = usuario.plan_id || 1;
          
          console.log('📊 Plan ID:', planId);
          console.log('📦 Módulos permitidos:', usuario.modulos);
          
          // Obtener los menús según el plan
          const planMenus = modulesByPlan[planId] || modulesByPlan[1];
          setVisibleMenus(planMenus.menus);
        } else {
          setVisibleMenus([]);
        }
      } catch (error) {
        console.error('Error cargando módulos del plan:', error);
        setVisibleMenus([]);
      } finally {
        setLoading(false);
      }
    };
    
    cargarModulosPorPlan();
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleLogout = async () => {
    await logout();
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