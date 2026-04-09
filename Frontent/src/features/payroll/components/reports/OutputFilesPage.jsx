// src/features/payroll/pages/OutputFilesPage.jsx
import React from 'react';
import { Send, Download, Banknote, ReceiptText } from 'lucide-react';
import Sidebar from '@ui/SideBar.jsx';
import Navbar from '@ui/Navbar.jsx';
import '@styles_e/DashboardPage.css';

const OutputFilesPage = ({ user, onLogout }) => (
    <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
            <Navbar user={user} onLogout={onLogout} />
            <div className="dashboard-content p-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Generación de Archivos de Salida</h1>
                <p className="text-lg text-gray-600">Exporta archivos para la presentación de impuestos, pagos bancarios y boletas.</p>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500 mt-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <Send className="w-5 h-5 mr-2 text-red-600" /> Archivos para Entidades Externas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex flex-col items-center p-4 bg-gray-100 rounded-lg hover:bg-indigo-50 transition border border-gray-200 shadow-sm">
                            <Download className="w-6 h-6 text-indigo-600 mb-2" />
                            <span className="font-medium">Archivo PLAME (SUNAT)</span>
                            <span className="text-sm text-gray-500">Exportar .txt</span>
                        </button>
                        <button className="flex flex-col items-center p-4 bg-gray-100 rounded-lg hover:bg-green-50 transition border border-gray-200 shadow-sm">
                            <Banknote className="w-6 h-6 text-green-600 mb-2" />
                            <span className="font-medium">Archivo Banco (BCP/Telecrédito)</span>
                            <span className="text-sm text-gray-500">Exportar .csv</span>
                        </button>
                        <button className="flex flex-col items-center p-4 bg-gray-100 rounded-lg hover:bg-blue-50 transition border border-gray-200 shadow-sm">
                            <ReceiptText className="w-6 h-6 text-blue-600 mb-2" />
                            <span className="font-medium">Boletas Electrónicas</span>
                            <span className="text-sm text-gray-500">Subir y Enviar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default OutputFilesPage;