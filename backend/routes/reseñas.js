// Rutas de Reseñas - Aquí controlo todo lo de las críticas de juegos
// Manejo: listar reseñas, crear, ver, editar y borrar reseñas
// También puedo ver las reseñas de un juego específico

const express = require('express');
const router = express.Router();
const Reseña = require('../models/Reseña');  // Importo mi modelo de Reseña

// GET /api/resenas - Listar todas mis reseñas
// Uso populate para traer también el título del juego, así no solo veo IDs
router.get('/', async (req, res) => {
  try {
    const reseñas = await Reseña.find().populate('juegoId', 'titulo');
    res.json(reseñas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/resenas - Crear una nueva reseña
// Recibo los datos del formulario y creo la reseña con todos los campos
router.post('/', async (req, res) => {
  try {
    const reseña = new Reseña({
      juegoId: req.body.juegoId,
      puntuacion: req.body.puntuacion,
      textoReseña: req.body.textoReseña,
      horasJugadas: req.body.horasJugadas,
      dificultad: req.body.dificultad,
      recomendaria: req.body.recomendaria
    });

    const nuevaReseña = await reseña.save();
    res.status(201).json(nuevaReseña);  // 201 = Created
  } catch (err) {
    console.error('Error al crear reseña:', err); // 👈 Para debug, me salvó muchas veces
    res.status(400).json({ message: err.message });  // 400 = Bad Request
  }
});

// GET /api/resenas/juego/:juegoId - Ver todas las reseñas de un juego específico
// Útil cuando quiero ver solo las críticas de un juego en concreto
router.get('/juego/:juegoId', async (req, res) => {
  try {
    const reseñas = await Reseña.find({ juegoId: req.params.juegoId });
    res.json(reseñas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/resenas/:id - Ver una reseña específica por su ID
// También traigo el título del juego con populate para que se vea más completo
router.get('/:id', async (req, res) => {
  try {
    const reseña = await Reseña.findById(req.params.id).populate('juegoId', 'titulo');
    if (!reseña) return res.status(404).json({ message: 'Reseña no encontrada' });
    res.json(reseña);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/resenas/:id - Actualizar una reseña
// Actualizo los campos que me envían y también la fecha de actualización
router.put('/:id', async (req, res) => {
  try {
    const reseña = await Reseña.findByIdAndUpdate(
      req.params.id,
      { ...req.body, fechaActualizacion: Date.now() },  // Actualizo también la fecha
      { new: true, runValidators: true }
    );
    if (!reseña) return res.status(404).json({ message: 'Reseña no encontrada' });
    res.json(reseña);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/resenas/:id - Borrar una reseña
// Simple y directo: la busco y la borro
router.delete('/:id', async (req, res) => {
  try {
    const reseña = await Reseña.findByIdAndDelete(req.params.id);
    if (!reseña) return res.status(404).json({ message: 'Reseña no encontrada' });
    res.json({ message: 'Reseña eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Exporto el router para usarlo en server.js
module.exports = router;