import { describe, expect, it } from 'vitest'
import { armarMiniSimulacro, puntajeAprobacion, puntajeMaximo } from './simulacro'
import type { Item } from './tipos'

function item(id: string, temaExamen: string | null = null): Item {
  return {
    id,
    nivel: 1,
    unidad: 'u1',
    tipo: 'seleccion_multiple',
    dificultad: 1,
    temaExamen,
    enunciado: `Enunciado ${id}`,
    alternativas: [
      { id: 'a', texto: 'A' },
      { id: 'b', texto: 'B' },
    ],
    respuestaCorrecta: 'a',
    explicacion: 'Porque sí',
    fuente: { edicion: 'conaset-2026-02', seccion: 'Sección', pagina: 1, fragmento: '' },
    validacion: { estado: 'aprobado', revisadoPor: 'auto' },
  }
}

// azar determinista: siempre elige el primer elemento posible.
const azarFijo = () => 0

describe('armarMiniSimulacro', () => {
  it('toma la cantidad pedida de preguntas del nivel', () => {
    const items = Array.from({ length: 20 }, (_, i) => item(`n1-${i}`))
    const preguntas = armarMiniSimulacro(items, 15, azarFijo)
    expect(preguntas).toHaveLength(15)
  })

  it('incluye exactamente 1 pregunta de doble puntaje si el nivel tiene un ítem elegible', () => {
    const items = [
      ...Array.from({ length: 10 }, (_, i) => item(`n1-${i}`)),
      item('n1-sri-1', 'retencion_infantil'),
      item('n1-sri-2', 'retencion_infantil'),
    ]
    const preguntas = armarMiniSimulacro(items, 5, azarFijo)
    expect(preguntas.filter((p) => p.doblePuntaje)).toHaveLength(1)
  })

  it('no marca ninguna pregunta de doble puntaje si el nivel no tiene un tema elegible', () => {
    const items = Array.from({ length: 10 }, (_, i) => item(`n1-${i}`))
    const preguntas = armarMiniSimulacro(items, 5, azarFijo)
    expect(preguntas.every((p) => !p.doblePuntaje)).toBe(true)
  })

  it('no repite ítems', () => {
    const items = Array.from({ length: 10 }, (_, i) => item(`n1-${i}`))
    const preguntas = armarMiniSimulacro(items, 8, azarFijo)
    const ids = preguntas.map((p) => p.item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('puntajeMaximo', () => {
  it('suma 1 por pregunta normal y 2 por la de doble puntaje', () => {
    const preguntas = [
      { item: item('a'), doblePuntaje: false },
      { item: item('b'), doblePuntaje: false },
      { item: item('c'), doblePuntaje: true },
    ]
    expect(puntajeMaximo(preguntas)).toBe(4)
  })
})

describe('puntajeAprobacion', () => {
  it('redondea hacia arriba el 87% del puntaje máximo', () => {
    expect(puntajeAprobacion(16, 0.87)).toBe(14) // 13.92 -> 14
    expect(puntajeAprobacion(15, 0.87)).toBe(14) // 13.05 -> 14
  })
})
