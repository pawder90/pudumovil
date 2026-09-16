/**
 * Punto de entrada mínimo para probar una lección real de punta a punta
 * (etapa 4). Todavía no es el camino de niveles de la spec (R1): es un
 * listado plano de las unidades del Nivel 1 y sus 3 bloques, suficiente
 * para elegir uno y jugarlo con datos del banco.
 */
import { useEffect, useState } from 'react'
import { NUM_BLOQUES_LECCION } from '@/lib/contenido/banco'
import type { EstadoUnidad } from '@/lib/progreso/db'
import { estadoDeUnidad } from '@/lib/progreso/repositorio'
import { Boton } from '@/components'
import { LeccionBloque } from './LeccionBloque'
import './pagina-leccion.css'

const NIVEL = 1
const UNIDADES_NIVEL_1 = [
  { slug: 'funcionamiento-del-automovil', titulo: 'Funcionamiento del automóvil' },
  { slug: 'elementos-de-seguridad', titulo: 'Elementos de seguridad' },
  { slug: 'ninas-y-ninos-en-el-automovil', titulo: 'Niñas y niños en el automóvil' },
  { slug: 'senales-de-transito-basicas', titulo: 'Señales de tránsito básicas' },
]

const ETIQUETA_ESTADO: Record<EstadoUnidad, string> = {
  bloqueada: 'Sin empezar',
  disponible: 'Sin empezar',
  en_curso: 'En curso',
  completada: 'Completada',
}

export function PaginaLeccion() {
  const [seleccion, setSeleccion] = useState<{ unidad: string; indiceBloque: number } | null>(
    null,
  )
  const [estados, setEstados] = useState<Record<string, EstadoUnidad>>({})

  async function cargarEstados() {
    const entradas = await Promise.all(
      UNIDADES_NIVEL_1.map(async ({ slug }) => [slug, await estadoDeUnidad(slug)] as const),
    )
    const conocidos = entradas.filter(
      (entrada): entrada is [string, EstadoUnidad] => entrada[1] !== undefined,
    )
    setEstados(Object.fromEntries(conocidos))
  }

  useEffect(() => {
    cargarEstados()
  }, [])

  if (seleccion) {
    return (
      <LeccionBloque
        unidad={seleccion.unidad}
        nivel={NIVEL}
        indiceBloque={seleccion.indiceBloque}
        onSalir={() => {
          setSeleccion(null)
          cargarEstados()
        }}
        onCompletado={() => {
          setSeleccion(null)
          cargarEstados()
        }}
      />
    )
  }

  return (
    <div className="pagina-leccion">
      <header className="pagina-leccion-encabezado">
        <h1 className="pagina-leccion-titulo">Nivel 1 · Fundamentos</h1>
      </header>

      {UNIDADES_NIVEL_1.map(({ slug, titulo }) => (
        <section key={slug} className="pagina-leccion-unidad">
          <div className="pagina-leccion-unidad-encabezado">
            <h2 className="pagina-leccion-unidad-titulo">{titulo}</h2>
            <span className="pagina-leccion-unidad-estado">
              {ETIQUETA_ESTADO[estados[slug] ?? 'bloqueada']}
            </span>
          </div>
          <div className="pagina-leccion-bloques">
            {Array.from({ length: NUM_BLOQUES_LECCION }, (_, indice) => (
              <Boton
                key={indice}
                variante="secundario"
                onClick={() => setSeleccion({ unidad: slug, indiceBloque: indice })}
              >
                Bloque {indice + 1}
              </Boton>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
