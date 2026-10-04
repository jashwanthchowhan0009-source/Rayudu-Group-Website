import { BREAK, TIER } from '../config/theme.js';

/**
 * One read of what this device can comfortably do. Everything else asks
 * here instead of sprinkling media queries through the logic.
 */
export function readDevice() {
  const w = window.innerWidth;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;

  let tier = 'high';
  if (reduceMotion || cores <= 2 || mem <= 2) tier = 'low';
  else if (w <= BREAK.mobile || cores <= 4 || mem <= 4) tier = 'medium';

  return {
    width: w,
    mobile: w <= BREAK.mobile,
    tablet: w > BREAK.mobile && w <= BREAK.tablet,
    wide: w > BREAK.tablet,
    fine,
    reduceMotion,
    tier,
    budget: TIER[tier]
  };
}
