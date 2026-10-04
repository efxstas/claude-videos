// Generates assets/sfx.wav: soft music bed + sound effects synced to reel.html.
import { writeFileSync } from "node:fs";
const SR = 44100, DUR = 66, N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 1; const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647 * 2 - 1;
function add(t0, len, fn, gain = 1, pan = 0) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(len * SR);
  for (let i = 0; i < n && s0 + i < N; i++) { if (s0 + i < 0) continue; const v = fn(i / SR, i / n) * gain; L[s0 + i] += v * (1 - pan) ; R[s0 + i] += v * (1 + pan); }
}
const env = (x, a = .01) => Math.min(1, x / a);
const click = t => add(t, .03, (s, k) => rand() * Math.exp(-k * 8) * .5, .35);
const pop = (t, f = 600) => add(t, .15, (s, k) => Math.sin(2 * Math.PI * (f + 900 * (1 - k)) * s) * Math.exp(-k * 6), .35);
const whoosh = t => add(t - .25, .5, (s, k) => rand() * Math.sin(Math.PI * k) ** 2, .18);
const ding = (t, f = 1318) => add(t, .6, (s, k) => (Math.sin(2 * Math.PI * f * s) + .4 * Math.sin(2 * Math.PI * f * 2.01 * s)) * Math.exp(-k * 5) * env(s), .2);
const thud = t => add(t, .25, (s, k) => Math.sin(2 * Math.PI * (160 - 90 * k) * s) * Math.exp(-k * 5), .4);
const coinTick = t => add(t, .08, (s, k) => Math.sin(2 * Math.PI * 3200 * s) * Math.exp(-k * 9), .08);
const riser = (t, len) => add(t, len, (s, k) => Math.sin(2 * Math.PI * (220 + 440 * k) * s) * k * .5 + rand() * k * .1, .12);
const boom = t => add(t, 1.6, (s, k) => Math.sin(2 * Math.PI * (55 - 15 * k) * s) * Math.exp(-k * 3) * env(s, .005), .6);
const kaching = t => { ding(t, 1760); ding(t + .08, 2637); add(t, .2, (s, k) => rand() * Math.exp(-k * 10), .2); };

// music bed: Am – F – C – G pad + soft kick at 96 bpm (ducks for voice-over)
const chords = [[220, 261.6, 329.6], [174.6, 220, 261.6], [130.8, 196, 261.6], [196, 246.9, 293.7]];
const bar = 60 / 96 * 4;
for (let i = 0; i < N; i++) {
  const t = i / SR; if (t > 64.5) break;
  const ch = chords[Math.floor(t / bar) % 4];
  let v = 0; for (const f of ch) v += Math.sin(2 * Math.PI * f * t) * .5 + Math.sin(2 * Math.PI * f * 1.003 * t) * .5;
  const fade = Math.min(1, t / 2) * Math.min(1, (64.5 - t) / 1.5) * (t > 60 && t < 63.8 ? .4 : 1);
  v *= .018 * fade;
  const beat = (t % (60 / 96)); v += Math.sin(2 * Math.PI * (60 - 30 * Math.min(1, beat * 8)) * beat) * Math.exp(-beat * 18) * .07 * fade * (t > 5 && t < 60 ? 1 : 0);
  L[i] += v; R[i] += v;
}
// scene 1: typing + send
const Q = 74; for (let i = 0; i < Q; i++) if (i % 2 === 0) click(.6 + 2.8 * i / Q + (i % 3) * .004);
pop(3.7, 500); pop(5.25, 700);
// transitions
[7.2, 15, 20, 32, 45, 55, 60.2].forEach(whoosh);
// scene 2 coins dropping
for (let t = 8; t < 10.6; t += .09) coinTick(t);
thud(11.0); ding(11.6, 1046);
// scene 3 bills
for (let i = 0; i < 10; i++) pop(16.7 + i * .1, 800 + i * 40);
// scene 4 bar + coins
riser(21.6, 1.0); riser(23.4, 1.0); ding(24.4, 1568);
const P1 = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0], P2 = [1, 0, 0, 1, 0, 0, 0, 0, 1, 0];
for (let i = 0; i < 10; i++) { const c1 = 26.2 + i * .08 + .9; P1[i] ? coinTick(c1) : thud(c1); if (P1[i]) { const c2 = 28.3 + i * .08 + .9; P2[i] ? coinTick(c2) : thud(c2); } }
ding(29.9, 1318); ding(30.05, 1760);
// scene 5 calendar
pop(33.6, 500); riser(34, 1.2); ding(35.2, 1568);
for (let i = 0; i < 4; i++) pop(37.2 + i * .65, 700 + i * 100);
pop(42, 300); kaching(42.4);
// scene 6 funnel + counters
[45.6, 46.4, 47.2].forEach(t => pop(t, 400)); [48.6, 50.2].forEach(t => ding(t + .9, 1318)); kaching(52.8);
// proof
pop(55.8, 500); thud(57.4); kaching(57.4);
// ending
boom(63.8);

// write 16-bit stereo WAV
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = peak > .95 ? .95 / peak : 1;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
writeFileSync(new URL("./assets/sfx.wav", import.meta.url), buf);
console.log("assets/sfx.wav written, peak", peak.toFixed(2));
