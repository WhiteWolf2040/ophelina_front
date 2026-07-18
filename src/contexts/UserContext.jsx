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

// Configuración de módulos por plan
const modulesByPlan = {
  1: {
    name: 'Free',
    menus: [
      { path: "/home", icon: <HomeIcon />, text: "Home", modulo: "home" },
      { path: "/clientes", icon: <PeopleIcon />, text: "Clientes", modulo: "clientes" },
      { path: "/empenos", icon: <DiamondIcon />, text: "Empeños", modulo: "empenos" }
    ]
  },
  2: {
    name: 'Profesional',
    menus: [
      { path: "/home", icon: <HomeIcon />, text: "Home", modulo: "home" },
      { path: "/clientes", icon: <PeopleIcon />, text: "Clientes", modulo: "clientes" },
      { path: "/pagos", icon: <PaymentsIcon />, text: "Pagos", modulo: "pagos" },
      { path: "/empenos", icon: <DiamondIcon />, text: "Empeños", modulo: "empenos" },
      { path: "/configuracion", icon: <SettingsIcon />, text: "Configuración", modulo: "configuracion" }
    ]
  },
  3: {
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
//  CONVERTIR MÓDULOS DE OBJETO A ARRAY
const convertModulosToArray = (modulos) => {
  if (!modulos) return [];
  if (Array.isArray(modulos)) return modulos;
  if (typeof modulos === 'object') {
    return Object.values(modulos);
  }
  return [];
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔧 FUNCIÓN PARA CONVERTIR MÓDULOS A MENÚS
  const convertModulesToMenus = (modulosArray, planId) => {
    if (!modulosArray || modulosArray.length === 0) {
      const planMenus = modulesByPlan[planId] || modulesByPlan[3];
      return planMenus.menus;
    }

    const moduleMap = {
      'dashboard': { path: '/home', icon: <HomeIcon />, text: 'Dashboard' },
      'home': { path: '/home', icon: <HomeIcon />, text: 'Home' },
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

    const menus = modulosArray
      .map(modulo => {
        const modKey = String(modulo).toLowerCase().trim();
        return moduleMap[modKey];
      })
      .filter(menu => menu !== undefined);

    if (menus.length === 0) {
      const planMenus = modulesByPlan[planId] || modulesByPlan[3];
      return planMenus.menus;
    }

    return menus;
  };

  //  CARGAR DATOS DEL USUARIO
  const loadUserData = async (forceRefresh = false) => {
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

      // Si no es refresh forzado, intentar cargar desde localStorage
      if (!forceRefresh) {
        const storedUser = localStorage.getItem('user');
        const storedModules = localStorage.getItem('modulos');
        
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log(' Cargando usuario desde localStorage:', parsedUser.nombre || parsedUser.correo);
            
            let modulosArray = [];
            if (storedModules) {
              const parsedModules = JSON.parse(storedModules);
              modulosArray = convertModulosToArray(parsedModules);
            } else {
              const planId = parsedUser.plan_id || 3;
              const planMenus = modulesByPlan[planId] || modulesByPlan[3];
              modulosArray = planMenus.menus.map(m => m.modulo);
            }
            
            const menuModules = convertModulesToMenus(modulosArray, parsedUser.plan_id || 3);
            setModules(menuModules);
            setUserData(parsedUser);
            setIsAuthenticated(true);
            setLoading(false);
            return;
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
      }

      // Cargar desde API
      console.log(' Cargando datos del usuario desde API...');
      const response = await api.get('/user');
      
      if (response.data.success) {
        const usuario = response.data.data.usuario || response.data.data;
        const planId = usuario.plan_id || 3;
        
        console.log('Plan ID:', planId);
        console.log(' Usuario:', usuario.nombre || usuario.correo);
        
        //  CONVERTIR MÓDULOS A ARRAY
        let modulosArray = convertModulosToArray(usuario.modulos);
        console.log(' Módulos convertidos:', modulosArray);
        
        if (modulosArray.length === 0) {
          const planMenus = modulesByPlan[planId] || modulesByPlan[3];
          modulosArray = planMenus.menus.map(m => m.modulo);
        }
        
        // Guardar en localStorage
        localStorage.setItem('user', JSON.stringify(usuario));
        localStorage.setItem('modulos', JSON.stringify(modulosArray));
        
        if (usuario.permisos) {
          const permisosArray = convertModulosToArray(usuario.permisos);
          localStorage.setItem('permisos', JSON.stringify(permisosArray));
        }
        
        //  GENERAR MENÚS
        const menuModules = convertModulesToMenus(modulosArray, planId);
        console.log(' Menús generados:', menuModules);
        
        setModules(menuModules);
        setUserData(usuario);
        setIsAuthenticated(true);
        
        console.log(' Módulos cargados:', menuModules.length);
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

  //  REFRESCAR DATOS
  const refreshUserData = async () => {
    console.log(' Refrescando datos del usuario...');
    await loadUserData(true);
  };

  //  LIMPIAR DATOS
  const clearUserData = () => {
    console.log(' Limpiando datos del usuario...');
    setUserData(null);
    setModules([]);
    setIsAuthenticated(false);
    setLoading(false);
    
    localStorage.removeItem('user');
    localStorage.removeItem('permisos');
    localStorage.removeItem('modulos');
    localStorage.removeItem('empresa_id');
    localStorage.removeItem('token');
  };

  // CARGAR DATOS AL INICIAR
  useEffect(() => {
    loadUserData();
  }, []);

  // ESCUCHAR CAMBIOS EN EL TOKEN
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
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
    loadUserData,
    modulesByPlan
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }
  return context;
};