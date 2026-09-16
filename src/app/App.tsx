// Pantalla temporal de verificación. Se elimina en la etapa 2.
import { useEffect, useState } from 'react'
import './App.css'

const MUESTRAS_COLOR = [
  { nombre: 'Marca', variable: '--color-marca-solido' },
  { nombre: 'Correcto', variable: '--color-correcto-solido' },
  { nombre: 'Error', variable: '--color-error-solido' },
  { nombre: 'Información', variable: '--color-info-solido' },
  { nombre: 'Logro', variable: '--color-logro-solido' },
] as const

const ESTILOS_TIPOGRAFIA = [
  {
    token: '--typography-celebracion',
    texto: '¡Aprobaste el mini-simulacro!',
  },
  { token: '--typography-titulo', texto: 'Las reglas del tránsito' },
  { token: '--typography-subtitulo', texto: 'Preferencia de paso' },
  {
    token: '--typography-enunciado',
    texto: 'Velocidad máxima: 50 km/h',
  },
  {
    token: '--typography-cuerpo',
    texto: 'En un cruce sin señales, cede el paso a quien viene por tu derecha.',
  },
  { token: '--typography-boton', texto: 'Continuar' },
  { token: '--typography-etiqueta', texto: 'Página 84, Reglas del tránsito' },
] as const

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

function App() {
  const enLinea = useEstadoConexion()

  return (
    <main className="verificacion">
      <header>
        <h1 style={{ font: 'var(--typography-titulo)' }}>
          Verificación de base — Pudumóvil
        </h1>
        <p className={`estado-conexion ${enLinea ? 'en-linea' : 'sin-conexion'}`}>
          {enLinea ? 'En línea' : 'Sin conexión'}
        </p>
      </header>

      <section>
        <h2 style={{ font: 'var(--typography-subtitulo)' }}>Colores semánticos</h2>
        <ul className="muestras-color">
          {MUESTRAS_COLOR.map((muestra) => (
            <li key={muestra.variable}>
              <span
                className="chip-color"
                style={{ backgroundColor: `var(${muestra.variable})` }}
                aria-hidden="true"
              />
              <span>{muestra.nombre}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 style={{ font: 'var(--typography-subtitulo)' }}>Estilos tipográficos</h2>
        <ul className="lista-tipografia">
          {ESTILOS_TIPOGRAFIA.map((estilo) => (
            <li key={estilo.token}>
              <p className="etiqueta-token">{estilo.token}</p>
              <p style={{ font: `var(${estilo.token})` }}>{estilo.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 style={{ font: 'var(--typography-subtitulo)' }}>Relieve y movimiento</h2>
        <button type="button" className="rectangulo-prueba">
          Presióname
        </button>
      </section>
    </main>
  )
}

export default App
