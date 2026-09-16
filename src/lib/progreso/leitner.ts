/**
 * Repaso espaciado con cajas de Leitner (spec §5.8). Funciones puras: no
 * tocan la base de datos, para poder probarlas sin Dexie.
 */
import { configuracionExamen } from '../contenido/configuracion'

export type Caja = 1 | 2 | 3 | 4 | 5

const CAJA_MAXIMA: Caja = 5
const CAJA_INICIAL: Caja = 1

/** Peso del ítem según su caja, para el cálculo de dominio (spec §5.8). */
const PESO_POR_CAJA: Record<Caja, number> = { 1: 0.2, 2: 0.4, 3: 0.6, 4: 0.8, 5: 1.0 }

export type EstadoItemLeitner = {
  caja: Caja
  proximoRepaso: string // ISO date, medianoche local del día en que vence
}

/** Fecha (ISO, solo día) del día de "hoy" en la zona horaria local. */
export function hoyISO(referencia: Date = new Date()): string {
  const local = new Date(
    referencia.getFullYear(),
    referencia.getMonth(),
    referencia.getDate(),
  )
  return local.toISOString().slice(0, 10)
}

function sumarDias(fechaISO: string, dias: number): string {
  const [anio, mes, dia] = fechaISO.split('-').map(Number)
  const fecha = new Date(anio, mes - 1, dia + dias)
  return hoyISO(fecha)
}

/** Un ítem nuevo parte en la caja 1, vencido de inmediato (spec §5.8). */
export function estadoInicial(hoy: string = hoyISO()): EstadoItemLeitner {
  return { caja: CAJA_INICIAL, proximoRepaso: hoy }
}

/**
 * Aplica una respuesta a un ítem: sube una caja si fue correcta (se queda
 * en la 5), o vuelve a la caja 1 si fue incorrecta. Recalcula la próxima
 * fecha de repaso con los intervalos de `examen.config.json`.
 */
export function aplicarRespuesta(
  estado: EstadoItemLeitner,
  correcta: boolean,
  hoy: string = hoyISO(),
  intervalosDias: number[] = configuracionExamen.leitnerIntervalosDias,
): EstadoItemLeitner {
  const caja: Caja = correcta
    ? (Math.min(estado.caja + 1, CAJA_MAXIMA) as Caja)
    : CAJA_INICIAL
  const intervalo = intervalosDias[caja - 1]
  return { caja, proximoRepaso: sumarDias(hoy, intervalo) }
}

export function estaVencido(estado: EstadoItemLeitner, hoy: string = hoyISO()): boolean {
  return estado.proximoRepaso <= hoy
}

/**
 * Peso del ítem para el dominio de la unidad (spec §5.8). Un ítem vencido
 * pesa la mitad de lo que le corresponde por caja.
 */
export function pesoItem(
  estado: EstadoItemLeitner | undefined,
  hoy: string = hoyISO(),
): number {
  if (!estado) return 0 // nunca visto
  const peso = PESO_POR_CAJA[estado.caja]
  return estaVencido(estado, hoy) ? peso / 2 : peso
}

/** Dominio de una unidad (0 a 1): promedio del peso de sus ítems (spec §5.8). */
export function dominioUnidad(
  idsItemsDeUnidad: string[],
  estadosPorItem: Map<string, EstadoItemLeitner>,
  hoy: string = hoyISO(),
): number {
  if (idsItemsDeUnidad.length === 0) return 0
  const suma = idsItemsDeUnidad.reduce(
    (acumulado, id) => acumulado + pesoItem(estadosPorItem.get(id), hoy),
    0,
  )
  return suma / idsItemsDeUnidad.length
}

/**
 * Ítems vencidos para el bloque de repaso diario, ordenados por caja
 * ascendente (spec §5.8: "empezando por las cajas más bajas").
 */
export function itemsParaRepaso(
  estadosPorItem: Map<string, EstadoItemLeitner>,
  hoy: string = hoyISO(),
): string[] {
  return [...estadosPorItem.entries()]
    .filter(([, estado]) => estaVencido(estado, hoy))
    .sort(([, a], [, b]) => a.caja - b.caja)
    .map(([id]) => id)
}
