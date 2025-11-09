// src/pages/BibliotecaJuegos.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TarjetaJuego from '../components/TarjetaJuego';
import { getJuegos, deleteJuego } from '../services/api';

export default function BibliotecaJuegos({ darkMode }) {
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filtros, setFiltros] = useState({
    genero: '',
    completado: '',
    orden: 'titulo'
  });

  const [juegosFiltrados, setJuegosFiltrados] = useState([]);

  // Cargar juegos desde el backend
  useEffect(() => {
    const cargarJuegos = async () => {
      try {
        const data = await getJuegos();
        setJuegos(data);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    cargarJuegos();
  }, []);

  // Aplicar filtros
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

  // Eliminar juego desde el backend
  const eliminarJuego = async (id) => {
    if (window.confirm('¿Eliminar este juego?')) {
      try {
        await deleteJuego(id);
        setJuegos(juegos.filter(j => j._id !== id));
      } catch (err) {
        alert('Error al eliminar el juego: ' + err.message);
        console.error('Error:', err);
      }
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

  // Estadísticas
  const total = juegos.length;
  const completados = juegos.filter(j => j.completado).length;
  const horasTotales = juegos.reduce((sum, j) => sum + (j.reseña?.horasJugadas || 0), 0);
  const puntuacionMedia = total > 0 ? (juegos.reduce((sum, j) => sum + (j.reseña?.puntuacion || 0), 0) / total).toFixed(1) : '0.0';

  // Manejo de estados de carga y error
  if (loading) return <div className="container"><p>Cargando juegos...</p></div>;
  if (error) return <div className="container"><p className="error">Error: {error}</p></div>;

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
        {juegosFiltrados.length === 0 ? (
          <p>No hay juegos en tu biblioteca.</p>
        ) : (
          <div className="grid">
            {juegosFiltrados.map(juego => (
              <div key={juego._id} className="grid-item">
                <TarjetaJuego juego={juego} />
                <div style={{ marginTop: 8 }}>
                  <button className="btn btn-danger" onClick={() => eliminarJuego(juego._id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
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