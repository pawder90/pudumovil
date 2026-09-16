import { describe, expect, it } from 'vitest'
import { calcularBarraPreparacion } from './preparacion'

const CONFIG_PRUEBA = {
  simulacroCompleto: { preguntas: 35, minutos: 45, puntajeMax: 38, aprobacion: 33 },
  miniSimulacro: { preguntas: 15, minutos: 20, aprobacionPct: 0.87 },
  temasDoblePuntaje: [],
  barra: {
    pesoCobertura: 0.2,
    pesoDominio: 0.4,
    pesoSimulacros: 0.4,
    dominioMinimoUnidad: 0.7,
  },
  leitnerIntervalosDias: [1, 2, 4, 7, 14],
}

describe('calcularBarraPreparacion', () => {
  it('aplica la fórmula 0,20×cobertura + 0,40×dominio + 0,40×simulacros', () => {
    const resultado = calcularBarraPreparacion(
      {
        cobertura: 1,
        dominioPromedio: 1,
        ultimosSimulacros: [1, 1, 1],
        puntajeAprobacionSimulacro: 33,
        dominioPorUnidad: [],
      },
      CONFIG_PRUEBA,
    )
    expect(resultado.porcentaje).toBe(100)
  })

  it('no está lista si aún no hay 3 simulacros', () => {
    const resultado = calcularBarraPreparacion(
      {
        cobertura: 1,
        dominioPromedio: 1,
        ultimosSimulacros: [1, 1],
        puntajeAprobacionSimulacro: 33,
        dominioPorUnidad: [],
      },
      CONFIG_PRUEBA,
    )
    expect(resultado.listaParaExamen).toBe(false)
    expect(resultado.mensajePendiente).toBeTruthy()
  })

  it('no está lista si alguna unidad tiene dominio bajo 70% y lo nombra', () => {
    const resultado = calcularBarraPreparacion(
      {
        cobertura: 1,
        dominioPromedio: 0.9,
        ultimosSimulacros: [1, 1, 1],
        puntajeAprobacionSimulacro: 33,
        dominioPorUnidad: [
          { unidad: 'adelantamientos', nombre: 'adelantamientos', dominio: 0.58 },
          { unidad: 'senales', nombre: 'señales', dominio: 0.95 },
        ],
      },
      CONFIG_PRUEBA,
    )
    expect(resultado.listaParaExamen).toBe(false)
    expect(resultado.mensajePendiente).toBe('Tu unidad de adelantamientos está en 58%')
  })

  it('está lista si las dos condiciones se cumplen', () => {
    const resultado = calcularBarraPreparacion(
      {
        cobertura: 1,
        dominioPromedio: 0.9,
        ultimosSimulacros: [33 / 38, 34 / 38, 35 / 38],
        puntajeAprobacionSimulacro: 33,
        dominioPorUnidad: [{ unidad: 'senales', nombre: 'señales', dominio: 0.95 }],
      },
      CONFIG_PRUEBA,
    )
    expect(resultado.listaParaExamen).toBe(true)
    expect(resultado.mensajePendiente).toBeUndefined()
  })
})
