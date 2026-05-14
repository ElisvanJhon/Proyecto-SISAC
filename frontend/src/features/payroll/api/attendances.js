// API para gestión de asistencias y novedades
const API_BASE_URL = 'http://localhost:8081/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Listar asistencias con filtros opcionales
export const getAllAttendances = async (periodo = null, empleadoId = null) => {
  try {
    let url = `${API_BASE_URL}/asistencias`;
    const params = new URLSearchParams();
    
    if (periodo) params.append('periodo', periodo);
    if (empleadoId) params.append('empleadoId', empleadoId);
    
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error('Error al obtener asistencias');
    return await response.json();
  } catch (error) {
    console.error('Error en getAllAttendances:', error);
    throw error;
  }
};

// Obtener resumen de asistencias por empleado y periodo
export const getAttendanceSummary = async (empleadoId, periodo) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/asistencias/resumen?empleadoId=${empleadoId}&periodo=${periodo}`,
      {
        method: 'GET',
        headers: getHeaders()
      }
    );
    
    if (!response.ok) throw new Error('Error al obtener resumen de asistencias');
    return await response.json();
  } catch (error) {
    console.error('Error en getAttendanceSummary:', error);
    throw error;
  }
};

// Registrar asistencia/novedad
export const createAttendance = async (asistenciaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/asistencias`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(asistenciaData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al registrar asistencia');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createAttendance:', error);
    throw error;
  }
};

// Actualizar asistencia
export const updateAttendance = async (id, asistenciaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/asistencias/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(asistenciaData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar asistencia');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updateAttendance:', error);
    throw error;
  }
};

// Eliminar asistencia
export const deleteAttendance = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/asistencias/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar asistencia');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en deleteAttendance:', error);
    throw error;
  }
};
