import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NodoCamino } from './NodoCamino'

describe('NodoCamino', () => {
  it('deshabilita el nodo bloqueado y nombra su estado', () => {
    render(<NodoCamino estado="bloqueado" etiqueta="Nivel 3" />)
    const nodo = screen.getByRole('button', { name: 'Nivel 3, bloqueado' })
    expect(nodo).toBeDisabled()
  })

  it('nombra el mini-simulacro', () => {
    render(<NodoCamino estado="simulacro" etiqueta="Prueba del nivel 1" />)
    expect(
      screen.getByRole('button', { name: 'Prueba del nivel 1, mini-simulacro' }),
    ).toBeEnabled()
  })
})
