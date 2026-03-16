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
        const gap = 18;
        const preferredX = side === 'right'
            ? (dotRect.left - mapRect.left) - cardRect.width - gap
            : (dotRect.left - mapRect.left) + (dotRect.width / 2) + gap;
        const preferredY = (dotRect.top - mapRect.top) - (cardRect.height / 2);

        let left = preferredX;
        if (left + cardRect.width > mapRect.width - 8) {
            left = (dotRect.left - mapRect.left) - cardRect.width - gap;
        }
        if (left < 8) {
            left = (dotRect.left - mapRect.left) + (dotRect.width / 2) + gap;
        }

        left = clamp(left, 8, mapRect.width - cardRect.width - 8);
        const top = clamp(preferredY, 8, mapRect.height - cardRect.height - 8);

        card.style.left = left + 'px';
        card.style.top = top + 'px';
    }

    function getDataFromDot(dot) {
        return {
            title: dot.getAttribute('data-name') || 'Region',
            currency: 'Currency: ' + (dot.getAttribute('data-currency') || 'USD'),
            from: dot.getAttribute('data-from') || 'From USD 700',
            note: dot.getAttribute('data-note') || 'Market-adjusted pricing'
        };
    }

    function showFor(dot) {
        renderCard(getDataFromDot(dot));
        card.hidden = false;
        card.classList.add('visible');
        positionCard(dot);
    }

    function hideCard() {
        card.classList.remove('visible');
        card.hidden = true;
    }

    map.querySelectorAll('.pricing-dot').forEach(dot => {
        dot.addEventListener('mouseenter', () => showFor(dot));
        dot.addEventListener('focus', () => showFor(dot));
    });

    map.addEventListener('mouseleave', hideCard);
    map.addEventListener('focusout', e => {
        if (!map.contains(e.relatedTarget)) hideCard();
    });

    window.addEventListener('resize', () => {
        const active = map.querySelector('.pricing-dot:focus') || map.querySelector('.pricing-dot:hover');
        if (active && !card.hidden) positionCard(active);
    });
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
