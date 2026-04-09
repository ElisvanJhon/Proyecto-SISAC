import React, { useState, useEffect } from "react";
import { useApiClient } from "@api/tax";

export default function TaxConfigPage() {
  const [step, setStep] = useState(1); // 1: Perfil, 2: Parámetros, 3: Catálogo
  const [loading, setLoading] = useState(true);
  
  // Formularios
  const [perfil, setPerfil] = useState({
    ruc: "",
    razonSocial: "",
    regimen: "Régimen General", // Valor por defecto
    domicilio: "",
    representanteLegal: "",
    cuentaBancaria: "",
  });
  
  const [params, setParams] = useState({
    tasaIgv: 18.0,
    reglasRedondeo: "COMERCIAL",
    formatoExportacion: "PDT_SUNAT",
  });
  
  const [catalogoFile, setCatalogoFile] = useState(null);
  const [configStatus, setConfigStatus] = useState({
    contribuyente: null,
    parametros: null,
    cantidadProductos: 0
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const api = useApiClient();

  // Cargar estado inicial
  useEffect(() => {
    api.getConfiguracion()
      .then(data => {
        setConfigStatus(data);
        if (data.contribuyente) {
          setPerfil(data.contribuyente);
        }
        if (data.parametros) {
          setParams(data.parametros);
        }
        setLoading(false);
      })
      .catch(err => {
        setMessage({ type: "error", text: `Error al cargar: ${err.message}` });
        setLoading(false);
      });
  }, []);

  const handlePerfilChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleParamsChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    setCatalogoFile(e.target.files[0]);
  };

  const handleSavePerfil = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    api.guardarContribuyente(perfil)
      .then(data => {
        setConfigStatus(data);
        setMessage({ type: "success", text: "Perfil guardado exitosamente." });
        setStep(2);
        setLoading(false);
      })
      .catch(err => {
        setMessage({ type: "error", text: err.message });
        setLoading(false);
      });
  };
  
  const handleSaveParams = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    api.guardarParametros(params)
      .then(data => {
        setConfigStatus(data);
        setMessage({ type: "success", text: "Parámetros guardados y versionados." });
        setStep(3);
        setLoading(false);
      })
      .catch(err => {
        setMessage({ type: "error", text: err.message });
        setLoading(false);
      });
  };

  const handleUploadCatalogo = (e) => {
    e.preventDefault();
    if (!catalogoFile) {
        setMessage({ type: "error", text: "Debe seleccionar un archivo CSV." });
        return;
    }
    
    setLoading(true);
    setMessage({ type: "", text: "" });
    
    const formData = new FormData();
    formData.append("file", catalogoFile);

    api.subirCatalogo(formData)
      .then(response => {
        setMessage({ type: "success", text: response.message });
        // Recargar status
        api.getConfiguracion().then(setConfigStatus);
        setLoading(false);
      })
      .catch(err => {
        setMessage({ type: "error", text: `Error de Validación: ${err.message}` });
        setLoading(false);
      });
  };
  
  if (loading && !configStatus.contribuyente) return <p>Cargando configuración...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">
        Configuración Tributaria – Perfil del Contribuyente
      </h1>

      {message.text && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Navegación por Pasos */}
      <div className="mb-4 border-b">
        <button onClick={() => setStep(1)} className={`py-2 px-4 ${step === 1 ? 'border-b-2 border-indigo-500 font-medium' : 'text-gray-500'}`}>
          Paso 1: Perfil Contribuyente
        </button>
        <button onClick={() => setStep(2)} disabled={!configStatus.contribuyente} className={`py-2 px-4 ${step === 2 ? 'border-b-2 border-indigo-500 font-medium' : 'text-gray-500'} disabled:opacity-50`}>
          Paso 2: Parámetros
        </button>
        <button onClick={() => setStep(3)} disabled={!configStatus.parametros} className={`py-2 px-4 ${step === 3 ? 'border-b-2 border-indigo-500 font-medium' : 'text-gray-500'} disabled:opacity-50`}>
          Paso 3: Catálogo
        </button>
      </div>

      {step === 1 && (
        <form onSubmit={handleSavePerfil} className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold text-lg mb-4">Alta de Contribuyente</h2>
          <div className="grid grid-cols-2 gap-4">
            <input name="ruc" value={perfil.ruc} onChange={handlePerfilChange} className="border p-2 rounded" placeholder="RUC (11 dígitos)" required />
            <input name="razonSocial" value={perfil.razonSocial} onChange={handlePerfilChange} className="border p-2 rounded" placeholder="Razón Social" required />
            <select name="regimen" value={perfil.regimen} onChange={handlePerfilChange} className="border p-2 rounded">
                <option value="Régimen General">Régimen General</option>
                <option value="Régimen MYPE">Régimen MYPE Tributario</option>
                <option value="Régimen Especial">Régimen Especial de Renta</option>
            </select>
            <input name="domicilio" value={perfil.domicilio} onChange={handlePerfilChange} className="border p-2 rounded" placeholder="Domicilio Fiscal" />
            <input name="cuentaBancaria" value={perfil.cuentaBancaria} onChange={handlePerfilChange} className="border p-2 rounded" placeholder="Cuenta Bancaria" />
            <input name="representanteLegal" value={perfil.representanteLegal} onChange={handlePerfilChange} className="border p-2 rounded" placeholder="Representante Legal" />
          </div>
          <button type="submit" disabled={loading} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-400">
            {loading ? "Guardando..." : "Guardar y continuar (Paso 2)"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSaveParams} className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold text-lg mb-4">Parámetros Tributarios Mínimos</h2>
          <p className="text-sm text-gray-600 mb-4">Al guardar, se creará una nueva versión de los parámetros.</p>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" step="0.01" name="tasaIgv" value={params.tasaIgv} onChange={handleParamsChange} className="border p-2 rounded" placeholder="Porcentaje IGV (ej: 18.0)" />
            <input name="reglasRedondeo" value={params.reglasRedondeo} onChange={handleParamsChange} className="border p-2 rounded" placeholder="Reglas de Redondeo" />
            <input name="formatoExportacion" value={params.formatoExportacion} onChange={handleParamsChange} className="border p-2 rounded" placeholder="Formato Exportación" />
          </div>
          <button type="submit" disabled={loading} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-400">
            {loading ? "Guardando..." : "Confirmar y continuar (Paso 3)"}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleUploadCatalogo} className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold text-lg mb-4">Carga de Catálogo de Productos/Servicios</h2>
          <p className="text-sm text-gray-600 mb-4">Productos actuales en BD: <strong>{configStatus.cantidadProductos}</strong></p>
          <input type="file" name="file" onChange={handleFileChange} className="mb-4" accept=".csv" />
          <p className="text-sm text-gray-600 mb-4">
            Sube un archivo <code>CatalogoCarga.csv</code> (Campos: codigo, descripcion, precio_unitario, afectacion_igv).
          </p>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400">
            {loading ? "Validando y Guardando..." : "Validar y Activar Perfil"}
          </button>
        </form>
      )}
    </div>
  );
}