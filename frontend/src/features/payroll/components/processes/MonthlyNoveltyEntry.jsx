import React, { useState, useEffect } from 'react';
import { getAllEmployees } from '../../api/employees';
import { createAttendance, getAllAttendances } from '../../api/attendances';
import '../../styles/MonthlyNoveltyEntry.css';

const MonthlyNoveltyEntry = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [novelties, setNovelties] = useState([]);
  const [formData, setFormData] = useState({
    empleadoId: '',
    periodo: '',
    tipoNovedad: 'HORAS_EXTRAS',
    cantidad: '',
    monto: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Establecer periodo actual (YYYY-MM)
    const now = new Date();
    const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setPeriodo(currentPeriod);
    setFormData(prev => ({ ...prev, periodo: currentPeriod }));
    
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee && periodo) {
      loadNovelties();
    }
  }, [selectedEmployee, periodo]);

  const loadEmployees = async () => {
    try {
      const data = await getAllEmployees('ACTIVO');
      console.log('Empleados cargados:', data);
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadNovelties = async () => {
    try {
      if (!selectedEmployee) return;
      const employeeId = parseInt(selectedEmployee);
      const data = await getAllAttendances(periodo, employeeId);
      setNovelties(data);
    } catch (error) {
      console.error('Error loading novelties:', error);
      setNovelties([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'empleadoId') {
      setSelectedEmployee(value);
    }
    
    // Actualizar el estado periodo cuando cambia el selector
    if (name === 'periodo') {
      setPeriodo(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.empleadoId) {
      alert('Por favor seleccione un empleado');
      return;
    }
    
    try {
      setLoading(true);
      
      // Adaptar los datos al modelo de Asistencias del backend
      const cantidad = parseFloat(formData.cantidad) || 0;
      
      // CORREGIDO: Usar el periodo seleccionado para construir la fecha
      // Formato periodo: "2025-09" -> convertir a fecha del mes: "2025-09-15"
      const [year, month] = periodo.split('-');
      const fechaDelPeriodo = `${year}-${month}-15`; // Usar día 15 del mes seleccionado
      
      const dataToSend = {
        empleadoId: parseInt(formData.empleadoId),
        fecha: fechaDelPeriodo, // Usar fecha del periodo seleccionado
        horasTrabajadas: formData.tipoNovedad === 'HORAS_EXTRAS' ? 0 : cantidad,
        horasExtra: formData.tipoNovedad === 'HORAS_EXTRAS' ? cantidad : 0,
        tardanza: formData.tipoNovedad === 'TARDANZA' ? cantidad : 0,
        ausencia: formData.tipoNovedad === 'FALTA'
      };

      console.log('📅 Periodo seleccionado:', periodo);
      console.log('📅 Fecha generada:', fechaDelPeriodo);
      console.log('📤 Datos a enviar:', dataToSend);

      await createAttendance(dataToSend);
      alert('Novedad registrada exitosamente para el periodo ' + periodo);
      
      // Resetear formulario parcialmente
      setFormData(prev => ({
        ...prev,
        cantidad: '',
        monto: '',
        descripcion: ''
      }));
      
      // Recargar novedades
      loadNovelties();
    } catch (error) {
      alert('Error al registrar novedad: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="monthly-novelty-entry">
      <h1>Ingreso de Novedades Mensuales</h1>
      <p className="subtitle">Registrar horas extras, faltas, adelantos y bonificaciones</p>

      {/* Instrucciones */}
      <div className="instructions-box">
        <h3>📋 ¿Cómo funciona esta página?</h3>
        <div className="instructions-content">
          <div className="instruction-item">
            <span className="step-number">1</span>
            <div>
              <strong>Seleccione el Periodo y Empleado</strong>
              <p>Elija el mes y el empleado para el cual registrará novedades.</p>
            </div>
          </div>
          <div className="instruction-item">
            <span className="step-number">2</span>
            <div>
              <strong>Registre la Novedad</strong>
              <p>Indique el tipo (horas extras, tardanza, falta) y la cantidad correspondiente.</p>
            </div>
          </div>
          <div className="instruction-item">
            <span className="step-number">3</span>
            <div>
              <strong>Guarde el Registro</strong>
              <p>Las novedades se registran en el sistema de asistencias y pueden afectar el cálculo de la planilla.</p>
            </div>
          </div>
        </div>
        <div className="info-note">
          <strong>ℹ️ Nota:</strong> Las novedades registradas aquí se vincularán con el sistema de asistencias. 
          Actualmente el módulo registra horas extras, tardanzas y ausencias que pueden ser consultadas posteriormente.
        </div>
      </div>

      <div className="novelty-form-container">
        <form onSubmit={handleSubmit} className="novelty-form">
          <div className="form-row">
            <div className="form-group">
              <label>Periodo *</label>
              <input
                type="month"
                name="periodo"
                value={formData.periodo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Empleado *</label>
              <select
                name="empleadoId"
                value={formData.empleadoId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un empleado</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre} - DNI: {emp.dni}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Novedad *</label>
              <select
                name="tipoNovedad"
                value={formData.tipoNovedad}
                onChange={handleChange}
                required
              >
                <option key="horas" value="HORAS_EXTRAS">Horas Extras</option>
                <option key="falta" value="FALTA">Falta</option>
                <option key="tardanza" value="TARDANZA">Tardanza</option>
                <option key="adelanto" value="ADELANTO">Adelanto de Sueldo</option>
                <option key="bonificacion" value="BONIFICACION">Bonificación</option>
                <option key="descuento" value="DESCUENTO">Descuento</option>
              </select>
            </div>

            <div className="form-group">
              <label>Cantidad</label>
              <input
                type="number"
                step="0.01"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                placeholder="Horas, días, etc."
              />
            </div>

            <div className="form-group">
              <label>Monto (S/)</label>
              <input
                type="number"
                step="0.01"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
              placeholder="Detalle adicional sobre la novedad..."
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : '💾 Registrar Novedad'}
          </button>
        </form>

        {selectedEmployee && (
          <div className="novelties-list">
            <h3>Novedades Registradas - {periodo}</h3>
            {novelties.length === 0 ? (
              <p className="no-data">No hay novedades registradas para este empleado en el periodo seleccionado</p>
            ) : (
              <table className="novelties-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Horas Trabajadas</th>
                    <th>Horas Extra</th>
                    <th>Tardanza</th>
                    <th>Ausencia</th>
                  </tr>
                </thead>
                <tbody>
                  {novelties.map((nov, index) => (
                    <tr key={index}>
                      <td>{nov.fecha || '-'}</td>
                      <td>{nov.horasTrabajadas || 0}</td>
                      <td>{nov.horasExtra || 0}</td>
                      <td>{nov.tardanza || 0}</td>
                      <td>{nov.ausencia ? 'Sí' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyNoveltyEntry;