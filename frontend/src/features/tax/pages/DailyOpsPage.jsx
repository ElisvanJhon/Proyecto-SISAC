import React, { useState } from "react";
import { useApiClient } from "../../../api/tax";
import '../styles/DailyOpsPage.css';

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
    <div className="daily-ops-page">
      <h1>
        Operación Diaria – Ventas y Compras
      </h1>

      {message.text && (
        <div className={`message-box ${message.type === 'success' ? 'success' : 'error'}`}>
          <p>{message.text}</p>
          {message.file && <p>Archivo de error generado: {message.file}</p>}
        </div>
      )}

      <div className="operations-grid">
        {/* Registro de ventas */}
        <form onSubmit={handleRegistrarVenta} className="operation-card">
          <h2>Emisión de CPE (Venta)</h2>
          <input
            placeholder="Cliente (RUC/DNI)"
            value={ventaRuc}
            onChange={(e) => setVentaRuc(e.target.value)}
            required
          />
          <h3>Ítems:</h3>
          {items.map((item, index) => (
            <div key={index} className="item-row">
                <input 
                    type="number"
                    placeholder="ID Producto"
                    value={item.productoId}
                    onChange={(e) => handleItemChange(index, 'productoId', e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Cantidad"
                    value={item.cantidad}
                    onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                />
            </div>
          ))}
          <button type="button" onClick={handleAddItem} className="add-item-btn">+ Agregar ítem</button>
          
          <button type="submit" disabled={loading} className="btn-submit primary">
            {loading ? "Registrando..." : "Generar CPE"}
          </button>
        </form>

        {/* Registro de compras */}
        <form onSubmit={handleRegistrarCompra} className="operation-card">
          <h2>Registro de Compras</h2>
          <input
            placeholder="Proveedor (RUC)"
            value={compraRuc}
            onChange={(e) => setCompraRuc(e.target.value)}
            required
          />
          <input
            placeholder="Número Factura"
            value={compraFactura}
            onChange={(e) => setCompraFactura(e.target.value)}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Monto Total (inc. IGV)"
            value={compraMonto}
            onChange={(e) => setCompraMonto(e.target.value)}
            required
          />
          <label>Adjuntar XML/PDF (Opcional):</label>
          <input
            type="file"
            onChange={(e) => setCompraFile(e.target.files[0])}
          />
          <button type="submit" disabled={loading} className="btn-submit green">
            {loading ? "Registrando..." : "Registrar Compra"}
          </button>
        </form>
      </div>
    </div>
  );
}