// Efectos suaves (sin música) → assets/sfx.wav
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

// tiempos espejo de reel.html (TPO · Parte 1)
for (let t = .1; t < 3.0; t += .11 + (Math.sin(t * 7) + 1) * .03) click(t);
[.3, .6, .9, 1.2].forEach(t => thud(t, .1));
pop(1.4, 500); whoosh(4.2); pop(4.6, 700); pop(5.1, 600);
pop(7.6, 500); [7.9, 10.8, 13.8].forEach(t => pop(t, 650));
whoosh(20.1); pop(21.0, 650); ding(21.4, 1318); pop(22.5, 800); pop(22.8, 700); pop(26.4, 650);
whoosh(35.0); ding(42.3, 1568); pop(43.0, 800); pop(42.6, 650); pop(45.0, 650); pop(48.3, 650); ding(48.4, 1175);
whoosh(52.0); ding(58.6, 1318); ding(59.8, 1046); pop(60.8, 800); pop(61.0, 750); pop(58.8, 650); pop(61.6, 650); pop(64.0, 650);
whoosh(69.8); gavel(71.3); pop(76.3, 500); thud(77.4, .18);
[79.7, 80.0, 80.25].forEach(glitch); whoosh(80.9); boom(81.5); pop(82.4, 700); pop(83.2, 600);

let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = peak > .7 ? .7 / peak : 1;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
writeFileSync(here("./assets/sfx.wav"), buf);
console.log("assets/sfx.wav written");
