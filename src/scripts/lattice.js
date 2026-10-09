// Hero animation, a 24-second loop:
//   1. Cubic CsPbI3 rotates while an iodine vacancy hops between sites.
//   2. The lattice comes apart and reassembles as a single MoS2 layer (S-Mo-S),
//      with the atoms that were Cs now sitting on its surface as Pt adatoms.
//   3. A sulfur atom leaves, and the Pt adatoms migrate and cluster at the vacancy.
//   4. Everything comes apart again and rebuilds the perovskite.
// It is an illustration: paths and timings are for show, not simulation results.
//
// Atom bookkeeping: 27 Pb -> 27 Mo, 54 I -> 54 S (27 columns x 2 layers), 8 Cs -> 8 Pt.

const el = document.getElementById('lattice');
if (el) start(el);

function start(root) {
  const host = root.closest('.hero-visual') || root.parentElement;
  const css = getComputedStyle(document.documentElement);
  const COLOR = {
    accent: css.getPropertyValue('--accent').trim() || '#1f4fd8',
    ink: css.getPropertyValue('--ink').trim() || '#0e1116',
    cs: '#8f9bab',
    pt: '#d9731a',
  };

  // ---------- small helpers ----------
  const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
  const ease = (t) => { t = clamp01(t); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  const rgb = (hex) => { const n = parseInt(hex.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const mix = (c1, c2, t) => `rgb(${[0, 1, 2].map((i) => Math.round(lerp(c1[i], c2[i], t))).join(',')})`;
  let seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const sortBy = (arr, key) => arr.slice().sort((p, q) => key(p) - key(q));
  const spatialKey = (p) => p[0] * 100 + p[2] * 10 + p[1];

  // ---------- phase A: cubic CsPbI3 ----------
  const pbSites = [], ioSites = [], csSites = [], bondsA = [];
  const axes = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) {
    const p = [i, j, k];
    pbSites.push(p);
    axes.forEach((d, n) => {
      if (p[n] < 1) {
        bondsA.push([p, [i + d[0], j + d[1], k + d[2]]]);
        ioSites.push([i + d[0] / 2, j + d[1] / 2, k + d[2] / 2]);
      }
    });
  }
  for (const a of [-0.5, 0.5]) for (const b of [-0.5, 0.5]) for (const c of [-0.5, 0.5]) csSites.push([a, b, c]);

  // ---------- phase B: one MoS2 layer, Pt above it ----------
  const A_MO = 0.58;                 // Mo-Mo distance in drawing units
  const S_DY = 0.27;                 // S layers above and below the Mo plane (screen y grows downward)
  const a1 = [A_MO, 0], a2 = [A_MO / 2, (A_MO * Math.sqrt(3)) / 2];
  const sOff = [(a1[0] + a2[0]) / 3, (a1[1] + a2[1]) / 3];
  const moCand = [], sCand = [];
  for (let m = -8; m <= 8; m++) for (let n = -8; n <= 8; n++) {
    const x = m * a1[0] + n * a2[0], z = m * a1[1] + n * a2[1];
    moCand.push([x, z]);
    sCand.push([x + sOff[0], z + sOff[1]]);
  }
  const centre = [sOff[0] / 2, sOff[1] / 2];
  const byDist = (p) => Math.hypot(p[0] - centre[0], p[1] - centre[1]) + Math.atan2(p[1], p[0]) * 1e-4;
  const moXZ = sortBy(moCand, byDist).slice(0, 27);
  const sXZ = sortBy(sCand, byDist).slice(0, 27);
  const mid = [...moXZ, ...sXZ].reduce((acc, p) => [acc[0] + p[0] / 54, acc[1] + p[1] / 54], [0, 0]);
  const moSites = moXZ.map((p) => [p[0] - mid[0], 0, p[1] - mid[1]]);
  const sSites = [];
  sXZ.forEach((p) => {
    sSites.push([p[0] - mid[0], -S_DY, p[1] - mid[1]]);
    sSites.push([p[0] - mid[0], S_DY, p[1] - mid[1]]);
  });
  const bondsB = [];
  moSites.forEach((mo) => sSites.forEach((s) => {
    if (Math.hypot(mo[0] - s[0], mo[2] - s[2]) < (A_MO / Math.sqrt(3)) * 1.05) bondsB.push([mo, s]);
  }));

  // The S atom that leaves: top layer, near the middle of the flake.
  const vacTop = sortBy(sSites.filter((s) => s[1] < 0), (s) => Math.hypot(s[0] - 0.12, s[2] - 0.08))[0];
  const vacTopXZ = [vacTop[0], vacTop[2]];

  // Pt adatoms scattered on the top surface, then the cluster at the vacancy.
  const ptGas = Array.from({ length: 8 }, (_, k) => {
    const ang = (k / 8) * Math.PI * 2 + 0.3;
    const r = 0.6 + (0.6 * ((k * 5) % 3)) / 2;
    return [vacTopXZ[0] + r * Math.cos(ang), -S_DY - 0.3, vacTopXZ[1] + r * Math.sin(ang)];
  });
  const R1 = 0.19, H = 0.17;
  const ptCluster = [[vacTop[0], vacTop[1], vacTop[2]]];
  for (const layer of [1, 2]) for (let k = 0; k < 3; k++) {
    const th = (k * 2 * Math.PI) / 3 + (layer === 2 ? Math.PI / 3 : 0);
    ptCluster.push([vacTop[0] + R1 * Math.cos(th), vacTop[1] - layer * H, vacTop[2] + R1 * Math.sin(th)]);
  }
  ptCluster.push([vacTop[0], vacTop[1] - 3 * H, vacTop[2]]);

  // ---------- pair every atom with its place in both phases ----------
  const atoms = [];
  const pair = (fromSites, toSites, kind, cA, cB, sA, sB) => {
    const from = sortBy(fromSites, spatialKey), to = sortBy(toSites, spatialKey);
    from.forEach((p, i) => {
      const th = rand() * Math.PI * 2, ph = Math.acos(2 * rand() - 1), mag = 0.6 + 0.5 * rand();
      atoms.push({
        kind, A: p, B: to[i], cA: rgb(cA), cB: rgb(cB), sA, sB,
        dir: [mag * Math.sin(ph) * Math.cos(th), mag * Math.cos(ph), mag * Math.sin(ph) * Math.sin(th)],
        delay: rand(),
      });
    });
  };
  pair(csSites, ptGas, 'cs', COLOR.cs, COLOR.pt, 5.4, 3.8);
  pair(pbSites, moSites, 'pb', COLOR.ink, COLOR.ink, 3.6, 3.4);
  pair(ioSites, sSites, 'io', COLOR.accent, COLOR.accent, 2.6, 2.4);
  const ioAtoms = atoms.filter((a) => a.kind === 'io');
  const ptAtoms = atoms.filter((a) => a.kind === 'cs');
  ptAtoms.forEach((a, k) => { a.C = ptCluster[k]; });
  const leaver = ioAtoms.find((a) => a.B === vacTop);

  // Iodine neighbours in the perovskite: sites on the same PbI6 octahedron.
  const nbrs = new Map(ioAtoms.map((s) => [s, ioAtoms.filter((t) => {
    const d2 = (s.A[0] - t.A[0]) ** 2 + (s.A[1] - t.A[1]) ** 2 + (s.A[2] - t.A[2]) ** 2;
    return d2 > 0.4 && d2 < 0.6;
  })]));
  let vac = ioAtoms.find((a) => a.A[0] === 0.5 && a.A[1] === 0 && a.A[2] === 0);

  // ---------- DOM ----------
  const make = (cls) => { const d = document.createElement('div'); d.className = cls; root.appendChild(d); return d; };
  const bondElsA = bondsA.map(() => make('bond'));
  const bondElsB = bondsB.map(() => make('bond'));
  atoms.forEach((a) => { a.el = make('atom'); });
  const ringEls = [make('ring'), make('ring')];

  // ---------- projection ----------
  let ct = 1, st = 0, cx = 1, sx = 0;
  const proj = (p) => {
    const x = p[0] * ct + p[2] * st;
    const z0 = -p[0] * st + p[2] * ct;
    const y = p[1] * cx - z0 * sx;
    const z = p[1] * sx + z0 * cx;
    const k = 1 / (1 - z * 0.11);
    return { x: 50 + 21 * x * k, y: 50 + 21 * y * k, z, k };
  };
  const depth = (z) => clamp01((z + 1.74) / 3.48);
  const show = (d, on) => { d.style.display = on ? '' : 'none'; };
  // alpha: overall visibility; solid: skip the depth fade (for the atom being watched).
  const place = (d, p, size, alpha, solid = false) => {
    if (alpha <= 0.01) { show(d, false); return; }
    show(d, true);
    const r = proj(p);
    d.style.left = r.x.toFixed(2) + '%';
    d.style.top = r.y.toFixed(2) + '%';
    d.style.width = (size * r.k).toFixed(2) + '%';
    d.style.opacity = (alpha * (solid ? 1 : 0.45 + 0.55 * depth(r.z))).toFixed(2);
    d.style.zIndex = Math.round((r.z + 3) * 100) + 1;
  };
  const drawBonds = (list, els, alpha, weight) => list.forEach((b, n) => {
    const d = els[n];
    const a = weight ? alpha * weight(b) : alpha;
    if (a <= 0.01) { show(d, false); return; }
    show(d, true);
    const p1 = proj(b[0]), p2 = proj(b[1]);
    const dx = p2.x - p1.x, dy = p2.y - p1.y;
    d.style.left = ((p1.x + p2.x) / 2).toFixed(2) + '%';
    d.style.top = ((p1.y + p2.y) / 2).toFixed(2) + '%';
    d.style.width = Math.hypot(dx, dy).toFixed(2) + '%';
    d.style.opacity = (a * (0.1 + 0.25 * depth((p1.z + p2.z) / 2))).toFixed(2);
    d.style.transform = `translate(-50%, -50%) rotate(${((Math.atan2(dy, dx) * 180) / Math.PI).toFixed(2)}deg)`;
  });

  // ---------- timeline (seconds) ----------
  const T = { a: 9, t1: 3, b: 9, t2: 3 };
  const CYCLE = T.a + T.t1 + T.b + T.t2;
  const B0 = T.a + T.t1, T2 = B0 + T.b;
  const HOP = 0.9, WAIT = 1.3;
  let hopFrom = null, hopT0 = 0, prevVac = null;

  // Where an iodine sits in phase A, including one that may be hopping into the vacancy.
  function ioPosA(a, tau) {
    if (a !== hopFrom) return a.A;
    const u = clamp01((tau - hopT0) / HOP), e = ease(u);
    const p = a.A, q = vac.A;
    const bulge = 0.5 * Math.sin(Math.PI * u);
    return [0, 1, 2].map((c) => { const m = (p[c] + q[c]) / 2; return p[c] + (q[c] - p[c]) * e + (m - Math.round(m)) * bulge; });
  }

  function updateHops(tau) {
    if (tau >= T.a) { hopFrom = null; return; }
    if (hopFrom) {
      if (tau - hopT0 >= HOP) { prevVac = vac; vac = hopFrom; hopFrom = null; hopT0 = tau; }
    } else if (tau - hopT0 > WAIT && tau < T.a - HOP - 0.3) {
      let opts = nbrs.get(vac).filter((t) => t !== prevVac);
      if (!opts.length) opts = nbrs.get(vac);
      hopFrom = opts[Math.floor(Math.random() * opts.length)];
      hopT0 = tau;
    }
  }

  // Phase B: the leaving S atom and the Pt atoms.
  const LEAVE = [B0 + 1, 1.2];           // start, duration
  const GATHER = [B0 + 2.4, 1.0, 0.18];  // start, duration per atom, stagger
  const leaverAway = (t) => [vacTop[0] + 0.25 * t, vacTop[1] - 1.7 * t, vacTop[2] - 0.15 * t];
  function bState(a, tau) {
    if (a === leaver) {
      const q = ease((tau - LEAVE[0]) / LEAVE[1]);
      return { p: leaverAway(q), alpha: 1 - q };
    }
    if (a.kind === 'cs') {
      const k = ptAtoms.indexOf(a);
      const q = ease((tau - GATHER[0] - k * GATHER[2]) / GATHER[1]);
      const p = lerp3(a.B, a.C, q);
      p[1] += 0.05 * Math.sin(tau * 2 + k) * (1 - q) - 0.15 * Math.sin(Math.PI * q);
      return { p, alpha: 1 };
    }
    return { p: a.B, alpha: 1 };
  }
  // How far the scene is from the perovskite look (0) to the MoS2 look (1).
  const blend = (tau) => (tau < T.a ? 0 : tau < B0 ? ease((tau - T.a) / T.t1) : tau < T2 ? 1 : 1 - ease((tau - T2) / T.t2));

  function draw(tau, angle) {
    ct = Math.cos(angle); st = Math.sin(angle);
    const b = blend(tau);
    // Negative tilt looks down slightly from above; the MoS2 layer is seen from the side at about 27 degrees.
    const tilt = lerp(-0.42, -0.48, b);
    cx = Math.cos(tilt); sx = Math.sin(tilt);
    host.dataset.phase = b < 0.5 ? 'a' : 'b';

    let bondA = 0, bondB = 0;
    if (tau < T.a) {
      bondA = 1;
      const u = hopFrom ? clamp01((tau - hopT0) / HOP) : 0;
      atoms.forEach((a) => {
        a.el.style.background = mix(a.cA, a.cA, 0);
        if (a.kind !== 'io') { place(a.el, a.A, a.sA, 1); return; }
        if (a === hopFrom) place(a.el, ioPosA(a, tau), a.sA + 1.2 * Math.sin(Math.PI * u), 1, true);
        else place(a.el, a.A, a.sA, a === vac ? 0 : 1);
      });
      const e = ease(u);
      place(ringEls[0], vac.A, 3.4, hopFrom ? 1 - e : 1, true);
      place(ringEls[1], hopFrom ? hopFrom.A : vac.A, 3.4, hopFrom ? e : 0, true);
    } else if (tau < B0 || tau >= T2) {
      // Transitions: every atom flies out and lands at its other place, staggered.
      const toB = tau < B0;
      const p = toB ? (tau - T.a) / T.t1 : (tau - T2) / T.t2;
      bondA = toB ? 1 - ease(p * 2.5) : ease(p * 2.5 - 1.5);
      bondB = toB ? ease(p * 2.5 - 1.5) : 1 - ease(p * 2.5);
      atoms.forEach((a) => {
        const q = clamp01((p - a.delay * 0.35) / 0.65), e = ease(q);
        let from, to, alpha = 1;
        if (toB) {
          from = a.A; to = a.B;
          if (a === vac) alpha = e;                      // the missing iodine comes back
        } else {
          from = bState(a, T2).p; to = a.A;
          if (a === leaver) alpha *= e;                  // the S that left comes back
          if (a === vac) alpha *= 1 - e;                 // the iodine vacancy reopens
        }
        const pos = lerp3(from, to, e);
        const fly = Math.sin(Math.PI * q);
        place(a.el, [pos[0] + a.dir[0] * fly, pos[1] + a.dir[1] * fly, pos[2] + a.dir[2] * fly],
          lerp(toB ? a.sA : a.sB, toB ? a.sB : a.sA, e), alpha);
        a.el.style.background = mix(toB ? a.cA : a.cB, toB ? a.cB : a.cA, e);
      });
      place(ringEls[0], vac.A, 3.4, toB ? 1 - ease(p * 3) : ease(p * 3 - 2), true);
      show(ringEls[1], false);
    } else {
      bondB = 1;
      atoms.forEach((a) => {
        const s = bState(a, tau);
        a.el.style.background = mix(a.cB, a.cB, 0);
        place(a.el, s.p, a.sB, s.alpha, a.kind === 'cs' || a === leaver);
      });
      const appear = ease((tau - LEAVE[0]) / (LEAVE[1] * 0.6));
      const filled = ease((tau - GATHER[0]) / GATHER[1]);
      place(ringEls[0], vacTop, 3.0, appear * (1 - filled), true);
      show(ringEls[1], false);
    }
    const leaveQ = tau >= B0 && tau < T2 ? ease((tau - LEAVE[0]) / LEAVE[1]) : 0;
    drawBonds(bondsA, bondElsA, bondA);
    drawBonds(bondsB, bondElsB, bondB, (bd) => (bd[1] === vacTop ? 1 - leaveQ : 1));
  }

  let angle = 0.6;
  draw(0, angle);
  // For checking a given moment of the loop by hand: lattice.drawAt(seconds).
  root.drawAt = (tau, ang = angle) => { hopFrom = null; draw(tau, ang); };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let last = 0, start0 = 0, prevTau = 0;
  function step(now) {
    requestAnimationFrame(step);
    if (!last) { last = now; start0 = now; return; }
    if (now - last < 16) return;
    angle += Math.min(now - last, 100) * 0.00025;
    last = now;
    const tau = ((now - start0) / 1000) % CYCLE;
    if (tau < prevTau) { hopT0 = 0; hopFrom = null; }   // a new loop has started
    prevTau = tau;
    updateHops(tau);
    draw(tau, angle);
  }
  requestAnimationFrame(step);
}
