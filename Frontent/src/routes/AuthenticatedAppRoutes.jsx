import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AuthenticatedDashboardLayout from '../layouts/AuthenticatedDashboardLayout';

// Páginas de autenticación
import LoginPage from '../pages/auth/LoginPage';

// Páginas principales
import DashboardPage from '../features/employees/pages/DashboardPage';
import EditProfilePage from '../features/employees/pages/EditProfilePage';
import PayrollSelfServicePage from '../features/employees/pages/PayrollSelfServicePage';
import NotFoundPage from '../pages/NotFoundPage';

// Módulo Tributario (ADMIN_TRIBUTARIO)
import TaxConfigPage from '../features/tax/pages/TaxConfigPage';
import DailyOpsPage from '../features/tax/pages/DailyOpsPage';
import MonthlyClosingPage from '../features/tax/pages/MonthlyClosingPage';

// Módulo Planilla (GESTOR_PLANILLA)
import LiquidationProcessPage from '../features/payroll/pages/LiquidationProcessPage';
import MastersConfigPage from '../features/payroll/pages/MastersConfigPage';
import PayrollDashboardPage from '../features/payroll/pages/PayrollDashboardPage';
import ReportsPage from '../features/payroll/pages/ReportsPage';

// Módulo Convocatorias (GESTOR_CONTRATACION)
import TestConvocatorias from '../TestConvocatorias';
import ConvocatoriasDashboardPage from '../features/convocatorias/pages/ConvocatoriasDashboardPage';

// Componentes específicos de planilla - Temporalmente comentados para arreglar imports
// import EmployeePayrollDetails from '../features/payroll/components/masters/EmployeePayrollDetails';
// import LegalParametersTable from '../features/payroll/components/masters/LegalParametersTable';
// import MonthlyNoveltyEntry from '../features/payroll/components/processes/MonthlyNoveltyEntry';
// import PrePayrollReviewTable from '../features/payroll/components/processes/PrePayrollReviewTable';
// import PayrollSummaryReportPage from '../features/payroll/components/reports/PayrollSummaryReportPage';
// import OutputFilesPage from '../features/payroll/components/reports/OutputFilesPage';

// Rutas del módulo tributario
const TaxRoutes = () => (
  <Routes>
    <Route path="/config" element={<TaxConfigPage />} />
    <Route path="/daily" element={<DailyOpsPage />} />
    <Route path="/closing" element={<MonthlyClosingPage />} />
  </Routes>
);

// Rutas del módulo de planilla
const PayrollRoutes = () => (
  <Routes>
    <Route path="/novelties" element={<MonthlyNoveltyEntry />} />
    <Route path="/review" element={<PrePayrollReviewTable />} />
    <Route path="/liquidation" element={<LiquidationProcessPage />} />
    <Route path="/dashboard" element={<PayrollDashboardPage />} />
  </Routes>
);

// Rutas de maestros y configuración - Temporalmente simplificadas
const MastersRoutes = () => (
  <Routes>
    <Route path="/legal-parameters" element={<div>Parámetros Legales - En desarrollo</div>} />
    <Route path="/employee-payroll" element={<div>Detalles de Planilla - En desarrollo</div>} />
    <Route path="/config" element={<MastersConfigPage />} />
  </Routes>
);

// Rutas de reportes - Temporalmente simplificadas
const ReportsRoutes = () => (
  <Routes>
    <Route path="/summary" element={<div>Reporte Resumen - En desarrollo</div>} />
    <Route path="/output-files" element={<div>Archivos de Salida - En desarrollo</div>} />
    <Route path="/payroll" element={<ReportsPage />} />
  </Routes>
);

// Rutas de contratación (placeholder para futura implementación)
const HiringRoutes = () => (
  <Routes>
    <Route path="/convocatorias" element={<ConvocatoriasDashboardPage />} />
    <Route path="/candidates" element={<div>Gestión de Postulantes - En desarrollo</div>} />
    <Route path="/interviews" element={<div>Gestión de Entrevistas - En desarrollo</div>} />
    <Route path="/employees" element={<div>Gestión de Empleados - En desarrollo</div>} />
    <Route path="/reports" element={<div>Reportes de Contratación - En desarrollo</div>} />
  </Routes>
);

export default function AppRoutes() {
  console.log('🎯 AppRoutes rendering...');
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta pública de login */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas protegidas con layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <AuthenticatedDashboardLayout />
            </ProtectedRoute>
          }>
            {/* Dashboard principal */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Perfil de usuario */}
            <Route path="/profile" element={<EditProfilePage />} />
            
            {/* Auto-servicio de empleados */}
            <Route path="/self-service" element={<PayrollSelfServicePage />} />
            
            {/* Módulo Tributario - Solo ADMIN_TRIBUTARIO */}
            <Route path="/tax/*" element={
              <ProtectedRoute requiredRole="ADMIN_TRIBUTARIO">
                <TaxRoutes />
              </ProtectedRoute>
            } />
            
            {/* Módulo de Planilla - Solo GESTOR_PLANILLA */}
            <Route path="/payroll/*" element={
              <ProtectedRoute requiredRole="GESTOR_PLANILLA">
                <PayrollRoutes />
              </ProtectedRoute>
            } />
            
            {/* Maestros y Configuración - Solo GESTOR_PLANILLA */}
            <Route path="/masters/*" element={
              <ProtectedRoute requiredRole="GESTOR_PLANILLA">
                <MastersRoutes />
              </ProtectedRoute>
            } />
            
            {/* Reportes - Solo GESTOR_PLANILLA */}
            <Route path="/reports/*" element={
              <ProtectedRoute requiredRole="GESTOR_PLANILLA">
                <ReportsRoutes />
              </ProtectedRoute>
            } />
            
            {/* Módulo de Contratación - Solo GESTOR_CONTRATACION */}
            <Route path="/hiring/*" element={
              <ProtectedRoute requiredRole="GESTOR_CONTRATACION">
                <HiringRoutes />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Página 404 */}
          <Route path="/404" element={<NotFoundPage />} />
          
          {/* Redirecciones */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}