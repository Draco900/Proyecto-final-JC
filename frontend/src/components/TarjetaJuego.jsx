import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

export default function TarjetaJuego({ juego, onEliminar }) {
  return (
    <div className="card juego-card horizontal">
      {/* Imagen del juego */}
      <div className="card-media">
        {juego.imagenPortada ? (
          <img src={juego.imagenPortada} alt={`Portada de ${juego.titulo}`} />
        ) : (
          <div className="placeholder">Sin portada</div>
        )}
      </div>

      {/* Información principal del juego */}
      <div className="card-body">
        {/* Título grande y destacado */}
        <h3 className="game-title">{juego.titulo}</h3>

        {/* Datos básicos: género, plataforma y año */}
        <div className="meta">
          {juego.genero} • {juego.plataforma} • {juego.añoLanzamiento || '—'}
        </div>

        {/* Si tiene reseña, muestra puntuación y horas */}
        {juego.reseña && (
          <div className="resena-resumen">
            <span className="stars"><StarRating value={juego.reseña.puntuacion || 0} /></span>
            <span className="horas-jugadas">
              {juego.reseña.horasJugadas ? `⏱️ ${juego.reseña.horasJugadas}h` : '⏱️ Sin horas registradas'}
            </span>
          </div>
        )}

        {/* Estado del juego — visible y destacado */}
        <div className="estado-juego">
          <span style={{
            fontSize: '0.85rem',
            padding: '4px 8px',
            borderRadius: '12px',
            backgroundColor: juego.completado ? '#dbeafe' : '#fef3c7',
            color: juego.completado ? '#1d4ed8' : '#f59e0b',
            fontWeight: '600'
          }}>
            {juego.completado ? '✅ Completado' : '🟡 Pendiente'}
          </span>
        </div>

        <div className="card-actions">
          <Link to={`/juego/${juego._id}/editar`} className="btn btn-primary">Editar</Link>
          {juego.reseña ? (
            <Link to={`/reseñas?juegoId=${juego._id}`} className="btn btn-secondary">Ver reseña</Link>
          ) : (
            <Link to={`/juego/${juego._id}/reseña`} className="btn btn-primary">Escribir reseña</Link>
          )}
          <button
            onClick={() => onEliminar && onEliminar(juego._id)}
            className="btn btn-danger"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}