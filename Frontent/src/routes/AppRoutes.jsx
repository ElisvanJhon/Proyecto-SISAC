// src/AppRoutes.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginPage from '@pages_e/LoginPage.jsx';
import SignupPage from '@pages_e/SignupPage.jsx';
import DashboardPage from '@pages_e/DashboardPage.jsx';
import EditProfilePage from '@pages_e/EditProfilePage.jsx';
import PayrollSelfServicePage from '@pages_e/PayrollSelfServicePage.jsx';
import EmployeePayrollDetails from '@masters/EmployeePayrollDetails.jsx';
import LegalParametersTable from '@masters/LegalParametersTable.jsx';
import MonthlyNoveltyEntry from '@processes/MonthlyNoveltyEntry.jsx'; 
import PrePayrollReviewTable from '@processes/PrePayrollReviewTable.jsx';
import PayrollSummaryReportPage from '@reports/PayrollSummaryReportPage.jsx'; // Nuevo
import OutputFilesPage from '@reports/OutputFilesPage.jsx'; // Nuevo
import TaxConfigPage from '@tax/pages/TaxConfigPage.jsx';
import DailyOpsPage from '@tax/pages/DailyOpsPage.jsx';
import MonthlyClosingPage from '@tax/pages/MonthlyClosingPage.jsx';
import ConvocatoriasDashboardPage from '../features/convocatorias/pages/ConvocatoriasDashboardPage.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import TestConvocatorias from '../TestConvocatorias.jsx';



const PrivateRoute = ({ children, isAuthenticated }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
    const { user, isAuthenticated, logout } = useAuth();
    
    // Para compatibilidad con el código existente
    const isLoggedIn = isAuthenticated;
    const handleLogout = logout;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/signup" element={<SignupPage />} />
                
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute isAuthenticated={isLoggedIn}>
                            <DashboardPage user={user} onLogout={handleLogout} />
                        </PrivateRoute>
                    }
                />
                
                <Route 
                    path="/dashboard/edit-profile" 
                    element={
                        <PrivateRoute isAuthenticated={isLoggedIn}>
                            <EditProfilePage user={user} setUser={setUser} />
                        </PrivateRoute>
                    }
                />

                <Route 
                    path="/dashboard/payroll-selfservice" 
                    element={
                        <PrivateRoute isAuthenticated={isLoggedIn}>
                            <PayrollSelfServicePage user={user} onLogout={handleLogout} />
                        </PrivateRoute>
                    }
                />
                
                <Route 
                    path="/masters/legal-parameters" 
                    element={
                        <PrivateRoute isAuthenticated={isLoggedIn}>
                            <LegalParametersTable user={user} onLogout={handleLogout} />
                        </PrivateRoute>
                    }
                />
                
                <Route 
                    path="/masters/employee-payroll" 
                    element={
                        <PrivateRoute isAuthenticated={isLoggedIn}>
                            <EmployeePayrollDetails user={user} onLogout={handleLogout} />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/payroll/novelties"
                    element={
                        <PrivateRoute isAuthenticated={isLoggedIn}>
                            <MonthlyNoveltyEntry user={user} onLogout={handleLogout} />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/payroll/review"
                    element={
                        <PrivateRoute isAuthenticated={isLoggedIn}>
                            <PrePayrollReviewTable user={user} onLogout={handleLogout} />
                        </PrivateRoute>
                    }
                />
                
                {/* Nuevas rutas para los reportes */}
                <Route
                    path="/reports/summary"
                    element={
                        <PrivateRoute isAuthenticated={isLoggedIn}>
                            <PayrollSummaryReportPage user={user} onLogout={handleLogout} />
                        </PrivateRoute>
                    }
                />
                
                <Route
                    path="/reports/output-files"
                    element={
                        <PrivateRoute isAuthenticated={isLoggedIn}>
                            <OutputFilesPage user={user} onLogout={handleLogout} />
                        </PrivateRoute>
                    }
                />

                {/* Sección Tributaria */}
                <Route
                    path="/tax/config"
                    element={
                        <PrivateRoute isAuthenticated={isLoggedIn}>
                            <TaxConfigPage user={user} onLogout={handleLogout} />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/tax/daily"
                    element={
                        <PrivateRoute isAuthenticated={isLoggedIn}>
                            <DailyOpsPage user={user} onLogout={handleLogout} />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/tax/closing"
                    element={
                        <PrivateRoute isAuthenticated={isLoggedIn}>
                            <MonthlyClosingPage user={user} onLogout={handleLogout} />
                        </PrivateRoute>
                    }
                />

                {/* Sección Gestión de Convocatorias */}
                <Route
                    path="/convocatorias"
                    element={
                        <PrivateRoute isAuthenticated={isLoggedIn}>
                            <TestConvocatorias />
                        </PrivateRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}