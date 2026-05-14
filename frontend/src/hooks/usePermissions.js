import { useAuth } from './useAuth';

// Hook específico para validación de permisos
export const usePermissions = () => {
  const { hasPermission, hasAnyPermission, hasRole, hasAnyRole, permissions, userRole } = useAuth();
  
  // Funciones adicionales para casos específicos del negocio
  const canAccessTaxModule = () => {
    return hasRole('ADMIN_TRIBUTARIO');
  };
  
  const canAccessPayrollModule = () => {
    return hasRole('GESTOR_PLANILLA');
  };
  
  const canAccessHiringModule = () => {
    return hasRole('GESTOR_CONTRATACION');
  };
  
  const canManageReports = () => {
    return hasAnyPermission(['view_tax_reports', 'generate_payroll_reports', 'view_hiring_reports']);
  };
  
  const canAccessDashboard = () => {
    return hasPermission('view_dashboard');
  };
  
  const canManageEmployees = () => {
    return hasAnyPermission(['manage_employees', 'manage_payroll_novelties']);
  };
  
  return {
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    permissions,
    userRole,
    // Funciones específicas del dominio
    canAccessTaxModule,
    canAccessPayrollModule,
    canAccessHiringModule,
    canManageReports,
    canAccessDashboard,
    canManageEmployees
  };
};