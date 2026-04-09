import React from 'react';
import { useAuth } from '../../../hooks/useAuth';

const DashboardPage = () => {
    const { user } = useAuth();
    
    // ** Simulación de datos para los widgets **
    const getDashboardData = () => {
        switch(user?.rol) {
            case 'ADMIN_TRIBUTARIO':
                return {
                    title: 'Gestión Tributaria',
                    stats: [
                        { label: 'Declaraciones Pendientes', value: 15, icon: '📄' },
                        { label: 'Comprobantes Procesados', value: 245, icon: '✅' },
                        { label: 'Alertas Tributarias', value: 3, icon: '⚠️' }
                    ]
                };
            case 'GESTOR_PLANILLA':
                return {
                    title: 'Gestión de Planilla',
                    stats: [
                        { label: 'Empleados Activos', value: 150, icon: '👥' },
                        { label: 'Planillas Procesadas', value: 12, icon: '📊' },
                        { label: 'Novedades Pendientes', value: 8, icon: '📝' }
                    ]
                };
            case 'GESTOR_CONTRATACION':
                return {
                    title: 'Gestión de Contratación',
                    stats: [
                        { label: 'Postulantes Nuevos', value: 25, icon: '👤' },
                        { label: 'Entrevistas Programadas', value: 7, icon: '💬' },
                        { label: 'Contrataciones del Mes', value: 4, icon: '✨' }
                    ]
                };
            default:
                return {
                    title: 'Dashboard General',
                    stats: []
                };
        }
    };

    const dashboardData = getDashboardData();

    return (
        <div className="page-content fade-in">
            <div className="page-header">
                <h1>Bienvenido al Dashboard de SISAC</h1>
                <p>Módulo: {dashboardData.title} - {user?.nombreCompleto}</p>
            </div>
            
            <div className="dashboard-cards">
                {dashboardData.stats.map((stat, index) => (
                    <div key={index} className="dashboard-card">
                        <div className="card-header">
                            <h3 className="card-title">{stat.label}</h3>
                            <div className="card-icon">
                                {stat.icon}
                            </div>
                        </div>
                        <div className="card-value">{stat.value}</div>
                        <p className="card-description">
                            {stat.label} en el sistema actual
                        </p>
                    </div>
                ))}
            </div>

            <div className="dashboard-info">
                <div className="info-card">
                    <h3>Información del Usuario</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Nombre:</label>
                            <span>{user?.nombreCompleto}</span>
                        </div>
                        <div className="info-item">
                            <label>Email:</label>
                            <span>{user?.email}</span>
                        </div>
                        <div className="info-item">
                            <label>Rol:</label>
                            <span>{user?.rolDescripcion}</span>
                        </div>
                        <div className="info-item">
                            <label>Permisos:</label>
                            <span>{user?.permissions?.length || 0} permisos asignados</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;