import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { db } from '@/lib/progreso/db'
import { LeccionBloque } from './LeccionBloque'

const UNIDAD = 'ninas-y-ninos-en-el-automovil'

beforeEach(async () => {
  await db.cajasLeitner.clear()
  await db.bloqueEnCurso.clear()
  await db.progresoUnidad.clear()
})

function renderBloque(indiceBloque = 0) {
  return render(
    <LeccionBloque
      unidad={UNIDAD}
      nivel={1}
      indiceBloque={indiceBloque}
      onSalir={() => {}}
      onCompletado={() => {}}
    />,
  )
}

/** El enunciado, no la explicación oculta de la hoja de feedback (ambos pueden compartir texto). */
async function esperarEnunciado(patron: RegExp) {
  return screen.findByText(patron, { selector: '.leccion-bloque-enunciado' })
}

describe('LeccionBloque', () => {
  it('muestra la explicación y la referencia al libro tras responder bien', async () => {
    const usuario = userEvent.setup()
    renderBloque()

    // primer ítem del bloque es mito_o_realidad; su respuesta correcta es "falso".
    await esperarEnunciado(/menores de 12 años/i)
    await usuario.click(screen.getByRole('button', { name: /falso/i }))
    await usuario.click(screen.getByRole('button', { name: 'Comprobar' }))

    expect(await screen.findByText('¡Bien hecho!')).toBeInTheDocument()
    expect(screen.getByText(/Se estableció la prohibición/)).toBeInTheDocument()
    expect(screen.getByText(/página 73/)).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Continuar' }))

    await screen.findByText(/Sistema de Retención Infantil\?/)
  })

  it('marca la alternativa correcta aunque la elegida haya sido otra', async () => {
    const usuario = userEvent.setup()
    renderBloque()

    await esperarEnunciado(/menores de 12 años/i)
    await usuario.click(screen.getByRole('button', { name: /verdadero/i }))
    await usuario.click(screen.getByRole('button', { name: 'Comprobar' }))

    expect(await screen.findByText('No era esa')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /falso/i })).toHaveClass('alternativa-correcta')
    expect(screen.getByRole('button', { name: /verdadero/i })).toHaveClass(
      'alternativa-incorrecta',
    )
  })

  it('una pregunta fallada vuelve al final del bloque en vez de desaparecer', async () => {
    const usuario = userEvent.setup()
    renderBloque()

    await esperarEnunciado(/menores de 12 años/i)
    await usuario.click(screen.getByRole('button', { name: /verdadero/i }))
    await usuario.click(screen.getByRole('button', { name: 'Comprobar' }))
    await screen.findByText('No era esa')
    await usuario.click(screen.getByRole('button', { name: 'Continuar' }))

    const bloque = await db.bloqueEnCurso.get('actual')
    expect(bloque?.colaItems.at(-1)).toBe('n1-u3-sri-001')
    expect(bloque?.colaItems.length).toBeGreaterThan(5)
    expect(bloque?.indiceActual).toBe(1)
  })

  it('registra la respuesta en la caja de Leitner del ítem', async () => {
    const usuario = userEvent.setup()
    renderBloque()

    await esperarEnunciado(/menores de 12 años/i)
    await usuario.click(screen.getByRole('button', { name: /falso/i }))
    await usuario.click(screen.getByRole('button', { name: 'Comprobar' }))
    await screen.findByText('¡Bien hecho!')

    const ficha = await db.cajasLeitner.get('n1-u3-sri-001')
    expect(ficha?.caja).toBe(2)
    expect(ficha?.unidad).toBe(UNIDAD)
  })

  it('retoma un bloque a medio camino en la última pregunta respondida', async () => {
    await db.bloqueEnCurso.put({
      id: 'actual',
      leccionId: `${UNIDAD}-b0`,
      unidad: UNIDAD,
      indiceBloque: 0,
      colaItems: ['n1-u3-sri-001', 'n1-u3-sri-002', 'n1-u3-sri-003', 'n1-u3-sri-004', 'n1-u3-sri-005'],
      indiceActual: 1,
      respuestas: [{ itemId: 'n1-u3-sri-001', correcta: true }],
    })

    renderBloque()

    await screen.findByText(/Sistema de Retención Infantil\?/)
  })
})
