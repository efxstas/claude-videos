// Soft sound effects for part 2 (no music). Writes assets/sfx.wav
import { writeFileSync } from "node:fs";
const SR = 44100, DUR = 75, N = SR * DUR;
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

// timings mirror reel.html (SMT · Parte 1)
const click = t => add(t, .03, (s, k) => rand() * Math.exp(-k * 8) * .5, .03);
for (let t = .2; t < 2.5; t += .09) click(t);                       // velas entrando
boom(2.5); thud(2.5); pop(2.9, 500); pop(3.1, 700);
[4.4, 18, 31, 34.6, 40, 60].forEach(whoosh);
pop(4.9, 500); pop(5.5, 600); riser(7.2, .6); ding(7.8, 1318);
riser(10.4, 3.0); ding(13.9, 1568);
for (let t = 18.6; t < 25; t += .2) click(t);
ding(20.0, 1318); riser(25.3, .9); thud(26.2); ding(27.0, 1568); pop(28.2, 600);
pop(31.2, 500); pop(32.4, 600);
for (let t = 34.9; t < 37; t += .2) click(t);
thud(37.9); pop(38.0, 600); pop(38.6, 500); ding(39.0, 1318);
[41.6, 43.4, 45.2].forEach(t => pop(t, 600)); ding(47.6, 1568); thud(51.8);
[42.0, 44.6, 52.4].forEach(t => pop(t, 400));
pop(60.6, 500); thud(62.4); pop(65.3, 500); thud(67.6); pop(70.3, 500); whoosh(71.6); thud(73.0);

let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = peak > .7 ? .7 / peak : 1;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
writeFileSync(new URL("./assets/sfx.wav", import.meta.url), buf);
console.log("assets/sfx.wav written");
