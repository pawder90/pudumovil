import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { db } from '@/lib/progreso/db'
import { MiniSimulacro } from './MiniSimulacro'

beforeEach(async () => {
  await db.simulacros.clear()
})

function primeraOpcion(): HTMLElement {
  const opcion = document.querySelector('.mini-simulacro-opciones .alternativa')
  if (!opcion) throw new Error('no hay alternativas en pantalla')
  return opcion as HTMLElement
}

describe('MiniSimulacro', () => {
  it('muestra la primera pregunta con el progreso y el tiempo restante', async () => {
    render(<MiniSimulacro nivel={1} onSalir={() => {}} onTerminado={() => {}} />)

    expect(await screen.findByText('0 de 15')).toBeInTheDocument()
    expect(screen.getByText('20:00')).toBeInTheDocument()
  })

  it('avanza de pregunta al confirmar una respuesta', async () => {
    const usuario = userEvent.setup()
    render(<MiniSimulacro nivel={1} onSalir={() => {}} onTerminado={() => {}} />)

    await screen.findByText('0 de 15')
    await usuario.click(primeraOpcion())
    await usuario.click(screen.getByRole('button', { name: 'Siguiente' }))

    expect(await screen.findByText('1 de 15')).toBeInTheDocument()
  })

  it('registra el resultado y muestra la revisión al terminar las 15 preguntas', async () => {
    const usuario = userEvent.setup()
    render(<MiniSimulacro nivel={1} onSalir={() => {}} onTerminado={() => {}} />)

    for (let i = 0; i < 15; i++) {
      await screen.findByText(`${i} de 15`)
      await usuario.click(primeraOpcion())
      await usuario.click(screen.getByRole('button', { name: i === 14 ? 'Terminar' : 'Siguiente' }))
    }

    expect(await screen.findByText(/de \d+ puntos/)).toBeInTheDocument()

    const registros = await db.simulacros.toArray()
    expect(registros).toHaveLength(1)
    expect(registros[0].tipo).toBe('mini')
    expect(registros[0].nivel).toBe(1)
    // 15 preguntas normales + 1 punto extra si el nivel trajo una de doble puntaje.
    expect([15, 16]).toContain(registros[0].puntajeMax)
    expect(registros[0].erroresItemIds.length).toBeLessThanOrEqual(15)
  })
})
