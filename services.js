(function () {
    'use strict';

    const map = document.getElementById('pricingMap');
    const canvas = document.getElementById('pricingMapCanvas');
    const card = document.getElementById('pricingMapCard');
    if (!map || !canvas || !card) return;

    const title = document.getElementById('pricingMapTitle');
    const currency = document.getElementById('pricingMapCurrency');
    const from = document.getElementById('pricingMapFrom');
    const note = document.getElementById('pricingMapNote');
    const dots = Array.from(map.querySelectorAll('.pricing-dot'));
    if (!title || !currency || !from || !note || !dots.length) return;

    const IDLE_DELAY_MS = 4200;
    const CYCLE_INTERVAL_MS = 2600;
    const HIDE_DELAY_MS = 260;
    const CARD_GAP_PX = 30;

    function initPhaseOneGlobeMotion() {
        if (!canvas.classList.contains('pricing-map-canvas--globe')) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let pointerX = 0;
        let pointerY = 0;
        let idleTick = 0;
        let rafId = null;
        let isPointerActive = false;

        function render() {
            if (!canvas.isConnected) return;

            let targetX = pointerX;
            let targetY = pointerY;

            if (!isPointerActive) {
                idleTick += 0.012;
                targetX = Math.sin(idleTick) * 0.45;
                targetY = Math.cos(idleTick * 0.82) * 0.35;
            }

            const tiltX = (targetY * -1.2).toFixed(2);
            const tiltY = (targetX * 1.6).toFixed(2);
            const shiftX = (targetX * 5.2).toFixed(2);
            const shiftY = (targetY * 4.2).toFixed(2);

            canvas.style.setProperty('--globe-tilt-x', tiltX + 'deg');
            canvas.style.setProperty('--globe-tilt-y', tiltY + 'deg');
            canvas.style.setProperty('--globe-shift-x', shiftX + 'px');
            canvas.style.setProperty('--globe-shift-y', shiftY + 'px');

            rafId = requestAnimationFrame(render);
        }

        function setPointerFromEvent(event) {
            const rect = canvas.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
            pointerX = clamp(x, -1, 1);
            pointerY = clamp(y, -1, 1);
        }

        canvas.addEventListener('pointermove', event => {
            isPointerActive = true;
            setPointerFromEvent(event);
        });

        canvas.addEventListener('pointerenter', event => {
            isPointerActive = true;
            setPointerFromEvent(event);
        });

        canvas.addEventListener('pointerleave', () => {
            isPointerActive = false;
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) return;
            isPointerActive = false;
        });

        rafId = requestAnimationFrame(render);

        window.addEventListener('beforeunload', () => {
            if (rafId) cancelAnimationFrame(rafId);
        });
    }

    function renderCard(data) {
        if (!data) return;
        title.textContent = data.title;
        currency.textContent = data.currency;
        from.textContent = data.from;
        note.textContent = data.note;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function positionCard(dot) {
        // Mobile devices use static positioning; only position on desktop
        if (window.matchMedia && window.matchMedia('(max-width: 640px)').matches) {
            return;
        }

        const mapRect = map.getBoundingClientRect();
        const dotRect = dot.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();

        const side = dot.getAttribute('data-card-pos') || 'left';
        const gap = CARD_GAP_PX;
        const dotX = (dotRect.left - mapRect.left) + (dotRect.width / 2);
        const dotY = (dotRect.top - mapRect.top) + (dotRect.height / 2);

        const rightPos = {
            left: dotX + gap,
            top: dotY - (cardRect.height / 2)
        };
        const leftPos = {
            left: dotX - cardRect.width - gap,
            top: dotY - (cardRect.height / 2)
        };
        const orderedCandidates = side === 'right'
            ? [rightPos, leftPos]
            : [leftPos, rightPos];

        function getOverlapScore(candidate) {
            const x1 = candidate.left;
            const y1 = candidate.top;
            const x2 = x1 + cardRect.width;
            const y2 = y1 + cardRect.height;

            let score = 0;
            dots.forEach(other => {
                if (other === dot) return;
                const r = other.getBoundingClientRect();
                const centerX = (r.left - mapRect.left) + (r.width / 2);
                const centerY = (r.top - mapRect.top) + (r.height / 2);
                if (centerX > x1 - 8 && centerX < x2 + 8 && centerY > y1 - 8 && centerY < y2 + 8) {
                    score += 1;
                }
            });
            return score;
        }

        function isInBounds(candidate) {
            return candidate.left >= 8
                && candidate.top >= 8
                && (candidate.left + cardRect.width) <= (mapRect.width - 8)
                && (candidate.top + cardRect.height) <= (mapRect.height - 8);
        }

        function coversActiveDot(candidate) {
            const safeX = 22;
            const safeY = 10;
            return dotX >= candidate.left - safeX
                && dotX <= (candidate.left + cardRect.width + safeX)
                && dotY >= candidate.top - safeY
                && dotY <= (candidate.top + cardRect.height + safeY);
        }

        let best = orderedCandidates[0];
        let bestScore = Number.POSITIVE_INFINITY;

        orderedCandidates.forEach(candidate => {
            const clamped = {
                left: clamp(candidate.left, 8, mapRect.width - cardRect.width - 8),
                top: clamp(candidate.top, 8, mapRect.height - cardRect.height - 8)
            };
            const score = getOverlapScore(clamped)
                + (isInBounds(candidate) ? 0 : 0.4)
                + (coversActiveDot(clamped) ? 100 : 0);
            if (score < bestScore) {
                best = clamped;
                bestScore = score;
            }
        });

        card.style.left = best.left + 'px';
        card.style.top = best.top + 'px';
    }

    function getDataFromDot(dot) {
        return {
            title: dot.getAttribute('data-name') || 'Region',
            currency: 'Currency: ' + (dot.getAttribute('data-currency') || 'USD'),
            from: dot.getAttribute('data-from') || 'From USD 700',
            note: dot.getAttribute('data-note') || 'Market-adjusted pricing'
        };
    }

    let activeDot = null;
    let hideTimer = null;
    let idleTimer = null;
    let cycleTimer = null;
    let autoIndex = 0;
    let isAutoCycling = false;
    let pointerOnDot = false;
    let focusedOnDot = false;
    let touchPinned = false;
    let floatAnimation = null;

    function isCoarsePointer() {
        return window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    }

    function cancelFloatAnimation() {
        if (!floatAnimation) return;
        floatAnimation.cancel();
        floatAnimation = null;
    }

    function startFloatAnimation() {
        cancelFloatAnimation();
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!card.classList.contains('visible')) return;

        floatAnimation = card.animate([
            { transform: 'translateY(-2px) scale(1)' },
            { transform: 'translateY(-6px) scale(1.004)' },
            { transform: 'translateY(-2px) scale(1)' }
        ], {
            duration: 3200,
            easing: 'ease-in-out',
            iterations: Infinity,
            fill: 'both'
        });
    }

    function playPopAnimation() {
        cancelFloatAnimation();
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            startFloatAnimation();
            return;
        }

        const pop = card.animate([
            { transform: 'translateY(14px) scale(0.92)', opacity: 0 },
            { transform: 'translateY(-8px) scale(1.018)', opacity: 1, offset: 0.62 },
            { transform: 'translateY(-2px) scale(1)', opacity: 1 }
        ], {
            duration: 420,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'both'
        });

        pop.onfinish = () => {
            if (card.classList.contains('visible')) {
                startFloatAnimation();
            }
        };
    }

    function pinDotForTouch(dot, event) {
        if (!dot) return;
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        pointerOnDot = false;
        focusedOnDot = true;
        touchPinned = true;
        showFor(dot);
        userActivity();
    }

    function setActiveDot(dot) {
        dots.forEach(node => node.classList.remove('is-active'));
        activeDot = dot || null;
        if (activeDot) activeDot.classList.add('is-active');
    }

    function clearHideTimer() {
        if (!hideTimer) return;
        clearTimeout(hideTimer);
        hideTimer = null;
    }

    function showFor(dot) {
        if (!dot) return;
        clearHideTimer();
        card.classList.remove('is-hiding');
        renderCard(getDataFromDot(dot));
        setActiveDot(dot);
        card.hidden = false;
        card.classList.add('is-engaged');

        requestAnimationFrame(() => {
            card.classList.add('visible');
            positionCard(dot);
            playPopAnimation();
        });
    }

    function hideCard(immediate) {
        clearHideTimer();
        cancelFloatAnimation();
        touchPinned = false;
        setActiveDot(null);
        card.classList.remove('visible', 'is-engaged');
        card.classList.add('is-hiding');

        if (immediate) {
            card.hidden = true;
            card.classList.remove('is-hiding');
            return;
        }

        hideTimer = setTimeout(() => {
            if (!card.classList.contains('visible')) {
                card.hidden = true;
                card.classList.remove('is-hiding');
            }
            hideTimer = null;
        }, HIDE_DELAY_MS);
    }

    function stopAutoCycle() {
        if (cycleTimer) {
            clearTimeout(cycleTimer);
            cycleTimer = null;
        }
        isAutoCycling = false;
    }

    function scheduleIdleCycle() {
        if (idleTimer) {
            clearTimeout(idleTimer);
            idleTimer = null;
        }

        idleTimer = setTimeout(() => {
            if (!pointerOnDot && !focusedOnDot && !touchPinned) {
                startAutoCycle();
            }
        }, IDLE_DELAY_MS);
    }

    function userActivity() {
        stopAutoCycle();
        scheduleIdleCycle();
    }

    function runAutoCycle() {
        if (!isAutoCycling || pointerOnDot || focusedOnDot || touchPinned) return;

        const dot = dots[autoIndex % dots.length];
        autoIndex = (autoIndex + 1) % dots.length;
        showFor(dot);

        cycleTimer = setTimeout(runAutoCycle, CYCLE_INTERVAL_MS);
    }

    function startAutoCycle() {
        if (isAutoCycling || pointerOnDot || focusedOnDot || touchPinned) return;

        isAutoCycling = true;
        if (activeDot) {
            const currentIndex = dots.indexOf(activeDot);
            autoIndex = currentIndex >= 0 ? (currentIndex + 1) % dots.length : autoIndex;
        }
        runAutoCycle();
    }

    dots.forEach(dot => {
        // Pointer clicks are intentionally inert; map uses hover/focus only.
        dot.addEventListener('mousedown', e => {
            e.preventDefault();
        });

        dot.addEventListener('pointerdown', e => {
            const isTap = e.pointerType === 'touch' || e.pointerType === 'pen' || isCoarsePointer();
            if (!isTap) return;
            pinDotForTouch(dot, e);
        });

        // Safari/iOS fallback where pointer events can be inconsistent.
        dot.addEventListener('touchstart', e => {
            if (!isCoarsePointer()) return;
            pinDotForTouch(dot, e);
        }, { passive: false });

        dot.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
        });

        dot.addEventListener('mouseenter', () => {
            pointerOnDot = true;
            showFor(dot);
            userActivity();
        });

        dot.addEventListener('focus', () => {
            focusedOnDot = true;
            showFor(dot);
            userActivity();
        });

        // Hide only if pointer/focus is not transitioning to another pricing dot.
        dot.addEventListener('mouseleave', e => {
            const next = e.relatedTarget;
            const movingToDot = !!(next && next.classList && next.classList.contains('pricing-dot'));
            pointerOnDot = movingToDot;
            if (!movingToDot && !touchPinned) {
                hideCard();
                scheduleIdleCycle();
            }
        });

        dot.addEventListener('blur', e => {
            const next = e.relatedTarget;
            const movingToDot = !!(next && next.classList && next.classList.contains('pricing-dot'));
            focusedOnDot = movingToDot;
            if (!movingToDot && !touchPinned) {
                hideCard();
                scheduleIdleCycle();
            }
        });
    });

    map.addEventListener('pointermove', () => {
        if (!pointerOnDot && !focusedOnDot) scheduleIdleCycle();
    });

    map.addEventListener('mouseleave', () => {
        pointerOnDot = false;
        if (!focusedOnDot && !touchPinned) hideCard();
        scheduleIdleCycle();
    });

    map.addEventListener('focusout', e => {
        if (!map.contains(e.relatedTarget)) {
            focusedOnDot = false;
            if (!touchPinned) hideCard();
            scheduleIdleCycle();
        }
    });

    document.addEventListener('pointerdown', e => {
        if (!touchPinned || !isCoarsePointer()) return;
        if (map.contains(e.target)) return;

        touchPinned = false;
        focusedOnDot = false;
        pointerOnDot = false;
        hideCard();
        scheduleIdleCycle();
    });

    window.addEventListener('resize', () => {
        const active = activeDot || map.querySelector('.pricing-dot:focus') || map.querySelector('.pricing-dot:hover');
        if (active && !card.hidden) positionCard(active);
    });

    initPhaseOneGlobeMotion();
    scheduleIdleCycle();
})();

(function initConnectionArcs() {
    var canvas = document.getElementById('npConnectionArcs');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var container = canvas.parentElement;

    // Zambia dot approximate position
    var ORIGIN = { x: 0.5382, y: 0.7209 };

    // All pricing dot positions (left%, top% from data-* attributes)
    var TARGETS = [
        { x: 0.5550, y: 0.7613 },
        { x: 0.5472, y: 0.6536 },
        { x: 0.4739, y: 0.5425 },
        { x: 0.6006, y: 0.5210 },
        { x: 0.5262, y: 0.8188 },
        { x: 0.4313, y: 0.3413 },
        { x: 0.5112, y: 0.3724 },
        { x: 0.1893, y: 0.4099 }
    ];

    var W = 0, H = 0;
    var particles = [];

    function resize() {
        var rect = container.getBoundingClientRect();
        W = rect.width; H = rect.height;
        var dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.scale(dpr, dpr);
        buildParticles();
    }

    function buildParticles() {
        particles = [];
        TARGETS.forEach(function(t) {
            particles.push({
                ox: ORIGIN.x * W, oy: ORIGIN.y * H,
                tx: t.x * W, ty: t.y * H,
                progress: Math.random(),
                speed: 0.0012 + Math.random() * 0.001,
                size: 2 + Math.random() * 1.5,
                opacity: 0.6 + Math.random() * 0.4
            });
        });
    }

    function getPointOnArc(ox, oy, tx, ty, t) {
        var cx = (ox + tx) / 2;
        var cy = Math.min(oy, ty) - Math.abs(tx - ox) * 0.3;
        var mt = 1 - t;
        return {
            x: mt * mt * ox + 2 * mt * t * cx + t * t * tx,
            y: mt * mt * oy + 2 * mt * t * cy + t * t * ty
        };
    }

    function draw() {
        if (!W || !H) { requestAnimationFrame(draw); return; }
        ctx.clearRect(0, 0, W, H);

        particles.forEach(function(p) {
            p.progress += p.speed;
            if (p.progress > 1) p.progress = 0;

            // Draw the arc path faintly
            var cx = (p.ox + p.tx) / 2;
            var cy = Math.min(p.oy, p.ty) - Math.abs(p.tx - p.ox) * 0.3;
            ctx.beginPath();
            ctx.moveTo(p.ox, p.oy);
            ctx.quadraticCurveTo(cx, cy, p.tx, p.ty);
            ctx.strokeStyle = 'rgba(20, 184, 166, 0.07)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw the travelling dot
            var pos = getPointOnArc(p.ox, p.oy, p.tx, p.ty, p.progress);
            var grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, p.size * 2);
            grad.addColorStop(0, 'rgba(20, 184, 166, ' + p.opacity + ')');
            grad.addColorStop(1, 'rgba(20, 184, 166, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, p.size * 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(20, 184, 166, ' + p.opacity + ')';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, p.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });

    resize();
    draw();
})();

