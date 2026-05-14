import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

// Configurar axios instance con interceptores para JWT
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT automáticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API para Convocatorias
export const convocatoriasApi = {
  // Obtener todas las convocatorias
  getAll: () => apiClient.get('/convocatorias'),
  
  // Obtener convocatoria por ID
  getById: (id) => apiClient.get(`/convocatorias/${id}`),
  
  // Crear nueva convocatoria
  create: (convocatoria) => apiClient.post('/convocatorias', convocatoria),
  
  // Actualizar convocatoria
  update: (id, convocatoria) => apiClient.put(`/convocatorias/${id}`, convocatoria),
  
  // Eliminar convocatoria
  delete: (id) => apiClient.delete(`/convocatorias/${id}`),
};

// API para Candidatos
export const candidatosApi = {
  // Obtener todos los candidatos
  getAll: () => apiClient.get('/candidatos'),
  
  // Obtener candidato por ID
  getById: (id) => apiClient.get(`/candidatos/${id}`),
  
  // Obtener candidato por email
  getByEmail: (email) => apiClient.get(`/candidatos/email/${email}`),
  
  // Crear nuevo candidato
  create: (candidato) => apiClient.post('/candidatos', candidato),
  
  // Actualizar candidato
  update: (id, candidato) => apiClient.put(`/candidatos/${id}`, candidato),
  
  // Eliminar candidato
  delete: (id) => apiClient.delete(`/candidatos/${id}`),
};

// API para Postulaciones
export const postulacionesApi = {
  // Obtener todas las postulaciones
  getAll: () => apiClient.get('/postulaciones'),
  
  // Obtener postulación por ID
  getById: (id) => apiClient.get(`/postulaciones/${id}`),
  
  // Crear nueva postulación
  create: (postulacion) => apiClient.post('/postulaciones', postulacion),
  
  // Actualizar postulación
  update: (id, postulacion) => apiClient.put(`/postulaciones/${id}`, postulacion),
  
  // Eliminar postulación
  delete: (id) => apiClient.delete(`/postulaciones/${id}`),
  
  // Postular candidato a convocatoria
  postular: (candidatoId, convocatoriaId) => 
    apiClient.post('/postulaciones/postular', { candidatoId, convocatoriaId }),
};

// API para Entrevistas
export const entrevistasApi = {
  // Obtener todas las entrevistas
  getAll: () => apiClient.get('/entrevistas'),
  
  // Obtener entrevista por ID
  getById: (id) => apiClient.get(`/entrevistas/${id}`),
  
  // Crear nueva entrevista
  create: (entrevista) => apiClient.post('/entrevistas', entrevista),
  
  // Actualizar entrevista
  update: (id, entrevista) => apiClient.put(`/entrevistas/${id}`, entrevista),
  
  // Eliminar entrevista
  delete: (id) => apiClient.delete(`/entrevistas/${id}`),
  
  // Programar entrevista
  programar: (postulacionId, entrevista) => 
    apiClient.post('/entrevistas/programar', { postulacionId, ...entrevista }),
};

export default {
  convocatorias: convocatoriasApi,
  candidatos: candidatosApi,
  postulaciones: postulacionesApi,
  entrevistas: entrevistasApi,
};