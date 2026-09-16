import type { ReactNode } from 'react'
import { useId } from 'react'
import { Boton } from '../boton/Boton'
import { Icono } from '../icono/Icono'
import './hoja-feedback.css'

export type Veredicto = 'correcto' | 'incorrecto'

export type ReferenciaLibro = {
  edicion: string
  seccion: string
  pagina: number
}

const VEREDICTO = {
  correcto: { icono: 'check', palabra: '¡Correcto!' },
  incorrecto: { icono: 'equis', palabra: 'Incorrecto' },
} as const

type Props = {
  veredicto: Veredicto
  titulo: string
  explicacion: ReactNode
  referencia?: ReferenciaLibro
  abierta: boolean
  expandida?: boolean
  onExpandir?: () => void
  onContinuar: () => void
}

export function HojaFeedback({
  veredicto,
  titulo,
  explicacion,
  referencia,
  abierta,
  expandida = false,
  onExpandir,
  onContinuar,
}: Props) {
  const idTitulo = useId()
  const { icono, palabra } = VEREDICTO[veredicto]

  const clases = [
    'hoja-feedback',
    `hoja-feedback-${veredicto}`,
    abierta ? 'hoja-feedback-abierta' : '',
    expandida ? 'hoja-feedback-expandida' : '',
  ].filter(Boolean)

  return (
    <div
      className={clases.join(' ')}
      role="dialog"
      aria-modal="true"
      aria-labelledby={idTitulo}
      aria-hidden={!abierta}
      // Fuera del orden de tabulación mientras está cerrada.
      inert={!abierta || undefined}
    >
      <span className="hoja-feedback-asa" aria-hidden="true" />

      <div className="hoja-feedback-contenido">
        <p className="hoja-feedback-veredicto">
          <Icono nombre={icono} tamano={24} />
          {palabra}
        </p>

        <h2 className="hoja-feedback-titulo" id={idTitulo}>
          {titulo}
        </h2>

        <div className="hoja-feedback-explicacion">{explicacion}</div>

        {referencia && (
          <p className="hoja-feedback-referencia">
            <Icono nombre="libro" tamano={20} />
            {referencia.edicion} · {referencia.seccion} · página {referencia.pagina}
          </p>
        )}
      </div>

      <div className="hoja-feedback-pie">
        {!expandida && onExpandir && (
          <Boton variante="secundario" anchoCompleto onClick={onExpandir}>
            Ver por qué
          </Boton>
        )}
        <Boton
          variante={veredicto === 'correcto' ? 'primario' : 'error'}
          anchoCompleto
          onClick={onContinuar}
        >
          Continuar
        </Boton>
      </div>
    </div>
  )
}
