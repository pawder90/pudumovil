import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { db } from '@/lib/progreso/db'
import { PaginaInicio } from './PaginaInicio'

beforeEach(async () => {
  await db.cajasLeitner.clear()
  await db.bloqueEnCurso.clear()
  await db.progresoUnidad.clear()
  await db.simulacros.clear()
})

describe('PaginaInicio', () => {
  it('muestra la barra de preparación y la primera unidad disponible', async () => {
    render(<PaginaInicio />)

    expect(await screen.findByText('Preparación')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Funcionamiento del automóvil, disponible ahora/i }),
    ).toBeInTheDocument()
  })

  it('bloquea la segunda unidad hasta que se complete la primera', async () => {
    render(<PaginaInicio />)

    expect(
      await screen.findByRole('button', {
        name: /Elementos de seguridad, bloqueado/i,
      }),
    ).toBeDisabled()
  })

  it('muestra los niveles 2 a 5 bloqueados, sin contenido todavía', async () => {
    render(<PaginaInicio />)

    await screen.findByText('Nivel 1 · Fundamentos')
    expect(screen.getByText('Nivel 2 · La persona que conduce')).toBeInTheDocument()
    expect(screen.getByText('Nivel 5 · Física y responsabilidad')).toBeInTheDocument()
  })

  it('al tocar una unidad disponible abre su bloque pendiente', async () => {
    const usuario = userEvent.setup()
    render(<PaginaInicio />)

    const nodo = await screen.findByRole('button', {
      name: /Funcionamiento del automóvil, disponible ahora/i,
    })
    await usuario.click(nodo)

    expect(await screen.findByRole('button', { name: 'Comprobar' })).toBeInTheDocument()
  })
})
