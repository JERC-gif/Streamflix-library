import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { peliculasAPI } from '../services/api';
import DatePicker from '../components/DatePicker';
import ImageUpload from '../components/ImageUpload';

export default function PeliculaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nombre: '',
    anio: '',
    calificacion: '',
    fecha_vista: ''
  });
  const [imagen, setImagen] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadPelicula();
    }
  }, [id]);

  const loadPelicula = async () => {
    try {
      setLoading(true);
      const { data } = await peliculasAPI.getById(id);
      setFormData({
        nombre: data.nombre,
        anio: data.anio || '',
        calificacion: data.calificacion || '',
        fecha_vista: data.fecha_vista || ''
      });
      if (data.tiene_imagen) {
        setCurrentImageUrl(peliculasAPI.getImageUrl(id));
      }
    } catch (error) {
      console.error('Error loading pelicula:', error);
      navigate('/peliculas');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, fecha_vista: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert('El nombre es requerido');
      return;
    }

    try {
      setSaving(true);

      const dataToSend = {
        nombre: formData.nombre,
        anio: formData.anio ? parseInt(formData.anio) : null,
        calificacion: formData.calificacion ? parseFloat(formData.calificacion) : null,
        fecha_vista: formData.fecha_vista || null
      };

      let peliculaId;

      if (isEditing) {
        await peliculasAPI.update(id, dataToSend);
        peliculaId = id;
      } else {
        const { data } = await peliculasAPI.create(dataToSend);
        peliculaId = data.id;
      }

      if (imagen) {
        const imageFormData = new FormData();
        imageFormData.append('imagen', imagen);
        await peliculasAPI.uploadImage(peliculaId, imageFormData);
      }

      navigate('/peliculas');
    } catch (error) {
      console.error('Error saving pelicula:', error);
      alert('Error al guardar la película');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="form-page">
      <div className="page-header">
        <h1 className="page-title">
          {isEditing ? '✏️ Editar Película' : '➕ Nueva Película'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          <div className="form-main">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: Los Tipos Malos 2"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="anio">Año</label>
                <input
                  type="number"
                  id="anio"
                  name="anio"
                  value={formData.anio}
                  onChange={handleChange}
                  className="form-input"
                  min="1900"
                  max="2100"
                  placeholder="Ej: 2025"
                />
              </div>

              <div className="form-group">
                <label htmlFor="calificacion">Calificación (0-10)</label>
                <input
                  type="number"
                  id="calificacion"
                  name="calificacion"
                  value={formData.calificacion}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="Ej: 7.5"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="fecha_vista">Fecha vista</label>
              <DatePicker
                value={formData.fecha_vista}
                onChange={handleDateChange}
                placeholder="Seleccionar fecha"
              />
            </div>
          </div>

          <div className="form-sidebar">
            <div className="form-group">
              <label>Portada</label>
              <ImageUpload
                currentImage={currentImageUrl}
                onImageSelect={setImagen}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Película')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/peliculas')}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
