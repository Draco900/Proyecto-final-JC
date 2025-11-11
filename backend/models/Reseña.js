// Modelo de Reseña - Aquí guardo mis críticas de juegos
// Cada reseña está ligada a un juego y tiene su puntuación, texto y más datos
// Lo hice así para poder hacer relaciones entre juegos y sus reseñas fácilmente

const mongoose = require('mongoose');

const reseñaSchema = new mongoose.Schema({
  juegoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Juego',     // Esto me permite traer toda la info del juego
    required: true    // Y por supuesto una reseña sin juego no tiene sentido
  },
  puntuacion: { 
    type: Number, 
    required: true, 
    min: 1,           // Mínimo 1 estrella (aunque sea horrible)
    max: 5            // Máximo 5 estrellas (Si el juego es una joya)
  },
  textoReseña: String,              // Mi opinión escrita
  horasJugadas: { type: Number, min: 0 }, // Cuánto le meti
  dificultad: { 
    type: String, 
    enum: ['Fácil', 'Normal', 'Difícil'] // Solo estos tres valores
  },
  recomendaria: Boolean,             // ¿Se la recomendaría a un amigo? true/false
  fechaCreacion: { type: Date, default: Date.now },     // Cuando la hice
  fechaActualizacion: { type: Date, default: Date.now }  // Cuando la edité por última vez
});

// Exporto el modelo para usarlo en mis rutas de reseñas
// Así puedo hacer Reseña.find(), Reseña.create(), etc.
module.exports = mongoose.model('Reseña', reseñaSchema);