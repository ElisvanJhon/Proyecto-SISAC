import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPayrollById } from '../api/payroll';
import '../styles/PayrollDetailPage.css';

const PayrollDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPayrollData();
  }, [id]);

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      const data = await getPayrollById(id);
      console.log('📋 Datos de planilla:', data);
      setPayroll(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar planilla: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando planilla...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!payroll) return <div className="error-message">Planilla no encontrada</div>;

  return (
    <div className="payroll-detail-page">
      <div className="page-header">
        <h1>Detalle de Planilla {payroll.periodo}</h1>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/payroll/list')}
          >
            ← Volver
          </button>
          {payroll.estado === 'BORRADOR' && (
            <button 
              className="btn btn-primary"
              onClick={() => navigate(`/payroll/${id}/edit`)}
            >
              ✏️ Editar
            </button>
          )}
        </div>
      </div>

      <div className="payroll-detail-card">
        {/* Información General */}
        <div className="detail-section">
          <h3>Información General</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>ID</label>
              <span>{payroll.id || payroll.idPlanilla}</span>
            </div>
            <div className="detail-item">
              <label>Periodo</label>
              <span>{payroll.periodo}</span>
            </div>
            <div className="detail-item">
              <label>Estado</label>
              <span className={`badge badge-${payroll.estado?.toLowerCase()}`}>
                {payroll.estado}
              </span>
            </div>
            <div className="detail-item">
              <label>Fecha de Creación</label>
              <span>{payroll.createdAt ? new Date(payroll.createdAt).toLocaleDateString() : 'No disponible'}</span>
            </div>
          </div>
        </div>

        {/* Totales */}
        <div className="detail-section">
          <h3>Totales</h3>
          <div className="totals-grid">
            <div className="total-card">
              <label>Total Bruto</label>
              <span className="amount">S/ {payroll.totalBruto?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="total-card">
              <label>Total Descuentos</label>
              <span className="amount">S/ {(payroll.totalBruto - payroll.totalNeto)?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="total-card highlight">
              <label>Total Neto</label>
              <span className="amount">S/ {payroll.totalNeto?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Empleados incluidos */}
        {payroll.remuneraciones && payroll.remuneraciones.length > 0 && (
          <div className="detail-section">
            <h3>Empleados Incluidos ({payroll.remuneraciones.length})</h3>
            <div className="table-container">
              <table className="remuneraciones-table">
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>DNI</th>
                    <th>Puesto</th>
                    <th className="text-right">Sueldo Bruto</th>
                    <th className="text-right">Descuentos</th>
                    <th className="text-right">Aportes Empleador</th>
                    <th className="text-right">Sueldo Neto</th>
                  </tr>
                </thead>
                <tbody>
                  {payroll.remuneraciones.map((rem, idx) => (
                    <tr key={idx}>
                      <td>{rem.empleadoNombre || 'N/A'}</td>
                      <td>{rem.empleadoDni || 'N/A'}</td>
                      <td>{rem.empleadoPuesto || 'N/A'}</td>
                      <td className="text-right">S/ {rem.sueldoBruto?.toFixed(2)}</td>
                      <td className="text-right">S/ {rem.descuentos?.toFixed(2)}</td>
                      <td className="text-right">S/ {rem.aportes?.toFixed(2)}</td>
                      <td className="text-right highlight">S/ {rem.sueldoNeto?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(!payroll.remuneraciones || payroll.remuneraciones.length === 0) && (
          <div className="detail-section">
            <div className="empty-state">
              <p>Esta planilla aún no tiene empleados calculados.</p>
              {payroll.estado === 'BORRADOR' && (
                <p>Vaya a "Revisión de Pre-Nómina" para calcular las remuneraciones.</p>
              )}
            </div>
          </div>
        )}

        <div className="detail-actions">
          <button 
            className="btn btn-outline"
            onClick={() => navigate('/payroll/list')}
          >
            ← Volver a la Lista
          </button>
          {payroll.estado === 'APROBADA' && (
            <button 
              className="btn btn-success"
              onClick={() => navigate('/payroll/outputs')}
            >
              📄 Generar Archivos
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollDetailPage;
