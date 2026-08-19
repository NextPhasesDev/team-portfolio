// NextPhases -- 5-stage construction visualisation
// =============================================================================
// Self-contained ES module. Loads Three.js from CDN, renders into #buildCanvas.
// Does not touch #moonCanvas, .orbital-canvas, or any other canvas on the site.
//
// ---------------------------------------------------------------------------
// HOW TO CHANGE THE BUILDING
// ---------------------------------------------------------------------------
// Everything about the structure is controlled by BUILDING below. Set
// BUILDING.preset to one of the names in PRESETS, or edit a preset's numbers.
//
//   preset: 'tower'    slender high-rise, stepped setbacks, spire      (default)
//   preset: 'campus'   low spread-out blocks, closer to an office park
//   preset: 'terrace'  wide stepped terraces, like a stadium or terrace block
//   preset: 'monolith' single bold slab, minimal, most abstract
//
// Per-preset knobs:
//   levels        how many storeys
//   levelHeight   height of one storey
//   width / depth footprint at ground level
//   setback       how much each storey shrinks (0 = straight sides)
//   twist         degrees each storey rotates (0 = aligned, 4 = subtle spiral)
//   podium        wider base block under the tower
//   fins          vertical mullions on the facade
//   crown         spire / mast on the roof
//   satellites    smaller outbuildings around the main structure
// =============================================================================

const CANVAS_ID = 'buildCanvas';
const THREE_URL = 'https://unpkg.com/three@0.160.1/build/three.module.js';

const PRESETS = {
    tower: {
        levels: 7, levelHeight: 0.46, width: 1.9, depth: 1.6,
        setback: 0.055, twist: 3, podium: true, fins: true, crown: true,
        satellites: 2, cameraDistance: 8.6, cameraHeight: 3.4
    },
    campus: {
        levels: 3, levelHeight: 0.5, width: 2.8, depth: 2.2,
        setback: 0.02, twist: 0, podium: true, fins: false, crown: false,
        satellites: 4, cameraDistance: 9.4, cameraHeight: 3.6
    },
    terrace: {
        levels: 5, levelHeight: 0.42, width: 3.0, depth: 2.4,
        setback: 0.16, twist: 0, podium: false, fins: false, crown: false,
        satellites: 2, cameraDistance: 9.0, cameraHeight: 3.2
    },
    monolith: {
        levels: 4, levelHeight: 0.62, width: 1.6, depth: 1.6,
        setback: 0, twist: 0, podium: false, fins: true, crown: true,
        satellites: 0, cameraDistance: 8.0, cameraHeight: 3.0
    }
};

const BUILDING = Object.assign({ preset: 'tower' }, PRESETS.tower);

const TEAL = 0x14b8a6;
const GOLD = 0xf4c542;

const AUTO_ADVANCE_MS = 4800;
const RESUME_AFTER_MS = 14000;

const STAGES = [
    { name: 'Discover', copy: 'We map the problem, the users, and the budget before a single line of code is written.' },
    { name: 'Design',   copy: 'Wireframes and a clickable prototype, approved by you before the deposit is due.' },
    { name: 'Build',    copy: 'Milestone-based development with working previews you can open and test at each step.' },
    { name: 'Review',   copy: 'Real-device testing, performance and SEO checks, then your sign-off against the agreed scope.' },
    { name: 'Deploy',   copy: 'We ship it, hand over every account and repository, and stay on support after launch.' }
];

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

function showFallback() {
    const shell = document.querySelector('.process-canvas-shell');
    const fallback = document.getElementById('processFallback');
    const canvas = document.getElementById(CANVAS_ID);
    if (canvas) canvas.style.display = 'none';
    if (fallback) fallback.hidden = false;
    if (shell) shell.classList.add('is-fallback');
}

