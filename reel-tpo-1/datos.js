// Datos de la parte 1: perfiles TPO y cuándo se imprime cada letra.
// Lo cargan reel.html y sfx.mjs, así cada letra suena justo cuando cae.
const DURATION = 85;

// día normal: A y B forman el Initial Balance (filas 6–13)
const MAIN_PATHS = [[9, 12, 7], [7, 13, 6], [6, 5, 9], [9, 4, 7], [7, 11, 9], [9, 14, 12], [12, 15, 11], [11, 13, 10], [10, 16, 14]];
const P_MAIN = tpoProfile({
  paths: MAIN_PATHS,
  t0: 8.0, dur: [2.6, 1.9, 1.0, .75, .75, .75, .75, .75, .75], gap: .15,
});
const IB = { lo: 6, hi: 13 };

// doble distribución: E sube solo por las filas 7–11 (single prints)
const SP_PATHS = [[3, 6, 1], [1, 0, 5], [5, 6, 2], [2, 1, 5], [5, 15], [15, 12, 16], [16, 17, 13], [13, 12, 15], [15, 17, 14]];
const P_SP = tpoProfile({
  paths: SP_PATHS,
  t0: 35.6, dur: [.7, .7, .6, .6, .9, .6, .6, .6, .6], gap: .06,
});
const SP = { lo: 7, hi: 11, d1: [0, 6], d2: [12, 17] };

// selling tail arriba (C, filas 10–12) y buying tail abajo (A, filas 0–1)
const TAIL_PATHS = [[4, 0, 5], [5, 2, 7], [7, 12, 8], [8, 9, 4], [4, 3, 8], [8, 9, 5], [5, 2, 6], [6, 8, 5]];
const P_TAIL = tpoProfile({
  paths: TAIL_PATHS,
  t0: 52.6, dur: .65, gap: .06,
});
const TAIL = { sell: [10, 12], buy: [0, 1] };

// cierre: un techo plano, sin tail (el gancho de la parte 2)
const P_FLAT = tpoProfile({
  paths: [[3, 6, 1], [1, 0, 4], [4, 7, 5], [5, 7, 3], [3, 7, 4]],
  t0: 78.2, dur: .24, gap: .03,
});

// pantallas de la habitación
const P_MON1 = tpoProfile({ paths: MAIN_PATHS, t0: 0, dur: .5, gap: .05 });
const P_MON2 = tpoProfile({ paths: SP_PATHS, t0: -99, dur: .1 });
const P_MON3 = tpoProfile({ paths: TAIL_PATHS, t0: -99, dur: .1 });

// letras que suenan (las de los monitores de la habitación no)
const SOUND_PROFILES = [P_MAIN, P_SP, P_TAIL, P_FLAT];
