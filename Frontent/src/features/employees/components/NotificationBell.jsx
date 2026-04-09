import React, { useState } from 'react';

const NotificationBell = () => {
    const [showNotifications, setShowNotifications] = useState(false);

    // ** Lógica de notificaciones, idealmente fetch del API **
    const notifications = [
        { id: 1, message: 'Nueva solicitud de acceso pendiente.' },
        { id: 2, message: 'Actualización en el sistema de planillas.' }
    ];

    return (
        <div
            className="notification-container"
            onClick={() => setShowNotifications(!showNotifications)}
        >
            <span className="notification-bell">🔔</span>
            {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
            )}
            {showNotifications && (
                <div className="notifications-dropdown">
                    {notifications.length > 0 ? (
                        <ul>
                            {notifications.map((notif) => (
                                <li key={notif.id}>{notif.message}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay notificaciones nuevas.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;