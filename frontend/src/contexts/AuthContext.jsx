import React, { createContext, useState, useContext, useEffect } from 'react';

// Definición de permisos por rol
const ROLE_PERMISSIONS = {
  ADMIN_TRIBUTARIO: [
    'view_dashboard',
    'manage_tax_config',
    'manage_daily_operations',
    'manage_monthly_closing',
    'view_tax_reports'
  ],
  GESTOR_PLANILLA: [
    'view_dashboard',
    'manage_legal_parameters',
    'manage_payroll_novelties',
    'review_pre_payroll',
    'generate_payroll_reports',
    'manage_output_files'
  ],
  GESTOR_CONTRATACION: [
    'view_dashboard',
    'manage_job_postings',
    'manage_candidates',
    'manage_interviews',
    'manage_employees',
    'view_hiring_reports'
  ]
};

// Crear el contexto
const AuthContext = createContext();

// Exportar el contexto para uso en hooks
export { AuthContext };

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para hacer login
  const login = async (credentials) => {
    console.log('🚀 AuthContext: Iniciando petición de login:', credentials);
    
    try {
      console.log('🌐 Enviando petición a: http://localhost:8081/api/auth/login');
      
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('📡 Respuesta recibida - Status:', response.status, 'OK:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Datos del login exitoso:', data);
        
        // Guardar token en localStorage
        localStorage.setItem('token', data.token);
        setToken(data.token);
        
        // Crear objeto de usuario
        const userData = {
          id: data.userId,
          email: data.email,
          nombreCompleto: data.nombreCompleto,
          rol: data.rol,
          rolDescripcion: data.rolDescripcion,
          permissions: ROLE_PERMISSIONS[data.rol] || []
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        const errorData = await response.json();
        console.log('❌ Error del servidor:', response.status, errorData);
        return { success: false, error: errorData.message || 'Error de login' };
      }
    } catch (error) {
      console.error('❌ Error durante el login (excepción):', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  // Función para hacer logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Función para validar token existente
  const validateToken = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        
        // Crear objeto de usuario con permisos
        const userWithPermissions = {
          id: userData.userId,
          email: userData.email,
          nombreCompleto: userData.nombreCompleto,
          rol: userData.rol,
          rolDescripcion: userData.rolDescripcion,
          permissions: ROLE_PERMISSIONS[userData.rol] || []
        };
        
        setUser(userWithPermissions);
        setIsAuthenticated(true);
      } else {
        // Token inválido, limpiar datos
        logout();
      }
    } catch (error) {
      console.error('Error validando token:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener información del usuario
  const getUserInfo = async () => {
    if (!token) return null;

    try {
      const response = await fetch('http://localhost:8081/api/auth/user-info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        return userData;
      }
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error);
    }
    return null;
  };

  // Función para verificar permisos
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  // Función para verificar múltiples permisos
  const hasAnyPermission = (permissions) => {
    if (!user || !user.permissions) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  // Función para verificar rol específico
  const hasRole = (role) => {
    if (!user) return false;
    return user.rol === role;
  };

  // Función para verificar si tiene alguno de los roles especificados
  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.rol);
  };

  // Efecto para validar token al cargar
  useEffect(() => {
    validateToken();
  }, [token]);

  // Valor del contexto
  const contextValue = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    validateToken,
    getUserInfo,
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    // Datos adicionales útiles
    permissions: user?.permissions || [],
    userRole: user?.rol,
    userName: user?.nombreCompleto,
    userEmail: user?.email
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};