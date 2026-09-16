/**
 * Mini-simulacro de nivel (spec §5.7, R6): 15 preguntas solo de ese nivel,
 * 20 minutos, con 1 pregunta de doble puntaje si el nivel tiene un tema
 * elegible. Sin explicaciones durante el examen; al terminar muestra el
 * puntaje y la revisión de cada error con su explicación.
 */
import { useEffect, useMemo, useState } from 'react'
import { itemsPorNivel } from '@/lib/contenido/banco'
import { configuracionExamen } from '@/lib/contenido/configuracion'
import { esCorrecta, letraDeOpcion, opcionesDelItem } from '@/lib/contenido/juego'
import {
  armarMiniSimulacro,
  puntajeAprobacion,
  puntajeMaximo,
  type PreguntaSimulacro,
} from '@/lib/contenido/simulacro'
import type { Nivel } from '@/lib/contenido/tipos'
import { registrarResultadoSimulacro } from '@/lib/progreso/repositorio'
import { Alternativa, BarraProgresoBloque, Boton, Icono, Pudumovil } from '@/components'
import './mini-simulacro.css'

type Props = {
  nivel: Nivel
  onSalir: () => void
  onTerminado: () => void
}

type Respuesta = { itemId: string; opcionId: string | null; correcta: boolean }

function formatoTiempo(segundos: number): string {
  const s = Math.max(0, segundos)
  const minutos = Math.floor(s / 60)
  const resto = s % 60
  return `${minutos}:${resto.toString().padStart(2, '0')}`
}

