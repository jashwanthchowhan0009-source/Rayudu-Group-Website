/**
 * WaveGallery — panels distributed along a continuous 3D curve, driven by the
 * page scroll. No libraries: one rAF loop, CSS 3D transforms, data-driven.
 *
 *   scroll  →  gallery progress  →  per-item offset  →  point on the curve
 *                                                    →  interpolated transform
 */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const damp = (c, g, hl, dt) => (hl <= 0 ? g : g + (c - g) * Math.pow(2, -dt / hl));

const LAYOUT = {
  wide:   { gapX: 25, depth: 330, lift: 13, rotY: 26, scale: 0.135, span: 3.4 },
  tablet: { gapX: 29, depth: 260, lift: 10, rotY: 22, scale: 0.15,  span: 2.9 },
  mobile: { gapX: 42, depth: 150, lift: 6,  rotY: 14, scale: 0.19,  span: 2.1 }
};

export function createWaveGallery(root, items) {
  const stage = root.querySelector('[data-wave-stage]');
  const track = root.querySelector('[data-wave-track]');
  const detail = root.querySelector('[data-wave-detail]');
  const counter = root.querySelector('[data-wave-counter]');
  const titleOut = root.querySelector('[data-wave-title]');
  const n = items.length;

  // ── build panels once ──────────────────────────────────────────────────
  const panels = items.map((item, i) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'wave__item';
    el.setAttribute('aria-label', `${item.title} — ${item.category}`);
    el.innerHTML =
      `<span class="wave__plate"><img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async"></span>` +
      `<span class="wave__cap"><em>${String(i + 1).padStart(2, '0')}</em>${item.title}</span>`;
    el.addEventListener('click', () => select(i));
    track.appendChild(el);
    return { el, item, shown: null };
  });

  // ── state ──────────────────────────────────────────────────────────────
  let progress = 0;        // damped, in item units
  let goal = 0;            // scroll-derived goal
  let selected = -1;
  let active = -1;
  let pointer = 0;
  let last = performance.now();
  let mode = pick();

  function pick() {
    const w = innerWidth;
    return w <= 720 ? LAYOUT.mobile : w <= 1080 ? LAYOUT.tablet : LAYOUT.wide;
  }

  /** Wrap an offset into [-n/2, n/2) so the ribbon never ends. */
  const wrap = (t) => {
    const h = n / 2;
    return ((((t + h) % n) + n) % n) - h;
  };

  /** A point on the curve for a wrapped offset t. */
  function place(t, L) {
    const a = t / L.span;                         // normalised along the ribbon
    const bend = Math.sin(clamp(a, -1.6, 1.6) * 1.25);
    return {
      x: t * L.gapX,
      y: (1 - Math.cos(clamp(a, -2, 2) * 1.15)) * L.lift + bend * 2.2,
      z: -Math.pow(Math.abs(t), 1.28) * L.depth + 150 * Math.max(0, 1 - Math.abs(t)),
      ry: -t * L.rotY,
      rz: bend * 1.6,
      s: Math.max(0.38, 1 - Math.abs(t) * L.scale) * (1 + Math.max(0, 1 - Math.abs(t)) * 0.14),
      o: clamp(1.18 - Math.abs(t) / (L.span + 1.1), 0, 1)
    };
  }

  function render(dt) {
    const L = mode;
    progress = damp(progress, goal, 320, dt);
    const px = pointer * (selected >= 0 ? 0 : 1);

    let bestI = 0, bestD = Infinity;
    for (let i = 0; i < n; i++) {
      const p = panels[i];
      const t = wrap(i - progress);
      const d = Math.abs(t);
      if (d < bestD) { bestD = d; bestI = i; }

      if (d > L.span + 1.6) {
        if (p.shown !== 'off') { p.el.style.visibility = 'hidden'; p.shown = 'off'; }
        continue;
      }
      const c = place(t, L);
      const focus = selected === i ? 1 : 0;
      const near = clamp(1 - d, 0, 1);
      p.el.style.visibility = 'visible';
      p.el.style.opacity = (c.o * (selected >= 0 && !focus ? 0.22 : 1)).toFixed(3);
      p.el.style.zIndex = String(600 - Math.round(d * 40));
      p.el.style.transform =
        `translate3d(calc(-50% + ${(c.x + px * 1.6 * (1 - near * 0.5)).toFixed(2)}vw), ` +
        `calc(-50% + ${(c.y + near * -0.6).toFixed(2)}vh), ${(c.z + focus * 190).toFixed(1)}px) ` +
        `rotateY(${(c.ry * (1 - focus) + px * 1.4).toFixed(2)}deg) rotateZ(${(c.rz * (1 - focus)).toFixed(2)}deg) ` +
        `scale(${(c.s * (1 + focus * 0.12)).toFixed(3)})`;
      p.el.classList.toggle('is-active', d < 0.5 && selected < 0);
      p.el.classList.toggle('is-selected', focus === 1);
      p.shown = 'on';
    }

    if (bestI !== active) {
      active = bestI;
      counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
      titleOut.textContent = items[active].title;
      if (selected < 0) fillDetail(active, false);
    }
  }

  function fillDetail(i, open) {
    const it = items[i];
    detail.querySelector('[data-k="category"]').textContent = it.category;
    detail.querySelector('[data-k="title"]').textContent = it.title;
    detail.querySelector('[data-k="description"]').textContent = it.description;
    detail.querySelector('[data-k="meta"]').innerHTML = (it.meta || []).map((m) => `<li>${m}</li>`).join('');
    detail.classList.toggle('is-open', open);
    root.classList.toggle('is-focused', open);
  }

  function select(i) {
    if (selected === i) return close();
    selected = i;
    goal = goalForIndex(i);
    syncScroll(goal);
    fillDetail(i, true);
  }
  function close() {
    selected = -1;
    fillDetail(active, false);
  }

  // ── scroll drives the ribbon ───────────────────────────────────────────
  const span = () => Math.max(1, root.offsetHeight - innerHeight);
  const goalForIndex = (i) => i;
  function syncScroll(g) {
    const y = root.offsetTop + (clamp(g, 0, n - 1) / (n - 1)) * span();
    scrollTo({ top: y, behavior: 'smooth' });
  }
  function readScroll() {
    const rel = clamp((scrollY - root.offsetTop) / span(), 0, 1);
    goal = rel * (n - 1);
  }

  addEventListener('scroll', readScroll, { passive: true });
  addEventListener('resize', () => { mode = pick(); readScroll(); }, { passive: true });
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    stage.addEventListener('pointermove', (e) => {
      pointer = (e.clientX / innerWidth - 0.5) * 2;
    }, { passive: true });
  }
  detail.querySelector('[data-wave-close]').addEventListener('click', close);
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') syncScroll(Math.round(goal) + 1);
    if (e.key === 'ArrowLeft') syncScroll(Math.round(goal) - 1);
  });

  readScroll();
  progress = goal;
  (function loop(now) {
    const dt = Math.min(50, now - last); last = now;
    render(dt);
    requestAnimationFrame(loop);
  })(performance.now());
}
