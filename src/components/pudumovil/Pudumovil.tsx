import './pudumovil.css'

export type EstadoPudumovil = 'neutral' | 'explicando' | 'celebrando' | 'animando'

// Provisorio: SVG planos. Se reemplazan por los WebP 3D cambiando solo esta extensión.
const EXTENSION = 'svg'

const DESCRIPCION: Record<EstadoPudumovil, string> = {
  neutral: 'Pudumóvil de pie, tranquilo',
  explicando: 'Pudumóvil explicando, con una pezuña levantada',
  celebrando: 'Pudumóvil celebrando, saltando con los brazos arriba',
  animando: 'Pudumóvil animándote a seguir',
}

type Props = {
  estado: EstadoPudumovil
  tamano?: number
  /** Lo refleja para que siempre mire hacia el contenido. */
  reflejado?: boolean
  /** Pasa una cadena vacía cuando acompaña a un texto que ya dice lo mismo. */
  alt?: string
}

export function Pudumovil({ estado, tamano = 120, reflejado = false, alt }: Props) {
  return (
    <img
      className={`pudumovil${reflejado ? ' pudumovil-reflejado' : ''}`}
      src={`/pudumovil/pudumovil-${estado}.${EXTENSION}`}
      alt={alt ?? DESCRIPCION[estado]}
      width={tamano}
      height={tamano}
    />
  )
}
