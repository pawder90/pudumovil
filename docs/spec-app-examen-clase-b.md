# Especificación: webapp gamificada para el examen teórico Clase B

**Versión:** 1.2 · **Fecha:** 15 de septiembre de 2026 · **Autora:** Pau
**Fuente de contenido:** *Libro para la Conducción en Chile — Automovilistas, Licencia Clase B* (CONASET, febrero 2026)
**Destino:** documento de trabajo para construir la app con Claude Code

---

## 1. Resumen

Una webapp personal, pensada para celular, que ayuda a preparar el examen teórico de la licencia Clase B.

- Usa mecánicas tipo Duolingo: camino de niveles, lecciones cortas por bloques y un personaje guía.
- Todo el contenido sale del libro oficial de CONASET 2026.
- Los juegos principales convierten las normas en situaciones: reconocer señales, decidir quién pasa primero y detectar riesgos.
- Cada respuesta explica el porqué y cita la página del libro.
- Una barra de preparación indica cuándo estás lista para rendir el examen.

---

## 2. Problema

- El libro tiene más de 160 páginas de contenido denso y mezcla conceptos, cifras y normas legales.
- El examen real no se aprueba memorizando. Sale de un banco de más de 1.000 preguntas y presenta situaciones hipotéticas.
- El margen de error es chico: se necesitan 33 de 38 puntos, cerca del 87%.
- Leer el libro de corrido no indica si realmente lo entendiste ni qué temas están débiles.

---

## 3. Objetivos

1. **Aprobar el examen teórico** en el primer intento.
2. **Entender las normas**, no solo memorizarlas. Cada ejercicio explica el porqué.
3. **Saber cuándo estoy lista**, con un indicador objetivo basado en simulacros y dominio por tema.
4. **Mantener un ritmo diario** sin fecha de examen fija, con una meta que elijo cada día.
5. **Retener lo aprendido** en el tiempo, gracias al repaso espaciado.

---

## 4. Fuera de alcance (no objetivos)

| No incluye | Por qué |
|---|---|
| Varias personas usuarias, cuentas, ligas o rankings | La app es solo para mí. Evita servidor y autenticación. |
| Examen práctico o técnica de manejo manual | La app cubre el contenido teórico del libro. La práctica se aprende en el curso. |
| Otras clases de licencia (A, C, D, etc.) | El libro y el examen son de Clase B. |
| Generación de preguntas en tiempo real | El banco es fijo y validado, para evitar errores en normas legales. |
| Castigos por error (vidas, pérdida de puntos) | La decisión es aprender sin frustración. |
| Rachas e insignias como motivación central | Se priorizan la barra de preparación y el personaje guía. |

---

## 5. Decisiones de producto

### 5.1 Usuaria y contexto de uso

- **Usuaria única:** Pau.
- **Dispositivo principal:** celular. El diseño parte desde pantallas pequeñas y uso con el pulgar.
- **Conectividad:** debe funcionar sin conexión, ya que el contenido es fijo.
- **Fecha de examen:** sin definir. No hay cuenta regresiva.

### 5.2 Camino de aprendizaje: 5 niveles de lo fácil a lo difícil

El criterio va de lo visual y concreto hacia lo abstracto y legal. No sigue el orden del libro.

