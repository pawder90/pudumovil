/**
 * Pantalla de ajustes (spec R9): exportar e importar el progreso como
 * archivo, para no perderlo al cambiar de celular.
 */
import { useRef, useState } from 'react'
import {
  descargarProgreso,
  importarProgresoDesdeArchivo,
  ProgresoInvalidoError,
} from '@/lib/progreso/exportarImportar'
import { Boton, Icono } from '@/components'
import './pagina-ajustes.css'

type Props = {
  onSalir: () => void
}

type Aviso = { tipo: 'exito' | 'error'; texto: string }

export function PaginaAjustes({ onSalir }: Props) {
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const [confirmandoImportacion, setConfirmandoImportacion] = useState(false)
  const inputArchivoRef = useRef<HTMLInputElement>(null)

  async function alExportar() {
    setAviso(null)
    try {
      await descargarProgreso()
      setAviso({ tipo: 'exito', texto: 'Se descargó tu progreso como archivo.' })
    } catch {
      setAviso({ tipo: 'error', texto: 'No se pudo exportar el progreso. Intenta de nuevo.' })
    }
  }

  function alElegirImportar() {
    setAviso(null)
    setConfirmandoImportacion(true)
  }

  async function alSeleccionarArchivo(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!archivo) return

    try {
      await importarProgresoDesdeArchivo(archivo)
      setAviso({ tipo: 'exito', texto: 'Progreso importado. Reemplazó al que tenías en este celular.' })
    } catch (error) {
      const texto =
        error instanceof ProgresoInvalidoError
          ? error.message
          : 'No se pudo importar el archivo. Intenta de nuevo.'
      setAviso({ tipo: 'error', texto })
    }
  }

  return (
    <div className="pagina-ajustes">
      <header className="pagina-ajustes-cabecera">
        <button
          type="button"
          className="pagina-ajustes-cerrar"
          onClick={onSalir}
          aria-label="Volver al inicio"
        >
          <Icono nombre="equis" tamano={24} />
        </button>
        <h1 className="pagina-ajustes-titulo">Ajustes</h1>
      </header>

      <section className="pagina-ajustes-seccion">
        <h2 className="pagina-ajustes-seccion-titulo">Tu progreso</h2>
        <p className="pagina-ajustes-seccion-nota">
          Guarda tu progreso como archivo para no perderlo, o recupéralo en un celular nuevo.
        </p>

        <Boton variante="secundario" anchoCompleto onClick={alExportar}>
          <Icono nombre="descargar" tamano={20} />
          Exportar progreso
        </Boton>

        {!confirmandoImportacion && (
          <Boton variante="secundario" anchoCompleto onClick={alElegirImportar}>
            <Icono nombre="subir" tamano={20} />
            Importar progreso
          </Boton>
        )}

        {confirmandoImportacion && (
          <div className="pagina-ajustes-confirmacion" role="alert">
            <p className="pagina-ajustes-confirmacion-texto">
              Importar un archivo reemplazará todo el progreso guardado en este celular. Esta
              acción no se puede deshacer.
            </p>
            <div className="pagina-ajustes-confirmacion-acciones">
              <Boton
                variante="secundario"
                onClick={() => setConfirmandoImportacion(false)}
              >
                Cancelar
              </Boton>
              <Boton
                variante="error"
                onClick={() => {
                  setConfirmandoImportacion(false)
                  inputArchivoRef.current?.click()
                }}
              >
                Elegir archivo
              </Boton>
            </div>
          </div>
        )}

        <input
          ref={inputArchivoRef}
          type="file"
          accept="application/json"
          className="pagina-ajustes-input-archivo"
          onChange={alSeleccionarArchivo}
          aria-hidden="true"
          tabIndex={-1}
        />

        {aviso && (
          <p
            className={`pagina-ajustes-aviso pagina-ajustes-aviso-${aviso.tipo}`}
            role="status"
          >
            {aviso.texto}
          </p>
        )}
      </section>
    </div>
  )
}
