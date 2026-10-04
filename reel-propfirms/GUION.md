# Reel · "1.000 $ y 52 % de WR: ¿se puede ser rentable?"

Formato: 1080×1920 (9:16), 30 fps, 66 s. Fondo: tu gráfico de velas (`assets/fondo-chart.png`) con paneo lento y oscurecido.

- `out/reel.mp4`: con subtítulos quemados y efectos de sonido + música suave.
- `out/reel_sin_subtitulos.mp4`: igual, pero sin subtítulos (por si usas los automáticos de Instagram/CapCut).

El audio es solo música de fondo y efectos, sin voz. Graba tu voz encima siguiendo estos tiempos.

## Voz en off con tiempos

| Tiempo | Escena | Voz |
|---|---|---|
| 0–5 s | La pregunta (chat con Claude, muñeco con 1.000 $) | **(Tú):** "Tengo mil dólares y un 52 % de winrate… ¿puedo ser rentable con prop firms?" |
| 5–15 s | EV + balanza 52 verdes / 48 rojas | **(IA):** "Sí. Primero tienes que entender el EV, el valor esperado: lo que ganas de media cada vez que repites algo. Con un 52 % de acierto a ratio 1:1, ganas 52 veces y pierdes 48. Cada trade te deja de media un +4 % de lo que arriesgas. Pequeño, pero positivo." |
| 15–20 s | Los billetes se convierten en 10 cuentas 50K | **(IA):** "Con tus 1.000 dólares compras 10 cuentas de 100. Cada una se opera a todo o nada." |
| 20–32 s | Barra objetivo 3.000 $ (2 × 1.500) + monedas, quedan 3 fondeadas | **(IA):** "La evaluación pide 3.000 de objetivo, con una regla de consistencia del 50 %. Así que necesitas mínimo 2 días de 1.500. Dos trades ganados seguidos: 52 % por 52 %. Pasas un 27 % de las veces. De 10 cuentas, unas 3 llegan a fondeada." |
| 32–45 s | Calendario: +2.000 $ y 4 × +200 $, botón RETIRAR 50 % | **(IA):** "Ya fondeado, puedes retirar el 50 % del beneficio cada 5 días verdes. Día 1: un trade 1:1 de 2.000, otra vez con un 52 %. Con ese colchón, los otros 4 días haces 200 con riesgo mínimo. Son 2.800 de beneficio y retiras la mitad: unos 1.260 después del split. Y la cuenta sigue viva." |
| 45–55 s | Embudo 10 → 2,7 → 1,4 + contadores 14 % / 78 % / EV +770 $ | **(IA):** "27 % por 52 %: cada cuenta tiene un 14 % de llegar a payout. Con 10 cuentas, un 78 % de probabilidad de cobrar al menos una vez. Y el valor esperado del plan es de unos +770 dólares. Más un payout cada 5 días verdes mientras la cuenta siga viva." |
| 55–60 s | **Prueba real**: tu email de Lucid Trading "Payout Requested" + sello | **(Tú):** "Y no es teoría. Aquí están mis payouts." |
| 60–66 s | La pantalla de la IA se apaga y queda el texto en negro | **(IA):** "No necesitas un 80 % de winrate. Necesitas entender las matemáticas." → Texto: *No es suerte. Es EV.* + handle |

## Comprobación de números

- EV por trade: 0,52 − 0,48 = +0,04R
- Pass rate: 0,52² = 27,0 %
- Payout: 2.000 + 4×200 = 2.800 → 50 % = 1.400 → con split del 90 % ≈ 1.260 $
- Payout por cuenta: 0,27 × 0,52 = 14,1 %
- Cobrar al menos 1 vez con 10 cuentas: 1 − 0,86¹⁰ ≈ 78 %
- EV del plan: 10 × 0,1406 × 1.260 − 1.000 ≈ +770 $

## Volver a renderizar

```bash
node sfx.mjs                              # regenera assets/sfx.wav
node render.mjs --handle=@tu_cuenta       # out/reel.mp4
node render.mjs --handle=@tu_cuenta --no-captions
```

Abre `reel.html` en el navegador para ver una vista previa en vivo (`reel.html?t=30` empieza en el segundo 30).