| Nivel | Nombre | Secciones del libro (página según índice) |
|---|---|---|
| 1 | **Fundamentos** | Funcionamiento del automóvil (11) · Elementos de seguridad (26) · Niñas y niños en el automóvil (73) · Señales de tránsito básicas (80, Anexo 1: 149) |
| 2 | **La persona que conduce** | Siniestros y Sistema Seguro (6–9) · Convivencia vial (33) · La persona en el tránsito (37) · Equilibrio emocional (45) · Conductas de riesgo (48) · Alcohol (50) · Drogas (53) · Enfermedades (56) · Medicamentos (60) · Cansancio, sueño y fatiga (62) · Usuarios vulnerables (68) |
| 3 | **Las reglas** | Normas de circulación (77) · Señales y demarcaciones completas (80) · Reglas del tránsito y preferencia de paso (84) · Velocidad (96) |
| 4 | **Maniobras y contextos** | Encuentros y adelantamientos (98) · Estacionamiento y detención (104) · Conducción en la oscuridad (109) · Conducción con carga (113) · Autopistas (116) · Condiciones climáticas (120) · Cruces ferroviarios (126) |
| 5 | **Física y responsabilidad** | La energía y las leyes físicas (23) · Conducción eficiente (127) · Cómo actuar en un siniestro (136) · Disposiciones de los vehículos (139) · Responsabilidad de quien conduce (140) · Frenadas fuertes (144) · Medio ambiente y vehículo eléctrico (146–147) |

- El **glosario** (Anexo 2, p. 161) es transversal. Alimenta el juego "Completar la frase" en todos los niveles.
- Cada nivel se divide en **unidades**, y cada unidad en **lecciones**.
- Una unidad se desbloquea al completar la anterior. Un nivel se desbloquea al aprobar el mini-simulacro del nivel anterior.

### 5.3 Lecciones y meta diaria

- **Duración de una lección:** 10 a 15 minutos.
- **Estructura:** cada lección se divide en **3 bloques** de 4 a 5 minutos. Al terminar un bloque el avance queda guardado.
- **Meta diaria elegible cada día:**
  - Corta: 1 bloque (unos 5 minutos).
  - Normal: 2 bloques (unos 10 minutos).
  - Intensa: 3 bloques (unos 15 minutos).
- Se puede salir a mitad de un bloque. Al volver, se retoma desde la última pregunta respondida.

### 5.4 Retroalimentación y errores

- **Explicación extendida** después de cada respuesta, correcta o incorrecta. Incluye:
  1. Si la respuesta fue correcta.
  2. El porqué, en lenguaje simple.
  3. La referencia al libro: sección y página.
- **Sin castigo:** una pregunta fallada vuelve al final del bloque.
- Toda pregunta fallada entra al **repaso espaciado** y reaparece en días siguientes.

### 5.5 Personaje guía: Pudumóvil

- **Nombre:** Pudumóvil.
- **Qué es:** un pudú original, diseñado para esta app.
- **Tono:** neutro y amable. Sin chilenismos marcados ni humor forzado.
- **Roles:**
  - Presenta cada unidad con una idea central.
  - Entrega las explicaciones del porqué.
  - Anima después de un error, sin tono de reproche.
  - Celebra los hitos: bloque, lección, nivel y simulacro aprobado.
- **Estados visuales mínimos:** neutral, explicando, celebrando, animando.
- **Producción:** 3D suave tipo plasticina, con chaleco reflectante. Se exporta como WebP con transparencia. Detalle en `sistema-diseno-pudumovil.md`.

### 5.6 Barra de preparación para el examen

Es el indicador principal de avance. Se muestra siempre en la pantalla de inicio.

**Fórmula (0 a 100%):**

```
preparación = 0,20 × cobertura + 0,40 × dominio + 0,40 × simulacros
```

- **Cobertura:** unidades completadas ÷ unidades totales.
- **Dominio:** promedio del dominio de cada unidad, calculado con las cajas de Leitner (ver 5.8).
- **Simulacros:** promedio del puntaje (en %) de los **últimos 3 simulacros**. Antes del primer simulacro completo, se usan los mini-simulacros.

**Estado "Lista para el examen":** se muestra solo si se cumplen las dos condiciones:

1. Los últimos 3 simulacros completos tienen **33 puntos o más**.
2. **Ninguna unidad** tiene dominio bajo **70%**.

Si falta alguna condición, la barra muestra qué falta. Por ejemplo: "Tu unidad de adelantamientos está en 58%".

