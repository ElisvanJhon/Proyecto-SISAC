import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Hook personalizado que exporta todas las funciones del contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook específico para operaciones de autenticación
export const useAuthOperations = () => {
  const { login, logout, validateToken } = useAuth();
  
  return {
    login,
    logout,
    validateToken
  };
};

// Hook específico para información del usuario
export const useUserInfo = () => {
  const { user, isAuthenticated, loading, userName, userEmail, userRole } = useAuth();
  
  return {
    user,
    isAuthenticated,
    loading,
    userName,
    userEmail,
    userRole
  };
};

// Hook básico para permisos (versión simple)
export const useBasicPermissions = () => {
  const { hasPermission, hasAnyPermission, hasRole, hasAnyRole, permissions, userRole } = useAuth();
  
  return {
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    permissions,
    userRole
  };
};

export default useAuth;