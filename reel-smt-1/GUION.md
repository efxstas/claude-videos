# Reel · SMT · Parte 1 (NQ vs ES)

1080×1920 (9:16), 30 fps, **86 s**. Archivo: `out/reel.mp4` (sin subtítulos ni música; solo efectos suaves).
Tono educativo y solo informativo: qué es y cómo se lee, nunca qué hacer.

**Datos reales:** todas las velas del vídeo salen de tus capturas de TradingView (NQ y ES, 1 min, sesión de 10:20 a 13:10).
Están extraídas píxel a píxel con `digitize.mjs` y guardadas en `data/velas.json`. La SMT del vídeo es la de tus capturas:
- **NQ**: mínimo de 31.206,00 a las 11:13 → mínimo **más bajo** de 31.200,50 a las 12:21.
- **ES**: mínimo de 7.804,00 a las 11:10 → mínimo **más alto** de 7.809,25 a las 12:21.

La correlación que se muestra (≈ 0,86) es la de las variaciones de 1 minuto de esa misma sesión.
Los fondos de IA (el escritorio de noche y los dos caminos de luz) llevan zoom lento, parallax y luz que respira. Los gráficos y los números nunca salen de la IA.

## Narración (para leer tú)

Ritmo ≈ 3 palabras/segundo. Graba cada bloque por separado y colócalo al inicio de su escena.

| Tiempo | En pantalla | Lo que dices |
|---|---|---|
| **0:00 – 0:04** | Fondo de los dos caminos · NQ y ES lado a lado, moviéndose juntos · NQ "↓ mínimo nuevo", ES "✗ no lo hace" · "Dos hermanos. Siempre hacen lo mismo… hasta que uno miente." | "Dos hermanos. Siempre hacen lo mismo… hasta que uno miente." |
| **0:04 – 0:18** | Fondo del escritorio · tarjetas NQ (futuro del Nasdaq 100) y ES (futuro del S&P 500) · "Las mismas grandes tecnológicas" · las dos líneas casi idénticas · **CORRELACIÓN** | "El NQ es el futuro del Nasdaq 100 y el ES, el del S&P 500. Las mismas grandes tecnológicas pesan muchísimo en los dos índices, por eso se mueven casi igual. Eso es correlación." |
| **0:18 – 0:31** | **Divergencia SMT**: NQ arriba y ES abajo, velas una a una · en la apertura los dos hacen mínimo ("✓ confirma") · líneas SMT: NQ "mínimo MÁS BAJO", ES "✗ no confirma · mínimo MÁS ALTO" · **SMT ALCISTA** | "Una divergencia SMT es cuando esa correlación se rompe en un punto clave. En la apertura, los dos hacen mínimo: se confirman. Pero aquí, el NQ hace un mínimo más bajo… y el ES no lo confirma: hace un mínimo más alto. Eso es una SMT alcista." |
| **0:31 – 0:34,6** | Tu captura real de TradingView · "misma temporalidad (1 min) · misma hora" | "Así se ve en TradingView: misma temporalidad, misma hora." |
| **0:34,6 – 0:40** | **Bajista**: el mismo ejemplo en espejo · NQ "máximo MÁS ALTO", ES "✗ no confirma · máximo MÁS BAJO" | "La bajista es lo mismo, pero en máximos: uno hace un máximo más alto y el otro no lo confirma." |
| **0:40 – 1:00** | **¿Dónde se suele mirar?** NQ de toda la sesión con mínimo de sesión, máximo anterior y mínimo anterior · "SMT en zona de liquidez" · recuadro "mitad de rango" | "¿Y dónde se suele mirar? En zonas de liquidez: máximos y mínimos anteriores, y máximos y mínimos de la sesión. Ahí es donde una SMT suele tener más peso. En mitad de un rango, en cambio, no significa lo mismo." |
| **1:00 – 1:15** | **Errores típicos al leerla**: 1 · temporalidades distintas (1 min ≠ 5 min) · 2 · mecha en uno, cierre en el otro · 3 · horas de sesión que no coinciden ("misma vela, distinta hora") | "Y tres errores típicos al leerla. Uno: comparar temporalidades distintas. Dos: mirar la mecha en un gráfico y el cierre en el otro. Tres: usar horas de sesión que no coinciden." |
| **1:15 – 1:21** | Fondo de los dos caminos · "Esto es lo básico." · "Lo que de verdad importa no cabe en un reel." | "Esto es lo básico. Lo que de verdad importa… no cabe en un reel." |
| **1:21 – 1:26** | Fundido a negro · **SMT · Parte 2** · @alt_stas · aviso educativo | "SMT, parte 2." |

### Texto sugerido para la descripción
> SMT, parte 1: NQ y ES, dos hermanos que se mueven igual… hasta que uno no confirma. Qué es una divergencia SMT, dónde se suele mirar y tres errores típicos al leerla. Esto es lo básico. Contenido educativo, no es consejo financiero.

## Archivos

- `capturas/`: tus capturas originales (NQ, ES y las dos lado a lado).
- `assets/`: fondos de IA, la captura usada en el vídeo, las fuentes y los efectos (`sfx.wav`).
- `data/velas.json`: velas OHLC de 1 min de NQ y ES extraídas de tus capturas.

## Volver a renderizar

```bash
node digitize.mjs                # vuelve a extraer las velas de las capturas
node sfx.mjs                     # regenera assets/sfx.wav
node render.mjs                  # out/reel.mp4 (sin subtítulos)
node render.mjs --captions       # out/reel_con_subtitulos.mp4
```
