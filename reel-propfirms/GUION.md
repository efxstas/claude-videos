# Reel · "1.000 $ y 52 % de WR: ¿se puede ser rentable?"

Vídeo educativo. 1080×1920 (9:16), 30 fps, **86 s**. Archivo: `out/reel.mp4` (con subtítulos).
El audio solo lleva efectos suaves, sin música (la pones tú en el editor) y sin voz.

## Narración (para leer tú)

Tono: profesor/explicador, en segunda persona ("tú", "si alguien…"). Nunca "yo hago esto".
Los subtítulos del vídeo siguen exactamente este texto y estos tiempos. Ritmo ≈ 3 palabras/segundo.
Truco: graba cada bloque por separado y colócalo al inicio de su escena en el editor.

| Tiempo | En pantalla | Lo que dices |
|---|---|---|
| **0:00 – 0:07** | Chat con la IA: "Con 1.000 $ y un 52 % de winrate, ¿se puede ser rentable con prop firms?" | "¿Se puede ser rentable en prop firms con solo 1.000 dólares y un 52 % de winrate? Vamos a verlo con matemáticas." |
| **0:07 – 0:15** | 01 · Balanza 52 verdes vs 48 rojas · EV = +0,04R | "Primero, el EV: lo que ganas de media cada vez que repites algo. Con un 52 % a ratio 1:1, ganas 52 veces y pierdes 48. Eso deja +0,04R por trade. Pequeño, pero positivo." |
| **0:15 – 0:20** | 02 · Los billetes se convierten en 10 cuentas | "Con 1.000 dólares compras 10 cuentas de 100. Cada una, a todo o nada." |
| **0:20 – 0:32** | 03 · Barra 3.000 $ (2 × 1.500) · monedas · quedan 3 fondeadas | "La evaluación pide 3.000 de objetivo con regla de consistencia del 50 %: mínimo dos días de 1.500. Dos trades ganados seguidos: 52 % por 52 %, un 27 %. De 10 cuentas, unas 3 llegan a fondeada." |
| **0:32 – 0:40** | 04 · **El día grande**: 3 fondeadas lanzan moneda, una se QUEMA | "Pero ojo: en la fondeada, el día grande también es un 52 %. Si sale mal, la cuenta se quema. De esas 3, solo 1 o 2 sobreviven." |
| **0:40 – 0:53** | 05 · Calendario +2.000 / 4 × +200 · RETIRAR 50 % · ≈ 1.260 $ | "Las que sobreviven ya tienen un colchón de 2.000. Los otros 4 días haces 200 con riesgo mínimo. Son 2.800 en 5 días verdes, retiras la mitad: unos 1.260 después del split. Y la cuenta sigue viva." |
| **0:53 – 1:03** | 06 · Embudo 10 → 2,7 → 1,4 · 14 % · 78 % · EV ≈ +770 $ | "Resumen: 27 % por 52 %, un 14 % de llegar a payout por cuenta. Con 10 cuentas, un 78 % de cobrar al menos una vez. Valor esperado del plan: unos +770 dólares." |
| **1:03 – 1:15** | 07 · **¿Y si subes el winrate?** El winrate pasa de 52 → 53 → 55 → 60 % | "Ahora imagina que tu winrate fuese un poco mayor. Con solo un 53 %, el EV sube a unos 880. Con un 55 %, casi 1.100. Y con un 60 %, más del doble: unos 1.700 dólares." |
| **1:15 – 1:20** | Resultados reales: email de Lucid "Payout Requested" | "Por eso subir tu winrate lo cambia todo. Estos son payouts reales." |
| **1:20 – 1:26** | La IA se apaga · texto final · @alt_stas · aviso educativo | "No necesitas un 80 % de winrate. Necesitas entender las matemáticas. No es suerte: es EV." |

### Texto sugerido para la descripción del post
> Vídeo educativo: cómo las matemáticas (EV) cambian la forma de ver las prop firms. Los números son un modelo simplificado (trades 1:1, split del 90 %, sin comisiones). No es consejo financiero.

## Comprobación de números

| Winrate | Pasar evaluación (wr²) | Payout por cuenta (wr³) | Cobrar ≥1 vez (10 cuentas) | EV del plan |
|---|---|---|---|---|
| 52 % | 27,0 % | 14,1 % | 78 % | +772 $ |
| 53 % | 28,1 % | 14,9 % | 80 % | +876 $ |
| 55 % | 30,3 % | 16,6 % | 84 % | +1.096 $ |
| 60 % | 36,0 % | 21,6 % | 91 % | +1.722 $ |

- Payout: 2.000 + 4 × 200 = 2.800 → 50 % = 1.400 → con split del 90 % ≈ 1.260 $
- EV del plan = 10 × wr³ × 1.260 − 1.000
- Fondeadas que superan el día grande: 2,7 × 0,52 ≈ 1,4

## Volver a renderizar

```bash
node sfx.mjs                     # regenera assets/sfx.wav (solo efectos)
node render.mjs                  # out/reel.mp4
node render.mjs --no-captions    # out/reel_sin_subtitulos.mp4
```

Vista previa en vivo: abre `reel.html` en el navegador (`reel.html?t=63` empieza en el segundo 63).
