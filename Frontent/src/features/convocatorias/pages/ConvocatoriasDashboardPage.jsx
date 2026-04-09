import React, { useState, useEffect } from 'react';
import { convocatoriasApi, candidatosApi, postulacionesApi } from '../api/convocatorias';
import { useAuth } from '../../../hooks/useAuth';
import '../styles/ConvocatoriasDashboard.css';

const ConvocatoriasDashboardPage = () => {
  const { user } = useAuth();
  const [convocatorias, setConvocatorias] = useState([]);
  const [candidatos, setCandidatos] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('convocatorias');

  // Verificar permisos de gestión de contratación
  console.log('🔍 Debug user:', user);
  console.log('🔍 Debug user.rol:', user?.rol);
  console.log('🔍 Debug user.permissions:', user?.permissions);
  
  const hasPermission = user?.permissions?.includes('manage_job_postings') || user?.rol === 'ADMIN_TRIBUTARIO';
  console.log('🔍 Debug hasPermission:', hasPermission);

  useEffect(() => {
    if (hasPermission) {
      fetchData();
    }
  }, [hasPermission]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [convocatoriasRes, candidatosRes, postulacionesRes] = await Promise.all([
        convocatoriasApi.getAll(),
        candidatosApi.getAll(),
        postulacionesApi.getAll()
      ]);
      
      setConvocatorias(convocatoriasRes.data || []);
      setCandidatos(candidatosRes.data || []);
      setPostulaciones(postulacionesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission) {
    return (
      <div className="dashboard-page">
        <div className="access-denied">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder al módulo de Gestión de Convocatorias.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page convocatorias-dashboard">
      <div className="dashboard-header">
        <h1>Gestión de Convocatorias</h1>
        <p>Administra convocatorias, candidatos y procesos de selección</p>
      </div>

      {/* Estadísticas principales */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{convocatorias.length}</h3>
            <p>Convocatorias Activas</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{candidatos.length}</h3>
            <p>Candidatos Registrados</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{postulaciones.length}</h3>
            <p>Postulaciones</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{postulaciones.filter(p => p.estado === 'APROBADO').length}</h3>
            <p>Contrataciones</p>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'convocatorias' ? 'active' : ''}`}
          onClick={() => setActiveTab('convocatorias')}
        >
          Convocatorias
        </button>
        <button 
          className={`tab-button ${activeTab === 'candidatos' ? 'active' : ''}`}
          onClick={() => setActiveTab('candidatos')}
        >
          Candidatos
        </button>
        <button 
          className={`tab-button ${activeTab === 'postulaciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('postulaciones')}
        >
          Postulaciones
        </button>
      </div>

      {/* Contenido de pestañas */}
      <div className="dashboard-content">
        {activeTab === 'convocatorias' && (
          <div className="convocatorias-section">
            <div className="section-header">
              <h2>Convocatorias Recientes</h2>
              <button className="btn-primary">+ Nueva Convocatoria</button>
            </div>
            <div className="convocatorias-grid">
              {convocatorias.slice(0, 6).map(convocatoria => (
                <div key={convocatoria.id} className="convocatoria-card">
                  <h3>{convocatoria.titulo}</h3>
                  <p>{convocatoria.descripcion}</p>
                  <div className="convocatoria-meta">
                    <span className={`status ${convocatoria.estado?.toLowerCase()}`}>
                      {convocatoria.estado}
                    </span>
                    <span className="fecha">
                      {new Date(convocatoria.fechaInicio).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'candidatos' && (
          <div className="candidatos-section">
            <div className="section-header">
              <h2>Candidatos Recientes</h2>
              <button className="btn-primary">+ Nuevo Candidato</button>
            </div>
            <div className="candidatos-list">
              {candidatos.slice(0, 10).map(candidato => (
                <div key={candidato.id} className="candidato-item">
                  <div className="candidato-info">
                    <h4>{candidato.nombre} {candidato.apellido}</h4>
                    <p>{candidato.email}</p>
                    <p>{candidato.telefono}</p>
                  </div>
                  <div className="candidato-actions">
                    <button className="btn-secondary">Ver Perfil</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'postulaciones' && (
          <div className="postulaciones-section">
            <div className="section-header">
              <h2>Postulaciones Recientes</h2>
            </div>
            <div className="postulaciones-list">
              {postulaciones.slice(0, 10).map(postulacion => (
                <div key={postulacion.id} className="postulacion-item">
                  <div className="postulacion-info">
                    <h4>Postulación #{postulacion.id}</h4>
                    <p>Estado: <span className={`status ${postulacion.estado?.toLowerCase()}`}>
                      {postulacion.estado}
                    </span></p>
                    <p>Fecha: {new Date(postulacion.fechaPostulacion).toLocaleDateString()}</p>
                  </div>
                  <div className="postulacion-actions">
                    <button className="btn-secondary">Ver Detalles</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConvocatoriasDashboardPage;