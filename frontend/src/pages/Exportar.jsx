import { useState } from 'react';
import { exportAPI } from '../services/api';

export default function Exportar() {
  const [exporting, setExporting] = useState(null);

  const handleExport = async (type, format) => {
    const key = `${type}-${format}`;
    try {
      setExporting(key);

      let response;
      if (type === 'peliculas' && format === 'csv') {
        response = await exportAPI.peliculasCSV();
      } else if (type === 'peliculas' && format === 'json') {
        response = await exportAPI.peliculasJSON();
      } else if (type === 'series' && format === 'csv') {
        response = await exportAPI.seriesCSV();
      } else if (type === 'series' && format === 'json') {
        response = await exportAPI.seriesJSON();
      } else if (type === 'todo' && format === 'csv') {
        response = await exportAPI.todoCSV();
      } else if (type === 'todo' && format === 'json') {
        response = await exportAPI.todoJSON();
      }

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `${type}_export.${format}`;

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Error al exportar');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="exportar-page">
      <div className="page-header">
        <h1 className="page-title">📤 Exportar Datos</h1>
      </div>

      <div className="export-cards">
        <div className="export-card">
          <div className="export-header">
            <span className="export-icon">🎬</span>
            <h3>Películas</h3>
          </div>
          <p>Exporta todas las películas registradas en tu biblioteca</p>
          <div className="export-actions">
            <button
              onClick={() => handleExport('peliculas', 'csv')}
              className="btn btn-primary"
              disabled={exporting === 'peliculas-csv'}
            >
              {exporting === 'peliculas-csv' ? 'Exportando...' : '📄 Exportar CSV'}
            </button>
            <button
              onClick={() => handleExport('peliculas', 'json')}
              className="btn btn-secondary"
              disabled={exporting === 'peliculas-json'}
            >
              {exporting === 'peliculas-json' ? 'Exportando...' : '🔧 Exportar JSON'}
            </button>
          </div>
        </div>

        <div className="export-card">
          <div className="export-header">
            <span className="export-icon">📺</span>
            <h3>Series</h3>
          </div>
          <p>Exporta todas las series registradas en tu biblioteca</p>
          <div className="export-actions">
            <button
              onClick={() => handleExport('series', 'csv')}
              className="btn btn-primary"
              disabled={exporting === 'series-csv'}
            >
              {exporting === 'series-csv' ? 'Exportando...' : '📄 Exportar CSV'}
            </button>
            <button
              onClick={() => handleExport('series', 'json')}
              className="btn btn-secondary"
              disabled={exporting === 'series-json'}
            >
              {exporting === 'series-json' ? 'Exportando...' : '🔧 Exportar JSON'}
            </button>
          </div>
        </div>

        <div className="export-card">
          <div className="export-header">
            <span className="export-icon">📊</span>
            <h3>Todos los Datos</h3>
          </div>
          <p>Exporta toda tu biblioteca completa en un solo archivo</p>
          <div className="export-actions">
            <button
              onClick={() => handleExport('todo', 'csv')}
              className="btn btn-primary"
              disabled={exporting === 'todo-csv'}
            >
              {exporting === 'todo-csv' ? 'Exportando...' : '📄 Exportar CSV'}
            </button>
            <button
              onClick={() => handleExport('todo', 'json')}
              className="btn btn-secondary"
              disabled={exporting === 'todo-json'}
            >
              {exporting === 'todo-json' ? 'Exportando...' : '🔧 Exportar JSON'}
            </button>
          </div>
        </div>
      </div>

      <div className="export-info">
        <div className="info-card">
          <h3>💡 Información sobre Exportación</h3>
          <ul>
            <li><strong>CSV:</strong> Formato compatible con Excel, Google Sheets y otras hojas de cálculo</li>
            <li><strong>JSON:</strong> Formato estructurado ideal para programadores y análisis de datos</li>
            <li>Los archivos incluyen todos los campos: nombre, año, calificación y fechas</li>
            <li>Puedes usar estos archivos para hacer respaldos o análisis externos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
