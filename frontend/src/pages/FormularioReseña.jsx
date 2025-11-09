import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { getJuegoById, createReseña, updateReseña, getReseñaById, getJuegos } from '../services/api';

export default function FormularioReseña({ darkMode }) {
  const { juegoId, reseñaId } = useParams();
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
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar datos del juego si se proporciona juegoId
  useEffect(() => {
    if (juegoId) {
      const cargarJuego = async () => {
        try {
          const data = await getJuegoById(juegoId);
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
      // Si no hay juegoId en la ruta, cargar lista de juegos para seleccionar
      const cargarLista = async () => {
        try {
          const lista = await getJuegos();
          setJuegos(lista);
        } catch (err) {
          setError('Error al cargar juegos: ' + err.message);
        } finally {
          setLoading(false);
        }
      };
      cargarLista();
    }
  }, [juegoId]);

  // Cargar datos de reseña si se edita
  useEffect(() => {
    if (reseñaId) {
      const cargarReseña = async () => {
        try {
          const r = await getReseñaById(reseñaId);
          setFormData(prev => ({
            ...prev,
            juegoId: r.juegoId?._id || r.juegoId || prev.juegoId,
            puntuacion: r.puntuacion || prev.puntuacion,
            textoReseña: r.textoReseña || '',
            horasJugadas: r.horasJugadas ?? '',
            dificultad: r.dificultad || 'Normal',
            recomendaria: !!r.recomendaria
          }));
          if (r.juegoId && typeof r.juegoId === 'object') {
            setJuego(r.juegoId);
          } else if (r.juegoId) {
            const data = await getJuegoById(r.juegoId);
            setJuego(data);
          }
        } catch (err) {
          setError('Error al cargar la reseña: ' + err.message);
        } finally {
          setLoading(false);
        }
      };
      cargarReseña();
    }
  }, [reseñaId]);

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
      if (reseñaId) {
        await updateReseña(reseñaId, reseñaData);
        alert('¡Reseña actualizada exitosamente!');
      } else {
        await createReseña(reseñaData);
        alert('¡Reseña guardada exitosamente!');
      }
      navigate('/reseñas');
    } catch (err) {
      setError('Error al guardar la reseña: ' + err.message);
      console.error('Error detallado:', err);
    }
  };

  const renderStars = (rating) => (
    <StarRating value={rating} onChange={(val) => setFormData({ ...formData, puntuacion: val })} />
  );

  if (loading) return <div className="container"><p>Cargando...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;

  return (
    <>
      <h1>{reseñaId ? 'Editar Reseña' : (juegoId ? `Reseña para: ${juego?.titulo}` : 'Nueva Reseña')}</h1>
      
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-juego">
        {!juegoId && (
          <div className="form-group">
            <label htmlFor="juegoId">Juego *</label>
            <select
              id="juegoId"
              name="juegoId"
              value={formData.juegoId}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un juego</option>
              {juegos.map((j) => (
                <option key={j._id} value={j._id}>{j.titulo}</option>
              ))}
            </select>
          </div>
        )}
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
            {reseñaId ? 'Actualizar Reseña' : 'Guardar Reseña'}
          </button>
        </div>
      </form>
    </>
  );
}