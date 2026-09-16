/**
 * Esquema del banco de ítems (spec §8.2) y tipos compartidos de contenido.
 *
 * `escena` se modela desde la fase 1 aunque los juegos de escena (quién pasa
 * primero animado, detectar riesgos) recién se construyen en fases 2 y 3 —
 * ver la "Consideración de arquitectura" al final de la spec §7.
 */

export type Nivel = 1 | 2 | 3 | 4 | 5

/** Edición del libro fuente, fijada al congelar el banco (spec §8.1). */
export type EdicionLibro = 'conaset-2026-02'

export type ReferenciaLibro = {
  edicion: EdicionLibro
  seccion: string
  pagina: number
}

/** `fuente.fragmento` solo se usa para validar; nunca se muestra completo en la app. */
export type Fuente = ReferenciaLibro & {
  fragmento: string
}

export type EstadoValidacion = 'aprobado' | 'dudoso' | 'pendiente'

export type Validacion = {
  estado: EstadoValidacion
  revisadoPor: 'auto' | string
}

export type Alternativa = {
  id: string
  texto: string
}

export type VistaEscena = 'superior'

export type AccionVehiculo = 'recto' | 'derecha' | 'izquierda' | 'detenido'
export type EntradaVehiculo = 'norte' | 'sur' | 'este' | 'oeste'

export type VehiculoEscena = {
  id: string
  entrada: EntradaVehiculo
  accion: AccionVehiculo
}

export type SenalEscena = {
  id: string
  tipo: string
  posicion: EntradaVehiculo
}

export type ZonaRiesgo = {
  id: string
  descripcion: string
}

/** Descripción de una escena de cruce (piezas SVG generadas por código, spec §8.4). */
export type Escena = {
  vista: VistaEscena
  vehiculos: VehiculoEscena[]
  senales: SenalEscena[]
  zonasRiesgo?: ZonaRiesgo[]
}

/**
 * Campos comunes del ítem tal como se congela en el JSON del banco.
 *
 * `doble_puntaje` no es parte de este tipo: se calcula en tiempo de
 * ejecución a partir de `temaExamen` y `examen.config.json` (spec §8.2),
 * nunca se escribe a mano. Ver `esDoblePuntaje` en `configuracion.ts`.
 */
type ItemBase = {
  id: string
  nivel: Nivel
  unidad: string
  dificultad: 1 | 2 | 3
  temaExamen: string | null
  enunciado: string
  explicacion: string
  fuente: Fuente
  validacion: Validacion
}

type ItemPersistido<T extends { tipo: string }> = ItemBase & T

export type ItemReconocerSenales = ItemPersistido<{
  tipo: 'reconocer_senales'
  alternativas: Alternativa[]
  respuestaCorrecta: string
}>

export type ItemQuienPasaPrimero = ItemPersistido<{
  tipo: 'quien_pasa_primero'
  escena: Escena
  respuestaCorrecta: string[]
}>

export type ItemDetectarRiesgos = ItemPersistido<{
  tipo: 'detectar_riesgos'
  escena: Escena
  respuestaCorrecta: string[]
}>

export type ItemMitoORealidad = ItemPersistido<{
  tipo: 'mito_o_realidad'
  respuestaCorrecta: boolean
}>

export type ItemCompletarFrase = ItemPersistido<{
  tipo: 'completar_frase'
  alternativas: Alternativa[]
  respuestaCorrecta: string
}>

export type ItemOrdenarPasos = ItemPersistido<{
  tipo: 'ordenar_pasos'
  pasos: Alternativa[]
  respuestaCorrecta: string[]
}>

export type ItemSeleccionMultiple = ItemPersistido<{
  tipo: 'seleccion_multiple'
  alternativas: Alternativa[]
  respuestaCorrecta: string
}>

export type Item =
  | ItemReconocerSenales
  | ItemQuienPasaPrimero
  | ItemDetectarRiesgos
  | ItemMitoORealidad
  | ItemCompletarFrase
  | ItemOrdenarPasos
  | ItemSeleccionMultiple

export type TipoJuego = Item['tipo']
