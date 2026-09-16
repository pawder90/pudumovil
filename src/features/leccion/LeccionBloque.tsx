/**
 * Un bloque de lección jugable (spec R2, R3, R5): sirve las preguntas de un
 * tramo de la unidad, comprueba la respuesta, muestra la explicación con
 * referencia al libro y guarda el progreso en Dexie/Leitner al terminar.
 *
 * Solo entiende los tipos de juego que hoy tiene el banco del Nivel 1:
 * selección múltiple, completar la frase y mito o realidad (spec §6, fase 1).
 */
import { useEffect, useState } from 'react'
import { NUM_BLOQUES_LECCION, itemsDelBloque } from '@/lib/contenido/banco'
import { esCorrecta, letraDeOpcion, opcionesDelItem } from '@/lib/contenido/juego'
import type { Item } from '@/lib/contenido/tipos'
import type { BloqueEnCurso } from '@/lib/progreso/db'
import {
  guardarBloqueEnCurso,
  limpiarBloqueEnCurso,
  marcarBloqueActual,
  marcarEstadoUnidad,
  obtenerBloqueEnCurso,
  registrarRespuesta,
} from '@/lib/progreso/repositorio'
import {
  Alternativa,
  BarraProgresoBloque,
  Boton,
  HojaFeedback,
  Pudumovil,
  type EstadoAlternativa,
} from '@/components'
import './leccion-bloque.css'

type Props = {
  unidad: string
  nivel: number
  indiceBloque: number
  onSalir: () => void
  onCompletado: () => void
}

function idLeccion(unidad: string, indiceBloque: number): string {
  return `${unidad}-b${indiceBloque}`
}

export function LeccionBloque({ unidad, nivel, indiceBloque, onSalir, onCompletado }: Props) {
  const [bloque, setBloque] = useState<BloqueEnCurso | null>(null)
  const [items, setItems] = useState<Map<string, Item>>(new Map())
  const [seleccion, setSeleccion] = useState<string | null>(null)
  const [resultado, setResultado] = useState<boolean | null>(null)
  const [terminado, setTerminado] = useState(false)

  useEffect(() => {
    let cancelado = false

    async function cargar() {
      const leccionId = idLeccion(unidad, indiceBloque)
      const enCurso = await obtenerBloqueEnCurso()
      const itemsBloque = itemsDelBloque(unidad, indiceBloque)
      const mapaItems = new Map(itemsBloque.map((item) => [item.id, item]))

      let inicial: BloqueEnCurso
      if (enCurso && enCurso.leccionId === leccionId) {
        inicial = enCurso
      } else {
        inicial = {
          id: 'actual',
          leccionId,
          unidad,
          indiceBloque,
          colaItems: itemsBloque.map((item) => item.id),
          indiceActual: 0,
          respuestas: [],
        }
        await guardarBloqueEnCurso(inicial)
      }
      await marcarEstadoUnidad(unidad, nivel, 'en_curso')

      if (!cancelado) {
        setItems(mapaItems)
        setBloque(inicial)
      }
    }

    cargar()
    return () => {
      cancelado = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unidad, indiceBloque])

  if (!bloque || terminado) {
    if (terminado) {
      return (
        <div className="leccion-bloque leccion-bloque-fin">
          <Pudumovil estado="celebrando" tamano={140} />
          <h2 className="leccion-bloque-fin-titulo">¡Bloque completado!</h2>
          <p className="leccion-bloque-fin-nota">Tu avance quedó guardado.</p>
          <Boton anchoCompleto onClick={onCompletado}>
            Continuar
          </Boton>
        </div>
      )
    }
    return (
      <div className="leccion-bloque leccion-bloque-cargando">
        <Pudumovil estado="neutral" tamano={96} />
      </div>
    )
  }

  const itemActualId = bloque.colaItems[bloque.indiceActual]
  const itemActual = items.get(itemActualId)
  const totalOriginal = items.size
  const resueltos = new Set(bloque.respuestas.filter((r) => r.correcta).map((r) => r.itemId)).size

  if (!itemActual) {
    return null
  }

  const opciones = opcionesDelItem(itemActual)

  const estadoDeOpcion = (opcionId: string): EstadoAlternativa => {
    if (resultado === null) {
      return seleccion === opcionId ? 'seleccionada' : 'reposo'
    }
    // Muestra siempre cuál era la correcta, no solo si la elegida estaba mal.
    if (esCorrecta(itemActual, opcionId)) return 'correcta'
    if (opcionId === seleccion) return 'incorrecta'
    return 'reposo'
  }

  async function comprobar() {
    if (!seleccion || !itemActual) return
    const correcta = esCorrecta(itemActual, seleccion)
    setResultado(correcta)
    await registrarRespuesta(itemActual.id, unidad, correcta)
  }

  async function continuar() {
    if (!bloque || !itemActual || resultado === null) return

    const colaItems = resultado ? bloque.colaItems : [...bloque.colaItems, itemActual.id]
    const siguiente: BloqueEnCurso = {
      ...bloque,
      colaItems,
      indiceActual: bloque.indiceActual + 1,
      respuestas: [...bloque.respuestas, { itemId: itemActual.id, correcta: resultado }],
    }

    setSeleccion(null)
    setResultado(null)

    if (siguiente.indiceActual >= siguiente.colaItems.length) {
      await limpiarBloqueEnCurso()
      if (indiceBloque === NUM_BLOQUES_LECCION - 1) {
        await marcarEstadoUnidad(unidad, nivel, 'completada')
      } else {
        await marcarBloqueActual(unidad, indiceBloque + 1)
      }
      setTerminado(true)
      return
    }

    await guardarBloqueEnCurso(siguiente)
    setBloque(siguiente)
  }

  return (
    <div className="leccion-bloque">
      <BarraProgresoBloque actual={resueltos} total={totalOriginal} onCerrar={onSalir} />

      <div className="leccion-bloque-pregunta">
        <Pudumovil estado="explicando" tamano={72} alt="" />
        <p className="leccion-bloque-enunciado">{itemActual.enunciado}</p>
      </div>

      <div className="leccion-bloque-opciones">
        {opciones.map((opcion, indice) => (
          <Alternativa
            key={opcion.id}
            letra={letraDeOpcion(itemActual, opcion, indice)}
            estado={estadoDeOpcion(opcion.id)}
            disabled={resultado !== null}
            onClick={() => setSeleccion(opcion.id)}
          >
            {opcion.texto}
          </Alternativa>
        ))}
      </div>

      {resultado === null && (
        <Boton anchoCompleto disabled={!seleccion} onClick={comprobar}>
          Comprobar
        </Boton>
      )}

      <HojaFeedback
        veredicto={resultado ? 'correcto' : 'incorrecto'}
        titulo={resultado ? '¡Bien hecho!' : 'No era esa'}
        explicacion={<p>{itemActual.explicacion}</p>}
        referencia={itemActual.fuente}
        abierta={resultado !== null}
        expandida
        onContinuar={continuar}
      />
    </div>
  )
}
