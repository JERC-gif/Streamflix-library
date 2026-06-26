import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-icon"></div>
            <span className="logo-text">StreamFlix</span>
          </Link>

          <form onSubmit={handleSearch} className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              placeholder="Buscar películas, series..."
            />
            <button type="submit" className="search-btn">Buscar</button>
          </form>

          <nav>
            <ul className="nav-menu">
              <li><Link to="/" className={`nav-link ${isActive('/')}`}>Inicio</Link></li>
              <li><Link to="/peliculas" className={`nav-link ${isActive('/peliculas')}`}>Películas</Link></li>
              <li><Link to="/series" className={`nav-link ${isActive('/series')}`}>Series</Link></li>
              <li><Link to="/exportar" className={`nav-link ${isActive('/exportar')}`}>Exportar</Link></li>
              <li>
                <button onClick={toggleTheme} className="theme-toggle" title="Cambiar tema">
                  {darkMode ? '🌙' : '☀️'}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Gestor de Películas y Series - Diseño Premium</p>
        </div>
      </footer>
    </div>
  );
}
