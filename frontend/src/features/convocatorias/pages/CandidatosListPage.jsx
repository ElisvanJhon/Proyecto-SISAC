import React, { useState, useEffect } from 'react';
import { candidatosApi } from '../api/convocatorias';
import '../styles/Convocatorias.css';

export default function CandidatosListPage() {
    const [candidatos, setCandidatos] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        nombresApellidos: '',
        email: '',
        telefono: '',
        cvAdjunto: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCandidatos();
    }, []);

    const fetchCandidatos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await candidatosApi.getAll();
            setCandidatos(response.data);
        } catch (err) {
            setError(`Error al cargar candidatos: ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
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
                await candidatosApi.update(formData.id, formData);
                alert('✅ Candidato actualizado');
            } else {
                await candidatosApi.create(formData);
                alert('✅ Candidato creado');
            }
            setFormData({ id: '', nombresApellidos: '', email: '', telefono: '', cvAdjunto: '' });
            await fetchCandidatos();
        } catch (err) {
            setError(`❌ No se pudo guardar: ${err.message}`);
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (candidato) => {
        setFormData({
            id: candidato.id,
            nombresApellidos: candidato.nombresApellidos,
            email: candidato.email,
            telefono: candidato.telefono,
            cvAdjunto: candidato.cvAdjunto || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar este candidato?')) return;
        try {
            await candidatosApi.delete(id);
            await fetchCandidatos();
            alert('✅ Candidato eliminado');
        } catch (err) {
            alert(`No se pudo eliminar: ${err.message}`);
        }
    };

    return (
        <div className="convocatorias-page">
            <h1>👤 Gestión de Candidatos</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="form-container">
                <h2>{formData.id ? '✏️ Editar Candidato' : '➕ Nuevo Candidato'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>ID Candidato</label>
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
                            <label>Nombres y Apellidos</label>
                            <input
                                type="text"
                                name="nombresApellidos"
                                value={formData.nombresApellidos}
                                onChange={handleChange}
                                placeholder="Ingrese nombres completos"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Ingrese email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                type="text"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="Ingrese teléfono"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Enlace al CV (Google Docs, etc.)</label>
                        <input
                            type="url"
                            name="cvAdjunto"
                            value={formData.cvAdjunto}
                            onChange={handleChange}
                            placeholder="https://docs.google.com/document/d/..."
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
                                onClick={() => setFormData({ id: '', nombresApellidos: '', email: '', telefono: '', cvAdjunto: '' })}
                            >
                                Cancelar Edición
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h2>👥 Lista de Candidatos</h2>
                    {loading && <span className="loading-text">Cargando...</span>}
                </div>
                {candidatos.length === 0 ? (
                    <p className="no-data">No hay candidatos registrados.</p>
                ) : (
                    <div className="cards-container">
                        {candidatos.map((cand) => (
                            <div className="card" key={cand.id}>
                                <div className="card-header-content">
                                    <h3>{cand.nombresApellidos}</h3>
                                    <p className="card-meta">
                                        ID: {cand.id} | 📧 {cand.email}
                                    </p>
                                    <p className="card-meta">
                                        📞 {cand.telefono}
                                    </p>
                                    {cand.cvAdjunto && (
                                        <a
                                            href={cand.cvAdjunto}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-link"
                                        >
                                            📄 Ver CV
                                        </a>
                                    )}
                                </div>
                                <div className="card-actions">
                                    <button className="btn-edit" onClick={() => handleEdit(cand)}>
                                        ✏️ Editar
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(cand.id)}>
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
