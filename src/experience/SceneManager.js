import { CameraController } from './CameraController.js';
import { clamp, lerp, smoothstep } from '../animation/interpolation.js';
import { TIMING } from '../config/theme.js';

const DEG = Math.PI / 180;

/**
 * The single frame loop. It reads scroll + pointer, resolves the scene state
 * and pushes it into camera, typography, environment and hotspots.
 * Everything else is declarative.
 */
export class SceneManager {
  constructor({ scenes, scroll, pointer, eagle, hotspots, environment, typography, indicator, navigation, device }) {
    this.scenes = scenes;
    this.scroll = scroll;
    this.pointer = pointer;
    this.eagle = eagle;
    this.hotspots = hotspots;
    this.env = environment;
    this.type = typography;
    this.indicator = indicator;
    this.nav = navigation;
    this.device = device;
    this.camera = new CameraController(eagle.viewer);
    this.index = -1;
    this.last = performance.now();
    this.sideTimer = 0;
  }

  /** Scene camera → world camera, including composition shift and device fit. */
  stateFor(scene) {
    const c = scene.camera;
    const fit = this.device.mobile ? 1.2 : this.device.tablet ? 1.08 : 1;
    const shift = this.device.wide ? scene.shift : 0;
    const th = c.theta * DEG;
    const target = [
      c.target[0] + Math.cos(th) * shift,
      clamp(c.target[1] - (this.device.wide ? 0 : this.device.mobile ? 0.24 : 0.14), 0.26, 1.1),
      c.target[2] - Math.sin(th) * shift
    ];
    return { theta: c.theta, phi: c.phi, radius: c.radius * fit, target };
  }

  start() {
    this.states = this.scenes.map((s) => this.stateFor(s));
    addEventListener('resize', () => {
      this.states = this.scenes.map((s) => this.stateFor(s));
    }, { passive: true });

    const s = this.scroll.sample();
    this.camera.snap(CameraController.blend(this.states[s.index], this.states[s.index + 1] || this.states[s.index], s.eased));
    this.loop(performance.now());
  }

  loop = (now) => {
    const dt = Math.min(50, now - this.last);
    this.last = now;

    const s = this.scroll.sample();
    const a = this.states[s.index];
    const b = this.states[Math.min(this.states.length - 1, s.index + 1)];
    const goal = CameraController.blend(a, b, s.eased);

    // pointer: a small, decaying influence over the scene camera
    const p = this.pointer.update(dt, goal.theta, goal.phi);
    const amp = this.device.reduceMotion ? 0 : 1;
    goal.theta += p.influence.theta + p.x * 1.6 * amp;
    goal.phi = clamp(goal.phi + p.influence.phi + p.y * 1.0 * amp, 20, 100);

    this.camera.update(goal, dt, this.device.reduceMotion ? 60 : TIMING.cameraDamp);
    this.type.update(s.position);
    this.env.parallax(p.x, p.y, s.progress);

    // how settled this scene is: 1 while holding, 0 mid-transition
    const settle = 1 - smoothstep(0.04, 0.42, Math.abs(s.position - Math.round(s.position)));
    const current = this.scenes[s.current];

    this.env.setArc(current.id, settle * 0.62);
    this.hotspots.setActive(settle > 0.35 ? (current.hotspot ? current.id : null) : null);
    this.eagle.setExposure(lerp(0.5, 0.6, settle));

    if (s.current !== this.index) {
      this.index = s.current;
      this.env.setAccent(current.accent, current.line);
      this.indicator.update(s.current, s.progress);
      this.nav.mark(s.current);
      document.body.dataset.scene = current.id;
    } else {
      this.indicator.update(s.current, s.progress);
    }

    this.sideTimer += dt;
    if (this.sideTimer > 140) {
      this.sideTimer = 0;
      this.hotspots.updateSides(innerWidth);
    }

    requestAnimationFrame(this.loop);
  };
}
