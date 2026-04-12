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
    const MOBILE_TAP_HOLD_MS = 2600;

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
    let touchReleaseTimer = null;
    let floatAnimation = null;

    function isCoarsePointer() {
        return window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    }

    function clearTouchReleaseTimer() {
        if (!touchReleaseTimer) return;
        clearTimeout(touchReleaseTimer);
        touchReleaseTimer = null;
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

    function armTouchRelease() {
        clearTouchReleaseTimer();
        touchReleaseTimer = setTimeout(() => {
            touchPinned = false;
            focusedOnDot = false;
            pointerOnDot = false;
            hideCard();
            scheduleIdleCycle();
            touchReleaseTimer = null;
        }, MOBILE_TAP_HOLD_MS);
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
        clearTouchReleaseTimer();
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
        clearTouchReleaseTimer();
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

            e.preventDefault();
            e.stopPropagation();
            pointerOnDot = false;
            focusedOnDot = true;
            touchPinned = true;
            showFor(dot);
            userActivity();
            armTouchRelease();
        });

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

    scheduleIdleCycle();
})();

/*
MAP AUTO-CYCLE — uncomment this when the map section
is uncommented and dot positions are calibrated.

(function initMapAutoCycle() {
  const dots = document.querySelectorAll('.map-dot');
  if (!dots.length) return;

  let cycleIndex = 0;
  let cycleTimer = null;
  let userHovering = false;

  function simulateHover(dot) {
    dots.forEach(d => d.classList.remove('is-hovered'));
    dot.classList.add('is-hovered');
    dot.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  }

  function clearSimulation(dot) {
    if (dot) {
      dot.classList.remove('is-hovered');
      dot.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    }
  }

  function runCycle() {
    if (userHovering) return;
    clearSimulation(dots[cycleIndex === 0 ? dots.length - 1 : cycleIndex - 1]);
    simulateHover(dots[cycleIndex]);
    cycleIndex = (cycleIndex + 1) % dots.length;
    cycleTimer = setTimeout(runCycle, 1800);
  }

  dots.forEach(function(dot) {
    dot.addEventListener('mouseenter', function() {
      userHovering = true;
      clearTimeout(cycleTimer);
      dots.forEach(d => d.classList.remove('is-hovered'));
    });
    dot.addEventListener('mouseleave', function() {
      userHovering = false;
      cycleTimer = setTimeout(runCycle, 2500);
    });
  });

  runCycle();
}());
END AUTO-CYCLE */
