import { useCallback, useState } from 'react'
import GameScreen from './components/GameScreen.jsx'
import Results from './components/Results.jsx'
import Selector from './components/Selector.jsx'
import Temas from './components/Temas.jsx'
import { DIFICULTADES, PREGUNTAS_POR_RONDA, getDificultad } from './game/dificultades.js'
import * as sonido from './game/sonido.js'
import { getTema } from './game/temas.js'
import {
  cargarDificultad,
  cargarModo,
  cargarRecords,
  cargarSonido,
  cargarTema,
  claveRecord,
  guardarDificultad,
  guardarModo,
  guardarSonido,
  guardarTema,
  registrarResultado,
} from './game/storage.js'

const OPCIONES_DIFICULTAD = DIFICULTADES.map((d) => [d.id, d.nombre])
const OPCIONES_MODO = [
  ['escribir', '⌨ escribir'],
  ['opciones', '☰ opciones'],
]

export default function App() {
  const [modo, setModo] = useState(cargarModo)
  const [dificultadId, setDificultadId] = useState(cargarDificultad)
  const [records, setRecords] = useState(cargarRecords)
  const [partida, setPartida] = useState(0) // fuerza una ronda nueva
  const [resultado, setResultado] = useState(null) // null mientras se juega
  const [conSonido, setConSonido] = useState(() => {
    const v = cargarSonido()
    sonido.setSonidoActivo(v)
    return v
  })
  // Otra ronda / reiniciar arrancan directo en la cuenta; cambiar ajustes espera una tecla
  const [autoInicio, setAutoInicio] = useState(false)
  const [temaId, setTemaId] = useState(() => getTema(cargarTema()).id)

  const dificultad = getDificultad(dificultadId)

  const nuevaRonda = useCallback((auto) => {
    setAutoInicio(auto)
    setResultado(null)
    setPartida((p) => p + 1)
  }, [])
  const otraRonda = useCallback(() => nuevaRonda(true), [nuevaRonda])

  const cambiarModo = (m) => {
    setModo(m)
    guardarModo(m)
    nuevaRonda(false)
  }

  const cambiarDificultad = (id) => {
    setDificultadId(id)
    guardarDificultad(id)
    nuevaRonda(false)
  }

  const cambiarTema = (id) => {
    setTemaId(id)
    guardarTema(id)
  }

  const alternarSonido = () => {
    const v = !conSonido
    setConSonido(v)
    sonido.setSonidoActivo(v)
    guardarSonido(v)
  }

  const terminar = useCallback(
    (preguntas) => {
      const aciertos = preguntas.filter((p) => p.correcta).length
      const totalMs = preguntas.reduce((s, p) => s + p.ms, 0)
      const promedioMs = totalMs / preguntas.length
      const r = registrarResultado(records, modo, dificultad.id, aciertos, promedioMs)
      sonido.fin(aciertos === PREGUNTAS_POR_RONDA)
      if (r.nuevoRecord) sonido.record()
      setRecords(r.records)
      setResultado({ aciertos, promedioMs, totalMs, preguntas, nuevoRecord: r.nuevoRecord })
    },
    [records, modo, dificultad],
  )

  return (
    <main className="app">
      <header className="cabecera">
        <div className="logo">
          <span className="logo__icono">±</span>
          <span>canelos<span className="acento">math</span></span>
        </div>
        <div className="cabecera__der">
          <Selector etiqueta="Dificultad" opciones={OPCIONES_DIFICULTAD} valor={dificultad.id} onCambiar={cambiarDificultad} />
          <Selector etiqueta="Modo de respuesta" opciones={OPCIONES_MODO} valor={modo} onCambiar={cambiarModo} />
          <div className="modos">
            <button
              className={'modos__btn' + (conSonido ? ' activo' : '')}
              onClick={alternarSonido}
              aria-pressed={conSonido}
              aria-label="Sonido"
              tabIndex={-1}
            >
              {conSonido ? '🔊' : '🔇'}
            </button>
          </div>
        </div>
      </header>

      {resultado ? (
        <Results
          dificultad={dificultad}
          modo={modo}
          resultado={resultado}
          record={records[claveRecord(modo, dificultad.id)]}
          onNuevaRonda={otraRonda}
        />
      ) : (
        <GameScreen
          key={partida}
          dificultad={dificultad}
          modo={modo}
          autoInicio={autoInicio}
          onTerminar={terminar}
          onReiniciar={nuevaRonda}
        />
      )}

      <Temas temaId={temaId} onCambiar={cambiarTema} />
    </main>
  )
}
