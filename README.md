# Rayudu Group — Enterprise Ecosystem

One continuous 3D scene. Black space, a sculpted eagle lit by a warm key and a
cool bounce, and ten scroll-driven scene states that carry the group's
businesses. Scroll is the interaction; there are no sections.

**Built for everyday life. Inspired by tomorrow.**

## What it is

A static site — no build step, no framework, no backend, no tracking.
`<model-viewer>` keeps its native rendering pipeline; everything around it is
plain ES modules and CSS.

Scrolling never just moves the page: it advances a normalised progress value
that interpolates camera, typography, lighting, hotspot state and the
environment from one declarative scene state into the next.

```
USER INPUT ↓ scroll / pointer / touch
SCENE STATE ↓ camera + eagle + environment + typography
NEXT SCENE
```

## Running it

Serve over HTTP (not `file://`) so the model and environment can be fetched.

```bash
npx http-server -p 8080 -c-1
# or: python3 -m http.server 8080
open http://localhost:8080
```

Deploy the repository as-is (GitHub Pages, Netlify, S3, nginx) and enable
gzip/brotli — `assets/eagle.glb` and `assets/studio.hdr` compress well.

## Architecture

```
index.html                      shell: 3D world, UI layer, scroll track
styles.css                      the design system in one place
src/
  config/
    theme.js                    colour, timing, breakpoints, device budgets
    scenes.js                   ← the whole experience, declared
  animation/
    easing.js  interpolation.js lerp / lerpAngle / damp / smoothstep
  interaction/
    ScrollController.js         scrollY → normalised progress → scene A→B, t
    PointerController.js        parallax + decaying user camera influence
    DeviceController.js         one capability read: tier, motion, pointer
  experience/
    SceneManager.js             the single frame loop
    CameraController.js         damped camera, writes only when it changed
    Eagle.js                    model-viewer wrapper (load, exposure, shadow)
    Hotspots.js                 native hotspots, 4 states
    Environment.js              stamp rings, light motes, streaks, parallax
  ui/
    SceneTypography.js          per-scene headline blocks
    SceneIndicator.js           progress rail, counter, scroll cue
    Navigation.js               the index panel
assets/
  eagle.glb                     the sculpture (70k tris, matte PBR)
  studio.hdr                    warm key upper-left + cool bounce lower-right
  poster.webp  fonts/  vendor/  first paint, Playfair Display, model-viewer
```

### Changing the experience

Almost everything lives in `src/config/scenes.js`: the scene order, the copy,
the accent colours, the camera state for each scene and the hotspot
coordinates. Add a scene to the array and the scroll length, the rail, the
index and the counter all follow.

```js
{
  id: 'ronohub',
  hotspot: 'hotspot-2',                 // node that becomes ACTIVE here
  camera: { theta, phi, radius, target },
  shift: 0.34,                          // push the sculpture clear of the type
  accent: COLOR.blue, line: TINT.blue,
  eyebrow, title, body, meta
}
```

`camera.radius` is a fraction of model-viewer's own framing distance, so every
viewport frames the sculpture correctly. `camera.target` is baked 60% of the
way from the hero target to the hotspot, so the camera always lands on real
geometry.

### Hotspots

`position` / `normal` in `scenes.js` were sampled from the mesh itself and are
passed straight to model-viewer as `data-position` / `data-normal`. They are
never screen coordinates, and they are authoritative — do not convert them.

### Colour

Black is the environment, white is the structure, and one accent speaks at a
time: blue for intelligence and technology, red and coral for logistics,
burgundy for energy, purple for media and wellness, navy for depth. The accent
is a registered custom property, so a scene change cross-fades the colour
instead of snapping.

### Lighting

Image-based, from `assets/studio.hdr`: a warm coral/amber key from the upper
left, a cool indigo bounce from the lower right, a faint neutral top light and
an almost-black ambient. Regenerate the file rather than adding lights — the
generator lives in the commit history of this change.

### Performance

- One `requestAnimationFrame` loop. The camera writes to model-viewer only
  when a value actually moved, so a settled scene costs no renders.
- Motes, streaks, grain and rings are GPU transforms and CSS animations; the
  only per-frame JS is interpolation.
- `DeviceController` picks a budget (`high` / `medium` / `low`) from viewport,
  cores, memory and `prefers-reduced-motion`, and the environment is built to
  that budget. Reduced motion drops the atmosphere entirely and makes camera
  moves near-instant.

### Accessibility

Keyboard scrolling, focusable hotspots and rail, visible focus rings, an index
panel that reaches every scene plus the contact details, `aria-live` on the
scene region, and a controlled fallback if the 3D asset fails: branding,
typography, navigation and content all remain.

## Content

Copy, addresses and brand descriptions are Rayudu Group's own, from
rayudugroup.in. Nothing here is invented.

- hello@rayudugroup.in · +91 99857 22289
- India — 6/5/989, Srinagar Colony, Anantapur, Andhra Pradesh 515002
- USA — 30 N Gould St, Suite R, Sheridan, Wyoming 82801
