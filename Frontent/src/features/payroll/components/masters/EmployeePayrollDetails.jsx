// src/features/payroll/pages/EmployeePayrollDetailsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@ui/Sidebar.jsx'; // Asegúrate de que la ruta sea correcta
import Navbar from '@ui/Navbar.jsx'; // Asegúrate de que la ruta sea correcta
import '@styles_e/DashboardPage.css'; // O el archivo CSS que uses para el layout

const EmployeePayrollDetailsPage = ({ user, onLogout }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar user={user} onLogout={onLogout} />
        <div className="dashboard-content p-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Detalles de Nómina por Empleado</h1>
          <p className="text-gray-600 mt-2">Busca un empleado para editar su Régimen Laboral, CUSPP, Cuenta Bancaria, etc.</p>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Editar Datos de Nómina del Empleado</h3>
            <input 
              type="text" 
              placeholder="Buscar Empleado por DNI/Código" 
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50" 
            />
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
              Cargar Detalles del Empleado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePayrollDetailsPage;