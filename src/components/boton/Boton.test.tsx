import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Boton } from './Boton'

describe('Boton', () => {
  it('aplica la clase de cada variante', () => {
    render(<Boton variante="logro">Iniciar simulacro</Boton>)
    expect(screen.getByRole('button')).toHaveClass('boton-logro')
  })

  it('usa la variante primaria por omisión', () => {
    render(<Boton>Comprobar</Boton>)
    expect(screen.getByRole('button')).toHaveClass('boton-primario')
  })

  it('no dispara onClick cuando está deshabilitado', async () => {
    const alPresionar = vi.fn()
    render(
      <Boton disabled onClick={alPresionar}>
        Comprobar
      </Boton>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(alPresionar).not.toHaveBeenCalled()
  })
})
