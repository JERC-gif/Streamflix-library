import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI, peliculasAPI, seriesAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ peliculas_count: 0, series_count: 0, total: 0 });
  const [recentPeliculas, setRecentPeliculas] = useState([]);
  const [recentSeries, setRecentSeries] = useState([]);

  useEffect(() => {
    loadStats();
    loadRecent();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await statsAPI.get();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecent = async () => {
    try {
      const [peliculasRes, seriesRes] = await Promise.all([
        peliculasAPI.getAll(),
        seriesAPI.getAll()
      ]);
      setRecentPeliculas(peliculasRes.data.peliculas.slice(0, 3));
      setRecentSeries(seriesRes.data.series.slice(0, 3));
    } catch (error) {
      console.error('Error loading recent:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1 className="welcome-title">¡Bienvenido a StreamFlix Premium!</h1>
        <p className="welcome-subtitle">Tu biblioteca personal de películas y series</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Películas</span>
            <span className="stat-icon">🎬</span>
          </div>
          <div className="stat-value">{stats.peliculas_count}</div>
          <div className="stat-subtitle">Películas registradas</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Series</span>
            <span className="stat-icon">📺</span>
          </div>
          <div className="stat-value">{stats.series_count}</div>
          <div className="stat-subtitle">Series registradas</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Contenido</span>
            <span className="stat-icon">📊</span>
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-subtitle">Elementos en tu biblioteca</div>
        </div>
      </div>

      <div className="quick-actions">
        <h2 className="section-title">🚀 Acciones Rápidas</h2>
        <div className="actions-grid">
          <Link to="/peliculas" className="action-card">
            <div className="action-icon">🎬</div>
            <h3>Gestionar Películas</h3>
            <p>Agregar, ver y editar tus películas</p>
            <span className="action-count">{stats.peliculas_count} películas</span>
          </Link>

          <Link to="/series" className="action-card">
            <div className="action-icon">📺</div>
            <h3>Gestionar Series</h3>
            <p>Agregar, ver y editar tus series</p>
            <span className="action-count">{stats.series_count} series</span>
          </Link>

          <Link to="/exportar" className="action-card">
            <div className="action-icon">📤</div>
            <h3>Exportar Datos</h3>
            <p>Descargar tu biblioteca completa</p>
            <span className="action-count">CSV/JSON disponible</span>
          </Link>
        </div>
      </div>

      <div className="recent-section">
        <div className="recent-column">
          <h2 className="section-title">🎬 Últimas Películas</h2>
          <div className="recent-list">
            {recentPeliculas.map(p => (
              <Link to={`/peliculas/editar/${p.id}`} key={p.id} className="recent-item">
                <div className="recent-info">
                  <span className="recent-name">{p.nombre}</span>
                  <span className="recent-year">{p.anio}</span>
                </div>
                <span className="recent-rating">{p.calificacion || '-'}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="recent-column">
          <h2 className="section-title">📺 Últimas Series</h2>
          <div className="recent-list">
            {recentSeries.map(s => (
              <Link to={`/series/editar/${s.id}`} key={s.id} className="recent-item">
                <div className="recent-info">
                  <span className="recent-name">{s.nombre}</span>
                  <span className="recent-year">{s.anio}</span>
                </div>
                <span className="recent-rating">{s.calificacion || '-'}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
