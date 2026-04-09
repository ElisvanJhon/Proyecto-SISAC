// src/features/payroll/pages/MonthlyNoveltyEntryPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@ui/Sidebar.jsx'; // Asegúrate de que la ruta sea correcta
import Navbar from '@ui/Navbar.jsx'; // Asegúrate de que la ruta sea correcta
import '@styles_e/DashboardPage.css'; // O el archivo CSS que uses para el layout
import { Clock } from 'lucide-react'; // Simulación de icono

const MonthlyNoveltyEntryPage = ({ user, onLogout }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar user={user} onLogout={onLogout} />
                <div className="dashboard-content p-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Ingreso de Novedades</h1>
                    <p className="text-gray-600 mt-2">Registrar horas extras, faltas, adelantos y bonificaciones del periodo actual.</p>

                    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500 mt-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-yellow-600" /> Novedades Mensuales
                        </h3>
                        <p className="text-gray-600">Aquí se mostrará la interfaz para registrar las novedades de la nómina.</p>
                        <button className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium">Registrar Novedades</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyNoveltyEntryPage;