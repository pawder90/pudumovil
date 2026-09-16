/**
 * Barra de preparación para el examen (spec §5.6). Función pura: recibe los
 * números ya calculados (cobertura, dominio, simulacros) y arma el
 * resultado, incluida la condición "Lista para el examen".
 */
import { configuracionExamen } from '../contenido/configuracion'

export type DominioPorUnidad = { unidad: string; nombre: string; dominio: number } // dominio 0–1

export type EntradaBarraPreparacion = {
  /** unidades completadas ÷ unidades totales (0–1). */
  cobertura: number
  /** promedio del dominio de cada unidad (0–1), spec §5.8. */
  dominioPromedio: number
  /**
   * Puntajes (0–1) de los últimos 3 simulacros. Antes del primer simulacro
   * completo se usan los mini-simulacros (spec §5.6). Puede tener menos de
   * 3 elementos si aún no se han rendido tantos.
   */
  ultimosSimulacros: number[]
  /** Puntaje mínimo de aprobación del simulacro completo (spec §5.7: 33 de 38). */
  puntajeAprobacionSimulacro: number
  dominioPorUnidad: DominioPorUnidad[]
}

export type ResultadoBarraPreparacion = {
  /** 0 a 100. */
  porcentaje: number
  listaParaExamen: boolean
  /** Qué falta para "Lista para el examen", si aplica (spec §5.6). */
  mensajePendiente?: string
}

export function calcularBarraPreparacion(
  entrada: EntradaBarraPreparacion,
  config = configuracionExamen,
): ResultadoBarraPreparacion {
  const { barra } = config
  const promedioSimulacros =
    entrada.ultimosSimulacros.length > 0
      ? entrada.ultimosSimulacros.reduce((a, b) => a + b, 0) /
        entrada.ultimosSimulacros.length
      : 0

  const porcentaje =
    100 *
    (barra.pesoCobertura * entrada.cobertura +
      barra.pesoDominio * entrada.dominioPromedio +
      barra.pesoSimulacros * promedioSimulacros)

  const tresSimulacrosOk =
    entrada.ultimosSimulacros.length >= 3 &&
    entrada.ultimosSimulacros.every(
      (s) =>
        s * config.simulacroCompleto.puntajeMax >= entrada.puntajeAprobacionSimulacro,
    )

  const unidadMasDebil = entrada.dominioPorUnidad
    .filter((u) => u.dominio < barra.dominioMinimoUnidad)
    .sort((a, b) => a.dominio - b.dominio)[0]

  const listaParaExamen = tresSimulacrosOk && unidadMasDebil === undefined

  let mensajePendiente: string | undefined
  if (!listaParaExamen) {
    if (unidadMasDebil) {
      mensajePendiente = `Tu unidad de ${unidadMasDebil.nombre} está en ${Math.round(unidadMasDebil.dominio * 100)}%`
    } else if (!tresSimulacrosOk) {
      mensajePendiente = 'Todavía te faltan simulacros aprobados para estar lista'
    }
  }

  return { porcentaje: Math.round(porcentaje), listaParaExamen, mensajePendiente }
}
