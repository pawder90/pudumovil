/**
 * Validación automática de `fuente.fragmento` contra el texto del libro
 * (spec §8.1 paso 3): un ítem solo puede citar una edición si ese fragmento
 * aparece literalmente en el texto, cerca del número de página declarado.
 *
 * Esta comparación es intencionalmente ingenua (substring tras normalizar
 * espacios y negritas markdown) porque su objetivo es marcar como "dudoso"
 * lo que claramente no coincide con el libro, no reemplazar la revisión
 * manual del paso 4.
 */

/** Línea que el extractor de texto usa como número de página en pie de página. */
const LINEA_MARCADOR_PAGINA = /^\s*\[?\d{1,3}\]?\s*$/

function normalizar(texto: string): string {
  return texto
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export type IndiceLibro = {
  lineasNormalizadas: string[]
  marcadoresPagina: { linea: number; pagina: number }[]
}

export function indexarLibro(textoCompleto: string): IndiceLibro {
  const lineas = textoCompleto.split(/\r?\n/)
  const marcadoresPagina: IndiceLibro['marcadoresPagina'] = []
  lineas.forEach((linea, i) => {
    if (LINEA_MARCADOR_PAGINA.test(linea)) {
      marcadoresPagina.push({ linea: i, pagina: parseInt(linea.trim(), 10) })
    }
  })
  return { lineasNormalizadas: lineas.map(normalizar), marcadoresPagina }
}

export type ResultadoValidacionFragmento = {
  encontrado: boolean
  /** Página del primer marcador de página que sigue al fragmento encontrado. */
  paginaEncontrada: number | null
  paginaCoincide: boolean
}

/**
 * Busca `fragmento` en el libro indexado y compara la página del marcador
 * de página más cercano hacia adelante con `paginaDeclarada`.
 */
export function validarFragmento(
  indice: IndiceLibro,
  fragmento: string,
  paginaDeclarada: number,
): ResultadoValidacionFragmento {
  const buscado = normalizar(fragmento)
  const lineaEncontrada = indice.lineasNormalizadas.findIndex((linea) =>
    linea.includes(buscado),
  )
  if (lineaEncontrada === -1) {
    return { encontrado: false, paginaEncontrada: null, paginaCoincide: false }
  }
  const marcador = indice.marcadoresPagina.find((m) => m.linea > lineaEncontrada)
  const paginaEncontrada = marcador ? marcador.pagina : null
  return {
    encontrado: true,
    paginaEncontrada,
    paginaCoincide: paginaEncontrada === paginaDeclarada,
  }
}
