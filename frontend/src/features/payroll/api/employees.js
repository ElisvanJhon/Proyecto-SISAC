// API para gestión de empleados
const API_BASE_URL = 'http://localhost:8081/api';

// Obtener token del localStorage
const getToken = () => localStorage.getItem('token');

// Headers con autenticación
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Listar todos los empleados
export const getAllEmployees = async (estado = null) => {
  try {
    const url = estado 
      ? `${API_BASE_URL}/empleados?estado=${estado}`
      : `${API_BASE_URL}/empleados`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error('Error al obtener empleados');
    return await response.json();
  } catch (error) {
    console.error('Error en getAllEmployees:', error);
    throw error;
  }
};

// Obtener empleado por ID
export const getEmployeeById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error('Error al obtener empleado');
    return await response.json();
  } catch (error) {
    console.error('Error en getEmployeeById:', error);
    throw error;
  }
};

// Crear nuevo empleado
export const createEmployee = async (empleadoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/empleados`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(empleadoData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear empleado');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createEmployee:', error);
    throw error;
  }
};

// Actualizar empleado
export const updateEmployee = async (id, empleadoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(empleadoData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar empleado');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updateEmployee:', error);
    throw error;
  }
};

// Cambiar estado del empleado
export const changeEmployeeStatus = async (id, nuevoEstado) => {
  try {
    const response = await fetch(`${API_BASE_URL}/empleados/${id}/estado`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ estado: nuevoEstado })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al cambiar estado');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en changeEmployeeStatus:', error);
    throw error;
  }
};

// Eliminar empleado
export const deleteEmployee = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Error al eliminar empleado' }));
      throw new Error(errorData.error || 'Error al eliminar empleado');
    }
    
    // DELETE puede no retornar JSON, solo verificamos que fue exitoso
    const text = await response.text();
    return text ? JSON.parse(text) : { message: 'Empleado eliminado correctamente' };
  } catch (error) {
    console.error('Error en deleteEmployee:', error);
    throw error;
  }
};
