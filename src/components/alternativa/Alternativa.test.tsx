import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Alternativa } from './Alternativa'

describe('Alternativa', () => {
  // Principio "nunca solo color": el resultado tiene que ser legible sin ver el color.
  it.each([
    ['correcta', 'Correcta'],
    ['incorrecta', 'Incorrecta'],
  ] as const)('nombra el estado %s en palabras', (estado, palabra) => {
    render(
      <Alternativa letra="A" estado={estado}>
        Una opción
      </Alternativa>,
    )
    expect(screen.getByText(palabra)).toBeInTheDocument()
  })

  it('marca la seleccionada con aria-pressed', () => {
    render(
      <Alternativa letra="B" estado="seleccionada">
        Otra opción
      </Alternativa>,
    )
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('responde al toque en reposo', async () => {
    const alElegir = vi.fn()
    render(
      <Alternativa letra="C" onClick={alElegir}>
        Tercera opción
      </Alternativa>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(alElegir).toHaveBeenCalledOnce()
  })
})
