import React, { useState, useEffect } from 'react';
import { postulacionesApi, convocatoriasApi, candidatosApi } from '../api/convocatorias';
import '../styles/Convocatorias.css';

export default function PostulacionesListPage() {
    const [postulaciones, setPostulaciones] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        convocatoriaId: '',
        candidatoId: '',
        fechaEvaluacion: '',
        estado: 'En Proceso',
        observaciones: ''
    });
    const [convocatorias, setConvocatorias] = useState([]);
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPostulaciones();
        fetchConvocatorias();
        fetchCandidatos();
    }, []);

    const fetchPostulaciones = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await postulacionesApi.getAll();
            setPostulaciones(response.data);
        } catch (err) {
            setError(`Error al cargar postulaciones: ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchConvocatorias = async () => {
        try {
            const response = await convocatoriasApi.getAll();
            setConvocatorias(response.data);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const fetchCandidatos = async () => {
        try {
            const response = await candidatosApi.getAll();
            setCandidatos(response.data);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (formData.id) {
                await postulacionesApi.update(formData.id, formData);
                alert('✅ Postulación actualizada');
            } else {
                await postulacionesApi.create(formData);
                alert('✅ Postulación creada');
            }
            setFormData({
                id: '',
                convocatoriaId: '',
                candidatoId: '',
                fechaEvaluacion: '',
                estado: 'En Proceso',
                observaciones: ''
            });
            await fetchPostulaciones();
        } catch (err) {
            setError(`❌ No se pudo guardar: ${err.message}`);
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (postulacion) => {
        setFormData({
            id: postulacion.id,
            convocatoriaId: postulacion.convocatoriaId || '',
            candidatoId: postulacion.candidatoId || '',
            fechaEvaluacion: postulacion.fechaEvaluacion || '',
            estado: postulacion.estado || 'En Proceso',
            observaciones: postulacion.observaciones || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar esta postulación?')) return;
        try {
            await postulacionesApi.delete(id);
            await fetchPostulaciones();
            alert('✅ Postulación eliminada');
        } catch (err) {
            alert(`No se pudo eliminar: ${err.message}`);
        }
    };

    return (
        <div className="convocatorias-page">
            <h1>📝 Gestión de Postulaciones</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="form-container">
                <h2>{formData.id ? '✏️ Editar Postulación' : '➕ Nueva Postulación'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>ID Postulación</label>
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                placeholder="Ingrese ID"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Convocatoria</label>
                            <select
                                name="convocatoriaId"
                                value={formData.convocatoriaId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione una convocatoria</option>
                                {convocatorias.map(conv => (
                                    <option key={conv.id} value={conv.id}>
                                        {conv.titulo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Candidato</label>
                            <select
                                name="candidatoId"
                                value={formData.candidatoId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione un candidato</option>
                                {candidatos.map(cand => (
                                    <option key={cand.id} value={cand.id}>
                                        {cand.nombresApellidos}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Fecha de Evaluación</label>
                            <input
                                type="date"
                                name="fechaEvaluacion"
                                value={formData.fechaEvaluacion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Estado de Postulación</label>
                            <select
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                required
                            >
                                <option value="En Proceso">En Proceso</option>
                                <option value="Aceptado">Aceptado</option>
                                <option value="Rechazado">Rechazado</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Observaciones</label>
                        <textarea
                            name="observaciones"
                            rows="3"
                            value={formData.observaciones}
                            onChange={handleChange}
                            placeholder="Ingrese observaciones"
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : formData.id ? 'Actualizar' : 'Guardar'}
                        </button>
                        {formData.id && (
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setFormData({
                                    id: '',
                                    convocatoriaId: '',
                                    candidatoId: '',
                                    fechaEvaluacion: '',
                                    estado: 'En Proceso',
                                    observaciones: ''
                                })}
                            >
                                Cancelar Edición
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h2>📋 Lista de Postulaciones</h2>
                    {loading && <span className="loading-text">Cargando...</span>}
                </div>
                {postulaciones.length === 0 ? (
                    <p className="no-data">No hay postulaciones registradas.</p>
                ) : (
                    <div className="cards-container">
                        {postulaciones.map((post) => {
                            const candidato = candidatos.find(c => c.id === post.candidatoId);
                            const convocatoria = convocatorias.find(c => c.id === post.convocatoriaId);
                            return (
                                <div className="card" key={post.id}>
                                    <div className="card-header-content">
                                        <h3>{candidato ? candidato.nombresApellidos : 'Sin nombre'}</h3>
                                        <p className="card-meta">
                                            ID: {post.id} | Fecha: {new Date(post.fechaEvaluacion).toLocaleDateString()}
                                        </p>
                                        <p className="card-meta">
                                            Convocatoria: {convocatoria ? convocatoria.titulo : 'N/A'}
                                        </p>
                                        <p className="card-meta">
                                            Estado: <strong>{post.estado}</strong>
                                        </p>
                                        {post.observaciones && (
                                            <p className="card-description">{post.observaciones}</p>
                                        )}
                                    </div>
                                    <div className="card-actions">
                                        <button className="btn-edit" onClick={() => handleEdit(post)}>
                                            ✏️ Editar
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(post.id)}>
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
