import { useEffect, useRef, useState } from 'react'
import { TEMAS, aplicarTema, getTema } from '../game/temas.js'

// Selector de temas abajo a la derecha. Pasar el mouse (o las flechas) previsualiza;
// clic o Enter lo aplica; Esc o clic fuera cierra y restaura el tema actual.
export default function Temas({ temaId, onCambiar }) {
  const [abierto, setAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [resaltado, setResaltado] = useState(0)
  const caja = useRef(null)
  const lista = useRef(null)

  const filtrados = TEMAS.filter((t) => t.nombre.includes(busqueda.trim().toLowerCase()))
  const actual = getTema(temaId)

  function abrir() {
    setBusqueda('')
    setResaltado(Math.max(0, TEMAS.findIndex((t) => t.id === temaId)))
    setAbierto(true)
  }

  function cerrar() {
    aplicarTema(actual)
    setAbierto(false)
  }

  function elegir(tema) {
    aplicarTema(tema)
    onCambiar(tema.id)
    setAbierto(false)
  }

  function previsualizar(i) {
    setResaltado(i)
    if (filtrados[i]) aplicarTema(filtrados[i])
  }

  // Cerrar al hacer clic fuera del panel
  useEffect(() => {
    if (!abierto) return
    const alPulsar = (e) => {
      if (!caja.current.contains(e.target)) cerrar()
    }
    document.addEventListener('mousedown', alPulsar)
    return () => document.removeEventListener('mousedown', alPulsar)
  })

  // Mantener visible la fila resaltada al navegar con flechas
  useEffect(() => {
    lista.current?.children[resaltado]?.scrollIntoView({ block: 'nearest' })
  }, [resaltado, abierto])

  function alTeclear(e) {
    // Que el juego no reciba las teclas mientras se busca un tema
    e.stopPropagation()
    if (e.key === 'Escape') cerrar()
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const n = filtrados.length
      if (n) previsualizar((resaltado + (e.key === 'ArrowDown' ? 1 : -1) + n) % n)
    } else if (e.key === 'Enter' && filtrados[resaltado]) elegir(filtrados[resaltado])
    else if (e.key === 'Tab') e.preventDefault()
  }

  return (
    <div className="temas" ref={caja}>
      {abierto && (
        <div className="temas__panel" role="dialog" aria-label="Temas" onKeyDown={alTeclear}>
          <input
            className="temas__buscar"
            autoFocus
            placeholder="buscar tema…"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value)
              setResaltado(0)
            }}
          />
          <div className="temas__lista" ref={lista} role="listbox" onMouseLeave={() => aplicarTema(actual)}>
            {filtrados.map((t, i) => (
              <button
                key={t.id}
                role="option"
                aria-selected={t.id === temaId}
                className={'tema' + (i === resaltado ? ' tema--resaltado' : '')}
                style={{ background: t.bg, color: t.text }}
                onMouseEnter={() => previsualizar(i)}
                onClick={() => elegir(t)}
                tabIndex={-1}
              >
                <span className="tema__marca" style={{ color: t.main }}>{t.id === temaId ? '✓' : ''}</span>
                <span className="tema__nombre">{t.nombre}</span>
                <span className="tema__muestras" style={{ background: t.subAlt }}>
                  <i style={{ background: t.main }} />
                  <i style={{ background: t.sub }} />
                  <i style={{ background: t.text }} />
                </span>
              </button>
            ))}
            {filtrados.length === 0 && <div className="temas__vacio">sin resultados</div>}
          </div>
        </div>
      )}
      <button
        className="temas__btn"
        onClick={() => (abierto ? cerrar() : abrir())}
        aria-expanded={abierto}
        tabIndex={-1}
      >
        <span className="temas__icono" aria-hidden="true">◐</span> {actual.nombre}
      </button>
    </div>
  )
}
