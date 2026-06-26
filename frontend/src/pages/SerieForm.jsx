import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { seriesAPI } from '../services/api';
import DatePicker from '../components/DatePicker';
import ImageUpload from '../components/ImageUpload';

export default function SerieForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nombre: '',
    anio: '',
    calificacion: '',
    fecha_terminado: ''
  });
  const [imagen, setImagen] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadSerie();
    }
  }, [id]);

  const loadSerie = async () => {
    try {
      setLoading(true);
      const { data } = await seriesAPI.getById(id);
      setFormData({
        nombre: data.nombre,
        anio: data.anio || '',
        calificacion: data.calificacion || '',
        fecha_terminado: data.fecha_terminado || ''
      });
      if (data.tiene_imagen) {
        setCurrentImageUrl(seriesAPI.getImageUrl(id));
      }
    } catch (error) {
      console.error('Error loading serie:', error);
      navigate('/series');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, fecha_terminado: date }));
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
        fecha_terminado: formData.fecha_terminado || null
      };

      let serieId;

      if (isEditing) {
        await seriesAPI.update(id, dataToSend);
        serieId = id;
      } else {
        const { data } = await seriesAPI.create(dataToSend);
        serieId = data.id;
      }

      if (imagen) {
        const imageFormData = new FormData();
        imageFormData.append('imagen', imagen);
        await seriesAPI.uploadImage(serieId, imageFormData);
      }

      navigate('/series');
    } catch (error) {
      console.error('Error saving serie:', error);
      alert('Error al guardar la serie');
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
          {isEditing ? '✏️ Editar Serie' : '➕ Nueva Serie'}
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
                placeholder="Ej: Stranger Things"
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
                  placeholder="Ej: 2024"
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
                  placeholder="Ej: 8.5"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="fecha_terminado">Fecha terminada</label>
              <DatePicker
                value={formData.fecha_terminado}
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
            {saving ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Serie')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/series')}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
