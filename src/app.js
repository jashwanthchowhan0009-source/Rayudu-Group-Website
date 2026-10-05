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
const typography = new SceneTypography(
  root.getElementById('scenes'),
  root.getElementById('scenesFront'),
  SCENES
);
const indicator = new SceneIndicator(root, SCENES, jump);
const navigation = new Navigation(root, SCENES, jump);
const hotspots = new Hotspots(viewer, SCENES, (id) => jump(SCENES.findIndex((s) => s.id === id)));
const eagle = new Eagle(viewer);
const pointer = new PointerController(viewer, device);

// ── loading reveal: black → atmosphere → model → light → interface ──────
const boot = root.getElementById('boot');
const bootBar = root.getElementById('bootBar');
const bootPct = root.getElementById('bootPct');
eagle.onProgress((p) => {
  bootBar.style.transform = `scaleX(${p})`;
  bootPct.textContent = `${Math.round(p * 100)}%`;
});

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

// ── sound: one click anywhere starts it, the button keeps control ───────
const audio = root.getElementById('track-audio');
const soundBtn = root.getElementById('soundBtn');
const soundLabel = root.getElementById('soundLabel');
const setSound = (on) => {
  if (on) { audio.volume = 0.42; audio.play().catch(() => {}); }
  else audio.pause();
  soundBtn.classList.toggle('is-on', on);
  soundBtn.setAttribute('aria-pressed', String(on));
  soundLabel.textContent = on ? 'Sound on' : 'Sound off';
  document.body.classList.add('sound-ready');
};
soundBtn.addEventListener('click', (e) => { e.stopPropagation(); setSound(audio.paused); });
addEventListener('pointerdown', () => { if (audio.paused && !document.body.classList.contains('sound-ready')) setSound(true); }, { once: true });

// start at the top on reload so the opening shot is always the first thing seen
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
addEventListener('load', () => { if (window.scrollY < 4) window.scrollTo(0, 0); });
