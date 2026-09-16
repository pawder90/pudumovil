import { Icono, type NombreIcono } from '../icono/Icono'
import './barra-navegacion.css'

export type SeccionNav = 'inicio' | 'repaso' | 'simulacro' | 'progreso'

const SECCIONES: { id: SeccionNav; etiqueta: string; icono: NombreIcono }[] = [
  { id: 'inicio', etiqueta: 'Inicio', icono: 'casa' },
  { id: 'repaso', etiqueta: 'Repaso', icono: 'repetir' },
  { id: 'simulacro', etiqueta: 'Simulacro', icono: 'cronometro' },
  { id: 'progreso', etiqueta: 'Progreso', icono: 'grafico' },
]

type Props = {
  activa: SeccionNav
  onCambio: (seccion: SeccionNav) => void
  pendientesRepaso?: number
}

export function BarraNavegacion({ activa, onCambio, pendientesRepaso = 0 }: Props) {
  return (
    <nav className="barra-nav" aria-label="Secciones principales">
      {SECCIONES.map(({ id, etiqueta, icono }) => {
        const esActiva = id === activa
        const conPendientes = id === 'repaso' && pendientesRepaso > 0

        return (
          <button
            key={id}
            type="button"
            className={`barra-nav-boton${esActiva ? ' barra-nav-boton-activo' : ''}`}
            onClick={() => onCambio(id)}
            aria-current={esActiva ? 'page' : undefined}
            aria-label={
              conPendientes
                ? `${etiqueta}, ${pendientesRepaso} pendientes`
                : undefined
            }
          >
            <span className="barra-nav-icono">
              <Icono nombre={icono} tamano={24} />
              {conPendientes && (
                <span className="barra-nav-chip" aria-hidden="true">
                  {pendientesRepaso}
                </span>
              )}
            </span>
            <span className="barra-nav-etiqueta">{etiqueta}</span>
          </button>
        )
      })}
    </nav>
  )
}
