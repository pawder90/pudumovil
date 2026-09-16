import type { ButtonHTMLAttributes } from 'react'
import './boton.css'

export type VarianteBoton = 'primario' | 'secundario' | 'error' | 'logro'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: VarianteBoton
  anchoCompleto?: boolean
}

export function Boton({
  variante = 'primario',
  anchoCompleto = false,
  className,
  type = 'button',
  ...resto
}: Props) {
  const clases = ['boton', `boton-${variante}`]
  if (anchoCompleto) clases.push('boton-ancho-completo')
  if (className) clases.push(className)

  return <button type={type} className={clases.join(' ')} {...resto} />
}
