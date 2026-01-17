# p5-AR Helper (simple)

This workspace contains a small, lightweight AR helper library for p5.js with a demo sketch.

Files:
- `ar-lib.js` — simple AR helpers (reticle, anchors, basic placement). Works as a WebXR fallback for demos.
- `index.html` — includes p5 and the library.
- `sketch.js` — demo usage: shows reticle, places anchors on tap/click, draws a model or box at anchors.
- `style.css` — full-viewport canvas styles.

How to run:
1. Serve the folder (recommended) or open `index.html` in a browser that allows local file access for media.

Using the library in your sketch:
- Call `AR.createARCanvas(WEBGL)` in `setup()`.
- Use `AR.getReticlePosition()` to get current reticle `{x,y,z}`.
- Call `AR.onSelect(cb)` to place anchors on tap/click; `cb` receives the anchor object.
- Use `AR.getAnchors()` and `AR.transformToAnchor(anchor, drawFunc)` to draw content at anchors.

Notes:
- This library is a fallback/demo helper and does not replace a full WebXR implementation. If you want WebXR hit-testing, integrate a proper WebXR library and adapt the AR API.
- Replace asset filenames in `sketch.js` with your own models/sounds.
