import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

  const [darkMode, setDarkMode] = useState(false);

// Datos simulados (solo para demostración en frontend)
  const [juegos, setJuegos] = useState([
    {
      _id: "1",
      titulo: "The Legend of Zelda: Breath of the Wild",
      genero: "Aventura",
      plataforma: "Nintendo Switch",
      añoLanzamiento: 2017,
      desarrollador: "Nintendo",
      imagenPortada: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58",
      descripcion: "Un juego de aventuras en un mundo abierto.",
      completado: true,
      fechaCreacion: "2023-01-15T10:00:00Z",
      reseña: {
        puntuacion: 5,
        textoReseña: "Una obra maestra del mundo abierto.",
        horasJugadas: 120,
        dificultad: "Normal",
        recomendaria: true,
        fechaCreacion: "2023-02-01T14:30:00Z"
      }
    },
    {
      _id: "2",
      titulo: "Red Dead Redemption 2",
      genero: "Acción/Aventura",
      plataforma: "PlayStation 4",
      añoLanzamiento: 2018,
      desarrollador: "Rockstar Games",
      imagenPortada: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_O6cP5kd-KnFwJiY7RPh1cCq6z3LyKbAjlQ&s",
      descripcion: "Una épica historia en el viejo oeste.",
      completado: true,
      fechaCreacion: "2023-02-20T11:00:00Z",
      reseña: {
        puntuacion: 5,
        textoReseña: "Gráficos increíbles y narrativa profunda.",
        horasJugadas: 85,
        dificultad: "Normal",
        recomendaria: true,
        fechaCreacion: "2023-03-05T16:00:00Z"
      }
    },
    {
      _id: "3",
      titulo: "Cyberpunk 2077",
      genero: "RPG",
      plataforma: "PC",
      añoLanzamiento: 2020,
      desarrollador: "CD Projekt Red",
      imagenPortada: "https://image.api.playstation.com/vulcan/ap/rnd/202008/0416/6Bo40lnWU0BhgrOUm7Cb6by3.png",
      descripcion: "Un RPG futurista en Night City.",
      completado: false,
      fechaCreacion: "2023-03-10T09:00:00Z",
      reseña: {
        puntuacion: 3,
        textoReseña: "Buena historia pero con muchos bugs iniciales.",
        horasJugadas: 45,
        dificultad: "Difícil",
        recomendaria: true,
        fechaCreacion: "2023-04-01T18:00:00Z"
      }
    },
    {
      _id: "4",
      titulo: "Hollow Knight",
      genero: "Metroidvania",
      plataforma: "PC",
      añoLanzamiento: 2017,
      desarrollador: "Team Cherry",
      imagenPortada: "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/capsule_616x353.jpg",
      descripcion: "Un juego de plataformas con combate desafiante.",
      completado: true,
      fechaCreacion: "2023-04-05T13:00:00Z",
      reseña: {
        puntuacion: 4,
        textoReseña: "Diseño de niveles excepcional, pero difícil.",
        horasJugadas: 30,
        dificultad: "Difícil",
        recomendaria: true,
        fechaCreacion: "2023-05-01T12:00:00Z"
      }
    }
  ]);

  // Filtros
  const [filtros, setFiltros] = useState({
    genero: '',
    completado: '',
    orden: 'titulo'
  });

  // Estado para juegos filtrados
  const [filteredJuegos, setFilteredJuegos] = useState([]);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let resultado = [...juegos];

    if (filtros.genero) {
      resultado = resultado.filter(j => j.genero === filtros.genero);
    }

    if (filtros.completado === 'completed') {
      resultado = resultado.filter(j => j.completado === true);
    } else if (filtros.completado === 'not-completed') {
      resultado = resultado.filter(j => j.completado === false);
    }

    // Ordenar
    resultado.sort((a, b) => {
      if (filtros.orden === 'titulo') return a.titulo.localeCompare(b.titulo);
      if (filtros.orden === 'hours') {
        const horasA = a.reseña?.horasJugadas || 0;
        const horasB = b.reseña?.horasJugadas || 0;
        return horasB - horasA;
      }
      if (filtros.orden === 'score') {
        const scoreA = a.reseña?.puntuacion || 0;
        const scoreB = b.reseña?.puntuacion || 0;
        return scoreB - scoreA;
      }
      return 0;
    });

    setFilteredJuegos(resultado);
  }, [juegos, filtros]);

  // Función para eliminar juego (simulado)
  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este juego?')) {
      setJuegos(juegos.filter(j => j._id !== id));
    }
  };

  // Función para cambiar filtros
  const handleFiltroChange = (nombre, valor) => {
    setFiltros(prev => ({ ...prev, [nombre]: valor }));
  };

  // Función para alternar modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Calcular estadísticas
  const totalJuegos = juegos.length;
  const juegosCompletados = juegos.filter(j => j.completado).length;
  const horasTotales = juegos.reduce((sum, j) => sum + (j.reseña?.horasJugadas || 0), 0);
  const puntuacionMedia = juegos.length > 0 
    ? juegos.reduce((sum, j) => sum + (j.reseña?.puntuacion || 0), 0) / juegos.length 
    : 0;

  // Renderizar estrellas
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="star">
        {i < rating ? '★' : '☆'}
      </span>
    ));
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      {/* HEADER */}
      <header>
        <div className="container header-content">
          <div className="logo">GameTracker</div>
          <nav className="nav-links">
            <a href="#">Biblioteca</a>
            <a href="#">Añadir Juego</a>
            <a href="#">Estadísticas</a>
          </nav>
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container">
        <h1>Mi Biblioteca de Juegos</h1>

        {/* FILTROS */}
        <div className="filters">
          <div className="filter-item">
            <label htmlFor="genre-filter">Género:</label>
            <select
              id="genre-filter"
              value={filtros.genero}
              onChange={(e) => handleFiltroChange('genero', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Aventura">Aventura</option>
              <option value="Acción">Acción</option>
              <option value="RPG">RPG</option>
              <option value="Deportes">Deportes</option>
              <option value="Metroidvania">Metroidvania</option>
              <option value="Acción/Aventura">Acción/Aventura</option>
            </select>
          </div>
          <div className="filter-item">
            <label htmlFor="completion-filter">Estado:</label>
            <select
              id="completion-filter"
              value={filtros.completado}
              onChange={(e) => handleFiltroChange('completado', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="completed">Completados</option>
              <option value="not-completed">No completados</option>
            </select>
          </div>
          <div className="filter-item">
            <label htmlFor="sort-by">Ordenar por:</label>
            <select
              id="sort-by"
              value={filtros.orden}
              onChange={(e) => handleFiltroChange('orden', e.target.value)}
            >
              <option value="titulo">Título</option>
              <option value="horas">Horas jugadas</option>
              <option value="score">Puntuación</option>
            </select>
          </div>
        </div>

        {/* GAME LIBRARY */}
        <div className="game-library">
          {filteredJuegos.map(juego => (
            <div key={juego._id} className="game-card">
              <img 
                src={juego.imagenPortada} 
                alt={juego.titulo} 
                className="game-image"
              />
              <div className="game-info">
                <h3 className="game-title">{juego.titulo}</h3>
                <div className="game-meta">
                  <span className="game-genre">{juego.genero}</span>
                  <span className="game-hours">⏱️ {juego.reseña?.horasJugadas || 0}h</span>
                </div>
                <div className={`game-completion ${juego.completado ? 'completed' : 'not-completed'}`}>
                  {juego.completado ? '✓ Completado' : '✗ No completado'}
                </div>
                <div className="star-rating">
                  {renderStars(juego.reseña?.puntuacion || 0)}
                </div>
                <div className="game-actions">
                  <button className="btn btn-secondary">Editar</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(juego._id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ESTADÍSTICAS */}
        <div className="statistics">
          <h2>Mis Estadísticas</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{totalJuegos}</div>
              <div className="stat-label">Total de juegos</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{juegosCompletados}</div>
              <div className="stat-label">Juegos completados</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{horasTotales}</div>
              <div className="stat-label">Horas totales</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{puntuacionMedia.toFixed(1)}</div>
              <div className="stat-label">Puntuación media</div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <p>GameTracker © 2025 - Desarrollado por Jóvenes Creativos</p>
          <p>Juan Manuel Sandoval Pito</p>
        </div>
      </footer>
    </div>
  );
}

export default App;