/**
 * Reglas comunes para jugar un ítem, compartidas entre la lección por
 * bloques (etapa 4) y el mini-simulacro (etapa 6). Solo entiende los tipos
 * de juego que hoy tiene el banco del Nivel 1: selección múltiple, completar
 * la frase y mito o realidad (spec §6, fase 1).
 */
import type { Item } from './tipos'

export type OpcionItem = { id: string; texto: string }

export function opcionesDelItem(item: Item): OpcionItem[] {
  switch (item.tipo) {
    case 'seleccion_multiple':
    case 'completar_frase':
      return item.alternativas
    case 'mito_o_realidad':
      return [
        { id: 'verdadero', texto: 'Verdadero' },
        { id: 'falso', texto: 'Falso' },
      ]
    default:
      // Los demás tipos (escenas, ordenar pasos) llegan en unidades futuras.
      throw new Error(`opcionesDelItem: tipo de ítem no soportado aún: "${item.tipo}"`)
  }
}

export function esCorrecta(item: Item, opcionId: string): boolean {
  switch (item.tipo) {
    case 'seleccion_multiple':
    case 'completar_frase':
      return opcionId === item.respuestaCorrecta
    case 'mito_o_realidad':
      return (opcionId === 'verdadero') === item.respuestaCorrecta
    default:
      throw new Error(`esCorrecta: tipo de ítem no soportado aún: "${item.tipo}"`)
  }
}

/** Letra de la alternativa a mostrar: V/F para mito o realidad, A-D para el resto. */
export function letraDeOpcion(item: Item, opcion: OpcionItem, indice: number): string {
  return item.tipo === 'mito_o_realidad' ? opcion.texto[0] : 'ABCD'[indice]
}
