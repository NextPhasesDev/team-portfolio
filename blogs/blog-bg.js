/* ============================================================
   NextPhases - Blog Background (theme-aware canvas)
   ============================================================ */
(function () {
    'use strict';

    var canvas = document.getElementById('npBlogCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var width = 0;
    var height = 0;
    var dots = [];
    var raf = 0;
    var mouse = { x: 0, y: 0 };
    var targetMouse = { x: 0, y: 0 };
    var scrollY = 0;
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var palette = getPalette();

    function getPalette() {
        var dark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
        if (dark) {
            return {
                bg: ['rgba(13,27,42,0.00)', 'rgba(13,27,42,0.30)'],
                colors: ['#00B4D8', '#14B8A6', '#1E3A8A', '#2DD4BF'],
                line: 'rgba(20,184,166,0.12)'
            };
        }
        return {
            bg: ['rgba(243,247,251,0.00)', 'rgba(243,247,251,0.38)'],
            colors: ['#0891B2', '#0EA5E9', '#2563EB', '#14B8A6'],
            line: 'rgba(8,145,178,0.13)'
        };
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * Math.min(window.devicePixelRatio || 1, 2));
        canvas.height = Math.floor(height * Math.min(window.devicePixelRatio || 1, 2));
        ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
        if (!dots.length) buildDots();
    }

    function buildDots() {
        dots = [];
        var count = Math.max(16, Math.min(38, Math.round(width / 48)));
        for (var i = 0; i < count; i++) {
            dots.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: 1.6 + Math.random() * 3.8,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.3,
                phase: Math.random() * Math.PI * 2,
                speed: 0.25 + Math.random() * 0.55,
                color: palette.colors[i % palette.colors.length]
            });
        }
    }

    function fillBackground() {
        var grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, palette.bg[0]);
        grad.addColorStop(1, palette.bg[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
    }

    function drawDot(d, time) {
        var bob = Math.sin(time * d.speed + d.phase) * 14;
        var px = d.x + mouse.x * 26;
        var py = d.y + bob + mouse.y * 16 - (scrollY * 0.03);

        var g = ctx.createRadialGradient(px, py, 0, px, py, d.r * 12);
        g.addColorStop(0, d.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, d.r * 12, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawLinks() {
        ctx.strokeStyle = palette.line;
        ctx.lineWidth = 0.7;
        for (var i = 0; i < dots.length; i++) {
            for (var j = i + 1; j < dots.length; j++) {
                var dx = dots[i].x - dots[j].x;
                var dy = dots[i].y - dots[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 140) continue;
                ctx.globalAlpha = 1 - (dist / 140);
                ctx.beginPath();
                ctx.moveTo(dots[i].x + mouse.x * 20, dots[i].y + mouse.y * 10 - (scrollY * 0.02));
                ctx.lineTo(dots[j].x + mouse.x * 20, dots[j].y + mouse.y * 10 - (scrollY * 0.02));
                ctx.stroke();
            }
        }
        ctx.globalAlpha = 1;
    }

    function stepPositions() {
        for (var i = 0; i < dots.length; i++) {
            var d = dots[i];
            d.x += d.vx;
            d.y += d.vy;
            if (d.x < -10) d.x = width + 10;
            if (d.x > width + 10) d.x = -10;
            if (d.y < -10) d.y = height + 10;
            if (d.y > height + 10) d.y = -10;
        }
    }

    function render(timeMs) {
        var t = timeMs * 0.001;
        mouse.x += (targetMouse.x - mouse.x) * 0.05;
        mouse.y += (targetMouse.y - mouse.y) * 0.05;

        fillBackground();
        drawLinks();
        for (var i = 0; i < dots.length; i++) {
            drawDot(dots[i], t);
        }

        if (!reducedMotion) {
            stepPositions();
            raf = requestAnimationFrame(render);
        }
    }

    function refreshTheme() {
        palette = getPalette();
        for (var i = 0; i < dots.length; i++) {
            dots[i].color = palette.colors[i % palette.colors.length];
        }
        if (reducedMotion) render(performance.now());
    }

    function bind() {
        window.addEventListener('resize', resize);
        window.addEventListener('scroll', function () {
            scrollY = window.scrollY || 0;
        }, { passive: true });
        window.addEventListener('mousemove', function (e) {
            targetMouse.x = ((e.clientX / Math.max(width, 1)) - 0.5) * 2;
            targetMouse.y = ((e.clientY / Math.max(height, 1)) - 0.5) * 2;
        }, { passive: true });

        var themeObserver = new MutationObserver(function () {
            refreshTheme();
        });
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                cancelAnimationFrame(raf);
            } else if (!reducedMotion) {
                raf = requestAnimationFrame(render);
            } else {
                render(performance.now());
            }
        });
    }

    resize();
    bind();
    if (reducedMotion) {
        render(performance.now());
    } else {
        raf = requestAnimationFrame(render);
    }
})();