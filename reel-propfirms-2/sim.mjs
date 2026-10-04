// Monte Carlo of prop-firm strategies (simplified Lucid-like 50K model).
// Eval: target +3000, consistency (best day <= 50% of total), EOD trailing DD 2000, cost 100.
// Funded: payout after 5 green days (day >= +200), withdraw 50% of profit, 90% split.
// A trade needs buffer >= risk, otherwise the account is burned.
const N = +process.argv[2] || 200000;
let seed = 12345; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
function trade(p, risk, r) { return rnd() < p ? risk * r : -risk; }

function evalPhase(p, r, plan) {
  let bal = 0, peak = 0, best = 0, days = 0;
  while (days < 120) {
    days++;
    let day = 0;
    for (const risk of plan.evalDay) {
      if (bal + day - risk < peak - 2000 - 1e-9) return { pass: false, days };
      const res = trade(p, risk, r); day += res;
      if (plan.allIn && res < 0) return { pass: false, days };
    }
    bal += day; best = Math.max(best, day); peak = Math.max(peak, bal);
    if (bal >= 3000 && best <= bal * 0.5 + 1e-9) return { pass: true, days };
  }
  return { pass: false, days };
}
function fundedPhase(p, r, plan) {
  let bal = 0, peak = 0, green = 0, days = 0;
  while (days < 120) {
    days++;
    const risks = (days === 1 && plan.fundBig) ? [plan.fundBig] : plan.fundDay;
    let day = 0;
    for (const risk of risks) {
      if (bal + day - risk < peak - 2000 - 1e-9) return { paid: 0, days };
      const res = trade(p, risk, r); day += res;
      if (plan.allIn && days === 1 && res < 0) return { paid: 0, days };
    }
    bal += day; peak = Math.max(peak, bal);
    if (day >= 200) green++;
    if (green >= 5 && bal > 0) return { paid: bal * 0.5 * 0.9, days };
  }
  return { paid: 0, days };
}
function run(name, p, r, plan) {
  let pass = 0, paidN = 0, paidSum = 0, d = 0;
  for (let i = 0; i < N; i++) {
    const e = evalPhase(p, r, plan); d += e.days;
    if (!e.pass) continue; pass++;
    const f = fundedPhase(p, r, plan);
    if (f.paid > 0) { paidN++; paidSum += f.paid; }
  }
  const pPay = paidN / N, avg = paidSum / Math.max(1, paidN);
  const ev10 = 10 * pPay * avg - 1000;
  console.log(`${name.padEnd(34)} pass ${(pass/N*100).toFixed(1).padStart(5)}%  payout|funded ${(paidN/Math.max(1,pass)*100).toFixed(1).padStart(5)}%  payout/acct ${(pPay*100).toFixed(1).padStart(5)}%  avgPay ${avg.toFixed(0).padStart(5)}  P>=1/10 ${((1-(1-pPay)**10)*100).toFixed(0).padStart(3)}%  EV10 ${ev10.toFixed(0).padStart(6)}  ROI ${((ev10+1000)/1000).toFixed(2)}x`);
}
// BIG: eval 1 trade/day sized to make +1500; funded day1 sized to +2000, then +200 days
const big = r => ({ evalDay: [1500 / r], fundBig: 2000 / r, fundDay: [200 / r], allIn: true });
// BALAS: 500 risk, 2 trades/day in both phases
const balas = { evalDay: [500, 500], fundDay: [500, 500] };
for (const [p, r] of [[.5, 1], [.52, 1], [.5, 1.5], [.52, 1.5], [.55, 1.5], [.42, 2], [.30, 3]]) {
  run(`BIG   WR ${p} RR ${r}`, p, r, big(r));
  run(`BALAS WR ${p} RR ${r}`, p, r, balas);
}

// longest losing streak in 50 trades + EV/trade
for (const [p, r] of [[.52, 1], [.52, 1.5], [.42, 2], [.30, 3]]) {
  let tot = 0; const M = 100000;
  for (let i = 0; i < M; i++) { let cur = 0, mx = 0; for (let k = 0; k < 50; k++) { if (rnd() < p) cur = 0; else { cur++; mx = Math.max(mx, cur); } } tot += mx; }
  console.log(`WR ${p} RR ${r}: EV/trade ${(p * r - (1 - p)).toFixed(2)}R  breakeven ${(100 / (1 + r)).toFixed(1)}%  longest loss streak/50 ≈ ${(tot / M).toFixed(1)}`);
}
