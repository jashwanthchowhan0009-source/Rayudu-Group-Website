/** Movement curve for the camera between scenes: anticipation, then settle. */
export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Arrival curve for typography: fast in, slow to rest. */
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
