// Aquí tengo todas las funciones para llamar a mi API
const API_BASE_URL = 'http://localhost:5000/api';  // URL de mi servidor backend

// Helper para manejar respuestas
// Esto me ahorra repetir código en cada llamada
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};


// ===== FUNCIONES DE JUEGOS =====
// Obtener todos los juegos de mi colección
export const getJuegos = () => 
  fetch(`${API_BASE_URL}/juegos`)
    .then(handleResponse);

// Obtener un juego específico por su ID
export const getJuegoById = (id) =>
  fetch(`${API_BASE_URL}/juegos/${id}`)
    .then(handleResponse);

// Crear un nuevo juego en mi colección
export const createJuego = (juego) => 
  fetch(`${API_BASE_URL}/juegos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(juego)
  }).then(handleResponse);

// Actualizar un juego existente
export const updateJuego = (id, juego) => 
  fetch(`${API_BASE_URL}/juegos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(juego)
  }).then(handleResponse);

// Borrar un juego de mi colección
export const deleteJuego = (id) => 
  fetch(`${API_BASE_URL}/juegos/${id}`, { 
    method: 'DELETE' 
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json().catch(() => ({})); // DELETE puede no devolver JSON
  });

// ===== FUNCIONES DE RESEÑAS =====

// Obtener todas las reseñas que he escrito
export const getReseñas = () => 
  fetch(`${API_BASE_URL}/resenas`)
    .then(handleResponse);

// Crear una nueva reseña para un juego
export const createReseña = (reseña) => 
  fetch(`${API_BASE_URL}/resenas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reseña)
  }).then(handleResponse);

// Obtener una reseña específica por su ID
export const getReseñaById = (id) =>
  fetch(`${API_BASE_URL}/resenas/${id}`)
    .then(handleResponse);

// Obtener todas las reseñas de un juego específico
export const getReseñasByJuegoId = (juegoId) =>
  fetch(`${API_BASE_URL}/resenas/juego/${juegoId}`)
    .then(handleResponse);

// Actualizar una reseña existente
export const updateReseña = (id, reseña) => 
  fetch(`${API_BASE_URL}/resenas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reseña)
  }).then(handleResponse);

// Borrar una reseña
export const deleteReseña = (id) =>
  fetch(`${API_BASE_URL}/resenas/${id}`, { method: 'DELETE' })
    .then(handleResponse);

// ===== FUNCIONES DE ESTADÍSTICAS =====

// Obtener estadísticas generales de mi colección
export const getStats = () =>
  fetch(`${API_BASE_URL}/stats`).then(handleResponse);