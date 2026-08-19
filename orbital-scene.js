// NextPhases -- Orbital background scene
// =============================================================================
// A slowly turning moon rock with fine debris orbiting it. Deliberately
// desaturated and low-contrast so it reads as the old moon backdrop with real
// depth, rather than as a bright 3D planet.
//
// TO REVERT: set ENABLED to false below. The original 2D #moonCanvas animation
// is untouched and takes back over immediately. Nothing else needs changing.
//
// TUNING: everything visual is in CONFIG. The most useful knobs are
//   opacity        overall presence. Lower is subtler.
//   roughness      surface relief. 0 is a smooth ball, 0.3 is a rugged rock.
//   debrisCount    how many specks orbit the rock.
//   accentStrength how much of the page accent colour tints the rim light.
// =============================================================================

const ENABLED = true;

const THREE_URL = 'https://unpkg.com/three@0.160.1/build/three.module.js';

const CONFIG = {
    opacity: 0.55,           // whole scene, matches the old canvas presence
    radius: 1.75,
    roughness: 0.16,         // vertex displacement, gives it a rocky silhouette
    tilt: 0.34,
    spin: 0.010,             // radians per second. Slow.
    cameraDistance: 6.4,
    fov: 34,

    // Position in frame as a fraction of the viewport. Kept off-centre so it
    // sits behind and beside the hero text rather than under it.
    anchorX: 0.72,
    anchorY: 0.40,

    pointerTilt: 0.08,
    accentStrength: 0.5,

    debrisCount: 90,         // fine specks orbiting the rock
    debrisSpread: 1.5,       // how far out the debris field reaches
    dustCount: 260,          // faint distant motes

    ringEnabled: false,      // no Saturn ring; it read as too sci-fi

    // MOON PHASES.
    // The sun orbits the rock rather than the rock being lit from a fixed side,
    // so the visible lit fraction waxes and wanes exactly as a real moon does.
    // phaseCycle is how many seconds one full new-to-full-to-new cycle takes.
    phaseCycle: 150,
    phaseTilt: 0.22,         // how far the sun rides above the orbital plane
    sunDistance: 9
};

// Only the rim light and debris pick up page colour. The rock stays grey.
const ACCENTS = {
    home:         0x14b8a6,
    services:     0x38bdf8,
    portfolio:    0xf4c542,
    pricing:      0x22c55e,
    about:        0xa78bfa,
    contact:      0x14b8a6,
    testimonials: 0xf4c542,
    blog:         0xe8965a,
    games:        0xa78bfa,
    legal:        0x94a3b8
};

