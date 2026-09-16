// Set de íconos propios: trazo grueso y esquinas redondeadas, en una rejilla de 24.
// Heredan el color del texto con currentColor y son decorativos por defecto:
// el significado siempre viaja en el texto que los acompaña.

const TRAZOS = {
  check: 'M4 12.5 9.5 18 20 6',
  equis: 'M6 6l12 12M18 6 6 18',
  candado: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z',
  trofeo: 'M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 13v4M9 20h6',
  bandera: 'M6 21V4M6 5h11l-2.5 4L17 13H6',
  libro:
    'M12 6.5C10.5 5 8.5 4.5 6 4.5H4v13h2c2.5 0 4.5.5 6 2M12 6.5C13.5 5 15.5 4.5 18 4.5h2v13h-2c-2.5 0-4.5.5-6 2M12 6.5v13',
  'flecha-arriba': 'M12 19V6M6 12l6-6 6 6',
  casa: 'M4 11.5 12 4l8 7.5M6.5 10v9h11v-9M10 19v-5h4v5',
  repetir: 'M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4.5v4h-4M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 19.5v-4h4',
  cronometro: 'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM12 9v4l2.5 2M9.5 3h5',
  grafico: 'M4 20h16M8 20v-6M12 20V7M16 20v-9',
} as const

export type NombreIcono = keyof typeof TRAZOS

type Props = {
  nombre: NombreIcono
  tamano?: number
  className?: string
  /** Texto alternativo. Si se entrega, el ícono deja de ser decorativo. */
  titulo?: string
}

export function Icono({ nombre, tamano = 24, className, titulo }: Props) {
  return (
    <svg
      className={className}
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={titulo ? 'img' : undefined}
      aria-hidden={titulo ? undefined : true}
      aria-label={titulo}
      focusable="false"
    >
      <path d={TRAZOS[nombre]} />
    </svg>
  )
}
