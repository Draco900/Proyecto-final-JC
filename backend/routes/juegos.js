// Rutas de Juegos - Aquí controlo todo lo relacionado con mis juegos
// Este archivo maneja: listar, crear, ver, editar y borrar juegos
// Lo hice con Express porque es lo que más fácil me resultó de entender

const express = require('express');
const router = express.Router();
const Juego = require('../models/Juego');    // Importo mi modelo de Juego
const Reseña = require('../models/Reseña');  // Importo Reseña para cuando borre un juego

// GET /api/juegos - Listar todos mis juegos
// Los ordeno por fecha de creación (más nuevos primero) porque me gusta ver lo último que añadí
router.get('/', async (req, res) => {
  try {
    const juegos = await Juego.find().sort({ fechaCreacion: -1 });
    res.json(juegos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/juegos - Añadir un nuevo juego a mi colección
// Aquí recibo los datos del formulario y creo el nuevo juego
router.post('/', async (req, res) => {
  const juego = new Juego({
    titulo: req.body.titulo,
    genero: req.body.genero,
    plataforma: req.body.plataforma,
    añoLanzamiento: req.body.añoLanzamiento,
    desarrollador: req.body.desarrollador,
    imagenPortada: req.body.imagenPortada,
    descripcion: req.body.descripcion,
    completado: req.body.completado || false  // Si no me dicen nada, asumo que no lo he completado
  });

  try {
    const nuevoJuego = await juego.save();
    res.status(201).json(nuevoJuego);  // 201 = Created
  } catch (err) {
    res.status(400).json({ message: err.message });  // 400 = Bad Request
  }
});

// GET /api/juegos/:id - Ver los detalles de un juego específico
// Uso findById para buscar por el ID de MongoDB
router.get('/:id', async (req, res) => {
  try {
    const juego = await Juego.findById(req.params.id);
    if (!juego) return res.status(404).json({ message: 'Juego no encontrado' });
    res.json(juego);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/juegos/:id - Actualizar un juego
// findByIdAndUpdate me permite actualizar y devolver el juego ya actualizado
router.put('/:id', async (req, res) => {
  try {
    const juego = await Juego.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }  // new: true me devuelve el juego actualizado
    );
    if (!juego) return res.status(404).json({ message: 'Juego no encontrado' });
    res.json(juego);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/juegos/:id - Borrar un juego (y sus reseñas)
// También borro las reseñas asociadas porque no quiero reseñas huérfanas
router.delete('/:id', async (req, res) => {
  try {
    const juego = await Juego.findByIdAndDelete(req.params.id);
    if (!juego) return res.status(404).json({ message: 'Juego no encontrado' });
    
    // Elimino todas las reseñas de este juego
    await Reseña.deleteMany({ juegoId: req.params.id });
    
    res.json({ message: 'Juego eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Exporto el router para usarlo en server.js
module.exports = router;