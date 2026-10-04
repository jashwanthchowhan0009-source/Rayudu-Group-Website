export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export const lerp = (a, b, t) => a + (b - a) * t;

/** Interpolate degrees along the shortest arc. */
export function lerpAngle(a, b, t) {
  let d = ((b - a + 540) % 360) - 180;
  return a + d * t;
}

/** Frame-rate independent damping. `halfLife` in ms. */
export function damp(current, goal, halfLife, dt) {
  if (halfLife <= 0) return goal;
  return goal + (current - goal) * Math.pow(2, -dt / halfLife);
}

/** 0 below edge0, 1 above edge1, smooth between. */
export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export const mapRange = (v, inA, inB, outA, outB) =>
  outA + ((clamp(v, inA, inB) - inA) / (inB - inA)) * (outB - outA);
