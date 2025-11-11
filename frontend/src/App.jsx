import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import BibliotecaJuegos from './pages/BibliotecaJuegos';
import FormularioJuego from './pages/FormularioJuego';
import EstadisticasPersonales from './pages/EstadisticasPersonales';
import FormularioReseña from './pages/FormularioReseña';
import ListaReseñas from './pages/ListaReseñas';


function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className="App">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="container">
          <Routes>
            <Route path="/" element={<BibliotecaJuegos darkMode={darkMode} />} />
            <Route path="/juego/nuevo" element={<FormularioJuego darkMode={darkMode} />} />
            <Route path="/juego/:id/editar" element={<FormularioJuego darkMode={darkMode} />} />
            <Route path="/juego/:juegoId/reseña" element={<FormularioReseña darkMode={darkMode} />} />
            <Route path="/reseña/:reseñaId/editar" element={<FormularioReseña darkMode={darkMode} />} />

            <Route path="/reseñas" element={<ListaReseñas darkMode={darkMode} />} />
            <Route path="/estadisticas" element={<EstadisticasPersonales darkMode={darkMode} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

function Header({ darkMode, toggleDarkMode }) {
  return (
    <header>
      <div className="container header-content">
        <div className="logo">GameTracker</div>
        <nav className="nav-links">
          <Link to="/">Biblioteca</Link>
          <Link to="/juego/nuevo">Añadir Juego</Link>
          <Link to="/estadisticas">Estadísticas</Link>
          <Link to="/reseñas">Reseñas</Link>
        </nav>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer-mejorado">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-title">GameTracker</h3>
            <p className="footer-description">Tu biblioteca de juegos, organiza y editar los videojuegos que hayas probado</p>
          </div>
          <p className="footer-credit">
            © {new Date().getFullYear()} • Desarrollado por Juan Manuel Sandoval Pito
          </p>
        </div>
      </div>
    </footer>
  );
}

export default App;