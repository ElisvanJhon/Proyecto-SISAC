import React, { useState } from 'react';
import { ReceiptText, Download } from 'lucide-react';

/**
 * Componente para mostrar boletas y permitir la descarga.
 * @param {{paystubs: Array<{id: number, period: string, amount: number}>}} props
 */
const PaystubDownloadWidget = ({ paystubs }) => {
    const [loading, setLoading] = useState(false);

    const showMessage = (message) => console.log(`[Message Box]: ${message}`);

    const handleDownload = (period) => {
        setLoading(true);
        showMessage(`Descargando boleta de ${period}...`);
        setTimeout(() => {
            setLoading(false);
            showMessage(`Boleta de ${period} descargada con éxito.`);
        }, 1500);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-xl w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <ReceiptText className="w-6 h-6 mr-2 text-indigo-600" />
                Mis Boletas Electrónicas
            </h3>
            <div className="space-y-4">
                {paystubs.map((stub) => (
                    <div key={stub.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-700">{stub.period}</span>
                            <span className="text-sm text-gray-500">Monto Neto: S/ {stub.amount.toFixed(2)}</span>
                        </div>
                        {/* Se ajusta el estilo del botón */}
                        <button
                            onClick={() => handleDownload(stub.period)}
                            disabled={loading}
                            className={`flex items-center justify-center p-2 rounded-lg transition font-medium ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                        >
                            {/* Texto solo en pantallas grandes */}
                            <span className="hidden sm:inline">Descargar</span>
                            <Download className="w-4 h-4 sm:ml-2" />
                        </button>
                    </div>
                ))}
            </div>
            {paystubs.length === 0 && <p className="text-gray-500 text-center py-4">Aún no hay boletas disponibles.</p>}
        </div>
    );
};

export default PaystubDownloadWidget;