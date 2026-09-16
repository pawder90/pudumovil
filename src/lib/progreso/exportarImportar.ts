/**
 * Exportar e importar el progreso como archivo, para no perderlo al
 * cambiar de celular (spec R9).
 */
import {
  db,
  type BloqueEnCurso,
  type CajaLeitner,
  type ProgresoUnidad,
  type ResultadoSimulacro,
} from './db'

const VERSION_FORMATO = 1

export type ProgresoExportado = {
  version: number
  exportadoEnISO: string
  progresoUnidad: ProgresoUnidad[]
  cajasLeitner: CajaLeitner[]
  bloqueEnCurso?: BloqueEnCurso
  simulacros: ResultadoSimulacro[]
}

type BaseDeDatos = typeof db

export async function exportarProgreso(
  baseDeDatos: BaseDeDatos = db,
): Promise<ProgresoExportado> {
  const [progresoUnidad, cajasLeitner, bloqueEnCurso, simulacros] = await Promise.all([
    baseDeDatos.progresoUnidad.toArray(),
    baseDeDatos.cajasLeitner.toArray(),
    baseDeDatos.bloqueEnCurso.get('actual'),
    baseDeDatos.simulacros.toArray(),
  ])
  return {
    version: VERSION_FORMATO,
    exportadoEnISO: new Date().toISOString(),
    progresoUnidad,
    cajasLeitner,
    bloqueEnCurso,
    simulacros,
  }
}

export class ProgresoInvalidoError extends Error {}

function validarProgreso(datos: unknown): asserts datos is ProgresoExportado {
  if (typeof datos !== 'object' || datos === null) {
    throw new ProgresoInvalidoError('El archivo no tiene un progreso válido')
  }
  const d = datos as Record<string, unknown>
  if (d.version !== VERSION_FORMATO) {
    throw new ProgresoInvalidoError(
      `Este archivo es de otra versión del progreso (${String(d.version)}), no se puede importar`,
    )
  }
  if (
    !Array.isArray(d.progresoUnidad) ||
    !Array.isArray(d.cajasLeitner) ||
    !Array.isArray(d.simulacros)
  ) {
    throw new ProgresoInvalidoError('El archivo no tiene un progreso válido')
  }
}

/**
 * Reemplaza todo el progreso local por el del archivo. Se usa al recuperar
 * el progreso en un celular nuevo (spec R9).
 */
export async function importarProgreso(
  datos: unknown,
  baseDeDatos: BaseDeDatos = db,
): Promise<void> {
  validarProgreso(datos)
  await baseDeDatos.transaction(
    'rw',
    [
      baseDeDatos.progresoUnidad,
      baseDeDatos.cajasLeitner,
      baseDeDatos.bloqueEnCurso,
      baseDeDatos.simulacros,
    ],
    async () => {
      await Promise.all([
        baseDeDatos.progresoUnidad.clear(),
        baseDeDatos.cajasLeitner.clear(),
        baseDeDatos.bloqueEnCurso.clear(),
        baseDeDatos.simulacros.clear(),
      ])
      await baseDeDatos.progresoUnidad.bulkAdd(datos.progresoUnidad)
      await baseDeDatos.cajasLeitner.bulkAdd(datos.cajasLeitner)
      if (datos.bloqueEnCurso) await baseDeDatos.bloqueEnCurso.add(datos.bloqueEnCurso)
      await baseDeDatos.simulacros.bulkAdd(datos.simulacros)
    },
  )
}

/** Nombre de archivo sugerido para la descarga, con la fecha de hoy. */
export function nombreArchivoExportacion(hoy = new Date()): string {
  return `pudumovil-progreso-${hoy.toISOString().slice(0, 10)}.json`
}

/**
 * Dispara la descarga del progreso como archivo `.json` en el navegador.
 * Separado de `exportarProgreso` para que la lógica de datos se pueda
 * probar sin DOM.
 */
export async function descargarProgreso(baseDeDatos: BaseDeDatos = db): Promise<void> {
  const datos = await exportarProgreso(baseDeDatos)
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  try {
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = nombreArchivoExportacion()
    enlace.click()
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Lee un `File` elegido por la persona usuaria e importa su progreso. */
export async function importarProgresoDesdeArchivo(
  archivo: File,
  baseDeDatos: BaseDeDatos = db,
): Promise<void> {
  const texto = await archivo.text()
  let datos: unknown
  try {
    datos = JSON.parse(texto)
  } catch {
    throw new ProgresoInvalidoError('El archivo no es un JSON válido')
  }
  await importarProgreso(datos, baseDeDatos)
}
