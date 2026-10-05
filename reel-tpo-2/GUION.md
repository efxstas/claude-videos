# Reel · TPO · Parte 2: "Las subastas que no terminan"

Continúa el gancho de la parte 1 ("Pero algunas… no terminan"). Mismo formato: el trader en su escritorio (footprint arriba, perfiles TPO abajo, el certificado de MFF en la pared) y el visitante que vuelve a preguntar.
1080×1920 (9:16), 30 fps, **85 s**. Archivo: `out/reel.mp4` (sin subtítulos, sin música, solo efectos suaves).

Perfiles TPO construidos **letra a letra**, con un "tic" suave por letra. Bloques de color y etiquetas como en tu ficha: **POOR H**, **POOR L**, **UFA**.
Enfoque **solo informativo**: "cómo se ve" y "qué significa". Nada de entradas, objetivos, stops ni soportes/resistencias.
Aviso visible todo el vídeo: *Contenido educativo · No es consejo financiero*.

> **Ojo con la UFA:** la expliqué con la definición de order flow: en el último precio del extremo hay operaciones en bid **y** en ask (ningún lado a cero), y la muestro con una celda de footprint junto al perfil. Si en tu ficha la UFA se define solo con las letras TPO, pásamela y la ajusto.

## Voces

- **Visitante** (gorra naranja): dos frases.
- **Trader** (tú): todo lo demás. En el final, gafas de sol y tono chulo.

Ritmo ≈ 3 palabras/segundo. Graba cada bloque por separado y colócalo al inicio de su escena.

| Tiempo | En pantalla | Quién | Lo que se dice |
|---|---|---|---|
| **0:00 – 0:01,6** | Estás tecleando y entra el visitante | — | *(solo ambiente)* |
| **0:01,6 – 0:04,3** | Bocadillo del visitante | Visitante | "¿Cómo que algunas subastas no terminan?" |
| **0:04,4 – 0:06,8** | Te giras; zoom a la pantalla | Tú | "Mira los extremos del perfil." |
| **0:06,8 – 0:19** | **REPASO**: dos perfiles lado a lado · izquierda con tail (**EXCESS ✓**) · derecha con techo plano (**SIN TAIL ✗**, "?") | Tú | "En la parte 1 viste la tail: la misma letra en el extremo. Eso es una subasta terminada. Pero cuando el extremo no tiene tail… la subasta se queda a medias." |
| **0:19 – 0:35** | **POOR HIGH**: C, D, F y G se paran en la misma fila · bloque ámbar "poor high" + **POOR H** · línea "techo plano" · abajo, en azul suave, "buying tail ✓" para comparar | Tú | "Primero, el poor high. El techo del perfil es plano: varias letras distintas en la misma fila, y ninguna por encima. Sin tail. Significa que arriba no hubo un rechazo fuerte: la subasta en ese extremo quedó débil, sin terminar." |
| **0:35 – 0:49** | **POOR LOW**: C, D y F alineadas en la fila más baja · **POOR L** · "suelo plano" · arriba, "selling tail ✓" | Tú | "El poor low es lo mismo, pero en el suelo del perfil. Varias letras alineadas en la fila más baja, sin buying tail. Abajo tampoco hubo un rechazo claro." |
| **0:49 – 1:05** | **UFA**: el perfil del poor high · celda de footprint arriba "27 × 31" (*compras Y ventas*) · abajo "0 × 38" (*un lado a cero ✓*) | Tú | "Y la UFA, unfinished auction. Si miras el footprint en ese extremo, en el último precio hubo compras y ventas. En una subasta terminada, un lado se queda a cero. Aquí no: había interés en los dos lados. Suele coincidir con un poor high o un poor low." |
| **1:05 – 1:12** | Resumen: "Terminada o a medias" · 3 tarjetas: EXCESS · POOR H/L · UFA | Tú | "Tail: subasta terminada. Poor high, poor low y UFA: subastas a medias." |
| **1:12 – 1:16** | Vuelta a la habitación | Visitante | "¿Y qué pasa luego con las que no terminan?" |
| **1:16 – 1:20** | Te caen unas gafas de sol | Tú | "Eso… ya es información confidencial." |
| **1:20 – 1:25** | Negro · **"El mercado odia dejar cosas a medias."** · "Lo que pasa después… solo lo ven los que me siguen." · @alt_stas · "TPO · continuará" | Tú | "El mercado odia dejar cosas a medias. Lo que pasa después… solo lo ven los que me siguen." |

### Texto sugerido para la descripción
> TPO, parte 2: las subastas que no terminan. Poor high, poor low y UFA. Una tail cierra la subasta; un extremo plano la deja a medias. ¿Y qué pasa después? Eso es confidencial. 😎 Contenido educativo, no es consejo financiero.

## "Prueba real" con tus capturas
Guarda tus capturas TPO con estos nombres y salen solas al final de cada concepto, con el sello **PRUEBA REAL**. Sin el archivo, la escena sigue sin ella.

| Archivo | Sale en |
|---|---|
| `assets/prueba-poor-high.png` | 0:32,0 – 0:34,8 |
| `assets/prueba-poor-low.png` | 0:46,4 – 0:48,8 |
| `assets/prueba-ufa.png` | 1:01,4 – 1:04,8 |

## Referencias usadas
`referencias/`: tu ficha de Tail/Excess (para el repaso).

## Archivos
- `tpo.js`: cómo se arma un perfil TPO (qué letra cae en qué fila y cuándo).
- `datos.js`: los perfiles de este reel. Cada periodo es el camino del precio, p. ej. `[9, 12, 7]` = sube de la fila 9 a la 12 y baja a la 7.
- `common.js`: la habitación, el panel, las etiquetas y el render (igual en las dos partes).
- `reel.html`: las escenas y los tiempos.

## Volver a renderizar

```bash
node sfx.mjs                     # regenera assets/sfx.wav (un tic por letra, leído de datos.js)
node render.mjs                  # out/reel.mp4 (sin subtítulos)
node render.mjs --captions       # out/reel_con_subtitulos.mp4
node render.mjs --stills=11,28,55 # solo PNGs de esos segundos
```
