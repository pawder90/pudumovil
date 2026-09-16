import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Pudumovil, type EstadoPudumovil } from './Pudumovil'

const ESTADOS: EstadoPudumovil[] = ['neutral', 'explicando', 'celebrando', 'animando']

describe('Pudumovil', () => {
  it.each(ESTADOS)('apunta a la imagen del estado %s', (estado) => {
    render(<Pudumovil estado={estado} />)
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      `/pudumovil/pudumovil-${estado}.svg`,
    )
  })

  it('describe al personaje por omisión', () => {
    render(<Pudumovil estado="celebrando" />)
    expect(screen.getByRole('img')).toHaveAccessibleName('Pudumóvil celebrando, saltando con los brazos arriba')
  })

  it('queda decorativo cuando el alt viene vacío', () => {
    const { container } = render(<Pudumovil estado="neutral" alt="" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.querySelector('img')).toHaveAttribute('alt', '')
  })
})
