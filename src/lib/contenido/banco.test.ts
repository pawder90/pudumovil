import { describe, expect, it } from 'vitest'
import {
  NUM_BLOQUES_LECCION,
  banco,
  itemsDelBloque,
  itemsPorNivel,
  itemsPorUnidad,
} from './banco'

describe('banco de ítems', () => {
  it('no tiene ids duplicados', () => {
    const ids = banco.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('solo contiene ítems del nivel 1 por ahora', () => {
    expect(banco.every((item) => item.nivel === 1)).toBe(true)
  })

  it('todos los ítems están aprobados o marcados para revisión, nunca sin validar', () => {
    expect(banco.every((item) => item.validacion.estado !== 'pendiente')).toBe(true)
  })

  it('itemsPorUnidad filtra por la unidad declarada en cada ítem', () => {
    const items = itemsPorUnidad('elementos-de-seguridad')
    expect(items.length).toBeGreaterThan(0)
    expect(items.every((item) => item.unidad === 'elementos-de-seguridad')).toBe(true)
  })

  it('itemsPorNivel filtra por el nivel declarado en cada ítem', () => {
    const items = itemsPorNivel(1)
    expect(items).toHaveLength(banco.length)
  })
})

describe('itemsDelBloque', () => {
  it('reparte todos los ítems de la unidad entre los bloques, sin repetir ni perder ninguno', () => {
    const unidad = 'elementos-de-seguridad'
    const total = itemsPorUnidad(unidad)
    const repartidos = Array.from({ length: NUM_BLOQUES_LECCION }, (_, indice) =>
      itemsDelBloque(unidad, indice),
    ).flat()
    expect(repartidos.map((item) => item.id)).toEqual(total.map((item) => item.id))
  })

  it('ningún bloque queda vacío para una unidad con al menos 3 ítems', () => {
    const unidad = 'ninas-y-ninos-en-el-automovil'
    for (let indice = 0; indice < NUM_BLOQUES_LECCION; indice += 1) {
      expect(itemsDelBloque(unidad, indice).length).toBeGreaterThan(0)
    }
  })
})
