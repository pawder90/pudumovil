/**
 * Simulacro completo (spec §5.7, R6): réplica del examen real. 35 preguntas
 * tomadas de los niveles ya completados, 3 de doble puntaje (una por cada
 * tema elegible), 45 minutos y aprobación fija de 33 de 38 puntos. Sin
 * explicaciones durante el examen; al terminar muestra el puntaje y la
 * revisión de cada error con su explicación.
 */
import { useEffect, useMemo, useState } from 'react'
import { configuracionExamen } from '@/lib/contenido/configuracion'
import { esCorrecta, letraDeOpcion, opcionesDelItem } from '@/lib/contenido/juego'
import { armarSimulacroCompleto, puntajeMaximo, type PreguntaSimulacro } from '@/lib/contenido/simulacro'
import type { Item } from '@/lib/contenido/tipos'
import { registrarResultadoSimulacro } from '@/lib/progreso/repositorio'
import { Alternativa, BarraProgresoBloque, Boton, Icono, Pudumovil } from '@/components'
import './simulacro-completo.css'

type Props = {
  items: Item[]
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

export function SimulacroCompleto({ items, onSalir, onTerminado }: Props) {
  const preguntas = useMemo(
    () =>
      armarSimulacroCompleto(
        items,
        configuracionExamen.simulacroCompleto.preguntas,
        configuracionExamen.temasDoblePuntaje,
      ),
    [items],
  )
  const [indice, setIndice] = useState(0)
  const [seleccion, setSeleccion] = useState<string | null>(null)
  const [respuestas, setRespuestas] = useState<Respuesta[]>([])
  const [segundosRestantes, setSegundosRestantes] = useState(
    configuracionExamen.simulacroCompleto.minutos * 60,
  )
  const [terminado, setTerminado] = useState(false)

  const puntajeMax = puntajeMaximo(preguntas)
  const aprobacion = configuracionExamen.simulacroCompleto.aprobacion

  async function finalizar(respuestasCompletas: Respuesta[]) {
    const puntaje = respuestasCompletas.reduce(
      (acc, r, i) => acc + (r.correcta ? (preguntas[i].doblePuntaje ? 2 : 1) : 0),
      0,
    )
    const erroresItemIds = respuestasCompletas.filter((r) => !r.correcta).map((r) => r.itemId)
    await registrarResultadoSimulacro({
      tipo: 'completo',
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
      <div className="simulacro-completo simulacro-completo-revision">
        <Pudumovil estado={aprobado ? 'celebrando' : 'animando'} tamano={120} alt="" />
        <h1 className="simulacro-completo-resultado-titulo">
          {aprobado ? '¡Aprobaste el simulacro completo!' : 'Todavía no alcanza'}
        </h1>
        <p className="simulacro-completo-resultado-puntaje">
          {puntaje} de {puntajeMax} puntos · se necesitan {aprobacion}
        </p>

        {errores.length > 0 && (
          <div className="simulacro-completo-errores">
            <h2 className="simulacro-completo-errores-titulo">Revisión de errores</h2>
            {errores.map((respuesta) => {
              const pregunta = preguntasPorId.get(respuesta.itemId) as PreguntaSimulacro
              const opciones = opcionesDelItem(pregunta.item)
              return (
                <div key={respuesta.itemId} className="simulacro-completo-error">
                  <p className="simulacro-completo-error-enunciado">{pregunta.item.enunciado}</p>
                  <div className="simulacro-completo-error-opciones">
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
                  <p className="simulacro-completo-error-explicacion">{pregunta.item.explicacion}</p>
                  <p className="simulacro-completo-error-referencia">
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
    <div className="simulacro-completo">
      <div className="simulacro-completo-encabezado">
        <BarraProgresoBloque actual={indice} total={preguntas.length} onCerrar={onSalir} />
        <p className="simulacro-completo-tiempo" aria-live="polite">
          <Icono nombre="cronometro" tamano={20} />
          {formatoTiempo(segundosRestantes)}
        </p>
      </div>

      <div className="simulacro-completo-pregunta">
        <p className="simulacro-completo-enunciado">{pregunta.item.enunciado}</p>
        {pregunta.doblePuntaje && (
          <p className="simulacro-completo-doble">
            <Icono nombre="trofeo" tamano={20} />
            Vale doble puntaje
          </p>
        )}
      </div>

      <div className="simulacro-completo-opciones">
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
