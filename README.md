# Rayudu Group — Enterprise Ecosystem

One continuous 3D scene. A sculpted eagle finished in an iridescent gradient,
standing on a lit ground plane inside a colour field that changes with the
story, and ten scroll-driven scene states that carry the group's businesses.
Scroll is the interaction; there are no sections. The typography sits behind
the sculpture, so the eagle crosses in front of the words.

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
  eagle.glb                     the sculpture (70k tris) with baked vertex
                                colour and its own ground disc
  studio.hdr                    warm key upper-left + cool bounce lower-right
  poster.webp  fonts/  vendor/  first paint, Poppins + Inter, model-viewer
about.html  page.css          the About page, same studio, laid out to read
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

### The studio

One crimson studio holds the whole site: a radial backdrop from #A81C1C at the
centre, falling to burned burgundy and pitch wine at the corners, with dense
film grain over it (overlay blend), floating emissive light batons at ~42°,
drifting embers, and the words RAYUDU GROUP set massive in near-black behind
the sculpture. The same field carries the About page.

### Colour

Each scene owns a colour field: a `bg` that fills the frame and an `accent`
that glows behind the sculpture and tints the arc, the hotspot ring and the
small type — blue for intelligence and technology, red and coral for
logistics, burgundy for energy, purple for media and wellness. Both are
registered custom properties, so a scene change cross-fades instead of
snapping, and the vignette keeps the edges black.

The sculpture carries baked vertex colour — coral and magenta through violet
to electric blue and cyan at the wing tips, on a dark graphite pedestal — with
scattered bright facets for glint. The material is half-metal at low roughness,
so the key light and the batons read as highlights travelling over it.

### Standing on something

The model carries a ground disc at its base that takes model-viewer's cast
shadow and fades out at the rim, so the eagle is grounded rather than
floating. `FRAME` in `theme.js` pulls the framing back to compensate for the
wider bounding box.

### Lighting

Image-based, from `assets/studio.hdr`: a warm coral/amber key from the upper
left, a cool indigo bounce from the lower right, a faint neutral top light and
an almost-black ambient. Regenerate the file rather than adding lights — the
generator lives in the commit history of this change.

### Type and layering

Poppins for display, Inter for everything else. Scene blocks render *inside*
the stage, underneath the model-viewer canvas, so the sculpture occludes them;
a scene that needs clickable links (Connect) renders in the front layer
instead. `shift` in each scene state decides how much of the block the
sculpture is allowed to cross.

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

Keyboard scrolling, focusable hotspots, rail and scene switcher, visible focus
rings, a full-screen menu that reaches every page and scene plus the contact
details, `aria-live` on the
scene region, and a controlled fallback if the 3D asset fails: branding,
typography, navigation and content all remain.

## The rest of the site

The menu lists Home, About, Our Brands, Careers, Gallery and Contact Us.
Home and Contact Us move inside the experience, About is `about.html` in the
same language, and the remaining three link out to the existing
rayudugroup.in pages until they are rebuilt. Change the targets in `PAGES`
in `src/config/scenes.js`.

## Content

Copy, addresses and brand descriptions are Rayudu Group's own, from
rayudugroup.in. Nothing here is invented.

- hello@rayudugroup.in · +91 99857 22289
- India — 6/5/989, Srinagar Colony, Anantapur, Andhra Pradesh 515002
- USA — 30 N Gould St, Suite R, Sheridan, Wyoming 82801
