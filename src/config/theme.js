/**
 * One place for colour, timing and breakpoints.
 * The palette is the Rayudu Group identity used as a controlled material
 * system: black is the environment, white is structure, and the three
 * chromatic accents only ever appear one at a time.
 */
export const COLOR = {
  black:   '#000000',
  ink:     '#070709',
  white:   '#F5F5F2',
  blue:    '#1674B9',
  red:     '#D83A32',
  coral:   '#FF5A3C',
  burgundy:'#A6322A',
  purple:  '#4A2148',
  navy:    '#101B3D'
};

/** Legible 1px-stroke / small-type tints of each accent on pure black. */
export const TINT = {
  blue:    '#5FA8E0',
  azure:   '#8FC2EC',
  red:     '#F0796E',
  coral:   '#FF8A72',
  burgundy:'#D4705F',
  purple:  '#A96FA0',
  rose:    '#C98FB4',
  white:   '#F5F5F2',
  navy:    '#7C8AC8'
};

export const TIMING = {
  /** camera damping half-life, ms — higher is heavier */
  cameraDamp: 240,
  /** how much of a scene window is movement vs. hold (0–0.5 each side) */
  holdIn: 0.18,
  holdOut: 0.82,
  /** typography hands over inside the camera move: the outgoing block clears
   *  before the incoming one arrives, measured in scene units */
  textOutStart: 0.18,
  textOutEnd: 0.52,
  textInStart: -0.60,
  textInEnd: -0.18,
  pointerDecay: 1200
};

export const BREAK = { mobile: 720, tablet: 1080 };

/** Environment budget per capability tier. */
export const TIER = {
  high:   { motes: 28, streaks: 3, ticks: 72, grain: 0.055 },
  medium: { motes: 16, streaks: 2, ticks: 48, grain: 0.045 },
  low:    { motes: 0,  streaks: 1, ticks: 0,  grain: 0.03 }
};
