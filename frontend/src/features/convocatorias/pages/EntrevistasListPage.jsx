import React, { useState, useEffect } from 'react';
import { entrevistasApi, convocatoriasApi, candidatosApi } from '../api/convocatorias';
import '../styles/Convocatorias.css';

export default function EntrevistasListPage() {
    const [entrevistas, setEntrevistas] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        convocatoriaId: '',
        candidatoId: '',
        nombreEvaluador: '',
        resultado: '',
        fechaEvaluacion: '',
        observaciones: ''
    });
    const [convocatorias, setConvocatorias] = useState([]);
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEntrevistas();
        fetchConvocatorias();
        fetchCandidatos();
    }, []);

    const fetchEntrevistas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await entrevistasApi.getAll();
            setEntrevistas(response.data);
        } catch (err) {
            setError(`Error al cargar entrevistas: ${err.message}`);
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
                await entrevistasApi.update(formData.id, formData);
                alert('✅ Entrevista actualizada');
            } else {
                await entrevistasApi.create(formData);
                alert('✅ Entrevista creada');
            }
            setFormData({
                id: '',
                convocatoriaId: '',
                candidatoId: '',
                nombreEvaluador: '',
                resultado: '',
                fechaEvaluacion: '',
                observaciones: ''
            });
            await fetchEntrevistas();
        } catch (err) {
            setError(`❌ No se pudo guardar: ${err.message}`);
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (entrevista) => {
        setFormData({
            id: entrevista.id,
            convocatoriaId: entrevista.convocatoriaId || '',
            candidatoId: entrevista.candidatoId || '',
            nombreEvaluador: entrevista.nombreEvaluador || '',
            resultado: entrevista.resultado || '',
            fechaEvaluacion: entrevista.fechaEvaluacion || '',
            observaciones: entrevista.observaciones || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar esta entrevista?')) return;
        try {
            await entrevistasApi.delete(id);
            await fetchEntrevistas();
            alert('✅ Entrevista eliminada');
        } catch (err) {
            alert(`No se pudo eliminar: ${err.message}`);
        }
    };

    return (
        <div className="convocatorias-page">
            <h1>🎤 Gestión de Entrevistas</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="form-container">
                <h2>{formData.id ? '✏️ Editar Entrevista' : '➕ Nueva Entrevista'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>ID Entrevista</label>
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
                            <label>Nombre del Evaluador</label>
                            <input
                                type="text"
                                name="nombreEvaluador"
                                value={formData.nombreEvaluador}
                                onChange={handleChange}
                                placeholder="Ingrese nombre del evaluador"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Resultado</label>
                            <input
                                type="text"
                                name="resultado"
                                value={formData.resultado}
                                onChange={handleChange}
                                placeholder="Resultado de la entrevista"
                                required
                            />
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
                                    nombreEvaluador: '',
                                    resultado: '',
                                    fechaEvaluacion: '',
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
                    <h2>📋 Lista de Entrevistas</h2>
                    {loading && <span className="loading-text">Cargando...</span>}
                </div>
                {entrevistas.length === 0 ? (
                    <p className="no-data">No hay entrevistas registradas.</p>
                ) : (
                    <div className="cards-container">
                        {entrevistas.map((ent) => {
                            const candidato = candidatos.find(c => c.id === ent.candidatoId);
                            const convocatoria = convocatorias.find(c => c.id === ent.convocatoriaId);
                            return (
                                <div className="card" key={ent.id}>
                                    <div className="card-header-content">
                                        <h3>{candidato ? candidato.nombresApellidos : 'Candidato no encontrado'}</h3>
                                        <p className="card-meta">
                                            ID: {ent.id} | Fecha: {new Date(ent.fechaEvaluacion).toLocaleDateString()}
                                        </p>
                                        <p className="card-meta">
                                            Convocatoria: {convocatoria ? convocatoria.titulo : 'N/A'}
                                        </p>
                                        <p className="card-meta">
                                            Evaluador: {ent.nombreEvaluador}
                                        </p>
                                        <p className="card-meta">
                                            Resultado: <strong>{ent.resultado}</strong>
                                        </p>
                                        {ent.observaciones && (
                                            <p className="card-description">{ent.observaciones}</p>
                                        )}
                                    </div>
                                    <div className="card-actions">
                                        <button className="btn-edit" onClick={() => handleEdit(ent)}>
                                            ✏️ Editar
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(ent.id)}>
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
