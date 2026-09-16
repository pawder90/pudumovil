import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { db } from '@/lib/progreso/db'
import { RepasoDiario } from './RepasoDiario'

const ITEM_SRI = 'n1-u3-sri-001' // unidad ninas-y-ninos-en-el-automovil, mito_o_realidad, correcta: falso
const ITEM_SEG = 'n1-u2-seg-001' // unidad elementos-de-seguridad, mito_o_realidad, correcta: falso

beforeEach(async () => {
  await db.cajasLeitner.clear()
})

/** El enunciado, no la explicación oculta de la hoja de feedback (ambos pueden compartir texto). */
async function esperarEnunciado(patron: RegExp) {
  return screen.findByText(patron, { selector: '.repaso-diario-enunciado' })
}

describe('RepasoDiario', () => {
  it('presenta ítems de distintas unidades en una sola cola', async () => {
    const usuario = userEvent.setup()
    render(<RepasoDiario itemIds={[ITEM_SRI, ITEM_SEG]} onSalir={() => {}} onTerminado={() => {}} />)

    await esperarEnunciado(/menores de 12 años/i)
    await usuario.click(screen.getByRole('button', { name: /falso/i }))
    await usuario.click(screen.getByRole('button', { name: 'Comprobar' }))
    expect(await screen.findByText('¡Bien hecho!')).toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: 'Continuar' }))

    await esperarEnunciado(/mismo cinturón de seguridad/i)
  })

  it('un fallo no vuelve a aparecer en la misma sesión', async () => {
    const usuario = userEvent.setup()
    render(<RepasoDiario itemIds={[ITEM_SRI]} onSalir={() => {}} onTerminado={() => {}} />)

    await esperarEnunciado(/menores de 12 años/i)
    await usuario.click(screen.getByRole('button', { name: /verdadero/i }))
    await usuario.click(screen.getByRole('button', { name: 'Comprobar' }))
    await screen.findByText('No era esa')
    await usuario.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(await screen.findByText('¡Repaso completado!')).toBeInTheDocument()
    expect(screen.getByText('0 de 1 correctas')).toBeInTheDocument()
  })

  it('registra la respuesta en la caja de Leitner del ítem, con la unidad correcta', async () => {
    const usuario = userEvent.setup()
    render(<RepasoDiario itemIds={[ITEM_SEG]} onSalir={() => {}} onTerminado={() => {}} />)

    await esperarEnunciado(/mismo cinturón de seguridad/i)
    await usuario.click(screen.getByRole('button', { name: /falso/i }))
    await usuario.click(screen.getByRole('button', { name: 'Comprobar' }))
    await screen.findByText('¡Bien hecho!')

    const ficha = await db.cajasLeitner.get(ITEM_SEG)
    expect(ficha?.caja).toBe(2)
    expect(ficha?.unidad).toBe('elementos-de-seguridad')
  })

  it('muestra un mensaje cuando no hay ítems para repasar', async () => {
    render(<RepasoDiario itemIds={[]} onSalir={() => {}} onTerminado={() => {}} />)

    expect(await screen.findByText('Nada que repasar por hoy')).toBeInTheDocument()
  })
})
