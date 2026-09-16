import { beforeEach, describe, expect, it } from 'vitest'
import { crearBaseDeDatosParaPruebas } from './db'
import {
  bloqueActualDeUnidad,
  bloqueDeRepasoDelDia,
  dominioDeUnidad,
  estadoDeUnidad,
  guardarBloqueEnCurso,
  limpiarBloqueEnCurso,
  marcarBloqueActual,
  marcarEstadoUnidad,
  obtenerBloqueEnCurso,
  registrarResultadoSimulacro,
  registrarRespuesta,
  ultimosSimulacros,
} from './repositorio'

let baseDeDatos: ReturnType<typeof crearBaseDeDatosParaPruebas>

beforeEach(async () => {
  baseDeDatos = crearBaseDeDatosParaPruebas(`pruebas-${Math.random()}`)
  await baseDeDatos.open()
})

describe('registrarRespuesta', () => {
  it('crea la ficha del ítem en la caja 1 y la sube con una respuesta correcta', async () => {
    await registrarRespuesta('item-1', 'senales-basicas', true, baseDeDatos)
    const ficha = await baseDeDatos.cajasLeitner.get('item-1')
    expect(ficha?.caja).toBe(2)
    expect(ficha?.unidad).toBe('senales-basicas')
  })

  it('vuelve a la caja 1 con una respuesta incorrecta, aunque venía de una caja alta', async () => {
    await baseDeDatos.cajasLeitner.put({
      itemId: 'item-1',
      unidad: 'senales-basicas',
      caja: 4,
      proximoRepaso: '2026-01-01',
    })
    await registrarRespuesta('item-1', 'senales-basicas', false, baseDeDatos)
    const ficha = await baseDeDatos.cajasLeitner.get('item-1')
    expect(ficha?.caja).toBe(1)
  })
})

describe('dominioDeUnidad', () => {
  it('calcula el dominio solo con las cajas de esa unidad', async () => {
    await baseDeDatos.cajasLeitner.bulkPut([
      { itemId: 'a', unidad: 'u1', caja: 5, proximoRepaso: '2099-01-01' },
      { itemId: 'b', unidad: 'otra-unidad', caja: 5, proximoRepaso: '2099-01-01' },
    ])
    const dominio = await dominioDeUnidad('u1', ['a', 'c'], baseDeDatos)
    // a: dominado (1.0), c: nunca visto (0) -> promedio 0.5
    expect(dominio).toBeCloseTo(0.5)
  })
})

describe('bloqueDeRepasoDelDia', () => {
  it('trae solo los ítems vencidos', async () => {
    await baseDeDatos.cajasLeitner.bulkPut([
      { itemId: 'vencido', unidad: 'u1', caja: 1, proximoRepaso: '2020-01-01' },
      { itemId: 'futuro', unidad: 'u1', caja: 1, proximoRepaso: '2099-01-01' },
    ])
    const bloque = await bloqueDeRepasoDelDia(baseDeDatos)
    expect(bloque).toEqual(['vencido'])
  })
})

describe('bloqueEnCurso', () => {
  it('se guarda, se recupera y se puede limpiar', async () => {
    expect(await obtenerBloqueEnCurso(baseDeDatos)).toBeUndefined()

    await guardarBloqueEnCurso(
      {
        leccionId: 'l1',
        unidad: 'u1',
        indiceBloque: 0,
        colaItems: ['a', 'b'],
        indiceActual: 1,
        respuestas: [{ itemId: 'a', correcta: true }],
      },
      baseDeDatos,
    )
    const bloque = await obtenerBloqueEnCurso(baseDeDatos)
    expect(bloque?.indiceActual).toBe(1)

    await limpiarBloqueEnCurso(baseDeDatos)
    expect(await obtenerBloqueEnCurso(baseDeDatos)).toBeUndefined()
  })
})

describe('estadoDeUnidad / marcarEstadoUnidad', () => {
  it('no tiene estado hasta que se marca uno', async () => {
    expect(await estadoDeUnidad('u1', baseDeDatos)).toBeUndefined()
  })

  it('guarda y sobrescribe el estado de la unidad', async () => {
    await marcarEstadoUnidad('u1', 1, 'en_curso', baseDeDatos)
    expect(await estadoDeUnidad('u1', baseDeDatos)).toBe('en_curso')

    await marcarEstadoUnidad('u1', 1, 'completada', baseDeDatos)
    expect(await estadoDeUnidad('u1', baseDeDatos)).toBe('completada')
  })
})

describe('bloqueActualDeUnidad / marcarBloqueActual', () => {
  it('empieza en el bloque 0 mientras no se haya avanzado', async () => {
    expect(await bloqueActualDeUnidad('u1', baseDeDatos)).toBe(0)
  })

  it('avanza el bloque pendiente sin perder el estado de la unidad', async () => {
    await marcarEstadoUnidad('u1', 1, 'en_curso', baseDeDatos)
    await marcarBloqueActual('u1', 1, baseDeDatos)

    expect(await bloqueActualDeUnidad('u1', baseDeDatos)).toBe(1)
    expect(await estadoDeUnidad('u1', baseDeDatos)).toBe('en_curso')
  })
})

describe('simulacros', () => {
  it('registra resultados y devuelve los últimos n como fracción del puntaje máximo', async () => {
    await registrarResultadoSimulacro(
      {
        tipo: 'completo',
        puntaje: 30,
        puntajeMax: 38,
        aprobado: false,
        erroresItemIds: ['a'],
      },
      baseDeDatos,
    )
    await registrarResultadoSimulacro(
      {
        tipo: 'completo',
        puntaje: 35,
        puntajeMax: 38,
        aprobado: true,
        erroresItemIds: [],
      },
      baseDeDatos,
    )
    const ultimos = await ultimosSimulacros('completo', 3, baseDeDatos)
    expect(ultimos).toHaveLength(2)
    expect(ultimos.every((f) => f > 0 && f <= 1)).toBe(true)
  })
})
