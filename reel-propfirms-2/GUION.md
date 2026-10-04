# Reel Parte 2 · "Payout ≠ rentable: RR, winrate y varianza"

Vídeo educativo. 1080×1920 (9:16), 30 fps, **88 s**. Archivo: `out/reel.mp4` (sin subtítulos).
El audio solo lleva efectos suaves: sin música ni voz.

## Narración (para leer tú)

Tono: explicador, en segunda persona. Ritmo ≈ 3 palabras/segundo.
Graba cada bloque por separado y colócalo al inicio de su escena.

| Tiempo | En pantalla | Lo que dices |
|---|---|---|
| **0:00 – 0:08** | 6 payouts verdes → debajo, 24 cuentas QUEMADAS · "≈ 6 cuentas quemadas por payout" | "Cada día ves payouts en Instagram. Pero casi nadie te enseña cuántas cuentas quemaron para conseguirlos. Parte 2." |
| **0:08 – 0:22** | 01 · Gráfico RR vs winrate con la línea de breakeven · puntos 1:1, 1:1,5 (ÓPTIMO), 1:2, 1:3 | "Cuanto más alto es tu RR, más bajo suele ser tu winrate. Esta línea es el breakeven: por debajo, pierdes. Con 1:1 y un 52 %, apenas la superas: +0,04R por trade. Con RR 1,5 y más de un 50 %, te alejas mucho más: +0,30R." |
| **0:22 – 0:34** | 02 · 50 trades de cada perfil, se marca la racha de pérdidas más larga (≈5, ≈6, ≈9) | "Pero no solo importa el EV, también la varianza. Con RR 3 y un 30 %, lo normal es encadenar 8 o 9 pérdidas seguidas. Con RR 1,5 y un 52 %, unas 4 o 5. Ese es el punto óptimo." |
| **0:34 – 0:46** | 03 · Drawdown 2.000 $ · DÍA GRANDE (1 bala, se quema) vs 4 BALAS de 500 $ | "Con una cuenta de 2.000 de drawdown puedes jugar de dos formas. Día grande: todo a un trade, y si falla, cuenta quemada. O 4 balas de 500, con máximo 2 trades al día." |
| **0:46 – 0:58** | 04 · Resultados de un día: ✓✗ +250 $ (50 %) · ✓✓ +1.500 $ (27 %) · ✗✗ −1.000 $ (23 %) · 77 % días verdes | "Con RR 1,5, si ganas uno y pierdes otro, haces +250: día mínimo y algo de buffer. Si ganas los dos, +1.500. Si pierdes los dos, −1.000, pero te quedan balas. El 77 % de los días son verdes." |
| **0:58 – 1:10** | 05 · Tabla Día grande vs 4 balas · ROI 1,5x vs 5,8x | "Mismo trader, mismo 52 %. Con el día grande, solo un 14 % de las cuentas llega a cobrar y el ROI se queda en 1,5x. Con 4 balas, cobra casi la mitad: ROI de 5,8x. No hace falta arriesgar tanto." |
| **1:10 – 1:21** | 06 · Regla de ROI: moneda 1,2x · día grande 1,5x · 4 balas 5,8x | "Ojo: una moneda al aire jugando al día grande ya da un ROI de 1,2x. Así que un ROI por debajo de 2,5 o 3 veces lo invertido es jugar con las matemáticas, no saber tradear." |
| **1:21 – 1:28** | "Payout ≠ rentable." · "¿Cuánto te has gastado?" · @alt_stas | "Así que cuando alguien te enseñe un payout, pregúntale primero cuánto se ha gastado. Un payout no es rentabilidad." |

### Texto sugerido para la descripción
> Parte 2. Un payout no demuestra que alguien sea rentable: pregunta siempre cuánto se ha gastado antes. Con la estrategia del "día grande", hasta una moneda al aire saca payouts. Números de una simulación de 200.000 cuentas con un modelo simplificado. Contenido educativo, no es consejo financiero.

## De dónde salen los números (`sim.mjs`)

Simulación Monte Carlo de 200.000 cuentas por estrategia (`node sim.mjs`). Modelo:
- Evaluación: 100 $, objetivo +3.000 $, consistencia del 50 % (ningún día > 50 % del total), drawdown 2.000 $ (trailing de cierre).
- Fondeada: payout tras 5 días verdes (≥ +200 $), retiras el 50 % del beneficio con un split del 90 %.
- Si el buffer que queda no cubre el riesgo del siguiente trade, la cuenta se considera quemada.
- **Día grande**: en la evaluación, un trade al día para +1.500 $. En la fondeada, un trade para +2.000 $ y luego días de +200 $. Cualquier pérdida en un trade grande quema la cuenta.
- **4 balas**: 500 $ de riesgo por trade y 2 trades al día, en las dos fases.

| Estrategia | Pasa evaluación | Payout por cuenta | Payout medio | ROI (10 cuentas) |
|---|---|---|---|---|
| Moneda (50 %, 1:1), día grande | 27 % | 13 % | 931 $ | 1,2x |
| Día grande, RR 1,5 y 52 % | 29 % | 14 % | 1.049 $ | 1,5x |
| 4 balas, RR 1:1 y 52 % | 41 % | 14 % | 1.563 $ | 2,2x |
| 4 balas, RR 1:3 y 30 % | 30 % | 10 % | 2.330 $ | 2,2x |
| 4 balas, RR 1:2 y 42 % | 48 % | 25 % | 1.593 $ | 4,0x |
| **4 balas, RR 1,5 y 52 %** | **67 %** | **48 %** | **1.217 $** | **5,8x** |

- Quemadas por payout = (1 − p) / p → día grande ≈ 6 · 4 balas ≈ 1
- Coste por payout = 100 $ / p → 694 $ frente a 211 $
- Racha de pérdidas más larga típica en 50 trades: 52 % → 4,6 · 42 % → 6,0 · 30 % → 8,6
- Día con 4 balas y RR 1,5 (52 %): ✓✓ 27 % (+1.500) · ✓✗ 50 % (+250) · ✗✗ 23 % (−1.000)

## Volver a renderizar

```bash
node sim.mjs                     # recalcula los números
node sfx.mjs                     # regenera assets/sfx.wav
node render.mjs                  # out/reel.mp4 (sin subtítulos)
node render.mjs --captions       # out/reel_con_subtitulos.mp4
```
