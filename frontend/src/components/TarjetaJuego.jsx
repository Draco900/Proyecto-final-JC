// TarjetaJuego.jsx - Componente para mostrar cada juego en mi colección
// Hice esta tarjeta para que se vea bien y muestre toda la info importante
// Uso React Router para los enlaces y mi componente StarRating para las puntuaciones

import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

export default function TarjetaJuego({ juego }) {
  return (
    <div className="card juego-card">
      {/* Sección de imagen - muestro la portada o un placeholder si no hay */}
      <div className="card-media">
        {juego.imagenPortada ? (
          <img src={juego.imagenPortada} alt={`Portada de ${juego.titulo}`} />
        ) : (
          <div className="placeholder">Sin portada</div>
        )}
      </div>
      
      {/* Información principal del juego */}
      <div className="card-body">
        <h3>{juego.titulo}</h3>
        
        {/* Datos básicos: género, plataforma y año */}
        <p className="meta">
          {juego.genero} • {juego.plataforma} • {juego.añoLanzamiento || '—'}
        </p>
        
        {/* Si tengo reseña, muestro puntuación y horas jugadas */}
        {juego.reseña && (
          <div className="reseña-resumen">
            <StarRating value={juego.reseña.puntuacion || 0} />
            <small>
              {juego.reseña.horasJugadas ? `${juego.reseña.horasJugadas} h` : ''}
            </small>
          </div>
        )}
        
        {/* Botones de acción: editar el juego o escribir reseña */}
        <div className="card-actions">
          <Link to={`/juego/${juego._id}/editar`} className="btn btn-secondary">Editar</Link>
          <Link to={`/juego/${juego._id}/reseña`} className="btn btn-primary">Reseñar</Link>
        </div>
      </div>
    </div>
  );
}