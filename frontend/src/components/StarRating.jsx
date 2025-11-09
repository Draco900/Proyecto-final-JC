// StarRating.jsx - Mi componente de estrellas para puntuar juegos
// Hice este componente porque quería algo visual y fácil de usar
// Las estrellas se llenan cuando pasas el mouse y puedes hacer clic para puntuar

import React from 'react';

export default function StarRating({ value = 0, onChange }) {
  // Creo un array de 5 elementos para las 5 estrellas
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  
  return (
    <div className="star-rating" style={{ fontSize: '1.2rem' }}>
      {stars.map((s) => (
        <span
          key={s}
          role="button"
          aria-label={`Puntuación ${s}`}
          onClick={() => onChange?.(s)}  // Si hacen clic, cambio la puntuación
          style={{ cursor: 'pointer', userSelect: 'none', marginRight: 4 }}
        >
          {s <= value ? '★' : '☆'}    
        </span>
      ))}
    </div>
  );
}