import { useEffect, useRef, useState } from 'react'

// Gráfica tipo monkeytype: tiempo por operación, promedio acumulado y errores.
const M = { arriba: 12, der: 12, abajo: 26, izq: 40 }

const seg = (ms) => (ms / 1000).toFixed(1) + 's'
const signo = (op) => (op === '-' ? '−' : '+')

// Escala "bonita" para el eje Y: 1, 2 o 5 × 10^n por división.
function pasoBonito(max, divisiones) {
  const bruto = max / divisiones
  const mag = Math.pow(10, Math.floor(Math.log10(bruto)))
  const n = bruto / mag
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * mag
}

export default function Grafica({ preguntas }) {
  const [activa, setActiva] = useState(null)
  const lienzo = useRef(null)
  // El viewBox sigue el ancho real para que el texto no se encoja en móvil
  const [W, setW] = useState(600)
  const H = W < 500 ? 180 : 220
  useEffect(() => {
    const obs = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))))
    obs.observe(lienzo.current)
    return () => obs.disconnect()
  }, [])

  const tiempos = preguntas.map((p) => p.ms / 1000)
  const promedios = tiempos.map((_, i) => tiempos.slice(0, i + 1).reduce((a, b) => a + b, 0) / (i + 1))
  const paso = pasoBonito(Math.max(...tiempos, 0.5), 4)
  const maxY = Math.ceil(Math.max(...tiempos, 0.5) / paso) * paso
  const guias = Array.from({ length: Math.round(maxY / paso) + 1 }, (_, i) => i * paso)

  const anchoUtil = W - M.izq - M.der
  const altoUtil = H - M.arriba - M.abajo
  const x = (i) => M.izq + (preguntas.length === 1 ? anchoUtil / 2 : (i / (preguntas.length - 1)) * anchoUtil)
  const y = (v) => M.arriba + altoUtil - (v / maxY) * altoUtil
  const linea = (vals) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

  const p = activa != null ? preguntas[activa] : null

  return (
    <figure className="grafica">
      <div className="grafica__leyenda">
        <span><i className="grafica__muestra" /> tiempo por operación</span>
        <span><i className="grafica__muestra grafica__muestra--prom" /> promedio</span>
        <span><i className="grafica__muestra grafica__muestra--error">✕</i> error</span>
      </div>

      <div ref={lienzo} className="grafica__lienzo" onMouseLeave={() => setActiva(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Tiempo por operación en segundos">
          {guias.map((g) => (
            <g key={g}>
              <line className="grafica__guia" x1={M.izq} x2={W - M.der} y1={y(g)} y2={y(g)} />
              <text className="grafica__eje" x={M.izq - 8} y={y(g)} textAnchor="end" dominantBaseline="middle">
                {Number(g.toFixed(1))}s
              </text>
            </g>
          ))}
          {preguntas.map((_, i) => (
            <text key={i} className="grafica__eje" x={x(i)} y={H - 6} textAnchor="middle">{i + 1}</text>
          ))}

          {activa != null && (
            <line className="grafica__cruz" x1={x(activa)} x2={x(activa)} y1={M.arriba} y2={M.arriba + altoUtil} />
          )}

          <path className="grafica__promedio" d={linea(promedios)} pathLength="1" />
          <path className="grafica__linea" d={linea(tiempos)} pathLength="1" />

          {preguntas.map((q, i) =>
            q.correcta ? (
              <circle
                key={i}
                className={'grafica__punto' + (activa === i ? ' activo' : '')}
                cx={x(i)} cy={y(tiempos[i])} r={activa === i ? 6 : 4}
                style={{ animationDelay: `${300 + i * 60}ms` }}
              />
            ) : (
              <g key={i} className="grafica__error" style={{ animationDelay: `${300 + i * 60}ms` }}
                transform={`translate(${x(i)},${y(tiempos[i])})`}>
                <path d="M-5,-5 L5,5 M5,-5 L-5,5" />
              </g>
            ),
          )}

          {/* Zonas de hover más anchas que las marcas */}
          {preguntas.map((_, i) => (
            <rect
              key={i}
              className="grafica__zona"
              x={x(i) - anchoUtil / (2 * Math.max(preguntas.length - 1, 1))}
              y={0}
              width={anchoUtil / Math.max(preguntas.length - 1, 1)}
              height={H}
              onMouseEnter={() => setActiva(i)}
              onClick={() => setActiva(i)}
            />
          ))}
        </svg>

        {p && (
          <div
            className="grafica__tooltip"
            style={{
              left: `${(x(activa) / W) * 100}%`,
              top: `${(y(tiempos[activa]) / H) * 100}%`,
              transform: `translate(${activa > preguntas.length / 2 ? 'calc(-100% - 12px)' : '12px'}, -50%)`,
            }}
          >
            <div className="grafica__tooltip-op">
              {p.a} {signo(p.op)} {p.b} = <span className="acento">{p.respuesta}</span>
              {!p.correcta && <> <s className="tachado">{p.elegida}</s></>}
            </div>
            <div className="grafica__tooltip-dato">
              #{activa + 1} · {seg(p.ms)} · prom {promedios[activa].toFixed(1)}s
            </div>
          </div>
        )}
      </div>
    </figure>
  )
}
