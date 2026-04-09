import React, { useState } from "react";

export default function DailyOps() {
  const [step, setStep] = useState("ventaStart");
  const [error, setError] = useState(false);

  const handleVenta = () => {
    const ok = Math.random() > 0.3;
    if (ok) {
      setStep("ventaOk");
    } else {
      setError(true);
      setStep("ventaError");
    }
  };

  const handleCompra = () => {
    const ok = Math.random() > 0.2;
    if (ok) {
      setStep("compraOk");
    } else {
      setStep("compraError");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-indigo-600">
        Proceso 2 – Operación diaria: Emisión CPE y Registro Compras
      </h2>

      {step === "ventaStart" && (
        <button
          onClick={handleVenta}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
        >
          Registrar Venta (cliente + ítems)
        </button>
      )}

      {step === "ventaError" && (
        <p className="text-red-600">
          Error de validación → ErrorFacturacion.pdf generado
        </p>
      )}

      {step === "ventaOk" && (
        <div>
          <p className="text-green-600 font-medium">
            CPE generado (CPE_XML + CPE_PDF). Registro de ventas actualizado.
          </p>
          <button
            onClick={handleCompra}
            className="px-4 py-2 mt-2 bg-green-500 text-white rounded-lg"
          >
            Registrar Factura de Proveedor
          </button>
        </div>
      )}

      {step === "compraError" && (
        <p className="text-red-600">
          Validación fallida → IncidenciaCompra.pdf generado
        </p>
      )}

      {step === "compraOk" && (
        <div className="space-y-2">
          <p className="text-green-600 font-medium">
            Compra registrada correctamente.
          </p>
          <ul className="list-disc list-inside text-sm">
            <li>RegistroComprasEntry</li>
            <li>Archivo almacenado</li>
            <li>AuditLogEntry creado</li>
          </ul>
        </div>
      )}
    </div>
  );
}
