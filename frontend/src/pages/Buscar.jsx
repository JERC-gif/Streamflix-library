import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { peliculasAPI, seriesAPI } from '../services/api';

export default function Buscar() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [peliculas, setPeliculas] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      search();
    }
  }, [query]);

  const search = async () => {
    try {
      setLoading(true);
      const [peliculasRes, seriesRes] = await Promise.all([
        peliculasAPI.search(query),
        seriesAPI.search(query)
      ]);
      setPeliculas(peliculasRes.data.peliculas);
      setSeries(seriesRes.data.series);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!query) {
    return (
      <div className="buscar-page">
        <div className="no-data">
          <p>Escribe algo para buscar</p>
          <Link to="/" className="btn btn-secondary">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Buscando...</div>;
  }

  const totalResults = peliculas.length + series.length;

  return (
    <div className="buscar-page">
      <div className="page-header">
        <h1 className="page-title">🔍 Resultados de búsqueda: "{query}"</h1>
        <p className="search-count">{totalResults} resultado(s) encontrado(s)</p>
      </div>

      {peliculas.length > 0 && (
        <div className="results-section">
          <h2 className="section-title">🎬 Películas ({peliculas.length})</h2>
          <div className="results-grid">
            {peliculas.map(p => (
              <Link to={`/peliculas/editar/${p.id}`} key={p.id} className="result-card">
                <div className="result-info">
                  <h3>{p.nombre}</h3>
                  <div className="result-meta">
                    <span>{p.anio || '-'}</span>
                    <span>{p.calificacion || '-'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {series.length > 0 && (
        <div className="results-section">
          <h2 className="section-title">📺 Series ({series.length})</h2>
          <div className="results-grid">
            {series.map(s => (
              <Link to={`/series/editar/${s.id}`} key={s.id} className="result-card">
                <div className="result-info">
                  <h3>{s.nombre}</h3>
                  <div className="result-meta">
                    <span>{s.anio || '-'}</span>
                    <span>{s.calificacion || '-'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {totalResults === 0 && (
        <div className="no-data">
          <p>No se encontraron resultados para "{query}"</p>
          <Link to="/" className="btn btn-secondary">Volver al inicio</Link>
        </div>
      )}
    </div>
  );
}
