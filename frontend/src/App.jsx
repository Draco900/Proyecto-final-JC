import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import BibliotecaJuegos from './pages/BibliotecaJuegos';
import FormularioJuego from './pages/FormularioJuego';
import EstadisticasPersonales from './pages/EstadisticasPersonales';
import FormularioReseña from './pages/FormularioReseña';
import ListaReseñas from './pages/ListaReseñas';


// Componente raíz: define enrutado y layout global
function App() {
  // Estado: modo oscuro
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Efecto: aplicar clase de "Modo oscuro" al <body>
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Efecto: mostrar botón de "Subir arriba" cuando se llega al final
  useEffect(() => {
    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
      setShowScrollTop(atBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Acción: alternar el modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Acción: hacer scroll suave al inicio
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // Enrutador principal
    <Router>
      <div className="App">
        {/* Encabezado con navegación y modo oscuro */}
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* Contenido principal y rutas */}
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

        {/* Pie de página */}
        <Footer />
        {/* Botón flotante: subir arriba */}
        {showScrollTop && (
          <button className="scroll-top" onClick={scrollToTop}>↑</button>
        )}
      </div>
    </Router>
  );
}

// Encabezado: marca, navegación y botón de modo oscuro
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

// Pie de página con marca y créditos
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
