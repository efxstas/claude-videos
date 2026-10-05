// Motor común de los reels TPO (mismo archivo en reel-tpo-1 y reel-tpo-2).
// Cada reel.html define: DURATION, SCENES (funciones t → dibujo), VO, ROOM_MONITORS
// y, si quiere, más imágenes en EXTRA_IMAGES / OPTIONAL_IMAGES.

// ============================================================
//  CONFIG
// ============================================================
const params = new URLSearchParams(location.search);
const CONFIG = {
  handle: params.get("handle") || "@alt_stas",
  captions: params.get("captions") === "1",
};
const W = 1080, H = 1920;

const C = {
  green: "#22c55e", greenSoft: "#4ade80", red: "#ef4444", redSoft: "#f87171",
  gold: "#facc15", white: "#ffffff", ink: "#0b0f17", panel: "rgba(14,18,28,0.92)",
  muted: "rgba(255,255,255,0.62)", claude: "#d97757",
};
// paleta de la ficha TPO de referencia
const T = {
  bg: "#0d1117", line: "rgba(255,255,255,.08)", letter: "#e6edf3", dim: "rgba(230,237,243,.22)",
  teal: "#2dd4bf", tealFill: "rgba(20,184,166,.20)", tealDeep: "#134e4a",
  red: "#f87171", redFill: "rgba(127,29,29,.55)", blue: "#60a5fa", blueFill: "rgba(30,58,138,.50)",
  amber: "#f59e0b", amberFill: "rgba(245,158,11,.20)", kicker: "rgba(230,237,243,.55)",
};
const F = (w, s, fam = "Inter") => `${w} ${s}px ${fam}, DejaVu Sans, sans-serif`;
const MONO = s => F(700, s, "JBM");

// ============================================================
//  HELPERS
// ============================================================
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const easeOut = k => 1 - Math.pow(1 - k, 3);
const easeIn = k => k * k * k;
const easeInOut = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const backOut = k => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const p = (t, a, b) => clamp((t - a) / (b - a));
const pe = (t, a, b, e = easeOut) => e(p(t, a, b));
const sceneAlpha = (t, a, b, fi = .35, fo = .35) => Math.min(p(t, a, a + fi), 1 - p(t, b - fo, b));
const fmtThousands = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

let ctx;
function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function text(s, x, y, font, color = C.white, align = "center", base = "middle") {
  ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base; ctx.fillText(s, x, y);
}
function wrap(s, maxW, font) {
  ctx.font = font; const words = s.split(" "); const lines = []; let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
  }
  if (line) lines.push(line); return lines;
}
function withAlpha(a, fn) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; fn(); ctx.restore(); }
function shadow(blur = 30, color = "rgba(0,0,0,.45)", oy = 10) { ctx.shadowBlur = blur; ctx.shadowColor = color; ctx.shadowOffsetY = oy; }
function noShadow() { ctx.shadowBlur = 0; ctx.shadowColor = "transparent"; ctx.shadowOffsetY = 0; }
function rnd(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function popScale(t, t0, d = .45) { return pe(t, t0, t0 + d, backOut); }
function scaled(cx, cy, k, fn) { if (k <= 0) return; ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-cx, -cy); fn(); ctx.restore(); }
function flash(t, t0, a = .7) { const f = 1 - p(t, t0, t0 + .35); if (t >= t0 && f > 0) { ctx.fillStyle = `rgba(255,255,255,${a * f})`; ctx.fillRect(0, 0, W, H); } }

// ============================================================
//  ASSETS
// ============================================================
const imgBg = new Image(); imgBg.src = "assets/fondo-chart.png";
const imgPayout = new Image(); imgPayout.src = "assets/payout-mff.webp";
const EXTRA_IMAGES = [imgPayout];
// imágenes opcionales (capturas reales): si el archivo no existe, la escena sigue sin ella
const OPTIONAL_IMAGES = [];
function optionalImage(src) { const im = new Image(); im.ok = false; im.src = src; OPTIONAL_IMAGES.push(im); return im; }

