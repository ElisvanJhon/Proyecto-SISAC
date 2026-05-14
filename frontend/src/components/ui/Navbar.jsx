import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '@components/NotificationBell.jsx'; // Importamos el nuevo componente

const Navbar = ({ user, onLogout }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            onLogout();
            navigate('/login');
        }
    };

    return (
        <header className="navbar">
            <div className="navbar-logo">
                <h2>SISAC</h2>
            </div>
            <div className="navbar-user">
                {/* ... (código existente del perfil de usuario) ... */}
                <span className="user-name">
                    {user?.firstName} {user?.lastName}
                </span>

                <div
                    className="profile-container"
                    onMouseEnter={() => setShowProfileMenu(true)}
                    onMouseLeave={() => setShowProfileMenu(false)}
                >
                    <img
                        src={user?.profilePic || "/src/assets/images/default-avatar.png"}
                        alt="Perfil"
                        className="profile-mini"
                    />
                    {showProfileMenu && (
                        <div className="profile-menu">
                            <button onClick={() => navigate('/dashboard/edit-profile')}>
                                Editar Perfil
                            </button>
                            {/* ¡Nueva opción agregada! */}
                            <button onClick={() => navigate('/dashboard/payroll-selfservice')}>
                                Mi Nómina
                            </button>
                            <button onClick={handleLogout}>Cerrar Sesión</button>
                        </div>
                    )}
                </div>
                {/* Usamos el nuevo componente */}
                <NotificationBell />
            </div>
        </header>
    );
};

export default Navbar;