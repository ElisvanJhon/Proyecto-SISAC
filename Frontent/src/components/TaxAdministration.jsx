import React, { useState } from "react";
import TaxConfig from "./TaxConfig";
import DailyOps from "./DailyOps";
import MonthlyClosing from "./MonthlyClosing";

const MODULES = {
  CONFIG: "Configuración",
  DAILY: "Operación Diaria",
  MONTHLY: "Cierre Mensual",
};

export default function TaxAdministration() {
  const [active, setActive] = useState(MODULES.CONFIG);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col shadow-xl">
        <div className="p-6 text-2xl font-bold text-indigo-400 border-b">
          Área Tributaria
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {Object.values(MODULES).map((mod) => (
            <button
              key={mod}
              onClick={() => setActive(mod)}
              className={`w-full px-4 py-3 rounded-lg text-left ${
                active === mod
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              {mod}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {active === MODULES.CONFIG && <TaxConfig />}
        {active === MODULES.DAILY && <DailyOps />}
        {active === MODULES.MONTHLY && <MonthlyClosing />}
      </main>
    </div>
  );
}
