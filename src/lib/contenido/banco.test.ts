import { describe, expect, it } from 'vitest'
import { banco, itemsPorNivel, itemsPorUnidad } from './banco'

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
