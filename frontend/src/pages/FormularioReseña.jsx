import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { getJuegoById, createReseña, updateReseña, getReseñaById } from '../services/api';

const FormularioReseña = ({ darkMode }) => {
  const { juegoId, reseñaId } = useParams();
  const navigate = useNavigate();
  // Si hay "reseñaId" estamos editando; si no, creando
  const [juego, setJuego] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    juegoId: juegoId || '',
    puntuacion: 5,
    textoReseña: '',
    horasJugadas: '',
    dificultad: 'Normal',
    recomendaria: false
  });

  // Cargar datos del juego si es nueva reseña
  useEffect(() => {
    if (juegoId && !reseñaId) {
      const cargarJuego = async () => {
        try {
          const data = await getJuegoById(juegoId);
          setJuego(data);
        } catch (err) {
          setError('Error al cargar el juego');
        } finally {
          setLoading(false);
        }
      };
      cargarJuego();
    }
  }, [juegoId, reseñaId]);

  // Cargar datos de reseña si se edita
  useEffect(() => {
    if (reseñaId) {
      const cargarReseña = async () => {
        try {
          const r = await getReseñaById(reseñaId);
          
          if (!r) {
            throw new Error('No se encontró la reseña');
          }
          
          // Asegurarme de que el juegoId es correcto
          const juegoIdActual = r.juegoId?._id || r.juegoId;
          
          if (!juegoIdActual) {
            throw new Error('La reseña no tiene un juego asociado');
          }
          
          setFormData({
            juegoId: juegoIdActual,
            puntuacion: r.puntuacion || 5,
            textoReseña: r.textoReseña || '',
            horasJugadas: r.horasJugadas || '',
            dificultad: r.dificultad || 'Normal',
            recomendaria: !!r.recomendaria
          });
          
          // Cargar los datos del juego relacionado
          const data = await getJuegoById(juegoIdActual);
          setJuego(data);
          
        } catch (err) {
          setError('Error al cargar la reseña: ' + err.message);
        } finally {
          setLoading(false);
        }
      };
      cargarReseña();
    } else {
      setLoading(false);
    }
  }, [reseñaId]);

  // Manejo de cambios del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Enviar el formulario de reseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (reseñaId) {
        await updateReseña(reseñaId, formData);
      } else {
        await createReseña(formData);
      }
      navigate('/resenas');
    } catch (err) {
      setError('Error al guardar la reseña');
    }
  };

  // Estado de carga
  if (loading) {
    return <div className="container"><h2>Cargando...</h2></div>;
  }

  // Estado de error
  if (error) {
    return (
      <div className="container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/resenas')} className="btn btn-primary">
          Volver a reseñas
        </button>
      </div>
    );
  }

  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Títulos y juego asociado */}
      <h2>{reseñaId ? 'Editar Reseña' : 'Nueva Reseña'}</h2>
      {juego && <h3>{juego.titulo}</h3>}
      
      {/* Formulario principal de reseña */}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Puntuación:</label>
          <StarRating 
            value={formData.puntuacion} 
            onChange={(value) => setFormData({...formData, puntuacion: value})}
          />
        </div>

        <div className="form-group">
          <label>Texto de la reseña:</label>
          <textarea
            name="textoReseña"
            value={formData.textoReseña}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Horas jugadas:</label>
          <input
            type="number"
            name="horasJugadas"
            value={formData.horasJugadas}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Dificultad:</label>
          <select
            name="dificultad"
            value={formData.dificultad}
            onChange={handleChange}
          >
            <option value="Muy fácil">Muy fácil</option>
            <option value="Fácil">Fácil</option>
            <option value="Normal">Normal</option>
            <option value="Difícil">Difícil</option>
            <option value="Muy difícil">Muy difícil</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="recomendaria"
              checked={formData.recomendaria}
              onChange={handleChange}
            />
            Recomendaría este juego
          </label>
        </div>

        {/* Acciones del formulario */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {reseñaId ? 'Actualizar' : 'Guardar'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/resenas')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioReseña;