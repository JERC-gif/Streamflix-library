import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Peliculas from './pages/Peliculas';
import PeliculaForm from './pages/PeliculaForm';
import Series from './pages/Series';
import SerieForm from './pages/SerieForm';
import Exportar from './pages/Exportar';
import Buscar from './pages/Buscar';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/peliculas" element={<Peliculas />} />
          <Route path="/peliculas/nueva" element={<PeliculaForm />} />
          <Route path="/peliculas/editar/:id" element={<PeliculaForm />} />
          <Route path="/series" element={<Series />} />
          <Route path="/series/nueva" element={<SerieForm />} />
          <Route path="/series/editar/:id" element={<SerieForm />} />
          <Route path="/exportar" element={<Exportar />} />
          <Route path="/buscar" element={<Buscar />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
