// Grupo de botones tipo radio. `opciones` es [[valor, etiqueta], ...].
export default function Selector({ opciones, valor, onCambiar, etiqueta }) {
  return (
    <div className="modos" role="radiogroup" aria-label={etiqueta}>
      {opciones.map(([v, texto]) => (
        <button
          key={v}
          role="radio"
          aria-checked={valor === v}
          className={'modos__btn' + (valor === v ? ' activo' : '')}
          onClick={() => onCambiar(v)}
          tabIndex={-1}
        >
          {texto}
        </button>
      ))}
    </div>
  )
}
