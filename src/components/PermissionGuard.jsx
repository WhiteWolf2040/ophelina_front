// components/PermissionGuard.jsx
import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

const PermissionGuard = ({ 
  permission, 
  permissions, // array de permisos (alternativa)
  module,
  children, 
  fallback = null,
  mode = 'any' // 'any' | 'all'
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasModule } = usePermissions();

  // Si no hay permisos requeridos, mostrar todo
  if (!permission && !permissions && !module) {
    return children;
  }

  let hasAccess = true;

  // Verificar por módulo
  if (module) {
    hasAccess = hasModule(module);
  }

  // Verificar por permiso único
  if (permission) {
    hasAccess = hasAccess && hasPermission(permission);
  }

  // Verificar por array de permisos
  if (permissions && permissions.length > 0) {
    if (mode === 'any') {
      hasAccess = hasAccess && hasAnyPermission(permissions);
    } else {
      hasAccess = hasAccess && hasAllPermissions(permissions);
    }
  }

  if (!hasAccess) {
    return fallback;
  }

  return children;
};

export default PermissionGuard;