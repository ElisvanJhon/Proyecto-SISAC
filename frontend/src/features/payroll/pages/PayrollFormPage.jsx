import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPayrollById, createPayroll, updatePayroll } from '../api/payroll';
import '../styles/PayrollFormPage.css';

const PayrollFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    periodo: '',
    mes: '',
    anio: new Date().getFullYear()
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      loadPayrollData();
    } else {
      // Establecer periodo actual
      const now = new Date();
      const currentPeriod = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      setFormData(prev => ({
        ...prev,
        periodo: currentPeriod,
        mes: now.getMonth() + 1,
        anio: now.getFullYear()
      }));
    }
  }, [id]);

  const loadPayrollData = async () => {
    try {
      const data = await getPayrollById(id);
      // Extraer mes y año del periodo (formato: YYYYMM)
      const periodo = data.periodo || '';
      const anio = periodo.substring(0, 4);
      const mes = periodo.substring(4, 6);
      
      setFormData({
        periodo: periodo,
        mes: parseInt(mes) || '',
        anio: parseInt(anio) || new Date().getFullYear()
      });
    } catch (error) {
      alert('Error al cargar datos de la planilla');
      navigate('/payroll');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Actualizar periodo cuando cambian mes o año
    if (name === 'mes' || name === 'anio') {
      const mes = name === 'mes' ? value : formData.mes;
      const anio = name === 'anio' ? value : formData.anio;
      if (mes && anio) {
        const periodo = `${anio}${String(mes).padStart(2, '0')}`;
        setFormData(prev => ({ ...prev, periodo }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const dataToSend = {
        periodo: formData.periodo,
        presupuestoId: 1 // ID del presupuesto por defecto
      };

      if (isEdit) {
        await updatePayroll(id, dataToSend);
        alert('Planilla actualizada correctamente');
      } else {
        await createPayroll(dataToSend);
        alert('Planilla creada correctamente');
      }

      navigate('/payroll');
    } catch (error) {
      alert(`Error al ${isEdit ? 'actualizar' : 'crear'} planilla: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div className="payroll-form-page">
      <div className="form-header">
        <h1>{isEdit ? 'Editar Planilla' : 'Nueva Planilla'}</h1>
        <button onClick={() => navigate('/payroll')} className="btn btn-secondary">
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="payroll-form">
        <div className="form-section">
          <h3>Información de la Planilla</h3>
          <p className="form-note">Seleccione el periodo para el cual se generará la planilla</p>

          <div className="form-row">
            <div className="form-group">
              <label>Mes *</label>
              <select
                name="mes"
                value={formData.mes}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione mes</option>
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
            </div>

            <div className="form-group">
              <label>Año *</label>
              <input
                type="number"
                name="anio"
                value={formData.anio}
                onChange={handleChange}
                min="2020"
                max="2030"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Periodo (formato: YYYYMM)</label>
            <input
              type="text"
              value={formData.periodo}
              disabled
              className="input-disabled"
            />
            <small>Este campo se genera automáticamente a partir del mes y año seleccionado</small>
          </div>

          <div className="info-box">
            <strong>Nota importante:</strong>
            <ul>
              <li>Solo se puede crear una planilla por periodo</li>
              <li>La planilla se creará en estado BORRADOR</li>
              <li>Después de crearla, deberá calcular las remuneraciones</li>
              <li>Solo empleados en estado ACTIVO serán incluidos</li>
            </ul>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/payroll')} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') + ' Planilla'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PayrollFormPage;
