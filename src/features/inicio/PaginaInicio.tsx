/**
 * Pantalla de inicio (spec R1): camino de niveles con el estado de cada
 * unidad, la barra de preparación, y navegación a la lección pendiente al
 * tocar una unidad disponible.
 *
 * Solo el Nivel 1 tiene banco de ítems por ahora; los niveles 2 a 5 se
 * muestran como bloqueados hasta que tengan su propio contenido (etapas
 * futuras), sin inventar unidades que todavía no existen.
 */
import { useEffect, useState } from 'react'
import { banco, itemsPorUnidad, NUM_BLOQUES_LECCION } from '@/lib/contenido/banco'
import { configuracionExamen } from '@/lib/contenido/configuracion'
import type { Nivel } from '@/lib/contenido/tipos'
import type { EstadoUnidad } from '@/lib/progreso/db'
import {
  bloqueActualDeUnidad,
  bloqueDeRepasoDelDia,
  dominioDeUnidad,
  estadoDeUnidad,
  ultimosSimulacros,
} from '@/lib/progreso/repositorio'
import { calcularBarraPreparacion } from '@/lib/progreso/preparacion'
import {
  BarraPreparacion,
  Icono,
  NodoCamino,
  type DesplazamientoNodo,
  type EstadoNodo,
} from '@/components'
import { LeccionBloque } from '../leccion/LeccionBloque'
import { MiniSimulacro } from '../simulacro/MiniSimulacro'
import { SimulacroCompleto } from '../simulacro/SimulacroCompleto'
import { RepasoDiario } from '../repaso/RepasoDiario'
import './pagina-inicio.css'

/**
 * El simulacro completo se habilita al terminar el Nivel 3 (spec §5.7),
 * pero ese nivel todavía no tiene banco de ítems. Se activa solo cuando el
 * banco ya trae contenido del Nivel 3, para no inventar una condición sobre
 * unidades que no existen.
 */
const NIVEL_3_TIENE_CONTENIDO = banco.some((item) => item.nivel === 3)

const NIVEL_1_UNIDADES = [
  { slug: 'funcionamiento-del-automovil', titulo: 'Funcionamiento del automóvil' },
  { slug: 'elementos-de-seguridad', titulo: 'Elementos de seguridad' },
  { slug: 'ninas-y-ninos-en-el-automovil', titulo: 'Niñas y niños en el automóvil' },
  { slug: 'senales-de-transito-basicas', titulo: 'Señales de tránsito básicas' },
] as const

const NIVELES_BLOQUEADOS = [
  { nivel: 2, nombre: 'La persona que conduce' },
  { nivel: 3, nombre: 'Las reglas' },
  { nivel: 4, nombre: 'Maniobras y contextos' },
  { nivel: 5, nombre: 'Física y responsabilidad' },
] as const

const DESPLAZAMIENTOS: DesplazamientoNodo[] = ['centro', 'derecha', 'centro', 'izquierda']

const NODO_POR_ESTADO: Record<EstadoUnidad, EstadoNodo> = {
  bloqueada: 'bloqueado',
  disponible: 'actual',
  en_curso: 'actual',
  completada: 'completado',
}

type InfoUnidad = {
  slug: string
  titulo: string
  estado: EstadoUnidad
  bloqueActual: number
  dominio: number
}

type Preparacion = {
  porcentaje: number
  listaParaExamen: boolean
  mensajePendiente?: string
}

async function cargarUnidades(): Promise<InfoUnidad[]> {
  const infos: InfoUnidad[] = []
  let anteriorCompletada = true

  for (const { slug, titulo } of NIVEL_1_UNIDADES) {
    const estadoGuardado = await estadoDeUnidad(slug)
    const estado: EstadoUnidad = estadoGuardado ?? (anteriorCompletada ? 'disponible' : 'bloqueada')
    const bloqueActual = await bloqueActualDeUnidad(slug)
    const ids = itemsPorUnidad(slug).map((item) => item.id)
    const dominio = await dominioDeUnidad(slug, ids)

    infos.push({ slug, titulo, estado, bloqueActual, dominio })
    anteriorCompletada = estado === 'completada'
  }

  return infos
}

async function cargarPreparacion(unidades: InfoUnidad[]): Promise<Preparacion> {
  const cobertura = unidades.filter((u) => u.estado === 'completada').length / unidades.length
  const dominioPromedio = unidades.reduce((acc, u) => acc + u.dominio, 0) / unidades.length
  // Antes del primer simulacro completo, se usan los mini-simulacros (spec §5.6).
  let simulacros = await ultimosSimulacros('completo')
  if (simulacros.length === 0) {
    simulacros = await ultimosSimulacros('mini')
  }

  return calcularBarraPreparacion({
    cobertura,
    dominioPromedio,
    ultimosSimulacros: simulacros,
    puntajeAprobacionSimulacro: configuracionExamen.simulacroCompleto.aprobacion,
    dominioPorUnidad: unidades.map((u) => ({ unidad: u.slug, nombre: u.titulo, dominio: u.dominio })),
  })
}

