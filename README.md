# Rayudu Group — Enterprise Ecosystem

A single-screen, interactive brand experience for Rayudu Group.
Black space, one sculpted eagle, one studio light, seven business nodes.

**Built for everyday life. Inspired by tomorrow.**

## What it is

A static site. No build step, no framework, no backend, no tracking.
The eagle is a real 3D model rendered by `<model-viewer>`; each of the seven
hotspots is a **native model-viewer hotspot** anchored to a point on the
actual mesh (face, wings, claws, back, breast), so they stay attached to the
geometry through every camera move.

Selecting a node moves the camera to that part of the sculpture with a
cinematic easing (~0.8s to settle), lights the matching arc in the concentric
graphic system, dims the other nodes and opens a small information panel.

## Running it

Any static file server; the page must be served over HTTP (not `file://`)
so the model and environment can be fetched.

```bash
npx http-server -p 8080 -c-1
# or: python3 -m http.server 8080
open http://localhost:8080
```

Deploy by uploading the repository as-is (GitHub Pages, Netlify, S3, nginx).
Enable gzip/brotli — `assets/eagle.glb` and `assets/studio.hdr` compress well.

## Structure

```
index.html                 markup + model-viewer configuration + HUD
styles.css                 the whole design system
src/sectors.js             ← single source of truth: the seven sectors,
                             their copy, accents, hotspot coordinates,
                             camera views and arcs
src/app.js                 hotspot/arc/panel wiring, camera moves, parallax
assets/eagle.glb           the sculpture (70k tris, matte PBR material)
assets/studio.hdr          environment: one key light, top-right-front
assets/poster.webp         first paint, shown until the model is ready
assets/vendor/             @google/model-viewer 4.3.1 (Apache-2.0), vendored
```

### Changing content

Everything editable lives in `src/sectors.js` — names, sector lines, body
copy, the `[ Explore ]` detail lists, accent colours, hotspot positions,
per-node camera framing (`view`, `zoom`) and arc geometry.
`HERO` at the bottom of that file defines the opening shot.

### Hotspot coordinates

`position` and `normal` are in the model's own coordinate space and were
sampled from the mesh itself. They are passed straight to model-viewer as
`data-position` / `data-normal`. Do not replace them with screen coordinates.

## Notes

- Lighting is image-based: a single soft key from top-right-front with an
  almost black ambient fill, so the eagle emerges from darkness. Tune it by
  regenerating `assets/studio.hdr`, not by adding lights.
- The model never auto-rotates. Mouse parallax is capped at ~1.7° and stops
  as soon as the visitor takes control of the camera.
- Reduced-motion, keyboard focus, touch and AR entry are all handled.
- Contact: hello@rayudugroup.in · +91 99857 22289
- Operations: Anantapur, Andhra Pradesh (India) · Sheridan, Wyoming (USA)
