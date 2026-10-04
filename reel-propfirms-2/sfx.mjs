// Soft sound effects for part 2 (no music). Writes assets/sfx.wav
import { writeFileSync } from "node:fs";
const SR = 44100, DUR = 88, N = SR * DUR;
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

[8, 22, 34, 46, 58, 70, 81].forEach(whoosh);
for (let i = 0; i < 6; i++) pop(.6 + i * .18, 700 + i * 60);
for (let i = 0; i < 24; i += 2) tick(3.6 + i * .07);
thud(5.8);
riser(9, 1.6); [12, 15.2, 18, 18.6].forEach(t => pop(t, 600)); ding(16.2, 1568);
for (let r = 0; r < 3; r++) for (let i = 0; i < 50; i += 4) tick(23.6 + r * .25 + i * .07);
[29, 29.4, 29.8].forEach(thud);
pop(35.6, 400); pop(38.6, 400); for (let i = 0; i < 4; i++) tick(39 + i * .35);
shot(42); thud(42.3);
[46.8, 49.6].forEach(t => ding(t + .2, 1318)); thud(51.4); riser(52.9, 1.1); ding(54, 1568);
[59.4, 60.8, 62.6, 64].forEach(t => pop(t, 500)); riser(65.4, 1.2); ding(66.6, 1760);
[72.2, 73.8].forEach(thud); ding(75.6, 1760);
boom(81.4); pop(83.5, 400);

let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = peak > .7 ? .7 / peak : 1;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
writeFileSync(new URL("./assets/sfx.wav", import.meta.url), buf);
console.log("assets/sfx.wav written");
