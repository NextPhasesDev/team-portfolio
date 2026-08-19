# Retired code

Kept out of the build, not deleted, so it can be brought back quickly.

## threejs-build.js

The 5-stage construction animation that used to sit on the homepage under
"How We Build". Removed August 2026 because the direction changed: the concept
to deployment sequence is going to be a flat, motion-graphic style piece
(Lottie or similar) rather than an architectural 3D scene.

It still works. To bring it back:

1. Move it back to the repo root.
2. Re-add the section markup to `index.html` (see the CHANGELOG entry for the
   revision that removed it, or git history).
3. Add `<script type="module" src="/threejs-build.js"></script>` before `</body>`.

The building shape is configurable via the `BUILDING` object and four presets
at the top of the file.
