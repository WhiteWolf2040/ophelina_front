// components/PermissionButton.jsx
import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

const PermissionButton = ({ 
  permission,
  permissions,
  module,
  children, 
  fallback = null,
  ...props 
}) => {
  const { hasPermission, hasAnyPermission, hasModule } = usePermissions();

  let hasAccess = true;

  if (module) {
    hasAccess = hasModule(module);
  }

  if (permission) {
    hasAccess = hasAccess && hasPermission(permission);
  }

  if (permissions && permissions.length > 0) {
    hasAccess = hasAccess && hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    return fallback;
  }

  return <button {...props}>{children}</button>;
};

export default PermissionButton;