import React from 'react';
import { Link } from 'react-router-dom';

export default function EstadisticasPersonales({ darkMode }) {
  return (
    <>
      <h1>Estadísticas Personales</h1>
      <p>Esta página mostrará gráficos y análisis detallados de tu biblioteca.</p>
      <p>Por ahora, las estadísticas están disponibles en la página principal.</p>
      <Link to="/" className="btn btn-secondary">Volver a la Biblioteca</Link>
    </>
  );
}