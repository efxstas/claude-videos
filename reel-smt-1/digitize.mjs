// Extrae las velas OHLC de las capturas de TradingView (1 min) → data/velas.json
// Calibración leída de los ejes de cada captura (precio por píxel y minuto por píxel).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
const CAL = {
  NQ: { file: "capturas/nq.png", w: 1271, h: 1269, plotRight: 1198, top: 95, bottom: 1240,
        p1: [31292, 36], p2: [31176, 1213], t1: [630, 75], t2: [780, 1110] },     // [precio, y] y [minuto del día, x]
  ES: { file: "capturas/es.png", w: 1173, h: 1274, plotRight: 1105, top: 95, bottom: 1240,
        p1: [7832, 53], p2: [7798, 1210], t1: [630, 67], t2: [780, 1037] },
};
function load(c) {
  const buf = execSync(`ffmpeg -loglevel error -i ${c.file} -f rawvideo -pix_fmt rgb24 -`, { maxBuffer: 64 << 20 });
  return (x, y) => { const i = (y * c.w + x) * 3; return [buf[i], buf[i + 1], buf[i + 2]]; };
}
const isInk = ([r, g, b]) => Math.abs(r - 128) > 22 || Math.abs(g - 128) > 22 || Math.abs(b - 128) > 22;
const isWhite = ([r, g, b]) => r > 200 && g > 200 && b > 200;
const out = {};
for (const [sym, c] of Object.entries(CAL)) {
  const px = load(c);
  const priceOf = y => c.p1[0] + (y - c.p1[1]) * (c.p2[0] - c.p1[0]) / (c.p2[1] - c.p1[1]);
  const pxPerMin = (c.t2[1] - c.t1[1]) / (c.t2[0] - c.t1[0]);
  const candles = [];
  for (let m = 600; m <= 800; m++) {
    const xc = c.t1[1] + (m - c.t1[0]) * pxPerMin;
    if (xc < 2 || xc > c.plotRight - 3) continue;
    // columna de la mecha: la de la racha vertical continua más larga cerca del centro
    let best = null;
    for (let x = Math.round(xc - 2); x <= Math.round(xc + 2); x++) {
      let run = 0, start = 0;
      for (let y = c.top; y < c.bottom; y++) {
        if (isInk(px(x, y))) { run++; if (!best || run > best.len) best = { x, len: run, y0: y - run + 1, y1: y }; }
        else run = 0;
      }
    }
    if (!best || best.len < 3) continue;
    const { x: wx, y0, y1 } = best;
    // cuerpo: filas donde las columnas vecinas también tienen tinta
    let b0 = null, b1 = null, white = 0, black = 0;
    for (let y = y0; y <= y1; y++) {
      const side = isInk(px(wx - 2, y)) && isInk(px(wx + 2, y));
      if (side) { if (b0 === null) b0 = y; b1 = y; const p = px(wx, y); if (isWhite(p)) white++; else black++; }
    }
    if (b0 === null) { b0 = b1 = Math.round((y0 + y1) / 2); }
    const up = white >= black;
    const hi = priceOf(y0), lo = priceOf(y1), bt = priceOf(b0), bb = priceOf(b1);
    candles.push({ t: m, o: up ? bb : bt, h: hi, l: lo, c: up ? bt : bb });
  }
  out[sym] = candles;
  const lows = candles.reduce((a, k) => k.l < a.l ? k : a);
  console.log(sym, candles.length, "velas", "de", candles[0].t, "a", candles.at(-1).t, "mín", lows.l.toFixed(2), "@", lows.t);
}
mkdirSync("data", { recursive: true });
const r = v => Math.round(v * 4) / 4;    // redondeo al tick (0,25)
for (const s in out) out[s] = out[s].map(k => ({ t: k.t, o: r(k.o), h: r(k.h), l: r(k.l), c: r(k.c) }));
writeFileSync("data/velas.json", JSON.stringify(out));
const hm = t => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
for (const s in out) for (const k of out[s]) if ([670, 671, 672, 673, 739, 740, 741, 631].includes(k.t)) console.log(s, hm(k.t), k);
