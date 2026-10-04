/**
 * Thin wrapper around <model-viewer>. We keep its native rendering pipeline —
 * it is enough for this scene — and only drive camera, exposure and state.
 */
export class Eagle {
  constructor(viewer) {
    this.viewer = viewer;
    this.loaded = false;
    this.failed = false;
    this.exposure = parseFloat(viewer.getAttribute('exposure')) || 0.56;

    this.ready = new Promise((resolve) => {
      if (viewer.loaded) { this.loaded = true; return resolve(true); }
      viewer.addEventListener('load', () => { this.loaded = true; resolve(true); }, { once: true });
      viewer.addEventListener('error', () => { this.failed = true; resolve(false); }, { once: true });
      // never hang the interface on a stalled asset
      setTimeout(() => resolve(this.loaded), 20000);
    });
  }

  onProgress(fn) {
    this.viewer.addEventListener('progress', (e) => fn(e.detail.totalProgress));
  }

  /** Slow, intentional exposure moves between scenes — never a flash. */
  setExposure(value) {
    const v = Math.round(value * 1000) / 1000;
    if (v === this.exposure) return;
    this.exposure = v;
    this.viewer.exposure = v;
  }

  setShadow(value) {
    const v = Math.round(value * 100) / 100;
    if (v === this._shadow) return;
    this._shadow = v;
    this.viewer.shadowIntensity = v;
  }
}
