import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { Briefcase, FileText, Download, ArrowLeft } from 'lucide-react';
import PaystubDownloadWidget from '@components/PaystubDownloadWidget.jsx';
import '@styles_e/PayrollSelfServicePage.css';

// Datos fijos de simulación para la demostración
const mockPaystubs = [
    { id: 1, period: 'Agosto 2025', amount: 3500.00 },
    { id: 2, period: 'Julio 2025', amount: 3500.00 },
    { id: 3, period: 'Junio 2025', amount: 3500.00 },
];

/**
 * Página del empleado para gestionar información de nómina y descargar boletas.
 */
const PayrollSelfServicePage = () => {
    const navigate = useNavigate(); // Inicializamos el hook de navegación

    return (
        <div className="payroll-page">
            <div className="payroll-container">
                {/* Botón para volver al dashboard */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="back-button"
                >
                    <ArrowLeft className="back-icon" /> Volver al Dashboard
                </button>

                <h1 className="payroll-title">Portal de Autoservicio de Nómina</h1>
                <p className="payroll-subtitle">
                    Consulta tu información de pagos y descarga tus boletas electrónicas de forma segura.
                </p>

                <div className="payroll-content">
                    {/* El widget ahora tendrá un botón más estético */}
                    <PaystubDownloadWidget paystubs={mockPaystubs} />

                    {/* Sección de datos fijos */}
                    <div className="affiliation-card">
                        <h3 className="affiliation-title">
                            <Briefcase className="icon briefcase" /> Datos de Afiliación (Solo Lectura)
                        </h3>
                        <p>
                            Régimen Laboral: <span className="data-highlight">Régimen General</span>
                        </p>
                        <p>
                            Sistema de Pensiones: <span className="data-highlight">AFP Integra (CUSPP: 12345678)</span>
                        </p>
                        <p>
                            Cuenta Bancaria CTS: <span className="data-highlight">BCP Soles (Cta: XXXX-XXXX-1234)</span>
                        </p>
                        <p className="info-text">
                            Para actualizar estos datos, por favor contacta al área de RRHH.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollSelfServicePage;