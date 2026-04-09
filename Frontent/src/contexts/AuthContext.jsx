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

// Credenciales hardcodeadas
const HARDCODED_CREDENTIALS = {
  'tributario@sisac.com': {
    password: 'admin123',
    rol: 'ADMIN_TRIBUTARIO',
    rolDescripcion: 'Gestión Tributaria',
    nombreCompleto: 'Usuario Tributario',
    email: 'tributario@sisac.com'
  },
  'planilla@sisac.com': {
    password: 'admin123',
    rol: 'GESTOR_PLANILLA',
    rolDescripcion: 'Pago de Planilla',
    nombreCompleto: 'Usuario Planilla',
    email: 'planilla@sisac.com'
  },
  'contratacion@sisac.com': {
    password: 'admin123',
    rol: 'GESTOR_CONTRATACION',
    rolDescripcion: 'Contratación',
    nombreCompleto: 'Usuario Contratación',
    email: 'contratacion@sisac.com'
  }
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

  // Función para hacer login (VALIDACIÓN HARDCODEADA)
  const login = async (credentials) => {
    console.log('🚀 AuthContext: Iniciando login hardcodeado:', credentials);
    
    // Simular un pequeño retraso de red para dar realismo
    return new Promise((resolve) => {
      setTimeout(() => {
        const { email, password } = credentials;
        const userRecord = HARDCODED_CREDENTIALS[email];

        if (userRecord && userRecord.password === password) {
          console.log('✅ Credenciales válidas para:', email);
          
          // Crear un token simulado (en un caso real, el backend lo haría)
          const mockToken = `mock-jwt-token-${Date.now()}-${email}`;
          
          // Guardar token en localStorage
          localStorage.setItem('token', mockToken);
          setToken(mockToken);
          
          // Crear objeto de usuario
          const userData = {
            id: email.split('@')[0], // Un ID simple basado en el email
            email: userRecord.email,
            nombreCompleto: userRecord.nombreCompleto,
            rol: userRecord.rol,
            rolDescripcion: userRecord.rolDescripcion,
            permissions: ROLE_PERMISSIONS[userRecord.rol] || []
          };
          
          setUser(userData);
          setIsAuthenticated(true);
          setLoading(false); // Aseguramos que loading se ponga en false
          
          resolve({ success: true, user: userData });
        } else {
          console.log('❌ Credenciales inválidas para:', email);
          setLoading(false); // Aseguramos que loading se ponga en false
          resolve({ success: false, error: 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.' });
        }
      }, 800); // Pequeño delay para simular una petición de red
    });
  };

  // Función para hacer logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  // Función para validar token existente (simulada, ya que no hay backend)
  const validateToken = async () => {
    const storedToken = localStorage.getItem('token');
    
    if (!storedToken) {
      setLoading(false);
      return;
    }

    // En un entorno hardcodeado, asumimos que si hay un token, el usuario es válido.
    // Pero como el token es mock, no tenemos forma de obtener los datos del usuario de él.
    // Por simplicidad, y para que la experiencia sea limpia, si hay un token,
    // lo consideramos inválido y forzamos un logout para que el usuario vuelva a loguearse.
    // Esto asegura que al recargar la página, el usuario tenga que volver a ingresar sus credenciales.
    console.log("🔄 Token encontrado, pero como es un entorno hardcodeado, se ignorará.");
    logout(); // Limpiamos el estado y el token almacenado.
    setLoading(false);
  };

  // Función para obtener información del usuario (simulada)
  const getUserInfo = async () => {
    // En un entorno hardcodeado, esta función podría no ser necesaria,
    // pero la dejamos por compatibilidad. Devuelve el usuario actual si existe.
    return user;
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

  // Efecto para validar token al cargar (en este caso, limpiará cualquier token existente)
  useEffect(() => {
    validateToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Se ejecuta solo una vez al montar el componente

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