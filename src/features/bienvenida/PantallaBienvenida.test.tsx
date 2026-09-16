import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PantallaBienvenida } from './PantallaBienvenida'

describe('PantallaBienvenida', () => {
  it('tiene un encabezado accesible con el nombre de la app', () => {
    render(<PantallaBienvenida alComenzar={() => {}} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Pudumóvil' })).toBeInTheDocument()
  })

  it('muestra la bajada', () => {
    render(<PantallaBienvenida alComenzar={() => {}} />)
    expect(
      screen.getByText('Prepárate para tu examen de licencia clase B'),
    ).toBeInTheDocument()
  })

  it('tiene un solo botón, primario, que llama a alComenzar', async () => {
    const alComenzar = vi.fn()
    render(<PantallaBienvenida alComenzar={alComenzar} />)

    const botones = screen.getAllByRole('button')
    expect(botones).toHaveLength(1)
    expect(botones[0]).toHaveClass('boton-primario')

    await userEvent.click(screen.getByRole('button', { name: 'Comenzar' }))
    expect(alComenzar).toHaveBeenCalledOnce()
  })
})
