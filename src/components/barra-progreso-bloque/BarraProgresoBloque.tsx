import { Icono } from '../icono/Icono'
import './barra-progreso-bloque.css'

type Props = {
  actual: number
  total: number
  onCerrar?: () => void
}

export function BarraProgresoBloque({ actual, total, onCerrar }: Props) {
  const avance = total > 0 ? Math.min(Math.max(actual / total, 0), 1) : 0

  return (
    <div className="progreso-bloque">
      {onCerrar && (
        <button
          type="button"
          className="progreso-bloque-cerrar"
          onClick={onCerrar}
          aria-label="Salir de la lección"
        >
          <Icono nombre="equis" tamano={24} />
        </button>
      )}
      <div
        className="progreso-bloque-pista"
        role="progressbar"
        aria-valuenow={actual}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Avance del bloque"
      >
        <div
          className="progreso-bloque-relleno"
          style={{ transform: `scaleX(${avance})` }}
        />
      </div>
      <p className="progreso-bloque-cuenta">
        {actual} de {total}
      </p>
    </div>
  )
}