export function MiniSimulacro({ nivel, onSalir, onTerminado }: Props) {
  const preguntas = useMemo(
    () => armarMiniSimulacro(itemsPorNivel(nivel), configuracionExamen.miniSimulacro.preguntas),
    [nivel],
  )
  const [indice, setIndice] = useState(0)
  const [seleccion, setSeleccion] = useState<string | null>(null)
  const [respuestas, setRespuestas] = useState<Respuesta[]>([])
  const [segundosRestantes, setSegundosRestantes] = useState(
    configuracionExamen.miniSimulacro.minutos * 60,
  )
  const [terminado, setTerminado] = useState(false)

  const puntajeMax = puntajeMaximo(preguntas)
  const aprobacion = puntajeAprobacion(puntajeMax, configuracionExamen.miniSimulacro.aprobacionPct)

  async function finalizar(respuestasCompletas: Respuesta[]) {
    const puntaje = respuestasCompletas.reduce(
      (acc, r, i) => acc + (r.correcta ? (preguntas[i].doblePuntaje ? 2 : 1) : 0),
      0,
    )
    const erroresItemIds = respuestasCompletas.filter((r) => !r.correcta).map((r) => r.itemId)
    await registrarResultadoSimulacro({
      tipo: 'mini',
      nivel,
      puntaje,
      puntajeMax,
      aprobado: puntaje >= aprobacion,
      erroresItemIds,
    })
    setRespuestas(respuestasCompletas)
    setTerminado(true)
  }

  useEffect(() => {
    if (terminado) return
    const id = setInterval(() => setSegundosRestantes((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [terminado])

  useEffect(() => {
    if (!terminado && segundosRestantes <= 0) {
      const faltantes: Respuesta[] = preguntas
        .slice(indice)
        .map((p) => ({ itemId: p.item.id, opcionId: null, correcta: false }))
      finalizar([...respuestas, ...faltantes])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segundosRestantes, terminado])

  function confirmar() {
    if (!seleccion) return
    const pregunta = preguntas[indice]
    const respuesta: Respuesta = {
      itemId: pregunta.item.id,
      opcionId: seleccion,
      correcta: esCorrecta(pregunta.item, seleccion),
    }
    const respuestasNuevas = [...respuestas, respuesta]
    setSeleccion(null)

    if (indice + 1 >= preguntas.length) {
      finalizar(respuestasNuevas)
    } else {
      setRespuestas(respuestasNuevas)
      setIndice(indice + 1)
    }
  }

  if (terminado) {
    const puntaje = respuestas.reduce(
      (acc, r, i) => acc + (r.correcta ? (preguntas[i].doblePuntaje ? 2 : 1) : 0),
      0,
    )
    const aprobado = puntaje >= aprobacion
    const errores = respuestas.filter((r) => !r.correcta)
    const preguntasPorId = new Map(preguntas.map((p) => [p.item.id, p] as const))

    return (
      <div className="mini-simulacro mini-simulacro-revision">
        <Pudumovil estado={aprobado ? 'celebrando' : 'animando'} tamano={120} alt="" />
        <h1 className="mini-simulacro-resultado-titulo">
          {aprobado ? '¡Aprobaste el mini-simulacro!' : 'Todavía no alcanza'}
        </h1>
        <p className="mini-simulacro-resultado-puntaje">
          {puntaje} de {puntajeMax} puntos · se necesitan {aprobacion}
        </p>

        {errores.length > 0 && (
          <div className="mini-simulacro-errores">
            <h2 className="mini-simulacro-errores-titulo">Revisión de errores</h2>
            {errores.map((respuesta) => {
              const pregunta = preguntasPorId.get(respuesta.itemId) as PreguntaSimulacro
              const opciones = opcionesDelItem(pregunta.item)
              return (
                <div key={respuesta.itemId} className="mini-simulacro-error">
                  <p className="mini-simulacro-error-enunciado">{pregunta.item.enunciado}</p>
                  <div className="mini-simulacro-error-opciones">
                    {opciones.map((opcion, indiceOpcion) => (
                      <Alternativa
                        key={opcion.id}
                        letra={letraDeOpcion(pregunta.item, opcion, indiceOpcion)}
                        disabled
                        estado={
                          esCorrecta(pregunta.item, opcion.id)
                            ? 'correcta'
                            : opcion.id === respuesta.opcionId
                              ? 'incorrecta'
                              : 'reposo'
                        }
                      >
                        {opcion.texto}
                      </Alternativa>
                    ))}
                  </div>
                  <p className="mini-simulacro-error-explicacion">{pregunta.item.explicacion}</p>
                  <p className="mini-simulacro-error-referencia">
                    <Icono nombre="libro" tamano={20} />
                    {pregunta.item.fuente.edicion} · {pregunta.item.fuente.seccion} · página{' '}
                    {pregunta.item.fuente.pagina}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        <Boton anchoCompleto onClick={onTerminado}>
          Continuar
        </Boton>
      </div>
    )
  }

  const pregunta = preguntas[indice]
  const opciones = opcionesDelItem(pregunta.item)

  return (
    <div className="mini-simulacro">
      <div className="mini-simulacro-encabezado">
        <BarraProgresoBloque actual={indice} total={preguntas.length} onCerrar={onSalir} />
        <p className="mini-simulacro-tiempo" aria-live="polite">
          <Icono nombre="cronometro" tamano={20} />
          {formatoTiempo(segundosRestantes)}
        </p>
      </div>

      <div className="mini-simulacro-pregunta">
        <p className="mini-simulacro-enunciado">{pregunta.item.enunciado}</p>
        {pregunta.doblePuntaje && (
          <p className="mini-simulacro-doble">
            <Icono nombre="trofeo" tamano={20} />
            Vale doble puntaje
          </p>
        )}
      </div>

      <div className="mini-simulacro-opciones">
        {opciones.map((opcion, indiceOpcion) => (
          <Alternativa
            key={opcion.id}
            letra={letraDeOpcion(pregunta.item, opcion, indiceOpcion)}
            estado={seleccion === opcion.id ? 'seleccionada' : 'reposo'}
            onClick={() => setSeleccion(opcion.id)}
          >
            {opcion.texto}
          </Alternativa>
        ))}
      </div>

      <Boton anchoCompleto disabled={!seleccion} onClick={confirmar}>
        {indice + 1 === preguntas.length ? 'Terminar' : 'Siguiente'}
      </Boton>
    </div>
  )
}
