/**
 * Arma el banco de preguntas de un mini-simulacro (spec §5.7): toma ítems
 * solo del nivel, incluye 1 pregunta de doble puntaje si el nivel tiene
 * algún ítem elegible (spec §8.4: `esDoblePuntaje`), y calcula el puntaje
 * máximo y de aprobación.
 */
import { esDoblePuntaje } from './configuracion'
import type { Item } from './tipos'

export type PreguntaSimulacro = { item: Item; doblePuntaje: boolean }

function mezclar<T>(lista: T[], azar: () => number): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

/**
 * `azar` es inyectable para pruebas deterministas; en la app usa
 * `Math.random` por defecto.
 */
export function armarMiniSimulacro(
  items: Item[],
  numPreguntas: number,
  azar: () => number = Math.random,
): PreguntaSimulacro[] {
  const elegiblesDoble = items.filter((item) => esDoblePuntaje(item))
  const barajados = mezclar(items, azar)

  if (elegiblesDoble.length === 0) {
    return barajados.slice(0, numPreguntas).map((item) => ({ item, doblePuntaje: false }))
  }

  const doble = elegiblesDoble[Math.floor(azar() * elegiblesDoble.length)]
  const resto = barajados
    .filter((item) => item.id !== doble.id)
    .slice(0, numPreguntas - 1)
    .map((item) => ({ item, doblePuntaje: false }))

  return mezclar([{ item: doble, doblePuntaje: true }, ...resto], azar)
}

/** Cada pregunta normal vale 1 punto; la de doble puntaje vale 2 (spec §5.7). */
export function puntajeMaximo(preguntas: PreguntaSimulacro[]): number {
  return preguntas.reduce((acc, p) => acc + (p.doblePuntaje ? 2 : 1), 0)
}

/** 87% del puntaje, redondeado hacia arriba (spec §5.7). */
export function puntajeAprobacion(puntajeMaximoDelExamen: number, aprobacionPct: number): number {
  return Math.ceil(puntajeMaximoDelExamen * aprobacionPct)
}
