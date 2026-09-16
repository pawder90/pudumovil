import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BarraPreparacion } from './BarraPreparacion'

describe('BarraPreparacion', () => {
  it('anuncia el avance a la tecnología asistiva', () => {
    render(<BarraPreparacion porcentaje={40} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40')
  })

  it('muestra el aviso cuando está lista para el examen', () => {
    render(<BarraPreparacion porcentaje={100} lista />)
    expect(screen.getByText('Lista para el examen')).toBeInTheDocument()
  })

  it('no muestra el aviso mientras falta preparación', () => {
    render(<BarraPreparacion porcentaje={40} />)
    expect(screen.queryByText('Lista para el examen')).not.toBeInTheDocument()
  })
})
