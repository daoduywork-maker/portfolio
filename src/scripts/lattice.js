// Rotating cubic CsPbI3 lattice with one iodine vacancy that hops between sites.
// This is an illustration: the hop path and timing are for show, not NEB results.

const el = document.getElementById('lattice');
if (el) start(el);

function start(root) {
  const css = getComputedStyle(document.documentElement);
  const accent = css.getPropertyValue('--accent').trim() || '#1f4fd8';
  const ink = css.getPropertyValue('--ink').trim() || '#0e1116';

  // Sites: Pb on a 3x3x3 grid, I at the midpoint of every Pb-Pb edge, Cs at cell centres.
  const pb = [], io = [], cs = [], bonds = [];
  const axes = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) {
    const p = [i, j, k];
    pb.push(p);
    axes.forEach((d, n) => {
      if (p[n] < 1) {
        bonds.push([p, [i + d[0], j + d[1], k + d[2]]]);
        io.push([i + d[0] / 2, j + d[1] / 2, k + d[2] / 2]);
      }
    });
  }
  for (const a of [-0.5, 0.5]) for (const b of [-0.5, 0.5]) for (const c of [-0.5, 0.5]) cs.push([a, b, c]);

  // Iodine neighbours: sites on the same PbI6 octahedron (distance sqrt(1/2)).
  const nbrs = io.map((s) =>
    io.map((t, idx) => {
      const d2 = (s[0] - t[0]) ** 2 + (s[1] - t[1]) ** 2 + (s[2] - t[2]) ** 2;
      return d2 > 0.4 && d2 < 0.6 ? idx : -1;
    }).filter((idx) => idx >= 0)
  );

  const make = (cls, n, color) =>
    Array.from({ length: n }, () => {
      const d = document.createElement('div');
      d.className = cls;
      if (color) d.style.background = color;
      root.appendChild(d);
      return d;
    });
  const bondEls = make('bond', bonds.length);
  const csEls = make('atom', cs.length, '#8f9bab');
  const pbEls = make('atom', pb.length, ink);
  const ioEls = make('atom', io.length, accent);
  const ringEls = make('ring', 2);

  const tilt = 0.42, cx = Math.cos(tilt), sx = Math.sin(tilt);
  let ct = 1, st = 0;
  const proj = (p) => {
    const x = p[0] * ct + p[2] * st;
    const z0 = -p[0] * st + p[2] * ct;
    const y = p[1] * cx - z0 * sx;
    const z = p[1] * sx + z0 * cx;
    const k = 1 / (1 - z * 0.11);
    return { x: 50 + 21 * x * k, y: 50 + 21 * y * k, z, k };
  };
  const depth = (z) => Math.max(0, Math.min(1, (z + 1.74) / 3.48));
  const place = (d, r, size, opacity) => {
    d.style.left = r.x.toFixed(2) + '%';
    d.style.top = r.y.toFixed(2) + '%';
    d.style.width = (size * r.k).toFixed(2) + '%';
    d.style.opacity = opacity.toFixed(2);
    d.style.zIndex = Math.round((r.z + 2) * 100) + 1;
  };

  let vac = io.findIndex((s) => s[0] === 0.5 && s[1] === 0 && s[2] === 0);
  let from = -1, prev = -1, u = 0;

  function draw(angle) {
    ct = Math.cos(angle); st = Math.sin(angle);
    const e = u * u * (3 - 2 * u);

    bonds.forEach((b, n) => {
      const p1 = proj(b[0]), p2 = proj(b[1]);
      const dx = p2.x - p1.x, dy = p2.y - p1.y;
      const d = bondEls[n];
      d.style.left = ((p1.x + p2.x) / 2).toFixed(2) + '%';
      d.style.top = ((p1.y + p2.y) / 2).toFixed(2) + '%';
      d.style.width = Math.hypot(dx, dy).toFixed(2) + '%';
      d.style.opacity = (0.1 + 0.25 * depth((p1.z + p2.z) / 2)).toFixed(2);
      d.style.transform = `translate(-50%, -50%) rotate(${(Math.atan2(dy, dx) * 180 / Math.PI).toFixed(2)}deg)`;
    });
    cs.forEach((s, n) => { const r = proj(s); place(csEls[n], r, 5.4, 0.45 + 0.55 * depth(r.z)); });
    pb.forEach((s, n) => { const r = proj(s); place(pbEls[n], r, 3.6, 0.45 + 0.55 * depth(r.z)); });

    io.forEach((s, n) => {
      const d = ioEls[n];
      if (n === vac) { d.style.display = 'none'; return; }
      d.style.display = '';
      if (n === from) {
        // The hopping atom follows a path that bows away from the shared Pb.
        const a = io[from], b = io[vac];
        const bulge = 0.5 * Math.sin(Math.PI * u);
        const pos = [0, 1, 2].map((c) => {
          const mid = (a[c] + b[c]) / 2;
          return a[c] + (b[c] - a[c]) * e + (mid - Math.round(mid)) * bulge;
        });
        place(d, proj(pos), 2.6 + 1.2 * Math.sin(Math.PI * u), 1);
      } else {
        const r = proj(s);
        place(d, r, 2.6, 0.45 + 0.55 * depth(r.z));
      }
    });

    place(ringEls[0], proj(io[vac]), 3.4, from < 0 ? 1 : 1 - e);
    if (from >= 0) { ringEls[1].style.display = ''; place(ringEls[1], proj(io[from]), 3.4, e); }
    else ringEls[1].style.display = 'none';
  }

  let angle = 0.6;
  draw(angle);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let last = 0, t0 = 0;
  function step(now) {
    requestAnimationFrame(step);
    if (!last) { last = now; t0 = now; return; }
    if (now - last < 16) return;
    angle += Math.min(now - last, 100) * 0.00025;
    last = now;
    if (from < 0) {
      u = 0;
      if (now - t0 > 1300) {
        let opts = nbrs[vac].filter((i) => i !== prev);
        if (!opts.length) opts = nbrs[vac];
        from = opts[Math.floor(Math.random() * opts.length)];
        t0 = now;
      }
    } else {
      u = (now - t0) / 900;
      if (u >= 1) { prev = vac; vac = from; from = -1; u = 0; t0 = now; }
    }
    draw(angle);
  }
  requestAnimationFrame(step);
}
