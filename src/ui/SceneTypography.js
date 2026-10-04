import { TIMING } from '../config/theme.js';
import { clamp, smoothstep } from '../animation/interpolation.js';
import { easeOutCubic } from '../animation/easing.js';

/**
 * Typography is part of the composition, not a card on top of it.
 * Each scene owns a block; it enters slightly after the camera starts moving
 * and leaves before the next one arrives. Opacity + a small rise, nothing else.
 */
export class SceneTypography {
  constructor(root, scenes) {
    this.blocks = scenes.map((scene) => {
      const el = document.createElement('article');
      el.className = `scene scene--${scene.align}${scene.size ? ` scene--${scene.size}` : ''}${scene.last ? ' scene--last' : ''}`;
      el.id = `scene-${scene.id}`;
      el.style.setProperty('--line', scene.line);
      el.innerHTML = [
        `<p class="scene__eyebrow">${scene.eyebrow}</p>`,
        `<h2 class="scene__title">${scene.title}</h2>`,
        scene.note ? `<p class="scene__note">${scene.note}</p>` : '',
        `<p class="scene__body">${scene.body}</p>`,
        scene.meta ? `<ul class="scene__meta">${scene.meta.map((m) => `<li>${m}</li>`).join('')}</ul>` : '',
        scene.links ? `<p class="scene__links">${scene.links
          .map((l) => `<a href="${l.href}">${l.label}</a>`).join('')}</p>` : ''
      ].join('');
      root.appendChild(el);
      return { el, scene, shown: -1 };
    });
  }

  /**
   * `position` is the continuous scene coordinate (0 … n-1).
   * A block is fully lit at its own index and gone half a scene away.
   */
  update(position) {
    this.blocks.forEach((b, i) => {
      const d = position - i;
      let v;
      if (d >= 0) v = 1 - smoothstep(TIMING.textOutStart, TIMING.textOutEnd, d);     // leaving
      else v = easeOutCubic(smoothstep(TIMING.textInStart, TIMING.textInEnd, d));     // arriving
      v = clamp(v, 0, 1);
      if (Math.abs(v - b.shown) < 0.004) return;
      b.shown = v;
      const el = b.el;
      el.style.opacity = v.toFixed(3);
      el.style.transform = `translate3d(0, ${((1 - v) * (d > 0 ? -16 : 20)).toFixed(2)}px, 0)`;
      el.style.visibility = v < 0.01 ? 'hidden' : 'visible';
    });
  }
}
