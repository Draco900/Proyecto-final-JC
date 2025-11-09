const mongoose = require('mongoose');

const juegoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },        // Nombre del juego (obligatorio, obvio)
  genero: { type: String, required: true },         // RPG, Acción, Aventura... lo que sea!
  plataforma: { type: String, required: true },   // PC, PS5, Xbox... donde lo juego
  añoLanzamiento: { type: Number, min: 1970, max: 2030 }, // No quiero que me pongan años raros
  desarrollador: String,                          // Quién lo hizo (opcional si la persona quiere ponerlo)
  imagenPortada: String,                          // URL de la imagen (si tengo, pueden buscarla en google imagenes y copiar url)
  descripcion: String,                            // Pequeña reseña/resumen del juego
  completado: { type: Boolean, default: false },  // Lo terminé? Por defecto no, porque soy vago 😅
  fechaCreacion: { type: Date, default: Date.now } // Cuando lo añadí a mi colección
});

// Exporto el modelo para usarlo en mis rutas
// Así puedo hacer cosas como Juego.find(), Juego.create(), etc.
module.exports = mongoose.model('Juego', juegoSchema);