# Reel · Volume Profile · Parte 1 (POC, VAH y VAL)

Formato nuevo: un trader en su escritorio (3 monitores: footprint arriba, velas y Volume Profile abajo; en la pared, su certificado de payout de MFF por 2.000 $) y alguien que entra a preguntarle un concepto.
1080×1920 (9:16), 30 fps, **81 s**. Archivo: `out/reel.mp4` (sin subtítulos, solo efectos suaves).

El perfil de volumen del vídeo se calcula de verdad a partir de las 60 velas que aparecen en pantalla:
el POC es la barra más larga y el Value Area es el 70 % del volumen, ampliado desde el POC.

## Voces

- **Visitante** (gorra naranja): dos frases cortas. Puedes ponerle otra voz, pedírsela a un amigo o dejarla solo como bocadillo.
- **Trader** (tú): todo lo demás.

Ritmo ≈ 3 palabras/segundo. Graba cada bloque por separado y colócalo al inicio de su escena.

| Tiempo | En pantalla | Quién | Lo que se dice |
|---|---|---|---|
| **0:00 – 0:02,7** | Habitación: estás tecleando y el visitante entra andando | — | *(solo ambiente: teclado y pasos)* |
| **0:02,7 – 0:05** | Bocadillo del visitante | Visitante | "Oye… ¿qué es eso del Volume Profile?" |
| **0:05 – 0:08,6** | Te giras en la silla; zoom al monitor | Tú | "Dame tu tiempo y te lo explico." |
| **0:08,6 – 0:21** | Velas → volumen por tiempo debajo → barrido que construye el perfil a la derecha · "Dónde se negoció, no cuándo" | Tú | "El volumen normal te dice cuánto se negoció en cada vela, en el tiempo. El Volume Profile lo gira y te dice cuánto se negoció en cada precio. Es una radiografía de dónde ha estado el dinero." |
| **0:21 – 0:31** | "Cómo se lee": barras largas en verde agua, cortas en rojo · aparecen POC, VAH y VAL | Tú | "Las barras largas son precios donde el mercado se sintió cómodo y negoció mucho. Las cortas, precios que cruzó rápido. De aquí salen sus tres niveles más famosos." |
| **0:31 – 0:44** | **POC**: la barra más larga brilla y aparece la línea · el precio se aleja y vuelve (imán) | Tú | "El POC, Point of Control: la barra más larga, el precio más aceptado. Actúa como un imán: el precio tiende a volver a él. Úsalo como objetivo en rotaciones dentro del rango, pero no esperes una reacción violenta ahí." |
| **0:44 – 1:03** | **Value Area 70 %**: bloque sombreado, VAH y VAL · zona cara arriba, barata abajo · "Es CONTEXTO, no una entrada" · flechas VAH → POC (TP1) → VAL (TP2) | Tú | "El Value Area es el bloque donde se negoció el 70 % del volumen. Su techo es el VAH y su suelo, el VAL. Por encima, el precio está caro; por debajo, barato. Pero es contexto, no una entrada: en VAH o VAL confirma con el footprint. Si rebota, TP1 en el POC y TP2 en el otro extremo." |
| **1:03 – 1:09** | POC, VAH y VAL tachados: "Los niveles que más vas a oír… y para mí, los MENOS importantes." | Tú | "Estos son los niveles que más vas a oír… y, para mí, los menos importantes." |
| **1:09 – 1:12,8** | Vuelta a la habitación | Visitante | "¿Y cuáles usas tú, entonces?" |
| **1:12,8 – 1:17** | Bocadillo tuyo | Tú | "Eso te lo cuento en la Parte 2." |
| **1:17 – 1:21** | "VOLUME PROFILE · Parte 1" · "Sígueme para la Parte 2" · @alt_stas | Tú | "Sígueme para no perdértela." |

### Texto sugerido para la descripción
> Volume Profile, parte 1: qué es y sus 3 niveles más famosos (POC, VAH y VAL). Son los que más vas a oír… y para mí, los menos importantes. En la parte 2, los que sí uso. Contenido educativo, no es consejo financiero.

## Referencias usadas
`referencias/`: el esquema genérico de Volume Profile y tus fichas de POC y Value Area (los textos de "qué significa" y "qué hacer" salen de ahí).

## Volver a renderizar

```bash
node sfx.mjs                     # regenera assets/sfx.wav
node render.mjs                  # out/reel.mp4 (sin subtítulos)
node render.mjs --captions       # out/reel_con_subtitulos.mp4
```

Vista previa en vivo: abre `reel.html` en el navegador (`reel.html?t=31` empieza en el segundo 31).
