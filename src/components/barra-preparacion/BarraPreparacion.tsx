import { Icono } from '../icono/Icono'
import './barra-preparacion.css'

type Props = {
  porcentaje: number
  lista?: boolean
  nota?: string
}

export function BarraPreparacion({ porcentaje, lista = false, nota }: Props) {
  const valor = Math.min(Math.max(Math.round(porcentaje), 0), 100)

  return (
    <section className={`barra-preparacion${lista ? ' barra-preparacion-lista' : ''}`}>
      <div className="barra-preparacion-encabezado">
        <h2 className="barra-preparacion-titulo">Preparación</h2>
        <p className="barra-preparacion-porcentaje">{valor} %</p>
      </div>

      <div
        className="barra-preparacion-pista"
        role="progressbar"
        aria-valuenow={valor}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Preparación para el examen"
      >
        <div className="barra-preparacion-relleno" style={{ width: `${valor}%` }} />
      </div>

      {lista && (
        <p className="barra-preparacion-chip">
          <Icono nombre="bandera" tamano={20} />
          Lista para el examen
        </p>
      )}

      {nota && <p className="barra-preparacion-nota">{nota}</p>}
    </section>
  )
}