// ============================================================
//  FONDO (tu gráfico, paneo lento + oscurecido)
// ============================================================
function drawBackground(t) {
  const ih = imgBg.naturalHeight, iw = imgBg.naturalWidth;
  const s = H / ih * 1.04, dw = iw * s, dh = ih * s;
  const x = -(dw - W) * easeInOut(clamp(t / DURATION));
  const y = -(dh - H) / 2 + Math.sin(t * .25) * 6;
  ctx.drawImage(imgBg, x, y, dw, dh);
  ctx.fillStyle = "rgba(6,10,20,0.78)"; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H * .45, 200, W / 2, H * .5, H * .75);
  g.addColorStop(0, "rgba(20,184,166,0.07)"); g.addColorStop(1, "rgba(0,0,0,0.65)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// ============================================================
//  UI COMÚN
// ============================================================
function chip(label, t, a, b, y = 214) {
  withAlpha(sceneAlpha(t, a, b, .4, .3), () => {
    ctx.font = F(800, 26); const w = ctx.measureText(label).width + 48;
    rr(W / 2 - w / 2, y, w, 50, 25); ctx.fillStyle = "rgba(255,255,255,0.10)"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 2; ctx.stroke();
    text(label, W / 2, y + 26, F(800, 26), "rgba(255,255,255,0.85)");
  });
}
function headline(parts, t, a, b, y = 330, size = 56) {
  const al = sceneAlpha(t, a, b, .3, .3);
  if (al <= 0) return;
  const k = pe(t, a, a + .4, backOut);
  withAlpha(al, () => {
    ctx.save(); ctx.translate(W / 2, y); ctx.scale(.9 + .1 * k, .9 + .1 * k);
    ctx.font = F(900, size); ctx.textBaseline = "middle"; ctx.textAlign = "left";
    const total = parts.reduce((s, [tx]) => s + ctx.measureText(tx).width, 0);
    let x = -total / 2;
    for (const [tx, col] of parts) {
      ctx.lineWidth = 12; ctx.strokeStyle = "rgba(0,0,0,.75)"; ctx.lineJoin = "round"; ctx.strokeText(tx, x, 0);
      ctx.fillStyle = col; ctx.fillText(tx, x, 0); x += ctx.measureText(tx).width;
    }
    ctx.restore();
  });
}
// cabecera estilo ficha: título grande + subtítulo mono + etiqueta
function conceptHeader(title, sub, tag, t, a, b, y = 318) {
  const al = sceneAlpha(t, a, b, .35, .3);
  if (al <= 0) return;
  const k = pe(t, a, a + .45, backOut);
  withAlpha(al, () => {
    ctx.save(); ctx.translate(0, (1 - k) * 26);
    text(title, 90, y, F(900, 64), C.white, "left");
    ctx.font = MONO(26); const sw = ctx.measureText(sub).width;
    text(sub, 92, y + 62, MONO(26), T.kicker, "left");
    if (tag) {
      ctx.font = MONO(26); const tw = ctx.measureText(tag).width + 28, x = 92 + sw + 14;
      rr(x, y + 62 - 22, tw, 44, 8); ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fill();
      text(tag, x + tw / 2, y + 63, MONO(26), C.white);
    }
    ctx.restore();
  });
}
// bloques "CÓMO SE VE / QUÉ SIGNIFICA" bajo el panel
function infoCards(items, t, a, b, y0 = 1318) {
  const al = sceneAlpha(t, a, b, .3, .3);
  if (al <= 0) return;
  let y = y0;
  withAlpha(al, () => items.forEach(([t0, kicker, s, col = C.white]) => {
    const font = F(800, 36), lines = wrap(s, 870, font);
    const h = (kicker ? 52 : 26) + lines.length * 46 + 18;
    const k = pe(t, t0, t0 + .4);
    if (k > 0) withAlpha(k, () => {
      ctx.save(); ctx.translate((1 - k) * 40, 0);
      rr(70, y, 940, h, 22); ctx.fillStyle = "rgba(13,17,23,.90)"; ctx.fill();
      ctx.strokeStyle = T.line; ctx.lineWidth = 2; ctx.stroke();
      let yy = y + 22;
      if (kicker) { text(kicker, 104, yy + 10, MONO(24), T.kicker, "left"); yy += 34; }
      lines.forEach((ln, i) => text(ln, 104, yy + 23 + i * 46, font, col, "left"));
      ctx.restore();
    });
    y += h + 18;
  }));
}
function photo(img, cx, cy, w, rot, k, opts = {}) {
  if (k <= 0) return;
  const h = img.naturalHeight * (w / img.naturalWidth), pad = opts.pad ?? 14;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(k, k);
  shadow(60, "rgba(0,0,0,.7)", 24);
  rr(-w / 2 - pad, -h / 2 - pad, w + pad * 2, h + pad * 2, 16); ctx.fillStyle = opts.frame || "#f8fafc"; ctx.fill(); noShadow();
  ctx.save(); rr(-w / 2, -h / 2, w, h, 8); ctx.clip(); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  ctx.restore();
  return h;
}
// "prueba real": tu captura de TPO encima del panel (solo si el archivo existe)
function proof(img, label, t, a, b) {
  if (!img.ok) return;
  const al = sceneAlpha(t, a, b, .35, .35);
  withAlpha(al, () => {
    ctx.fillStyle = "rgba(4,6,12,.78)"; ctx.fillRect(0, 420, W, 880);
    const k = pe(t, a, a + .5, backOut);
    const maxW = 900, maxH = 760, s = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
    photo(img, W / 2, 860, img.naturalWidth * s, -.015, k, { frame: "#0d1117", pad: 10 });
    const sk = pe(t, a + .35, a + .7, backOut);
    if (sk > 0) {
      ctx.save(); ctx.translate(820, 500); ctx.rotate(.12); ctx.scale(1.5 - .5 * sk, 1.5 - .5 * sk); ctx.globalAlpha *= clamp(sk * 2);
      ctx.font = F(900, 34); const w = ctx.measureText("PRUEBA REAL").width + 40;
      rr(-w / 2, -30, w, 60, 12); ctx.fillStyle = "rgba(0,0,0,.6)"; ctx.fill(); ctx.strokeStyle = T.teal; ctx.lineWidth = 5; ctx.stroke();
      text("PRUEBA REAL", 0, 2, F(900, 34), T.teal);
      ctx.restore();
    }
    if (label) text(label, W / 2, 1262, MONO(26), T.kicker);
  });
}
function disclaimer(t) {
  withAlpha(.55 * p(t, .3, .8), () => text("Contenido educativo · No es consejo financiero", W / 2, 1882, F(600, 24), "rgba(255,255,255,.75)"));
}

// ============================================================
//  TPO: panel, letras que caen, bandas, barra IB
// ============================================================
const PANEL = { x: 60, y: 440, w: 960, h: 830 };
function tpoPanel(al = 1) {
  withAlpha(al, () => {
    shadow(40, "rgba(0,0,0,.5)", 12);
    rr(PANEL.x, PANEL.y, PANEL.w, PANEL.h, 26); ctx.fillStyle = "rgba(13,17,23,.95)"; ctx.fill(); noShadow();
    ctx.strokeStyle = T.line; ctx.lineWidth = 2; ctx.stroke();
  });
}
// geometría: filas centradas verticalmente en el panel
function tpoGeom(prof, o = {}) {
  const rh = o.rh || 52, cw = o.cw || 46, n = prof.hi - prof.lo + 1;
  const cy = o.cy ?? PANEL.y + PANEL.h / 2, x = o.x ?? 330;
  const yb = cy + (n - 1) * rh / 2;
  return { rh, cw, x, size: o.size || 38, prof,
    y: r => yb - (r - prof.lo) * rh, xc: c => x + c * cw,
    top: r => yb - (r - prof.lo) * rh - rh / 2, bot: r => yb - (r - prof.lo) * rh + rh / 2 };
}
// dibuja las letras ya "impresas" en t; o.color(L) → color; o.instant ignora la caída
function tpoLetters(g, t, o = {}) {
  for (const L of g.prof.letters) {
    const dt = o.instant ? 9 : t - L.t;
    if (dt < 0) continue;
    const k = clamp(dt / .32), yOff = -54 * (1 - backOut(k));
    const col = o.color ? o.color(L) : T.letter;
    if (!col) continue;
    withAlpha(clamp(dt / .1), () => {
      if (dt < .45 && !o.instant) { ctx.shadowBlur = 24 * (1 - dt / .45); ctx.shadowColor = T.teal; }
      text(L.l, g.xc(L.col), g.y(L.row) + yOff, MONO(g.size), col);
      noShadow();
    });
  }
}
// banda de color detrás de unas filas, con su texto a la derecha (como en la ficha)
function tpoBand(g, lo, hi, fill, color, label, al, o = {}) {
  withAlpha(al, () => {
    const x0 = o.x0 ?? PANEL.x + 24, x1 = o.x1 ?? PANEL.x + PANEL.w - 24;
    const yT = g.top(hi) + 3, yB = g.bot(lo) - 3, w = (x1 - x0) * (o.grow ?? 1);
    rr(x0, yT, w, yB - yT, 8); ctx.fillStyle = fill; ctx.fill();
    if (label) text(label, x1 - 26, (yT + yB) / 2 + 1, MONO(o.size || 30), color, "right");
  });
}
function tagChip(label, x, y, color, al, k = 1) {
  withAlpha(al, () => scaled(x, y, k, () => {
    ctx.font = MONO(28); const w = ctx.measureText(label).width + 30;
    rr(x - w / 2, y - 24, w, 48, 10); ctx.fillStyle = color; ctx.fill();
    text(label, x, y + 1, MONO(28), C.ink);
  }));
}
// barra vertical del Initial Balance a la izquierda del perfil
function ibBar(g, lo, hi, t, t0, opts = {}) {
  const k = pe(t, t0, t0 + .9, easeInOut);
  if (k <= 0) return;
  const x = g.x - 78, yB = g.bot(lo) - 4, yT = g.top(hi) + 4, yNow = lerp(yB, yT, k);
  ctx.fillStyle = T.teal; rr(x - 6, yNow, 12, yB - yNow, 6); ctx.fill();
  withAlpha(pe(t, t0 + .7, t0 + 1.0), () => text("IB", x, yT - 30, MONO(30), T.teal));
  const kl = pe(t, t0 + 1.1, t0 + 1.5, backOut);
  if (kl > 0 && opts.labels !== false) {
    tagChip("IBH", x - 92, yT + 20, T.teal, 1, kl);
    tagChip("IBL", x - 92, yB - 20, T.teal, 1, pe(t, t0 + 1.4, t0 + 1.8, backOut));
  }
}
// eje de precios a la derecha (para explicar los "niveles")
function priceAxis(g, base, step, al) {
  withAlpha(al, () => {
    for (let r = g.prof.lo; r <= g.prof.hi; r++) text(fmtThousands(base + r * step), PANEL.x + PANEL.w - 36, g.y(r), MONO(22), "rgba(230,237,243,.38)", "right");
  });
}
// marcador del precio moviéndose en el periodo en curso
function priceMarker(g, t, al = 1) {
  const pa = tpoPriceAt(g.prof, t);
  if (!pa) return null;
  withAlpha(al, () => {
    const y = g.y(pa.row), xr = PANEL.x + PANEL.w - 150;
    const filled = g.prof.letters.filter(L => L.row === Math.round(pa.row) && L.t <= t).length;
    ctx.strokeStyle = "rgba(250,204,21,.55)"; ctx.lineWidth = 2; ctx.setLineDash([6, 8]);
    ctx.beginPath(); ctx.moveTo(g.xc(filled) + 4, y); ctx.lineTo(xr - 22, y); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(xr - 22, y); ctx.lineTo(xr + 4, y - 15); ctx.lineTo(xr + 4, y + 15); ctx.closePath(); ctx.fill();
    text("precio", xr - 12, y - 30, F(800, 22), C.gold, "right");
  });
  return pa;
}
const nyTime = i => { const m = 9 * 60 + 30 + i * 30, f = m2 => `${Math.floor(m2 / 60)}:${String(m2 % 60).padStart(2, "0")}`; return `${f(m)}–${f(m + 30)}`; };

// ============================================================
//  LA HABITACIÓN: trader en el escritorio + visitante
// ============================================================
const SKIN1 = "#d9a47c", SKIN2 = "#f0c39b";
function speech(textStr, x, y, w, tailX, tailY, t, t0, t1, opts = {}) {
  const al = Math.min(pe(t, t0, t0 + .25), 1 - p(t, t1 - .25, t1));
  if (al <= 0) return;
  const k = pe(t, t0, t0 + .35, backOut);
  const font = F(800, opts.size || 44), lines = wrap(textStr, w - 70, font), lh = (opts.size || 44) * 1.25;
  const h = lines.length * lh + 56;
  withAlpha(al, () => scaled(tailX, tailY, .6 + .4 * k, () => {
    shadow(30, "rgba(0,0,0,.45)", 10);
    ctx.fillStyle = opts.bg || "#ffffff";
    rr(x, y, w, h, 34); ctx.fill();
    ctx.beginPath(); ctx.moveTo(clamp(tailX, x + 40, x + w - 40) - 22, y + h - 2); ctx.lineTo(tailX, tailY); ctx.lineTo(clamp(tailX, x + 40, x + w - 40) + 22, y + h - 2); ctx.fill();
    noShadow();
    lines.forEach((ln, i) => text(ln, x + w / 2, y + 28 + lh / 2 + i * lh, font, opts.color || C.ink));
  }));
}
function face(hx, hy, r, dir, talk, skin, opts = {}) {
  ctx.beginPath(); ctx.arc(hx, hy, r, 0, 7); ctx.fillStyle = skin; ctx.fill();
  if (opts.cap) {
    ctx.fillStyle = opts.cap;
    ctx.beginPath(); ctx.arc(hx, hy - r * .15, r * 1.02, Math.PI, 0); ctx.fill();
    rr(hx + (dir > 0 ? 0 : -r * 1.55), hy - r * .3, r * 1.55, r * .28, 6); ctx.fill();
  } else {
    ctx.fillStyle = opts.hair || "#1f2937";
    ctx.beginPath(); ctx.arc(hx - dir * r * .1, hy - r * .1, r * 1.03, Math.PI * 1.02, Math.PI * 1.98); ctx.fill();
    ctx.beginPath(); ctx.arc(hx - dir * r * .55, hy - r * .1, r * .55, 0, 7); ctx.fill();
  }
  ctx.fillStyle = C.ink;
  const eyeY = hy - r * .05 - (opts.raise || 0) * r * .12;
  ctx.beginPath(); ctx.arc(hx + dir * r * .42, eyeY, r * .1, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(hx + dir * r * .05, eyeY, r * .09, 0, 7); ctx.fill();
  const mo = talk ? (Math.sin(talk * 22) * .5 + .5) * r * .18 : 0;
  ctx.beginPath(); ctx.ellipse(hx + dir * r * .3, hy + r * .42, r * .2, mo + r * .04, 0, 0, 7); ctx.fillStyle = "#7f1d1d"; ctx.fill();
}
function trader(t, turn, typing, talkT, shades = 0) {
  const flip = turn < .5 ? -1 : 1, squash = Math.max(.12, Math.abs(1 - 2 * turn));
  const X = 720, SEAT = 1365;
  ctx.save(); ctx.translate(X, SEAT); ctx.scale(flip * squash, 1);
  ctx.fillStyle = "#111827";
  rr(-110, -250, 34, 250, 14); ctx.fill();
  rr(-95, -8, 190, 26, 12); ctx.fill();
  ctx.fillRect(-8, 18, 16, 80);
  ctx.strokeStyle = "#111827"; ctx.lineWidth = 10; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-70, 120); ctx.lineTo(70, 120); ctx.stroke();
  ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 34;
  ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(115, -2); ctx.lineTo(118, 130); ctx.stroke();
  ctx.fillStyle = "#0f172a"; rr(100, 120, 60, 22, 10); ctx.fill();
  const breath = Math.sin(t * 2.4) * 3;
  rr(-55, -215 + breath, 110, 215, 46); ctx.fillStyle = "#374151"; ctx.fill();
  ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(10, -190 + breath); ctx.lineTo(14, -140 + breath); ctx.moveTo(26, -190 + breath); ctx.lineTo(30, -145 + breath); ctx.stroke();
  ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(8, -205 + breath, 34, .1 * Math.PI, .9 * Math.PI); ctx.stroke();
  ctx.strokeStyle = "#374151"; ctx.lineWidth = 28; ctx.lineCap = "round";
  const ty = typing ? Math.sin(t * 18) * 4 : 0;
  if (turn < .5) {
    ctx.beginPath(); ctx.moveTo(15, -175 + breath); ctx.lineTo(80, -95); ctx.lineTo(170, -120 + ty); ctx.stroke();
    ctx.fillStyle = SKIN1; ctx.beginPath(); ctx.arc(178, -120 + ty, 14, 0, 7); ctx.fill();
  } else {
    ctx.beginPath(); ctx.moveTo(15, -175 + breath); ctx.lineTo(55, -80); ctx.lineTo(115, -40); ctx.stroke();
    ctx.fillStyle = SKIN1; ctx.beginPath(); ctx.arc(122, -38, 14, 0, 7); ctx.fill();
  }
  ctx.restore();
  ctx.save(); ctx.translate(X, SEAT); ctx.scale(flip, 1);
  face(18, -268 + breath, 56, 1, talkT, SKIN1, { hair: "#111827" });
  if (shades > 0) {
    const hy = -268 + breath - 56 * .05 - (1 - shades) * 260;
    ctx.globalAlpha *= clamp(shades * 3);
    ctx.fillStyle = "#0b0b0b";
    rr(18 - 6, hy - 14, 34, 26, 8); ctx.fill(); rr(18 + 30, hy - 14, 34, 26, 8); ctx.fill();
    ctx.fillRect(18 + 26, hy - 8, 6, 5); ctx.fillRect(18 - 30, hy - 10, 26, 5);
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(18 + 36, hy - 9, 8, 4);
  }
  ctx.restore();
}
function visitor(t, x, walking, talkT, dir = -1, opts = {}) {
  const FY = 1600, ph = walking ? t * 9 : 0, sw = walking ? Math.sin(ph) : 0;
  ctx.save(); ctx.translate(x, FY);
  ctx.strokeStyle = "#1e3a8a"; ctx.lineWidth = 32; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(sw * 34, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(-sw * 34, 0); ctx.stroke();
  ctx.fillStyle = "#f8fafc"; rr(sw * 34 - 22 + dir * 8, -12, 48, 22, 10); ctx.fill(); rr(-sw * 34 - 22 + dir * 8, -12, 48, 22, 10); ctx.fill();
  const bob = walking ? Math.abs(Math.sin(ph)) * -6 : 0;
  rr(-58, -430 + bob, 116, 245, 44); ctx.fillStyle = "#0d9488"; ctx.fill();
  ctx.strokeStyle = "#0d9488"; ctx.lineWidth = 28;
  ctx.beginPath(); ctx.moveTo(0, -390 + bob); ctx.lineTo(-sw * 40 + dir * 10, -270 + bob); ctx.lineTo(-sw * 30 + dir * 20, -200 + bob); ctx.stroke();
  ctx.fillStyle = SKIN2; ctx.beginPath(); ctx.arc(-sw * 30 + dir * 20, -192 + bob, 14, 0, 7); ctx.fill();
  face(0, -490 + bob, 58, dir, talkT, SKIN2, { cap: "#f97316", raise: opts.raise || 0 });
  ctx.restore();
}
// monitor con letras TPO (estático o construyéndose en vivo)
function tpoMonitor(x, y, w, h, t, prof, live = false) {
  ctx.fillStyle = "#0b0f17"; rr(x - 8, y - 8, w + 16, h + 16, 10); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = T.bg; ctx.fillRect(x, y, w, h);
  const n = prof.hi - prof.lo + 1, rh = (h - 18) / n, cw = rh * .82;
  const tt = live ? prof.t0 + ((t * 1.6) % (prof.tEnd - prof.t0 + 2)) : 1e9;
  for (const L of prof.letters) {
    if (L.t > tt) continue;
    const fresh = tt - L.t < .4;
    ctx.font = MONO(Math.round(rh * .82)); ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = fresh ? T.teal : (L.p < 2 ? "rgba(94,234,212,.85)" : "rgba(230,237,243,.82)");
    ctx.fillText(L.l, x + 22 + L.col * cw, y + h - 9 - (L.row - prof.lo + .5) * rh);
  }
  ctx.restore();
}
// footprint: celdas bid x ask (monitor superior en la parte 2)
const FP = (() => {
  let s = 777; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 6 }, () => {
    const base = Math.floor(r() * 3), rows = 6 + Math.floor(r() * 3), up = r() > .45;
    return { base, up, cells: Array.from({ length: rows }, () => [Math.floor(r() * 90), Math.floor(r() * 90)]) };
  });
})();
function footprintMonitor(x, y, w, h, t) {
  ctx.fillStyle = "#0b0f17"; rr(x - 8, y - 8, w + 16, h + 16, 10); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = "#0f172a"; ctx.fillRect(x, y, w, h);
  const cw = 48, rh = 14, live = Math.floor(t * 4);
  FP.forEach((cd, c) => {
    const cx = x + 8 + c * (cw + 2);
    cd.cells.forEach(([bid, ask], i) => {
      if (c === FP.length - 1) { bid = (bid + live * 7 * (i + 1)) % 90; ask = (ask + live * 11 * (i + 2)) % 90; }
      const cy = y + h - 12 - (cd.base + i + 1) * rh, d = (ask - bid) / 90;
      ctx.fillStyle = d > 0 ? `rgba(34,197,94,${.15 + d * .6})` : `rgba(239,68,68,${.15 - d * .6})`;
      ctx.fillRect(cx, cy, cw, rh - 1);
      ctx.font = F(700, 10, "JBM"); ctx.fillStyle = "#e5e7eb"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(bid + "x" + ask, cx + cw / 2, cy + rh / 2);
    });
    const top = y + h - 12 - (cd.base + cd.cells.length) * rh, bot = y + h - 12 - cd.base * rh;
    ctx.fillStyle = cd.up ? "#22c55e" : "#ef4444"; ctx.fillRect(cx - 4, top, 3, bot - top);
  });
  ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.font = F(800, 11); ctx.textAlign = "left"; ctx.fillText("FOOTPRINT", x + 8, y + 12);
  ctx.restore();
}
function monitorStand(x, y, w, h) {
  ctx.fillStyle = "#111827"; ctx.fillRect(x + w / 2 - 10, y + h + 8, 20, 1245 - (y + h + 8));
  rr(x + w / 2 - 50, 1236, 100, 10, 4); ctx.fill();
}
// ROOM_MONITORS(t) lo define cada reel: dibuja las 3 pantallas
function room(t, st) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#151a2e"); g.addColorStop(.75, "#241b33"); g.addColorStop(.76, "#17131f"); g.addColorStop(1, "#0e0b14");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // tu certificado de payout enmarcado en la pared
  ctx.save();
  shadow(30, "rgba(0,0,0,.6)", 12);
  rr(118, 430, 400, 300, 8); ctx.fillStyle = "#b08d57"; ctx.fill(); noShadow();
  rr(130, 442, 376, 276, 4); ctx.fillStyle = "#0b0f17"; ctx.fill();
  ctx.save(); rr(144, 456, 348, 248, 2); ctx.clip(); ctx.drawImage(imgPayout, 144, 456, 348, 248); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.shadowBlur = 30; ctx.shadowColor = "#22d3ee";
  text(CONFIG.handle, 800, 560, F(900, 54), "#a5f3fc"); ctx.restore();
  const lg = ctx.createRadialGradient(330, 1100, 50, 330, 1100, 520);
  lg.addColorStop(0, "rgba(45,212,191,.20)"); lg.addColorStop(1, "rgba(45,212,191,0)");
  ctx.fillStyle = lg; ctx.fillRect(0, 600, 900, 1000);
  ctx.beginPath(); ctx.ellipse(560, 1650, 470, 70, 0, 0, 7); ctx.fillStyle = "rgba(255,255,255,.04)"; ctx.fill();
  ctx.fillStyle = "#5b4636"; rr(60, 1245, 560, 30, 8); ctx.fill();
  ctx.fillStyle = "#3f3127"; ctx.fillRect(80, 1275, 26, 330); ctx.fillRect(574, 1275, 26, 330);
  ctx.fillStyle = "#111827"; ctx.fillRect(344, 960, 16, 285);
  monitorStand(95, 985, 250, 165); monitorStand(360, 985, 250, 165);
  ROOM_MONITORS(t);
  rr(400, 1228, 170, 16, 5); ctx.fillStyle = "#1f2937"; ctx.fill();
  rr(110, 1195, 40, 50, 8); ctx.fillStyle = "#e5e7eb"; ctx.fill();
  ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(152, 1218, 12, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  trader(t, st.turn, st.typing, st.traderTalk, st.shades || 0);
  if (st.visitorX < W + 150) visitor(t, st.visitorX, st.walking, st.visitorTalk, -1, { raise: st.raise });
}
function zoomInto(t, a, b, cx, cy, fn) {
  const k = pe(t, a, b, easeIn);
  ctx.save(); ctx.translate(cx, cy); ctx.scale(1 + k * 3, 1 + k * 3); ctx.translate(-cx, -cy); fn(); ctx.restore();
  if (k > 0) { ctx.fillStyle = `rgba(6,10,20,${k})`; ctx.fillRect(0, 0, W, H); }
}
function zoomOutOf(t, a, b, cx, cy, fn) {
  const k = 1 - pe(t, a, b, easeOut);
  ctx.save(); ctx.translate(cx, cy); ctx.scale(1 + k * 3, 1 + k * 3); ctx.translate(-cx, -cy); fn(); ctx.restore();
  if (k > 0) { ctx.fillStyle = `rgba(6,10,20,${k})`; ctx.fillRect(0, 0, W, H); }
}

