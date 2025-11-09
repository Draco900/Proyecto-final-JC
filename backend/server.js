// Aquí configuro todo: Express, MongoDB, CORS, las rutas y arranco el servidor
// Lo hice lo más limpio posible para que sea fácil de entender

require('dotenv').config();  // Para usar variables de entorno (como la URI de MongoDB)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Para que el frontend pueda llamar a mi API sin problemas

const app = express();
const PORT = process.env.PORT || 5000;  // Puerto del servidor (5000 por defecto)

// Middleware - Esto se ejecuta antes de llegar a mis rutas
app.use(cors({
  origin: 'http://localhost:5173',  // Permito peticiones solo desde mi frontend (Vite)
  credentials: true                 // Para poder enviar cookies si las necesito
}));
app.use(express.json());  // Para poder recibir JSON en el body de las peticiones

// Conectar a MongoDB
// Uso la URI que tengo en mi archivo .env (no la subo a GitHub por seguridad)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Rutas de mi API
// Cada archivo de rutas maneja una parte diferente de mi aplicación
app.use('/api/juegos', require('./routes/juegos'));    // Todo lo de juegos
app.use('/api/reseñas', require('./routes/reseñas'));  // Todo lo de reseñas (con acento)
// Alias sin acento para evitar problemas de encoding en algunas plataformas
app.use('/api/resenas', require('./routes/reseñas'));  // Mismo router, otra ruta
app.use('/api/stats', require('./routes/stats'));      // Estadísticas y datos chulos

// Ruta de prueba - Para ver si el servidor está vivo
// La uso mucho cuando estoy desarrollando para asegurarme de que todo funciona
app.get('/', (req, res) => {
  res.json({ message: 'API GameTracker funcionando' });
});

// Arranco el servidor
// El console.log me ayuda a saber que todo está listo
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});