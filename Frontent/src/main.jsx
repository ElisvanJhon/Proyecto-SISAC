import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthenticatedAppRoutes from './routes/AuthenticatedAppRoutes.jsx';
import './styles/global.css'; // Importa tus estilos globales

console.log('🚀 Aplicación iniciando...');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthenticatedAppRoutes />
  </React.StrictMode>
);
