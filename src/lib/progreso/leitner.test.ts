import { describe, expect, it } from 'vitest'
import {
  aplicarRespuesta,
  dominioUnidad,
  estadoInicial,
  estaVencido,
  itemsParaRepaso,
  pesoItem,
} from './leitner'

describe('estadoInicial', () => {
  it('parte en la caja 1, vencida hoy mismo', () => {
    const estado = estadoInicial('2026-03-01')
    expect(estado).toEqual({ caja: 1, proximoRepaso: '2026-03-01' })
  })
})

describe('aplicarRespuesta', () => {
  it('sube una caja con una respuesta correcta y agenda el intervalo de la caja nueva', () => {
    const estado = aplicarRespuesta(
      { caja: 1, proximoRepaso: '2026-03-01' },
      true,
      '2026-03-01',
    )
    expect(estado.caja).toBe(2)
    expect(estado.proximoRepaso).toBe('2026-03-03') // caja 2 -> 2 días
  })

  it('no sube de la caja 5', () => {
    const estado = aplicarRespuesta(
      { caja: 5, proximoRepaso: '2026-03-01' },
      true,
      '2026-03-01',
    )
    expect(estado.caja).toBe(5)
    expect(estado.proximoRepaso).toBe('2026-03-15') // caja 5 -> 14 días
  })

  it('vuelve a la caja 1 con una respuesta incorrecta', () => {
    const estado = aplicarRespuesta(
      { caja: 4, proximoRepaso: '2026-03-01' },
      false,
      '2026-03-01',
    )
    expect(estado.caja).toBe(1)
    expect(estado.proximoRepaso).toBe('2026-03-02') // caja 1 -> 1 día
  })
})

describe('estaVencido', () => {
  it('está vencido si la fecha de repaso ya pasó o es hoy', () => {
    expect(estaVencido({ caja: 1, proximoRepaso: '2026-03-01' }, '2026-03-01')).toBe(true)
    expect(estaVencido({ caja: 1, proximoRepaso: '2026-03-01' }, '2026-03-02')).toBe(true)
  })

  it('no está vencido si la fecha es futura', () => {
    expect(estaVencido({ caja: 1, proximoRepaso: '2026-03-05' }, '2026-03-01')).toBe(
      false,
    )
  })
})

describe('pesoItem', () => {
  it('pesa 0 si nunca se ha visto', () => {
    expect(pesoItem(undefined, '2026-03-01')).toBe(0)
  })

  it('usa el peso de la caja si no está vencido', () => {
    expect(pesoItem({ caja: 3, proximoRepaso: '2026-03-05' }, '2026-03-01')).toBe(0.6)
  })

  it('pesa la mitad si está vencido', () => {
    expect(pesoItem({ caja: 3, proximoRepaso: '2026-03-01' }, '2026-03-01')).toBe(0.3)
  })
})

describe('dominioUnidad', () => {
  it('promedia el peso de los ítems de la unidad', () => {
    const estados = new Map([
      ['a', { caja: 5, proximoRepaso: '2026-03-05' } as const],
      ['b', { caja: 1, proximoRepaso: '2026-03-05' } as const],
    ])
    // a: 1.0, b: 0.2, c: nunca visto -> 0. Promedio de 3 = 0.4
    expect(dominioUnidad(['a', 'b', 'c'], estados, '2026-03-01')).toBeCloseTo(0.4)
  })

  it('da 0 para una unidad sin ítems', () => {
    expect(dominioUnidad([], new Map(), '2026-03-01')).toBe(0)
  })
})

describe('itemsParaRepaso', () => {
  it('devuelve solo los vencidos, ordenados por caja ascendente', () => {
    const estados = new Map([
      ['caja-alta', { caja: 4, proximoRepaso: '2026-03-01' } as const],
      ['caja-baja', { caja: 1, proximoRepaso: '2026-03-01' } as const],
      ['no-vencido', { caja: 1, proximoRepaso: '2026-03-10' } as const],
    ])
    expect(itemsParaRepaso(estados, '2026-03-01')).toEqual(['caja-baja', 'caja-alta'])
  })
})
