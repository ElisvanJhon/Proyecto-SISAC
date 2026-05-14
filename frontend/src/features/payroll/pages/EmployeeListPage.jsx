import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEmployees, deleteEmployee, changeEmployeeStatus } from '../api/employees';
import '../styles/EmployeeListPage.css';

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEstado, setFilterEstado] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEmployees();
  }, [filterEstado]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await getAllEmployees(filterEstado || null);
      // Filtrar empleados ELIMINADOS por defecto
      const filteredData = data.filter(emp => emp.estado !== 'ELIMINADO');
      setEmployees(filteredData);
      setError(null);
    } catch (err) {
      setError('Error al cargar empleados: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este empleado?')) return;
    
    try {
      await deleteEmployee(id);
      alert('Empleado eliminado correctamente');
      loadEmployees();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const handleChangeStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    
    try {
      await changeEmployeeStatus(id, newStatus);
      alert(`Empleado ${newStatus === 'ACTIVO' ? 'activado' : 'inactivado'} correctamente`);
      loadEmployees();
    } catch (err) {
      alert('Error al cambiar estado: ' + err.message);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const searchLower = searchTerm.toLowerCase();
    return (
      emp.nombre?.toLowerCase().includes(searchLower) ||
      emp.dni?.includes(searchTerm) ||
      emp.puesto?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) return <div className="loading">Cargando empleados...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="employee-list-page">
      <div className="page-header">
        <h1>Gestión de Empleados</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/masters/employees/new')}
        >
          ➕ Nuevo Empleado
        </button>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, DNI, puesto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={filterEstado} 
          onChange={(e) => setFilterEstado(e.target.value)}
          className="filter-select"
        >
          <option key="all" value="">Todos los estados</option>
          <option key="activo" value="ACTIVO">Activos</option>
          <option key="inactivo" value="INACTIVO">Inactivos</option>
          <option key="vacaciones" value="VACACIONES">Vacaciones</option>
          <option key="licencia" value="LICENCIA">Licencia</option>
        </select>

        <button onClick={loadEmployees} className="btn btn-secondary">
          🔄 Actualizar
        </button>
      </div>

      <div className="employees-count">
        Total: {filteredEmployees.length} empleados
      </div>

      <div className="table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DNI</th>
              <th>Nombre</th>
              <th>Puesto</th>
              <th>Sueldo Base</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No se encontraron empleados
                </td>
              </tr>
            ) : (
              filteredEmployees.map(emp => (
                <tr key={emp.id || emp.idEmpleado}>
                  <td>{emp.id || emp.idEmpleado}</td>
                  <td>{emp.dni}</td>
                  <td>{emp.nombre}</td>
                  <td>{emp.puesto}</td>
                  <td className="text-right">
                    S/ {emp.sueldoBase?.toFixed(2) || '0.00'}
                  </td>
                  <td>
                    <span className={`badge badge-${emp.estado?.toLowerCase()}`}>
                      {emp.estado}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon btn-view"
                      onClick={() => {
                        const empId = emp.id || emp.idEmpleado;
                        console.log('Ver detalles - ID:', empId);
                        navigate(`/masters/employees/${empId}`);
                      }}
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => {
                        const empId = emp.id || emp.idEmpleado;
                        console.log('Editar - ID:', empId);
                        navigate(`/masters/employees/${empId}/edit`);
                      }}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-toggle"
                      onClick={() => {
                        const empId = emp.id || emp.idEmpleado;
                        console.log('Cambiar estado - ID:', empId, 'Estado actual:', emp.estado);
                        handleChangeStatus(empId, emp.estado);
                      }}
                      title={emp.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                    >
                      {emp.estado === 'ACTIVO' ? '🔴' : '🟢'}
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => {
                        const empId = emp.id || emp.idEmpleado;
                        console.log('Eliminar - ID:', empId);
                        handleDelete(empId);
                      }}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeListPage;
