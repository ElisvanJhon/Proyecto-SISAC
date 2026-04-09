// src/features/payroll/pages/PayrollSummaryReportPage.jsx
import React from 'react';
import { FileText } from 'lucide-react'; 
import Sidebar from '@ui/Sidebar.jsx'; 
import Navbar from '@ui/Navbar.jsx'; 
import '@styles_e/DashboardPage.css'; 

const PayrollSummaryReportPage = ({ user, onLogout }) => (
    <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
            <Navbar user={user} onLogout={onLogout} />
            <div className="dashboard-content p-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Resumen de Planilla por Periodo</h1>
                <p className="text-lg text-gray-600">Accede a la información histórica y analítica para la toma de decisiones.</p>

                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 mt-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-600" /> Resumen de Planilla
                    </h3>
                    <p className="text-gray-600 mb-4">Muestra el total de haberes, descuentos y aportes por mes.</p>
                    <div className="h-40 bg-gray-100 flex items-center justify-center rounded-lg text-gray-500 font-medium border border-dashed">
                        [Gráfico de barras de Gasto Salarial Mensual (Simulación)]
                    </div>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">Generar Reporte Detallado</button>
                </div>
            </div>
        </div>
    </div>
);

export default PayrollSummaryReportPage;