// ============================================================
//  SUBTÍTULOS opcionales (--captions)
// ============================================================
function buildCaps() {
  const caps = [];
  for (const [a, b, s] of VO) {
    const words = s.split(" "), chunks = []; let cur = [];
    for (const w of words) { cur.push(w); if (cur.length >= 6 || /[.:,…?]$/.test(w) && cur.length >= 3) { chunks.push(cur.join(" ")); cur = []; } }
    if (cur.length) chunks.push(cur.join(" "));
    const tot = chunks.reduce((n, c) => n + c.length + 6, 0); let acc = a;
    for (const c of chunks) { const d = (b - a) * (c.length + 6) / tot; caps.push([acc, acc + d, c]); acc += d; }
  }
  return caps;
}
let CAPS = null;
const HL = /^(TPO|IB|IBH|IBL|A|B|single|prints|tail|excess|FVG|poor|high|low|UFA|terminó|terminan|terminar|confidencial)[.,:…?]*$/i;
function captions(t) {
  if (!CONFIG.captions) return;
  CAPS = CAPS || buildCaps();
  const c = CAPS.find(c => t >= c[0] && t < c[1]);
  if (!c) return;
  const k = pe(t, c[0], c[0] + .12, backOut), font = F(900, 46), lines = wrap(c[2], 900, font);
  ctx.save(); ctx.translate(W / 2, 1770); ctx.scale(.9 + .1 * k, .9 + .1 * k);
  lines.forEach((ln, i) => {
    const y = (i - (lines.length - 1) / 2) * 58;
    ctx.font = font; ctx.textAlign = "left"; ctx.textBaseline = "middle";
    let x = -ctx.measureText(ln).width / 2;
    for (const w of ln.split(" ")) {
      ctx.lineWidth = 10; ctx.strokeStyle = "rgba(0,0,0,.85)"; ctx.lineJoin = "round"; ctx.strokeText(w, x, y);
      ctx.fillStyle = HL.test(w) ? C.gold : C.white; ctx.fillText(w, x, y);
      x += ctx.measureText(w + " ").width;
    }
  });
  ctx.restore();
}

