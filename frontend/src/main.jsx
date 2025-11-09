// main.jsx - Punto de entrada de mi aplicación React
// Aquí es donde React monta mi aplicación en el DOM
// Lo hice con Vite porque es más rápido que Create React App

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';    // Importo mi componente principal
import './App.css';            // Importo los estilos globales

// Creo la raíz de React y renderizo mi componente App
// React.StrictMode me ayuda a detectar errores y malas prácticas
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);