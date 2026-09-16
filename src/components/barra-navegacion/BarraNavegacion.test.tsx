import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BarraNavegacion } from './BarraNavegacion'

describe('BarraNavegacion', () => {
  it('marca la sección activa', () => {
    render(<BarraNavegacion activa="repaso" onCambio={() => {}} />)
    expect(screen.getByRole('button', { name: 'Repaso' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('anuncia los pendientes de repaso en el nombre accesible', () => {
    render(<BarraNavegacion activa="inicio" onCambio={() => {}} pendientesRepaso={4} />)
    expect(screen.getByRole('button', { name: 'Repaso, 4 pendientes' })).toBeInTheDocument()
  })

  it('no muestra chip cuando no hay pendientes', () => {
    render(<BarraNavegacion activa="inicio" onCambio={() => {}} pendientesRepaso={0} />)
    expect(screen.getByRole('button', { name: 'Repaso' })).toBeInTheDocument()
  })

  it('avisa el cambio de sección', async () => {
    const alCambiar = vi.fn()
    render(<BarraNavegacion activa="inicio" onCambio={alCambiar} />)
    await userEvent.click(screen.getByRole('button', { name: 'Simulacro' }))
    expect(alCambiar).toHaveBeenCalledWith('simulacro')
  })
})
