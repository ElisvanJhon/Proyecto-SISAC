import React, { useState } from "react";
import { useApiClient } from "../../../api/tax";

export default function DailyOpsPage() {
  // Estado Venta
  const [ventaRuc, setVentaRuc] = useState("");
  const [items, setItems] = useState([{ productoId: 1, cantidad: 1 }]); // Simulación, deberías buscar productos
  
  // Estado Compra
  const [compraRuc, setCompraRuc] = useState("");
  const [compraFactura, setCompraFactura] = useState("");
  const [compraMonto, setCompraMonto] = useState(0);
  const [compraFile, setCompraFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "", file: null });

  const api = useApiClient();

  const handleAddItem = () => {
    setItems([...items, { productoId: 1, cantidad: 1 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };
  
  // --- Proceso 2: Venta ---
  const handleRegistrarVenta = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const ventaData = {
        clienteRucDni: ventaRuc,
        items: items
    };

    api.registrarVenta(ventaData)
      .then(response => {
        setMessage({ type: "success", text: `${response.message} XML: ${response.xml}, PDF: ${response.pdf}`, file: null });
        setLoading(false);
        // Limpiar formulario
        setVentaRuc("");
        setItems([{ productoId: 1, cantidad: 1 }]);
      })
      .catch(err => {
        setMessage({ type: "error", text: `Error Validación: ${err.message}`, file: err.file });
        setLoading(false);
      });
  };

  // --- Proceso 2: Compra ---
  const handleRegistrarCompra = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("proveedorRuc", compraRuc);
    formData.append("numeroFactura", compraFactura);
    formData.append("montoTotal", compraMonto);
    if (compraFile) {
      formData.append("file", compraFile);
    }

    api.registrarCompra(formData)
      .then(response => {
        setMessage({ type: "success", text: response.message, file: null });
        setLoading(false);
        // Limpiar formulario
        setCompraRuc("");
        setCompraFactura("");
        setCompraMonto(0);
        setCompraFile(null);
      })
      .catch(err => {
        setMessage({ type: "error", text: `Error Validación: ${err.message}`, file: err.file });
        setLoading(false);
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">
        Operación Diaria – Ventas y Compras
      </h1>

      {message.text && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p>{message.text}</p>
          {message.file && <p>Archivo de error generado: {message.file}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registro de ventas */}
        <form onSubmit={handleRegistrarVenta} className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold text-lg mb-4">Emisión de CPE (Venta)</h2>
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="Cliente (RUC/DNI)"
            value={ventaRuc}
            onChange={(e) => setVentaRuc(e.target.value)}
            required
          />
          <h3 className="font-medium mt-2">Ítems:</h3>
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
                <input 
                    type="number"
                    className="border p-2 rounded w-1/2"
                    placeholder="ID Producto"
                    value={item.productoId}
                    onChange={(e) => handleItemChange(index, 'productoId', e.target.value)}
                />
                <input
                    type="number"
                    className="border p-2 rounded w-1/2"
                    placeholder="Cantidad"
                    value={item.cantidad}
                    onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                />
            </div>
          ))}
          <button type="button" onClick={handleAddItem} className="text-sm text-indigo-600 mb-4">+ Agregar ítem</button>
          
          <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-400">
            {loading ? "Registrando..." : "Generar CPE"}
          </button>
        </form>

        {/* Registro de compras */}
        <form onSubmit={handleRegistrarCompra} className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold text-lg mb-4">Registro de Compras</h2>
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="Proveedor (RUC)"
            value={compraRuc}
            onChange={(e) => setCompraRuc(e.target.value)}
            required
          />
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="Número Factura"
            value={compraFactura}
            onChange={(e) => setCompraFactura(e.target.value)}
            required
          />
          <input
            type="number"
            step="0.01"
            className="border p-2 rounded w-full mb-2"
            placeholder="Monto Total (inc. IGV)"
            value={compraMonto}
            onChange={(e) => setCompraMonto(e.target.value)}
            required
          />
          <label className="block text-sm text-gray-600 mb-2">Adjuntar XML/PDF (Opcional):</label>
          <input
            type="file"
            className="border p-2 rounded w-full mb-4"
            onChange={(e) => setCompraFile(e.target.files[0])}
          />
          <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400">
            {loading ? "Registrando..." : "Registrar Compra"}
          </button>
        </form>
      </div>
    </div>
  );
}