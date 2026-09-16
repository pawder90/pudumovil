import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HojaFeedback } from './HojaFeedback'

const base = {
  veredicto: 'incorrecto',
  titulo: 'Título de ejemplo',
  explicacion: <p>Explicación de ejemplo.</p>,
  abierta: true,
  onContinuar: () => {},
} as const

describe('HojaFeedback', () => {
  it('nombra el veredicto en palabras, no solo con color', () => {
    render(<HojaFeedback {...base} />)
    expect(screen.getByText('Incorrecto')).toBeInTheDocument()
  })

  it('mantiene Continuar fuera del área que se desplaza', () => {
    const { container } = render(<HojaFeedback {...base} />)
    const continuar = screen.getByRole('button', { name: 'Continuar' })
    const contenido = container.querySelector('.hoja-feedback-contenido')
    expect(contenido).not.toBeNull()
    expect(contenido?.contains(continuar)).toBe(false)
  })

  it('llama onContinuar al tocar el botón', async () => {
    const alContinuar = vi.fn()
    render(<HojaFeedback {...base} onContinuar={alContinuar} />)
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(alContinuar).toHaveBeenCalledOnce()
  })

  it('ofrece "Ver por qué" solo mientras está colapsada', async () => {
    const alExpandir = vi.fn()
    const { rerender } = render(<HojaFeedback {...base} onExpandir={alExpandir} />)
    await userEvent.click(screen.getByRole('button', { name: 'Ver por qué' }))
    expect(alExpandir).toHaveBeenCalledOnce()

    rerender(<HojaFeedback {...base} expandida onExpandir={alExpandir} />)
    expect(screen.queryByRole('button', { name: 'Ver por qué' })).not.toBeInTheDocument()
  })

  it('cita la referencia al libro cuando se entrega', () => {
    render(
      <HojaFeedback
        {...base}
        expandida
        referencia={{ edicion: 'Edición de ejemplo', seccion: 'Sección 0', pagina: 12 }}
      />,
    )
    expect(screen.getByText(/Edición de ejemplo/)).toBeInTheDocument()
    expect(screen.getByText(/página 12/)).toBeInTheDocument()
  })
})
