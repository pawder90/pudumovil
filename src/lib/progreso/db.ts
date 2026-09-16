/**
 * Progreso local en IndexedDB (spec §9: "Progreso local: IndexedDB con
 * Dexie, con exportación e importación a archivo JSON").
 */
import Dexie, { type EntityTable } from 'dexie'
import type { Caja } from './leitner'

export type EstadoUnidad = 'bloqueada' | 'disponible' | 'en_curso' | 'completada'

export type ProgresoUnidad = {
  unidad: string // clave primaria, coincide con Item.unidad
  nivel: number
  estado: EstadoUnidad
  /** Índice del próximo bloque a jugar (0 a NUM_BLOQUES_LECCION - 1, spec R1). */
  bloqueActual: number
}

/** Ficha de repaso espaciado de un ítem (spec §5.8). */
export type CajaLeitner = {
  itemId: string // clave primaria, coincide con Item.id
  unidad: string
  caja: Caja
  proximoRepaso: string // ISO, solo fecha
}

/**
 * Punto donde retomar una lección a medio bloque (spec R2: "retomo en la
 * última pregunta respondida"). Registro único, `id` siempre `'actual'`.
 */
export type BloqueEnCurso = {
  id: 'actual'
  leccionId: string
  unidad: string
  indiceBloque: number
  colaItems: string[] // ids en orden; una falla reinserta el id al final
  indiceActual: number
  respuestas: { itemId: string; correcta: boolean }[]
}

export type TipoSimulacro = 'mini' | 'completo'

export type ResultadoSimulacro = {
  id?: number // autoincremental
  tipo: TipoSimulacro
  nivel?: number // solo mini-simulacro
  fechaISO: string
  puntaje: number
  puntajeMax: number
  aprobado: boolean
  erroresItemIds: string[]
}

class BaseDeDatosPudumovil extends Dexie {
  progresoUnidad!: EntityTable<ProgresoUnidad, 'unidad'>
  cajasLeitner!: EntityTable<CajaLeitner, 'itemId'>
  bloqueEnCurso!: EntityTable<BloqueEnCurso, 'id'>
  simulacros!: EntityTable<ResultadoSimulacro, 'id'>

  constructor(nombre = 'pudumovil') {
    super(nombre)
    this.version(1).stores({
      progresoUnidad: 'unidad, nivel, estado',
      cajasLeitner: 'itemId, unidad, caja, proximoRepaso',
      bloqueEnCurso: 'id',
      simulacros: '++id, tipo, nivel, fechaISO',
    })
  }
}

export const db = new BaseDeDatosPudumovil()

/** Crea una instancia aislada, para pruebas que no deben compartir estado. */
export function crearBaseDeDatosParaPruebas(nombre: string) {
  return new BaseDeDatosPudumovil(nombre)
}
