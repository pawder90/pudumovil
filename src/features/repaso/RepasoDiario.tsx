/**
 * Bloque de repaso diario (spec §5.8, R5): reúne los ítems vencidos de
 * cualquier unidad, empezando por las cajas más bajas, y los presenta una
 * sola vez cada uno. A diferencia del bloque de lección, un fallo no
 * reaparece en la misma sesión: vuelve a la caja 1 y reaparece al día
 * siguiente, tal como manda la sección 5.8.
 */
import { useMemo, useState } from 'react'
import { itemPorId } from '@/lib/contenido/banco'
import { esCorrecta, letraDeOpcion, opcionesDelItem } from '@/lib/contenido/juego'
import type { Item } from '@/lib/contenido/tipos'
import { registrarRespuesta } from '@/lib/progreso/repositorio'
import {
  Alternativa,
  BarraProgresoBloque,
  Boton,
  HojaFeedback,
  Pudumovil,
  type EstadoAlternativa,
} from '@/components'
import './repaso-diario.css'

type Props = {
  itemIds: string[]
  onSalir: () => void
  onTerminado: () => void
}

export function RepasoDiario({ itemIds, onSalir, onTerminado }: Props) {
  const items = useMemo(
    () => itemIds.map((id) => itemPorId(id)).filter((item): item is Item => item !== undefined),
    [itemIds],
  )
  const [indice, setIndice] = useState(0)
  const [seleccion, setSeleccion] = useState<string | null>(null)
  const [resultado, setResultado] = useState<boolean | null>(null)
  const [aciertos, setAciertos] = useState(0)
  const [terminado, setTerminado] = useState(false)

  if (items.length === 0) {
    return (
      <div className="repaso-diario repaso-diario-fin">
        <Pudumovil estado="neutral" tamano={140} />
        <h2 className="repaso-diario-fin-titulo">Nada que repasar por hoy</h2>
        <Boton anchoCompleto onClick={onTerminado}>
          Volver
        </Boton>
      </div>
    )
  }

  if (terminado) {
    return (
      <div className="repaso-diario repaso-diario-fin">
        <Pudumovil estado="celebrando" tamano={140} />
        <h2 className="repaso-diario-fin-titulo">¡Repaso completado!</h2>
        <p className="repaso-diario-fin-nota">
          {aciertos} de {items.length} correctas
        </p>
        <Boton anchoCompleto onClick={onTerminado}>
          Continuar
        </Boton>
      </div>
    )
  }

  const itemActual = items[indice]
  const opciones = opcionesDelItem(itemActual)

  const estadoDeOpcion = (opcionId: string): EstadoAlternativa => {
    if (resultado === null) {
      return seleccion === opcionId ? 'seleccionada' : 'reposo'
    }
    if (esCorrecta(itemActual, opcionId)) return 'correcta'
    if (opcionId === seleccion) return 'incorrecta'
    return 'reposo'
  }

  async function comprobar() {
    if (!seleccion) return
    const correcta = esCorrecta(itemActual, seleccion)
    setResultado(correcta)
    if (correcta) setAciertos((a) => a + 1)
    await registrarRespuesta(itemActual.id, itemActual.unidad, correcta)
  }

  function continuar() {
    setSeleccion(null)
    setResultado(null)

    if (indice + 1 >= items.length) {
      setTerminado(true)
      return
    }
    setIndice(indice + 1)
  }

  return (
    <div className="repaso-diario">
      <BarraProgresoBloque actual={indice} total={items.length} onCerrar={onSalir} />

      <div className="repaso-diario-pregunta">
        <Pudumovil estado="explicando" tamano={72} alt="" />
        <p className="repaso-diario-enunciado">{itemActual.enunciado}</p>
      </div>

      <div className="repaso-diario-opciones">
        {opciones.map((opcion, indiceOpcion) => (
          <Alternativa
            key={opcion.id}
            letra={letraDeOpcion(itemActual, opcion, indiceOpcion)}
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
