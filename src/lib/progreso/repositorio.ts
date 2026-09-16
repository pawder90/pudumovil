/**
 * Operaciones de progreso que sí tocan Dexie. Las reglas (Leitner, dominio)
 * viven en `leitner.ts` como funciones puras; este módulo solo las conecta
 * con la base de datos. Recibe la base como parámetro (por defecto `db`)
 * para poder probarse con una instancia aislada.
 */
import {
  db,
  type BloqueEnCurso,
  type EstadoUnidad,
  type ResultadoSimulacro,
  type TipoSimulacro,
} from './db'
import {
  aplicarRespuesta,
  dominioUnidad,
  estadoInicial,
  itemsParaRepaso,
  hoyISO,
  type EstadoItemLeitner,
} from './leitner'

type BaseDeDatos = typeof db

/** Registra una respuesta y mueve el ítem de caja según corresponda (spec §5.8). */
export async function registrarRespuesta(
  itemId: string,
  unidad: string,
  correcta: boolean,
  baseDeDatos: BaseDeDatos = db,
): Promise<void> {
  const existente = await baseDeDatos.cajasLeitner.get(itemId)
  const estadoPrevio: EstadoItemLeitner = existente ?? estadoInicial()
  const estadoNuevo = aplicarRespuesta(estadoPrevio, correcta)
  await baseDeDatos.cajasLeitner.put({ itemId, unidad, ...estadoNuevo })
}

/** Dominio actual (0–1) de una unidad, a partir de las cajas de sus ítems (spec §5.8). */
export async function dominioDeUnidad(
  unidad: string,
  idsItemsDeUnidad: string[],
  baseDeDatos: BaseDeDatos = db,
): Promise<number> {
  const cajas = await baseDeDatos.cajasLeitner.where('unidad').equals(unidad).toArray()
  const estadosPorItem = new Map(cajas.map((c) => [c.itemId, c]))
  return dominioUnidad(idsItemsDeUnidad, estadosPorItem)
}

/** Ítems vencidos hoy para el bloque de repaso diario (spec §5.8). */
export async function bloqueDeRepasoDelDia(
  baseDeDatos: BaseDeDatos = db,
): Promise<string[]> {
  const todas = await baseDeDatos.cajasLeitner.toArray()
  const estadosPorItem = new Map(todas.map((c) => [c.itemId, c]))
  return itemsParaRepaso(estadosPorItem)
}

export async function guardarBloqueEnCurso(
  bloque: Omit<BloqueEnCurso, 'id'>,
  baseDeDatos: BaseDeDatos = db,
): Promise<void> {
  await baseDeDatos.bloqueEnCurso.put({ id: 'actual', ...bloque })
}

export async function obtenerBloqueEnCurso(
  baseDeDatos: BaseDeDatos = db,
): Promise<BloqueEnCurso | undefined> {
  return baseDeDatos.bloqueEnCurso.get('actual')
}

/** Se limpia al terminar la lección completa (spec R2). */
export async function limpiarBloqueEnCurso(baseDeDatos: BaseDeDatos = db): Promise<void> {
  await baseDeDatos.bloqueEnCurso.delete('actual')
}

/** Estado guardado de una unidad, o `undefined` si nunca se tocó (spec R1: "bloqueada" por defecto). */
export async function estadoDeUnidad(
  unidad: string,
  baseDeDatos: BaseDeDatos = db,
): Promise<EstadoUnidad | undefined> {
  return (await baseDeDatos.progresoUnidad.get(unidad))?.estado
}

export async function marcarEstadoUnidad(
  unidad: string,
  nivel: number,
  estado: EstadoUnidad,
  baseDeDatos: BaseDeDatos = db,
): Promise<void> {
  const existente = await baseDeDatos.progresoUnidad.get(unidad)
  await baseDeDatos.progresoUnidad.put({
    unidad,
    nivel,
    estado,
    bloqueActual: existente?.bloqueActual ?? 0,
  })
}

/** Próximo bloque pendiente de la unidad, para retomar donde quedó (spec R1). */
export async function bloqueActualDeUnidad(
  unidad: string,
  baseDeDatos: BaseDeDatos = db,
): Promise<number> {
  return (await baseDeDatos.progresoUnidad.get(unidad))?.bloqueActual ?? 0
}

export async function marcarBloqueActual(
  unidad: string,
  bloqueActual: number,
  baseDeDatos: BaseDeDatos = db,
): Promise<void> {
  await baseDeDatos.progresoUnidad.update(unidad, { bloqueActual })
}

export async function registrarResultadoSimulacro(
  resultado: Omit<ResultadoSimulacro, 'id' | 'fechaISO'>,
  baseDeDatos: BaseDeDatos = db,
): Promise<void> {
  await baseDeDatos.simulacros.add({ ...resultado, fechaISO: hoyISO() })
}

/**
 * Últimos `n` simulacros del tipo dado, como fracción del puntaje máximo
 * (0–1), del más reciente al más antiguo. Insumo de la barra de
 * preparación (spec §5.6).
 */
export async function ultimosSimulacros(
  tipo: TipoSimulacro,
  n = 3,
  baseDeDatos: BaseDeDatos = db,
): Promise<number[]> {
  const todos = await baseDeDatos.simulacros.where('tipo').equals(tipo).toArray()
  return todos
    .sort((a, b) => b.fechaISO.localeCompare(a.fechaISO))
    .slice(0, n)
    .map((r) => r.puntaje / r.puntajeMax)
}
