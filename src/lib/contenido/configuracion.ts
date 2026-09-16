/**
 * Carga y valida `examen.config.json` (spec §8.4).
 *
 * Si la escuela de conductores confirma otros temas de doble puntaje, o
 * cambia el formato del examen, solo se edita ese archivo — este módulo no
 * debe requerir cambios.
 */
import configuracionCruda from './examen.config.json'
import type { Item } from './tipos'

export type ConfiguracionExamen = {
  simulacroCompleto: {
    preguntas: number
    minutos: number
    puntajeMax: number
    aprobacion: number
  }
  miniSimulacro: { preguntas: number; minutos: number; aprobacionPct: number }
  temasDoblePuntaje: string[]
  barra: {
    pesoCobertura: number
    pesoDominio: number
    pesoSimulacros: number
    dominioMinimoUnidad: number
  }
  leitnerIntervalosDias: number[]
}

function esNumeroPositivo(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isFinite(valor) && valor > 0
}

/**
 * Valida la forma mínima del archivo de configuración. Lanza un error
 * descriptivo si falta algo, en vez de dejar pasar un `undefined` silencioso
 * hasta el cálculo de la barra de preparación o de un simulacro.
 */
export function validarConfiguracion(config: unknown): ConfiguracionExamen {
  if (typeof config !== 'object' || config === null) {
    throw new Error('examen.config.json debe ser un objeto')
  }
  const c = config as Record<string, unknown>

  const simulacroCompleto =
    c.simulacroCompleto as ConfiguracionExamen['simulacroCompleto']
  const miniSimulacro = c.miniSimulacro as ConfiguracionExamen['miniSimulacro']
  const barra = c.barra as ConfiguracionExamen['barra']

  if (
    !simulacroCompleto ||
    !esNumeroPositivo(simulacroCompleto.preguntas) ||
    !esNumeroPositivo(simulacroCompleto.minutos) ||
    !esNumeroPositivo(simulacroCompleto.puntajeMax) ||
    !esNumeroPositivo(simulacroCompleto.aprobacion)
  ) {
    throw new Error('examen.config.json: "simulacroCompleto" está incompleto')
  }
  if (
    !miniSimulacro ||
    !esNumeroPositivo(miniSimulacro.preguntas) ||
    !esNumeroPositivo(miniSimulacro.minutos) ||
    !esNumeroPositivo(miniSimulacro.aprobacionPct)
  ) {
    throw new Error('examen.config.json: "miniSimulacro" está incompleto')
  }
  if (!Array.isArray(c.temasDoblePuntaje)) {
    throw new Error('examen.config.json: "temasDoblePuntaje" debe ser una lista')
  }
  if (
    !barra ||
    !esNumeroPositivo(barra.pesoCobertura) ||
    !esNumeroPositivo(barra.pesoDominio) ||
    !esNumeroPositivo(barra.pesoSimulacros) ||
    !esNumeroPositivo(barra.dominioMinimoUnidad)
  ) {
    throw new Error('examen.config.json: "barra" está incompleto')
  }
  const sumaPesos = barra.pesoCobertura + barra.pesoDominio + barra.pesoSimulacros
  if (Math.abs(sumaPesos - 1) > 0.001) {
    throw new Error(
      `examen.config.json: los pesos de "barra" deben sumar 1 (suman ${sumaPesos})`,
    )
  }
  if (!Array.isArray(c.leitnerIntervalosDias) || c.leitnerIntervalosDias.length !== 5) {
    throw new Error('examen.config.json: "leitnerIntervalosDias" debe tener 5 valores')
  }

  return {
    simulacroCompleto,
    miniSimulacro,
    temasDoblePuntaje: c.temasDoblePuntaje as string[],
    barra,
    leitnerIntervalosDias: c.leitnerIntervalosDias as number[],
  }
}

export const configuracionExamen: ConfiguracionExamen =
  validarConfiguracion(configuracionCruda)

/**
 * `doble_puntaje` se calcula desde la configuración y no se escribe a mano
 * en el ítem (spec §8.2).
 */
export function esDoblePuntaje(
  item: Pick<Item, 'temaExamen'>,
  config: ConfiguracionExamen = configuracionExamen,
): boolean {
  return item.temaExamen !== null && config.temasDoblePuntaje.includes(item.temaExamen)
}
