import { damp, clamp } from '../animation/interpolation.js';
import { TIMING } from '../config/theme.js';

/**
 * Two restrained inputs:
 *   · parallax — pointer position nudges camera and atmosphere a little
 *   · influence — if the visitor drags the model, their offset is kept and
 *     then decays back to the scene camera, so the narrative always wins.
 */
export class PointerController {
  constructor(viewer, device) {
    this.viewer = viewer;
    this.device = device;
    this.x = 0; this.y = 0;        // damped pointer, -1 … 1
    this.tx = 0; this.ty = 0;      // raw target
    this.dragging = false;
    this.influence = { theta: 0, phi: 0 };
    this.captured = null;

    if (device.fine && !device.reduceMotion) {
      addEventListener('pointermove', (e) => {
        if (this.dragging) return;
        this.tx = (e.clientX / innerWidth - 0.5) * 2;
        this.ty = (e.clientY / innerHeight - 0.5) * 2;
      }, { passive: true });
    }

    viewer.addEventListener('pointerdown', () => {
      this.dragging = true;
      this.captured = null;
    });
    addEventListener('pointerup', () => { this.dragging = false; }, { passive: true });
    addEventListener('pointercancel', () => { this.dragging = false; }, { passive: true });
  }

  /** Called every frame with the camera the scene wants. */
  update(dt, sceneTheta, scenePhi) {
    this.x = damp(this.x, this.tx, 220, dt);
    this.y = damp(this.y, this.ty, 220, dt);

    if (this.dragging && this.viewer.loaded) {
      const o = this.viewer.getCameraOrbit();
      const theta = (o.theta * 180) / Math.PI;
      const phi = (o.phi * 180) / Math.PI;
      this.influence.theta = ((theta - sceneTheta + 540) % 360) - 180;
      this.influence.phi = clamp(phi - scenePhi, -26, 26);
    } else {
      this.influence.theta = damp(this.influence.theta, 0, TIMING.pointerDecay, dt);
      this.influence.phi = damp(this.influence.phi, 0, TIMING.pointerDecay, dt);
      if (Math.abs(this.influence.theta) < 0.01) this.influence.theta = 0;
      if (Math.abs(this.influence.phi) < 0.01) this.influence.phi = 0;
    }
    return this;
  }
}
