import { PREGUNTAS_POR_RONDA } from './dificultades.js'

const resolver = ({ a, b, op }) => (op === '+' ? a + b : a - b)

function barajar(arr) {
  const r = [...arr]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = r[i]
    r[i] = r[j]
    r[j] = tmp
  }
  return r
}

// Desplazamientos que simulan errores típicos. A partir de 20 se usan múltiplos
// de 10 para que las opciones compartan la última cifra y no se pueda adivinar.
function desplazamientos(respuesta) {
  if (respuesta < 20) return [1, -1, 2, -2, 10, -10]
  if (respuesta < 100) return [10, -10, 20, -20]
  if (respuesta < 1000) return [10, -10, 100, -100, 110, -110, 90, -90]
  return [10, -10, 100, -100, 1000, -1000, 110, -110, 1100, -1100]
}

export function generarDistractores(respuesta) {
  const largo = String(respuesta).length
  const candidatos = barajar(desplazamientos(respuesta))
    .map((d) => respuesta + d)
    .filter((n) => n >= 0 && n !== respuesta)

  const elegidos = []
  // Primero los que tienen la misma cantidad de cifras, luego cualquiera válido.
  for (const n of [...candidatos.filter((n) => String(n).length === largo), ...candidatos]) {
    if (!elegidos.includes(n)) elegidos.push(n)
    if (elegidos.length === 2) return elegidos
  }
  for (let k = 1; elegidos.length < 2; k++) {
    if (!elegidos.includes(respuesta + k)) elegidos.push(respuesta + k)
  }
  return elegidos
}

export function generarPregunta(dificultad) {
  const op = dificultad.gen()
  const respuesta = resolver(op)
  return { ...op, respuesta, opciones: barajar([respuesta, ...generarDistractores(respuesta)]) }
}

// Genera una ronda sin operaciones repetidas (cuando la dificultad lo permite).
export function generarRonda(dificultad, cantidad = PREGUNTAS_POR_RONDA) {
  const ronda = []
  const vistas = new Set()
  let intentos = 0
  while (ronda.length < cantidad) {
    const p = generarPregunta(dificultad)
    const clave = `${p.a}${p.op}${p.b}`
    if (!vistas.has(clave) || intentos++ > 200) {
      vistas.add(clave)
      ronda.push(p)
    }
  }
  return ronda
}
