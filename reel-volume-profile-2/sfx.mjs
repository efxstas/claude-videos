// Soft sound effects for part 2 (no music). Writes assets/sfx.wav
import { writeFileSync } from "node:fs";
const SR = 44100, DUR = 86, N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 1; const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647 * 2 - 1;
function add(t0, len, fn, gain = 1) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(len * SR);
  for (let i = 0; i < n && s0 + i < N; i++) { if (s0 + i < 0) continue; const v = fn(i / SR, i / n) * gain; L[s0 + i] += v; R[s0 + i] += v; }
}
const env = (x, a = .01) => Math.min(1, x / a);
const pop = (t, f = 600) => add(t, .15, (s, k) => Math.sin(2 * Math.PI * (f + 900 * (1 - k)) * s) * Math.exp(-k * 6), .07);
const whoosh = t => add(t - .25, .5, (s, k) => rand() * Math.sin(Math.PI * k) ** 2, .06);
const ding = (t, f = 1318) => add(t, .6, (s, k) => (Math.sin(2 * Math.PI * f * s) + .4 * Math.sin(2 * Math.PI * f * 2.01 * s)) * Math.exp(-k * 5) * env(s), .08);
const thud = t => add(t, .25, (s, k) => Math.sin(2 * Math.PI * (160 - 90 * k) * s) * Math.exp(-k * 5), .15);
const tick = t => add(t, .06, (s, k) => Math.sin(2 * Math.PI * 2600 * s) * Math.exp(-k * 9), .025);
const riser = (t, len) => add(t, len, (s, k) => Math.sin(2 * Math.PI * (220 + 440 * k) * s) * k * .5, .04);
const boom = t => add(t, 1.6, (s, k) => Math.sin(2 * Math.PI * (55 - 15 * k) * s) * Math.exp(-k * 3) * env(s, .005), .3);
const shot = t => { add(t, .35, (s, k) => rand() * Math.exp(-k * 12), .12); thud(t); };

// timings mirror reel.html (Volume Profile · Parte 2)
const click = t => add(t, .03, (s, k) => rand() * Math.exp(-k * 8) * .5, .03);
for (let t = .3; t < 4.6; t += .11 + (Math.sin(t * 7) + 1) * .03) click(t);
for (let i = 0; i < 6; i++) thud(.9 + i * .3);
pop(2.7, 500); pop(5.2, 700);
whoosh(7.9); [18, 34, 48, 63].forEach(whoosh); whoosh(70.2);
riser(10.6, 1.6); [12.4, 12.6, 12.8].forEach(thud); [15.6, 15.85, 16.1].forEach(t => pop(t, 700));
ding(19.0, 1318); pop(19.6, 500); thud(23.6); pop(25.6, 500); whoosh(28.9); ding(29.1, 1568);
ding(35.0, 1318); pop(35.6, 500); riser(36.4, 1.2); thud(38.0); pop(40.6, 500);
ding(49.0, 1318); pop(49.6, 500); pop(52.4, 600); pop(56.2, 500);
[63.4, 63.9, 64.4].forEach(t => pop(t, 600));
pop(71.0, 500); pop(73.8, 700); whoosh(74.6); ding(75.2, 2093);
pop(80.2, 400); boom(81.2); thud(81.2); pop(82.4, 500);

let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = peak > .7 ? .7 / peak : 1;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
writeFileSync(new URL("./assets/sfx.wav", import.meta.url), buf);
console.log("assets/sfx.wav written");
