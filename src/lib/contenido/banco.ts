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
