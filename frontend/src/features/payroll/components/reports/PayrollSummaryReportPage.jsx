import React, { useState, useEffect } from 'react';
import { getAllPayrolls, getPayrollByPeriod } from '../../api/payroll';
import '../../styles/PayrollSummaryReport.css';

const PayrollSummaryReportPage = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPayrolls();
    }, []);

    const loadPayrolls = async () => {
        try {
            const data = await getAllPayrolls();
            console.log('📊 [Resumen] Todas las planillas:', data);
            const approved = data.filter(p => 
                p.estado === 'APROBADO' || p.estado === 'APROBADA' || 
                p.estado === 'CALCULADO' || p.estado === 'CALCULADA'
            );
            console.log('📊 [Resumen] Planillas aprobadas/calculadas:', approved);
            setPayrolls(approved);
        } catch (error) {
            console.error('Error loading payrolls:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSummary = async (periodo) => {
        try {
            const data = await getPayrollByPeriod(periodo);
            setSummary(data);
        } catch (error) {
            alert('Error al cargar resumen: ' + error.message);
        }
    };

    const handlePeriodChange = (e) => {
        const period = e.target.value;
        setSelectedPeriod(period);
        if (period) {
            loadSummary(period);
        } else {
            setSummary(null);
        }
    };

    if (loading) return <div className="loading">Cargando...</div>;

    return (
        <div className="payroll-summary-report">
            <h1>Resumen de Planilla por Periodo</h1>
            <p className="subtitle">Información histórica y analítica para la toma de decisiones</p>

            <div className="period-selector">
                <label>Seleccionar Periodo:</label>
                <select value={selectedPeriod} onChange={handlePeriodChange}>
                    <option value="">-- Seleccione un periodo --</option>
                    {payrolls.map(payroll => (
                        <option key={payroll.id} value={payroll.periodo}>
                            {payroll.periodo} - {payroll.estado} - {payroll.remuneraciones?.length || 0} empleados
                        </option>
                    ))}
                </select>
            </div>

            {summary && (
                <div className="summary-content">
                    <div className="summary-cards">
                        <div className="summary-card blue">
                            <span className="card-label">Total Bruto</span>
                            <span className="card-value">S/ {summary.totalBruto?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="summary-card green">
                            <span className="card-label">Total Neto</span>
                            <span className="card-value">S/ {summary.totalNeto?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="summary-card orange">
                            <span className="card-label">Estado</span>
                            <span className="card-value">{summary.estado}</span>
                        </div>
                    </div>

                    <div className="summary-details">
                        <h3>Detalles de la Planilla</h3>
                        <table className="details-table">
                            <tbody>
                                <tr>
                                    <th>ID Planilla:</th>
                                    <td>{summary.id}</td>
                                </tr>
                                <tr>
                                    <th>Periodo:</th>
                                    <td>{summary.periodo}</td>
                                </tr>
                                <tr>
                                    <th>Cantidad de Empleados:</th>
                                    <td>{summary.remuneraciones?.length || 0}</td>
                                </tr>
                                <tr>
                                    <th>Estado:</th>
                                    <td><span className={`badge badge-${summary.estado?.toLowerCase()}`}>{summary.estado}</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!summary && selectedPeriod && (
                <div className="no-data">No se encontraron datos para el periodo seleccionado</div>
            )}
        </div>
    );
};

export default PayrollSummaryReportPage;