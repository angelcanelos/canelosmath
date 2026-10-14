// Dificultades seleccionables. Cada `gen` devuelve { a, b, op }.

export const PREGUNTAS_POR_RONDA = 10

export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const digitos = (n) => String(n).split('').reverse().map(Number)

// ¿Alguna columna suma 10 o más? (hay que "llevar")
export function llevaAlgo(a, b) {
  const da = digitos(a)
  const db = digitos(b)
  for (let i = 0; i < Math.max(da.length, db.length); i++) {
    if ((da[i] ?? 0) + (db[i] ?? 0) >= 10) return true
  }
  return false
}

// ¿Alguna columna requiere pedir prestado? (a >= b)
export function pidePrestado(a, b) {
  const da = digitos(a)
  const db = digitos(b)
  for (let i = 0; i < db.length; i++) {
    if ((da[i] ?? 0) < db[i]) return true
  }
  return false
}

const suma = (a, b) => ({ a, b, op: '+' })
const resta = (a, b) => (a >= b ? { a, b, op: '-' } : { a: b, b: a, op: '-' })
const unoDe = (...gens) => gens[rand(0, gens.length - 1)]()

// Repite `gen` hasta que la operación cumpla `valida`.
const con = (gen, valida) => () => {
  let op
  do op = gen()
  while (!valida(op))
  return op
}

// Fácil
const suma1d = () => suma(rand(1, 9), rand(1, 9))
const resta1d = () => {
  const b = rand(1, 9)
  return resta(rand(b, b + 9), b)
}

// Media
const suma2d1d = () => suma(rand(10, 99), rand(2, 9))
const resta2d1d = () => resta(rand(11, 99), rand(2, 9))
const suma2dSinLlevar = con(() => suma(rand(10, 89), rand(10, 89)), ({ a, b }) => !llevaAlgo(a, b))
const resta2dSinPrestar = con(() => resta(rand(20, 99), rand(10, 98)), ({ a, b }) => !pidePrestado(a, b))

// Difícil
const suma2dLlevando = con(() => suma(rand(11, 99), rand(11, 99)), ({ a, b }) => llevaAlgo(a, b))
const resta2dPrestando = con(() => resta(rand(20, 99), rand(11, 98)), ({ a, b }) => a !== b && pidePrestado(a, b))
const suma3d2d = () => suma(rand(100, 999), rand(11, 99))
const resta3d2d = () => resta(rand(100, 999), rand(11, 99))

// Experto
const suma3d = () => suma(rand(100, 999), rand(100, 999))
const resta3d = () => {
  const a = rand(200, 999)
  return resta(a, rand(100, a - 1))
}
const sumaMiles = () => suma(rand(100, 499) * 10, rand(100, 499) * 10)
const restaMiles = () => {
  const a = rand(200, 999)
  return resta(a * 10, rand(100, a - 1) * 10)
}

export const DIFICULTADES = [
  { id: 'facil', nombre: 'fácil', ejemplo: '7 + 8',
    gen: () => unoDe(suma1d, resta1d) },
  { id: 'media', nombre: 'media', ejemplo: '47 + 8',
    gen: () => unoDe(suma2d1d, resta2d1d, suma2dSinLlevar, resta2dSinPrestar) },
  { id: 'dificil', nombre: 'difícil', ejemplo: '82 − 47',
    gen: () => unoDe(suma2dLlevando, resta2dPrestando, suma3d2d, resta3d2d) },
  { id: 'experto', nombre: 'experto', ejemplo: '615 − 278',
    gen: () => unoDe(suma3d, resta3d, sumaMiles, restaMiles) },
]

export const getDificultad = (id) => DIFICULTADES.find((d) => d.id === id) ?? DIFICULTADES[0]

// Mínimo de aciertos para que el promedio cuente como récord.
export const MIN_ACIERTOS_RECORD = 7
