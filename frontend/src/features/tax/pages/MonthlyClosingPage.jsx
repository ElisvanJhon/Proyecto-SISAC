import React, { useState } from "react";
import { useApiClient } from "../../../api/tax";
import { useAuth } from "../../../hooks/useAuth";
import '../styles/MonthlyClosingPage.css';

export default function MonthlyClosingPage() {
  const [periodo, setPeriodo] = useState(new Date().toISOString().slice(0, 7).replace("-","")); // "YYYYMM"
  const [declaracion, setDeclaracion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(null); // Para indicar qué archivo se está descargando
  const [message, setMessage] = useState({ type: "", text: "" });

  const api = useApiClient();
  const { token } = useAuth(); // Obtén el token actual

  const handleIniciarCierre = () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    setDeclaracion(null);

    api.iniciarCierre(periodo)
      .then(data => {
        setDeclaracion(data);
        setMessage({ type: "success", text: `Cálculo para ${periodo} completado. Listo para revisión.` });
        setLoading(false);
      })
      .catch(err => {
        setMessage({ type: "error", text: `Error: ${err.message}` });
        setLoading(false);
      });
  };

  const handleAprobar = (aprobado) => {
    if (!declaracion) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    api.aprobarDeclaracion(declaracion.id, aprobado)
      .then(data => {
        // Actualiza solo los campos necesarios, evita sobreescribir todo si la respuesta es un DTO
         setDeclaracion(prev => ({ ...prev, estado: data.estado }));
        const msg = aprobado ? "Declaración APROBADA." : "Declaración RECHAZADA para ajustes.";
        setMessage({ type: "success", text: msg });
        setLoading(false);
      })
      .catch(err => {
        setMessage({ type: "error", text: `Error: ${err.message}` });
        setLoading(false);
      });
  };

  // --- Nueva Función para Descarga Autenticada ---
  const handleDownload = async (tipoArchivo, nombreArchivoSugerido) => {
    if (!declaracion) return;
    setDownloading(tipoArchivo); // Indica que este archivo se está descargando
    setMessage({ type: "", text: "" });

    const url = `http://localhost:8081/api/tax/closing/descargar/${declaracion.id}/${tipoArchivo}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // <-- ¡Añadir el token!
        },
      });

      if (response.status === 403) {
           setMessage({ type: "error", text: "Error 403: No tienes permiso para descargar este archivo." });
           setDownloading(null);
           return;
      }
      if (!response.ok) {
        throw new Error(`Error al descargar: ${response.statusText}`);
      }

      const blob = await response.blob(); // Obtiene el contenido del archivo como Blob

      // Intenta obtener el nombre del archivo de la cabecera Content-Disposition si existe
      const disposition = response.headers.get('content-disposition');
      let filename = nombreArchivoSugerido; // Usa el nombre sugerido por defecto
      if (disposition && disposition.indexOf('attachment') !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
      }

      // Crea un enlace temporal para descargar el Blob
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', filename); // Establece el nombre de archivo
      document.body.appendChild(link);
      link.click(); // Simula el clic para iniciar la descarga
      link.parentNode.removeChild(link); // Limpia el enlace
      window.URL.revokeObjectURL(link.href); // Libera la URL del objeto

    } catch (error) {
      setMessage({ type: "error", text: `Error al descargar ${tipoArchivo}: ${error.message}` });
    } finally {
      setDownloading(null); // Finaliza la indicación de descarga
    }
  };
  // --------------------------------------------------

  return (
    <div className="monthly-closing-page">
      <h1>
        Cierre Mensual y Generación de Formularios PDT (621)
      </h1>

      {message.text && (
        <div className={`message-box ${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {/* --- Paso 1: Iniciar Cierre --- */}
      <div className="control-panel">
        <h2>
          Consolidación y Cálculo de IGV
        </h2>
        <div className="control-row">
          <label>Periodo:</label>
          <input
            type="text"
            placeholder="YYYYMM"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            disabled={loading || downloading}
          />
          <button
            className="btn-primary"
            onClick={handleIniciarCierre}
            disabled={loading || downloading}
          >
            {loading ? "Calculando..." : "Ejecutar Cálculo"}
          </button>
        </div>
      </div>

      {/* --- Paso 2 y 3: Revisión y Descarga --- */}
      {declaracion && (
        <div>
          {/* Resumen */}
          <div className="declaration-card">
            <h2>Resumen del Cálculo</h2>
            <p><strong>ID:</strong> {declaracion.id}</p>
            <p><strong>Estado:</strong> <span className={`status-badge ${
                declaracion.estado === 'APROBADO_LISTO_PRESENTAR' ? 'approved' :
                declaracion.estado === 'RECHAZADO_AJUSTES' ? 'rejected' : 'pending'
            }`}>{declaracion.estado}</span></p>
            
            <h3>Resumen de Impuestos</h3>
            <div className="summary-grid">
                <div className="summary-item"><strong>IGV Débito</strong><span>S/ {declaracion.igvDebito?.toFixed(2) ?? 'N/A'}</span></div>
                <div className="summary-item"><strong>IGV Crédito</strong><span>S/ {declaracion.igvCredito?.toFixed(2) ?? 'N/A'}</span></div>
                <div className="summary-item"><strong>IGV Neto</strong><span>S/ {declaracion.igvNeto?.toFixed(2) ?? 'N/A'}</span></div>
                <div className="summary-item"><strong>Renta</strong><span>S/ {declaracion.rentaPagoCuenta?.toFixed(2) ?? 'N/A'}</span></div>
            </div>

            
            <h3>Formularios y Reportes Exportables</h3>
            <ul className="file-list">
              <li>
                <strong>Borrador de Cálculo</strong>
                <button
                  onClick={() => handleDownload('borrador', `BorradorCalculo_${declaracion.periodo}.xlsx`)}
                  disabled={downloading}
                  className="btn-download"
                >
                  {downloading === 'borrador' ? 'Descargando...' : 'Descargar XLSX'}
                </button>
              </li>
              <li>
                <strong>Formulario 621 (PDT)</strong>
                <button
                   onClick={() => handleDownload('form621', declaracion.form621Pdf || `Form621_${declaracion.periodo}.pdf`)}
                   disabled={downloading}
                   className="btn-download"
                >
                   {downloading === 'form621' ? 'Descargando...' : 'Descargar PDF'}
                </button>
              </li>
              <li>
                <strong>Resumen IGV</strong>
                <button
                   onClick={() => handleDownload('resumen', declaracion.resumenIgvPdf || `ResumenIGV_${declaracion.periodo}.pdf`)}
                   disabled={downloading}
                   className="btn-download"
                 >
                   {downloading === 'resumen' ? 'Descargando...' : 'Descargar PDF'}
                 </button>
              </li>
            </ul>

            
            <h3>Revisión y Aprobación Final</h3>

            {declaracion.estado === 'PENDIENTE_APROBACION' ? (
              <div className="action-buttons">
                <button
                  className="btn-approve"
                  onClick={() => handleAprobar(true)}
                  disabled={loading || downloading}
                >
                  {loading ? 'Procesando...' : 'Aprobar'}
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleAprobar(false)}
                  disabled={loading || downloading}
                >
                  {loading ? 'Procesando...' : 'Solicitar Ajustes'}
                </button>
              </div>
            ) : declaracion.estado === 'APROBADO_LISTO_PRESENTAR' ? (
                 <button
                    onClick={() => handleDownload('paquete', declaracion.paqueteZip || `PaqueteDeclaracion_${declaracion.periodo}.zip`)}
                    disabled={downloading}
                    className="btn-submit-final"
                 >
                    {downloading === 'paquete' ? 'Descargando...' : 'Descargar PaqueteDeclaracion.zip'}
                 </button>
            ) : (
                <p style={{color: '#991b1b', fontWeight: '600'}}>Declaración Rechazada. Requiere ajustes.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}