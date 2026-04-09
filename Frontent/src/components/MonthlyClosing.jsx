import React, { useState } from "react";

export default function MonthlyClosing() {
  const [step, setStep] = useState("trigger");
  const [approved, setApproved] = useState(null);

  const handleCalculo = () => setStep("calculo");
  const handleRevision = (ok) => {
    setApproved(ok);
    setStep(ok ? "approved" : "rejected");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-indigo-600">
        Proceso 3 – Cierre mensual y declaraciones
      </h2>

      {step === "trigger" && (
        <button
          onClick={handleCalculo}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
        >
          Ejecutar Cierre del Periodo
        </button>
      )}

      {step === "calculo" && (
        <div>
          <p className="text-blue-600">
            Cálculo en proceso → BorradorCalculo.xlsx generado
          </p>
          <p className="text-sm mt-2">
            Archivos listos: Form621.pdf, ResumenIGV.pdf, Libros Excel
          </p>
          <button
            onClick={() => handleRevision(true)}
            className="px-4 py-2 mt-2 bg-green-500 text-white rounded-lg"
          >
            Aprobar Declaración
          </button>
          <button
            onClick={() => handleRevision(false)}
            className="px-4 py-2 mt-2 ml-2 bg-red-500 text-white rounded-lg"
          >
            Rechazar Declaración
          </button>
        </div>
      )}

      {step === "approved" && (
        <div className="space-y-2">
          <p className="text-green-600 font-medium">
            Declaración aprobada. PaqueteDeclaracion_YYYYMM.zip disponible.
          </p>
          <p className="text-sm">
            Calendario actualizado + AuditLogFinal registrado
          </p>
        </div>
      )}

      {step === "rejected" && (
        <p className="text-red-600">
          Declaración rechazada → ListaAjustes creada
        </p>
      )}
    </div>
  );
}
