/* ============================================================
   about.js — NextPhases Team Carousel + Parallax Background
   Replaces the previous about.js entirely.
   ============================================================ */
 
(function () {
    'use strict';

    /* ── MEMBER DATA ──────────────────────────────────────── */
    var MEMBERS = [
        {
            id:        'thuma',
            name:      'Thuma',
            short:     'Thuma',
            badge:     'Co-Founder',
            badgeType: 'founder',
            role:      'CTO & CMO',
            bio:       'Sets the technical direction and shapes the NextPhases brand. Leads architecture, development strategy, and how the team communicates what it builds.',
            skills:    ['Architecture', 'Brand', 'Strategy', 'Nsolo'],
            icon:      'fas fa-laptop-code',
            artStart:  '#0c2248',
            artEnd:    '#083d38',
            artImg:    null, /* Replace with 'assets/team/thuma.png' when ready */
            particles: ['{}', '</>', '=>', '===', 'fn()', 'const', '&&', '//', '[]', 'let'],
            links: [
                { label: 'Media & press', href: 'mailto:media@nextphases.dev', icon: 'fas fa-envelope' }
            ],
            linkedin: 'https://www.linkedin.com/company/nextphases'
        },
        {
            id:        'simon',
            name:      'Simon',
            short:     'Simon',
            badge:     'Co-Founder',
            badgeType: 'founder',
            role:      'COO',
            bio:       'Keeps delivery, operations, and client communication in order so projects move from kickoff to launch without losing momentum.',
            skills:    ['Operations', 'PM', 'ExamGuard', 'Delivery'],
            icon:      'fas fa-cogs',
            artStart:  '#14103a',
            artEnd:    '#083d38',
            artImg:    null,
            particles: ['SHIP', 'merge', 'done', 'PR', 'v2.0', 'fix', 'push', 'sync'],
            links: [
                { label: 'Partnerships', href: 'mailto:team@nextphases.dev', icon: 'fas fa-envelope' }
            ],
            linkedin: 'https://www.linkedin.com/company/nextphases'
        },
        {
            id:        'chris',
            name:      'Christian',
            short:     'Chris',
            badge:     'Co-Founder',
            badgeType: 'founder',
            role:      'CEO & CCO',
            bio:       'Leads the company voice, manages client relationships, and drives the commercial direction that keeps NextPhases growing.',
            skills:    ['Leadership', 'Clients', 'Growth'],
            icon:      'fas fa-handshake',
            artStart:  '#1a0a3a',
            artEnd:    '#0b3d30',
            artImg:    null,
            particles: ['@', 'deal', 'hi!', 'yes!', '$', 'mail', ':)', 'sync'],
            links: [
                { label: 'Client enquiries', href: 'mailto:info@nextphases.dev', icon: 'fas fa-envelope' }
            ],
            linkedin: 'https://www.linkedin.com/company/nextphases'
        },
        {
            id:        'shaun',
            name:      'Shaun',
            short:     'Shaun',
            badge:     'Co-Founder',
            badgeType: 'founder',
            role:      'VP Engineering',
            bio:       'Guides engineering quality and implementation standards. Keeps every shipped feature feeling dependable and polished.',
            skills:    ['Engineering', 'Full-Stack', 'Quality'],
            icon:      'fas fa-code',
            artStart:  '#0d1e3a',
            artEnd:    '#0a3848',
            artImg:    null,
            particles: ['px', 'rem', '#fff', 'UI', 'flex', 'grid', 'UX', 'var()'],
            links:     [],
            linkedin:  'https://www.linkedin.com/company/nextphases'
        },
        {
            id:        'lans',
            name:      'Lans',
            short:     'Lans',
            badge:     'Contributor',
            badgeType: 'contrib',
            role:      'Developer Contributor',
            bio:       'Supports active development work across NextPhases projects while building hands-on experience with real clients and products.',
            skills:    ['Development'],
            icon:      'fas fa-star',
            artStart:  '#151e38',
            artEnd:    '#083830',
            artImg:    null,
            particles: ['dev', 'build', 'code', 'fix', 'ship', 'test', 'learn'],
            links:     [],
            linkedin:  null
        }
    ];

    /* ── CAROUSEL INIT ───────────────────────────────────── */
    var carousel = document.getElementById('npCarousel');
    if (!carousel) return;

    var track   = document.getElementById('npTrack');
    var dotsEl  = document.getElementById('npDots');
    var prevBtn = document.getElementById('npPrev');
    var nextBtn = document.getElementById('npNext');

    if (!track || !dotsEl || !prevBtn || !nextBtn) return;

    var current   = 0;
    var animating = false;
    var autoId    = null;
    var touchX    = 0;
    var N         = MEMBERS.length;

    /* Build cards */
    MEMBERS.forEach(function (m, i) {
        track.appendChild(buildCard(m, i));
    });

    /* Build dots */
    MEMBERS.forEach(function (m, i) {
        var d = document.createElement('button');
        d.className = 'np-dot';
        d.setAttribute('role', 'tab');
        d.setAttribute('aria-label', 'Go to ' + m.short);
        d.addEventListener('click', function () { goTo(i); });
        dotsEl.appendChild(d);
    });

    /* ── CARD BUILDER ──────────────────────────────────────── */
    function buildCard(m, idx) {
        var card = document.createElement('article');
        card.className = 'np-card';
        card.dataset.index  = idx;
        card.dataset.member = m.id;
        card.setAttribute('role', 'tabpanel');
        card.setAttribute('aria-label', m.name + ', ' + m.role);

        /* Particle spans */
        var particles = m.particles.slice(0, 8).map(function (sym) {
            var top  = (8  + Math.random() * 76).toFixed(1);
            var left = (4  + Math.random() * 86).toFixed(1);
            var dur  = (10 + Math.random() * 12).toFixed(1);
            var del  = (-(Math.random() * parseFloat(dur))).toFixed(2);
            var dx   = ((Math.random() - 0.5) * 28).toFixed(1);
            var dy   = ((Math.random() - 0.5) * 18).toFixed(1);
            return '<span class="np-particle" aria-hidden="true" style="'
                + 'top:' + top + '%;left:' + left + '%;'
                + 'animation-duration:' + dur + 's;'
                + 'animation-delay:' + del + 's;'
                + '--pdx:' + dx + 'px;--pdy:' + dy + 'px'
                + '">' + sym + '</span>';
        }).join('');

        /* Links */
        var links = m.links.map(function (l) {
            return '<a href="' + l.href + '" class="np-link">'
                + '<i class="' + l.icon + '" aria-hidden="true"></i>' + l.label + '</a>';
        });
        if (m.linkedin) {
            links.push('<a href="' + m.linkedin + '" class="np-link" target="_blank" rel="noopener noreferrer">'
                + '<i class="fab fa-linkedin" aria-hidden="true"></i>LinkedIn</a>');
        }

        /* Optional illustration image */
        var imgTag = m.artImg
            ? '<img src="' + m.artImg + '" alt="" loading="lazy">'
            : '';

        card.innerHTML = ''
            + '<div class="np-art" style="--art-s:' + m.artStart + ';--art-e:' + m.artEnd + '" aria-hidden="true">'
            +   imgTag
            +   particles
            +   '<i class="np-art-icon ' + m.icon + '"></i>'
            +   '<div class="np-art-shine"></div>'
            +   '<span class="np-art-label">' + m.short + '</span>'
            + '</div>'
            + '<div class="np-card-body">'
            +   '<span class="np-badge np-badge--' + m.badgeType + '">' + m.badge + '</span>'
            +   '<h3 class="np-name">' + m.name + '</h3>'
            +   '<p class="np-role-title">' + m.role + '</p>'
            +   '<p class="np-bio">' + m.bio + '</p>'
            +   '<div class="np-skills">' + m.skills.map(function (s) { return '<span>' + s + '</span>'; }).join('') + '</div>'
            +   (links.length ? '<div class="np-links">' + links.join('') + '</div>' : '')
            + '</div>';

        /* Clicking a side card navigates to it */
        card.addEventListener('click', function () {
            if (card.classList.contains('is-prev')) goTo(current - 1);
            if (card.classList.contains('is-next')) goTo(current + 1);
        });

        return card;
    }

    /* ── STATE UPDATE ─────────────────────────────────────── */
    function update() {
        var cards = track.querySelectorAll('.np-card');
        var dots  = dotsEl.querySelectorAll('.np-dot');

        cards.forEach(function (c, i) {
            c.classList.remove('is-active', 'is-prev', 'is-next');
            var d = ((i - current) % N + N) % N;
            if (d === 0)     c.classList.add('is-active');
            else if (d === N - 1) c.classList.add('is-prev');
            else if (d === 1)    c.classList.add('is-next');
        });

        dots.forEach(function (d, i) {
            d.classList.toggle('is-active', i === current);
            d.setAttribute('aria-selected', String(i === current));
        });

        carousel.setAttribute('aria-label', 'Team carousel: ' + MEMBERS[current].name);
    }

    /* ── NAVIGATION ───────────────────────────────────────── */
    function goTo(idx) {
        if (animating) return;
        var nxt = ((idx % N) + N) % N;
        if (nxt === current) return;
        animating = true;
        current = nxt;
        update();
        setTimeout(function () { animating = false; }, 620);
    }

    function advance() { goTo(current + 1); }
    function retreat() { goTo(current - 1); }

    prevBtn.addEventListener('click', retreat);
    nextBtn.addEventListener('click', advance);

    /* Touch/swipe */
    carousel.addEventListener('touchstart', function (e) {
        touchX = e.touches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
        var dx = touchX - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 46) { dx > 0 ? advance() : retreat(); }
    }, { passive: true });

    /* Keyboard */
    carousel.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); advance(); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); retreat(); }
    });

    /* Auto-advance */
    function startAuto() { autoId = setInterval(advance, 5500); }
    function stopAuto()  { clearInterval(autoId); }

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('focusin',    stopAuto);
    carousel.addEventListener('focusout',   startAuto);

    update();
    startAuto();

    /* ── SECTION BACKGROUND ───────────────────────────────── */
    initTeamBg();

    function initTeamBg() {
        var canvas = document.getElementById('npTeamCanvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var W = 0, H = 0;
        var mouseX = 0.5, mouseY = 0.5;
        var tgtX   = 0.5, tgtY   = 0.5;

        var section = canvas.closest
            ? canvas.closest('.np-team-wrapper')
            : canvas.parentNode;

        function resize() {
            var dpr = window.devicePixelRatio || 1;
            W = canvas.offsetWidth;
            H = canvas.offsetHeight;
            canvas.width  = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            ctx.scale(dpr, dpr);
        }

        /* Mouse tracking */
        if (section) {
            section.addEventListener('mousemove', function (e) {
                var r = section.getBoundingClientRect();
                tgtX = (e.clientX - r.left) / r.width;
                tgtY = (e.clientY - r.top)  / r.height;
            });
            section.addEventListener('mouseleave', function () {
                tgtX = 0.5; tgtY = 0.5;
            });
        }

        /* Device orientation fallback for mobile */
        if ('DeviceOrientationEvent' in window) {
            window.addEventListener('deviceorientation', function (e) {
                if (e.gamma == null || e.beta == null) return;
                tgtX = Math.min(1, Math.max(0, 0.5 + e.gamma / 45));
                tgtY = Math.min(1, Math.max(0, 0.5 + e.beta  / 45));
            }, { passive: true });
        }

        /* Soft blobs */
        var blobs = [
            { x: 18, y: 25, r: 130, vx:  0.05, vy:  0.04, h: 200, a: 0.1  },
            { x: 75, y: 60, r: 115, vx: -0.04, vy:  0.05, h: 170, a: 0.09 },
            { x: 45, y: 80, r: 140, vx:  0.03, vy: -0.04, h: 185, a: 0.08 },
            { x: 85, y: 20, r: 100, vx: -0.05, vy:  0.03, h: 210, a: 0.08 },
            { x: 30, y: 50, r: 120, vx:  0.04, vy: -0.05, h: 195, a: 0.09 },
            { x: 60, y: 40, r:  90, vx: -0.03, vy:  0.04, h: 165, a: 0.07 }
        ];

        function draw() {
            if (!W || !H) { requestAnimationFrame(draw); return; }
            ctx.clearRect(0, 0, W, H);

            /* Smooth mouse follow */
            mouseX += (tgtX - mouseX) * 0.04;
            mouseY += (tgtY - mouseY) * 0.04;

            var ox = (mouseX - 0.5) * -28;
            var oy = (mouseY - 0.5) * -18;

            ctx.save();
            ctx.translate(ox, oy);

            blobs.forEach(function (b) {
                b.x += b.vx;
                b.y += b.vy;
                if (b.x < -15) b.x = 115;
                if (b.x > 115) b.x = -15;
                if (b.y < -15) b.y = 115;
                if (b.y > 115) b.y = -15;

                var gx = (b.x / 100) * (W + 60) - 30;
                var gy = (b.y / 100) * (H + 60) - 30;

                var g = ctx.createRadialGradient(gx, gy, 0, gx, gy, b.r);
                g.addColorStop(0, 'hsla(' + b.h + ',65%,38%,' + b.a + ')');
                g.addColorStop(1, 'transparent');

                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(gx, gy, b.r, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.restore();
            requestAnimationFrame(draw);
        }

        resize();
        window.addEventListener('resize', resize);
        draw();
    }

    /* ── MAGNETIC BUTTONS (site-wide) ─────────────────────── */
    /*
     * This adds a subtle magnetic pull to all .cta-button elements.
     * Safe to call multiple times — uses a data attribute flag to prevent
     * double-binding. You can also move this to script.js if preferred.
     */
    initMagneticButtons();

    function initMagneticButtons() {
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) return;

        document.querySelectorAll('.cta-button:not([data-magnetic])').forEach(function (btn) {
            btn.dataset.magnetic = '1';

            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var cx = rect.left + rect.width  / 2;
                var cy = rect.top  + rect.height / 2;
                var dx = (e.clientX - cx) * 0.28;
                var dy = (e.clientY - cy) * 0.28;
                btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
            });

            btn.addEventListener('mouseleave', function () {
                btn.style.transform = '';
            });
        });
    }

    /* ── GLOBAL PARALLAX for moonCanvas ──────────────────── */
    /*
     * Gives the existing background animation a "looking around"
     * depth effect. The canvas shifts slightly opposite to cursor
     * movement — creates the illusion of a 3D scene you're panning.
     * scale(1.06) ensures no edges are visible during the shift.
     *
     * Runs only on desktop (pointer: fine) to avoid drain on mobile.
     */
    if (!('ontouchstart' in window) && window.matchMedia('(pointer: fine)').matches) {
        initGlobalParallax();
    }

    function initGlobalParallax() {
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) return;

        var moonCanvas = document.getElementById('moonCanvas');
        if (!moonCanvas) return;

        var px = 0.5, py = 0.5;  /* smoothed position */
        var tx = 0.5, ty = 0.5;  /* target */
        var rafId = null;
        var active = false;

        document.addEventListener('mousemove', function (e) {
            tx = e.clientX / window.innerWidth;
            ty = e.clientY / window.innerHeight;
            if (!active) { active = true; rafId = requestAnimationFrame(tick); }
        }, { passive: true });

        function tick() {
            px += (tx - px) * 0.06;
            py += (ty - py) * 0.06;

            var mx = (px - 0.5) * -18;
            var my = (py - 0.5) * -12;

            moonCanvas.style.transform = 'translate(' + mx + 'px,' + my + 'px) scale(1.06)';

            var d = Math.abs(tx - px) + Math.abs(ty - py);
            if (d < 0.0008) {
                active = false;
                cancelAnimationFrame(rafId);
            } else {
                rafId = requestAnimationFrame(tick);
            }
        }
    }

    /* ── LEGACY PANEL (graceful no-op if elements absent) ── */
    (function () {
        var panel  = document.getElementById('teamDetailPanel');
        if (!panel) return;
        var overlay = document.getElementById('teamDetailOverlay');
        var close   = document.getElementById('detailClose');
        if (!overlay || !close) return;
        function closePanel() {
            overlay.classList.remove('active');
            panel.classList.remove('active');
        }
        close.addEventListener('click', function (e) { e.preventDefault(); closePanel(); });
        overlay.addEventListener('click', closePanel);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && panel.classList.contains('active')) closePanel();
        });
    })();

})();
