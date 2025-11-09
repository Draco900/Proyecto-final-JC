// Modelo de Reseña - Aquí guardo mis críticas de juegos
// Cada reseña está ligada a un juego y tiene mi puntuación, texto y más datos
// Lo hice así para poder hacer relaciones entre juegos y sus reseñas fácilmente

const mongoose = require('mongoose');

const reseñaSchema = new mongoose.Schema({
  juegoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Juego',     // Esto me permite hacer "populate" y traer toda la info del juego
    required: true    // Obvio, una reseña sin juego no tiene sentido
  },
  puntuacion: { 
    type: Number, 
    required: true, 
    min: 1,           // Mínimo 1 estrella (¡aunque sea horrible!)
    max: 5            // Máximo 5 estrellas (¡obra maestra!)
  },
  textoReseña: String,              // Mi opinión escrita, puedo desahogarme aquí
  horasJugadas: { type: Number, min: 0 }, // Cuánto le metí (para que no me juzguen si es poco)
  dificultad: { 
    type: String, 
    enum: ['Fácil', 'Normal', 'Difícil'] // Solo estos tres valores, nada de "Medio-fácil"
  },
  recomendaria: Boolean,             // ¿Se la recomendaría a un amigo? true/false
  fechaCreacion: { type: Date, default: Date.now },     // Cuando la hice
  fechaActualizacion: { type: Date, default: Date.now }  // Cuando la edité por última vez
});

// Exporto el modelo para usarlo en mis rutas de reseñas
// Así puedo hacer Reseña.find(), Reseña.create(), etc.
module.exports = mongoose.model('Reseña', reseñaSchema);