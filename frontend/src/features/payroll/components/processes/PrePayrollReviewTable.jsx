import React, { useState, useEffect } from 'react';
import { getAllPayrolls, calculatePayroll, approvePayroll, getPayrollById } from '../../api/payroll';
import '../../styles/PrePayrollReview.css';

const PrePayrollReviewPage = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [selectedPayroll, setSelectedPayroll] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPayrolls();
    }, []);

    const loadPayrolls = async () => {
        try {
            const data = await getAllPayrolls();
            console.log('📋 Todas las planillas:', data);
            const draftPayrolls = data.filter(p => p.estado === 'BORRADOR' || p.estado === 'CALCULADO');
            console.log('📋 Planillas filtradas (BORRADOR/CALCULADO):', draftPayrolls);
            setPayrolls(draftPayrolls);
        } catch (error) {
            console.error('Error loading payrolls:', error);
        } finally {
            setLoading(false);
        }
    };

    /*
    const handleCalculate = async (id) => {
        if (!window.confirm('¿Iniciar cálculo de nómina?')) return;
        
        try {
            console.log('🧮 Iniciando cálculo para planilla ID:', id);
            const result = await calculatePayroll(id);
            console.log('✅ Resultado del cálculo:', result);
            alert('Cálculo finalizado correctamente');
            await loadPayrolls();
            // Cargar la planilla actualizada con sus remuneraciones
            const { getPayrollById } = await import('../../api/payroll');
            const updatedPayroll = await getPayrollById(id);
            console.log('🔄 Planilla actualizada después del cálculo:', updatedPayroll);
            setSelectedPayroll(updatedPayroll);
        } catch (error) {
            console.error('❌ Error al calcular:', error);
            alert('Error al calcular: ' + error.message);
        }
    };
    */
   const handleCalculate = async (id) => {
        if (!window.confirm('¿Iniciar cálculo de nómina?')) return;
        
        try {
            console.log('🧮 Iniciando cálculo para planilla ID:', id);
            const result = await calculatePayroll(id);
            console.log('✅ Resultado del cálculo:', result);
            alert('Cálculo finalizado correctamente');
            
            await loadPayrolls();
            // ¡SOLUCIÓN AQUÍ! Usar la función importada normalmente arriba, no dinámicamente
            const updatedPayroll = await getPayrollById(id); 
            console.log('🔄 Planilla actualizada después del cálculo:', updatedPayroll);
            setSelectedPayroll(updatedPayroll);
        } catch (error) {
            console.error('❌ Error al calcular:', error);
            alert('Error al calcular: ' + error.message);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('¿Aprobar y postear planilla?')) return;
        
        try {
            await approvePayroll(id);
            alert('Planilla aprobada correctamente');
            loadPayrolls();
            setSelectedPayroll(null);
        } catch (error) {
            alert('Error al aprobar: ' + error.message);
        }
    };

    if (loading) return <div className="loading">Cargando planillas...</div>;

    return (
        <div className="pre-payroll-review">
            <h1>Revisión de Pre-Nómina</h1>
            <p className="subtitle">Selecciona una planilla, calcula y revisa antes de aprobar</p>
            
            {/* Instrucciones y Fórmulas */}
            <div className="instructions-panel">
                <h3>🧮 Proceso de Cálculo y Aprobación</h3>
                <div className="process-steps">
                    <div className="process-step">
                        <div className="step-badge borrador">BORRADOR</div>
                        <div className="step-content">
                            <h4>1. Seleccionar Planilla en Borrador</h4>
                            <p>Elija la planilla que desea calcular. Solo planillas en estado BORRADOR pueden ser calculadas.</p>
                        </div>
                    </div>
                    <div className="step-arrow">→</div>
                    <div className="process-step">
                        <div className="step-badge calculado">CALCULADO</div>
                        <div className="step-content">
                            <h4>2. Calcular Remuneraciones</h4>
                            <p>El sistema aplica las fórmulas a cada empleado ACTIVO:</p>
                            <ul className="formula-list">
                                <li><strong>Sueldo Bruto:</strong> Sueldo base del empleado</li>
                                <li><strong>Descuentos (13%):</strong> AFP/ONP del empleado</li>
                                <li><strong>Aportes (9%):</strong> EsSalud (asumido por empleador)</li>
                                <li><strong>Sueldo Neto:</strong> Bruto - Descuentos</li>
                            </ul>
                        </div>
                    </div>
                    <div className="step-arrow">→</div>
                    <div className="process-step">
                        <div className="step-badge aprobado">APROBADO</div>
                        <div className="step-content">
                            <h4>3. Revisar y Aprobar</h4>
                            <p>Revise los totales y la lista de empleados. Al aprobar, la planilla queda BLOQUEADA y lista para generar archivos.</p>
                        </div>
                    </div>
                </div>

                <div className="calculation-info">
                    <h4>📊 Información del Cálculo</h4>
                    <div className="calc-details">
                        <div className="calc-item">
                            <span className="calc-icon">👥</span>
                            <div>
                                <strong>Empleados Incluidos</strong>
                                <p>Solo empleados con estado = ACTIVO</p>
                            </div>
                        </div>
                        <div className="calc-item">
                            <span className="calc-icon">💰</span>
                            <div>
                                <strong>Total Bruto</strong>
                                <p>Suma de todos los sueldos brutos</p>
                            </div>
                        </div>
                        <div className="calc-item">
                            <span className="calc-icon">📉</span>
                            <div>
                                <strong>Total Descuentos</strong>
                                <p>13% de cada sueldo bruto (AFP/ONP)</p>
                            </div>
                        </div>
                        <div className="calc-item">
                            <span className="calc-icon">✅</span>
                            <div>
                                <strong>Total Neto</strong>
                                <p>Monto total a pagar a empleados</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Lista de planillas pendientes */}
            <div className="payroll-selector">
                <h3>Planillas Pendientes de Cálculo</h3>
                {payrolls.length === 0 ? (
                    <p className="no-data">No hay planillas en borrador o calculadas</p>
                ) : (
                    <div className="payroll-cards">
                        {payrolls.map(payroll => (
                            <div 
                                key={payroll.id}
                                className={`payroll-card ${selectedPayroll?.id === payroll.id ? 'selected' : ''}`}
                                onClick={async () => {
                                    // Si la planilla está calculada, cargar el detalle completo con remuneraciones
                                    if (payroll.estado === 'CALCULADO') {
                                        try {
                                            const fullPayroll = await getPayrollById(payroll.id);
                                            setSelectedPayroll(fullPayroll);
                                        } catch (error) {
                                            console.error('Error al cargar detalle:', error);
                                            setSelectedPayroll(payroll);
                                        }
                                    } else {
                                        setSelectedPayroll(payroll);
                                    }
                                }}
                            >
                                <div className="card-header">
                                    <span className="periodo">{payroll.periodo}</span>
                                    <span className={`badge badge-${payroll.estado.toLowerCase()}`}>
                                        {payroll.estado}
                                    </span>
                                </div>
                                <p className="info">Empleados: {payroll.remuneraciones?.length || 0}</p>
                                {payroll.totalNeto > 0 && (
                                    <p className="total">Total: S/ {payroll.totalNeto.toFixed(2)}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Acciones de cálculo y aprobación */}
            {selectedPayroll && (
                <div className="calculation-section">
                    <h3>Acciones para Planilla {selectedPayroll.periodo}</h3>
                    
                    <div className="action-buttons">
                        {selectedPayroll.estado === 'BORRADOR' && (
                            <button
                                onClick={() => handleCalculate(selectedPayroll.id)}
                                className="btn btn-calculate"
                            >
                                🧮 Ejecutar Cálculo
                            </button>
                        )}
                        
                        {selectedPayroll.estado === 'CALCULADO' && (
                            <>
                                <div className="calc-success">
                                    <p>✓ Planilla calculada exitosamente</p>
                                    <p className="total-display">
                                        Total Bruto: S/ {selectedPayroll.totalBruto?.toFixed(2) || '0.00'} | 
                                        Total Neto: S/ {selectedPayroll.totalNeto?.toFixed(2) || '0.00'}
                                    </p>
                                </div>

                                {/* Tabla de empleados incluidos */}
                                {selectedPayroll.remuneraciones && selectedPayroll.remuneraciones.length > 0 && (
                                    <div className="employee-list">
                                        <h4>Empleados incluidos en la planilla ({selectedPayroll.remuneraciones.length})</h4>
                                        <table className="remuneraciones-table">
                                            <thead>
                                                <tr>
                                                    <th>Empleado</th>
                                                    <th>DNI</th>
                                                    <th>Puesto</th>
                                                    <th>Novedades</th>
                                                    <th>Sueldo Bruto</th>
                                                    <th>Descuentos</th>
                                                    <th>Aportes Empleador</th>
                                                    <th>Sueldo Neto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedPayroll.remuneraciones.map((rem, idx) => {
                                                    const novedades = rem.novedades || [];
                                                    const hasNovedades = novedades.length > 0;
                                                    
                                                    return (
                                                        <tr key={idx}>
                                                            <td>{rem.empleadoNombre || 'N/A'}</td>
                                                            <td>{rem.empleadoDni || 'N/A'}</td>
                                                            <td>{rem.empleadoPuesto || 'N/A'}</td>
                                                            <td className="novedades-cell">
                                                                {hasNovedades ? (
                                                                    <div className="novedades-list">
                                                                        {novedades.map((nov, nIdx) => (
                                                                            <div key={nIdx} className={`novedad-item ${nov.tipo?.toLowerCase()}`}>
                                                                                <span className="novedad-concepto">{nov.concepto}</span>
                                                                                <span className="novedad-monto">
                                                                                    {nov.tipo === 'DESCUENTO' ? '-' : '+'}S/ {nov.monto?.toFixed(2)}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <span className="no-novedades">Sin novedades</span>
                                                                )}
                                                            </td>
                                                            <td>S/ {rem.sueldoBruto?.toFixed(2)}</td>
                                                            <td>S/ {rem.descuentos?.toFixed(2)}</td>
                                                            <td>S/ {rem.aportes?.toFixed(2)}</td>
                                                            <td><strong>S/ {rem.sueldoNeto?.toFixed(2)}</strong></td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleApprove(selectedPayroll.id)}
                                    className="btn btn-approve"
                                >
                                    ✓ Aprobar Planilla
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrePayrollReviewPage;