# Sistema de diseño: Pudumóvil

**Versión:** 1.0 · **Fecha:** 15 de septiembre de 2026
**Complementa a:** `spec-app-examen-clase-b.md` (versión 1.2)
**Tokens:** carpeta `tokens/` en formato JSON estándar (DTCG), compilados con Style Dictionary 4

---

## 1. Principios

1. **Ruta al sur.** La estructura usa tonos de ruta: asfalto, neblina y demarcación. Los momentos emocionales usan la calidez del bosque: musgo, café pudú y crema.
2. **Vivo, pero legible.** Colores saturados y botones con relieve, sin sacrificar la lectura de explicaciones largas.
3. **Las señales mandan.** Los colores oficiales de las señales nunca se reutilizan para decorar cerca de ellas.
4. **Nunca solo color.** Todo estado (correcto, error, bloqueado) combina color, ícono y texto.
5. **Pulgar primero.** Celular, una mano, áreas táctiles de 48 px o más.

---

## 2. Arquitectura de tokens

Los tokens se organizan en tres capas:

| Capa | Archivo | Qué contiene | Ejemplo |
|---|---|---|---|
| 1. Primitivos | `tokens/primitivos.json` | Valores base sin propósito | `color.musgo.600 = #23864A` |
| 2. Semánticos | `tokens/semanticos.json` | Propósito del valor | `color.correcto.fondo → color.musgo.50` |
| 3. Componentes | `tokens/componentes.json` | Decisiones de cada componente | `boton.primario.relieve → color.marca.relieve` |

**Reglas:**

- Los componentes de React **solo usan tokens de capas 2 y 3**. Nunca primitivos ni valores hex directos.
- Los semánticos solo referencian primitivos. Los de componente solo referencian semánticos o escalas de forma.
- El **modo oscuro** se agrega después con un archivo `tokens/semanticos.oscuro.json` que redefine la capa 2. Los componentes no cambian.

**Compilación:**

```bash
npm i -D style-dictionary@4
npx style-dictionary build --config style-dictionary.config.mjs
```

Genera `build/css/tokens.css` (variables CSS) y `build/ts/tokens.ts` con sus tipos. La versión 1.0 produce 225 variables.

---

## 3. Color

### 3.1 Rampas primitivas

| Rampa | Rol | 50 | 500 | 600 | 700 |
|---|---|---|---|---|---|
| Musgo | Marca y correcto | #E8F6EC | #2F9E55 | #23864A | #1B6B3B |
| Pudú | Personaje y calidez | #FBF1E8 | #B8672E | #9A5424 | #7B421C |
| Copihue | Error | #FDECEC | #E0414A | #C22F3A | #9A2530 |
| Cielo | Selección, información y foco | #E9F3FC | #2C82D0 | #1F6DB5 | #185892 |
| Demarcación | Logros y simulacro | #FFF8E1 | #F5B21F | #D99A12 | #B07B0C |
| Asfalto | Estructura y texto | #F4F6F7 | #6B7883 | #52606B | #3B4852 |

Además: **Crema** `#FFF6E5` para celebraciones, y **Reflectante** `#FF7A1A` y **Plateado** `#C9D1D6` solo para ilustración.

### 3.2 Contrastes verificados (WCAG 2.1)

| Par | Contraste | Uso permitido |
|---|---|---|
| Blanco sobre Musgo 600 | 4,58 | Texto normal (AA) |
| Blanco sobre Copihue 600 | 5,58 | Texto normal (AA) |
| Blanco sobre Cielo 600 | 5,37 | Texto normal (AA) |
| Blanco sobre Pudú 600 | 5,73 | Texto normal (AA) |
| Blanco sobre Musgo 500 | 3,42 | Solo texto grande o íconos |
| Asfalto 900 sobre Demarcación 400 | 9,53 | Texto normal (AAA) |
| Musgo 700 sobre Musgo 50 | 5,86 | Texto normal (AA) |
| Copihue 700 sobre Copihue 50 | 6,86 | Texto normal (AA) |
| Cielo 700 sobre Cielo 50 | 6,56 | Texto normal (AA) |
| Asfalto 600 sobre Neblina | 5,97 | Texto secundario (AA) |
| Pudú 700 sobre Crema | 7,42 | Texto de Pudumóvil (AAA) |

### 3.3 Reglas de uso

- **Texto blanco solo sobre tonos 600 o más oscuros.**
- **Tonos 500 son decorativos:** rellenos grandes, ilustración, barra de progreso.
- **Demarcación siempre con texto oscuro.** Nunca blanco (1,58).
- **Selección usa Cielo, no Musgo.** Así "elegí esta opción" no se confunde con "está correcta".
- **Escenario de señal:** toda señal se muestra sobre `escenario-senal` (fondo blanco, borde Asfalto 200). No se ponen colores de marca a menos de 24 px de una señal.

---

## 4. Tipografía

**Fuentes:** Baloo 2 (display) y Nunito (texto), ambas desde Google Fonts. Se incluyen en la PWA para funcionar sin conexión.

| Token | Fuente | Peso | Tamaño / interlínea | Uso |
|---|---|---|---|---|
| `typography.celebracion` | Baloo 2 | 700 | 32 / 36 | Puntajes y celebraciones |
| `typography.titulo` | Baloo 2 | 700 | 24 / 30 | Título de pantalla |
| `typography.subtitulo` | Baloo 2 | 600 | 20 / 25 | Título de sección |
| `typography.enunciado` | Nunito | 700 | 20 / 28 | Enunciado de pregunta |
| `typography.cuerpo` | Nunito | 500 | 17 / 26 | Explicaciones y cuerpo |
| `typography.boton` | Nunito | 800 | 16 / 20 | Botones |
| `typography.etiqueta` | Nunito | 600 | 14 / 20 | Etiquetas y referencias |

**Reglas:**

- Baloo 2 **nunca en párrafos**. Máximo dos líneas.
- Tamaño mínimo: **14 px**.
- Botones en **minúscula con mayúscula inicial**. Nunca todo en mayúsculas.
- Cifras de velocidad y distancia siempre con espacio: "50 km/h".
- Respetar el ajuste de tamaño de texto del sistema (unidades `rem` en la implementación).

---

## 5. Forma, espacio y relieve

**Espaciado (base 4 px):** `space.1` 4 · `space.2` 8 · `space.3` 12 · `space.4` 16 · `space.6` 24 · `space.8` 32 · `space.12` 48.

**Radios:** `radius.sm` 8 (chips) · `radius.md` 12 (campos) · `radius.lg` 16 (botones y tarjetas) · `radius.xl` 24 (hojas inferiores) · `radius.full` (nodos y barras).

**Relieve sólido:**

- Borde inferior de **4 px** (`border-width.relieve`) en el tono 700 del mismo color.
- Elementos neutros: borde de 2 px en Asfalto 200 y borde inferior de 4 px del mismo color.
- **Al presionar:** `translateY(4px)` y borde inferior en 0, con duración `motion.presionar` (80 ms).
- **Sin sombras difusas** en la interfaz. La profundidad viene solo del relieve.

**Foco de teclado:** anillo de 3 px en Cielo 500 con separación de 2 px.

---

## 6. Componentes

### 6.1 Botón

| Variante | Fondo | Texto | Relieve | Uso |
|---|---|---|---|---|
| Primario | Musgo 600 | Blanco | Musgo 700 | Comprobar, Continuar, Empezar |
| Secundario | Blanco | Asfalto 900 | Asfalto 200 | Saltar, Ver por qué |
| Error | Copihue 600 | Blanco | Copihue 700 | Continuar después de fallar |
| Logro | Demarcación 400 | Asfalto 900 | Demarcación 600 | Iniciar simulacro, reclamar logro |

- Alto 52 px, ancho completo en acciones principales, radio 16 px.
- **Un solo botón primario por pantalla.**
- Estado deshabilitado: fondo Asfalto 200, texto Asfalto 400, sin relieve. Solo en "Comprobar" antes de elegir respuesta.

### 6.2 Alternativa de respuesta

- Tarjeta con borde 2 px, relieve 4 px, radio 16 px, alto mínimo 56 px.
- **Estados:** reposo (blanco), seleccionada (Cielo 50 con borde Cielo 500), correcta (Musgo 50 con borde Musgo 600 e ícono check), incorrecta (Copihue 50 con borde Copihue 600 e ícono X).
- Letra de alternativa (A, B, C, D) en un chip a la izquierda.

### 6.3 Hoja de retroalimentación

- **Colapsada:** veredicto con ícono, dos líneas de explicación y botón Continuar.
- **Expandida:** se abre al deslizar hacia arriba o tocar "Ver por qué". Alto máximo 85% de la pantalla.
- **Scroll interno** solo en el contenido. El fondo queda bloqueado.
- **Botón Continuar fijo** al fondo de la hoja. Nunca se desplaza con el contenido.
- Fondo `correcto.fondo` o `error.fondo`. Radio superior 24 px. Asa de arrastre visible.
- Referencia al libro al final, en `typography.etiqueta` con ícono de libro.
- Transición de apertura con `motion.hoja` (400 ms) y curva `easing.salida`.

### 6.4 Camino de niveles (zigzag)

- Nodos circulares de 72 px con relieve. Mini-simulacro de 88 px.
- Desplazamiento horizontal alterno de 56 px (patrón centro, derecha, centro, izquierda).
- **Estados:** completado (Musgo, check) · actual (Musgo, anillo Musgo 200 animado, Pudumóvil al lado) · bloqueado (Asfalto 200, candado) · mini-simulacro (Demarcación, ícono de trofeo).
- **Encabezado de nivel:** franja con relieve en Musgo 600, con número, nombre y avance.
- Al abrir la app, el camino se desplaza automáticamente al nodo actual.

### 6.5 Barra de preparación

- Alto 16 px, radio completo, pista Asfalto 200 y relleno Musgo 500.
- Porcentaje en `typography.subtitulo` a la derecha.
- Estado **"Lista para el examen":** el relleno cambia a Demarcación 400 y aparece un chip con ícono de bandera.
- Debajo, una línea en `typography.etiqueta` con la condición pendiente o la unidad más débil.

### 6.6 Progreso del bloque

- Barra superior durante la lección: alto 12 px, relleno Musgo 500.
- A la izquierda, botón de cerrar. A la derecha, número de pregunta del bloque.

### 6.7 Barra de navegación

- Alto 64 px más el área segura del dispositivo. Fondo blanco con borde superior Asfalto 200.
- **4 secciones:** Inicio · Repaso · Simulacro · Progreso.
- Activa: ícono y texto en Musgo 600. Inactiva: Asfalto 600.
- Repaso muestra un chip Copihue con la cantidad de ítems vencidos, si hay.
- Se oculta durante lecciones y simulacros.

### 6.8 Encabezado de simulacro

- Temporizador en `typography.subtitulo`. Cambia a Copihue 600 en los últimos 5 minutos.
- Contador "Pregunta 12 de 35" y puntaje posible restante.
- Marca de doble puntaje: chip Demarcación con texto "2 puntos".

### 6.9 Selector de meta diaria

- Tres tarjetas tipo alternativa: Corta (5 min) · Normal (10 min) · Intensa (15 min).
- Seleccionada con estado Cielo.

### 6.10 Pantalla de celebración

- Fondo Crema. Pudumóvil celebrando al centro.
- Resultado en `typography.celebracion`.
- Un botón primario para continuar.

---

## 7. Ilustración

### 7.1 Pudumóvil

- **Estilo:** 3D suave tipo plasticina. Formas redondas, textura mate, luz suave.
- **Accesorio fijo:** chaleco reflectante naranjo (`ilustracion.reflectante`) con franjas plateadas.
- **Luz:** siempre desde arriba a la izquierda, en todas las poses.
- **Único elemento 3D** de la app. Todo lo demás es plano.
- **Estados mínimos (fase 1):** neutral · explicando · celebrando · animando.
- **Formato:** WebP con transparencia, en 1x y 2x. Meta de peso: menos de 60 KB por imagen en 2x.
- **Herramienta:** Blender o Spline (pendiente de elegir). Si se usa IA generativa, se crea primero una hoja de referencia del personaje y todas las poses parten de ella.
- **Animación en fase 1:** solo movimientos de interfaz sobre la imagen: rebote (`easing.rebote`), escala y balanceo.

