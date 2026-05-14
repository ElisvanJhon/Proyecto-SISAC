import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPayrolls, deletePayroll, calculatePayroll, approvePayroll } from '../api/payroll';
import '../styles/PayrollListPage.css';

const PayrollListPage = () => {
  const navigate = useNavigate();
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEstado, setFilterEstado] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPayrolls();
  }, [filterEstado]);

  const loadPayrolls = async () => {
    try {
      setLoading(true);
      const data = await getAllPayrolls();
      
      let filtered = data;
      if (filterEstado) {
        filtered = data.filter(p => p.estado === filterEstado);
      }
      
      setPayrolls(filtered);
      setError(null);
    } catch (err) {
      setError('Error al cargar planillas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async (id) => {
    if (!window.confirm('¿Está seguro de calcular esta planilla?')) return;
    
    try {
      await calculatePayroll(id);
      alert('Planilla calculada correctamente');
      loadPayrolls();
    } catch (err) {
      alert('Error al calcular: ' + err.message);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('¿Está seguro de aprobar esta planilla?')) return;
    
    try {
      await approvePayroll(id);
      alert('Planilla aprobada correctamente');
      loadPayrolls();
    } catch (err) {
      alert('Error al aprobar: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta planilla?')) return;
    
    try {
      await deletePayroll(id);
      alert('Planilla eliminada correctamente');
      loadPayrolls();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'BORRADOR': 'badge-draft',
      'CALCULADO': 'badge-calculated',
      'APROBADO': 'badge-approved'
    };
    return badges[estado] || 'badge-default';
  };

  const filteredPayrolls = payrolls.filter(payroll => {
    const searchLower = searchTerm.toLowerCase();
    return (
      payroll.periodo?.toLowerCase().includes(searchLower) ||
      payroll.estado?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) return <div className="loading">Cargando planillas...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="payroll-list-page">
      <div className="page-header">
        <h1>Gestión de Planillas</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/payroll/new')}
        >
          ➕ Nueva Planilla
        </button>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="🔍 Buscar por periodo, descripción..."
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
          <option key="borrador" value="BORRADOR">Borrador</option>
          <option key="calculado" value="CALCULADO">Calculado</option>
          <option key="aprobado" value="APROBADO">Aprobado</option>
        </select>

        <button onClick={loadPayrolls} className="btn btn-secondary">
          🔄 Actualizar
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total Planillas</span>
          <span className="stat-value">{payrolls.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Borradores</span>
          <span className="stat-value">{payrolls.filter(p => p.estado === 'BORRADOR').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Calculadas</span>
          <span className="stat-value">{payrolls.filter(p => p.estado === 'CALCULADO').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Aprobadas</span>
          <span className="stat-value">{payrolls.filter(p => p.estado === 'APROBADO').length}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Periodo</th>
              <th>Estado</th>
              <th>Total Bruto</th>
              <th>Total Neto</th>
              <th>Empleados</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayrolls.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No hay planillas registradas</td>
              </tr>
            ) : (
              filteredPayrolls.map(payroll => (
                <tr key={payroll.id}>
                  <td>{payroll.id}</td>
                  <td>{payroll.periodo}</td>
                  <td>
                    <span className={`badge ${getEstadoBadge(payroll.estado)}`}>
                      {payroll.estado}
                    </span>
                  </td>
                  <td>S/ {payroll.totalBruto?.toFixed(2) || '0.00'}</td>
                  <td>S/ {payroll.totalNeto?.toFixed(2) || '0.00'}</td>
                  <td>{payroll.remuneraciones?.length || 0}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => navigate(`/payroll/${payroll.id}`)}
                      className="btn-icon"
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    
                    {payroll.estado === 'BORRADOR' && (
                      <>
                        <button
                          onClick={() => navigate(`/payroll/${payroll.id}/edit`)}
                          className="btn-icon"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleCalculate(payroll.id)}
                          className="btn-icon btn-success"
                          title="Calcular"
                        >
                          🧮
                        </button>
                      </>
                    )}
                    
                    {payroll.estado === 'CALCULADO' && (
                      <button
                        onClick={() => handleApprove(payroll.id)}
                        className="btn-icon btn-success"
                        title="Aprobar"
                      >
                        ✓
                      </button>
                    )}
                    
                    {payroll.estado !== 'APROBADO' && (
                      <button
                        onClick={() => handleDelete(payroll.id)}
                        className="btn-icon btn-danger"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    )}
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

export default PayrollListPage;