function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function webglAvailable() {
    try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext &&
            (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

// Cheap value noise. Deterministic, so the rock looks the same every load.
function hashNoise(x, y, z) {
    const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return s - Math.floor(s);
}

async function main() {
    if (!ENABLED) return;
    if (!webglAvailable()) return;

    const host = document.querySelector('.background-animation');
    if (!host) return;

    let THREE;
    try {
        THREE = await import(/* @vite-ignore */ THREE_URL);
    } catch (e) {
        return; // 2D moon canvas stays visible
    }

    const page = document.body.getAttribute('data-page') || 'home';
    const accent = ACCENTS[page] || ACCENTS.home;
    const reduced = prefersReducedMotion();

    const legacy = document.getElementById('moonCanvas');

    const canvas = document.createElement('canvas');
    canvas.className = 'orbital-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.opacity = String(CONFIG.opacity);
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CONFIG.fov, 1, 0.1, 120);
    camera.position.set(0, 0, CONFIG.cameraDistance);

    const renderer = new THREE.WebGLRenderer({
        canvas, antialias: true, alpha: true, powerPreference: 'low-power'
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const pivot = new THREE.Group();
    scene.add(pivot);

    // ------------------------------------------------------------- lighting --
    // Cool ambient plus one hard key light. That contrast is what makes it read
    // as rock lit by a distant sun rather than a shaded ball.
    scene.add(new THREE.AmbientLight(0x2a3f57, 0.55));

    // Orbiting sun. Its angle is what produces the phase.
    const key = new THREE.DirectionalLight(0xdfe9f7, 1.7);
    key.position.set(-CONFIG.sunDistance, 2.6, 3.0);
    scene.add(key);

    const rim = new THREE.PointLight(accent, 1.5 * CONFIG.accentStrength, 16);
    rim.position.set(3.6, -1.0, -2.4);
    scene.add(rim);

    // ------------------------------------------------------------ the rock --
    const rockGroup = new THREE.Group();
    rockGroup.rotation.z = CONFIG.tilt;
    pivot.add(rockGroup);

    // Displace an icosphere so the silhouette is irregular, like a real body
    const geo = new THREE.IcosahedronGeometry(CONFIG.radius, 24);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).normalize();
        const big = hashNoise(Math.round(v.x * 3), Math.round(v.y * 3), Math.round(v.z * 3));
        const fine = hashNoise(Math.round(v.x * 11), Math.round(v.y * 11), Math.round(v.z * 11));
        const d = 1 + (big - 0.5) * CONFIG.roughness + (fine - 0.5) * CONFIG.roughness * 0.35;
        v.multiplyScalar(CONFIG.radius * d);
        pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();

    const rock = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        color: 0x8f9aa8,          // grey stone, not a colour
        roughness: 1,
        metalness: 0,
        flatShading: true          // faceted, catches the light like rock
    }));
    rockGroup.add(rock);

    // A very faint accent rim so it ties into the page without colouring the body
    const halo = new THREE.Mesh(
        new THREE.SphereGeometry(CONFIG.radius * 1.10, 40, 40),
        new THREE.MeshBasicMaterial({
            color: accent,
            transparent: true,
            opacity: 0.055 * CONFIG.accentStrength,
            side: THREE.BackSide
        })
    );
    pivot.add(halo);

    // ------------------------------------------------------------- debris ---
    // Small specks on their own inclined orbits. This is the detail that makes
    // the rock feel like it is somewhere rather than floating in a void.
    const debris = [];
    const debrisGeo = new THREE.TetrahedronGeometry(0.028, 0);
    const debrisMat = new THREE.MeshStandardMaterial({
        color: 0xaab4c2, roughness: 1, metalness: 0
    });
    const debrisAccentMat = new THREE.MeshBasicMaterial({
        color: accent, transparent: true, opacity: 0.7
    });

    for (let i = 0; i < CONFIG.debrisCount; i++) {
        const useAccent = i % 9 === 0;
        const m = new THREE.Mesh(debrisGeo, useAccent ? debrisAccentMat : debrisMat);
        const scale = 0.4 + hashNoise(i, 1, 2) * 1.5;
        m.scale.setScalar(scale);

        const orbit = new THREE.Group();
        orbit.rotation.x = (hashNoise(i, 3, 4) - 0.5) * Math.PI;
        orbit.rotation.z = (hashNoise(i, 5, 6) - 0.5) * 0.9;
        orbit.add(m);
        pivot.add(orbit);

        debris.push({
            mesh: m,
            orbit: orbit,
            distance: CONFIG.radius * (1.25 + hashNoise(i, 7, 8) * CONFIG.debrisSpread),
            speed: 0.05 + hashNoise(i, 9, 10) * 0.22,
            phase: hashNoise(i, 11, 12) * Math.PI * 2,
            tumble: 0.3 + hashNoise(i, 13, 14) * 1.2
        });
    }

    // -------------------------------------------------------------- dust ----
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(CONFIG.dustCount * 3);
    for (let i = 0; i < CONFIG.dustCount; i++) {
        const r = 12 + hashNoise(i, 21, 22) * 26;
        const theta = hashNoise(i, 23, 24) * Math.PI * 2;
        const phi = Math.acos(2 * hashNoise(i, 25, 26) - 1);
        dustPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        dustPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        dustPos[i * 3 + 2] = r * Math.cos(phi);
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
        color: 0xc9d6e6, size: 0.09, sizeAttenuation: true,
        transparent: true, opacity: 0.5
    }));
    scene.add(dust);

    // ------------------------------------------------------------- layout ---
    function resize() {
        const w = host.clientWidth || window.innerWidth;
        const h = host.clientHeight || window.innerHeight;
        // Layout is not always resolved on DOMContentLoaded; retry until it is.
        if (!w || !h) { requestAnimationFrame(resize); return; }

        renderer.setSize(w, h, false);
        camera.aspect = w / h;

        const narrow = Math.min(1, w / 1100);
        camera.position.z = CONFIG.cameraDistance + (1 - narrow) * 3.2;

        camera.setViewOffset(
            w, h,
            (CONFIG.anchorX - 0.5) * -w,
            (CONFIG.anchorY - 0.5) * -h,
            w, h
        );
        camera.updateProjectionMatrix();
    }

    if (window.ResizeObserver) new ResizeObserver(resize).observe(host);
    else window.addEventListener('resize', resize);
    resize();
    window.addEventListener('load', resize);

    // ------------------------------------------------------------ pointer ---
    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    if (!reduced && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', function (e) {
            targetX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetY = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });
    }

    // --------------------------------------------------------- theme sync ---
    // The theme is resolved by script.js after this module runs, and "system"
    // mode is only expanded then. So never bail on theme at startup: build the
    // scene, then show or hide it whenever data-theme settles or changes.
    function isDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    let visible = false;
    function syncTheme() {
        const dark = isDark();
        if (dark === visible) return;
        visible = dark;
        canvas.style.display = dark ? 'block' : 'none';
        if (legacy) legacy.style.display = dark ? 'none' : '';
        if (dark) clock.getDelta();
    }

    new MutationObserver(syncTheme).observe(document.documentElement, {
        attributes: true, attributeFilter: ['data-theme']
    });

    // ------------------------------------------------------------ animation --
    const clock = new THREE.Clock();
    let onScreen = true;
    let raf = null;

    function frame() {
        raf = requestAnimationFrame(frame);
        if (!visible || !onScreen) return;

        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.getElapsedTime();

        // Walk the sun around the rock so the terminator sweeps across the face.
        // Starting at 0.62 puts it near a waxing gibbous on load, which reads as
        // a moon rather than as a half-lit ball.
        const phase = ((t / CONFIG.phaseCycle) + 0.62) * Math.PI * 2;
        key.position.set(
            Math.cos(phase) * CONFIG.sunDistance,
            Math.sin(phase * 0.5) * CONFIG.sunDistance * CONFIG.phaseTilt,
            Math.sin(phase) * CONFIG.sunDistance
        );

        if (!reduced) {
            rockGroup.rotation.y += CONFIG.spin * dt * 60 * 0.016;
            dust.rotation.y += dt * 0.003;

            debris.forEach(function (d) {
                const a = t * d.speed + d.phase;
                d.mesh.position.set(Math.cos(a) * d.distance, 0, Math.sin(a) * d.distance);
                d.mesh.rotation.x += dt * d.tumble;
                d.mesh.rotation.y += dt * d.tumble * 0.7;
            });
        }

        curX += (targetX - curX) * 0.045;
        curY += (targetY - curY) * 0.045;
        pivot.rotation.y = curX * CONFIG.pointerTilt;
        pivot.rotation.x = curY * CONFIG.pointerTilt * 0.6;

        renderer.render(scene, camera);
    }

    if (window.IntersectionObserver) {
        const io = new IntersectionObserver(function (entries) {
            onScreen = entries[0].isIntersecting;
            if (onScreen) clock.getDelta();
        }, { threshold: 0 });
        io.observe(host);
    }

    document.addEventListener('visibilitychange', function () {
        onScreen = !document.hidden;
        if (onScreen) clock.getDelta();
    });

    syncTheme();
    // The theme toggle resolves "system" shortly after load, so check again.
    setTimeout(syncTheme, 300);
    frame();

    window.addEventListener('pagehide', function () {
        if (raf) cancelAnimationFrame(raf);
        renderer.dispose();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