### 5.7 Simulacros

**Formato del examen real (referencia):**

- 35 preguntas de selección múltiple, con una sola alternativa correcta.
- 3 preguntas de doble puntaje. Puntaje máximo: 38.
- Aprobación: 33 puntos o más.
- Tiempo: 45 minutos.
- Temas de doble puntaje según sitios de preparación: alcohol, velocidad y retención infantil. **Pendiente de confirmar** con la escuela de conductores.
- La alternativa "Todas las anteriores" aparece solo cuando todas las demás son correctas.

**Mini-simulacro por nivel:**

- Aparece al completar todas las unidades de un nivel.
- **15 preguntas** solo de ese nivel y **20 minutos** de tiempo.
- Incluye **1 pregunta de doble puntaje** si el nivel contiene uno de esos temas: retención infantil (nivel 1), alcohol (nivel 2) y velocidad (nivel 3).
- Exige el mismo nivel de aprobación: 87% del puntaje, redondeado hacia arriba.
- Aprobarlo desbloquea el nivel siguiente.

**Simulacro completo:**

- Se desbloquea al terminar el **nivel 3**, porque ahí ya se cubrieron los tres temas de doble puntaje.
- Replica el formato real: 35 preguntas, 3 de doble puntaje, 45 minutos, aprobación con 33 de 38.
- Toma preguntas solo de los niveles completados.
- Calcula **puntaje**, no cantidad de errores.
- Durante el simulacro **no hay explicaciones**. Al final se muestra una revisión con cada error explicado.

### 5.8 Repaso espaciado: cajas de Leitner

- Cada ítem vive en una de **5 cajas**. Todo ítem nuevo parte en la caja 1.
- **Intervalo de repaso por caja:**

| Caja | Se repasa cada |
|---|---|
| 1 | 1 día |
| 2 | 2 días |
| 3 | 4 días |
| 4 | 7 días |
| 5 | 14 días |

- **Respuesta correcta:** el ítem sube una caja. En la caja 5 se queda.
- **Respuesta incorrecta:** el ítem vuelve a la caja 1.
- **Ítem vencido:** su fecha de repaso ya pasó y no se ha respondido.
- **Bloque de repaso diario:** reúne los ítems vencidos, empezando por las cajas más bajas.

**Dominio de una unidad (0 a 100%):**

```
dominio = suma(peso de cada ítem) ÷ cantidad de ítems de la unidad
```

| Estado del ítem | Peso |
|---|---|
| Nunca visto | 0 |
| Caja 1 | 0,2 |
| Caja 2 | 0,4 |
| Caja 3 | 0,6 |
| Caja 4 | 0,8 |
| Caja 5 | 1,0 |
| Cualquier caja, pero vencido | la mitad de su peso |

Así el dominio baja solo cuando dejas de repasar, y sube con cada acierto sostenido en el tiempo.

---

## 6. Tipos de juego

| Juego | Mecánica | Contenido principal | Interacción en celular | Fase |
|---|---|---|---|---|
| **Reconocer señales** | Ver una señal y elegir su significado. Variante: clasificarla en reglamentaria, preventiva o informativa. | Señales y demarcaciones (p. 80, Anexo 1) | Tocar alternativa · arrastrar a categoría | 1 |
| **¿Quién pasa primero?** | Ver un cruce desde arriba y ordenar los vehículos según la preferencia de paso. | Reglas del tránsito (p. 84) · adelantamientos (p. 98) | Tocar vehículos en orden | 1 estático · 2 animado |
| **Detectar riesgos** | Ver una escena y tocar los peligros antes de que termine el tiempo. | La persona en el tránsito (p. 37) · usuarios vulnerables · oscuridad · clima | Tocar zonas de la escena | 2 |
| **Mito o realidad** | Tarjeta con una afirmación. Deslizar a verdadero o falso. | Alcohol, drogas, medicamentos, fatiga | Deslizar tarjeta | 1 |
| **Completar la frase** | Elegir la palabra que falta en una norma o definición. | Glosario y normas | Tocar palabra | 1 |
| **Ordenar pasos** | Armar la secuencia correcta de un procedimiento. | Siniestros (p. 136) · frenadas fuertes (p. 144) | Arrastrar para ordenar | 1 |
| **Selección múltiple de situación** | Pregunta tipo examen con una situación hipotética. | Todo el libro | Tocar alternativa | 1 |

