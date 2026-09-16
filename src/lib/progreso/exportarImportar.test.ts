import { beforeEach, describe, expect, it } from 'vitest'
import { crearBaseDeDatosParaPruebas } from './db'
import {
  exportarProgreso,
  importarProgreso,
  ProgresoInvalidoError,
} from './exportarImportar'

let origen: ReturnType<typeof crearBaseDeDatosParaPruebas>
let destino: ReturnType<typeof crearBaseDeDatosParaPruebas>

beforeEach(async () => {
  origen = crearBaseDeDatosParaPruebas(`origen-${Math.random()}`)
  destino = crearBaseDeDatosParaPruebas(`destino-${Math.random()}`)
  await Promise.all([origen.open(), destino.open()])
})

describe('exportarProgreso / importarProgreso', () => {
  it('lleva todo el progreso de una base de datos a otra', async () => {
    await origen.progresoUnidad.put({ unidad: 'u1', nivel: 1, estado: 'completada' })
    await origen.cajasLeitner.put({
      itemId: 'a',
      unidad: 'u1',
      caja: 3,
      proximoRepaso: '2026-01-01',
    })
    await origen.simulacros.add({
      tipo: 'mini',
      nivel: 1,
      fechaISO: '2026-01-01',
      puntaje: 14,
      puntajeMax: 15,
      aprobado: true,
      erroresItemIds: [],
    })

    const exportado = await exportarProgreso(origen)
    await importarProgreso(exportado, destino)

    expect(await destino.progresoUnidad.toArray()).toEqual(
      await origen.progresoUnidad.toArray(),
    )
    expect(await destino.cajasLeitner.toArray()).toEqual(
      await origen.cajasLeitner.toArray(),
    )
    const simulacrosDestino = await destino.simulacros.toArray()
    expect(simulacrosDestino).toHaveLength(1)
    expect(simulacrosDestino[0].puntaje).toBe(14)
  })

  it('reemplaza el progreso existente en vez de sumarlo', async () => {
    await destino.progresoUnidad.put({ unidad: 'viejo', nivel: 1, estado: 'completada' })
    const exportado = await exportarProgreso(origen) // origen está vacío

    await importarProgreso(exportado, destino)

    expect(await destino.progresoUnidad.toArray()).toEqual([])
  })

  it('rechaza un archivo sin el formato esperado', async () => {
    await expect(importarProgreso({ foo: 'bar' }, destino)).rejects.toThrow(
      ProgresoInvalidoError,
    )
  })

  it('rechaza un archivo de otra versión', async () => {
    await expect(
      importarProgreso(
        { version: 99, progresoUnidad: [], cajasLeitner: [], simulacros: [] },
        destino,
      ),
    ).rejects.toThrow(ProgresoInvalidoError)
  })
})