type Seleccion =
  | { tipo: 'leccion'; unidad: string; indiceBloque: number }
  | { tipo: 'simulacro'; nivel: Nivel }
  | { tipo: 'simulacro-completo' }
  | { tipo: 'repaso'; itemIds: string[] }

export function PaginaInicio() {
  const [unidades, setUnidades] = useState<InfoUnidad[] | null>(null)
  const [preparacion, setPreparacion] = useState<Preparacion | null>(null)
  const [repasoPendiente, setRepasoPendiente] = useState<string[]>([])
  const [seleccion, setSeleccion] = useState<Seleccion | null>(null)

  async function cargar() {
    const infos = await cargarUnidades()
    setUnidades(infos)
    setPreparacion(await cargarPreparacion(infos))
    setRepasoPendiente(await bloqueDeRepasoDelDia())
  }

  useEffect(() => {
    cargar()
  }, [])

  function salirDeSeleccion() {
    setSeleccion(null)
    cargar()
  }

  if (seleccion?.tipo === 'leccion') {
    return (
      <LeccionBloque
        unidad={seleccion.unidad}
        nivel={1}
        indiceBloque={seleccion.indiceBloque}
        onSalir={salirDeSeleccion}
        onCompletado={salirDeSeleccion}
      />
    )
  }

  if (seleccion?.tipo === 'simulacro') {
    return (
      <MiniSimulacro nivel={seleccion.nivel} onSalir={salirDeSeleccion} onTerminado={salirDeSeleccion} />
    )
  }

  if (seleccion?.tipo === 'simulacro-completo') {
    return <SimulacroCompleto items={banco} onSalir={salirDeSeleccion} onTerminado={salirDeSeleccion} />
  }

  if (seleccion?.tipo === 'repaso') {
    return (
      <RepasoDiario
        itemIds={seleccion.itemIds}
        onSalir={salirDeSeleccion}
        onTerminado={salirDeSeleccion}
      />
    )
  }

  if (!unidades || !preparacion) {
    return <div className="pagina-inicio-cargando" aria-busy="true" />
  }

  const nivel1Completo = unidades.every((u) => u.estado === 'completada')

  return (
    <div className="pagina-inicio">
      <BarraPreparacion
        porcentaje={preparacion.porcentaje}
        lista={preparacion.listaParaExamen}
        nota={preparacion.mensajePendiente}
      />

      {repasoPendiente.length > 0 && (
        <button
          type="button"
          className="pagina-inicio-repaso"
          onClick={() => setSeleccion({ tipo: 'repaso', itemIds: repasoPendiente })}
        >
          <Icono nombre="repetir" tamano={28} />
          <span className="pagina-inicio-repaso-texto">
            <span className="pagina-inicio-repaso-titulo">Repaso diario</span>
            <span className="pagina-inicio-repaso-nota">
              {repasoPendiente.length} ítem{repasoPendiente.length === 1 ? '' : 's'} por repasar hoy
            </span>
          </span>
        </button>
      )}

      <section className="pagina-inicio-nivel">
        <h2 className="pagina-inicio-nivel-titulo">Nivel 1 · Fundamentos</h2>
        <div className="pagina-inicio-camino">
          {unidades.map((unidad, indice) => (
            <NodoCamino
              key={unidad.slug}
              estado={NODO_POR_ESTADO[unidad.estado]}
              etiqueta={unidad.titulo}
              desplazamiento={DESPLAZAMIENTOS[indice % DESPLAZAMIENTOS.length]}
              onClick={() =>
                setSeleccion({
                  tipo: 'leccion',
                  unidad: unidad.slug,
                  indiceBloque: Math.min(unidad.bloqueActual, NUM_BLOQUES_LECCION - 1),
                })
              }
            />
          ))}
          <NodoCamino
            estado={nivel1Completo ? 'simulacro' : 'bloqueado'}
            etiqueta="Mini-simulacro"
            desplazamiento={DESPLAZAMIENTOS[unidades.length % DESPLAZAMIENTOS.length]}
            onClick={() => setSeleccion({ tipo: 'simulacro', nivel: 1 })}
          />
        </div>
      </section>

      <section className="pagina-inicio-nivel">
        <h2 className="pagina-inicio-nivel-titulo">Simulacro completo</h2>
        <div className="pagina-inicio-camino">
          <NodoCamino
            estado={NIVEL_3_TIENE_CONTENIDO ? 'simulacro-completo' : 'bloqueado'}
            etiqueta={
              NIVEL_3_TIENE_CONTENIDO ? 'Simulacro completo' : 'Se habilita al terminar el Nivel 3'
            }
            onClick={() => setSeleccion({ tipo: 'simulacro-completo' })}
          />
        </div>
      </section>

      {NIVELES_BLOQUEADOS.map(({ nivel, nombre }) => (
        <section key={nivel} className="pagina-inicio-nivel">
          <h2 className="pagina-inicio-nivel-titulo">
            Nivel {nivel} · {nombre}
          </h2>
          <div className="pagina-inicio-camino">
            <NodoCamino estado="bloqueado" etiqueta="Termina el nivel anterior" />
          </div>
        </section>
      ))}
    </div>
  )
}
