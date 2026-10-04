import { SCENES } from './config/scenes.js';
import { readDevice } from './interaction/DeviceController.js';
import { ScrollController } from './interaction/ScrollController.js';
import { PointerController } from './interaction/PointerController.js';
import { Environment } from './experience/Environment.js';
import { Hotspots } from './experience/Hotspots.js';
import { Eagle } from './experience/Eagle.js';
import { SceneManager } from './experience/SceneManager.js';
import { SceneTypography } from './ui/SceneTypography.js';
import { SceneIndicator } from './ui/SceneIndicator.js';
import { Navigation } from './ui/Navigation.js';

const root = document;
const viewer = root.getElementById('viewer');
const device = readDevice();
document.documentElement.dataset.tier = device.tier;

const scroll = new ScrollController(root.getElementById('track'), SCENES.length);
const jump = (i) => scroll.scrollToScene(i);

const environment = new Environment(root, device);
const typography = new SceneTypography(root.getElementById('scenes'), SCENES);
const indicator = new SceneIndicator(root, SCENES, jump);
const navigation = new Navigation(root, SCENES, jump);
const hotspots = new Hotspots(viewer, SCENES, (id) => jump(SCENES.findIndex((s) => s.id === id)));
const eagle = new Eagle(viewer);
const pointer = new PointerController(viewer, device);

// ── loading reveal: black → atmosphere → model → light → interface ──────
const boot = root.getElementById('boot');
const bootBar = root.getElementById('bootBar');
eagle.onProgress((p) => { bootBar.style.transform = `scaleX(${p})`; });

const reveal = () => {
  document.body.classList.remove('is-booting');
  document.body.classList.add('is-live');
  setTimeout(() => boot.remove(), 1200);
};

eagle.ready.then((ok) => {
  if (!ok) document.body.classList.add('is-fallback');
  // the environment is already breathing; let it read for a beat, then reveal
  setTimeout(reveal, 260);
  scroll.measure();
  new SceneManager({
    scenes: SCENES, scroll, pointer, eagle, hotspots,
    environment, typography, indicator, navigation, device
  }).start();
});

// start at the top on reload so the opening shot is always the first thing seen
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
addEventListener('load', () => { if (window.scrollY < 4) window.scrollTo(0, 0); });
