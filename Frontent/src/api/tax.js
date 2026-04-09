import { useAuth } from '../hooks/useAuth';

// Hook personalizado para obtener el cliente de API autenticado
export const useApiClient = () => {
  const { token, logout } = useAuth();

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${token}`,
  });

  const getAuthHeadersJson = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  const handleResponse = async (response) => {
    if (response.status === 401 || response.status === 403) {
      logout();
      throw new Error('Sesión inválida o expirada.');
    }
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la solicitud');
    }
    return response.json();
  };

  const API_URL = 'http://localhost:8081/api/tax';

  return {
    // --- Proceso 1: Configuración ---
    getConfiguracion: () => 
        fetch(`${API_URL}/config`, {
            method: 'GET',
            headers: getAuthHeaders(),
        }).then(handleResponse),

    guardarContribuyente: (data) =>
        fetch(`${API_URL}/config/contribuyente`, {
            method: 'POST',
            headers: getAuthHeadersJson(),
            body: JSON.stringify(data),
        }).then(handleResponse),

    guardarParametros: (data) =>
        fetch(`${API_URL}/config/parametros`, {
            method: 'POST',
            headers: getAuthHeadersJson(),
            body: JSON.stringify(data),
        }).then(handleResponse),
    
    subirCatalogo: (formData) =>
        fetch(`${API_URL}/config/catalogo`, {
            method: 'POST',
            headers: getAuthHeaders(), // No 'Content-Type', el navegador lo pone con FormData
            body: formData,
        }).then(handleResponse),

    // --- Proceso 2: Operación Diaria ---
    registrarVenta: (data) =>
        fetch(`${API_URL}/daily/venta`, {
            method: 'POST',
            headers: getAuthHeadersJson(),
            body: JSON.stringify(data),
        }).then(handleResponse),
    
    registrarCompra: (formData) =>
        fetch(`${API_URL}/daily/compra`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData,
        }).then(handleResponse),

    // --- Proceso 3: Cierre Mensual ---
    iniciarCierre: (periodo) =>
        fetch(`${API_URL}/closing/iniciar`, {
            method: 'POST',
            headers: getAuthHeadersJson(),
            body: JSON.stringify({ periodo }),
        }).then(handleResponse),

    aprobarDeclaracion: (declaracionId, aprobado) =>
        fetch(`${API_URL}/closing/aprobar`, {
            method: 'POST',
            headers: getAuthHeadersJson(),
            body: JSON.stringify({ declaracionId, aprobado }),
        }).then(handleResponse),
  };
};