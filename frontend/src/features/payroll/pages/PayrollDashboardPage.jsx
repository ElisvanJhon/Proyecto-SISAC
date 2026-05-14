import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPayrolls } from '../api/payroll';
import { getAllEmployees } from '../api/employees';
import '../styles/PayrollDashboardPage.css';

const PayrollDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmpleados: 0,
    empleadosActivos: 0,
    planillasDelMes: 0,
    totalNomina: 0
  });
  const [recentPayrolls, setRecentPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar empleados
      const employees = await getAllEmployees();
      console.log('📊 [Dashboard] Total empleados:', employees.length, employees);
      const activeEmployees = employees.filter(e => e.estado === 'ACTIVO');
      console.log('📊 [Dashboard] Empleados activos:', activeEmployees.length);
      
      // Cargar planillas
      const payrolls = await getAllPayrolls();
      console.log('📊 [Dashboard] Todas las planillas:', payrolls);
      console.log('📊 [Dashboard] Primera planilla completa:', payrolls[0]);
      
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      console.log('📊 [Dashboard] Mes/Año actual:', currentMonth, '/', currentYear);
      console.log('📊 [Dashboard] Buscando periodo:', `${currentYear}${currentMonth.toString().padStart(2, '0')}`);
      
      // La planilla usa formato YYYYMM en el campo "periodo", no campos separados mes/anio
      const currentPeriod = `${currentYear}${currentMonth.toString().padStart(2, '0')}`; // "202512"
      const monthPayrolls = payrolls.filter(p => p.periodo === currentPeriod);
      console.log('📊 [Dashboard] Planillas del mes actual (por periodo):', monthPayrolls);

      // Calcular total de nómina del mes
      const totalNomina = monthPayrolls.reduce((sum, p) => sum + (p.totalNeto || 0), 0);
      console.log('📊 [Dashboard] Total nómina del mes:', totalNomina);

      setStats({
        totalEmpleados: employees.length,
        empleadosActivos: activeEmployees.length,
        planillasDelMes: monthPayrolls.length,
        totalNomina: totalNomina
      });

      // Obtener últimas 5 planillas
      const sorted = [...payrolls].sort((a, b) => b.id - a.id);
      console.log('📊 [Dashboard] Últimas 5 planillas:', sorted.slice(0, 5));
      setRecentPayrolls(sorted.slice(0, 5));

    } catch (error) {
      console.error('❌ [Dashboard] Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  return (
    <div className="payroll-dashboard-page">
      <h1>Dashboard de Planilla</h1>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalEmpleados}</h3>
            <p>Total Empleados</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.empleadosActivos}</h3>
            <p>Empleados Activos</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.planillasDelMes}</h3>
            <p>Planillas del Mes</p>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>S/ {stats.totalNomina.toFixed(2)}</h3>
            <p>Total Nómina del Mes</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <button 
          className="action-btn primary"
          onClick={() => navigate('/masters/employees')}
        >
          👥 Gestionar Empleados
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => navigate('/payroll/list')}
        >
          📋 Ver Planillas
        </button>
        <button 
          className="action-btn success"
          onClick={() => navigate('/payroll/novelties')}
        >
          ✏️ Registrar Novedades
        </button>
      </div>

      <div className="recent-payrolls">
        <h2>Planillas Recientes</h2>
        {recentPayrolls.length === 0 ? (
          <p className="no-data">No hay planillas registradas</p>
        ) : (
          <table className="payrolls-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Periodo</th>
                <th>Estado</th>
                <th>Empleados</th>
                <th>Total Bruto</th>
                <th>Total Neto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recentPayrolls.map(payroll => (
                <tr key={payroll.id}>
                  <td>{payroll.id}</td>
                  <td>{payroll.periodo}</td>
                  <td>
                    <span className={`badge badge-${payroll.estado?.toLowerCase()}`}>
                      {payroll.estado}
                    </span>
                  </td>
                  <td>{payroll.remuneraciones?.length || 0}</td>
                  <td>S/ {payroll.totalBruto?.toFixed(2) || '0.00'}</td>
                  <td>S/ {payroll.totalNeto?.toFixed(2) || '0.00'}</td>
                  <td>
                    <button
                      className="btn-sm"
                      onClick={() => navigate(`/payroll/${payroll.id}`)}
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PayrollDashboardPage;