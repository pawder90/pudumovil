# Pudumóvil: hoja de referencia del personaje

**Versión:** 1.0 · **Fecha:** 15 de septiembre de 2026
**Complementa a:** `sistema-diseno-pudumovil.md` (sección 7.1)
**Esquema visual:** `pudumovil-esquema-proporciones.svg` (guía plana de proporciones, no es el render final)

---

## 1. Identidad

- **Qué es:** un pudú, el ciervo más pequeño del mundo, de los bosques del sur de Chile.
- **Rol:** guía de estudio. Explica el porqué, anima después de un error y celebra los logros.
- **Personalidad:** paciente, atento y amable. Tono neutro, sin exageraciones.
- **Rasgo fijo:** chaleco reflectante naranjo. Nunca se lo quita.
- **Estilo:** 3D suave tipo plasticina, lisa y mate. Es el único elemento 3D de la app.

---

## 2. Proporciones

La unidad de medida es **H**, el alto de la cabeza.

| Parte | Medida | Notas |
|---|---|---|
| Altura total | 2,5 H | Cabeza 1 H + cuerpo 1,5 H |
| Cabeza | 1 H de alto · 1,1 H de ancho | Forma ovalada, más ancha que alta |
| Orejas | 0,5 H de largo · 0,35 H de ancho | Redondeadas. Salen hacia los lados con 30° hacia arriba |
| Botones de cuernos | 0,06 H de diámetro | Dos bultos sobre la frente, separados 0,22 H |
| Ojos | 0,12 H de diámetro | Separados 0,4 H de centro a centro. Al 55% del alto de la cabeza |
| Brillo del ojo | 0,04 H | Arriba a la izquierda del ojo |
| Nariz | 0,08 H | Redonda, al 72% del alto de la cabeza |
| Boca | 0,14 H de ancho | Curva pequeña bajo la nariz |
| Torso | 0,8 H de alto · 0,9 H de ancho | Forma de cápsula |
| Brazos | 0,6 H de largo | Llegan a la cadera |
| Mitones | 0,2 H de diámetro | Pezuñas redondas, sin dedos |
| Piernas | 0,7 H de largo | Cortas y robustas |
| Pies | 0,3 H de largo | Separados 0,3 H entre sí |
| Cola | 0,15 H | Visible solo en perfil y espalda |

**Ajuste respecto de la ronda anterior:** los botones de cuernos pasaron de "un cuarto del ojo" a **la mitad del ojo** (0,06 H). Al tamaño mínimo de 72 px, un cuarto del ojo mediría menos de 1 px y desaparecería.

**Dos pruebas de lectura:**

1. **Silueta:** con el personaje relleno de un solo color deben leerse las orejas, la cabeza grande y las extremidades cortas. Los botones y el chaleco quedan dentro del contorno, así que no cuentan para esta prueba.
2. **72 px a color:** deben distinguirse el chaleco con sus franjas, los ojos y la nariz. Los botones de cuernos pueden perderse a este tamaño; son un detalle para tamaños de 120 px o más.

---

## 3. Vistas giratorias

Se modelan y renderizan cuatro vistas en pose neutral, a la misma escala y con la misma línea de piso:

1. **Frente (0°):** simetría total. Sirve de referencia de medidas.
2. **Tres cuartos (30°):** la vista por defecto de la app.
3. **Perfil (90°):** muestra el hocico, la cola y el grosor del chaleco.
4. **Espalda (180°):** muestra la cola y el chaleco cerrado atrás.

---

## 4. Paleta del personaje

| Elemento | Color | Token |
|---|---|---|
| Pelaje | #B8672E | `color.pudu.500` |
| Sombra del pelaje | #7B421C | `color.pudu.700` |
| Luz del pelaje | #DB965F | `color.pudu.300` |
| Botones de cuernos | #7B421C | `color.pudu.700` |
| Nariz y boca | #40210E | `color.pudu.900` |
| Ojos | #1C2830 | `color.asfalto.900` |
| Brillo de ojos | #FFFFFF | `color.asfalto.0` |
| Chaleco | #FF7A1A | `color.ilustracion.reflectante` |
| Franjas reflectantes | #C9D1D6 | `color.ilustracion.plateado` |
| Lengua (solo boca abierta) | #EA6B74 | `color.copihue.300` |

**Reglas:**

- El pelaje es **uniforme**. El interior de las orejas, el hocico y la panza usan el mismo color. La profundidad viene solo de la luz.
- Las sombras y luces del render deben quedar cerca de los tonos 700 y 300. Si el render se ve más oscuro o más saturado, se ajusta la luz, no el material.

---

## 5. Material y luz

**Material:**

- Plasticina **lisa y mate**, sin huellas ni texturas.
- Rugosidad alta (cercana a 0,7). Sin reflejos fuertes.
- Leve dispersión de luz bajo la superficie, para un aspecto blando.
- Las franjas del chaleco tienen un brillo un poco mayor, para sugerir material reflectante.
- **Único brillo nítido:** el punto blanco de los ojos.

**Luz:**

- **Principal:** arriba a la izquierda, a 45°.
- **Relleno:** suave desde la derecha, para que la sombra no quede negra.
- **Contorno:** luz leve desde atrás, para separar la silueta de fondos claros y oscuros.
- **Sin sombra de piso** en la imagen. Si hace falta, la interfaz la agrega.

**Cámara:**

- Lente equivalente a 50–85 mm, sin deformación de gran angular.
- Altura de cámara a la altura del pecho del personaje.

---

## 6. Expresiones

Los ojos de punto no tienen cejas ni párpados. La emoción se construye con cuatro piezas:

| Pieza | Opciones |
|---|---|
| Ojos | Punto · Arco feliz (∩ invertido) · Línea cerrada |
| Orejas | Arriba · Hacia los lados · Levemente abajo · Hacia adelante |
| Boca | Sonrisa suave · Sonrisa abierta con lengua · Línea recta |
| Cabeza | Recta · Inclinada 10–15° |

---

## 7. Los 4 estados

| Estado | Cuándo aparece | Ojos | Orejas | Boca | Cuerpo |
|---|---|---|---|---|---|
| **Neutral** | Camino de niveles, inicio de unidad | Punto | Hacia los lados | Sonrisa suave | De pie en tres cuartos, brazos a los lados |
| **Explicando** | Hoja de retroalimentación, introducción de unidad | Punto | Hacia adelante | Sonrisa suave | Un brazo levantado señalando hacia arriba, cabeza inclinada |
| **Celebrando** | Meta diaria, fin de lección, simulacro aprobado | Arco feliz | Arriba | Abierta con lengua | Salto con ambos brazos arriba, pies despegados |
| **Animando** | Después de un error, simulacro no aprobado | Punto | Levemente abajo | Sonrisa suave | Una pezuña levantada a la altura del hombro, gesto de "vamos" |

**Regla de composición:** Pudumóvil siempre mira y señala **hacia el contenido**. Se renderiza mirando a la derecha y la interfaz lo refleja cuando va al lado derecho de la pantalla. Por eso el chaleco debe verse bien en ambas direcciones: sin logos ni textos.

---

## 8. Exportación

| Parámetro | Valor |
|---|---|
| Formato | WebP con transparencia |
| Lienzo | Cuadrado. 400 × 400 px (2x) y 200 × 200 px (1x) |
| Encuadre | Personaje centrado. Pies apoyados al 90% del alto del lienzo |
| Escala | Idéntica en los 4 estados. En "celebrando" los pies suben, pero la cabeza mantiene su tamaño |
| Calidad | 80 |
| Peso máximo | 60 KB en 2x |
| Nombres | `pudumovil-neutral@2x.webp`, `pudumovil-explicando@2x.webp`, etc. |

---

## 9. Sí y no

**Sí:**

- Mantener siempre el chaleco, los botones de cuernos y el brillo del ojo.
- Mantener la misma luz y cámara en todas las poses.
- Probar cada pose a 72 px antes de aprobarla.
- Expresar emoción con orejas y cuerpo antes que con la cara.

**No:**

- No agregar cejas, pestañas, dedos ni ropa extra.
- No cambiar el color del pelaje ni agregar manchas.
- No usar sombras de piso ni fondos dentro de la imagen.
- No exagerar la emoción: ni llanto, ni enojo, ni burla después de un error.
- No poner a Pudumóvil encima de una señal ni tapando contenido de estudio.

---

## 10. Producción: tres caminos

| Camino | Ventajas | Riesgos | Consistencia |
|---|---|---|---|
| **Blender** | Control total, gratis, poses reutilizando un mismo modelo con esqueleto | Curva de aprendizaje alta | Muy alta |
| **Spline** | 3D en el navegador, flujo cercano a herramientas de diseño, exporta imágenes | Menos control fino de materiales y poses | Alta |
| **IA generativa** | Muy rápido para explorar | El personaje cambia entre imágenes; difícil respetar medidas exactas | Baja, salvo con hoja maestra |

**Recomendación:** explorar con IA para encontrar el look, y producir las poses finales en **Spline o Blender** a partir de un solo modelo. Así los 4 estados comparten exactamente la misma geometría, luz y color.

**Si se usa IA para explorar**, conviene partir con una imagen maestra y usar siempre esta base de instrucción:

```
Personaje 3D estilo plasticina lisa y mate: un pudú (ciervo pequeño del sur de Chile)
erguido en dos patas, proporción de 2,5 cabezas de alto. Pelaje café uniforme (#B8672E),
orejas grandes redondeadas hacia los lados, dos pequeños botones redondos en la frente
en lugar de cuernos, ojos negros de punto con un brillo blanco, nariz redonda casi negra,
boca pequeña sonriente. Pezuñas redondas tipo mitón, sin dedos. Chaleco reflectante
naranjo (#FF7A1A) con dos franjas horizontales plateadas. Luz suave desde arriba a la
izquierda, fondo transparente, sin sombra de piso, vista tres cuartos mirando a la derecha.
Pose: [neutral | explicando | celebrando | animando].
```
