import { describe, expect, it } from 'vitest'
import {
  configuracionExamen,
  esDoblePuntaje,
  validarConfiguracion,
} from './configuracion'

describe('examen.config.json', () => {
  it('se carga y valida sin errores', () => {
    expect(configuracionExamen.simulacroCompleto.preguntas).toBe(35)
    expect(configuracionExamen.simulacroCompleto.aprobacion).toBe(33)
    expect(configuracionExamen.miniSimulacro.preguntas).toBe(15)
    expect(configuracionExamen.leitnerIntervalosDias).toEqual([1, 2, 4, 7, 14])
  })

  it('trae los temas de doble puntaje por defecto de la spec', () => {
    expect(configuracionExamen.temasDoblePuntaje).toEqual([
      'alcohol',
      'velocidad',
      'retencion_infantil',
    ])
  })
})

describe('validarConfiguracion', () => {
  it('rechaza una configuración sin "simulacroCompleto"', () => {
    expect(() => validarConfiguracion({})).toThrow('simulacroCompleto')
  })

  it('rechaza pesos de barra que no suman 1', () => {
    const invalida = {
      simulacroCompleto: { preguntas: 35, minutos: 45, puntajeMax: 38, aprobacion: 33 },
      miniSimulacro: { preguntas: 15, minutos: 20, aprobacionPct: 0.87 },
      temasDoblePuntaje: [],
      barra: {
        pesoCobertura: 0.5,
        pesoDominio: 0.5,
        pesoSimulacros: 0.5,
        dominioMinimoUnidad: 0.7,
      },
      leitnerIntervalosDias: [1, 2, 4, 7, 14],
    }
    expect(() => validarConfiguracion(invalida)).toThrow('deben sumar 1')
  })
})

describe('esDoblePuntaje', () => {
  it('es verdadero solo si el tema está en la lista de la configuración', () => {
    expect(esDoblePuntaje({ temaExamen: 'alcohol' })).toBe(true)
    expect(esDoblePuntaje({ temaExamen: 'senaletica' })).toBe(false)
    expect(esDoblePuntaje({ temaExamen: null })).toBe(false)
  })
})
