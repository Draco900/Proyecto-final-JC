import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../services/api';

export default function EstadisticasPersonales({ darkMode }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  return (
    <>
      <h1>Estadísticas Personales</h1>
      {loading && <p>Cargando estadísticas...</p>}
      {error && <p className="error">{error}</p>}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalJuegos}</div>
            <div className="stat-label">Total de juegos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.completados}</div>
            <div className="stat-label">Completados</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.horasTotales}</div>
            <div className="stat-label">Horas totales</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.promedioPuntuacion}</div>
            <div className="stat-label">Puntuación media</div>
          </div>
        </div>
      )}
      {stats?.distribGenero?.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h2>Distribución por género</h2>
          <ul>
            {stats.distribGenero.map(g => (
              <li key={g._id}>{g._id}: {g.count}</li>
            ))}
          </ul>
        </div>
      )}
      <Link to="/" className="btn btn-secondary" style={{ marginTop: 16 }}>Volver a la Biblioteca</Link>
    </>
  );
}