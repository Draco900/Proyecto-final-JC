const express = require('express');
const router = express.Router();
const Reseña = require('../models/Reseña');

// GET reseñas
router.get('/', async (req, res) => {
  try {
    const reseñas = await Reseña.find().populate('juegoId', 'titulo');
    res.json(reseñas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST reseñas
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
    res.status(201).json(nuevaReseña);
  } catch (err) {
    console.error('Error al crear reseña:', err); // 👈 Para debug
    res.status(400).json({ message: err.message });
  }
});

// GET reseñas/juego/:juegoId
router.get('/juego/:juegoId', async (req, res) => {
  try {
    const reseñas = await Reseña.find({ juegoId: req.params.juegoId });
    res.json(reseñas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT reseñas/:id
router.put('/:id', async (req, res) => {
  try {
    const reseña = await Reseña.findByIdAndUpdate(
      req.params.id,
      { ...req.body, fechaActualizacion: Date.now() },
      { new: true, runValidators: true }
    );
    if (!reseña) return res.status(404).json({ message: 'Reseña no encontrada' });
    res.json(reseña);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE reseñas/:id
router.delete('/:id', async (req, res) => {
  try {
    const reseña = await Reseña.findByIdAndDelete(req.params.id);
    if (!reseña) return res.status(404).json({ message: 'Reseña no encontrada' });
    res.json({ message: 'Reseña eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;