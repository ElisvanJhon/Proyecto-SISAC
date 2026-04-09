// src/ui/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PermissionGuard from '../common/PermissionGuard';

// Configuración de navegación por rol
const getNavigationByRole = (role) => {
  switch(role) {
    case 'ADMIN_TRIBUTARIO':
      return [
        { 
          name: 'Dashboard', 
          path: '/dashboard', 
          icon: '📊',
          permission: 'view_dashboard'
        },
        { 
          name: 'Configuración Tributaria', 
          path: '/tax/config', 
          icon: '⚙️',
          permission: 'manage_tax_config'
        },
        { 
          name: 'Operación Diaria', 
          path: '/tax/daily', 
          icon: '📅',
          permission: 'manage_daily_operations'
        },
        { 
          name: 'Cierre Mensual', 
          path: '/tax/closing', 
          icon: '📋',
          permission: 'manage_monthly_closing'
        }
      ];
    
    case 'GESTOR_PLANILLA':
      return [
        { 
          name: 'Dashboard', 
          path: '/dashboard', 
          icon: '📊',
          permission: 'view_dashboard'
        },
        { 
          name: 'Maestros y Config', 
          path: '/masters/legal-parameters', 
          icon: '⚙️',
          permission: 'manage_legal_parameters'
        },
        { 
          name: 'Ingreso Novedades', 
          path: '/payroll/novelties', 
          icon: '✏️',
          permission: 'manage_payroll_novelties'
        },
        { 
          name: 'Revisión Pre-Nómina', 
          path: '/payroll/review', 
          icon: '☑️',
          permission: 'review_pre_payroll'
        },
        { 
          name: 'Resumen Planilla', 
          path: '/reports/summary', 
          icon: '📊',
          permission: 'generate_payroll_reports'
        },
        { 
          name: 'Archivos de Salida', 
          path: '/reports/output-files', 
          icon: '💾',
          permission: 'manage_output_files'
        }
      ];
    
    case 'GESTOR_CONTRATACION':
      return [
        { 
          name: 'Dashboard', 
          path: '/dashboard', 
          icon: '📊',
          permission: 'view_dashboard'
        },
        { 
          name: 'Gestión Convocatorias', 
          path: '/hiring/convocatorias', 
          icon: '📢',
          permission: 'manage_job_postings'
        },
        { 
          name: 'Postulantes', 
          path: '/hiring/candidates', 
          icon: '👥',
          permission: 'manage_candidates'
        },
        { 
          name: 'Entrevistas', 
          path: '/hiring/interviews', 
          icon: '💬',
          permission: 'manage_interviews'
        },
        { 
          name: 'Empleados', 
          path: '/hiring/employees', 
          icon: '👤',
          permission: 'manage_employees'
        },
        { 
          name: 'Reportes', 
          path: '/hiring/reports', 
          icon: '📈',
          permission: 'view_hiring_reports'
        }
      ];
    
    default: 
      return [
        { 
          name: 'Dashboard', 
          path: '/dashboard', 
          icon: '📊',
          permission: 'view_dashboard'
        }
      ];
  }
};

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user, userRole } = useAuth();
    const location = useLocation();
    
    const navigation = getNavigationByRole(userRole);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <h2>{isCollapsed ? 'S' : 'SISAC'}</h2>
                    {!isCollapsed && <span className="sidebar-subtitle">ERP</span>}
                </div>
                <button 
                    className="sidebar-toggle"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    {isCollapsed ? '▶' : '◀'}
                </button>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    {!isCollapsed && (
                        <div className="nav-section-title">
                            <span>Módulo: {user?.rolDescripcion}</span>
                        </div>
                    )}
                    
                    <ul className="nav-list">
                        {navigation.map((item, index) => (
                            <PermissionGuard key={index} permission={item.permission}>
                                <li className="nav-item">
                                    <Link 
                                        to={item.path} 
                                        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                        title={isCollapsed ? item.name : ''}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        {!isCollapsed && (
                                            <span className="nav-text">{item.name}</span>
                                        )}
                                    </Link>
                                </li>
                            </PermissionGuard>
                        ))}
                    </ul>
                </div>

                {!isCollapsed && (
                    <div className="sidebar-footer">
                        <div className="user-info">
                            <div className="user-avatar">
                                {user?.nombreCompleto?.charAt(0) || 'U'}
                            </div>
                            <div className="user-details">
                                <span className="user-name">{user?.nombreCompleto}</span>
                                <span className="user-role">{user?.rolDescripcion}</span>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;