**Reglas comunes a todos los juegos:**

- Áreas táctiles de al menos 44 × 44 px.
- Todo juego debe poder usarse con una sola mano.
- Cada ítem guarda su referencia al libro.

---

## 7. Requisitos por fase

### Fase 1 (P0): app útil para estudiar

**R1. Camino de niveles**
- [ ] La pantalla de inicio muestra los 5 niveles, sus unidades y el estado de cada una: bloqueada, disponible, en curso o completada.
- [ ] La barra de preparación se ve en la pantalla de inicio.
- [ ] Al tocar una unidad disponible se abre su siguiente lección pendiente.

**R2. Lecciones por bloques**
- [ ] Dado que elegí la meta "Normal", cuando termino 2 bloques, entonces el pudú celebra la meta cumplida y puedo seguir o salir.
- [ ] Dado que salgo a mitad de un bloque, cuando vuelvo a abrir la app, entonces retomo en la última pregunta respondida.
- [ ] Una pregunta fallada vuelve al final del mismo bloque.

**R3. Explicaciones**
- [ ] Cada respuesta muestra resultado, explicación y referencia (sección y página).
- [ ] La explicación aparece también cuando respondo bien.

**R4. Juegos de fase 1**
- [ ] Reconocer señales, ¿quién pasa primero? (estático), mito o realidad, completar la frase, ordenar pasos y selección múltiple funcionan en celular.

**R5. Repaso espaciado**
- [ ] Cada ítem se mueve entre 5 cajas de Leitner según la sección 5.8.
- [ ] Las preguntas falladas vuelven a la caja 1 y reaparecen al día siguiente.
- [ ] Cada día se ofrece un bloque de repaso con los ítems que vencen ese día.
- [ ] El dominio de una unidad se calcula con los pesos de la sección 5.8 y baja si sus ítems vencen.

**R6. Simulacros**
- [ ] El mini-simulacro se habilita al completar un nivel. Tiene 15 preguntas y 20 minutos. Aprobarlo desbloquea el siguiente.
- [ ] El simulacro completo se habilita al terminar el nivel 3.
- [ ] El simulacro completo tiene 35 preguntas, 3 de doble puntaje, temporizador de 45 minutos y aprobación con 33 de 38.
- [ ] Si se acaba el tiempo, las preguntas sin responder cuentan como incorrectas.
- [ ] Al terminar se muestra el puntaje y la revisión de errores con explicación.

**R7. Barra de preparación**
- [ ] Se calcula con la fórmula de la sección 5.6.
- [ ] Muestra "Lista para el examen" solo si se cumplen ambas condiciones.
- [ ] Si no se cumplen, indica la condición pendiente y la unidad más débil.

**R8. Pudumóvil**
- [ ] Aparece en introducción de unidad, explicaciones, errores y celebraciones.
- [ ] Tiene al menos 4 estados visuales.

**R9. Plataforma**
- [ ] Instalable como PWA en el celular.
- [ ] Funciona sin conexión después de la primera carga.
- [ ] El progreso se guarda en el dispositivo y sobrevive a cerrar la app.
- [ ] Permite exportar e importar el progreso como archivo, para no perderlo al cambiar de celular.

### Fase 2 (P1): escenas vivas

- [ ] ¿Quién pasa primero? con animación: los vehículos avanzan según el orden elegido y se muestra el choque o el paso correcto.
- [ ] Juego detectar riesgos con escenas ilustradas y zonas táctiles.
- [ ] Transiciones y microanimaciones del pudú.

