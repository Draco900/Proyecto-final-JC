import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createJuego, updateJuego, getJuegoById } from '../services/api';

export default function FormularioJuego({ darkMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  // Si hay "id" estamos editando, si no, creando

  const [formData, setFormData] = useState({
    titulo: '',
    genero: '',
    plataforma: '',
    añoLanzamiento: '',
    desarrollador: '',
    imagenPortada: '',
    descripcion: '',
    completado: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Manejo de cambios del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Enviar el formulario: crear o actualizar juego
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validación básica
    if (!formData.titulo || !formData.genero || !formData.plataforma) {
      setError('Por favor, completa los campos obligatorios: título, género y plataforma.');
      return;
    }

    if (formData.añoLanzamiento && (formData.añoLanzamiento < 1970 || formData.añoLanzamiento > 2025)) {
      setError('El año de lanzamiento debe estar entre 1970 y 2025.');
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await updateJuego(id, formData);
        alert('¡Juego actualizado exitosamente!');
      } else {
        await createJuego(formData);
        alert('¡Juego agregado exitosamente!');
      }
      navigate('/');
    } catch (err) {
      setError('Error al guardar el juego: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar juego existente si estamos editando
  useEffect(() => {
    const cargarJuego = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getJuegoById(id);
        setFormData({
          titulo: data.titulo || '',
          genero: data.genero || '',
          plataforma: data.plataforma || '',
          añoLanzamiento: data.añoLanzamiento || '',
          desarrollador: data.desarrollador || '',
          imagenPortada: data.imagenPortada || '',
          descripcion: data.descripcion || '',
          completado: !!data.completado,
        });
      } catch (err) {
        setError('Error al cargar el juego: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    cargarJuego();
  }, [id]);

  return (
    <>
      {/* Título dinámico según acción */}
      <h1>{id ? 'Editar Juego' : 'Añadir Nuevo Juego'}</h1>
      
      {/* Mensaje de error */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}
      
      {/* Formulario principal */}
      <form onSubmit={handleSubmit} className="form-juego">
        {/* Campo: título del juego */}
        <div className="form-group">
          <label htmlFor="titulo">Título *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo: género */}
        <div className="form-group">
          <label htmlFor="genero">Género *</label>
          <select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un género</option>
            <option value="Acción">Acción</option>
            <option value="Aventura">Aventura</option>
            <option value="RPG">RPG</option>
            <option value="Estrategia">Estrategia</option>
            <option value="Deportes">Deportes</option>
            <option value="Metroidvania">Metroidvania</option>
            <option value="Acción/Aventura">Acción/Aventura</option>
          </select>
        </div>

        {/* Campo: plataforma */}
        <div className="form-group">
          <label htmlFor="plataforma">Plataforma *</label>
          <select
            id="plataforma"
            name="plataforma"
            value={formData.plataforma}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una plataforma</option>
            <option value="PC">PC</option>
            <option value="PlayStation">PlayStation</option>
            <option value="Xbox">Xbox</option>
            <option value="Nintendo Switch">Nintendo Switch</option>
            <option value="Mobile">Mobile</option>
          </select>
        </div>

        {/* Campo: año de lanzamiento */}
        <div className="form-group">
          <label htmlFor="añoLanzamiento">Año de Lanzamiento</label>
          <input
            type="number"
            id="añoLanzamiento"
            name="añoLanzamiento"
            value={formData.añoLanzamiento}
            onChange={handleChange}
            min="1970"
            max="2025"
          />
        </div>

        {/* Campo: desarrollador */}
        <div className="form-group">
          <label htmlFor="desarrollador">Desarrollador</label>
          <input
            type="text"
            id="desarrollador"
            name="desarrollador"
            value={formData.desarrollador}
            onChange={handleChange}
          />
        </div>

        {/* Campo: URL de portada */}
        <div className="form-group">
          <label htmlFor="imagenPortada">URL de la Portada</label>
          <input
            type="url"
            id="imagenPortada"
            name="imagenPortada"
            value={formData.imagenPortada}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        {/* Campo: descripción */}
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
          />
        </div>

        {/* Campo: estado completado */}
        <div className="form-group form-checkbox">
          <label>
            <input
              type="checkbox"
              name="completado"
              checked={formData.completado}
              onChange={handleChange}
            />
            Marcar como completado
          </label>
        </div>

        {/* Acciones del formulario */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : id ? 'Guardar Cambios' : 'Añadir Juego'}
          </button>
        </div>
      </form>
    </>
  );
}