import { useEffect, useRef, useState } from 'react'
import { generarRonda } from '../game/generator.js'
import { PREGUNTAS_POR_RONDA } from '../game/dificultades.js'
import * as sonido from '../game/sonido.js'

const TECLAS = { '1': 0, '2': 1, '3': 2, ArrowLeft: 0, ArrowDown: 1, ArrowRight: 2 }
const HITOS = [3, 5, 7, 10]
const PASO_CUENTA_MS = 600

function Signo({ op }) {
  return op === '-'
    ? <span className="operacion__op operacion__op--resta">−</span>
    : <span className="operacion__op operacion__op--suma">+</span>
}

// Cronómetro ascendente: `baseMs` acumulado más lo que lleva la pregunta actual.
function Cronometro({ baseMs, desde, corriendo }) {
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!corriendo) return
    let id
    const tick = () => {
      setTick((t) => t + 1)
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [corriendo])
  const ms = baseMs + (corriendo ? performance.now() - desde.current : 0)
  return <span className="juego__reloj">{(ms / 1000).toFixed(1)}s</span>
}

// Partículas que salen del resultado al acertar; más cuanto mayor es la racha.
function crearChispas(combo) {
  const n = 6 + Math.min(combo, 10)
  return Array.from({ length: n }, (_, i) => {
    const ang = (i / n) * Math.PI * 2 + Math.random() * 0.6
    const dist = 50 + Math.random() * 40 + combo * 4
    return { dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist, d: Math.random() * 80 }
  })
}

const tramoCombo = (c) => (c >= 8 ? 3 : c >= 5 ? 2 : 1)

