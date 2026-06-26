import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { seriesAPI } from '../services/api';
import RatingStars from '../components/RatingStars';

export default function Series() {
  const [series, setSeries] = useState([]);
  const [anios, setAnios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterRating, setFilterRating] = useState('');

  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    try {
      const { data } = await seriesAPI.getAll();
      setSeries(data.series);
      setAnios(data.anios);
    } catch (error) {
      console.error('Error loading series:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) {
      try {
        await seriesAPI.delete(id);
        loadSeries();
      } catch (error) {
        console.error('Error deleting serie:', error);
      }
    }
  };

  const filteredSeries = series.filter(s => {
    const matchesSearch = s.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = !filterYear || s.anio === parseInt(filterYear);
    const matchesRating = !filterRating || (
      filterRating === 'high' && s.calificacion >= 8 ||
      filterRating === 'medium' && s.calificacion >= 5 && s.calificacion < 8 ||
      filterRating === 'low' && s.calificacion < 5
    );
    return matchesSearch && matchesYear && matchesRating;
  });

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="series-page">
      <div className="page-header">
        <h1 className="page-title">📺 Gestión de Series</h1>
        <Link to="/series/nueva" className="btn btn-primary">
          + Agregar Serie
        </Link>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Buscar series..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los años</option>
          {anios.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="filter-select"
        >
          <option value="">Todas las calificaciones</option>
          <option value="high">Alta (8-10)</option>
          <option value="medium">Media (5-7.9)</option>
          <option value="low">Baja (0-4.9)</option>
        </select>
      </div>

      <div className="table-container">
        {filteredSeries.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Año</th>
                <th>Calificación</th>
                <th>Fecha terminada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSeries.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.nombre}</td>
                  <td>{s.anio || '-'}</td>
                  <td><RatingStars rating={s.calificacion} /></td>
                  <td>{s.fecha_terminado || '-'}</td>
                  <td className="actions-cell">
                    <Link to={`/series/editar/${s.id}`} className="btn btn-small btn-secondary">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(s.id, s.nombre)}
                      className="btn btn-small btn-danger"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            <p>No hay series registradas.</p>
            <Link to="/series/nueva" className="btn btn-primary">
              Agregar primera serie
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