### Fase 3 (P2): escenas ricas

- [ ] Escenas con noche, lluvia, niebla y peatones en movimiento.
- [ ] Más estados y reacciones del pudú.
- [ ] Sonidos y vibración opcionales.

**Consideración de arquitectura:** aunque las escenas animadas lleguen en fases 2 y 3, el formato de datos de la fase 1 debe permitir describir escenas (posiciones, vehículos, señales) para no rehacer el banco.

---

## 8. Contenido: banco fijo y validado

### 8.1 Proceso de generación (una vez)

1. **Extraer** el texto del libro por sección, conservando el número de página. La copia en texto del proyecto sirve: tiene 154 encabezados con número de página. No tiene imágenes (ver 8.4).
2. **Generar** ítems por unidad con Claude Code, para cada tipo de juego que aplique.
3. **Validar automáticamente:** un segundo paso compara cada respuesta y explicación con el fragmento fuente. Marca como dudoso lo que no coincida.
4. **Revisar manualmente** solo los ítems marcados como dudosos.
5. **Congelar** el banco como archivos JSON versionados, asociados a la edición del libro (`conaset-2026-02`).

Si CONASET publica una edición nueva, se repite el proceso completo.

### 8.2 Esquema de un ítem (propuesta)

```json
{
  "id": "n3-u2-pref-014",
  "nivel": 3,
  "unidad": "preferencia-de-paso",
  "tipo": "quien_pasa_primero",
  "dificultad": 2,
  "doble_puntaje": false,
  "tema_examen": null,
  "enunciado": "Llegas a un cruce sin semáforo ni señales. ¿En qué orden pasan los vehículos?",
  "escena": {
    "vista": "superior",
    "vehiculos": [
      { "id": "yo", "entrada": "sur", "accion": "recto" },
      { "id": "auto_azul", "entrada": "este", "accion": "recto" }
    ],
    "senales": []
  },
  "respuesta_correcta": ["auto_azul", "yo"],
  "explicacion": "En un cruce sin semáforo ni señales, debes ceder el paso a los vehículos que vienen por tu derecha.",
  "fuente": {
    "edicion": "conaset-2026-02",
    "seccion": "La obligación de ceder el paso",
    "pagina": 84,
    "fragmento": "texto original breve usado para validar"
  },
  "validacion": { "estado": "aprobado", "revisado_por": "auto" }
}
```

- `tipo` define qué campos extra se usan: `alternativas`, `escena`, `pasos`, etc.
- `tema_examen` marca el tema del ítem. Si ese tema está en la lista de doble puntaje del archivo de configuración, el ítem es elegible para esas preguntas. El campo `doble_puntaje` se calcula desde la configuración y no se escribe a mano.
- `fuente.fragmento` se usa solo para validar. No se muestra completo en la app.

### 8.3 Tamaño estimado del banco

- Suficiente para que el simulacro completo no repita preguntas con frecuencia.
- Meta inicial sugerida: **400 a 600 ítems** en total. Ajustable después de construir el nivel 1.

### 8.4 Imágenes y configuración del examen

**Tres tipos de imagen, tres métodos:**

1. **Pudumóvil:** 3D tipo plasticina, creado en Blender o Spline y exportado como WebP con transparencia (1x y 2x).
2. **Señales:** redibujadas en Figma como SVG, usando como referencia el Anexo 1 del PDF original de CONASET y el Manual de Señalización de Tránsito. La copia en texto del proyecto no trae estas imágenes.
3. **Escenas de cruces y riesgos:** no se dibujan una por una. Se generan con código desde el campo `escena` de cada ítem, combinando un set de piezas SVG: calles, pistas, autos, peatones, ciclistas y señales.

**Archivo de configuración del examen (`examen.config.json`):**

