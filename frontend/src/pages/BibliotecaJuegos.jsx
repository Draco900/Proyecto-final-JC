// src/pages/BibliotecaJuegos.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function BibliotecaJuegos({ darkMode }) {
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
      reseña: { puntuacion: 5, horasJugadas: 120 }
    },
    {
      _id: "2",
      titulo: "Red Dead Redemption 2",
      genero: "Acción/Aventura",
      plataforma: "PlayStation 4",
      añoLanzamiento: 2018,
      desarrollador: "Rockstar Games",
      imagenPortada: "https://image.api.playstation.com/vulcan/img/rnd/202009/2818/GGyEnCkLxPppgqO3WJztp5sH.png",
      descripcion: "Una épica historia en el viejo oeste.",
      completado: true,
      reseña: { puntuacion: 5, horasJugadas: 85 }
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
      reseña: { puntuacion: 3, horasJugadas: 45 }
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
      reseña: { puntuacion: 4, horasJugadas: 30 }
    }
  ]);

  const [filtros, setFiltros] = useState({
    genero: '',
    completado: '',
    orden: 'titulo'
  });

  const [juegosFiltrados, setJuegosFiltrados] = useState([]);

  useEffect(() => {
    let resultado = [...juegos];
    if (filtros.genero) resultado = resultado.filter(j => j.genero === filtros.genero);
    if (filtros.completado === 'completed') resultado = resultado.filter(j => j.completado);
    if (filtros.completado === 'not-completed') resultado = resultado.filter(j => !j.completado);

    resultado.sort((a, b) => {
      if (filtros.orden === 'titulo') return a.titulo.localeCompare(b.titulo);
      if (filtros.orden === 'horas') return (b.reseña?.horasJugadas || 0) - (a.reseña?.horasJugadas || 0);
      if (filtros.orden === 'score') return (b.reseña?.puntuacion || 0) - (a.reseña?.puntuacion || 0);
      return 0;
    });

    setJuegosFiltrados(resultado);
  }, [juegos, filtros]);

  const eliminarJuego = (id) => {
    if (window.confirm('¿Eliminar este juego?')) {
      setJuegos(juegos.filter(j => j._id !== id));
    }
  };

  const cambiarFiltro = (clave, valor) => {
    setFiltros(prev => ({ ...prev, [clave]: valor }));
  };

  const renderEstrellas = (puntuacion) => {
    return Array(5).fill().map((_, i) => (
      <span key={i} className="star">{i < puntuacion ? '★' : '☆'}</span>
    ));
  };

  const total = juegos.length;
  const completados = juegos.filter(j => j.completado).length;
  const horasTotales = juegos.reduce((sum, j) => sum + (j.reseña?.horasJugadas || 0), 0);
  const puntuacionMedia = total > 0 ? (juegos.reduce((sum, j) => sum + (j.reseña?.puntuacion || 0), 0) / total).toFixed(1) : '0.0';

  return (
    <>
      <h1>Mi Biblioteca de Juegos</h1>

      <div className="filters">
        <div className="filter-item">
          <label htmlFor="genre-filter">Género:</label>
          <select id="genre-filter" value={filtros.genero} onChange={(e) => cambiarFiltro('genero', e.target.value)}>
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
          <select id="completion-filter" value={filtros.completado} onChange={(e) => cambiarFiltro('completado', e.target.value)}>
            <option value="">Todos</option>
            <option value="completed">Completados</option>
            <option value="not-completed">No completados</option>
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="sort-by">Ordenar por:</label>
          <select id="sort-by" value={filtros.orden} onChange={(e) => cambiarFiltro('orden', e.target.value)}>
            <option value="titulo">Título</option>
            <option value="horas">Horas jugadas</option>
            <option value="score">Puntuación</option>
          </select>
        </div>
      </div>

      <div className="game-library">
        {juegosFiltrados.map(juego => (
          <div key={juego._id} className="game-card">
            <img src={juego.imagenPortada} alt={juego.titulo} className="game-image" />
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
                {renderEstrellas(juego.reseña?.puntuacion || 0)}
              </div>
              <div className="game-actions">
                <Link to={`/juego/editar/${juego._id}`} className="btn btn-secondary">Editar</Link>
                <button className="btn btn-danger" onClick={() => eliminarJuego(juego._id)}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="statistics">
        <h2>Mis Estadísticas</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total de juegos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{completados}</div>
            <div className="stat-label">Juegos completados</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{horasTotales}</div>
            <div className="stat-label">Horas totales</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{puntuacionMedia}</div>
            <div className="stat-label">Puntuación media</div>
          </div>
        </div>
      </div>
    </>
  );
}