# Reel Parte 2 · "Situación gurú vs situación trader"

Vídeo educativo. 1080×1920 (9:16), 30 fps, **92 s**. Archivo: `out/reel.mp4` (sin subtítulos).
El audio solo lleva efectos suaves: sin música ni voz.

Material real que sale en el vídeo (`assets/`):
- `cuentas-suspendidas.png`: avisos de suspensión de Alpha Futures (escena del hate).
- `trade-1-5R.png`: trade real con RR 1:1,5 (situación trader).
- `payout-mff.webp`: certificado de payout de MFF por 2.000 $.
- `payout-lucid.webp`: certificado de payout de Lucid por 3.936 $.

## Narración (para leer tú)

Tono: directo, con un punto de "hate" al principio y explicador después. Ritmo ≈ 3 palabras/segundo.
Graba cada bloque por separado y colócalo al inicio de su escena.

| Tiempo | En pantalla | Lo que dices |
|---|---|---|
| **0:00 – 0:06** | "Esto es lo que te enseñan:" · muro de payouts · sello FLEX | "Esto es lo que te enseñan en Instagram: payouts, payouts y más payouts." |
| **0:06 – 0:14** | "Lo que NO te enseñan:" · emails reales de suspensión · 24 cuentas QUEMADAS · "Porque vende más una foto…" | "Lo que no te enseñan son todas las cuentas que quemaron para conseguirlos. Porque vende más una foto que la realidad que hay detrás." |
| **0:14 – 0:18** | "Muchos gurús no te lo explican. Así que vengo yo a hacerlo." · @alt_stas | "Muchos gurús no te lo explican. Así que vengo yo a hacerlo." *(aquí puedes meter un clip tuyo encima)* |
| **0:18 – 0:36** | **SITUACIÓN GURÚ** · 10 cuentas, 9 QUEMADAS y 1 PAYOUT (+1.500 $) con FLEX · cuentas: −1.000 / +1.500 / neto +500 / **ROI 1,5x** · "Una moneda al aire saca 1,2x" | "Situación gurú. Compra 10 cuentas por 1.000 dólares y lo juega todo a un día grande, a 1:1. Es tirar monedas. Quema 9, saca un payout de 1.500 y lo sube a Instagram. ¿Su beneficio real? 500 dólares. Un ROI de 1,5x. Una moneda al aire saca 1,2x." |
| **0:36 – 0:45** | **SITUACIÓN TRADER** · tu trade real de RR 1:1,5 · gurú +0,04R contra trader +0,30R por trade | "Situación trader. También exprime la prop firm, pero tradeando. RR 1,5 y más de un 50 % de acierto: +0,30R por trade, frente a los +0,04R del gurú." |
| **0:45 – 0:56** | 4 balas de 500 $ · ✓✗ +250 (50 %) · ✓✓ +1.500 (27 %) · ✗✗ −1.000 (23 %) · 77 % de días verdes | "Divide el drawdown de 2.000 en 4 balas de 500, máximo 2 trades al día. Uno ganado y uno perdido: +250, día verde. Dos ganados: +1.500. Dos perdidos: −1.000, pero le quedan balas. 77 % de días verdes." |
| **0:56 – 1:08** | Mismas 10 cuentas: 3 PAYOUT, 3 SIGUEN VIVAS y 4 QUEMADAS · −1.000 / +3.600 / neto +2.600 / **ROI 3,6x** | "Con las mismas 10 cuentas y los mismos 1.000 dólares, saca como mínimo 3 payouts: 3.600 dólares. Beneficio neto de 2.600, un ROI de 3,6x. Y le quedan cuentas vivas para seguir cobrando." |
| **1:08 – 1:14** | "Payouts reales:" · tus certificados de MFF (2.000 $) y Lucid (3.936 $) | "Estos son payouts reales. Así se ve tradear la prop firm, no apostarla." |
| **1:14 – 1:23** | **Gurú vs Trader**: neto +500 frente a +2.600 · ROI 1,5x frente a 3,6x · "La diferencia: saber tradear." | "Gurú: 500 de beneficio. Trader: 2.600. Misma inversión, misma prop firm. La diferencia es saber tradear." |
| **1:23 – 1:32** | "Antes de creerte un payout, pregunta cuánto se ha gastado." · "ROI < 2,5–3x = matemáticas, no trading" · @alt_stas | "Así que antes de creerte un payout, pregunta cuánto se ha gastado. Si el ROI no llega a 2,5 o 3 veces lo invertido, son matemáticas, no trading." |

### Texto sugerido para la descripción
> Situación gurú vs situación trader. Mismas 10 cuentas, mismos 1.000 $: uno quema 9 y presume de un payout; el otro tradea con RR 1,5 y gestiona 4 balas. Antes de creerte un payout, pregunta cuánto se ha gastado. Contenido educativo, no es consejo financiero.

## De dónde salen los números

- Gurú: 10 cuentas, 1 payout de 1.500 $ → neto +500 $ → ROI 1,5x. En la simulación, el "día grande" cobra en el 14 % de las cuentas, con un ROI de 1,4–1,5x.
- Trader (escenario conservador): 3 payouts de 1.200 $ → +3.600 $ → neto +2.600 $ → ROI 3,6x. En la simulación (RR 1,5, 52 %, 4 balas) cobra el 48 % de las cuentas, con un payout medio de 1.217 $ y un **ROI medio de 5,8x**.
- Moneda al aire (50 %, 1:1, día grande): ROI 1,2x.
- EV por trade: 1:1 con 52 % → +0,04R · 1:1,5 con 52 % → +0,30R.
- Día con 4 balas (RR 1,5, 52 %): ✓✓ 27 % · ✓✗ 50 % · ✗✗ 23 % → 77 % de días verdes.

Simulación: `node sim.mjs` (200.000 cuentas; reglas al principio del archivo).

## Volver a renderizar

```bash
node sfx.mjs                     # regenera assets/sfx.wav
node render.mjs                  # out/reel.mp4 (sin subtítulos)
node render.mjs --captions       # out/reel_con_subtitulos.mp4
```