```json
{
  "simulacro_completo": { "preguntas": 35, "minutos": 45, "puntaje_max": 38, "aprobacion": 33 },
  "mini_simulacro": { "preguntas": 15, "minutos": 20, "aprobacion_pct": 0.87 },
  "temas_doble_puntaje": ["alcohol", "velocidad", "retencion_infantil"],
  "barra": { "peso_cobertura": 0.2, "peso_dominio": 0.4, "peso_simulacros": 0.4, "dominio_minimo_unidad": 0.7 },
  "leitner_intervalos_dias": [1, 2, 4, 7, 14]
}
```

Si la escuela de conductores confirma otros temas de doble puntaje, o cambia el formato del examen, solo se edita este archivo.

---

## 9. Arquitectura técnica

- **Construcción:** proyecto propio con Claude Code.
- **Stack:** React + Vite + TypeScript.
- **PWA y modo sin conexión:** `vite-plugin-pwa`.
- **Progreso local:** IndexedDB con Dexie, con exportación e importación a archivo JSON.
- **Animaciones:** Motion (antes Framer Motion) para transiciones, Pudumóvil y escenas de fase 2.
- **Tokens de diseño:** JSON estándar (DTCG) compilado con Style Dictionary 4 a variables CSS y TypeScript. Ver `sistema-diseno/`.
- **Escenas:** componentes SVG en React, generados desde el JSON del ítem.
- **Datos de contenido:** JSON estático incluido en la app, más `examen.config.json`.
- **Sin servidor:** no hay cuentas ni base de datos remota.

---

## 10. Métricas de éxito

**Indicadores tempranos (semanas):**

- Días por semana con la meta diaria cumplida.
- Porcentaje de ítems de repaso completados el día que vencen.
- Dominio promedio por nivel.

**Indicadores finales:**

- Estado "Lista para el examen" alcanzado.
- Examen teórico real aprobado en el primer intento.
- Diferencia entre el puntaje de los simulacros y el puntaje real. Sirve para saber si el simulacro está bien calibrado.

---

## 11. Decisiones tomadas y pendientes

**Decisiones cerradas en la versión 1.1:**

| Tema | Decisión |
|---|---|
| Stack | React + Vite + TypeScript, `vite-plugin-pwa`, Dexie y Motion (sección 9) |
| Repaso espaciado | Cajas de Leitner con 5 cajas (sección 5.8) |
| Mini-simulacro | 15 preguntas, 20 minutos, 87% para aprobar (sección 5.7) |
| Personaje guía | Pudumóvil, tono neutro y amable, 3D tipo plasticina con chaleco reflectante (sección 5.5) |
| Imágenes | Pudumóvil en 3D (WebP); señales en Figma (SVG); escenas generadas con código (sección 8.4) |
| Sistema de diseño | Documento aparte con tokens en `sistema-diseno/` |
| Archivo del libro | La copia en texto sirve para generar preguntas; las imágenes se toman del PDF original (sección 8.4) |
| Doble puntaje | Configurable; por defecto alcohol, velocidad y retención infantil (sección 8.4) |

**Pendientes que no bloquean:**

| Pendiente | Quién |
|---|---|
| Confirmar los temas de doble puntaje | Escuela de conductores |
| Descargar el PDF original de CONASET para las señales | Pau |
| Definir el estilo visual de Pudumóvil y del set de piezas de escena | Pau (diseño) |

---

## 12. Referencias

- CONASET. *Libro para la Conducción en Chile — Automovilistas, Licencia Clase B*. Febrero 2026. Disponible en mejoresconductores.conaset.cl.
- Formato del examen teórico Clase B (35 preguntas, 38 puntos, aprobación con 33, 45 minutos): sitios de preparación consultados en septiembre de 2026 (Practicatest, ConduceYa, Examen Express, El Buen Conductor, Autofact). Confirmar con la Dirección de Tránsito o la escuela de conductores.
