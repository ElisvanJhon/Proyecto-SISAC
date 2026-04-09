import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/SideBar';
import TopNavbar from '../components/ui/TopNavbar';
import '../components/ui/Sidebar.css';
import '../components/ui/TopNavbar.css';
import './DashboardLayout.css';

/**
 * Layout principal del dashboard con autenticación
 */
const AuthenticatedDashboardLayout = () => {
  const { isAuthenticated, loading, user } = useAuth();

  // Mostrar loading mientras se valida la autenticación
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar con navegación por rol */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="main-content">
        {/* Navbar superior */}
        <TopNavbar />
        
        {/* Área de contenido */}
        <main className="content-area">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedDashboardLayout;