// Datos de la parte 2: perfiles TPO y cuándo se imprime cada letra.
// Lo cargan reel.html y sfx.mjs, así cada letra suena justo cuando cae.
const DURATION = 85;

// repaso: a la izquierda un extremo con tail (terminado), a la derecha uno plano
const P_DONE = tpoProfile({ paths: [[3, 6, 1], [1, 0, 4], [4, 9, 6], [6, 2, 5], [5, 1, 4]], t0: 8.0, dur: .45, gap: .05 });
const P_OPEN = tpoProfile({ paths: [[3, 6, 1], [1, 0, 4], [4, 7, 5], [5, 7, 3], [3, 7, 4]], t0: 10.6, dur: .45, gap: .05 });

// poor high: C, D, F y G se paran en la misma fila (12); abajo, buying tail de A (filas 0–1)
const PH_PATHS = [[4, 0, 6], [6, 2, 9], [9, 12, 9], [9, 12, 8], [8, 5, 9], [9, 12, 10], [10, 12, 7], [7, 4, 6]];
const P_PH = tpoProfile({ paths: PH_PATHS, t0: 20.0, dur: .65, gap: .06 });
const PH = { top: 12, tail: [0, 1] };

// poor low: C, D y F se paran en la fila 0; arriba, selling tail de A (filas 11–12)
const PL_PATHS = [[8, 12, 6], [6, 10, 4], [4, 0, 3], [3, 0, 5], [5, 8, 3], [3, 0, 4], [4, 7, 5], [5, 9, 6]];
const P_PL = tpoProfile({ paths: PL_PATHS, t0: 35.6, dur: .65, gap: .06 });
const PL = { bot: 0, tail: [11, 12] };

// UFA: el mismo perfil del poor high, reconstruido rápido
const P_UFA = tpoProfile({ paths: PH_PATHS, t0: 49.6, dur: .32, gap: .04 });

// pantallas de la habitación
const P_MON2 = tpoProfile({ paths: PH_PATHS, t0: -99, dur: .1 });
const P_MON3 = tpoProfile({ paths: PL_PATHS, t0: 0, dur: .5, gap: .05 });

// letras que suenan (las de los monitores de la habitación no)
const SOUND_PROFILES = [P_DONE, P_OPEN, P_PH, P_PL, P_UFA];
