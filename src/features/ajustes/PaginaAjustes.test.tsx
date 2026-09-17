import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PaginaAjustes } from './PaginaAjustes'
import {
  descargarProgreso,
  importarProgresoDesdeArchivo,
  ProgresoInvalidoError,
} from '@/lib/progreso/exportarImportar'

vi.mock('@/lib/progreso/exportarImportar', () => ({
  descargarProgreso: vi.fn(),
  importarProgresoDesdeArchivo: vi.fn(),
  ProgresoInvalidoError: class ProgresoInvalidoError extends Error {},
}))

describe('PaginaAjustes', () => {
  it('descarga el progreso al tocar exportar', async () => {
    const usuario = userEvent.setup()
    vi.mocked(descargarProgreso).mockResolvedValue()
    render(<PaginaAjustes onSalir={() => {}} />)

    await usuario.click(screen.getByRole('button', { name: 'Exportar progreso' }))

    expect(descargarProgreso).toHaveBeenCalled()
    expect(await screen.findByRole('status')).toHaveTextContent('Se descargó tu progreso')
  })

  it('pide confirmar antes de importar, porque reemplaza el progreso', async () => {
    const usuario = userEvent.setup()
    render(<PaginaAjustes onSalir={() => {}} />)

    await usuario.click(screen.getByRole('button', { name: 'Importar progreso' }))

    expect(screen.getByRole('alert')).toHaveTextContent('reemplazará todo el progreso')
    expect(importarProgresoDesdeArchivo).not.toHaveBeenCalled()
  })

  it('cancela la importación sin tocar el progreso', async () => {
    const usuario = userEvent.setup()
    render(<PaginaAjustes onSalir={() => {}} />)

    await usuario.click(screen.getByRole('button', { name: 'Importar progreso' }))
    await usuario.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Importar progreso' })).toBeInTheDocument()
  })

  it('muestra el mensaje de la librería cuando el archivo no es válido', async () => {
    const usuario = userEvent.setup()
    vi.mocked(importarProgresoDesdeArchivo).mockRejectedValue(
      new ProgresoInvalidoError('El archivo no tiene un progreso válido'),
    )
    render(<PaginaAjustes onSalir={() => {}} />)

    await usuario.click(screen.getByRole('button', { name: 'Importar progreso' }))
    await usuario.click(screen.getByRole('button', { name: 'Elegir archivo' }))

    const archivo = new File(['{}'], 'progreso.json', { type: 'application/json' })
    const input = document.querySelector<HTMLInputElement>('.pagina-ajustes-input-archivo')!
    await usuario.upload(input, archivo)

    expect(await screen.findByRole('status')).toHaveTextContent('no tiene un progreso válido')
  })

  it('avisa un cierre del progreso importado con éxito', async () => {
    const usuario = userEvent.setup()
    vi.mocked(importarProgresoDesdeArchivo).mockResolvedValue()
    render(<PaginaAjustes onSalir={() => {}} />)

    await usuario.click(screen.getByRole('button', { name: 'Importar progreso' }))
    await usuario.click(screen.getByRole('button', { name: 'Elegir archivo' }))

    const archivo = new File(['{}'], 'progreso.json', { type: 'application/json' })
    const input = document.querySelector<HTMLInputElement>('.pagina-ajustes-input-archivo')!
    await usuario.upload(input, archivo)

    expect(await screen.findByRole('status')).toHaveTextContent('Progreso importado')
  })

  it('llama a onSalir al tocar cerrar', async () => {
    const usuario = userEvent.setup()
    const alSalir = vi.fn()
    render(<PaginaAjustes onSalir={alSalir} />)

    await usuario.click(screen.getByRole('button', { name: 'Volver al inicio' }))

    expect(alSalir).toHaveBeenCalled()
  })
})
