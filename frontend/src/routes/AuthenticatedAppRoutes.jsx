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
import ConvocatoriasListPage from '../features/convocatorias/pages/ConvocatoriasListPage';
import CandidatosListPage from '../features/convocatorias/pages/CandidatosListPage';
import PostulacionesListPage from '../features/convocatorias/pages/PostulacionesListPage';
import EntrevistasListPage from '../features/convocatorias/pages/EntrevistasListPage';

// Componentes específicos de planilla
import EmployeeListPage from '../features/payroll/pages/EmployeeListPage';
import EmployeeFormPage from '../features/payroll/pages/EmployeeFormPage';
import EmployeeDetailPage from '../features/payroll/pages/EmployeeDetailPage';
import EmployeePayrollDetails from '../features/payroll/components/masters/EmployeePayrollDetails';
import LegalParametersTable from '../features/payroll/components/masters/LegalParametersTable';
import MonthlyNoveltyEntry from '../features/payroll/components/processes/MonthlyNoveltyEntry';
import PrePayrollReviewTable from '../features/payroll/components/processes/PrePayrollReviewTable';
import PayrollSummaryReportPage from '../features/payroll/components/reports/PayrollSummaryReportPage';
import OutputFilesPage from '../features/payroll/components/reports/OutputFilesPage';
import PayrollListPage from '../features/payroll/pages/PayrollListPage';
import PayrollFormPage from '../features/payroll/pages/PayrollFormPage';
import PayrollDetailPage from '../features/payroll/pages/PayrollDetailPage';

// Rutas del módulo tributario
const TaxRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="config" replace />} />
    <Route path="config" element={<TaxConfigPage />} />
    <Route path="daily" element={<DailyOpsPage />} />
    <Route path="closing" element={<MonthlyClosingPage />} />
  </Routes>
);

// Rutas del módulo de planilla
const PayrollRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<PayrollDashboardPage />} />
    <Route path="list" element={<PayrollListPage />} />
    <Route path="new" element={<PayrollFormPage />} />
    <Route path=":id" element={<PayrollDetailPage />} />
    <Route path=":id/edit" element={<PayrollFormPage />} />
    <Route path="novelties" element={<MonthlyNoveltyEntry />} />
    <Route path="review" element={<PrePayrollReviewTable />} />
    <Route path="liquidation" element={<LiquidationProcessPage />} />
    <Route path="outputs" element={<OutputFilesPage />} />
  </Routes>
);

// Rutas de maestros y configuración
const MastersRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="config" replace />} />
    <Route path="legal-parameters" element={<LegalParametersTable />} />
    <Route path="employee-payroll" element={<EmployeePayrollDetails />} />
    <Route path="config" element={<MastersConfigPage />} />
    <Route path="employees" element={<EmployeeListPage />} />
    <Route path="employees/new" element={<EmployeeFormPage />} />
    <Route path="employees/:id" element={<EmployeeDetailPage />} />
    <Route path="employees/:id/edit" element={<EmployeeFormPage />} />
  </Routes>
);

// Rutas de reportes
const ReportsRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="summary" replace />} />
    <Route path="summary" element={<PayrollSummaryReportPage />} />
    <Route path="output-files" element={<OutputFilesPage />} />
    <Route path="payroll" element={<ReportsPage />} />
  </Routes>
);

// Rutas de contratación
const HiringRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="convocatorias" replace />} />
    <Route path="convocatorias" element={<ConvocatoriasListPage />} />
    <Route path="candidatos" element={<CandidatosListPage />} />
    <Route path="postulaciones" element={<PostulacionesListPage />} />
    <Route path="entrevistas" element={<EntrevistasListPage />} />
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