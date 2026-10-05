// Efectos suaves (parte 2) (sin música) → assets/sfx.wav
// Cada letra TPO suena al caer: lee los tiempos de tpo.js + datos.js, igual que reel.html.
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const here = f => new URL(f, import.meta.url);
const box = {}; vm.createContext(box);
vm.runInContext(readFileSync(here("./tpo.js"), "utf8") + "\n" + readFileSync(here("./datos.js"), "utf8") +
  "\nthis.OUT = { SOUND_PROFILES, DURATION };", box);
const { SOUND_PROFILES, DURATION } = box.OUT;

const SR = 44100, N = SR * DURATION;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 1; const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647 * 2 - 1;
function add(t0, len, fn, gain = 1, pan = 0) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(len * SR);
  for (let i = 0; i < n && s0 + i < N; i++) { if (s0 + i < 0) continue; const v = fn(i / SR, i / n) * gain; L[s0 + i] += v * (1 - pan); R[s0 + i] += v * (1 + pan); }
}
const env = (x, a = .01) => Math.min(1, x / a);
const pop = (t, f = 600) => add(t, .15, (s, k) => Math.sin(2 * Math.PI * (f + 900 * (1 - k)) * s) * Math.exp(-k * 6), .06);
const whoosh = t => add(t - .25, .5, (s, k) => rand() * Math.sin(Math.PI * k) ** 2, .05);
const ding = (t, f = 1318) => add(t, .6, (s, k) => (Math.sin(2 * Math.PI * f * s) + .4 * Math.sin(2 * Math.PI * f * 2.01 * s)) * Math.exp(-k * 5) * env(s), .07);
const thud = (t, g = .15) => add(t, .25, (s, k) => Math.sin(2 * Math.PI * (160 - 90 * k) * s) * Math.exp(-k * 5), g);
const boom = t => add(t, 1.6, (s, k) => Math.sin(2 * Math.PI * (55 - 15 * k) * s) * Math.exp(-k * 3) * env(s, .005), .28);
const click = t => add(t, .03, (s, k) => rand() * Math.exp(-k * 8) * .5, .03);
const glitch = t => add(t, .12, (s, k) => (rand() > .7 ? rand() : 0) * (1 - k), .05);
// "tic" suave de letra: madera/marimba, más agudo cuanto más alta la fila
const letterTick = (t, row) => {
  const f = 520 * Math.pow(2, row / 18);
  add(t, .14, (s, k) => (Math.sin(2 * Math.PI * f * s) + .25 * Math.sin(2 * Math.PI * f * 3 * s)) * Math.exp(-k * 9) * env(s, .002), .045, (row % 3 - 1) * .15);
};
// golpe de mazo
const gavel = t => { add(t, .09, (s, k) => rand() * Math.exp(-k * 14), .16); add(t, .5, (s, k) => Math.sin(2 * Math.PI * (210 - 60 * k) * s) * Math.exp(-k * 7), .22); boom(t); };

for (const prof of SOUND_PROFILES) for (const lt of prof.letters) letterTick(lt.t, lt.row - prof.lo);

// tiempos espejo de reel.html (TPO · Parte 2)
for (let t = .1; t < 4.0; t += .11 + (Math.sin(t * 7) + 1) * .03) click(t);
[.3, .6, .9, 1.2].forEach(t => thud(t, .1));
pop(1.6, 500); pop(4.4, 700); whoosh(6.2); pop(7.2, 500);
ding(13.2, 1318); pop(13.4, 800); pop(14.6, 400); pop(14.8, 700); pop(15.6, 650);
whoosh(19.0); ding(26.0, 1175); pop(26.2, 650); pop(26.6, 800); pop(29.6, 650); pop(30.8, 500);
whoosh(35.0); ding(41.5, 1046); pop(41.7, 650); pop(42.1, 800); pop(44.8, 650); pop(45.4, 500);
whoosh(49.0); ding(52.8, 1175); pop(53.0, 800); pop(53.4, 700); pop(53.6, 650); pop(55.4, 600); ding(55.6, 1568); pop(57.8, 650);
whoosh(65.0); [65.5, 66.0, 66.5].forEach(t => pop(t, 600));
whoosh(72.2); pop(73.0, 500); whoosh(75.6); ding(76.3, 2093); pop(76.0, 700);
boom(80.4); thud(80.4); pop(81.9, 500); pop(83.0, 600);

let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = peak > .7 ? .7 / peak : 1;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
writeFileSync(here("./assets/sfx.wav"), buf);
console.log("assets/sfx.wav written");
