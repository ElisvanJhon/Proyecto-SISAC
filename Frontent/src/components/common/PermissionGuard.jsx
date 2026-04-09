import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

const PermissionGuard = ({ 
  children, 
  permission = null, 
  permissions = [], 
  role = null, 
  roles = [], 
  requireAll = false,
  fallback = null 
}) => {
  const { hasPermission, hasAnyPermission, hasRole, hasAnyRole } = usePermissions();

  // Verificar permisos individuales
  if (permission && !hasPermission(permission)) {
    return fallback;
  }

  // Verificar lista de permisos
  if (permissions.length > 0) {
    const hasRequiredPermissions = requireAll 
      ? permissions.every(p => hasPermission(p))
      : hasAnyPermission(permissions);
      
    if (!hasRequiredPermissions) {
      return fallback;
    }
  }

  // Verificar rol individual
  if (role && !hasRole(role)) {
    return fallback;
  }

  // Verificar lista de roles
  if (roles.length > 0 && !hasAnyRole(roles)) {
    return fallback;
  }

  // Si todas las validaciones pasan, mostrar el contenido
  return children;
};

export default PermissionGuard;