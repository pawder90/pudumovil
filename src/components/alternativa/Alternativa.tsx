import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icono, type NombreIcono } from '../icono/Icono'
import './alternativa.css'

export type EstadoAlternativa = 'reposo' | 'seleccionada' | 'correcta' | 'incorrecta'

// Nunca solo color: cada estado con resultado lleva ícono y una palabra que lo nombra.
const MARCA_DE_ESTADO: Partial<Record<EstadoAlternativa, { icono: NombreIcono; texto: string }>> = {
  correcta: { icono: 'check', texto: 'Correcta' },
  incorrecta: { icono: 'equis', texto: 'Incorrecta' },
}

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  letra: string
  estado?: EstadoAlternativa
  children: ReactNode
}

export function Alternativa({
  letra,
  estado = 'reposo',
  children,
  className,
  type = 'button',
  ...resto
}: Props) {
  const marca = MARCA_DE_ESTADO[estado]
  const clases = ['alternativa', `alternativa-${estado}`]
  if (className) clases.push(className)

  return (
    <button
      type={type}
      className={clases.join(' ')}
      aria-pressed={estado === 'seleccionada'}
      {...resto}
    >
      <span className="alternativa-letra" aria-hidden="true">
        {letra}
      </span>
      <span className="alternativa-texto">{children}</span>
      {marca && (
        <>
          <span className="alternativa-marca">
            <Icono nombre={marca.icono} tamano={24} />
          </span>
          <span className="alternativa-resultado">{marca.texto}</span>
        </>
      )}
    </button>
  )
}
