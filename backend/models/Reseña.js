const mongoose = require('mongoose');

const reseñaSchema = new mongoose.Schema({
  juegoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Juego', 
    required: true 
  },
  puntuacion: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  textoReseña: String,
  horasJugadas: { type: Number, min: 0 },
  dificultad: { 
    type: String, 
    enum: ['Fácil', 'Normal', 'Difícil'] 
  },
  recomendaria: Boolean,
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reseña', reseñaSchema);