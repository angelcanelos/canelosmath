import { DIFICULTADES, MIN_ACIERTOS_RECORD } from './dificultades.js'

const CLAVE_RECORDS = 'calculo-rapido:records'
const CLAVE_MODO = 'calculo-rapido:modo'
const CLAVE_DIFICULTAD = 'calculo-rapido:dificultad'
const CLAVE_SONIDO = 'calculo-rapido:sonido'
const CLAVE_TEMA = 'calculo-rapido:tema'

export const MODOS = ['escribir', 'opciones']

function leer(clave) {
  try {
    return localStorage.getItem(clave)
  } catch {
    return null
  }
}

function escribir(clave, valor) {
  try {
    localStorage.setItem(clave, valor)
  } catch {
    // sin almacenamiento disponible: solo vale para esta sesión
  }
}

export function cargarModo() {
  const m = leer(CLAVE_MODO)
  return MODOS.includes(m) ? m : 'escribir'
}

export const guardarModo = (modo) => escribir(CLAVE_MODO, modo)

export function cargarDificultad() {
  const d = leer(CLAVE_DIFICULTAD)
  return DIFICULTADES.some((x) => x.id === d) ? d : DIFICULTADES[0].id
}

export const guardarDificultad = (id) => escribir(CLAVE_DIFICULTAD, id)

export const cargarSonido = () => leer(CLAVE_SONIDO) !== 'off'
export const guardarSonido = (activo) => escribir(CLAVE_SONIDO, activo ? 'on' : 'off')

export const cargarTema = () => leer(CLAVE_TEMA)
export const guardarTema = (id) => escribir(CLAVE_TEMA, id)

// Récords: { "modo:dificultad": mejorPromedioMs }
export const claveRecord = (modo, dificultad) => `${modo}:${dificultad}`

export function cargarRecords() {
  try {
    const r = JSON.parse(leer(CLAVE_RECORDS))
    return r && typeof r === 'object' ? r : {}
  } catch {
    return {}
  }
}

// Devuelve { records, nuevoRecord }; solo mejora, nunca empeora lo guardado.
export function registrarResultado(records, modo, dificultad, aciertos, promedioMs) {
  const clave = claveRecord(modo, dificultad)
  const previo = records[clave]
  if (aciertos < MIN_ACIERTOS_RECORD || (previo != null && promedioMs >= previo)) {
    return { records, nuevoRecord: false }
  }
  const nuevo = { ...records, [clave]: promedioMs }
  escribir(CLAVE_RECORDS, JSON.stringify(nuevo))
  return { records: nuevo, nuevoRecord: previo != null }
}
