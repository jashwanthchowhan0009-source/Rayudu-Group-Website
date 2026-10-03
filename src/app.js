import { SECTORS, HERO } from './sectors.js';

const DEG = 180 / Math.PI;
const mv = document.getElementById('viewer');
const stage = document.getElementById('stage');
const panel = document.getElementById('panel');
const arcsEl = document.getElementById('ringArcs');
const directory = document.getElementById('directory');
const directoryBtn = document.getElementById('directoryBtn');
const resetBtn = document.getElementById('resetBtn');
const hint = document.getElementById('hint');
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const vec = (s) => s.split(/\s+/).map(parseFloat);

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

const nodes = new Map();      // id -> { sector, hotspot, arc, entry }
let heroRadius = 2.4;         // resolved after load
let base = { theta: HERO.theta, phi: HERO.phi, radius: heroRadius };
let selected = null;
let manual = false;           // user took over the camera
let dragging = false;

/* ---------------------------------------------------------------- build */

const svgNS = 'http://www.w3.org/2000/svg';

function arcPath(r, a0, a1) {
  const pt = (a) => {
    const t = (a - 90) / DEG;
    return [(500 + r * Math.cos(t)).toFixed(2), (500 + r * Math.sin(t)).toFixed(2)];
  };
  const [x0, y0] = pt(a0);
  const [x1, y1] = pt(a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return { d: `M${x0} ${y0}A${r} ${r} 0 ${large} 1 ${x1} ${y1}`, len: 2 * Math.PI * r * Math.abs(a1 - a0) / 360 };
}

const directoryList = document.getElementById('directoryList');

SECTORS.forEach((s) => {
  // --- native model-viewer hotspot -------------------------------------
  const hotspot = document.createElement('button');
  hotspot.className = 'hotspot';
  hotspot.slot = s.slot;
  hotspot.dataset.position = s.position;
  hotspot.dataset.normal = s.normal;
  hotspot.dataset.id = s.id;
  hotspot.dataset.visibilityAttribute = 'visible';
  hotspot.type = 'button';
  hotspot.setAttribute('aria-label', `${s.name} — ${s.sector}`);
  hotspot.style.setProperty('--accent', s.accent);
  hotspot.style.setProperty('--accent-line', s.accentLine);
  hotspot.innerHTML =
    '<span class="hotspot__ring"></span><span class="hotspot__dot"></span>' +
    '<span class="hotspot__line"></span>' +
    `<span class="hotspot__label">${s.label}</span>`;
  hotspot.addEventListener('click', (e) => { e.stopPropagation(); select(s.id); });
  mv.appendChild(hotspot);

  // --- concentric arc ---------------------------------------------------
  const { d, len } = arcPath(s.arc[0], s.arc[1], s.arc[2]);
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', d);
  path.style.setProperty('--len', len.toFixed(1));
  path.style.setProperty('--accent-line', s.accentLine);
  arcsEl.appendChild(path);

  // --- directory entry --------------------------------------------------
  const li = document.createElement('li');
  const entry = document.createElement('button');
  entry.type = 'button';
  entry.textContent = s.name;
  entry.addEventListener('click', () => {
    select(s.id);
    if (!finePointer) closeDirectory();
  });
  li.appendChild(entry);
  directoryList.appendChild(li);

  nodes.set(s.id, { sector: s, hotspot, arc: path, entry });
});

/* ------------------------------------------------------------- camera */

function orbit(theta, phi, radius) {
  base = { theta, phi, radius };
  mv.cameraOrbit = `${theta.toFixed(2)}deg ${phi.toFixed(2)}deg ${radius.toFixed(3)}m`;
}

function viewFor(s) {
  let theta, phi;
  if (s.view) {
    [theta, phi] = s.view;
  } else {
    const [nx, ny, nz] = vec(s.normal);
    theta = Math.atan2(nx, nz) * DEG;
    phi = Math.acos(clamp(ny, -1, 1)) * DEG;
  }
  const fit = innerWidth > 860 ? 1 : 1.18;
  return { theta, phi: clamp(phi, 52, 84), radius: heroRadius * (s.zoom || 0.9) * fit };
}

function goHero() {
  mv.cameraTarget = HERO.target;
  orbit(HERO.theta, HERO.phi, heroRadius);
  manual = false;
}

/* ---------------------------------------------------------- selection */

function select(id) {
  const node = nodes.get(id);
  if (!node) return;
  if (selected === id) { deselect(); return; }
  selected = id;
  const s = node.sector;

  const [px, py, pz] = vec(s.position);
  const [hx, hy, hz] = vec(HERO.target);
  const v = viewFor(s);
  const t = 0.42;

  // Slide the look-at point sideways so the eagle sits clear of the panel.
  const th = v.theta / DEG;
  const wide = innerWidth > 860;
  const shift = wide ? 0.26 : 0;
  const tx = hx + (px - hx) * t + Math.cos(th) * shift;
  const tz = hz + (pz - hz) * t - Math.sin(th) * shift;
  const ty = clamp(hy + (py - hy) * t - (wide ? 0 : 0.16), 0.42, 1.04);
  mv.cameraTarget = `${tx.toFixed(3)}m ${ty.toFixed(3)}m ${tz.toFixed(3)}m`;
  orbit(v.theta, v.phi, v.radius);
  manual = false;

  nodes.forEach((n, key) => {
    n.hotspot.classList.toggle('is-active', key === id);
    n.hotspot.classList.toggle('is-dim', key !== id);
    n.arc.classList.toggle('is-active', key === id);
    n.entry.classList.toggle('is-active', key === id);
  });

  document.body.classList.add('is-selected');
  panel.style.setProperty('--accent', s.accent);
  panel.style.setProperty('--accent-line', s.accentLine);
  document.getElementById('panelName').textContent = s.name;
  document.getElementById('panelSector').textContent = s.sector;
  document.getElementById('panelBody').textContent = s.body;

  const detail = document.getElementById('panelDetail');
  detail.innerHTML = s.detail.map((d) => `<li>${d}</li>`).join('');
  detail.hidden = true;
  const cta = document.getElementById('panelCta');
  cta.textContent = '[ Explore ]';
  cta.setAttribute('aria-expanded', 'false');

  panel.hidden = false;
  requestAnimationFrame(() => panel.classList.add('is-open'));
  hint.hidden = true;
  resetBtn.hidden = false;
  updateLabelSides();
}

function deselect() {
  if (!selected) return;
  selected = null;
  nodes.forEach((n) => {
    n.hotspot.classList.remove('is-active', 'is-dim');
    n.arc.classList.remove('is-active');
    n.entry.classList.remove('is-active');
  });
  document.body.classList.remove('is-selected');
  panel.classList.remove('is-open');
  setTimeout(() => { if (!selected) panel.hidden = true; }, 600);
  hint.hidden = false;
  resetBtn.hidden = true;
  goHero();
}

/* -------------------------------------------------------------- HUD */

function closeDirectory() {
  directory.classList.remove('is-open');
  directoryBtn.setAttribute('aria-expanded', 'false');
  setTimeout(() => { if (!directory.classList.contains('is-open')) directory.hidden = true; }, 450);
}
function openDirectory() {
  directory.hidden = false;
  requestAnimationFrame(() => directory.classList.add('is-open'));
  directoryBtn.setAttribute('aria-expanded', 'true');
}
directoryBtn.addEventListener('click', () => {
  directory.classList.contains('is-open') ? closeDirectory() : openDirectory();
});

resetBtn.addEventListener('click', deselect);
document.getElementById('panelClose').addEventListener('click', deselect);
document.getElementById('panelCta').addEventListener('click', (e) => {
  const detail = document.getElementById('panelDetail');
  const open = detail.hidden;
  detail.hidden = !open;
  e.currentTarget.textContent = open ? '[ Collapse ]' : '[ Explore ]';
  e.currentTarget.setAttribute('aria-expanded', String(open));
});
addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (directory.classList.contains('is-open')) closeDirectory();
  else deselect();
});

