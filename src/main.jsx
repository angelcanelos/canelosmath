import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { cargarTema } from './game/storage.js'
import { aplicarTema, getTema } from './game/temas.js'
import './index.css'

// Antes del primer render, para que no parpadee el tema por defecto
aplicarTema(getTema(cargarTema()))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
