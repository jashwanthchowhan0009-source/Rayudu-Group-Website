import { clamp } from '../animation/interpolation.js';
import { easeInOutCubic } from '../animation/easing.js';
import { TIMING, SCENE_LENGTH } from '../config/theme.js';

/**
 * Turns the document scroll into a normalised 0 → 1 progress and resolves it
 * into "scene A → scene B, t". Nothing else in the app reads scrollY.
 */
export class ScrollController {
  constructor(track, count) {
    this.track = track;
    this.count = count;
    this.progress = 0;
    this.index = 0;
    this.local = 0;
    this.eased = 0;
    this.max = 1;
    this.measure();
    addEventListener('resize', () => this.measure(), { passive: true });
  }

  measure() {
    // one viewport per scene, plus a little tail so the last scene can settle
    this.track.style.height = `${this.count * SCENE_LENGTH * 100 + 24}svh`;
    this.max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  }

  /** Read once per frame. */
  sample() {
    this.progress = clamp(window.scrollY / this.max, 0, 1);
    const s = this.progress * (this.count - 1);
    this.index = Math.min(this.count - 2, Math.floor(s));
    if (this.count === 1) this.index = 0;
    this.local = clamp(s - this.index, 0, 1);
    // hold, move, hold — the scene settles before the next one starts
    const t = clamp((this.local - TIMING.holdIn) / (TIMING.holdOut - TIMING.holdIn), 0, 1);
    this.eased = easeInOutCubic(t);
    this.position = s;
    return this;
  }

  /** Which scene is "current" for UI purposes. */
  get current() {
    return Math.round(this.progress * (this.count - 1));
  }

  scrollToScene(i, behavior = 'smooth') {
    const y = (clamp(i, 0, this.count - 1) / (this.count - 1)) * this.max;
    window.scrollTo({ top: y, behavior });
  }
}
