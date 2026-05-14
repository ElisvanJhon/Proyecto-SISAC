import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById } from '../api/employees';
import '../styles/EmployeeDetailPage.css';

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || id === 'undefined') {
      setError('ID de empleado no válido');
      setLoading(false);
      return;
    }
    loadEmployeeData();
  }, [id]);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      const data = await getEmployeeById(id);
      setEmployee(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar empleado: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando empleado...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!employee) return <div className="error-message">Empleado no encontrado</div>;

  return (
    <div className="employee-detail-page">
      <div className="page-header">
        <h1>Detalles del Empleado</h1>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/masters/employees')}
          >
            ← Volver
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/masters/employees/${id}/edit`)}
          >
            ✏️ Editar
          </button>
        </div>
      </div>

      <div className="employee-detail-card">
        <div className="detail-section">
          <h3>Información Personal</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>ID</label>
              <span>{employee.idEmpleado || employee.id}</span>
            </div>
            <div className="detail-item">
              <label>Nombre Completo</label>
              <span>{employee.nombre}</span>
            </div>
            <div className="detail-item">
              <label>Documento</label>
              <span>{employee.dni || 'No registrado'}</span>
            </div>
            <div className="detail-item">
              <label>Estado</label>
              <span className={`badge badge-${employee.estado?.toLowerCase()}`}>
                {employee.estado}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Información Laboral</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Puesto/Cargo</label>
              <span>{employee.puesto || 'No especificado'}</span>
            </div>
            <div className="detail-item">
              <label>Sueldo Base</label>
              <span className="sueldo">S/ {employee.sueldoBase?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="detail-item">
              <label>Fecha de Registro</label>
              <span>{employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'No disponible'}</span>
            </div>
          </div>
        </div>

        <div className="detail-actions">
          <button 
            className="btn btn-outline"
            onClick={() => navigate(`/masters/employees/${id}/edit`)}
          >
            ✏️ Editar Información
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => navigate('/masters/employees')}
          >
            ← Volver a la Lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
