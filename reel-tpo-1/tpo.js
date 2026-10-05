// Núcleo TPO sin DOM: lo usan reel.html (dibujo) y sfx.mjs (un "tic" por letra).
// Un perfil se define con el camino que hace el precio en cada periodo de 30 min:
//   path [9, 12, 7] = empieza en la fila 9, sube a la 12 y baja a la 7.
// Cada fila nueva que toca el periodo recibe su letra, pegada a la derecha
// de las letras que ya había en esa fila (perfil TPO "colapsado").
const TPO_LETTERS = "ABCDEFGHIJKLMN";

function tpoExpand(path) {
  const steps = [path[0]];
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1], b = path[i], d = Math.sign(b - a);
    for (let r = a + d; d && r !== b + d; r += d) steps.push(r);
  }
  return steps;
}

// spec: { paths: [...], t0, dur: number | number[], gap }
function tpoProfile(spec) {
  const periods = []; let t = spec.t0;
  spec.paths.forEach((path, i) => {
    const dur = Array.isArray(spec.dur) ? spec.dur[i] : spec.dur;
    const steps = tpoExpand(path), n = steps.length;
    periods.push({ l: TPO_LETTERS[i], steps, t0: t, dur, times: steps.map((_, k) => t + dur * (n > 1 ? k / (n - 1) : 0)) });
    t += dur + (spec.gap ?? .06);
  });
  const count = {}, letters = []; let lo = 1e9, hi = -1e9;
  periods.forEach((per, pi) => {
    const seen = new Set();
    per.steps.forEach((r, k) => {
      if (seen.has(r)) return; seen.add(r);
      const col = count[r] || 0; count[r] = col + 1;
      letters.push({ l: per.l, row: r, col, t: per.times[k], p: pi });
      lo = Math.min(lo, r); hi = Math.max(hi, r);
    });
  });
  return { periods, letters, count, lo, hi, t0: spec.t0, tEnd: t };
}

// posición (fila continua) del precio en el instante t, o null fuera de los periodos
function tpoPriceAt(prof, t) {
  for (const per of prof.periods) {
    if (t < per.t0 || t > per.t0 + per.dur) continue;
    const n = per.steps.length; if (n === 1) return { row: per.steps[0], per };
    const f = (t - per.t0) / per.dur * (n - 1), i = Math.min(n - 2, Math.floor(f));
    return { row: per.steps[i] + (per.steps[i + 1] - per.steps[i]) * (f - i), per };
  }
  return null;
}