### 7.2 Señales

- SVG plano, redibujadas en Figma desde el Anexo 1 del PDF original de CONASET y el Manual de Señalización de Tránsito.
- Colores oficiales de cada señal. No usan tokens de marca.
- Siempre dentro del `escenario-senal`.

### 7.3 Escenas (vista superior plana)

Se generan con código desde el campo `escena` del JSON, usando estas piezas:

| Pieza | Token |
|---|---|
| Calzada | `color.escena.calzada` (Asfalto 700) |
| Demarcación blanca y amarilla | `color.escena.demarcacion-blanca` · `-amarilla` |
| Vereda | `color.escena.vereda` (Neblina) |
| Área verde | `color.escena.area-verde` (Musgo 100) |
| Tu auto | `color.escena.auto-tu` (Musgo 500) con marca "Tú" |
| Otros vehículos | `vehiculo-otro-1/2/3` (tonos neutros y suaves) |
| Peatones y ciclistas | Contorno `color.escena.contorno` |
| Flechas de intención | `color.escena.flecha` |

**Reglas:**

- Sin rojo, azul ni amarillo intensos en vehículos. No compiten con las señales.
- Cada vehículo tiene contorno de 2 px para separarse de la calzada.
- Tamaños relativos coherentes: auto 1x, camión 2x de largo, bicicleta 0,4x.
- Escala mínima tocable: 48 px por vehículo en el juego "¿Quién pasa primero?".

---

## 8. Movimiento

| Token | Valor | Uso |
|---|---|---|
| `duration.instantaneo` | 80 ms | Presionar botones y alternativas |
| `duration.rapido` | 150 ms | Cambios de estado, chips |
| `duration.base` | 250 ms | Transiciones entre preguntas |
| `duration.lento` | 400 ms | Hoja de retroalimentación |
| `duration.celebracion` | 700 ms | Celebraciones y Pudumóvil |
| `easing.estandar` | cubic-bezier(0.2, 0, 0, 1) | Movimiento general |
| `easing.salida` | cubic-bezier(0, 0, 0.2, 1) | Elementos que entran |
| `easing.entrada` | cubic-bezier(0.4, 0, 1, 1) | Elementos que salen |
| `easing.rebote` | cubic-bezier(0.34, 1.56, 0.64, 1) | Celebraciones y personaje |

**Reglas:**

- Con **"reducir movimiento"** activo en el sistema, las duraciones bajan a 0 ms y se eliminan rebotes y balanceos. Solo quedan cambios de opacidad.
- Nada se anima más de 700 ms, salvo animaciones de escena en fase 2.
- El temporizador del simulacro no parpadea.

---

## 9. Accesibilidad

- Contraste AA mínimo en todo texto (ver 3.2).
- Estados con color, ícono y texto.
- Áreas táctiles de 48 px o más.
- Foco visible con anillo Cielo 500.
- Escenas con descripción textual alternativa generada desde el JSON.
- Respeta tamaño de texto y reducir movimiento del sistema.

---

## 10. Modo oscuro (fase posterior)

- Se crea `tokens/semanticos.oscuro.json` que redefine solo la capa semántica.
- Fondos: Asfalto 900 y 800. Texto: Asfalto 50 y 300.
- Rellenos de marca y feedback mantienen los tonos 600. Los fondos de feedback pasan a los tonos 900.
- Pudumóvil no cambia, pero se revisa su contorno sobre fondo oscuro.
- Las escenas mantienen su paleta, con el marco exterior oscuro.

---

## 11. Pendientes

| Pendiente | Quién |
|---|---|
| Elegir herramienta 3D para Pudumóvil (Blender, Spline o IA con hoja de referencia) | Pau |
| Diseñar la hoja de referencia de Pudumóvil y sus 4 estados | Pau |
| Definir set de íconos (propuesta: una librería de íconos redondeados con trazo grueso) | Pau |
| Crear `semanticos.oscuro.json` | Fase posterior |
