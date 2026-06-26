import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { peliculasAPI } from '../services/api';
import RatingStars from '../components/RatingStars';

export default function Peliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [anios, setAnios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterRating, setFilterRating] = useState('');

  useEffect(() => {
    loadPeliculas();
  }, []);

  const loadPeliculas = async () => {
    try {
      const { data } = await peliculasAPI.getAll();
      setPeliculas(data.peliculas);
      setAnios(data.anios);
    } catch (error) {
      console.error('Error loading peliculas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) {
      try {
        await peliculasAPI.delete(id);
        loadPeliculas();
      } catch (error) {
        console.error('Error deleting pelicula:', error);
      }
    }
  };

  const filteredPeliculas = peliculas.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = !filterYear || p.anio === parseInt(filterYear);
    const matchesRating = !filterRating || (
      filterRating === 'high' && p.calificacion >= 8 ||
      filterRating === 'medium' && p.calificacion >= 5 && p.calificacion < 8 ||
      filterRating === 'low' && p.calificacion < 5
    );
    return matchesSearch && matchesYear && matchesRating;
  });

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="peliculas-page">
      <div className="page-header">
        <h1 className="page-title">🎬 Gestión de Películas</h1>
        <Link to="/peliculas/nueva" className="btn btn-primary">
          + Agregar Película
        </Link>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Buscar películas..."
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
        {filteredPeliculas.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Año</th>
                <th>Calificación</th>
                <th>Fecha vista</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPeliculas.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.anio || '-'}</td>
                  <td><RatingStars rating={p.calificacion} /></td>
                  <td>{p.fecha_vista || '-'}</td>
                  <td className="actions-cell">
                    <Link to={`/peliculas/editar/${p.id}`} className="btn btn-small btn-secondary">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.nombre)}
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
            <p>No hay películas registradas.</p>
            <Link to="/peliculas/nueva" className="btn btn-primary">
              Agregar primera película
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
