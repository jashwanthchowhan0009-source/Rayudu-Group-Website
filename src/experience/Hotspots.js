import { HOTSPOTS } from '../config/scenes.js';

/**
 * Native model-viewer hotspots with four states:
 *   IDLE → HOVER → ACTIVE → INACTIVE
 * Positions come from the mesh, so they stay attached through every move.
 */
export class Hotspots {
  constructor(viewer, scenes, onSelect) {
    this.viewer = viewer;
    this.items = new Map();
    this.active = null;

    HOTSPOTS.forEach((h) => {
      const scene = scenes.find((s) => s.id === h.scene);
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'hotspot';
      el.slot = h.slot;
      el.dataset.position = h.position;
      el.dataset.normal = h.normal;
      el.dataset.id = h.scene;
      el.dataset.visibilityAttribute = 'visible';
      el.setAttribute('aria-label', `${scene.label} — ${scene.eyebrow}`);
      el.style.setProperty('--line', scene.line);
      el.innerHTML =
        '<span class="hotspot__pulse"></span>' +
        '<span class="hotspot__ring"></span>' +
        '<span class="hotspot__dot"></span>' +
        '<span class="hotspot__connector"></span>' +
        `<span class="hotspot__label">${h.label}</span>`;
      el.addEventListener('click', (e) => { e.stopPropagation(); onSelect(h.scene); });
      viewer.appendChild(el);
      this.items.set(h.scene, el);
    });
  }

  /** `id` active, everything else inactive; null means all idle. */
  setActive(id) {
    if (this.active === id) return;
    this.active = id;
    this.items.forEach((el, key) => {
      el.classList.toggle('is-active', key === id);
      el.classList.toggle('is-inactive', id !== null && key !== id);
    });
  }

  /** Flip labels to the left when a node sits near the right edge. */
  updateSides(stageWidth) {
    const edge = stageWidth * 0.6;
    this.items.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      el.dataset.side = r.left + r.width / 2 > edge ? 'left' : 'right';
    });
  }
}
