// API para gestión de planillas
const API_BASE_URL = 'http://localhost:8081/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Listar todas las planillas
export const getAllPayrolls = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/planillas`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error('Error al obtener planillas');
    return await response.json();
  } catch (error) {
    console.error('Error en getAllPayrolls:', error);
    throw error;
  }
};

// Obtener planilla por ID
export const getPayrollById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/planillas/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error('Error al obtener planilla');
    return await response.json();
  } catch (error) {
    console.error('Error en getPayrollById:', error);
    throw error;
  }
};

// Obtener planilla por periodo
export const getPayrollByPeriod = async (periodo) => {
  try {
    const response = await fetch(`${API_BASE_URL}/planillas/periodo/${periodo}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error('Error al obtener planilla del periodo');
    return await response.json();
  } catch (error) {
    console.error('Error en getPayrollByPeriod:', error);
    throw error;
  }
};

// Crear nueva planilla
export const createPayroll = async (planillaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/planillas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(planillaData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear planilla');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createPayroll:', error);
    throw error;
  }
};

// Actualizar planilla existente
export const updatePayroll = async (id, planillaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/planillas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(planillaData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar planilla');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updatePayroll:', error);
    throw error;
  }
};

// Calcular remuneraciones de una planilla
export const calculatePayroll = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/planillas/${id}/calcular`, {
      method: 'POST',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al calcular planilla');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en calculatePayroll:', error);
    throw error;
  }
};

// Aprobar planilla
export const approvePayroll = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/planillas/${id}/aprobar`, {
      method: 'PUT',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al aprobar planilla');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en approvePayroll:', error);
    throw error;
  }
};

// Vincular pago a planilla
export const linkPaymentToPayroll = async (planillaId, pagoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/planillas/${planillaId}/vincular-pago`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ pagoId })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al vincular pago');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en linkPaymentToPayroll:', error);
    throw error;
  }
};

// Eliminar planilla
export const deletePayroll = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/planillas/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar planilla');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en deletePayroll:', error);
    throw error;
  }
};