/* --------------------------------------------- label side / collision */

let labelFrame = 0;
function updateLabelSides() {
  cancelAnimationFrame(labelFrame);
  labelFrame = requestAnimationFrame(() => {
    const edge = stage.clientWidth * 0.62;
    nodes.forEach((n) => {
      const r = n.hotspot.getBoundingClientRect();
      if (!r.width) return;
      n.hotspot.dataset.side = r.left + r.width / 2 > edge ? 'left' : 'right';
    });
  });
}

/* -------------------------------------------------------- interaction */

mv.addEventListener('camera-change', (e) => {
  if (e.detail && e.detail.source === 'user-interaction') manual = true;
  updateLabelSides();
});
mv.addEventListener('pointerdown', () => { dragging = true; });
addEventListener('pointerup', () => { dragging = false; });

if (finePointer && !reduceMotion) {
  let px = 0, py = 0, queued = false;
  const AMP_T = 1.7, AMP_P = 1.1;
  addEventListener('pointermove', (e) => {
    if (dragging || manual) return;
    px = (e.clientX / innerWidth - 0.5) * 2;
    py = (e.clientY / innerHeight - 0.5) * 2;
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      if (dragging || manual) return;
      mv.cameraOrbit =
        `${(base.theta + px * AMP_T).toFixed(2)}deg ${clamp(base.phi + py * AMP_P, 26, 94).toFixed(2)}deg ${base.radius.toFixed(3)}m`;
    });
  }, { passive: true });
}

/* -------------------------------------------------------------- load */

mv.addEventListener('progress', (e) => {
  const p = e.detail.totalProgress;
  loaderBar.style.width = `${Math.round(p * 100)}%`;
  if (p === 1) loader.classList.add('is-done');
});

mv.addEventListener('load', () => {
  mv.cameraTarget = HERO.target;
  mv.jumpCameraToGoal();
  requestAnimationFrame(() => {
    heroRadius = mv.getCameraOrbit().radius * (innerWidth > 860 ? 1 : 1.04);
    mv.cameraOrbit = `${HERO.theta}deg ${HERO.phi}deg ${heroRadius.toFixed(3)}m`;
    mv.jumpCameraToGoal();
    base = { theta: HERO.theta, phi: HERO.phi, radius: heroRadius };
    document.body.classList.add('is-ready');
    updateLabelSides();
  });
}, { once: true });

addEventListener('resize', updateLabelSides, { passive: true });
