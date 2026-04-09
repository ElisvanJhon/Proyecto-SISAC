// src/features/payroll/pages/LegalParametersPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@ui/Sidebar.jsx'; // Asegúrate de que la ruta sea correcta
import Navbar from '@ui/Navbar.jsx'; // Asegúrate de que la ruta sea correcta
import { Coins, Settings } from 'lucide-react'; // Simulación de iconos, asegúrate de tener lucide-react instalado

const LegalParametersPage = ({ legal, centers, user, onLogout }) => {
  // Simulación de datos si no los pasas por props
  const defaultLegal = { uit: 5150.00, rmv: 1025.00 };
  const finalLegal = legal || defaultLegal;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar user={user} onLogout={onLogout} />
        <div className="dashboard-content p-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Maestros y Configuración</h1>
          <div className="grid grid-cols-1 gap-8 mt-6">
            
            {/* Parámetros Legales */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <Coins className="w-5 h-5 mr-2 text-indigo-600" /> Parámetros Legales (UIT y RMV)
              </h3>
              <p className="text-gray-600">UIT actual: <span className="font-bold text-indigo-600">S/ {finalLegal.uit.toFixed(2)}</span></p>
              <p className="text-gray-600">RMV actual: <span className="font-bold text-indigo-600">S/ {finalLegal.rmv.toFixed(2)}</span></p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Gestionar Histórico / AFP Config
              </button>
            </div>

            {/* Gestión de Conceptos y Afectación */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-yellow-600" /> Gestión de Conceptos y Afectación
              </h3>
              <p className="text-gray-600">Define si los haberes y descuentos están afectos a Renta de 5ta, ESSALUD, o Aportes.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Editar Conceptos
              </button>
            </div>

            {/* No se incluye CostCenterTable ya que la instrucción fue eliminar "costos" de la página */}
            {/* Puedes agregarla aquí si lo necesitas */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalParametersPage;