# Reel · TPO · Parte 1: "Cómo se lee una subasta"

Mismo formato que Volume Profile 1 y 2: el trader en su escritorio (pantallas llenas de letras TPO, el certificado de MFF en la pared) y el visitante que entra a preguntar.
1080×1920 (9:16), 30 fps, **85 s**. Archivo: `out/reel.mp4` (sin subtítulos, sin música, solo efectos suaves).

Los perfiles TPO se construyen **letra a letra, periodo a periodo**, y cada letra suena con un "tic" suave al caer (más agudo cuanto más alta la fila).
Estética de tu ficha: panel oscuro, letras monoespaciadas claras y la zona del concepto resaltada con su bloque de color y etiqueta (IBH/IBL, SP, EXCESS).

Enfoque **solo informativo**: "cómo se ve" y "qué significa". Nada de entradas, objetivos, stops ni soportes/resistencias.
Aviso visible todo el vídeo: *Contenido educativo · No es consejo financiero*.

## Voces

- **Visitante** (gorra naranja): una frase.
- **Trader** (tú): todo lo demás. En el cierre, tono de intriga.

Ritmo ≈ 3 palabras/segundo. Graba cada bloque por separado y colócalo al inicio de su escena.

| Tiempo | En pantalla | Quién | Lo que se dice |
|---|---|---|---|
| **0:00 – 0:01,5** | Estás tecleando; las pantallas llenas de letras; entra el visitante | — | *(solo ambiente)* |
| **0:01,5 – 0:03,5** | Bocadillo del visitante | Visitante | "¿Qué es esta sopa de letras?" |
| **0:03,6 – 0:07,4** | Te giras · zoom a la pantalla · titular **"No son letras. Es la historia del día."** | Tú | "No son letras. Es la historia del día." |
| **0:07,4 – 0:20** | **TPO**: panel con eje de precios; el precio se mueve y cada letra cae en su nivel. Reloj del periodo: "A 9:30–10:00 NY", "B 10:00–10:30"… | Tú | "Cada letra es un periodo de 30 minutos: la A es el primero de la sesión de Nueva York, la B el segundo, y así. Cada vez que el precio pasa por un nivel en ese periodo, se apunta su letra. Y así se forma el perfil." |
| **0:20 – 0:35** | **INITIAL BALANCE**: A y B resaltadas, el resto atenuado · barra vertical turquesa a la izquierda con **IBH** arriba e **IBL** abajo · "A + B = 9:30–10:30 · la 1.ª hora" | Tú | "Las dos primeras, A y B, forman el Initial Balance: el rango de la primera hora de Nueva York. Se marca con una barra a la izquierda del perfil: IBH arriba, IBL abajo. Es el primer rango que el mercado establece en la sesión." |
| **0:35 – 0:52** | **SINGLE PRINTS**: nuevo perfil (doble distribución); la E sube sola por 5 niveles · bloque turquesa "single prints" + etiqueta **SP** · corchetes "1.ª / 2.ª distribución" | Tú | "Ahora, los single prints. Una sola letra, un solo periodo, en varios niveles seguidos, en medio del perfil. Significa que el precio se movió rápido, sin negociación en los dos sentidos. Parecido a un FVG. Y en una doble distribución, son lo que separa los dos bloques." |
| **0:52 – 1:10** | **TAIL / EXCESS**: nuevo perfil · bloque rojo arriba "selling tail" (C ×3) · bloque azul abajo "buying tail" (A ×2) · etiquetas **EXCESS** | Tú | "Y la tail, o excess. La misma letra repetida en dos o más filas, en el extremo del perfil. Si está arriba, es una selling tail. Si está abajo, una buying tail. Significa que la subasta terminó en ese extremo: hubo un rechazo fuerte." |
| **1:10 – 1:16** | El mazo dorado cae (tu imagen) · golpe y polvo dorado · **"Una tail significa que la subasta terminó."** | Tú | "Una tail significa que la subasta terminó." |
| **1:16 – 1:21** | Se oscurece · **"Pero algunas… no terminan."** · aparece un perfil con el techo plano y un "?" que parpadea | Tú | "Pero algunas… no terminan." |
| **1:21 – 1:25** | Negro · **"TPO · Parte 2"** · "POOR HIGH · POOR LOW · UFA" · "Las que no terminan. Sígueme… o te la pierdes." · @alt_stas | Tú | "Eso, en la parte 2. Sígueme… o te la pierdes." |

### Texto sugerido para la descripción
> TPO, parte 1: cómo se lee una subasta. Cada letra es media hora de la sesión de Nueva York. Initial Balance, single prints y tails. Una tail significa que la subasta terminó… pero algunas no terminan. Parte 2 muy pronto. Contenido educativo, no es consejo financiero.

## "Prueba real" con tus capturas
Si me pasas capturas de tus gráficos TPO (o las pones tú), guárdalas con estos nombres y salen solas al final de cada concepto, con el sello **PRUEBA REAL**. Sin el archivo, la escena sigue sin ella.

| Archivo | Sale en |
|---|---|
| `assets/prueba-ib.png` | 0:31,2 – 0:34,8 |
| `assets/prueba-sp.png` | 0:49,4 – 0:51,9 |
| `assets/prueba-excess.png` | 1:06,4 – 1:09,7 |

## Referencias usadas
`referencias/`: tus fichas de Initial Balance, Single prints y Tail/Excess. `assets/mazo.webp`: tu imagen del mazo (cierre).

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
node render.mjs --stills=9,23,44 # solo PNGs de esos segundos
```
