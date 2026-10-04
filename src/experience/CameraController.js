import { damp, lerp, lerpAngle } from '../animation/interpolation.js';
import { TIMING } from '../config/theme.js';

/**
 * Owns the camera. Receives a goal state every frame, damps towards it so
 * movement has anticipation and settle, and writes to model-viewer only when
 * something actually changed.
 */
export class CameraController {
  constructor(viewer) {
    this.viewer = viewer;
    this.state = null;
    this.lastWritten = null;
  }

  /** Blend two scene camera states. Radius is a fraction of model-viewer's
   *  own framing distance, so every viewport frames the sculpture correctly. */
  static blend(a, b, t) {
    return {
      theta: lerpAngle(a.theta, b.theta, t),
      phi: lerp(a.phi, b.phi, t),
      radius: lerp(a.radius, b.radius, t),
      target: [
        lerp(a.target[0], b.target[0], t),
        lerp(a.target[1], b.target[1], t),
        lerp(a.target[2], b.target[2], t)
      ]
    };
  }

  snap(goal) {
    this.state = {
      theta: goal.theta, phi: goal.phi, radius: goal.radius,
      target: goal.target.slice()
    };
    this.write(true);
    try { this.viewer.jumpCameraToGoal(); } catch { /* model not ready — the goal still applies */ }
  }

  update(goal, dt, halfLife = TIMING.cameraDamp) {
    if (!this.state) return this.snap(goal);
    const s = this.state;
    s.theta = damp(s.theta, s.theta + (((goal.theta - s.theta + 540) % 360) - 180), halfLife, dt);
    s.phi = damp(s.phi, goal.phi, halfLife, dt);
    s.radius = damp(s.radius, goal.radius, halfLife, dt);
    for (let i = 0; i < 3; i++) s.target[i] = damp(s.target[i], goal.target[i], halfLife, dt);
    this.write();
  }

  write(force = false) {
    const s = this.state;
    const l = this.lastWritten;
    const moved = force || !l ||
      Math.abs(s.theta - l.theta) > 0.012 ||
      Math.abs(s.phi - l.phi) > 0.012 ||
      Math.abs(s.radius - l.radius) > 0.0004 ||
      Math.abs(s.target[0] - l.target[0]) > 0.0008 ||
      Math.abs(s.target[1] - l.target[1]) > 0.0008 ||
      Math.abs(s.target[2] - l.target[2]) > 0.0008;
    if (!moved) return;
    this.viewer.cameraOrbit = `${s.theta.toFixed(3)}deg ${s.phi.toFixed(3)}deg ${(s.radius * 100).toFixed(3)}%`;
    this.viewer.cameraTarget = `${s.target[0].toFixed(4)}m ${s.target[1].toFixed(4)}m ${s.target[2].toFixed(4)}m`;
    this.lastWritten = { theta: s.theta, phi: s.phi, radius: s.radius, target: s.target.slice() };
  }
}
