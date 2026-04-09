import React, { useState } from "react";
import { useApiClient } from "../../../api/tax";
import { useAuth } from "../../../hooks/useAuth"; // Importa useAuth para obtener el token

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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">
        Cierre Mensual – Declaraciones Tributarias
      </h1>

      {message.text && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* --- Paso 1: Iniciar Cierre --- */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">
          Consolidación y Cálculo de IGV
        </h2>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Periodo (YYYYMM)"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            disabled={loading || downloading} // Deshabilitar durante carga/descarga
          />
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-400"
            onClick={handleIniciarCierre}
            disabled={loading || downloading} // Deshabilitar durante carga/descarga
          >
            {loading ? "Calculando..." : "Ejecutar Cálculo"}
          </button>
        </div>
      </div>

      {/* --- Paso 2 y 3: Revisión y Descarga --- */}
      {declaracion && (
        <div className="animate-fadeIn">
          {/* Resumen */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-lg mb-2">Resumen del Cálculo (ID: {declaracion.id})</h2>
            <p className="mb-4">Estado: <strong className={`font-medium ${
                declaracion.estado === 'APROBADO_LISTO_PRESENTAR' ? 'text-green-600' :
                declaracion.estado === 'RECHAZADO_AJUSTES' ? 'text-red-600' : 'text-yellow-600'
            }`}>{declaracion.estado}</strong></p>
            <div className="grid grid-cols-2 gap-4">
                <p>IGV Débito: <span className="font-mono">S/ {declaracion.igvDebito?.toFixed(2) ?? 'N/A'}</span></p>
                <p>IGV Crédito: <span className="font-mono">S/ {declaracion.igvCredito?.toFixed(2) ?? 'N/A'}</span></p>
                <p className="font-bold">IGV Neto: <span className="font-mono">S/ {declaracion.igvNeto?.toFixed(2) ?? 'N/A'}</span></p>
                <p className="font-bold">Renta: <span className="font-mono">S/ {declaracion.rentaPagoCuenta?.toFixed(2) ?? 'N/A'}</span></p>
            </div>
          </div>

          {/* Formularios y Reportes - Ahora usan botones y handleDownload */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-lg mb-4">
              Formularios y Reportes Exportables
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => handleDownload('borrador', `BorradorCalculo_${declaracion.periodo}.xlsx`)}
                disabled={downloading}
                className="text-indigo-600 hover:underline disabled:text-gray-400 disabled:cursor-wait"
              >
                {downloading === 'borrador' ? 'Descargando...' : `BorradorCalculo_${declaracion.periodo}.xlsx`}
              </button>
              <br/>
              <button
                 onClick={() => handleDownload('form621', declaracion.form621Pdf || `Form621_${declaracion.periodo}.pdf`)}
                 disabled={downloading}
                 className="text-indigo-600 hover:underline disabled:text-gray-400 disabled:cursor-wait"
              >
                 {downloading === 'form621' ? 'Descargando...' : `${declaracion.form621Pdf || 'Form621.pdf'} (Form 621)`}
              </button>
              <br/>
               <button
                 onClick={() => handleDownload('resumen', declaracion.resumenIgvPdf || `ResumenIGV_${declaracion.periodo}.pdf`)}
                 disabled={downloading}
                 className="text-indigo-600 hover:underline disabled:text-gray-400 disabled:cursor-wait"
               >
                 {downloading === 'resumen' ? 'Descargando...' : `${declaracion.resumenIgvPdf || 'ResumenIGV.pdf'} (Resumen IGV)`}
               </button>
            </div>
          </div>

          {/* Aprobación */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-4">
              Revisión y Aprobación Final
            </h2>

            {declaracion.estado === 'PENDIENTE_APROBACION' ? (
              <div className="flex gap-4">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
                  onClick={() => handleAprobar(true)}
                  disabled={loading || downloading}
                >
                  {loading ? 'Procesando...' : 'Aprobar'}
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded disabled:bg-gray-400"
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
                    className="px-6 py-3 bg-blue-600 text-white rounded font-medium inline-block hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-wait"
                 >
                    {downloading === 'paquete' ? 'Descargando...' : 'Descargar PaqueteDeclaracion.zip'}
                 </button>
            ) : (
                <p className="text-red-600 font-medium">Declaración Rechazada. Requiere ajustes.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}