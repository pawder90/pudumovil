import { describe, expect, it } from 'vitest'
import type { Item } from './tipos'

// Ítem de ejemplo tomado de la spec §8.2, para que el esquema no se desacople
// en silencio del ejemplo documentado ahí.
const ITEM_DE_SPEC: Item = {
  id: 'n3-u2-pref-014',
  nivel: 3,
  unidad: 'preferencia-de-paso',
  tipo: 'quien_pasa_primero',
  dificultad: 2,
  temaExamen: null,
  enunciado:
    'Llegas a un cruce sin semáforo ni señales. ¿En qué orden pasan los vehículos?',
  escena: {
    vista: 'superior',
    vehiculos: [
      { id: 'yo', entrada: 'sur', accion: 'recto' },
      { id: 'auto_azul', entrada: 'este', accion: 'recto' },
    ],
    senales: [],
  },
  respuestaCorrecta: ['auto_azul', 'yo'],
  explicacion:
    'En un cruce sin semáforo ni señales, debes ceder el paso a los vehículos que vienen por tu derecha.',
  fuente: {
    edicion: 'conaset-2026-02',
    seccion: 'La obligación de ceder el paso',
    pagina: 84,
    fragmento: 'texto original breve usado para validar',
  },
  validacion: { estado: 'aprobado', revisadoPor: 'auto' },
}

describe('esquema del banco de ítems', () => {
  it('acepta un ítem de escena como el documentado en la spec §8.2', () => {
    expect(ITEM_DE_SPEC.tipo).toBe('quien_pasa_primero')
  })

  it('acepta un ítem de selección múltiple', () => {
    const item: Item = {
      id: 'n1-u1-sel-001',
      nivel: 1,
      unidad: 'senales-basicas',
      tipo: 'seleccion_multiple',
      dificultad: 1,
      temaExamen: null,
      enunciado: '¿Qué significa una señal triangular de borde rojo?',
      alternativas: [
        { id: 'a', texto: 'Advierte un peligro' },
        { id: 'b', texto: 'Prohíbe una maniobra' },
      ],
      respuestaCorrecta: 'a',
      explicacion: 'Las señales triangulares de borde rojo son preventivas.',
      fuente: {
        edicion: 'conaset-2026-02',
        seccion: 'Señales de tránsito',
        pagina: 80,
        fragmento: '…',
      },
      validacion: { estado: 'pendiente', revisadoPor: 'auto' },
    }
    expect(item.alternativas).toHaveLength(2)
  })
})
