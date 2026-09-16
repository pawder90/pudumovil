// Página de muestra de componentes. Reemplaza a la pantalla de verificación de la
// etapa 1 y sirve para revisar cada estado en un celular de 375 px.
// Los textos son de relleno: no enuncian normas de tránsito.
import { useEffect, useState } from 'react'
import {
  Alternativa,
  BarraNavegacion,
  BarraPreparacion,
  BarraProgresoBloque,
  Boton,
  HojaFeedback,
  NodoCamino,
  Pudumovil,
  type EstadoAlternativa,
  type EstadoPudumovil,
  type SeccionNav,
  type Veredicto,
} from '@/components'
import './pagina-muestra.css'

const ESTADOS_ALTERNATIVA: EstadoAlternativa[] = [
  'reposo',
  'seleccionada',
  'correcta',
  'incorrecta',
]

const ESTADOS_PUDUMOVIL: EstadoPudumovil[] = [
  'neutral',
  'explicando',
  'celebrando',
  'animando',
]

const TEXTO_LARGO =
  'Texto de ejemplo para revisar el diseño de la hoja. Sirve para comprobar que el ' +
  'contenido se recorta en dos líneas cuando la hoja está colapsada y que, al ' +
  'expandirla, el área de lectura se desplaza sola mientras el botón Continuar se ' +
  'queda fijo abajo. Este párrafo se repite para que haya suficiente alto y el ' +
  'desplazamiento interno se note de verdad en un celular angosto. No contiene ' +
  'ninguna norma de tránsito: el contenido real llega en la etapa 4.'

function useEstadoConexion() {
  const [enLinea, setEnLinea] = useState(navigator.onLine)

  useEffect(() => {
    const marcarEnLinea = () => setEnLinea(true)
    const marcarSinConexion = () => setEnLinea(false)
    window.addEventListener('online', marcarEnLinea)
    window.addEventListener('offline', marcarSinConexion)
    return () => {
      window.removeEventListener('online', marcarEnLinea)
      window.removeEventListener('offline', marcarSinConexion)
    }
  }, [])

  return enLinea
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="muestra-seccion">
      <h2 className="muestra-seccion-titulo">{titulo}</h2>
      {children}
    </section>
  )
}

export function PaginaMuestra() {
  const enLinea = useEstadoConexion()
  const [elegida, setElegida] = useState<string | null>(null)
  const [pregunta, setPregunta] = useState(3)
  const [seccion, setSeccion] = useState<SeccionNav>('inicio')
  const [hoja, setHoja] = useState<Veredicto | null>(null)
  const [hojaExpandida, setHojaExpandida] = useState(false)

  const abrirHoja = (veredicto: Veredicto) => {
    setHoja(veredicto)
    setHojaExpandida(false)
  }

  return (
    <div className="muestra">
      <header className="muestra-encabezado">
        <h1 className="muestra-titulo">Componentes — Pudumóvil</h1>
        <p className={`muestra-conexion ${enLinea ? 'esta-en-linea' : 'esta-sin-conexion'}`}>
          {enLinea ? 'En línea' : 'Sin conexión'}
        </p>
      </header>

      <Seccion titulo="Botón">
        <div className="muestra-fila">
          <Boton>Comprobar</Boton>
          <Boton variante="secundario">Saltar</Boton>
        </div>
        <div className="muestra-fila">
          <Boton variante="error">Continuar</Boton>
          <Boton variante="logro">Iniciar simulacro</Boton>
        </div>
        <Boton disabled anchoCompleto>
          Comprobar
        </Boton>
      </Seccion>

      <Seccion titulo="Alternativa de respuesta">
        <div className="muestra-pila">
          {ESTADOS_ALTERNATIVA.map((estado, indice) => (
            <Alternativa key={estado} letra={'ABCD'[indice]} estado={estado}>
              Alternativa en estado {estado}
            </Alternativa>
          ))}
        </div>

        <p className="muestra-nota">Grupo interactivo: toca para sentir el relieve.</p>
        <div className="muestra-pila" role="group" aria-label="Alternativas de ejemplo">
          {['Primera opción', 'Segunda opción', 'Tercera opción'].map((texto, indice) => (
            <Alternativa
              key={texto}
              letra={'ABC'[indice]}
              estado={elegida === texto ? 'seleccionada' : 'reposo'}
              onClick={() => setElegida(texto)}
            >
              {texto}
            </Alternativa>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Progreso del bloque">
        <BarraProgresoBloque actual={pregunta} total={10} onCerrar={() => setPregunta(0)} />
        <Boton
          variante="secundario"
          onClick={() => setPregunta((valor) => (valor >= 10 ? 0 : valor + 1))}
        >
          Avanzar una pregunta
        </Boton>
      </Seccion>

      <Seccion titulo="Barra de preparación">
        <BarraPreparacion porcentaje={40} nota="Te falta reforzar señales de advertencia." />
        <BarraPreparacion porcentaje={100} lista nota="Mantén el repaso al día." />
      </Seccion>

      <Seccion titulo="Nodo del camino">
        <div className="muestra-camino">
          <NodoCamino estado="completado" etiqueta="Nivel 1" />
          <NodoCamino estado="actual" etiqueta="Nivel 2" desplazamiento="derecha" />
          <NodoCamino estado="simulacro" etiqueta="Mini-simulacro" />
          <NodoCamino estado="bloqueado" etiqueta="Nivel 3" desplazamiento="izquierda" />
        </div>
      </Seccion>

      <Seccion titulo="Pudumóvil">
        <div className="muestra-fila muestra-fila-envuelve">
          {ESTADOS_PUDUMOVIL.map((estado) => (
            <figure key={estado} className="muestra-personaje">
              <Pudumovil estado={estado} tamano={96} alt="" />
              <figcaption className="muestra-nota">{estado}</figcaption>
            </figure>
          ))}
          <figure className="muestra-personaje">
            <Pudumovil estado="explicando" tamano={96} reflejado alt="" />
            <figcaption className="muestra-nota">reflejado</figcaption>
          </figure>
        </div>
      </Seccion>

      <Seccion titulo="Hoja de retroalimentación">
        <div className="muestra-fila">
          <Boton onClick={() => abrirHoja('correcto')}>Abrir correcta</Boton>
          <Boton variante="error" onClick={() => abrirHoja('incorrecto')}>
            Abrir incorrecta
          </Boton>
        </div>
      </Seccion>

      <HojaFeedback
        veredicto={hoja ?? 'correcto'}
        titulo="Título de ejemplo de la retroalimentación"
        explicacion={<p>{TEXTO_LARGO}</p>}
        referencia={{ edicion: 'Edición de ejemplo', seccion: 'Sección 0', pagina: 0 }}
        abierta={hoja !== null}
        expandida={hojaExpandida}
        onExpandir={() => setHojaExpandida(true)}
        onContinuar={() => setHoja(null)}
      />

      <BarraNavegacion activa={seccion} onCambio={setSeccion} pendientesRepaso={4} />
    </div>
  )
}
