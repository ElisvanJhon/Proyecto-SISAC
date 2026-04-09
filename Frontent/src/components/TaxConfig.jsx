import React, { useState } from "react";

export default function TaxConfig() {
  const [step, setStep] = useState("start");
  const [profile, setProfile] = useState(null);
  const [catalog, setCatalog] = useState(null);
  const [validated, setValidated] = useState(null);

  const handleSubmitProfile = () => {
    setProfile({ ruc: "20123456789", razon: "Empresa XYZ SAC" });
    setStep("params");
  };

  const handleSubmitParams = () => {
    setStep("catalog");
  };

  const handleUploadCatalog = () => {
    setCatalog("CatalogoCarga.csv");
    setStep("validation");
    setTimeout(() => {
      const ok = Math.random() > 0.3;
      setValidated(ok);
      setStep(ok ? "success" : "error");
    }, 1000);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-indigo-600">
        Proceso 1 – Configuración Tributaria
      </h2>

      {step === "start" && (
        <button
          onClick={handleSubmitProfile}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
        >
          Completar formulario "Alta contribuyente"
        </button>
      )}

      {step === "params" && (
        <button
          onClick={handleSubmitParams}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Confirmar Parámetros Tributarios mínimos
        </button>
      )}

      {step === "catalog" && (
        <button
          onClick={handleUploadCatalog}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Subir catálogo de productos/servicios (CSV)
        </button>
      )}

      {step === "validation" && <p>Validando catálogo y RUC...</p>}

      {step === "error" && (
        <div>
          <p className="text-red-600 font-medium">
            Validación fallida → InformeValidacion.pdf generado
          </p>
          <button
            onClick={handleSubmitProfile}
            className="px-4 py-2 mt-2 bg-orange-500 text-white rounded-lg"
          >
            Reintentar Alta contribuyente
          </button>
        </div>
      )}

      {step === "success" && (
        <div className="space-y-2">
          <p className="text-green-600 font-medium">
            Perfil fiscal activo y parámetros guardados.
          </p>
          <ul className="list-disc list-inside text-sm">
            <li>CatalogoProductos.csv</li>
            <li>ParametrosTributarios_v1.json</li>
            <li>AuditLogEntry creado</li>
          </ul>
        </div>
      )}
    </div>
  );
}
