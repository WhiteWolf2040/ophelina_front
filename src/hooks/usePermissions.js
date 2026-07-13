// hooks/usePermissions.js
import { useState, useEffect } from 'react';

export const usePermissions = () => {
  const [permisos, setPermisos] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = () => {
      try {
        // Cargar desde localStorage
        const permisosStr = localStorage.getItem('permisos');
        const modulosStr = localStorage.getItem('modulos');
        const userStr = localStorage.getItem('user');
        
        if (permisosStr) {
          setPermisos(JSON.parse(permisosStr));
        }
        
        if (modulosStr) {
          setModulos(JSON.parse(modulosStr));
        }
        
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserRole(user.rol || '');
        }
      } catch (error) {
        console.error('Error loading permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, []);

  // Verificar si tiene un permiso específico
  const hasPermission = (permissionName) => {
    if (!permissionName) return true;
    
    // Administrador tiene todos los permisos
    if (userRole === 'Administrador' || userRole === 'Admin' || userRole === 'Dueño') {
      return true;
    }
    
    return permisos.includes(permissionName);
  };

  // Verificar si tiene al menos uno de los permisos
  const hasAnyPermission = (permissionsList) => {
    if (!permissionsList || permissionsList.length === 0) return true;
    
    // Administrador tiene todos los permisos
    if (userRole === 'Administrador' || userRole === 'Admin' || userRole === 'Dueño') {
      return true;
    }
    
    return permissionsList.some(p => permisos.includes(p));
  };

  // Verificar si tiene todos los permisos
  const hasAllPermissions = (permissionsList) => {
    if (!permissionsList || permissionsList.length === 0) return true;
    
    // Administrador tiene todos los permisos
    if (userRole === 'Administrador' || userRole === 'Admin' || userRole === 'Dueño') {
      return true;
    }
    
    return permissionsList.every(p => permisos.includes(p));
  };

  // Verificar si tiene acceso a un módulo
  const hasModule = (moduleName) => {
    if (!moduleName) return true;
    
    // Administrador tiene todos los módulos
    if (userRole === 'Administrador' || userRole === 'Admin' || userRole === 'Dueño') {
      return true;
    }
    
    return modulos.includes(moduleName);
  };

  return {
    permisos,
    modulos,
    userRole,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasModule
  };
};