import { useEffect, useState } from 'react'
import { MIN_ACIERTOS_RECORD, PREGUNTAS_POR_RONDA } from '../game/dificultades.js'
import Grafica from './Grafica.jsx'

const seg = (ms) => (ms / 1000).toFixed(1) + 's'

// Cuenta desde 0 hasta `valor` con una curva que frena al final.
function useContador(valor, duracion = 700) {
  const [actual, setActual] = useState(0)
  useEffect(() => {
    const inicio = performance.now()
    let id
    const tick = () => {
      const t = Math.min(1, (performance.now() - inicio) / duracion)
      setActual(Math.round(valor * (1 - Math.pow(1 - t, 3))))
      if (t < 1) id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [valor, duracion])
  return actual
}

function rachaMaxima(preguntas) {
  let max = 0
  let actual = 0
  for (const p of preguntas) {
    actual = p.correcta ? actual + 1 : 0
    max = Math.max(max, actual)
  }
  return max
}

export default function Results({ dificultad, modo, resultado, record, onNuevaRonda }) {
  const { aciertos, promedioMs, totalMs, preguntas, nuevoRecord } = resultado
  const opsMin = totalMs > 0 ? Math.round((aciertos / totalMs) * 60000) : 0
  const precision = Math.round((aciertos / PREGUNTAS_POR_RONDA) * 100)
  const tiempos = preguntas.map((p) => p.ms)
  const opsMinAnimado = useContador(opsMin)
  const precisionAnimada = useContador(precision)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        onNuevaRonda()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onNuevaRonda])

  const chicos = [
    ['aciertos', `${aciertos}/${PREGUNTAS_POR_RONDA}`],
    ['tiempo', seg(totalMs)],
    ['promedio', seg(promedioMs)],
    ['racha máx', `×${rachaMaxima(preguntas)}`],
    ['más rápida', seg(Math.min(...tiempos))],
    ['más lenta', seg(Math.max(...tiempos))],
    ['récord', record != null ? seg(record) : '—'],
    ['dificultad', dificultad.nombre],
    ['modo', modo],
  ]

  return (
    <div className="resultados">
      <div className="resultados__cuerpo">
        <div className="grandes">
          <div className="stat">
            <span className="stat__etq">ops/min</span>
            <span className="stat__valor">{opsMinAnimado}</span>
          </div>
          <div className="stat">
            <span className="stat__etq">prec</span>
            <span className="stat__valor">{precisionAnimada}%</span>
          </div>
        </div>

        <div className="chicos">
          {chicos.map(([etq, valor], i) => (
            <div key={etq} className="stat stat--entra" style={{ animationDelay: `${i * 40}ms` }}>
              <span className="stat__etq">{etq}</span>
              <span className="stat__chico">{valor}</span>
            </div>
          ))}
        </div>
      </div>

      <Grafica preguntas={preguntas} />

      <div className="resultados__nota">
        {nuevoRecord && <span className="acento nuevo-record">nuevo récord de velocidad</span>}
        {!nuevoRecord && aciertos < MIN_ACIERTOS_RECORD &&
          `necesitas ${MIN_ACIERTOS_RECORD} aciertos para que el promedio cuente como récord`}
        {!nuevoRecord && aciertos === PREGUNTAS_POR_RONDA && <span className="acento perfecto">perfecto</span>}
      </div>

      <div className="resultados__botones">
        <button className="btn-icono-texto" onClick={onNuevaRonda}>↻ otra ronda</button>
      </div>

      <footer className="pie">
        <span><kbd>enter</kbd> / <kbd>tab</kbd> otra ronda</span>
      </footer>
    </div>
  )
}
