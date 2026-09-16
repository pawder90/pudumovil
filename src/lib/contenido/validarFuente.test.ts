import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { banco } from './banco'
import { indexarLibro, validarFragmento } from './validarFuente'

const rutaLibro = resolve(
  __dirname,
  '../../../docs/libro/Libro_para_la_conduccion_en_Chile_Clase_B_27-02-2026.md',
)
const indice = indexarLibro(readFileSync(rutaLibro, 'utf-8'))

describe('banco de ítems vs. texto fuente (spec §8.1 paso 3)', () => {
  it.each(banco.map((item) => [item.id, item] as const))(
    '%s: el fragmento citado existe en el libro y está en la página declarada',
    (_id, item) => {
      const resultado = validarFragmento(indice, item.fuente.fragmento, item.fuente.pagina)
      expect(resultado.encontrado, `fragmento no encontrado en el libro: "${item.fuente.fragmento}"`).toBe(true)
      expect(
        resultado.paginaCoincide,
        `"${item.fuente.fragmento}" está en la página ${resultado.paginaEncontrada}, no en la ${item.fuente.pagina} declarada`,
      ).toBe(true)
    },
  )
})
