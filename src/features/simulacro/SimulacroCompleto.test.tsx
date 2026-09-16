import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { db } from '@/lib/progreso/db'
import { itemsPorNivel } from '@/lib/contenido/banco'
import { configuracionExamen } from '@/lib/contenido/configuracion'
import { SimulacroCompleto } from './SimulacroCompleto'

beforeEach(async () => {
  await db.simulacros.clear()
})

function primeraOpcion(): HTMLElement {
  const opcion = document.querySelector('.simulacro-completo-opciones .alternativa')
  if (!opcion) throw new Error('no hay alternativas en pantalla')
  return opcion as HTMLElement
}

const items = itemsPorNivel(1)

describe('SimulacroCompleto', () => {
  it('muestra la primera pregunta con el progreso y el tiempo restante', async () => {
    render(<SimulacroCompleto items={items} onSalir={() => {}} onTerminado={() => {}} />)

    expect(await screen.findByText(/0 de \d+/)).toBeInTheDocument()
    expect(screen.getByText('45:00')).toBeInTheDocument()
  })

  it('avanza de pregunta al confirmar una respuesta', async () => {
    const usuario = userEvent.setup()
    render(<SimulacroCompleto items={items} onSalir={() => {}} onTerminado={() => {}} />)

    await screen.findByText(/0 de \d+/)
    await usuario.click(primeraOpcion())
    await usuario.click(screen.getByRole('button', { name: 'Siguiente' }))

    expect(await screen.findByText(/1 de \d+/)).toBeInTheDocument()
  })

  it('registra el resultado como simulacro completo y muestra la revisión al terminar', async () => {
    const usuario = userEvent.setup()
    render(<SimulacroCompleto items={items} onSalir={() => {}} onTerminado={() => {}} />)

    const total = Math.min(configuracionExamen.simulacroCompleto.preguntas, items.length)
    for (let i = 0; i < total; i++) {
      await screen.findByText(`${i} de ${total}`)
      await usuario.click(primeraOpcion())
      await usuario.click(screen.getByRole('button', { name: i === total - 1 ? 'Terminar' : 'Siguiente' }))
    }

    expect(await screen.findByText(/de \d+ puntos/)).toBeInTheDocument()

    const registros = await db.simulacros.toArray()
    expect(registros).toHaveLength(1)
    expect(registros[0].tipo).toBe('completo')
    expect(registros[0].nivel).toBeUndefined()
    expect(registros[0].erroresItemIds.length).toBeLessThanOrEqual(total)
  })
})
