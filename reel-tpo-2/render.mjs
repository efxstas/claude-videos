// Renders reel.html frame by frame with Playwright and encodes it with ffmpeg.
//   node render.mjs                         -> out/reel.mp4 (sin subtítulos)
//   node render.mjs --captions              -> out/reel_con_subtitulos.mp4
//   node render.mjs --handle=@mi_cuenta     -> cambia el @ del cierre
//   node render.mjs --stills=1,9,22         -> solo PNGs de esos segundos (preview)
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require("playwright"); } catch { playwright = require("/opt/node22/lib/node_modules/playwright"); }

const dir = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const FPS = Number(args.fps || 30);
const WORKERS = Number(args.workers || 4);
const captions = !!args.captions;
const outDir = path.join(dir, "out");
mkdirSync(outDir, { recursive: true });

const qs = new URLSearchParams({ render: "1", captions: captions ? "1" : "0" });
if (args.handle) qs.set("handle", args.handle);
const url = pathToFileURL(path.join(dir, "reel.html")).href + "?" + qs;

const exe = undefined;
const browser = await playwright.chromium.launch({ executablePath: exe, args: ["--allow-file-access-from-files"] });

async function openPage() {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto(url);
  await page.evaluate(() => window.ready);
  return page;
}

if (args.stills) {
  const page = await openPage();
  for (const s of String(args.stills).split(",")) {
    await page.evaluate(t => window.renderFrame(t), Number(s));
    await page.locator("canvas").screenshot({ path: path.join(outDir, `still_${s}.png`) });
  }
  await browser.close();
  process.exit(0);
}

const duration = await (await openPage()).evaluate(() => window.DURATION);
const total = Math.round(duration * FPS);
const per = Math.ceil(total / WORKERS);
console.log(`Rendering ${total} frames @${FPS}fps with ${WORKERS} workers…`);

async function worker(w) {
  const from = w * per, to = Math.min(total, from + per);
  const page = await openPage();
  const seg = path.join(outDir, `seg_${w}.mp4`);
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-r", String(FPS), seg], { stdio: ["pipe", "inherit", "inherit"] });
  for (let f = from; f < to; f++) {
    await page.evaluate(t => window.renderFrame(t), f / FPS);
    const buf = await page.locator("canvas").screenshot({ type: "jpeg", quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
    if (w === 0 && (f - from) % 60 === 0) console.log(`  ${Math.round((f - from) / (to - from) * 100)}%`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on("close", r));
  return seg;
}
const segs = await Promise.all([...Array(WORKERS).keys()].map(worker));
await browser.close();

const { writeFileSync } = await import("node:fs");
const list = path.join(outDir, "segs.txt");
writeFileSync(list, segs.map(s => `file '${s}'`).join("\n"));
const name = args.out || (captions ? "reel_con_subtitulos.mp4" : "reel.mp4");
const audio = path.join(dir, "assets", "sfx.wav");
const ffArgs = ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list];
if (existsSync(audio)) ffArgs.push("-i", audio, "-c:a", "aac", "-b:a", "192k", "-shortest");
ffArgs.push("-c:v", "copy", "-movflags", "+faststart", path.join(outDir, name));
await new Promise((res, rej) => spawn("ffmpeg", ffArgs, { stdio: "inherit" }).on("close", c => c ? rej(c) : res()));
for (const s of segs) (await import("node:fs")).unlinkSync(s);
(await import("node:fs")).unlinkSync(list);
console.log("Done →", path.join(outDir, name));
