import React, { useState, useEffect } from 'react';
import { convocatoriasApi } from '../api/convocatorias';
import '../styles/Convocatorias.css';

export default function ConvocatoriasListPage() {
    const [convocatorias, setConvocatorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        titulo: '',
        fechaPublicacion: '',
        descripcion: ''
    });

    useEffect(() => {
        fetchConvocatorias();
    }, []);

    const fetchConvocatorias = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await convocatoriasApi.getAll();
            setConvocatorias(response.data);
        } catch (err) {
            setError(`Error al cargar convocatorias: ${err.message}`);
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
                await convocatoriasApi.update(formData.id, formData);
                alert('✅ Convocatoria actualizada');
            } else {
                await convocatoriasApi.create(formData);
                alert('✅ Convocatoria creada');
            }
            setFormData({ id: '', titulo: '', fechaPublicacion: '', descripcion: '' });
            await fetchConvocatorias();
        } catch (err) {
            setError(`❌ No se pudo guardar: ${err.message}`);
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (conv) => {
        setFormData({ ...conv });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar esta convocatoria?')) return;
        try {
            await convocatoriasApi.delete(id);
            await fetchConvocatorias();
            alert('✅ Convocatoria eliminada');
        } catch (err) {
            alert(`No se pudo eliminar: ${err.message}`);
        }
    };

    return (
        <div className="convocatorias-page">
            <h1>📋 Gestión de Convocatorias</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="form-container">
                <h2>{formData.id ? '✏️ Editar Convocatoria' : '➕ Nueva Convocatoria'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>ID Convocatoria</label>
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                placeholder="CONV-2025-001"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha de Publicación</label>
                            <input
                                type="date"
                                name="fechaPublicacion"
                                value={formData.fechaPublicacion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Título</label>
                        <input
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Convocatoria para Desarrollador Backend"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            rows="3"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Detalles de la convocatoria..."
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
                                onClick={() => setFormData({ id: '', titulo: '', fechaPublicacion: '', descripcion: '' })}
                            >
                                Cancelar Edición
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h2>📋 Lista de Convocatorias</h2>
                    {loading && <span className="loading-text">Cargando...</span>}
                </div>
                {convocatorias.length === 0 ? (
                    <p className="no-data">No hay convocatorias registradas.</p>
                ) : (
                    <div className="cards-container">
                        {convocatorias.map((conv) => (
                            <div className="card" key={conv.id}>
                                <div className="card-header-content">
                                    <h3>{conv.titulo}</h3>
                                    <p className="card-meta">
                                        ID: {conv.id} | Fecha: {new Date(conv.fechaPublicacion).toLocaleDateString()}
                                    </p>
                                    <p className="card-description">
                                        {conv.descripcion?.substring(0, 150)}
                                        {conv.descripcion?.length > 150 ? '...' : ''}
                                    </p>
                                </div>
                                <div className="card-actions">
                                    <button className="btn-edit" onClick={() => handleEdit(conv)}>
                                        ✏️ Editar
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(conv.id)}>
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
