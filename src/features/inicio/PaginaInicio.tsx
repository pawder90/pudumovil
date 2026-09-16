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
import { itemsPorUnidad, NUM_BLOQUES_LECCION } from '@/lib/contenido/banco'
import { configuracionExamen } from '@/lib/contenido/configuracion'
import type { EstadoUnidad } from '@/lib/progreso/db'
import {
  bloqueActualDeUnidad,
  dominioDeUnidad,
  estadoDeUnidad,
  ultimosSimulacros,
} from '@/lib/progreso/repositorio'
import { calcularBarraPreparacion } from '@/lib/progreso/preparacion'
import {
  BarraPreparacion,
  NodoCamino,
  type DesplazamientoNodo,
  type EstadoNodo,
} from '@/components'
import { LeccionBloque } from '../leccion/LeccionBloque'
import './pagina-inicio.css'

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
  const simulacros = await ultimosSimulacros('completo')

  return calcularBarraPreparacion({
    cobertura,
    dominioPromedio,
    ultimosSimulacros: simulacros,
    puntajeAprobacionSimulacro: configuracionExamen.simulacroCompleto.aprobacion,
    dominioPorUnidad: unidades.map((u) => ({ unidad: u.slug, nombre: u.titulo, dominio: u.dominio })),
  })
}

export function PaginaInicio() {
  const [unidades, setUnidades] = useState<InfoUnidad[] | null>(null)
  const [preparacion, setPreparacion] = useState<Preparacion | null>(null)
  const [seleccion, setSeleccion] = useState<{ unidad: string; indiceBloque: number } | null>(
    null,
  )

  async function cargar() {
    const infos = await cargarUnidades()
    setUnidades(infos)
    setPreparacion(await cargarPreparacion(infos))
  }

  useEffect(() => {
    cargar()
  }, [])

  if (seleccion) {
    return (
      <LeccionBloque
        unidad={seleccion.unidad}
        nivel={1}
        indiceBloque={seleccion.indiceBloque}
        onSalir={() => {
          setSeleccion(null)
          cargar()
        }}
        onCompletado={() => {
          setSeleccion(null)
          cargar()
        }}
      />
    )
  }

  if (!unidades || !preparacion) {
    return <div className="pagina-inicio-cargando" aria-busy="true" />
  }

  return (
    <div className="pagina-inicio">
      <BarraPreparacion
        porcentaje={preparacion.porcentaje}
        lista={preparacion.listaParaExamen}
        nota={preparacion.mensajePendiente}
      />

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
                  unidad: unidad.slug,
                  indiceBloque: Math.min(unidad.bloqueActual, NUM_BLOQUES_LECCION - 1),
                })
              }
            />
          ))}
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
