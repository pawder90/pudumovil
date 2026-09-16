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

  it('bloquea el mini-simulacro hasta completar todas las unidades del nivel', async () => {
    render(<PaginaInicio />)

    expect(
      await screen.findByRole('button', { name: /Mini-simulacro, bloqueado/i }),
    ).toBeDisabled()
  })

  it('habilita el mini-simulacro al completar las 4 unidades del nivel', async () => {
    const usuario = userEvent.setup()
    const unidades = [
      'funcionamiento-del-automovil',
      'elementos-de-seguridad',
      'ninas-y-ninos-en-el-automovil',
      'senales-de-transito-basicas',
    ]
    for (const unidad of unidades) {
      await db.progresoUnidad.put({ unidad, nivel: 1, estado: 'completada', bloqueActual: 3 })
    }

    render(<PaginaInicio />)

    const nodo = await screen.findByRole('button', { name: /Mini-simulacro, mini-simulacro/i })
    expect(nodo).toBeEnabled()

    await usuario.click(nodo)
    expect(await screen.findByText('0 de 15')).toBeInTheDocument()
  })
})
