// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api'; // ← Cambia esto temporalmente

// Helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Juegos
export const getJuegos = () => 
  fetch(`${API_BASE_URL}/juegos`)
    .then(handleResponse);

export const createJuego = (juego) => 
  fetch(`${API_BASE_URL}/juegos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(juego)
  }).then(handleResponse);

export const updateJuego = (id, juego) => 
  fetch(`${API_BASE_URL}/juegos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(juego)
  }).then(handleResponse);

export const deleteJuego = (id) => 
  fetch(`${API_BASE_URL}/juegos/${id}`, { 
    method: 'DELETE' 
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json().catch(() => ({})); // DELETE puede no devolver JSON
  });

// Reseñas
export const getReseñas = () => 
  fetch(`${API_BASE_URL}/reseñas`)
    .then(handleResponse);

export const createReseña = (reseña) => 
  fetch(`${API_BASE_URL}/reseñas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reseña)
  }).then(handleResponse);