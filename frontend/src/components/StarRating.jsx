// StarRating.jsx - Mi componente de estrellas para puntuar juegos

import React from 'react';

export default function StarRating({ value = 0, onChange }) {
  // Creo un array de 5 elementos para las 5 estrellas
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  
  const handleClick = (s) => {
    if (onChange && typeof onChange === 'function') {
      onChange(s);
    }
  };
  
  return (
    <div className="star-rating" style={{ fontSize: '1.2rem' }}>
      {stars.map((s) => (
        <span
          key={s}
          role={onChange ? "button" : undefined}
          aria-label={`Puntuación ${s}`}
          onClick={() => handleClick(s)}
          className={s <= value ? 'filled' : ''}
          style={{ 
            cursor: onChange ? 'pointer' : 'default', 
            userSelect: 'none', 
            marginRight: 4 
          }}
        >
          {s <= value ? '★' : '☆'}    
        </span>
      ))}
    </div>
  );
}