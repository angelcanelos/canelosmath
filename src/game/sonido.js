// Efectos de sonido sintetizados con Web Audio (sin archivos). El contexto se
// crea perezosamente y se reanuda con el primer gesto del usuario.

let ctx = null
let maestro = null
let activo = true

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    maestro = ctx.createGain()
    maestro.gain.value = 0.35
    maestro.connect(ctx.destination)
  }
  return ctx
}

export function desbloquear() {
  const c = audio()
  if (c && c.state === 'suspended') c.resume()
}

export const setSonidoActivo = (v) => { activo = v }

// Una nota con envolvente de ataque rápido y caída exponencial.
function nota(freq, { tipo = 'triangle', inicio = 0, dur = 0.15, vol = 0.5, hasta = null, detune = 0 } = {}) {
  if (!activo) return
  const c = audio()
  if (!c) return
  const t = c.currentTime + inicio
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = tipo
  osc.frequency.setValueAtTime(freq, t)
  osc.detune.value = detune
  if (hasta) osc.frequency.exponentialRampToValueAtTime(hasta, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.005)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(maestro)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

// Pentatónica mayor a partir de C5: el combo sube de tono como en tetr.io.
const PENTA = [0, 2, 4, 7, 9]
const semitono = (n) => 523.25 * Math.pow(2, n / 12)
const escala = (i) => semitono(PENTA[i % 5] + 12 * Math.floor(i / 5))

export function acierto(combo) {
  const f = escala(Math.min(combo - 1, 14))
  nota(f, { dur: 0.18, vol: 0.45 })
  nota(f * 2, { tipo: 'sine', dur: 0.1, vol: 0.12 })
}

export function error() {
  nota(140, { tipo: 'sawtooth', dur: 0.28, vol: 0.3, hasta: 60 })
  nota(146, { tipo: 'square', dur: 0.22, vol: 0.15, hasta: 70, detune: 20 })
}

export function rachaRota() {
  nota(392, { tipo: 'square', dur: 0.12, vol: 0.12, inicio: 0.12 })
  nota(277, { tipo: 'square', dur: 0.2, vol: 0.12, inicio: 0.24 })
}

export function hito(n) {
  const base = n >= 10 ? 7 : n >= 7 ? 5 : n >= 5 ? 3 : 0
  ;[0, 4, 7, 12].forEach((s, i) => nota(semitono(base + s), { inicio: i * 0.06, dur: 0.25, vol: 0.3 }))
}

export const tecla = () => nota(1800, { tipo: 'sine', dur: 0.03, vol: 0.06 })

export const cuenta = () => nota(660, { tipo: 'square', dur: 0.12, vol: 0.15 })

export function ya() {
  nota(1320, { tipo: 'square', dur: 0.25, vol: 0.15 })
  nota(660, { tipo: 'triangle', dur: 0.3, vol: 0.3 })
}

export function fin(perfecto) {
  const notas = perfecto ? [0, 4, 7, 12, 16, 19, 24] : [0, 4, 7, 12]
  notas.forEach((s, i) => nota(semitono(s - 12), { inicio: i * 0.07, dur: 0.35, vol: 0.28 }))
}

export function record() {
  ;[0, 7, 12, 16, 19, 24].forEach((s, i) =>
    nota(semitono(s), { tipo: i % 2 ? 'square' : 'triangle', inicio: 0.4 + i * 0.09, dur: 0.4, vol: 0.18 }),
  )
}
