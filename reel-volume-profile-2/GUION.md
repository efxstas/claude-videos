# Reel · Volume Profile · Parte 2 (LVN, Ledge y Shelf)

Mismo formato que la parte 1: el trader en su escritorio (footprint arriba, velas y VP abajo, el certificado de MFF en la pared) y el visitante que entra a preguntar.
1080×1920 (9:16), 30 fps, **86 s**. Archivo: `out/reel.mp4` (sin subtítulos, solo efectos suaves).

Enfoque **solo informativo**: qué es cada nivel ("cómo se ve" y "qué significa", sacado de tus fichas), sin decir cómo operarlo.
El final juega con el ego: gafas de sol y "información confidencial".

## Voces

- **Visitante** (gorra naranja): dos frases.
- **Trader** (tú): todo lo demás. En el final, tono chulo y sobrado.

Ritmo ≈ 3 palabras/segundo. Graba cada bloque por separado y colócalo al inicio de su escena.

| Tiempo | En pantalla | Quién | Lo que se dice |
|---|---|---|---|
| **0:00 – 0:02,7** | Estás tecleando y entra el visitante | — | *(solo ambiente)* |
| **0:02,7 – 0:05** | Bocadillo del visitante | Visitante | "Vale… ¿y qué niveles del VP debería usar?" |
| **0:05 – 0:08,6** | Te giras; zoom al monitor | Tú | "Dame tu tiempo y te lo explico." |
| **0:08,6 – 0:18** | "Los niveles que SÍ uso" · POC/VAH/VAL tachados · "…mira la FORMA del perfil" · LVN, LEDGE y SHELF | Tú | "En la parte 1 viste el POC, el VAH y el VAL. Ahora, los que sí miro yo. Olvídate de las líneas: lo importante es la forma del perfil." |
| **0:18 – 0:34** | **LVN**: hueco en rojo entre dos bultos · el precio lo cruza de golpe (FLUSH) | Tú | "Primero, el LVN, Low Volume Node: un hueco estrecho entre dos bultos del perfil. Ahí casi no se negoció. Significa rechazo: el precio reacciona en esa zona… o la atraviesa muy rápido, lo que llamamos flush." |
| **0:34 – 0:48** | **LEDGE**: borde marcado en ámbar · contorno del perfil y "¡acantilado!" | Tú | "Segundo, el ledge. Es el borde donde el volumen cae de golpe, como un acantilado. Te dice que el precio salió rápido de una zona de aceptación: alguien tenía prisa." |
| **0:48 – 1:03** | **SHELF**: escalón en ámbar entre HVN y LVN · "▲ más caro / ▼ más barato" | Tú | "Y tercero, el shelf: un escalón en el perfil, donde el volumen baja entre un nodo alto y uno bajo, a menudo con otro pico cerca. Es la transición de precio justo a injusto: arriba caro, abajo barato, y en ambos el volumen se agota." |
| **1:03 – 1:10** | Resumen: 3 tarjetas con mini-perfiles | Tú | "LVN, ledge y shelf. La forma del perfil te cuenta lo que el POC no te dice." |
| **1:10 – 1:13,8** | Vuelta a la habitación | Visitante | "¿Y cómo los operas tú? ¡Cuéntame más!" |
| **1:13,8 – 1:20** | Te caen unas gafas de sol | Tú | "¿Más? No, no… Eso ya es información confidencial." |
| **1:20 – 1:26** | Carpeta "Archivo @alt_stas" con sello **CONFIDENCIAL** · "Lo bueno no se regala." | Tú | "Lo bueno no se regala. Sígueme… y quizá algún día lo suelte." |

### Texto sugerido para la descripción
> Volume Profile, parte 2: los niveles que sí miro. LVN, ledge y shelf. La forma del perfil te cuenta lo que el POC no te dice. ¿Cómo los opero? Eso es confidencial. 😎 Contenido educativo, no es consejo financiero.

## Referencias usadas
`referencias/`: tus fichas de LVN, Ledge y Shelf.

## Volver a renderizar

```bash
node sfx.mjs                     # regenera assets/sfx.wav
node render.mjs                  # out/reel.mp4 (sin subtítulos)
node render.mjs --captions       # out/reel_con_subtitulos.mp4
```
