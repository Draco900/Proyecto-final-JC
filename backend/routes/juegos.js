const express = require('express');
const router = express.Router();
const Juego = require('../models/Juego');
const Reseña = require('../models/Reseña');

// GET juegos
router.get('/', async (req, res) => {
  try {
    const juegos = await Juego.find().sort({ fechaCreacion: -1 });
    res.json(juegos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST juegos
router.post('/', async (req, res) => {
  const juego = new Juego({
    titulo: req.body.titulo,
    genero: req.body.genero,
    plataforma: req.body.plataforma,
    añoLanzamiento: req.body.añoLanzamiento,
    desarrollador: req.body.desarrollador,
    imagenPortada: req.body.imagenPortada,
    descripcion: req.body.descripcion,
    completado: req.body.completado || false
  });

  try {
    const nuevoJuego = await juego.save();
    res.status(201).json(nuevoJuego);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET juegos/:id
router.get('/:id', async (req, res) => {
  try {
    const juego = await Juego.findById(req.params.id);
    if (!juego) return res.status(404).json({ message: 'Juego no encontrado' });
    res.json(juego);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT juegos/:id
router.put('/:id', async (req, res) => {
  try {
    const juego = await Juego.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!juego) return res.status(404).json({ message: 'Juego no encontrado' });
    res.json(juego);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE juegos/:id
router.delete('/:id', async (req, res) => {
  try {
    const juego = await Juego.findByIdAndDelete(req.params.id);
    if (!juego) return res.status(404).json({ message: 'Juego no encontrado' });
    
    // Elimina reseñas asociadas
    await Reseña.deleteMany({ juegoId: req.params.id });
    
    res.json({ message: 'Juego eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;