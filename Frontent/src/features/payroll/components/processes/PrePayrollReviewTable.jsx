// src/features/payroll/pages/PrePayrollReviewPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@ui/Sidebar.jsx';
import Navbar from '@ui/Navbar.jsx';
import '@styles_e/DashboardPage.css';
import { Calculator, Eye } from 'lucide-react'; // Simulación de iconos

const PrePayrollReviewPage = ({ user, onLogout }) => {
    const [isCalculated, setIsCalculated] = useState(false);
    const showMessage = (message) => console.log(`[Message Box]: ${message}`);

    const handleCalculate = () => {
        showMessage('Iniciando proceso de cálculo de nómina... (Simulación)');
        setTimeout(() => {
            setIsCalculated(true);
            showMessage('Cálculo finalizado.');
        }, 1000);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar user={user} onLogout={onLogout} />
                <div className="dashboard-content p-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Revisión de Pre-Nómina</h1>
                    <p className="text-gray-600 mt-2">Inicia el cálculo y revisa los resultados antes de postear la planilla.</p>
                    
                    {/* Sección de Cálculo */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 mt-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                            <Calculator className="w-5 h-5 mr-2 text-indigo-600" /> 
                            Ejecutar Cálculo de Planilla
                        </h3>
                        <p className="text-gray-600">Inicia el motor de cálculo (aportes, retenciones, etc.).</p>
                        <button
                            onClick={handleCalculate}
                            className={`mt-4 px-6 py-3 text-white rounded-lg shadow-md transition font-semibold ${isCalculated ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            disabled={isCalculated}
                        >
                            {isCalculated ? 'Cálculo Completo' : 'Ejecutar Liquidación'}
                        </button>
                    </div>

                    {/* Sección de Revisión de Tabla */}
                    {isCalculated && (
                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 animate-fadeIn mt-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                <Eye className="w-5 h-5 mr-2 text-green-600" /> 
                                Pre-Nómina para Revisión
                            </h3>
                            <p className="text-lg text-green-700 font-medium">Planilla calculada exitosamente. Lista para revisión.</p>
                            <div className="overflow-x-auto mt-4 border border-gray-200 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Neto a Pagar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr className="hover:bg-green-50">
                                            <td className="px-6 py-4">Juan Pérez</td>
                                            <td className="px-6 py-4 font-bold text-green-700">S/ 3,120.50</td>
                                        </tr>
                                        <tr className="hover:bg-green-50">
                                            <td className="px-6 py-4">Ana Gómez</td>
                                            <td className="px-6 py-4 font-bold text-green-700">S/ 4,500.00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-lg">
                                Postear Planilla (Finalizar)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrePayrollReviewPage;