# p5-AR Helper (simple)

This workspace contains a small, lightweight AR helper library for p5.js with a demo sketch.

Files:
- `ar-lib.js` — simple AR helpers (reticle, anchors, basic placement). Uses WebXR hit-test when available, falls back to simulated mode.
- `index.html` — includes p5, p5.xr, and the library.
- `sketch.js` — demo usage: shows reticle, places anchors on tap/click, draws a model or box at anchors.
- `style.css` — full-viewport canvas styles.

How to run:
1. Serve the folder (recommended) or open `index.html` in a browser that allows local file access for media.
2. On WebXR-supported devices/browsers (e.g., ARCore on Android, ARKit on iOS), it will use real AR hit-testing. Otherwise, falls back to mouse-based simulation.

Using the library in your sketch:
- Call `AR.createARCanvas(WEBGL)` in `setup()`.
- Use `AR.getReticlePosition()` to get current reticle `{x,y,z}`.
- Call `AR.onSelect(cb)` to place anchors on tap/click; `cb` receives the anchor object.
- Use `AR.getAnchors()` and `AR.transformToAnchor(anchor, drawFunc)` to draw content at anchors.

Notes:
- This library uses p5.xr for WebXR support when available.
- Replace asset filenames in `sketch.js` with your own models/sounds.
- For production AR apps, consider more robust WebXR libraries.
