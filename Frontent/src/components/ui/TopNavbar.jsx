import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './TopNavbar.css';

const TopNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="top-navbar">
      <div className="navbar-content">
        {/* Título de la sección actual */}
        <div className="navbar-title">
          <h1>Sistema Integral de Administración Contable</h1>
          <span className="navbar-subtitle">
            Módulo: {user?.rolDescripcion || 'Cargando...'}
          </span>
        </div>

        {/* Sección derecha con usuario */}
        <div className="navbar-right">
          {/* Notificaciones (placeholder) */}
          <div className="navbar-notifications">
            <button className="notification-btn" title="Notificaciones">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>
          </div>

          {/* Información del usuario */}
          <div className="navbar-user" ref={dropdownRef}>
            <button 
              className="user-button"
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <div className="user-avatar">
                {user?.nombreCompleto?.charAt(0) || 'U'}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {user?.nombreCompleto || 'Usuario'}
                </span>
                <span className="user-role">
                  {user?.rol || 'Sin rol'}
                </span>
              </div>
              <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>
                ▼
              </span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-user-info">
                    <strong>{user?.nombreCompleto}</strong>
                    <small>{user?.email}</small>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <button 
                  className="dropdown-item"
                  onClick={handleProfileClick}
                >
                  <span className="dropdown-icon">👤</span>
                  Mi Perfil
                </button>
                
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    // Aquí podrías añadir lógica para configuración
                    setDropdownOpen(false);
                  }}
                >
                  <span className="dropdown-icon">⚙️</span>
                  Configuración
                </button>
                
                <div className="dropdown-divider"></div>
                
                <button 
                  className="dropdown-item logout-item"
                  onClick={handleLogout}
                >
                  <span className="dropdown-icon">🚪</span>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;