// ============================================================
//  MAIN
// ============================================================
function renderFrame(t) {
  ctx = document.getElementById("c").getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; noShadow();
  ctx.clearRect(0, 0, W, H);
  drawBackground(t);
  for (const s of SCENES) s(t);
  captions(t);
  disclaimer(t);
  const fade = Math.max(1 - p(t, 0, .3), p(t, DURATION - .5, DURATION));
  if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, W, H); }
}
function boot() {
  window.renderFrame = renderFrame;
  window.DURATION = DURATION;
  window.ready = Promise.all([
    document.fonts.load(F(900, 40)), document.fonts.load(MONO(40)),
    imgBg.decode(), ...EXTRA_IMAGES.map(i => i.decode()),
    ...OPTIONAL_IMAGES.map(i => i.decode().then(() => { i.ok = true; }, () => { i.ok = false; })),
  ]).then(() => document.fonts.ready);
  if (!params.has("render")) {
    window.ready.then(() => {
      const start = performance.now() - (parseFloat(params.get("t")) || 0) * 1000;
      const loop = () => { renderFrame(((performance.now() - start) / 1000) % DURATION); requestAnimationFrame(loop); };
      loop();
    });
    document.body.style.cssText = "display:flex;justify-content:center;background:#111";
    document.getElementById("c").style.cssText = "height:100vh;width:auto";
  }
}
