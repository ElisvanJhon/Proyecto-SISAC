// API para gestión de boletas de pago
const API_BASE_URL = 'http://localhost:8081/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Listar boletas con filtros opcionales
export const getAllPayslips = async (pagoId = null, empleadoId = null) => {
  try {
    let url = `${API_BASE_URL}/boletas`;
    const params = new URLSearchParams();
    
    if (pagoId) params.append('pagoId', pagoId);
    if (empleadoId) params.append('empleadoId', empleadoId);
    
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error('Error al obtener boletas');
    return await response.json();
  } catch (error) {
    console.error('Error en getAllPayslips:', error);
    throw error;
  }
};

// Obtener boleta por ID
export const getPayslipById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/boletas/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error('Error al obtener boleta');
    return await response.json();
  } catch (error) {
    console.error('Error en getPayslipById:', error);
    throw error;
  }
};

// Generar boletas para una planilla completa
export const generatePayslipsForPayroll = async (planillaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/boletas/generar/${planillaId}`, {
      method: 'POST',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al generar boletas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en generatePayslipsForPayroll:', error);
    throw error;
  }
};

// Crear boleta manual
export const createPayslip = async (boletaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/boletas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(boletaData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear boleta');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createPayslip:', error);
    throw error;
  }
};

// Eliminar boleta
export const deletePayslip = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/boletas/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar boleta');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en deletePayslip:', error);
    throw error;
  }
};
