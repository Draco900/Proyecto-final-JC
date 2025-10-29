import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import BibliotecaJuegos from './pages/BibliotecaJuegos';
import FormularioJuego from './pages/FormularioJuego';
import EstadisticasPersonales from './pages/EstadisticasPersonales';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* ✅ ÚNICO contenedor para todo el contenido principal */}
        <main className="container">
          <Routes>
            <Route path="/" element={<BibliotecaJuegos darkMode={darkMode} />} />
            <Route path="/juego/nuevo" element={<FormularioJuego darkMode={darkMode} />} />
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
    <footer>
      <div className="container">
        <p>GameTracker © 2025 - Desarrollado por Jóvenes Creativos</p>
        <p>Juan Manuel Sandoval Pito</p>
      </div>
    </footer>
  );
}

export default App;