import { TIMING } from '../config/theme.js';
import { clamp, smoothstep } from '../animation/interpolation.js';
import { easeOutCubic } from '../animation/easing.js';

/**
 * Typography is part of the composition, not a card on top of it. Blocks sit
 * BEHIND the sculpture so the eagle crosses in front of the words; only a
 * scene that needs clickable links renders in the front layer.
 * Each block enters inside the camera move and leaves before the next arrives.
 */
export class SceneTypography {
  constructor(back, front, scenes) {
    this.blocks = scenes.map((scene) => {
      const el = document.createElement('article');
      el.className = [
        'scene',
        `scene--${scene.align}`,
        scene.hero ? 'scene--hero' : '',
        scene.size ? `scene--${scene.size}` : '',
        scene.last ? 'scene--last' : ''
      ].filter(Boolean).join(' ');
      el.id = `scene-${scene.id}`;
      el.style.setProperty('--line', scene.line);

      el.innerHTML = scene.hero
        ? [
            `<p class="scene__eyebrow">${scene.eyebrow}</p>`,
            `<h1 class="hero__mark">${scene.title}</h1>`,
            `<p class="hero__claim">${scene.body}</p>`,
            `<p class="scene__body">${scene.note}</p>`
          ].join('')
        : [
            `<p class="scene__eyebrow">${scene.eyebrow}</p>`,
            `<h2 class="scene__title">${scene.title}</h2>`,
            scene.note ? `<p class="scene__note">${scene.note}</p>` : '',
            `<p class="scene__body">${scene.body}</p>`,
            scene.meta ? `<ul class="scene__meta">${scene.meta.map((m) => `<li>${m}</li>`).join('')}</ul>` : '',
            scene.links ? `<p class="scene__links">${scene.links
              .map((l) => `<a href="${l.href}">${l.label}</a>`).join('')}</p>` : ''
          ].join('');

      (scene.front ? front : back).appendChild(el);
      return { el, scene, shown: -1 };
    });
  }

  /**
   * `position` is the continuous scene coordinate (0 … n-1).
   * A block is fully lit at its own index and gone before the next arrives.
   */
  update(position) {
    this.blocks.forEach((b, i) => {
      const d = position - i;
      let v;
      if (d >= 0) v = 1 - smoothstep(TIMING.textOutStart, TIMING.textOutEnd, d);
      else v = easeOutCubic(smoothstep(TIMING.textInStart, TIMING.textInEnd, d));
      v = clamp(v, 0, 1);
      if (Math.abs(v - b.shown) < 0.004) return;
      b.shown = v;
      const el = b.el;
      el.style.opacity = v.toFixed(3);
      el.style.transform = `translate3d(0, ${((1 - v) * (d > 0 ? -26 : 34)).toFixed(2)}px, 0)`;
      el.style.visibility = v < 0.01 ? 'hidden' : 'visible';
    });
  }
}
