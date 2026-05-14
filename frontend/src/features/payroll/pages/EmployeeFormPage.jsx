import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmployeeById, createEmployee, updateEmployee } from '../api/employees';
import '../styles/EmployeeFormPage.css';

const EmployeeFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    puesto: '',
    sueldoBase: '',
    estado: 'ACTIVO'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      if (!id || id === 'undefined') {
        setError('ID de empleado no válido');
        return;
      }
      loadEmployee();
    }
  }, [id]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const data = await getEmployeeById(id);
      
      setFormData({
        nombre: data.nombre || '',
        dni: data.dni || '',
        puesto: data.puesto || '',
        sueldoBase: data.sueldoBase || '',
        estado: data.estado || 'ACTIVO'
      });
    } catch (err) {
      setError('Error al cargar empleado: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      
      const dataToSend = {
        nombre: formData.nombre,
        dni: formData.dni,
        puesto: formData.puesto,
        sueldoBase: parseFloat(formData.sueldoBase),
        estado: formData.estado
      };

      if (isEdit) {
        await updateEmployee(id, dataToSend);
        alert('Empleado actualizado correctamente');
      } else {
        await createEmployee(dataToSend);
        alert('Empleado creado correctamente');
      }
      
      navigate('/masters/employees');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) return <div className="loading">Cargando...</div>;

  return (
    <div className="employee-form-page">
      <div className="form-header">
        <h1>{isEdit ? 'Editar Empleado' : 'Nuevo Empleado'}</h1>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/masters/employees')}
        >
          ← Volver
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-section">
          <h3>Información del Empleado</h3>
          <p className="form-note">Complete solo los campos que se guardarán en el sistema</p>
          
          <div className="form-row">
            <div className="form-group">
              <label>Nombre Completo *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez López"
                required
              />
              <small>Ingrese el nombre completo del empleado</small>
            </div>

            <div className="form-group">
              <label>DNI *</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="12345678"
                maxLength="8"
                pattern="[0-9]{8}"
                required
              />
              <small>Documento Nacional de Identidad (8 dígitos)</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Puesto/Cargo *</label>
              <input
                type="text"
                name="puesto"
                value={formData.puesto}
                onChange={handleChange}
                placeholder="Ej: Gerente, Asistente, Operario"
                required
              />
            </div>

            <div className="form-group">
              <label>Sueldo Base (S/) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="sueldoBase"
                value={formData.sueldoBase}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
              <small>Monto mensual base antes de descuentos</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Estado *</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
              <small>Solo empleados ACTIVOS aparecerán en planillas</small>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/masters/employees')}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Empleado')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeFormPage;
