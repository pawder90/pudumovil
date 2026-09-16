/**
 * Carga el banco de ítems congelado como JSON (spec §8.1 paso 5).
 *
 * Cada archivo en `banco/nivel-N/*.json` es un array de `Item`. Este módulo
 * solo concatena y valida invariantes estructurales baratas (ids únicos,
 * `nivel`/`unidad` consistentes con el nombre del archivo); la validación
 * contra el texto fuente vive en `validarFuente.ts`, que es más cara y se
 * corre como test, no en cada carga de la app.
 */
import type { Item } from './tipos'
import nivel1Funcionamiento from './banco/nivel-1/funcionamiento-del-automovil.json'
import nivel1Seguridad from './banco/nivel-1/elementos-de-seguridad.json'
import nivel1Ninos from './banco/nivel-1/ninas-y-ninos-en-el-automovil.json'
import nivel1Senales from './banco/nivel-1/senales-de-transito-basicas.json'

const archivosBanco: Item[][] = [
  nivel1Funcionamiento as Item[],
  nivel1Seguridad as Item[],
  nivel1Ninos as Item[],
  nivel1Senales as Item[],
]

function validarBanco(items: Item[]): Item[] {
  const ids = new Set<string>()
  for (const item of items) {
    if (ids.has(item.id)) {
      throw new Error(`Banco de ítems: id duplicado "${item.id}"`)
    }
    ids.add(item.id)
  }
  return items
}

/** Todos los ítems congelados del banco, de todos los niveles cargados hasta ahora. */
export const banco: Item[] = validarBanco(archivosBanco.flat())

export function itemsPorUnidad(unidad: string): Item[] {
  return banco.filter((item) => item.unidad === unidad)
}

export function itemsPorNivel(nivel: Item['nivel']): Item[] {
  return banco.filter((item) => item.nivel === nivel)
}

/** Cuántos ítems de la unidad caen en cada uno de los 3 bloques de la lección (spec §5.3). */
export const NUM_BLOQUES_LECCION = 3

/**
 * Ítems de un bloque de la lección de una unidad. Reparte los ítems de la
 * unidad en `NUM_BLOQUES_LECCION` tramos consecutivos y de tamaño parejo,
 * en el orden fijo del banco (spec §5.3: "cada lección se divide en 3
 * bloques").
 */
export function itemsDelBloque(unidad: string, indiceBloque: number): Item[] {
  const items = itemsPorUnidad(unidad)
  const tamano = Math.ceil(items.length / NUM_BLOQUES_LECCION)
  return items.slice(indiceBloque * tamano, (indiceBloque + 1) * tamano)
}
