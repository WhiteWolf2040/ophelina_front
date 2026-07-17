// contexts/UserContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../config/api';
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

const UserContext = createContext();

// Configuración de módulos por plan (fuera del componente para no recrearlo)
const modulesByPlan = {
  1: { // Free Trial
    name: 'Free',
    menus: [
      { path: "/home", icon: <HomeIcon />, text: "Home", modulo: "home" },
      { path: "/clientes", icon: <PeopleIcon />, text: "Clientes", modulo: "clientes" },
      { path: "/empenos", icon: <DiamondIcon />, text: "Empeños", modulo: "empenos" }
    ]
  },
  2: { // Profesional
    name: 'Profesional',
    menus: [
      { path: "/home", icon: <HomeIcon />, text: "Home", modulo: "home" },
      { path: "/clientes", icon: <PeopleIcon />, text: "Clientes", modulo: "clientes" },
      { path: "/pagos", icon: <PaymentsIcon />, text: "Pagos", modulo: "pagos" },
      { path: "/empenos", icon: <DiamondIcon />, text: "Empeños", modulo: "empenos" },
      { path: "/configuracion", icon: <SettingsIcon />, text: "Configuración", modulo: "configuracion" }
    ]
  },
  3: { // Premium (Empresarial)
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

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUserData(null);
        setModules([]);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      console.log('🔄 Cargando datos del usuario...');
      const response = await api.get('/user');
      
      if (response.data.success) {
        const usuario = response.data.data.usuario;
        const planId = usuario.plan_id || 1;
        
        console.log('📊 Plan ID:', planId);
        console.log('👤 Usuario:', usuario.email || usuario.nombre);
        
        // Obtener los menús según el plan
        const planMenus = modulesByPlan[planId] || modulesByPlan[1];
        
        setUserData(usuario);
        setModules(planMenus.menus);
        setIsAuthenticated(true);
        
        console.log('📦 Módulos cargados:', planMenus.menus.length);
      } else {
        setUserData(null);
        setModules([]);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Error cargando datos del usuario:', error);
      setUserData(null);
      setModules([]);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Función para recargar los datos (útil después de login/registro)
  const refreshUserData = async () => {
    await loadUserData();
  };

  // Función para limpiar los datos (útil para logout)
  const clearUserData = () => {
    setUserData(null);
    setModules([]);
    setIsAuthenticated(false);
    setLoading(false);
  };

  // Cargar datos al montar el provider (solo una vez)
  useEffect(() => {
    loadUserData();
  }, []); // Array vacío = solo una vez

  // Escuchar cambios en el token (si se elimina de otra parte)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        // Si se eliminó el token, limpiar datos
        clearUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    userData,
    modules,
    loading,
    isAuthenticated,
    refreshUserData,
    clearUserData,
    modulesByPlan // Exponer por si se necesita en otros componentes
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }
  return context;
};