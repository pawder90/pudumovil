import { Icono, type NombreIcono } from '../icono/Icono'
import './nodo-camino.css'

export type EstadoNodo = 'completado' | 'actual' | 'bloqueado' | 'simulacro'
export type DesplazamientoNodo = 'centro' | 'derecha' | 'izquierda'

const DETALLE: Record<EstadoNodo, { icono: NombreIcono; estado: string }> = {
  completado: { icono: 'check', estado: 'completado' },
  actual: { icono: 'flecha-arriba', estado: 'disponible ahora' },
  bloqueado: { icono: 'candado', estado: 'bloqueado' },
  simulacro: { icono: 'trofeo', estado: 'mini-simulacro' },
}

type Props = {
  estado: EstadoNodo
  etiqueta: string
  desplazamiento?: DesplazamientoNodo
  onClick?: () => void
}

export function NodoCamino({
  estado,
  etiqueta,
  desplazamiento = 'centro',
  onClick,
}: Props) {
  const { icono, estado: estadoEnPalabras } = DETALLE[estado]

  return (
    <div className={`nodo-camino-sitio nodo-camino-${desplazamiento}`}>
      <button
        type="button"
        className={`nodo-camino nodo-camino-estado-${estado}`}
        onClick={onClick}
        disabled={estado === 'bloqueado'}
        aria-label={`${etiqueta}, ${estadoEnPalabras}`}
      >
        {estado === 'actual' && <span className="nodo-camino-anillo" aria-hidden="true" />}
        <Icono nombre={icono} tamano={32} />
      </button>
      <p className="nodo-camino-etiqueta">{etiqueta}</p>
    </div>
  )
}
