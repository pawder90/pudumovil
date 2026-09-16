import { describe, expect, it } from 'vitest'
import { indexarLibro, validarFragmento } from './validarFuente'

const libroDePrueba = [
  '###### **Los frenos**',
  '',
  'Si el ABS llegase a fallar, los frenos seguirán funcionando.',
  '',
  '17',
  '',
  '###### **Los neumáticos**',
  '',
  'La profundidad aconsejable mínima es de 3 mm.',
  '',
  '18',
].join('\n')

describe('validarFragmento', () => {
  const indice = indexarLibro(libroDePrueba)

  it('encuentra un fragmento presente y confirma que la página declarada coincide', () => {
    const resultado = validarFragmento(indice, 'los frenos seguirán funcionando', 17)
    expect(resultado.encontrado).toBe(true)
    expect(resultado.paginaEncontrada).toBe(17)
    expect(resultado.paginaCoincide).toBe(true)
  })

  it('ignora negritas markdown y espacios extra al comparar', () => {
    const resultado = validarFragmento(indice, '  ABS  llegase   a fallar ', 17)
    expect(resultado.encontrado).toBe(true)
  })

  it('marca como no encontrado un fragmento inventado', () => {
    const resultado = validarFragmento(indice, 'esto no está en ningún lado del libro', 17)
    expect(resultado.encontrado).toBe(false)
    expect(resultado.paginaCoincide).toBe(false)
  })

  it('marca que la página no coincide si el fragmento está en otra página', () => {
    const resultado = validarFragmento(indice, 'profundidad aconsejable mínima es de 3 mm', 17)
    expect(resultado.encontrado).toBe(true)
    expect(resultado.paginaEncontrada).toBe(18)
    expect(resultado.paginaCoincide).toBe(false)
  })
})