export default function GameScreen({ dificultad, modo, autoInicio, onTerminar, onReiniciar }) {
  const escribir = modo === 'escribir'
  const [ronda] = useState(() => generarRonda(dificultad))
  const [fase, setFase] = useState(autoInicio ? 'cuenta' : 'espera') // espera → cuenta → jugando
  const [paso, setPaso] = useState(null) // 3, 2, 1, 0 (¡ya!) durante la cuenta regresiva
  const [indice, setIndice] = useState(0)
  const [feedback, setFeedback] = useState(null) // { elegida, correcta, rota, hito }
  const [resultados, setResultados] = useState([]) // [{ a, b, op, respuesta, elegida, correcta, ms }]
  const [texto, setTexto] = useState('')
  const [combo, setCombo] = useState(0)
  const [chispas, setChispas] = useState([])
  const [banner, setBanner] = useState(null) // { texto, id }
  const inputRef = useRef(null)
  const inicioPregunta = useRef(0)

  const pregunta = ronda[indice]
  const jugando = fase === 'jugando' && !feedback

  function empezar() {
    if (fase !== 'espera') return
    sonido.desbloquear()
    setFase('cuenta')
  }

  function mostrarBanner(texto) {
    setBanner((b) => ({ texto, id: (b?.id ?? 0) + 1 }))
  }

  function responder(valor) {
    if (!jugando) return
    const ms = performance.now() - inicioPregunta.current
    const correcta = valor === pregunta.respuesta
    const nuevoCombo = correcta ? combo + 1 : 0
    const hito = correcta && HITOS.includes(nuevoCombo)
    const rota = !correcta && combo >= 3

    if (correcta) {
      sonido.acierto(nuevoCombo)
      setChispas(crearChispas(nuevoCombo))
      if (hito) {
        sonido.hito(nuevoCombo)
        mostrarBanner(`¡racha ×${nuevoCombo}!`)
      }
    } else {
      sonido.error()
      if (rota) sonido.rachaRota()
    }

    const total = [...resultados, { ...pregunta, elegida: valor, correcta, ms }]
    if (total.length === PREGUNTAS_POR_RONDA && total.every((r) => r.correcta)) mostrarBanner('¡perfecto!')

    setCombo(nuevoCombo)
    setFeedback({ elegida: valor, correcta, rota, hito })
    setResultados(total)
  }

  // Modo escribir: se califica solo en cuanto lo tecleado es el resultado
  // o deja de poder serlo (no coincide con su inicio).
  function alEscribir(e) {
    if (!jugando) return
    const respuesta = String(pregunta.respuesta)
    const limpio = e.target.value.replace(/\D/g, '').slice(0, respuesta.length + 1)
    if (limpio === respuesta || !respuesta.startsWith(limpio)) {
      setTexto(limpio)
      return responder(Number(limpio))
    }
    if (limpio.length > texto.length) sonido.tecla()
    setTexto(limpio)
  }

  function alTeclearEnInput(e) {
    if (e.key === 'Enter' && texto !== '') {
      e.preventDefault()
      responder(Number(texto))
    }
  }

  // Cuenta regresiva 3 · 2 · 1 · ¡ya!
  useEffect(() => {
    if (fase !== 'cuenta') return
    const ids = [3, 2, 1].map((n, i) =>
      setTimeout(() => {
        setPaso(n)
        sonido.cuenta()
      }, i * PASO_CUENTA_MS),
    )
    ids.push(
      setTimeout(() => {
        setPaso(0)
        sonido.ya()
        inicioPregunta.current = performance.now()
        setFase('jugando')
      }, 3 * PASO_CUENTA_MS),
    )
    return () => ids.forEach(clearTimeout)
  }, [fase])

  // Oculta el "¡ya!" poco después de empezar
  useEffect(() => {
    if (paso !== 0) return
    const id = setTimeout(() => setPaso(null), 500)
    return () => clearTimeout(id)
  }, [paso])

  // Mantener el foco en el input mientras se juega en modo escribir
  useEffect(() => {
    if (escribir && jugando) inputRef.current?.focus()
  }, [escribir, jugando])

  // Tras el feedback, pasa a la siguiente pregunta o termina la ronda
  useEffect(() => {
    if (!feedback) return
    const ultima = indice + 1 >= PREGUNTAS_POR_RONDA
    const perfecta = ultima && resultados.every((r) => r.correcta)
    const espera = perfecta ? 1400 : feedback.correcta ? 350 : 1100
    const id = setTimeout(() => {
      if (!ultima) {
        setIndice((i) => i + 1)
        setTexto('')
        setFeedback(null)
        inicioPregunta.current = performance.now()
      } else {
        onTerminar(resultados)
      }
    }, espera)
    return () => clearTimeout(id)
  }, [feedback, indice, resultados, onTerminar])

  const responderRef = useRef(responder)
  const empezarRef = useRef(empezar)
  const indiceRef = useRef(indice)
  useEffect(() => {
    responderRef.current = responder
    empezarRef.current = empezar
    indiceRef.current = indice
  })

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        return onReiniciar(fase !== 'espera')
      }
      if (fase === 'espera') {
        if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return
        e.preventDefault()
        return empezarRef.current()
      }
      if (!escribir && e.key in TECLAS && !e.repeat) {
        e.preventDefault()
        responderRef.current(ronda[indiceRef.current].opciones[TECLAS[e.key]])
      } else if (escribir && /^\d$/.test(e.key) && document.activeElement !== inputRef.current) {
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onReiniciar, ronda, escribir, fase])

  const aciertos = resultados.filter((r) => r.correcta).length
  const acumuladoMs = resultados.reduce((s, r) => s + r.ms, 0)
  const error = feedback && !feedback.correcta

  const claseOpcion = (o) => {
    if (!feedback) return 'opcion'
    if (o === pregunta.respuesta) return 'opcion opcion--correcta'
    if (o === feedback.elegida) return 'opcion opcion--incorrecta'
    return 'opcion opcion--apagada'
  }

  function resultadoVisible() {
    if (feedback) {
      if (escribir && !feedback.correcta) {
        return (
          <>
            <s className="tachado">{feedback.elegida}</s> {pregunta.respuesta}
          </>
        )
      }
      return pregunta.respuesta
    }
    if (!escribir) return '?'
    return (
      <>
        {texto}
        <span className="caret" />
        {texto === '' && <span className="fantasma">?</span>}
      </>
    )
  }

  function alHacerClic() {
    if (fase === 'espera') empezar()
    else if (escribir) inputRef.current?.focus()
  }

  return (
    <>
      {/* Fuera de .juego: el sacudón (transform) recortaría el overlay fijo */}
      {error && <div className="destello" />}
      <div
        className={'juego' + (fase !== 'jugando' ? ' juego--espera' : '') + (error ? ' juego--golpe' : '')}
        onClick={alHacerClic}
      >
        <header className="juego__barra">
          <span className="juego__contador">{Math.min(indice + 1, PREGUNTAS_POR_RONDA)}/{PREGUNTAS_POR_RONDA}</span>
          <Cronometro baseMs={acumuladoMs} desde={inicioPregunta} corriendo={jugando} />
          <span className="juego__nivel">{dificultad.nombre}</span>
          <span className="juego__aciertos">{aciertos} ✓</span>
        </header>

        <div className="progreso">
          {ronda.map((_, i) => (
            <span
              key={i}
              className={
                'progreso__punto' +
                (i < resultados.length ? (resultados[i].correcta ? ' bien' : ' mal') : '') +
                (i === indice ? ' actual' : '')
              }
            />
          ))}
        </div>

        <div className="zona">
          <div className="marcador-combo">
            {combo >= 2 && (
              <span key={combo} className={`combo combo--t${tramoCombo(combo)}`}>
                <span className="combo__etq">combo</span> ×{combo}
              </span>
            )}
            {feedback?.rota && <span className="rota">racha rota</span>}
          </div>

          <div
            key={indice}
            className={
              'operacion' +
              (error ? ' operacion--error' : '') +
              (feedback?.correcta ? ' operacion--bien' : '') +
              (feedback?.hito ? ' operacion--hito' : '')
            }
          >
            <span>{pregunta.a}</span>
            <Signo op={pregunta.op} />
            <span>{pregunta.b}</span>
            <span className="operacion__op">=</span>
            <span className="operacion__resultado">
              {resultadoVisible()}
              {feedback?.correcta && (
                <span className="chispas" aria-hidden="true">
                  {chispas.map((c, i) => (
                    <span
                      key={i}
                      className="chispa"
                      style={{ '--dx': `${c.dx}px`, '--dy': `${c.dy}px`, animationDelay: `${c.d}ms` }}
                    />
                  ))}
                </span>
              )}
            </span>
          </div>

          <div className="mensaje">
            {fase === 'espera' && 'presiona cualquier tecla para empezar'}
            {error && 'incorrecto'}
          </div>

          {paso !== null && (
            <div key={paso} className={'cuenta' + (paso === 0 ? ' cuenta--ya' : '')} aria-live="assertive">
              {paso === 0 ? '¡ya!' : paso}
            </div>
          )}

          {banner && (
            <div key={banner.id} className="banner" onAnimationEnd={() => setBanner(null)}>
              {banner.texto}
            </div>
          )}

          {escribir ? (
            <input
              ref={inputRef}
              className="entrada-oculta"
              value={texto}
              onChange={alEscribir}
              onKeyDown={alTeclearEnInput}
              inputMode="numeric"
              autoComplete="off"
              aria-label="Escribe el resultado"
            />
          ) : (
            <div className="opciones">
              {pregunta.opciones.map((o, i) => (
                <button key={i} className={claseOpcion(o)} onClick={() => responder(o)} disabled={!jugando} tabIndex={-1}>
                  <span className="opcion__tecla">{i + 1}</span>
                  {o}
                </button>
              ))}
            </div>
          )}
        </div>

        <footer className="pie">
          {escribir ? (
            <span><kbd>0-9</kbd> escribir · <kbd>enter</kbd> enviar</span>
          ) : (
            <span><kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> responder</span>
          )}
          <span><kbd>tab</kbd> reiniciar</span>
        </footer>
      </div>
    </>
  )
}
