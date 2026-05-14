import React, { useState, useEffect } from 'react';
import { getAllPayrolls } from '../../api/payroll';
import { generatePayslipsForPayroll } from '../../api/payslips';
import '../../styles/OutputFiles.css';

const OutputFilesPage = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [selectedPayroll, setSelectedPayroll] = useState('');
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        loadPayrolls();
    }, []);

    const loadPayrolls = async () => {
        try {
            const data = await getAllPayrolls();
            console.log('📁 [Archivos] Todas las planillas:', data);
            const approved = data.filter(p => 
                p.estado === 'APROBADO' || p.estado === 'APROBADA' || 
                p.estado === 'CALCULADO' || p.estado === 'CALCULADA'
            );
            console.log('📁 [Archivos] Planillas aprobadas/calculadas:', approved);
            setPayrolls(approved);
        } catch (error) {
            console.error('Error loading payrolls:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadFile = async (url, filename) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al descargar el archivo');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
    };

    const handleExportPLAME = async () => {
        if (!selectedPayroll) {
            alert('Por favor seleccione una planilla');
            return;
        }

        try {
            setGenerating(true);
            const planilla = payrolls.find(p => p.id === parseInt(selectedPayroll));
            const filename = `PLAME_${planilla.periodo}.txt`;
            await downloadFile(`http://localhost:8081/api/planillas/${selectedPayroll}/exportar/plame`, filename);
            alert('Archivo PLAME descargado correctamente');
        } catch (error) {
            alert('Error al exportar PLAME: ' + error.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleExportBank = async () => {
        if (!selectedPayroll) {
            alert('Por favor seleccione una planilla');
            return;
        }

        try {
            setGenerating(true);
            const planilla = payrolls.find(p => p.id === parseInt(selectedPayroll));
            const filename = `BANCO_${planilla.periodo}.csv`;
            await downloadFile(`http://localhost:8081/api/planillas/${selectedPayroll}/exportar/banco`, filename);
            alert('Archivo bancario CSV descargado correctamente');
        } catch (error) {
            alert('Error al exportar archivo bancario: ' + error.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleExportBankExcel = async () => {
        if (!selectedPayroll) {
            alert('Por favor seleccione una planilla');
            return;
        }

        try {
            setGenerating(true);
            const planilla = payrolls.find(p => p.id === parseInt(selectedPayroll));
            const filename = `BANCO_${planilla.periodo}.xlsx`;
            await downloadFile(`http://localhost:8081/api/planillas/${selectedPayroll}/exportar/banco/excel`, filename);
            alert('Archivo bancario Excel descargado correctamente');
        } catch (error) {
            alert('Error al exportar archivo bancario Excel: ' + error.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleGeneratePayslipsPDF = async () => {
        if (!selectedPayroll) {
            alert('Por favor seleccione una planilla');
            return;
        }

        try {
            setGenerating(true);
            // Descargar el PDF directamente desde las remuneraciones
            const planilla = payrolls.find(p => p.id === parseInt(selectedPayroll));
            const filename = `BOLETAS_${planilla.periodo}.pdf`;
            await downloadFile(`http://localhost:8081/api/planillas/${selectedPayroll}/exportar/boletas/pdf`, filename);
            alert('Boletas PDF descargadas correctamente');
        } catch (error) {
            alert('Error al generar boletas PDF: ' + error.message);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <div className="loading">Cargando...</div>;

    return (
        <div className="output-files-page">
            <h1>Generación de Archivos de Salida</h1>
            <p className="subtitle">Exporta archivos para impuestos, pagos bancarios y boletas</p>

            <div className="payroll-selector">
                <label>Seleccionar Planilla Aprobada/Calculada:</label>
                <select 
                    value={selectedPayroll} 
                    onChange={(e) => setSelectedPayroll(e.target.value)}
                >
                    <option value="">-- Seleccione una planilla --</option>
                    {payrolls.map(payroll => (
                        <option key={payroll.id} value={payroll.id}>
                            {payroll.periodo} - {payroll.estado} - {payroll.remuneraciones?.length || 0} empleados
                        </option>
                    ))}
                </select>
            </div>

            <div className="files-grid">
                <div className="file-card plame">
                    <div className="card-icon">📄</div>
                    <h3>Archivo PLAME</h3>
                    <p>Exportar datos para SUNAT (TXT)</p>
                    <button 
                        onClick={handleExportPLAME}
                        disabled={!selectedPayroll || generating}
                        className="btn btn-plame"
                    >
                        {generating ? '⏳ Descargando...' : '📥 Exportar TXT'}
                    </button>
                </div>

                <div className="file-card bank">
                    <div className="card-icon">🏦</div>
                    <h3>Archivo Bancario</h3>
                    <p>Telecredito / Pagos masivos</p>
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                        <button 
                            onClick={handleExportBank}
                            disabled={!selectedPayroll || generating}
                            className="btn btn-bank"
                        >
                            {generating ? '⏳ Descargando...' : '📥 Exportar CSV'}
                        </button>
                        <button 
                            onClick={handleExportBankExcel}
                            disabled={!selectedPayroll || generating}
                            className="btn btn-bank"
                        >
                            {generating ? '⏳ Descargando...' : '📥 Exportar Excel'}
                        </button>
                    </div>
                </div>

                <div className="file-card payslips">
                    <div className="card-icon">📋</div>
                    <h3>Boletas de Pago</h3>
                    <p>Generar boletas electrónicas (PDF)</p>
                    <button 
                        onClick={handleGeneratePayslipsPDF}
                        disabled={!selectedPayroll || generating}
                        className="btn btn-payslips"
                    >
                        {generating ? '⏳ Generando...' : '📋 Descargar Boletas PDF'}
                    </button>
                </div>
            </div>

            {!selectedPayroll && (
                <div className="info-message">
                    ℹ️ Seleccione una planilla aprobada para habilitar las opciones de exportación
                </div>
            )}
        </div>
    );
};

export default OutputFilesPage;