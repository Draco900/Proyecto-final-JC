// Rutas de Estadísticas - Aquí calculo todos los datos de mi colección
// Esto es lo que uso para mostrar gráficas y estadísticas en el frontend
// Me costó un poco pero quedaron bien

const express = require('express');
const router = express.Router();
const Juego = require('../models/Juego');      // Necesito el modelo Juego para contar
const Reseña = require('../models/Reseña');  // Necesito Reseña para promedios y horas

// GET /api/stats - Obtener estadísticas generales de mi colección
// Aquí calculo: total de juegos, completados, horas jugadas, promedio de puntuaciones, etc.
router.get('/', async (req, res) => {
  try {
    // Uso Promise.all para hacer varias consultas al mismo tiempo (más rápido)
    const [totalJuegos, completados] = await Promise.all([
      Juego.countDocuments({}),              // Cuento todos los juegos
      Juego.countDocuments({ completado: true }) // Cuento solo los que he completado
    ]);

    // Agregaciones sobre reseñas para horas y puntuación
    // Esto me da: horas totales jugadas, puntuación media y total de reseñas
    const agregados = await Reseña.aggregate([
      {
        $group: {
          _id: null,
          horasTotales: { $sum: { $ifNull: ['$horasJugadas', 0] } }, // Si no hay horas, cuento 0
          promedioPuntuacion: { $avg: '$puntuacion' },              // Media de todas las puntuaciones
          totalReseñas: { $sum: 1 }                                // Cuento cuántas reseñas hay
        }
      }
    ]);

    // Extraigo los valores del agregado (si no hay reseñas, uso 0)
    const horasTotales = agregados[0]?.horasTotales || 0;
    const promedioPuntuacion = agregados[0]?.promedioPuntuacion || 0;
    const totalReseñas = agregados[0]?.totalReseñas || 0;

    // Distribución por género usando juegos
    // Esto me dice cuántos juegos tengo de cada género
    const distribGenero = await Juego.aggregate([
      { $match: { genero: { $exists: true, $ne: '' } } }, // Solo juegos que tengan género
      { $group: { _id: '$genero', count: { $sum: 1 } } }, // Agrupo por género y cuento
      { $sort: { count: -1 } }                            // Ordeno de más a menos
    ]);

    // Devuelvo todo junto en un objeto JSON
    res.json({
      totalJuegos,
      completados,
      porcentajeCompletados: totalJuegos ? Math.round((completados / totalJuegos) * 100) : 0,
      horasTotales,
      promedioPuntuacion: Number(promedioPuntuacion.toFixed(2)), // Redondeo a 2 decimales
      totalReseñas,
      distribGenero  // Array con { _id: 'Aventura', count: 5 }, etc.
    });
  } catch (err) {
    console.error('Error obteniendo estadísticas:', err);
    res.status(500).json({ message: 'Error obteniendo estadísticas' });
  }
});

// Exporto el router para usarlo en server.js
module.exports = router;