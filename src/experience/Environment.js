import { ARCS } from '../config/scenes.js';

const NS = 'http://www.w3.org/2000/svg';
const rad = (deg) => ((deg - 90) * Math.PI) / 180;
const pt = (r, deg) => [500 + r * Math.cos(rad(deg)), 500 + r * Math.sin(rad(deg))];

/**
 * Everything around the eagle: the stamp-motif rings, drifting light motes
 * and the streak accents. All of it is depth and connection — never decoration
 * for its own sake, and all of it is GPU transforms, not per-frame layout.
 */
export class Environment {
  constructor(root, device) {
    this.device = device;
    this.atmos = root.querySelector('#atmos');
    this.motes = root.querySelector('#motes');
    this.streaks = root.querySelector('#streaks');
    this.ringBase = root.querySelector('#ringBase');
    this.ringTicks = root.querySelector('#ringTicks');
    this.ringArcs = root.querySelector('#ringArcs');
    this.arcs = new Map();
    this.activeArc = null;

    document.documentElement.style.setProperty('--grain-opacity', device.budget.grain);
    this.buildRings();
    this.buildMotes();
    [...this.streaks.children].forEach((el, i) => {
      if (i >= device.budget.streaks) el.remove();
    });
  }

  buildRings() {
    [196, 300, 408].forEach((r, i) => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', 500); c.setAttribute('cy', 500); c.setAttribute('r', r);
      c.setAttribute('class', `ring ring--${i}`);
      // broken segments: a long dash with a gap, like the stamp's outline
      c.setAttribute('stroke-dasharray', i === 1 ? '140 26' : i === 2 ? '240 54' : '0');
      this.ringBase.appendChild(c);
    });

    const n = this.device.budget.ticks;
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i;
      const major = i % 6 === 0;
      const [x1, y1] = pt(major ? 318 : 324, a);
      const [x2, y2] = pt(332, a);
      const l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', x1.toFixed(1)); l.setAttribute('y1', y1.toFixed(1));
      l.setAttribute('x2', x2.toFixed(1)); l.setAttribute('y2', y2.toFixed(1));
      l.setAttribute('class', major ? 'tick tick--major' : 'tick');
      this.ringTicks.appendChild(l);
    }

    Object.entries(ARCS).forEach(([id, [r, a0, a1]]) => {
      const [x0, y0] = pt(r, a0);
      const [x1, y1] = pt(r, a1);
      const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`);
      path.setAttribute('class', 'arc');
      path.style.setProperty('--len', ((2 * Math.PI * r * Math.abs(a1 - a0)) / 360).toFixed(1));
      this.ringArcs.appendChild(path);
      this.arcs.set(id, path);
    });
  }

  buildMotes() {
    const n = this.device.budget.motes;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const el = document.createElement('i');
      const depth = 0.3 + Math.random() * 0.7;           // 0 = far, 1 = near
      el.style.setProperty('--x', `${(Math.random() * 104 - 2).toFixed(2)}%`);
      el.style.setProperty('--y', `${(Math.random() * 104 - 2).toFixed(2)}%`);
      el.style.setProperty('--s', (0.8 + depth * 2.2).toFixed(2));
      el.style.setProperty('--o', (0.08 + depth * 0.32).toFixed(2));
      el.style.setProperty('--dur', `${(16 + Math.random() * 22).toFixed(1)}s`);
      el.style.setProperty('--delay', `${(-Math.random() * 30).toFixed(1)}s`);
      el.style.setProperty('--drift', `${(Math.random() * 40 - 20).toFixed(1)}px`);
      el.dataset.depth = depth.toFixed(2);
      frag.appendChild(el);
    }
    this.motes.appendChild(frag);
  }

  /** Colour field for the current scene: accent, hairline tint and ground. */
  setAccent(color, line, bg) {
    this.atmos.style.setProperty('--accent', color);
    this.atmos.style.setProperty('--line', line);
    const root = document.documentElement.style;
    root.setProperty('--scene-accent', color);
    root.setProperty('--scene-line', line);
    if (bg) root.setProperty('--scene-bg', bg);
  }

  setArc(id, strength) {
    if (this.activeArc !== id) {
      this.arcs.forEach((p, key) => p.classList.toggle('is-active', key === id));
      this.activeArc = id;
    }
    this.ringArcs.style.opacity = strength.toFixed(3);
  }

  /** Subtle depth: the atmosphere lags behind pointer and scroll. */
  parallax(px, py, progress) {
    const d = this.device.reduceMotion ? 0 : 1;
    this.atmos.style.transform =
      `translate3d(${(px * -14 * d).toFixed(2)}px, ${(py * -10 * d - progress * 24).toFixed(2)}px, 0)`;
    this.ringArcs.parentElement.style.transform =
      `translate3d(${(px * -6 * d).toFixed(2)}px, ${(py * -4 * d).toFixed(2)}px, 0) rotate(${(progress * 6).toFixed(2)}deg)`;
  }
}
