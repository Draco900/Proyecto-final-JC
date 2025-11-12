// Lista y gestión de reseñas, con edición y eliminación.
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getReseñas, deleteReseña } from '../services/api';
import StarRating from '../components/StarRating';

export default function ListaReseñas() {
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filtroJuegoId = params.get('juegoId');

  // Cargar reseñas desde el backend
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getReseñas();
        setReseñas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  // Eliminar reseña
  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar reseña?')) return;
    try {
      await deleteReseña(id);
      setReseñas(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      alert('Error eliminando reseña: ' + err.message);
    }
  };

  if (loading) return <p>Cargando reseñas...</p>;
  if (error) return <p className="error">{error}</p>;

  const reseñasFiltradas = filtroJuegoId
    ? reseñas.filter(r => {
        const id = typeof r.juegoId === 'object' ? r.juegoId?._id : r.juegoId;
        return id === filtroJuegoId;
      })
    : reseñas;

  return (
    <>
      <h1>Reseñas</h1>
      {reseñasFiltradas.length === 0 ? (
        <p>No hay reseñas registradas.</p>
      ) : (
        <div className="grid">
          {reseñasFiltradas.map((r) => (
            <div className="card" key={r._id}>
              <div className="card-body">
                <h3>{r.juegoId?.titulo || 'Juego'}</h3>
                <StarRating value={r.puntuacion} />
                <p>{r.textoReseña}</p>
                <small>Horas: {r.horasJugadas || 0} • Dificultad: {r.dificultad}</small>
                <div className="card-actions">
                  <button className="btn btn-danger" onClick={() => eliminar(r._id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}