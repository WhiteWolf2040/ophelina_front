// contexts/UserContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const UserContext = createContext();

// Plan que se usa si algo falla: el MÁS LIMITADO (Free), nunca Premium
const PLAN_POR_DEFECTO = 1;

// Mapa de módulo -> item de menú (fuera del componente para no recrearlo en cada render)
const moduleMap = {
  'dashboard': { path: '/home', icon: <HomeIcon />, text: 'Dashboard' },
  'home': { path: '/home', icon: <HomeIcon />, text: 'Home' },
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

// Respaldo local: DEBE coincidir con SuscripcionService::MODULOS_POR_PLAN del backend.
// (El backend es la fuente de verdad; esto solo se usa si la API no manda módulos.)
const MODULOS_POR_PLAN = {
  1: ['home', 'clientes', 'empenos'],
  2: ['home', 'clientes', 'pagos', 'inventario', 'empenos', 'roles', 'permisos', 'configuracion'],
  3: ['home', 'clientes', 'pagos', 'inventario', 'empenos', 'tienda', 'apartados', 'reportes', 'roles', 'permisos', 'configuracion']
};

const NOMBRES_PLAN = { 1: 'Free', 2: 'Profesional', 3: 'Premium' };

// Misma forma que antes: { [planId]: { name, menus: [{path, icon, text, modulo}] } }
const modulesByPlan = Object.fromEntries(
  Object.entries(MODULOS_POR_PLAN).map(([id, mods]) => [
    id,
    {
      name: NOMBRES_PLAN[id],
      menus: mods.map((modulo) => ({ ...moduleMap[modulo], modulo }))
    }
  ])
);

const modulosDePlan = (planId) =>
  MODULOS_POR_PLAN[Number(planId)] || MODULOS_POR_PLAN[PLAN_POR_DEFECTO];

// CONVERTIR MÓDULOS DE OBJETO A ARRAY
const convertModulosToArray = (modulos) => {
  if (!modulos) return [];
  if (Array.isArray(modulos)) return modulos;
  if (typeof modulos === 'object') {
    return Object.values(modulos);
  }
  return [];
};

// CONVERTIR MÓDULOS A MENÚS
const convertModulesToMenus = (modulosArray, planId) => {
  const desdeModulos = (lista) =>
    lista
      .map((modulo) => {
        const modKey = String(modulo).toLowerCase().trim();
        const item = moduleMap[modKey];
        if (!item) console.warn('⚠️ Módulo sin menú definido:', modKey);
        return item;
      })
      .filter(Boolean);

  if (!modulosArray || modulosArray.length === 0) {
    return desdeModulos(modulosDePlan(planId));
  }

  const menus = desdeModulos(modulosArray);
  return menus.length === 0 ? desdeModulos(modulosDePlan(planId)) : menus;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // CARGAR DATOS DEL USUARIO
  // forceRefresh: ignora localStorage y pide todo al backend
  // silent: no activa `loading` (evita que el sidebar parpadee con "Cargando...")
  const loadUserData = useCallback(async (forceRefresh = false, silent = false) => {
    try {
      if (!silent) setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setUserData(null);
        setModules([]);
        setIsAuthenticated(false);
        return;
      }

      // Si no es refresh forzado, intentar cargar desde localStorage (rápido)
      if (!forceRefresh) {
        const storedUser = localStorage.getItem('user');
        const storedModules = localStorage.getItem('modulos');

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            const planId = parsedUser.plan_id || PLAN_POR_DEFECTO;
            console.log('Cargando usuario desde localStorage:', parsedUser.nombre || parsedUser.correo);

            const modulosArray = storedModules
              ? convertModulosToArray(JSON.parse(storedModules))
              : modulosDePlan(planId);

            setModules(convertModulesToMenus(modulosArray, planId));
            setUserData(parsedUser);
            setIsAuthenticated(true);
            return;
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
      }

      // Cargar desde API
      console.log('Cargando datos del usuario desde API...');
      const response = await api.get('/user');

      if (response.data.success) {
        const usuario = response.data.data.usuario || response.data.data;
        const planId = usuario.plan_id || PLAN_POR_DEFECTO;

        console.log('Plan ID:', planId);

        let modulosArray = convertModulosToArray(usuario.modulos);
        console.log('Módulos desde API:', modulosArray);

        if (modulosArray.length === 0) {
          modulosArray = modulosDePlan(planId);
        }

        // Guardar en localStorage (sobrescribe lo viejo)
        localStorage.setItem('user', JSON.stringify(usuario));
        localStorage.setItem('modulos', JSON.stringify(modulosArray));

        if (usuario.permisos) {
          localStorage.setItem('permisos', JSON.stringify(convertModulosToArray(usuario.permisos)));
        }

        const menuModules = convertModulesToMenus(modulosArray, planId);
        console.log('Menús generados:', menuModules.map(m => m.text));

        setModules(menuModules);
        setUserData(usuario);
        setIsAuthenticated(true);
      } else if (!forceRefresh) {
        setUserData(null);
        setModules([]);
        setIsAuthenticated(false);
      }
      // Si fue un refresh forzado y la respuesta no fue success, se conserva lo que ya había
    } catch (error) {
      console.error('❌ Error cargando datos del usuario:', error);
      // En un refresh forzado NO se borra la sesión: se conserva el estado actual
      if (!forceRefresh) {
        setUserData(null);
        setModules([]);
        setIsAuthenticated(false);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // REFRESCAR DATOS (usar después de pagar / cambiar de plan / renovar)
  const refreshUserData = useCallback(async () => {
    console.log('Refrescando datos del usuario...');
    await loadUserData(true, true);
  }, [loadUserData]);

  // LIMPIAR DATOS
  const clearUserData = useCallback(() => {
    console.log('Limpiando datos del usuario...');
    setUserData(null);
    setModules([]);
    setIsAuthenticated(false);
    setLoading(false);

    localStorage.removeItem('user');
    localStorage.removeItem('permisos');
    localStorage.removeItem('modulos');
    localStorage.removeItem('empresa_id');
    localStorage.removeItem('token');
  }, []);

  // CARGAR DATOS AL INICIAR
  // 1) rápido, desde localStorage  2) en segundo plano, corrige con lo que diga el backend
  useEffect(() => {
    loadUserData();
    if (localStorage.getItem('token') && localStorage.getItem('user')) {
      loadUserData(true, true);
    }
  }, [loadUserData]);

  // REFRESCAR AL VOLVER A LA PESTAÑA (por si el plan cambió mientras tanto)
  useEffect(() => {
    const onFocus = () => {
      if (localStorage.getItem('token')) refreshUserData();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refreshUserData]);

  // ESCUCHAR CAMBIOS EN EL TOKEN (otras pestañas)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        clearUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [clearUserData]);

  // Permite refrescar desde cualquier lugar sin usar el hook:
  // window.dispatchEvent(new Event('user:refresh'))
  useEffect(() => {
    const handler = () => refreshUserData();
    window.addEventListener('user:refresh', handler);
    return () => window.removeEventListener('user:refresh', handler);
  }, [refreshUserData]);

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