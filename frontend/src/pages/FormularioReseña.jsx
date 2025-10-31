// src/pages/FormularioReseña.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function FormularioReseña({ darkMode }) {
  const { juegoId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    juegoId: juegoId || '',
    puntuacion: 5,
    textoReseña: '',
    horasJugadas: '',
    dificultad: 'Normal',
    recomendaria: true
  });

  const [juego, setJuego] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar datos del juego si se proporciona juegoId
  useEffect(() => {
    if (juegoId) {
      const cargarJuego = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/juegos/${juegoId}`);
          if (!response.ok) throw new Error('Juego no encontrado');
          const data = await response.json();
          setJuego(data);
          // Asegurarse de que juegoId sea el _id del juego
          setFormData(prev => ({ ...prev, juegoId: data._id }));
        } catch (err) {
          setError('Error al cargar el juego: ' + err.message);
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      cargarJuego();
    } else {
      setLoading(false);
    }
  }, [juegoId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación
    if (!formData.juegoId) {
      setError('Se requiere seleccionar un juego');
      return;
    }
    if (!formData.puntuacion || formData.puntuacion < 1 || formData.puntuacion > 5) {
      setError('La puntuación debe estar entre 1 y 5 estrellas');
      return;
    }

    const reseñaData = {
      juegoId: formData.juegoId, // Este debe ser el _id del juego
      puntuacion: parseInt(formData.puntuacion),
      textoReseña: formData.textoReseña,
      horasJugadas: formData.horasJugadas ? parseInt(formData.horasJugadas) : 0,
      dificultad: formData.dificultad,
      recomendaria: formData.recomendaria
    };

    try {
      console.log('Enviando reseña:', reseñaData); // 👈 Para debug
      
      const response = await fetch('http://localhost:5000/api/reseñas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reseñaData)
      });

      const responseData = await response.json();
      console.log('Respuesta del backend:', responseData); // 👈 Para debug

      if (!response.ok) {
        throw new Error(responseData.message || `Error ${response.status}`);
      }

      alert('¡Reseña guardada exitosamente!');
      navigate('/');
    } catch (err) {
      setError('Error al guardar la reseña: ' + err.message);
      console.error('Error detallado:', err);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className="star"
        onClick={() => setFormData({ ...formData, puntuacion: i + 1 })}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        {i < rating ? '★' : '☆'}
      </span>
    ));
  };

  if (loading) return <div className="container"><p>Cargando...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;

  return (
    <>
      <h1>{juegoId ? `Reseña para: ${juego?.titulo}` : 'Nueva Reseña'}</h1>
      
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-juego">
        <div className="form-group">
          <label>Puntuación *</label>
          <div className="star-rating" style={{ fontSize: '2rem', marginBottom: '10px' }}>
            {renderStars(formData.puntuacion)}
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.puntuacion}
            onChange={(e) => setFormData({ ...formData, puntuacion: parseInt(e.target.value) })}
            style={{ width: '100%' }}
          />
          <div style={{ textAlign: 'center', marginTop: '5px' }}>
            {formData.puntuacion} estrella{formData.puntuacion !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="textoReseña">Tu Reseña</label>
          <textarea
            id="textoReseña"
            name="textoReseña"
            value={formData.textoReseña}
            onChange={handleChange}
            rows="6"
            placeholder="Escribe tu opinión sobre el juego..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="horasJugadas">Horas Jugadas</label>
          <input
            type="number"
            id="horasJugadas"
            name="horasJugadas"
            value={formData.horasJugadas}
            onChange={handleChange}
            min="0"
            placeholder="Ej: 25"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dificultad">Dificultad</label>
          <select
            id="dificultad"
            name="dificultad"
            value={formData.dificultad}
            onChange={handleChange}
          >
            <option value="Fácil">Fácil</option>
            <option value="Normal">Normal</option>
            <option value="Difícil">Difícil</option>
          </select>
        </div>

        <div className="form-group form-checkbox">
          <label>
            <input
              type="checkbox"
              name="recomendaria"
              checked={formData.recomendaria}
              onChange={handleChange}
            />
            ¿Recomendarías este juego?
          </label>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
          >
            Guardar Reseña
          </button>
        </div>
      </form>
    </>
  );
}