// Stage indicators work with or without WebGL, so wire them up first.
function initIndicators(onSelect) {
    const buttons = Array.from(document.querySelectorAll('.stage-indicator'));
    const description = document.getElementById('stageDescription');
    if (!buttons.length) return null;

    function paint(index) {
        buttons.forEach(function (btn, i) {
            const active = i === index;
            btn.classList.toggle('is-active', active);
            btn.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        if (description && STAGES[index]) description.textContent = STAGES[index].copy;
    }

    buttons.forEach(function (btn, i) {
        btn.addEventListener('click', function () {
            paint(i);
            if (onSelect) onSelect(i, true);
        });
    });

    paint(0);
    return paint;
}

async function main() {
    const canvas = document.getElementById(CANVAS_ID);
    if (!canvas) return;

    if (!webglAvailable()) { initIndicators(null); showFallback(); return; }

    let THREE;
    try {
        THREE = await import(/* @vite-ignore */ THREE_URL);
    } catch (err) {
        initIndicators(null); showFallback(); return;
    }

    const B = BUILDING;
    const reduced = prefersReducedMotion();

    // ------------------------------------------------------------------ scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050d18, 13, 30);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({
        canvas, antialias: true, alpha: true, powerPreference: 'low-power'
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // ----------------------------------------------------------------- lights
    scene.add(new THREE.AmbientLight(0x4a6fa5, 0.5));

    const keyLight = new THREE.DirectionalLight(0xbcd7ff, 1.0);
    keyLight.position.set(5, 9, 4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(TEAL, 1.6, 22);
    rimLight.position.set(-4.5, 3, -3);
    scene.add(rimLight);

    // ------------------------------------------------------------------ site
    const grid = new THREE.GridHelper(16, 16, TEAL, 0x1d3a5c);
    grid.material.transparent = true;
    grid.material.opacity = 0.3;
    scene.add(grid);

    const pad = new THREE.Mesh(
        new THREE.PlaneGeometry(B.width + 1.4, B.depth + 1.4),
        new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0.05, side: THREE.DoubleSide })
    );
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = 0.01;
    scene.add(pad);

    // -------------------------------------------------- stage 1: survey marks
    const markers = new THREE.Group();
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (s) {
        const x = s[0] * (B.width / 2 + 0.25);
        const z = s[1] * (B.depth / 2 + 0.25);

        const beacon = new THREE.Mesh(
            new THREE.SphereGeometry(0.06, 12, 12),
            new THREE.MeshBasicMaterial({ color: GOLD, transparent: true })
        );
        beacon.position.set(x, 0.1, z);
        markers.add(beacon);

        const beam = new THREE.Mesh(
            new THREE.CylinderGeometry(0.01, 0.01, 1.3, 6),
            new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.3 })
        );
        beam.position.set(x, 0.72, z);
        markers.add(beam);
    });
    scene.add(markers);

    // -------------------------------------------------------------- structure
    const structure = new THREE.Group();
    scene.add(structure);

    const levels = [];
    let y = 0;

    // Optional wider podium at the base
    if (B.podium) {
        const pw = B.width * 1.28, pd = B.depth * 1.28, ph = B.levelHeight * 0.62;
        levels.push(makeLevel(pw, ph, pd, y, 0, true));
        y += ph;
    }

    for (let i = 0; i < B.levels; i++) {
        const shrink = 1 - B.setback * i;
        const w = Math.max(0.25, B.width * shrink);
        const d = Math.max(0.25, B.depth * shrink);
        levels.push(makeLevel(w, B.levelHeight, d, y, THREE.MathUtils.degToRad(B.twist * i), false));
        y += B.levelHeight;
    }

    const roofY = y;

    // Roof crown: a mast that reads as the finished landmark
    let crown = null;
    if (B.crown) {
        crown = new THREE.Group();
        const mast = new THREE.Mesh(
            new THREE.CylinderGeometry(0.012, 0.03, B.levelHeight * 1.9, 8),
            new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0 })
        );
        mast.position.y = B.levelHeight * 0.95;
        crown.add(mast);

        const beaconTop = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 12, 12),
            new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0 })
        );
        beaconTop.position.y = B.levelHeight * 1.9;
        crown.add(beaconTop);

        crown.position.y = roofY;
        structure.add(crown);
    }

    // Satellite outbuildings
    const satellites = [];
    for (let i = 0; i < B.satellites; i++) {
        const a = (i / Math.max(1, B.satellites)) * Math.PI * 2 + 0.7;
        const dist = Math.max(B.width, B.depth) * 1.35;
        const sw = B.width * 0.34, sh = B.levelHeight * (0.8 + (i % 2) * 0.5), sd = B.depth * 0.34;
        const lvl = makeLevel(sw, sh, sd, 0, a, false);
        lvl.group.position.x = Math.cos(a) * dist;
        lvl.group.position.z = Math.sin(a) * dist;
        satellites.push(lvl);
    }

    function makeLevel(w, h, d, baseY, rotY, isPodium) {
        const group = new THREE.Group();
        const geo = new THREE.BoxGeometry(w, h, d);

        const solid = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
            color: isPodium ? 0x14273f : 0x0f1f35,
            metalness: 0.15,
            roughness: 0.42,
            transparent: true,
            opacity: 0
        }));
        group.add(solid);

        const edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(geo),
            new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0 })
        );
        group.add(edges);

        // Windows: a slab that lights up from inside at the Review stage
        const inner = new THREE.Mesh(
            new THREE.BoxGeometry(w * 0.9, h * 0.46, d * 0.9),
            new THREE.MeshBasicMaterial({ color: 0xffe6b0, transparent: true, opacity: 0 })
        );
        group.add(inner);

        // Vertical fins across the two long faces
        if (B.fins && !isPodium) {
            const finCount = Math.max(3, Math.round(w / 0.26));
            for (let f = 0; f < finCount; f++) {
                const fx = -w / 2 + (f + 0.5) * (w / finCount);
                [-1, 1].forEach(function (side) {
                    const fin = new THREE.Mesh(
                        new THREE.BoxGeometry(0.022, h * 0.92, 0.022),
                        new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0 })
                    );
                    fin.position.set(fx, 0, side * (d / 2));
                    group.add(fin);
                });
            }
        }

        group.position.y = baseY + h / 2;
        group.rotation.y = rotY;
        structure.add(group);

        return { group, solid, edges, inner, baseY: baseY + h / 2, height: h };
    }

    // ------------------------------------------------ stage 5: deploy sequence
    const pulse = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.55, 7, 16, 1, true),
        new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0, side: THREE.DoubleSide })
    );
    pulse.position.y = roofY * 0.5 + 2;
    scene.add(pulse);

    const orbitRing = new THREE.Mesh(
        new THREE.TorusGeometry(Math.max(B.width, B.depth) * 1.5, 0.016, 8, 90),
        new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0 })
    );
    orbitRing.rotation.x = Math.PI / 2.3;
    orbitRing.position.y = roofY * 0.62;
    scene.add(orbitRing);

    const satellite = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 10, 10),
        new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0 })
    );
    scene.add(satellite);

    // ------------------------------------------------------------ stage logic
    // Per level: 0 hidden, 1 wireframe only, 2 solid + wireframe
    function targetsFor(stage) {
        const n = levels.length;
        const all = function (v) { return new Array(n).fill(v); };
        switch (stage) {
            case 0: return { levels: all(0), markers: 1,    glow: 0, deploy: 0, sat: 0 };
            case 1: return { levels: levels.map(function (_, i) { return i === 0 ? 1 : 0; }), markers: 0.55, glow: 0, deploy: 0, sat: 0 };
            case 2: return { levels: levels.map(function (_, i) { return i < Math.ceil(n * 0.6) ? 2 : 1; }), markers: 0.18, glow: 0, deploy: 0, sat: 0.6 };
            case 3: return { levels: all(2), markers: 0.3,  glow: 1, deploy: 0, sat: 1 };
            default: return { levels: all(2), markers: 0,   glow: 0.65, deploy: 1, sat: 1 };
        }
    }

    let currentStage = 0;
    let deployClock = 0;
    const state = levels.map(function () { return { solid: 0, edge: 0, lift: 0, inner: 0 }; });
    const satState = satellites.map(function () { return { solid: 0, edge: 0 }; });
    let markerState = 1;
    let deployState = 0;
    let crownState = 0;

    const paintIndicators = initIndicators(function (index) { setStage(index, true); });

    let autoTimer = null, resumeTimer = null;

    function scheduleAuto() {
        clearInterval(autoTimer);
        if (reduced) return;
        autoTimer = setInterval(function () {
            setStage((currentStage + 1) % STAGES.length, false);
        }, AUTO_ADVANCE_MS);
    }

    function setStage(index, fromUser) {
        currentStage = index;
        if (index === 4) deployClock = 0;
        if (paintIndicators) paintIndicators(index);
        if (fromUser) {
            clearInterval(autoTimer);
            clearTimeout(resumeTimer);
            resumeTimer = setTimeout(scheduleAuto, RESUME_AFTER_MS);
        }
    }

    // ------------------------------------------------------------ camera path
    const ARC = Math.PI / 6;      // 30 degree arc
    const CYCLE = 15;             // seconds per full sweep
    const BASE_ANGLE = Math.PI * 0.22;

    function positionCamera(t) {
        const phase = reduced ? 0.5 : (Math.sin((t / CYCLE) * Math.PI * 2) * 0.5 + 0.5);
        const angle = BASE_ANGLE + (phase - 0.5) * ARC;
        camera.position.set(
            Math.sin(angle) * B.cameraDistance,
            B.cameraHeight + Math.sin(t * 0.12) * 0.25,
            Math.cos(angle) * B.cameraDistance
        );
        camera.lookAt(0, roofY * 0.45, 0);
    }

    // ------------------------------------------------------------------ sizing
    function resize() {
        const shell = canvas.parentElement;
        if (!shell) return;
        const w = shell.clientWidth;
        const h = shell.clientHeight || Math.round(w * 0.6);
        // Layout is not always resolved on DOMContentLoaded. Retry rather than
        // giving up, otherwise the canvas stays at its default 300x150 forever.
        if (w === 0 || h === 0) { requestAnimationFrame(resize); return; }
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas.parentElement);
    else window.addEventListener('resize', resize);
    resize();
    window.addEventListener('load', resize);

    // --------------------------------------------------------------- animation
    let running = true, raf = null;
    const clock = new THREE.Clock();

    function approach(cur, target, rate, dt) {
        return cur + (target - cur) * Math.min(1, rate * dt);
    }

    function frame() {
        raf = requestAnimationFrame(frame);
        if (!running) return;

        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.getElapsedTime();
        const target = targetsFor(currentStage);

        positionCamera(t);

        levels.forEach(function (lv, i) {
            const want = target.levels[i];
            const s = state[i];
            s.edge  = approach(s.edge,  want >= 1 ? 0.85 : 0, 4,   dt);
            s.solid = approach(s.solid, want >= 2 ? 0.72 : 0, 3.2, dt);
            s.lift  = approach(s.lift,  want >= 1 ? 0 : -1.1,  3.5, dt);
            s.inner = approach(s.inner, want >= 2 ? target.glow * 0.3 : 0, 2.4, dt);

            lv.edges.material.opacity = s.edge;
            lv.edges.visible = s.edge > 0.01;
            lv.solid.material.opacity = s.solid;
            lv.solid.visible = s.solid > 0.01;
            lv.inner.material.opacity = s.inner;
            lv.group.position.y = lv.baseY + s.lift;

            // Fins share the wireframe fade
            lv.group.children.forEach(function (child) {
                if (child !== lv.solid && child !== lv.edges && child !== lv.inner && child.material) {
                    child.material.opacity = s.edge * 0.55;
                    child.visible = s.edge > 0.02;
                }
            });
        });

        satellites.forEach(function (lv, i) {
            const s = satState[i];
            s.edge  = approach(s.edge,  target.sat > 0 ? 0.5 : 0, 3, dt);
            s.solid = approach(s.solid, target.sat > 0.8 ? 0.5 : 0, 2.6, dt);
            lv.edges.material.opacity = s.edge;
            lv.edges.visible = s.edge > 0.01;
            lv.solid.material.opacity = s.solid;
            lv.solid.visible = s.solid > 0.01;
        });

        if (crown) {
            crownState = approach(crownState, currentStage >= 3 ? 1 : 0, 2.2, dt);
            crown.children.forEach(function (c) {
                c.material.opacity = crownState * 0.85;
                c.visible = crownState > 0.02;
            });
        }

        markerState = approach(markerState, target.markers, 3, dt);
        markers.visible = markerState > 0.02;
        markers.children.forEach(function (m, i) {
            const p = 0.6 + Math.sin(t * 2.4 + i) * 0.4;
            m.material.opacity = markerState * p * (m.geometry.type === 'SphereGeometry' ? 1 : 0.4);
        });

        deployState = approach(deployState, target.deploy, 2.5, dt);
        if (currentStage === 4) deployClock += dt;

        const beamPhase = Math.max(0, 1 - deployClock / 1.4);
        pulse.material.opacity = deployState * beamPhase * 0.5;
        pulse.scale.y = 0.6 + (1 - beamPhase) * 0.8;
        pulse.visible = pulse.material.opacity > 0.01;

        const ringIn = Math.min(1, Math.max(0, (deployClock - 0.8) / 1.2));
        orbitRing.material.opacity = deployState * ringIn * 0.7;
        orbitRing.visible = orbitRing.material.opacity > 0.01;
        orbitRing.rotation.z += dt * 0.25;

        satellite.material.opacity = deployState * ringIn;
        satellite.visible = satellite.material.opacity > 0.01;
        const sa = t * 0.9;
        const orbitR = Math.max(B.width, B.depth) * 1.5;
        satellite.position.set(Math.cos(sa) * orbitR, orbitRing.position.y + Math.sin(sa) * 0.8, Math.sin(sa) * orbitR * 0.42);

        rimLight.intensity = 1.3 + Math.sin(t * 0.8) * 0.3;

        renderer.render(scene, camera);
    }

    if (window.IntersectionObserver) {
        const io = new IntersectionObserver(function (entries) {
            running = entries[0].isIntersecting;
            if (running) clock.getDelta();
        }, { threshold: 0.05 });
        io.observe(canvas);
    }

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) clearInterval(autoTimer);
        else { clock.getDelta(); scheduleAuto(); }
    });

    scheduleAuto();
    frame();

    window.addEventListener('pagehide', function () {
        if (raf) cancelAnimationFrame(raf);
        clearInterval(autoTimer);
        clearTimeout(resumeTimer);
        renderer.dispose();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
