// NextPhases -- Master Script (stabilized)

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        loadNavbar()
            .catch(() => {
                // If navbar fetch fails, continue with any in-page navbar.
            })
            .finally(() => {
                ensureGamesNavLink();
                normalizeNavbarPaths();
                setActiveNavLink();
                initThemeToggle();
                initMoonAnimation();
                initScrollAnimations();
                initMobileNav();
                initSmartNavbar();
                initScrollToTop();
                initSmoothScrollLinks();
                initHeroEntrance();
                initWelcomeGuide();
                initTeamDetails();

                if (document.getElementById('contactForm')) {
                    initContactForm();
                    prefillFromURL();
                }

                updateCopyrightYear();
                loadFooter();
            });
    });

    function resolveSitePath(relativePath) {
        const clean = String(relativePath || '').replace(/^\/+/, '');
        const siteRelative = clean.replace(/^team-portfolio\//i, '');
        const path = window.location.pathname || '/';
        const localMarker = '/team-portfolio/';
        const markerIndex = path.indexOf(localMarker);

        if (markerIndex >= 0) {
            return path.slice(0, markerIndex + localMarker.length) + siteRelative;
        }

        // Support JetBrains previews that expose pages from /games/* without the project folder segment.
        const gamesMarker = '/games/';
        const gamesIndex = path.indexOf(gamesMarker);
        if (gamesIndex === 0) {
            return '/' + siteRelative;
        }

        return '/' + siteRelative;
    }

    function ensureGamesNavLink() {
        const navMenu = document.getElementById('navMenu');
        if (!navMenu) return;
        if (navMenu.querySelector('.nav-link[href*="games"]')) return;

        const gamesItem = document.createElement('li');
        const gamesLink = document.createElement('a');
        gamesLink.className = 'nav-link';
        gamesLink.href = resolveSitePath('/games/');
        gamesLink.textContent = 'Games';
        gamesItem.appendChild(gamesLink);

        const anchorItem = navMenu.querySelector('.nav-link[href*="testimonials"]');
        if (anchorItem && anchorItem.parentElement) {
            anchorItem.parentElement.insertAdjacentElement('beforebegin', gamesItem);
        } else {
            navMenu.appendChild(gamesItem);
        }
    }

    function loadNavbar() {
        const mount = document.getElementById('navbarMount');
        if (!mount) return Promise.resolve();

        return fetch(resolveSitePath('navbar.html'))
            .then(response => {
                if (!response.ok) throw new Error('Navbar not found');
                return response.text();
            })
            .then(html => {
                mount.outerHTML = html;
            });
    }

    function normalizeNavbarPaths() {
        const nav = document.getElementById('mainNav');
        if (!nav) return;

        nav.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href') || '';
            if (!href || /^(#|mailto:|tel:|https?:|javascript:)/i.test(href)) return;
            if (href.charAt(0) !== '/') return;
            link.setAttribute('href', resolveSitePath(href));
        });

        nav.querySelectorAll('img[src^="/"]').forEach(img => {
            const src = img.getAttribute('src') || '';
            img.setAttribute('src', resolveSitePath(src));
        });
    }

    function setActiveNavLink() {
        const currentPath = (window.location.pathname || '').toLowerCase();
        const navLinks = document.querySelectorAll('#navMenu .nav-link');
        if (!navLinks.length) return;

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = (link.getAttribute('href') || '').toLowerCase();
            if (!href) return;

            if (href.indexOf('/games/') >= 0 && currentPath.indexOf('/games/') >= 0) {
                link.classList.add('active');
                return;
            }

            const normalizedHref = href.replace(/^\./, '');
            if (normalizedHref !== '/' && currentPath.indexOf(normalizedHref) >= 0) {
                link.classList.add('active');
            }
        });

        if (currentPath === '/' || currentPath.indexOf('/index.html') >= 0 || /\/team-portfolio\/?$/i.test(currentPath)) {
            const homeLink = document.querySelector('#navMenu .nav-link[href*="index.html"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }

    // =============================================
    // TEAM MEMBER DETAILS MODAL
    // =============================================
    function initTeamDetails() {
        const teamCards = document.querySelectorAll('.clickable-team');
        const detailPanel = document.getElementById('teamDetailPanel');
        const overlay = document.getElementById('teamDetailOverlay');
        const closeBtn = document.getElementById('detailClose');
        const detailName = document.getElementById('detailName');
        const detailRole = document.getElementById('detailRole');
        const detailText = document.getElementById('detailText');
        const detailAvatar = document.querySelector('.detail-avatar');

        if (!teamCards.length || !detailPanel || !overlay || !closeBtn || !detailName || !detailRole || !detailText || !detailAvatar) return;

        const teamData = {
            thuma: {
                name: 'Thuma',
                role: 'Lead Developer & Cofounder',
                bio: 'Thuma is the technical backbone of NextPhases. As lead developer, he architects scalable solutions and ensures code quality across projects. He focuses on scalable architecture, practical execution, and long-term maintainability.',
                icon: '<i class="fas fa-laptop-code"></i>'
            },
            simon: {
                name: 'Simon',
                role: 'Full-Stack Developer & Project Manager',
                bio: 'Simon bridges code and operations. He drives execution timelines, keeps communication clear, and ensures projects land with quality and business impact.',
                icon: '<i class="fas fa-cogs"></i>'
            },
            shaun: {
                name: 'Shaun',
                role: 'Junior Developer & Cofounder',
                bio: 'Shaun is a full-stack generalist with strong momentum. He contributes across frontend and backend tasks while helping ship polished user-facing experiences.',
                icon: '<i class="fas fa-code"></i>'
            },
            chris: {
                name: 'Chris',
                role: 'Client Relations Lead',
                bio: 'Chris supports client communication, requirement clarity, and delivery alignment. He keeps projects smooth from first message to final handoff.',
                icon: '<i class="fas fa-handshake"></i>'
            }
        };

        let typingTimer = null;
        let typingRun = 0;

        function clearTyping() {
            typingRun += 1;
            if (typingTimer) {
                clearTimeout(typingTimer);
                typingTimer = null;
            }
            detailText.classList.remove('typing');
        }

        function setActiveCard(activeCard) {
            teamCards.forEach(card => card.classList.remove('active-member'));
            if (activeCard) activeCard.classList.add('active-member');
        }

        function typeText(text) {
            const run = typingRun;
            let i = 0;
            detailText.textContent = '';
            detailText.classList.add('typing');

            function next() {
                if (run !== typingRun) return;
                if (i < text.length) {
                    detailText.textContent += text.charAt(i);
                    i += 1;
                    typingTimer = setTimeout(next, 14);
                } else {
                    detailText.classList.remove('typing');
                    typingTimer = null;
                }
            }

            next();
        }

        function open(member, sourceCard) {
            const data = teamData[member];
            if (!data) return;

            clearTyping();
            setActiveCard(sourceCard);

            detailName.textContent = data.name;
            detailRole.textContent = data.role;
            detailAvatar.innerHTML = data.icon;

            overlay.classList.add('active');
            detailPanel.classList.add('active');
            typeText(data.bio);
        }

        function close() {
            clearTyping();
            setActiveCard(null);
            overlay.classList.remove('active');
            detailPanel.classList.remove('active');
            detailText.textContent = '';
        }

        teamCards.forEach(card => {
            card.addEventListener('click', () => {
                const member = card.getAttribute('data-member');
                open(member, card);
            });
        });

        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            close();
        });

        overlay.addEventListener('click', close);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && detailPanel.classList.contains('active')) close();
        });
    }

    // =============================================
    // THEME TOGGLE
    // =============================================
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;

        const saved = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', saved);

        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';

            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);

            themeToggle.classList.remove('spinning');
            void themeToggle.offsetWidth;
            themeToggle.classList.add('spinning');
            setTimeout(() => themeToggle.classList.remove('spinning'), 500);
        });
    }

    // =============================================
    // SMART NAVBAR
    // =============================================
    function initSmartNavbar() {
        const nav = document.getElementById('mainNav');
        if (!nav) return;

        let lastScroll = 0;
        let ticking = false;
        const threshold = 80;

        window.addEventListener('scroll', () => {
            if (ticking) return;

            window.requestAnimationFrame(() => {
                const currentScroll = window.scrollY;
                const menu = document.getElementById('navMenu');
                const menuOpen = !!(menu && menu.classList.contains('active'));

                nav.classList.toggle('scrolled', currentScroll > 10);

                if (menuOpen) {
                    nav.classList.remove('hidden');
                    lastScroll = currentScroll;
                    ticking = false;
                    return;
                }

                if (currentScroll <= threshold) {
                    nav.classList.remove('hidden');
                } else if (currentScroll > lastScroll + 5) {
                    nav.classList.add('hidden');
                } else if (currentScroll < lastScroll - 5) {
                    nav.classList.remove('hidden');
                }

                lastScroll = currentScroll;
                ticking = false;
            });

            ticking = true;
        });
    }

    // =============================================
    // MOBILE NAVIGATION
    // =============================================
    function initMobileNav() {
        const nav = document.getElementById('mainNav');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navMenuClose = document.getElementById('navMenuClose');
        const navContainer = document.querySelector('.nav-container');

        if (!navToggle || !navMenu) return;

        function setMenuOpen(isOpen) {
            navMenu.classList.toggle('active', isOpen);
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.classList.toggle('nav-open', isOpen);

            if (isOpen && nav) {
                nav.classList.remove('hidden');
            }

            const spans = navToggle.querySelectorAll('span');
            if (spans.length >= 3) {
                if (isOpen) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        }

        navToggle.setAttribute('aria-expanded', 'false');

        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            setMenuOpen(!navMenu.classList.contains('active'));
        });

        // Close button handler
        if (navMenuClose) {
            navMenuClose.addEventListener('click', (e) => {
                e.stopPropagation();
                setMenuOpen(false);
            });
        }

        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && (!navContainer || !navContainer.contains(e.target))) {
                setMenuOpen(false);
            }
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => setMenuOpen(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) setMenuOpen(false);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) setMenuOpen(false);
        });
    }

    // =============================================
    // SCROLL TO TOP
    // =============================================
    function initScrollToTop() {
        const btn = document.getElementById('scrollToTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) btn.classList.add('visible');
            else btn.classList.remove('visible');
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =============================================
    // SMOOTH SCROLL LINKS
    // =============================================
    function initSmoothScrollLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                const navHeight = document.querySelector('.main-nav') ? document.querySelector('.main-nav').offsetHeight : 70;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            });
        });
    }

    // =============================================
    // HERO ENTRANCE
    // =============================================
    function initHeroEntrance() {
        const heroElements = document.querySelectorAll('.hero > *');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 220 + index * 120);
        });
    }

    // =============================================
    // SIMPLE SCROLL ANIMATIONS (AOS-like)
    // =============================================
    function initScrollAnimations() {
        const targets = document.querySelectorAll('[data-aos]');
        if (!targets.length || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const delay = parseInt(entry.target.getAttribute('data-aos-delay') || '0', 10);
                setTimeout(() => entry.target.classList.add('aos-animate'), delay);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(el => observer.observe(el));
    }

    // =============================================
    // BACKGROUND ANIMATION -- page-aware
    // =============================================
    function initMoonAnimation() {
        const canvas = document.getElementById('moonCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        const path = (window.location.pathname || '').toLowerCase();
        const page = path.split('/').pop() || 'index.html';

        if (page.indexOf('services') >= 0) {
            initCodeAnimation(canvas, ctx);
            return;
        }
        if (page.indexOf('portfolio') >= 0) {
            initGridAnimation(canvas, ctx);
            return;
        }
        if (page.indexOf('about') >= 0) {
            initOrbitAnimation(canvas, ctx);
            return;
        }
        if (page.indexOf('contact') >= 0) {
            initPaperPlaneAnimation(canvas, ctx);
            return;
        }
        if (page.indexOf('testimonials') >= 0) {
            initQuotesAnimation(canvas, ctx);
            return;
        }
        if (page.indexOf('privacy') >= 0 || page.indexOf('terms') >= 0) {
            initLinesAnimation(canvas, ctx);
            return;
        }
        if (page.indexOf('games') >= 0 && page.indexOf('nsolo') < 0) {
            initGameSymbolsAnimation(canvas, ctx);
            return;
        }
        if (page.indexOf('nsolo') >= 0) {
            initNsoloSeedsAnimation(canvas, ctx);
            return;
        }

        // Home page: richer moon-phase scene.
        initMoonPhaseAnimation(canvas, ctx);
    }

    function initMoonPhaseAnimation(canvas, ctx) {
        function getColors() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark'
                ? { moon1: '#60a5fa', moon2: '#3b82f6', star: '#2dd4bf', accent: '#a78bfa' }
                : { moon1: '#3b82f6', moon2: '#1e3a8a', star: '#14b8a6', accent: '#7c3aed' };
        }

        const stars = [];
        const starCount = 80;
        for (let i = 0; i < starCount; i += 1) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 0.6 + Math.random() * 1.8,
                opacity: 0.09 + Math.random() * 0.2,
                twinkleSpeed: 0.008 + Math.random() * 0.02,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }

        const moons = [];
        const moonCount = 34;
        for (let i = 0; i < moonCount; i += 1) {
            moons.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                phase: Math.random(),
                size: 20 + Math.random() * 65,
                speedX: (Math.random() - 0.5) * 0.32,
                speedY: (Math.random() - 0.5) * 0.32,
                opacity: 0.08 + Math.random() * 0.16,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.0012
            });
        }

        const phaseRings = [];
        for (let i = 0; i < 4; i += 1) {
            phaseRings.push({
                x: canvas.width * (0.2 + i * 0.2),
                y: canvas.height * (0.25 + (i % 2) * 0.42),
                r: 90 + Math.random() * 140,
                a: Math.random() * Math.PI * 2,
                speed: 0.002 + Math.random() * 0.002
            });
        }

        function drawStar(star) {
            const c = getColors();
            const twinkle = Math.sin(star.twinklePhase) * 0.5 + 0.5;
            ctx.save();
            ctx.globalAlpha = star.opacity * twinkle;
            ctx.fillStyle = c.star;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        function drawMoon(moon) {
            const c = getColors();
            ctx.save();
            ctx.globalAlpha = moon.opacity;
            ctx.translate(moon.x, moon.y);
            ctx.rotate(moon.rotation);
            ctx.translate(-moon.x, -moon.y);

            const gradient = ctx.createRadialGradient(
                moon.x - moon.size * 0.3,
                moon.y - moon.size * 0.3,
                0,
                moon.x,
                moon.y,
                moon.size
            );
            gradient.addColorStop(0, c.moon1);
            gradient.addColorStop(1, c.moon2);

            ctx.beginPath();
            ctx.arc(moon.x, moon.y, moon.size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.globalCompositeOperation = 'destination-out';
            const shadowOffset = (moon.phase - 0.5) * moon.size * 2;
            ctx.beginPath();
            ctx.ellipse(moon.x + shadowOffset, moon.y, moon.size, moon.size, 0, 0, Math.PI * 2);
            ctx.fill();

            if (moon.size > 42) {
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = moon.opacity * 0.25;
                ctx.fillStyle = c.moon2;
                ctx.beginPath();
                ctx.arc(moon.x + moon.size * 0.2, moon.y - moon.size * 0.3, moon.size * 0.12, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(moon.x - moon.size * 0.3, moon.y + moon.size * 0.2, moon.size * 0.08, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }

        function drawPhaseRing(ring) {
            const c = getColors();
            ctx.save();
            ctx.globalAlpha = 0.12;
            ctx.strokeStyle = c.accent;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.arc(ring.x, ring.y, ring.r, ring.a, ring.a + Math.PI * 1.1);
            ctx.stroke();
            ctx.restore();
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.twinklePhase += star.twinkleSpeed;
                star.x += 0.04;
                star.y += 0.012;
                if (star.x > canvas.width) star.x = 0;
                if (star.y > canvas.height) star.y = 0;
                drawStar(star);
            });

            phaseRings.forEach(ring => {
                ring.a += ring.speed;
                drawPhaseRing(ring);
            });

            moons.forEach(moon => {
                moon.x += moon.speedX;
                moon.y += moon.speedY;
                if (moon.x < -moon.size) moon.x = canvas.width + moon.size;
                if (moon.x > canvas.width + moon.size) moon.x = -moon.size;
                if (moon.y < -moon.size) moon.y = canvas.height + moon.size;
                if (moon.y > canvas.height + moon.size) moon.y = -moon.size;
                moon.phase += 0.00012;
                if (moon.phase > 1) moon.phase = 0;
                moon.rotation += moon.rotationSpeed;
                drawMoon(moon);
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function initCodeAnimation(canvas, ctx) {
        function getColors() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark'
                ? { primary: '#60a5fa', secondary: '#2dd4bf', accent: '#a78bfa' }
                : { primary: '#2563eb', secondary: '#0d9488', accent: '#7c3aed' };
        }

        const symbols = ['</>', '{}', '[]', '()', '<', '>', '{', '}', ';', '=', '+', '*', '=>'];
        const particles = [];
        const particleCount = 42; // stronger than before for services page

        for (let i = 0; i < particleCount; i += 1) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                size: 20 + Math.random() * 34,
                speedX: (Math.random() - 0.5) * 0.6,
                speedY: (Math.random() - 0.5) * 0.55,
                opacity: 0.14 + Math.random() * 0.2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.006,
                color: Math.random() > 0.5 ? 'primary' : (Math.random() > 0.5 ? 'secondary' : 'accent')
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const colors = getColors();

            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.rotation += particle.rotationSpeed;

                if (particle.x < -55) particle.x = canvas.width + 55;
                if (particle.x > canvas.width + 55) particle.x = -55;
                if (particle.y < -55) particle.y = canvas.height + 55;
                if (particle.y > canvas.height + 55) particle.y = -55;

                ctx.save();
                ctx.globalAlpha = particle.opacity;
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation);
                ctx.font = particle.size + 'px "Courier New", monospace';
                ctx.fillStyle = colors[particle.color];
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(particle.symbol, 0, 0);
                ctx.restore();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function initGridAnimation(canvas, ctx) {
        function getColors() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark'
                ? { node: '#60a5fa', line: '#3b82f6', pulse: '#2dd4bf' }
                : { node: '#3b82f6', line: '#93c5fd', pulse: '#14b8a6' };
        }

        const nodes = [];
        const nodeCount = 18;
        const connectionDistance = 200;

        for (let i = 0; i < nodeCount; i += 1) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: 3 + Math.random() * 4,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.03
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const colors = getColors();

            ctx.strokeStyle = colors.line;
            for (let i = 0; i < nodes.length; i += 1) {
                for (let j = i + 1; j < nodes.length; j += 1) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < connectionDistance) {
                        ctx.globalAlpha = (1 - dist / connectionDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                node.pulsePhase += node.pulseSpeed;
                const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;

                ctx.globalAlpha = 0.2 * pulse;
                ctx.fillStyle = colors.pulse;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
                ctx.fill();

                ctx.globalAlpha = 0.6 + pulse * 0.4;
                ctx.fillStyle = colors.node;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function initOrbitAnimation(canvas, ctx) {
        function getColors() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark'
                ? { orbit1: '#60a5fa', orbit2: '#2dd4bf', orbit3: '#a78bfa', orbit4: '#f472b6' }
                : { orbit1: '#3b82f6', orbit2: '#14b8a6', orbit3: '#7c3aed', orbit4: '#ec4899' };
        }

        const orbiters = [];
        const centerCount = 4;

        for (let i = 0; i < centerCount; i += 1) {
            const center = {
                x: (canvas.width / (centerCount + 1)) * (i + 1),
                y: canvas.height / 2 + (Math.random() - 0.5) * 200,
                satellites: []
            };

            const satelliteCount = 2 + Math.floor(Math.random() * 3);
            for (let j = 0; j < satelliteCount; j += 1) {
                center.satellites.push({
                    angle: (Math.PI * 2 / satelliteCount) * j,
                    distance: 60 + Math.random() * 80,
                    speed: 0.01 + Math.random() * 0.02,
                    size: 3 + Math.random() * 5,
                    color: ['orbit1', 'orbit2', 'orbit3', 'orbit4'][Math.floor(Math.random() * 4)]
                });
            }

            orbiters.push(center);
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const colors = getColors();

            orbiters.forEach(orbiter => {
                ctx.globalAlpha = 0.15;
                ctx.fillStyle = colors.orbit1;
                ctx.beginPath();
                ctx.arc(orbiter.x, orbiter.y, 8, 0, Math.PI * 2);
                ctx.fill();

                ctx.globalAlpha = 0.08;
                ctx.strokeStyle = colors.orbit1;
                ctx.lineWidth = 1;
                orbiter.satellites.forEach(sat => {
                    ctx.beginPath();
                    ctx.arc(orbiter.x, orbiter.y, sat.distance, 0, Math.PI * 2);
                    ctx.stroke();
                });

                orbiter.satellites.forEach(sat => {
                    sat.angle += sat.speed;
                    const x = orbiter.x + Math.cos(sat.angle) * sat.distance;
                    const y = orbiter.y + Math.sin(sat.angle) * sat.distance;

                    ctx.globalAlpha = 0.4;
                    ctx.fillStyle = colors[sat.color];
                    ctx.beginPath();
                    ctx.arc(x, y, sat.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function initPaperPlaneAnimation(canvas, ctx) {
        function getColors() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark'
                ? { plane: '#60a5fa', trail: '#3b82f6', accent: '#f59e0b' }
                : { plane: '#3b82f6', trail: '#93c5fd', accent: '#f97316' };
        }

        const planes = [];
        const planeCount = 9;

        for (let i = 0; i < planeCount; i += 1) {
            planes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: 0.5 + Math.random() * 0.9,
                vy: (Math.random() - 0.5) * 0.35,
                size: 18 + Math.random() * 22,
                opacity: 0.1 + Math.random() * 0.18,
                rotation: 0,
                bobPhase: Math.random() * Math.PI * 2,
                bobSpeed: 0.02 + Math.random() * 0.02,
                trail: []
            });
        }

        function drawPlane(plane) {
            const colors = getColors();
            const bob = Math.sin(plane.bobPhase) * 5;

            ctx.save();
            ctx.globalAlpha = plane.opacity;
            ctx.translate(plane.x, plane.y + bob);
            ctx.rotate(plane.rotation);

            ctx.fillStyle = colors.plane;
            ctx.beginPath();
            ctx.moveTo(plane.size, 0);
            ctx.lineTo(-plane.size * 0.6, -plane.size * 0.4);
            ctx.lineTo(-plane.size * 0.4, 0);
            ctx.lineTo(-plane.size * 0.6, plane.size * 0.4);
            ctx.closePath();
            ctx.fill();

            ctx.globalAlpha = plane.opacity * 0.45;
            ctx.strokeStyle = colors.trail;
            ctx.lineWidth = 2;
            ctx.beginPath();
            plane.trail.forEach((point, i) => {
                if (i === 0) ctx.moveTo(point.x - plane.x, point.y - plane.y);
                else ctx.lineTo(point.x - plane.x, point.y - plane.y);
            });
            ctx.stroke();

            ctx.restore();
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            planes.forEach(plane => {
                plane.x += plane.vx;
                plane.y += plane.vy;
                plane.bobPhase += plane.bobSpeed;
                plane.rotation = Math.atan2(plane.vy, plane.vx);

                plane.trail.unshift({ x: plane.x, y: plane.y });
                if (plane.trail.length > 14) plane.trail.pop();

                if (plane.x > canvas.width + 55) {
                    plane.x = -55;
                    plane.trail = [];
                }
                if (plane.y < -55) plane.y = canvas.height + 55;
                if (plane.y > canvas.height + 55) plane.y = -55;

                drawPlane(plane);
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function initQuotesAnimation(canvas, ctx) {
        function getColors() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark'
                ? { quote: '#60a5fa', star: '#fbbf24' }
                : { quote: '#3b82f6', star: '#f59e0b' };
        }

        const elements = [];

        for (let i = 0; i < 11; i += 1) {
            elements.push({
                type: 'quote',
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                char: '"',
                size: 30 + Math.random() * 40,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: 0.08 + Math.random() * 0.13,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.003
            });
        }

        for (let i = 0; i < 14; i += 1) {
            elements.push({
                type: 'star',
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 8 + Math.random() * 14,
                speedX: (Math.random() - 0.5) * 0.25,
                speedY: (Math.random() - 0.5) * 0.25,
                opacity: 0.1 + Math.random() * 0.16,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.03 + Math.random() * 0.03
            });
        }

        function drawStar(x, y, size, rotation) {
            ctx.beginPath();
            for (let i = 0; i < 5; i += 1) {
                const angle = (Math.PI / 2.5) * i + rotation;
                const radius = i % 2 === 0 ? size : size / 2;
                const px = x + Math.cos(angle) * radius;
                const py = y + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const colors = getColors();

            elements.forEach(el => {
                el.x += el.speedX;
                el.y += el.speedY;

                if (el.x < -55) el.x = canvas.width + 55;
                if (el.x > canvas.width + 55) el.x = -55;
                if (el.y < -55) el.y = canvas.height + 55;
                if (el.y > canvas.height + 55) el.y = -55;

                if (el.type === 'quote') {
                    el.rotation += el.rotationSpeed;
                    ctx.save();
                    ctx.globalAlpha = el.opacity;
                    ctx.translate(el.x, el.y);
                    ctx.rotate(el.rotation);
                    ctx.font = el.size + 'px Georgia, serif';
                    ctx.fillStyle = colors.quote;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(el.char, 0, 0);
                    ctx.restore();
                } else {
                    el.pulsePhase += el.pulseSpeed;
                    const pulse = Math.sin(el.pulsePhase) * 0.5 + 0.5;
                    ctx.globalAlpha = el.opacity * (0.6 + pulse * 0.4);
                    ctx.fillStyle = colors.star;
                    drawStar(el.x, el.y, el.size, el.pulsePhase);
                }
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function initLinesAnimation(canvas, ctx) {
        function getColors() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark'
                ? { line: '#475569', accent: '#60a5fa' }
                : { line: '#cbd5e1', accent: '#3b82f6' };
        }

        const lines = [];
        const lineCount = 35;

        for (let i = 0; i < lineCount; i += 1) {
            lines.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                width: 80 + Math.random() * 180,
                speedX: 0.1 + Math.random() * 0.22,
                opacity: 0.05 + Math.random() * 0.08,
                isAccent: Math.random() > 0.86
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const colors = getColors();

            lines.forEach(line => {
                line.x += line.speedX;
                if (line.x > canvas.width + line.width) line.x = -line.width;

                ctx.globalAlpha = line.opacity;
                ctx.strokeStyle = line.isAccent ? colors.accent : colors.line;
                ctx.lineWidth = line.isAccent ? 2 : 1;
                ctx.beginPath();
                ctx.moveTo(line.x, line.y);
                ctx.lineTo(line.x + line.width, line.y);
                ctx.stroke();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function initGameSymbolsAnimation(canvas, ctx) {
        /* Floating retro game symbols: ▲ ● ■ ◆ ★ */
        const symbols = ['▲', '●', '■', '◆', '★', '▷', '○', '□'];
        const particles = [];
        const count = 55;

        function getCol() {
            const t = document.documentElement.getAttribute('data-theme') || 'light';
            return t === 'dark' ? '#2dd4bf' : '#14b8a6';
        }

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * 200,
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                size: 8 + Math.random() * 16,
                speed: 0.3 + Math.random() * 0.6,
                opacity: 0.04 + Math.random() * 0.1,
                drift: (Math.random() - 0.5) * 0.4,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.01
            });
        }

        function frame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const col = getCol();
            particles.forEach(p => {
                p.y -= p.speed;
                p.x += p.drift;
                p.rotation += p.rotSpeed;
                if (p.y < -30) {
                    p.y = canvas.height + 20;
                    p.x = Math.random() * canvas.width;
                }
                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = col;
                ctx.font = p.size + 'px sans-serif';
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillText(p.symbol, -p.size / 2, p.size / 2);
                ctx.restore();
            });
            requestAnimationFrame(frame);
        }
        frame();
    }

    function initNsoloSeedsAnimation(canvas, ctx) {
        /* Mancala seed drift — small circles drifting in gentle arcs */
        function getCol() {
            const t = document.documentElement.getAttribute('data-theme') || 'light';
            return t === 'dark' ? '#2dd4bf' : '#14b8a6';
        }

        const seeds = [];
        const count = 45;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            seeds.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: 2 + Math.random() * 4,
                speed: 0.25 + Math.random() * 0.45,
                angle: angle,
                angleSpeed: (Math.random() - 0.5) * 0.008,
                opacity: 0.05 + Math.random() * 0.12,
                arcRadius: 40 + Math.random() * 120,
                phase: Math.random() * Math.PI * 2
            });
        }

        function frame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const col = getCol();
            seeds.forEach(s => {
                s.phase += s.speed * 0.012;
                s.angle += s.angleSpeed;
                s.x += Math.cos(s.angle) * s.speed * 0.5;
                s.y += Math.sin(s.angle) * s.speed * 0.5;
                if (s.x < -10) s.x = canvas.width + 10;
                if (s.x > canvas.width + 10) s.x = -10;
                if (s.y < -10) s.y = canvas.height + 10;
                if (s.y > canvas.height + 10) s.y = -10;

                ctx.save();
                ctx.globalAlpha = s.opacity;
                ctx.fillStyle = col;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    // =============================================
    // MULTI-COLOR FLOATING SYMBOLS
    // =============================================
    function initFloatingCodeSymbols() {
        const existing = document.querySelector('.bg-symbol-layer');
        if (existing) existing.remove();
        if (!document.body.classList.contains('youth-day-2026')) return;

        const page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
        const symbolMap = {
            'index.html': ['<>', '{}', '[]', '=>', '//'],
            'services.html': ['{}', '<>', 'API', 'DB', '()'],
            'portfolio.html': ['<UI/>', '{app}', 'git', 'v2', 'ship'],
            'about.html': ['team', 'grow', 'learn', 'build', 'code'],
            'contact.html': ['mail', 'msg', 'idea', 'plan', 'ping'],
            'testimonials.html': ['quote', 'trust', 'wow', 'stars', 'ship'],
            'privacy.html': ['data', 'safe', 'lock', 'policy', 'sec'],
            'terms.html': ['terms', 'rights', 'scope', 'legal', 'trust']
        };
        const palette = ['#facc15', '#ef4444', '#22c55e', '#3b82f6', '#a855f7'];

        const layer = document.createElement('div');
        layer.className = 'bg-symbol-layer';

        const symbols = symbolMap[page] || symbolMap['index.html'];
        const count = window.innerWidth < 768 ? 10 : 18;

        for (let i = 0; i < count; i += 1) {
            const node = document.createElement('span');
            node.className = 'bg-symbol';
            node.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            node.style.left = Math.round(Math.random() * 96) + '%';
            node.style.top = Math.round(Math.random() * 105) + '%';
            node.style.fontSize = (0.8 + Math.random() * 0.65).toFixed(2) + 'rem';
            node.style.color = palette[Math.floor(Math.random() * palette.length)];
            node.style.animationDuration = (16 + Math.random() * 18).toFixed(2) + 's';
            node.style.animationDelay = (-Math.random() * 18).toFixed(2) + 's';
            layer.appendChild(node);
        }

        document.body.appendChild(layer);
    }

    // =============================================
    // CONTACT FORM
    // =============================================
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const successMsg = document.getElementById('formSuccess');
        const errorMsg = document.getElementById('formError');
        if (!form) return;

        const submitBtn = form.querySelector('.submit-button');
        const regionSelect = form.querySelector('#region');
        const currencySelect = form.querySelector('#currency');
        const currencyLabel = form.querySelector('#currencyLabel');
        const projectTypeSelect = form.querySelector('#projectType');
        const budgetSelect = form.querySelector('#budget');
        const budgetHint = form.querySelector('#budgetHint');

        // Default budget tiers for all project types except System Development
        const budgetMapDefault = {
            USD_ZW: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-300-600', label: 'Starter: USD 300 - 600' },
                { value: 'usd-600-1000', label: 'Standard: USD 600 - 1,000' },
                { value: 'usd-1000-1800', label: 'Professional: USD 1,000 - 1,800' },
                { value: 'usd-1800+', label: 'Enterprise: USD 1,800+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            USD_USCA: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-700-1500', label: 'Starter: USD 700 - 1,500' },
                { value: 'usd-1500-2500', label: 'Standard: USD 1,500 - 2,500' },
                { value: 'usd-2500-4000', label: 'Professional: USD 2,500 - 4,000' },
                { value: 'usd-4000+', label: 'Enterprise: USD 4,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            USD_WE: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-500-900', label: 'Starter: USD 500 - 900' },
                { value: 'usd-900-1500', label: 'Standard: USD 900 - 1,500' },
                { value: 'usd-1500-2500', label: 'Professional: USD 1,500 - 2,500' },
                { value: 'usd-2500+', label: 'Enterprise: USD 2,500+' }
            ],
            USD_NAM: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-800-1500', label: 'Starter: USD 800 - 1,500' },
                { value: 'usd-1500-2800', label: 'Standard: USD 1,500 - 2,800' },
                { value: 'usd-2800-5000', label: 'Professional: USD 2,800 - 5,000' },
                { value: 'usd-5000+', label: 'Enterprise: USD 5,000+' }
            ],
            USD: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-300-700', label: 'Starter: USD 300 - 700' },
                { value: 'usd-700-1500', label: 'Standard: USD 700 - 1,500' },
                { value: 'usd-1500-3000', label: 'Professional: USD 1,500 - 3,000' },
                { value: 'usd-3000+', label: 'Enterprise: USD 3,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            ZMW: [
                { value: '', label: 'Select budget range' },
                { value: 'zmw-2000-3500', label: 'Starter: ZMW 2,000 - 3,500' },
                { value: 'zmw-3500-5500', label: 'Standard: ZMW 3,500 - 5,500' },
                { value: 'zmw-5500-8000', label: 'Professional: ZMW 5,500 - 8,000' },
                { value: 'zmw-8000+', label: 'Enterprise: ZMW 8,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            ZAR: [
                { value: '', label: 'Select budget range' },
                { value: 'zar-2500-4500', label: 'Starter: ZAR 2,500 - 4,500' },
                { value: 'zar-4500-7000', label: 'Standard: ZAR 4,500 - 7,000' },
                { value: 'zar-7000-10000', label: 'Professional: ZAR 7,000 - 10,000' },
                { value: 'zar-10000+', label: 'Enterprise: ZAR 10,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            GBP: [
                { value: '', label: 'Select budget range' },
                { value: 'gbp-500-900', label: 'Starter: GBP 500 - 900' },
                { value: 'gbp-900-1400', label: 'Standard: GBP 900 - 1,400' },
                { value: 'gbp-1400-2000', label: 'Professional: GBP 1,400 - 2,000' },
                { value: 'gbp-2000+', label: 'Enterprise: GBP 2,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            EUR: [
                { value: '', label: 'Select budget range' },
                { value: 'eur-550-1000', label: 'Starter: EUR 550 - 1,000' },
                { value: 'eur-1000-1600', label: 'Standard: EUR 1,000 - 1,600' },
                { value: 'eur-1600-2300', label: 'Professional: EUR 1,600 - 2,300' },
                { value: 'eur-2300+', label: 'Enterprise: EUR 2,300+' },
                { value: 'flexible', label: 'Flexible' }
            ]
        };

        // Budget tiers specifically for System Development
        const budgetMapSystems = {
            USD_ZW: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-700-1200', label: 'Starter: USD 700 - 1,200' },
                { value: 'usd-1200-2000', label: 'Standard: USD 1,200 - 2,000' },
                { value: 'usd-2000-3500', label: 'Professional: USD 2,000 - 3,500' },
                { value: 'usd-3500+', label: 'Enterprise: USD 3,500+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            USD_USCA: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-2000-3500', label: 'Starter: USD 2,000 - 3,500' },
                { value: 'usd-3500-6000', label: 'Standard: USD 3,500 - 6,000' },
                { value: 'usd-6000-10000', label: 'Professional: USD 6,000 - 10,000' },
                { value: 'usd-10000+', label: 'Enterprise: USD 10,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            USD_WE: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-1000-2000', label: 'Starter: USD 1,000 - 2,000' },
                { value: 'usd-2000-3500', label: 'Standard: USD 2,000 - 3,500' },
                { value: 'usd-3500-6000', label: 'Professional: USD 3,500 - 6,000' },
                { value: 'usd-6000+', label: 'Enterprise: USD 6,000+' }
            ],
            USD_NAM: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-2000-3500', label: 'Starter: USD 2,000 - 3,500' },
                { value: 'usd-3500-6000', label: 'Standard: USD 3,500 - 6,000' },
                { value: 'usd-6000-10000', label: 'Professional: USD 6,000 - 10,000' },
                { value: 'usd-10000+', label: 'Enterprise: USD 10,000+' }
            ],
            USD: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-700-1200', label: 'Starter: USD 700 - 1,200' },
                { value: 'usd-1200-2000', label: 'Standard: USD 1,200 - 2,000' },
                { value: 'usd-2000-3500', label: 'Professional: USD 2,000 - 3,500' },
                { value: 'usd-3500+', label: 'Enterprise: USD 3,500+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            ZMW: [
                { value: '', label: 'Select budget range' },
                { value: 'zmw-5000-8000', label: 'Starter: ZMW 5,000 - 8,000' },
                { value: 'zmw-8000-12000', label: 'Standard: ZMW 8,000 - 12,000' },
                { value: 'zmw-12000-18000', label: 'Professional: ZMW 12,000 - 18,000' },
                { value: 'zmw-18000+', label: 'Enterprise: ZMW 18,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            ZAR: [
                { value: '', label: 'Select budget range' },
                { value: 'zar-6500-10000', label: 'Starter: ZAR 6,500 - 10,000' },
                { value: 'zar-10000-15000', label: 'Standard: ZAR 10,000 - 15,000' },
                { value: 'zar-15000-22000', label: 'Professional: ZAR 15,000 - 22,000' },
                { value: 'zar-22000+', label: 'Enterprise: ZAR 22,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            GBP: [
                { value: '', label: 'Select budget range' },
                { value: 'gbp-1200-2000', label: 'Starter: GBP 1,200 - 2,000' },
                { value: 'gbp-2000-3200', label: 'Standard: GBP 2,000 - 3,200' },
                { value: 'gbp-3200-5000', label: 'Professional: GBP 3,200 - 5,000' },
                { value: 'gbp-5000+', label: 'Enterprise: GBP 5,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            EUR: [
                { value: '', label: 'Select budget range' },
                { value: 'eur-1400-2200', label: 'Starter: EUR 1,400 - 2,200' },
                { value: 'eur-2200-3500', label: 'Standard: EUR 2,200 - 3,500' },
                { value: 'eur-3500-5500', label: 'Professional: EUR 3,500 - 5,500' },
                { value: 'eur-5500+', label: 'Enterprise: EUR 5,500+' },
                { value: 'flexible', label: 'Flexible' }
            ]
        };

        function getRegionConfig(regionCode) {
            const map = {
                'zambia': {
                    label: 'Zambia', currency: 'ZMW', budgetKey: 'ZMW'
                },
                'zimbabwe-usd': {
                    label: 'Zimbabwe', currency: 'USD', budgetKey: 'USD_ZW'
                },
                'southern-africa-usd': {
                    label: 'Southern Africa', currency: 'USD', budgetKey: 'USD_ZW'
                },
                'west-east-africa': {
                    label: 'West & East Africa', currency: 'USD', budgetKey: 'USD_WE'
                },
                'north-africa-me': {
                    label: 'North Africa & Middle East', currency: 'USD', budgetKey: 'USD_NAM'
                },
                'south-africa': {
                    label: 'South Africa', currency: 'ZAR', budgetKey: 'ZAR'
                },
                'uk': {
                    label: 'UK', currency: 'GBP', budgetKey: 'GBP'
                },
                'europe': {
                    label: 'Europe', currency: 'EUR', budgetKey: 'EUR'
                },
                'us-canada': {
                    label: 'US & Canada', currency: 'USD', budgetKey: 'USD_USCA'
                },
                'other-international': {
                    label: 'Other / International', currency: 'USD', budgetKey: 'USD'
                }
            };
            return map[regionCode] || map['other-international'];
        }

        function detectRegionByLocale() {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            const locale = (navigator.language || '').toUpperCase();
            const region = locale.includes('-') ? locale.split('-')[1] : '';

            if (tz.indexOf('Africa/Lusaka') === 0 || region === 'ZM') return 'zambia';
            if (region === 'ZW') return 'zimbabwe-usd';
            if (tz.indexOf('Africa/Johannesburg') === 0 || region === 'ZA') return 'south-africa';
            if (tz.indexOf('Europe/London') === 0 || region === 'GB') return 'uk';
            if (tz.indexOf('Europe/') === 0 && region !== 'GB') return 'europe';
            if (region === 'US' || region === 'CA') return 'us-canada';
            if (tz.indexOf('Africa/') === 0) return 'zambia';
            return 'other-international';
        }

        function detectCurrencyByRegion() {
            if (regionSelect) return getRegionConfig(detectRegionByLocale()).currency;

            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            const locale = (navigator.language || '').toUpperCase();
            const region = locale.includes('-') ? locale.split('-')[1] : '';

            if (tz.indexOf('Africa/Lusaka') === 0 || region === 'ZM') return 'ZMW';
            if (tz.indexOf('Africa/Johannesburg') === 0 || region === 'ZA') return 'ZAR';
            if (tz.indexOf('Europe/London') === 0 || region === 'GB') return 'GBP';
            if (tz.indexOf('Europe/') === 0 && region !== 'GB') return 'EUR';
            if (region === 'US' || region === 'CA') return 'USD';
            return 'USD';
        }

        function getBudgetKey() {
            if (regionSelect) return getRegionConfig(regionSelect.value).budgetKey;
            return currencySelect ? currencySelect.value : 'USD';
        }

        function updateCurrencyLabel() {
            if (!regionSelect) return;
            const region = getRegionConfig(regionSelect.value);
            if (currencySelect) currencySelect.value = region.currency;
            if (currencyLabel) currencyLabel.textContent = region.currency;
        }

        function renderBudgetOptions(currencyCode) {
            if (!budgetSelect) return;

            const projectType = projectTypeSelect ? projectTypeSelect.value : '';
            const isSystems = projectType === 'system';
            const budgetMap = isSystems ? budgetMapSystems : budgetMapDefault;

            const options = budgetMap[currencyCode] || budgetMap.USD;
            budgetSelect.innerHTML = options.map(option => '<option value="' + option.value + '">' + option.label + '</option>').join('');

            if (budgetHint) {
                const tierType = isSystems ? ' (System Development pricing)' : '';
                if (regionSelect) {
                    const region = getRegionConfig(regionSelect.value);
                    budgetHint.textContent = 'Budget adjusted for ' + region.label + ' (' + region.currency + ')' + tierType + '.';
                } else {
                    budgetHint.textContent = 'Budget adjusted for ' + currencyCode + tierType + '. You can change currency or project type manually.';
                }
            }
        }

        if (regionSelect) {
            const detectedRegion = detectRegionByLocale();
            regionSelect.value = detectedRegion;
            updateCurrencyLabel();
            renderBudgetOptions(getBudgetKey());
            regionSelect.addEventListener('change', () => {
                updateCurrencyLabel();
                renderBudgetOptions(getBudgetKey());
            });
        } else if (currencySelect) {
            const detectedCurrency = detectCurrencyByRegion();
            currencySelect.value = detectedCurrency;
            renderBudgetOptions(detectedCurrency);
            currencySelect.addEventListener('change', () => renderBudgetOptions(currencySelect.value));
        } else {
            renderBudgetOptions('USD');
        }

        // Update budget options when project type changes
        if (projectTypeSelect) {
            projectTypeSelect.addEventListener('change', () => {
                renderBudgetOptions(getBudgetKey());
            });
        }

        let formLoadTime = Date.now();

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const honeypot = form.querySelector('#website');
            if (honeypot && honeypot.value) {
                if (successMsg) successMsg.style.display = 'flex';
                form.reset();
                return;
            }

            if (Date.now() - formLoadTime < 3000) {
                if (successMsg) successMsg.style.display = 'flex';
                form.reset();
                return;
            }

            if (successMsg) successMsg.style.display = 'none';
            if (errorMsg) errorMsg.style.display = 'none';

            const formData = {
                name: form.querySelector('#name') ? form.querySelector('#name').value : '',
                email: form.querySelector('#email') ? form.querySelector('#email').value : '',
                company: form.querySelector('#company') ? form.querySelector('#company').value : '',
                projectType: form.querySelector('#projectType') ? form.querySelector('#projectType').value : '',
                currency: form.querySelector('#currency') ? form.querySelector('#currency').value : 'USD',
                budget: form.querySelector('#budget') ? form.querySelector('#budget').value : '',
                timeline: form.querySelector('#timeline') ? form.querySelector('#timeline').value : '',
                message: form.querySelector('#message') ? form.querySelector('#message').value : '',
                timestamp: new Date().toISOString()
            };

            if (!validateEmail(formData.email)) {
                const emailInput = form.querySelector('#email');
                if (emailInput) {
                    emailInput.style.borderColor = '#dc2626';
                    emailInput.focus();
                }
                return;
            }

            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }

            const handleSuccess = () => {
                if (successMsg) {
                    successMsg.style.display = 'flex';
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                form.reset();
                if (currencySelect) {
                    const detectedCurrency = detectCurrencyByRegion();
                    currencySelect.value = detectedCurrency;
                    renderBudgetOptions(detectedCurrency);
                }
                formLoadTime = Date.now();
            };

            const handleError = () => {
                if (errorMsg) {
                    errorMsg.style.display = 'flex';
                    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            };

            try {
                const endpoint = 'https://formspree.io/f/xgoldrwl';
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) throw new Error('Submission failed');

                // Trigger plane-fly animation on success
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.classList.add('sending');

                    // Wait for animation to finish before showing success message
                    setTimeout(() => {
                        submitBtn.classList.remove('sending');
                        submitBtn.disabled = false;

                        if (successMsg) {
                            successMsg.style.display = 'flex';
                            successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }

                        form.reset();
                        if (regionSelect) {
                            const detectedRegion = detectRegionByLocale();
                            regionSelect.value = detectedRegion;
                            updateCurrencyLabel();
                            renderBudgetOptions(getBudgetKey());
                        } else if (currencySelect) {
                            const detectedCurrency = detectCurrencyByRegion();
                            currencySelect.value = detectedCurrency;
                            renderBudgetOptions(detectedCurrency);
                        }

                        formLoadTime = Date.now();
                    }, 700); // Match the plane-fly animation duration
                } else {
                    if (successMsg) {
                        successMsg.style.display = 'flex';
                        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }

                    form.reset();
                    if (regionSelect) {
                        const detectedRegion = detectRegionByLocale();
                        regionSelect.value = detectedRegion;
                        updateCurrencyLabel();
                        renderBudgetOptions(getBudgetKey());
                    } else if (currencySelect) {
                        const detectedCurrency = detectCurrencyByRegion();
                        currencySelect.value = detectedCurrency;
                        renderBudgetOptions(detectedCurrency);
                    }

                    formLoadTime = Date.now();
                }
            } catch (error) {
                // Trigger plane-crash animation on error
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.classList.add('crash');

                    // Wait for animation to finish before showing error message
                    setTimeout(() => {
                        submitBtn.classList.remove('crash');
                        submitBtn.disabled = false;
                        handleError();
                    }, 600); // Match the plane-crash animation duration
                } else {
                    handleError();
                }
            }
        });

        const emailInput = form.querySelector('#email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                if (emailInput.value && !validateEmail(emailInput.value)) emailInput.style.borderColor = '#dc2626';
                else emailInput.style.borderColor = '';
            });
            emailInput.addEventListener('input', () => {
                emailInput.style.borderColor = '';
            });
        }
    }

    // =============================================
    // URL PARAMS
    // =============================================
    function prefillFromURL() {
        const params = new URLSearchParams(window.location.search);
        const serviceParam = params.get('service');
        if (!serviceParam) return;

        const projectType = document.getElementById('projectType');
        if (!projectType) return;

        const optionMap = {
            website: 'website',
            webapp: 'webapp',
            mobile: 'mobile',
            system: 'system',
            consulting: 'consulting'
        };

        const value = optionMap[serviceParam];
        if (value) projectType.value = value;
    }

    // =============================================
    // UTILITIES
    // =============================================
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function scrollToContact() {
        const contact = document.getElementById('contact');
        if (!contact) return;

        const nav = document.querySelector('.main-nav');
        const navHeight = nav ? nav.offsetHeight : 70;
        const pos = contact.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: pos, behavior: 'smooth' });
    }

    window.scrollToContact = scrollToContact;

    function updateCopyrightYear() {
        const yearSpan = document.getElementById('year');
        if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());
    }

    // =============================================
    // FOOTER INJECTION
    // =============================================
    function loadFooter() {
        if (document.querySelector('body > footer') || document.querySelector('main + footer')) {
            updateCopyrightYear();
            return;
        }

        const fallbackFooter = [
            '<footer>',
            '  <div class="footer-content">',
            '    <div class="footer-grid">',
            '      <div class="footer-brand">',
            '        <div class="footer-logo"><svg class="footer-icon" viewBox="0 0 397 395" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M139.589 352.085C87.7618 345.654 81.9704 339.492 46.5888 319.085C43.3888 319.485 43.5888 322.251 44.0888 323.585C47.5888 327.418 54.6888 335.285 55.0888 336.085C55.4888 336.885 62.5888 343.418 66.0888 346.585C68.5888 349.251 74.3888 354.885 77.5888 356.085C78.0888 356.085 89.0888 366.585 99.0888 370.085C99.0888 371.085 127.589 384.085 135.589 386.085C135.989 386.885 155.755 390.751 165.589 392.585C171.755 393.418 185.089 394.885 189.089 394.085C189.489 394.885 204.922 393.751 212.589 393.085L215.589 392.585C225.089 391.251 246.889 387.385 258.089 382.585C258.589 383.085 300.589 363.585 313.089 352.585C314.289 352.985 332.922 334.418 342.089 325.085C346.755 320.085 357.589 307.285 363.589 296.085C364.589 294.085 374.089 281.085 379.089 265.585C380.589 263.585 386.589 247.585 390.089 231.585C393.51 215.947 395.589 195.585 395.589 195.085V164.085C395.255 157.085 393.489 139.585 389.089 125.585C383.589 108.085 384.589 110.585 383.589 108.085C382.089 105.585 376.589 91.5845 374.089 88.0845C371.589 84.5845 363.089 69.5845 362.589 69.5845C362.089 69.5845 355.589 59.0845 351.089 55.0845C348.589 53.0845 338.089 40.5845 328.589 33.5845C320.589 28.0845 310.589 21.0845 304.589 18.0845C303.589 17.0845 290.589 12.0845 290.089 11.5845C289.589 11.0845 282.089 8.58453 285.089 9.58452C279.589 7.08452 259.589 2.58453 255.089 2.08452C253.978 1.96105 240.589 0.0845171 239.589 0.584517C238.589 1.08452 238.589 3.08452 239.589 3.58452C246.089 6.08452 265.589 13.0845 282.589 27.5845C302.589 47.1845 312.922 61.7512 315.589 66.5845C321.422 76.4178 334.289 102.385 339.089 127.585C341.589 132.085 342.589 179.585 339.089 196.585C335.589 213.585 326.089 243.085 310.589 267.085C306.089 273.585 290.089 294.585 272.089 309.085C257.689 320.685 245.755 327.585 241.589 329.585C223.255 339.085 177.189 356.885 139.589 352.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/></svg><span>NextPhases</span></div>',
            '        <p class="footer-tagline">Engineering your next phase of success.</p>',
            '        <div class="footer-socials">',
            '          <a href="https://github.com/NextPhasesDev" class="social-link" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>',
            '          <a href="https://x.com/NextPhases" class="social-link" target="_blank" rel="noopener" aria-label="Twitter"><i class="fab fa-twitter"></i></a>',
            '          <a href="https://www.tiktok.com/@nextphases.dev?lang=en" class="social-link" target="_blank" rel="noopener" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>',
            '          <a href="https://www.instagram.com/nextphases.dev/" class="social-link" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>',
            '          <a href="https://www.linkedin.com/company/nextphases" class="social-link" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>',
            '          <a href="https://discord.gg/DkybgpuRwp" class="social-link" target="_blank" rel="noopener" aria-label="Discord"><i class="fab fa-discord"></i></a>',
            '        </div>',
            '      </div>',
            '      <div class="footer-column"><h4>Services</h4><ul><li><a href="/services.html#web-dev">Web Development</a></li><li><a href="/services.html#app-dev">App Development</a></li><li><a href="/services.html#consulting">Consulting</a></li></ul></div>',
            '      <div class="footer-column"><h4>Projects</h4><ul><li><a href="/portfolio.html#examguard">ExamGuard</a></li><li><a href="/games/nsolo">Nsolo</a></li><li><a href="/portfolio.html">View All</a></li></ul></div>',
            '      <div class="footer-column"><h4>Company</h4><ul><li><a href="/about.html">About Us</a></li><li><a href="/testimonials.html">Testimonials</a></li><li><a href="/contact.html">Contact</a></li><li><a href="/privacy.html">Privacy Policy</a></li><li><a href="/terms.html">Terms of Service</a></li></ul></div>',
            '      <div class="footer-column"><h4>Get in Touch</h4><ul class="footer-contact-list"><li><i class="fas fa-envelope"></i><a href="mailto:info@nextphases.dev">info@nextphases.dev</a></li><li><i class="fas fa-map-marker-alt"></i><span>Lusaka, Zambia</span></li></ul></div>',
            '    </div>',
            '    <div class="footer-bottom"><p>&copy; <span id="year"></span> NextPhases. All Rights Reserved.</p></div>',
            '  </div>',
            '</footer>'
        ].join('');

        function injectFooter(html) {
            const scrollBtn = document.querySelector('.scroll-to-top');
            if (scrollBtn) scrollBtn.insertAdjacentHTML('beforebegin', html);
            else document.body.insertAdjacentHTML('beforeend', html);
            updateCopyrightYear();
        }

        fetch(resolveSitePath('footer.html'))
            .then(response => {
                if (!response.ok) throw new Error('Footer not found');
                return response.text();
            })
            .then(injectFooter)
            .catch(() => {
                injectFooter(fallbackFooter);
            });
    }

    // =============================================
    // WELCOME GUIDE
    // =============================================
    function initWelcomeGuide() {
        const helpButton = document.getElementById('helpGuideButton');
        const modal = document.getElementById('helpGuideModal');
        const closeButton = document.getElementById('helpGuideClose');

        if (!helpButton || !modal || !closeButton) return;

        function openGuide() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeGuide() {
            modal.classList.remove('active');
            document.body.style.overflow = document.body.classList.contains('nav-open') ? 'hidden' : '';
        }

        helpButton.addEventListener('click', openGuide);
        closeButton.addEventListener('click', closeGuide);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeGuide();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeGuide();
        });
    }

    // =============================================
    // YOUTH DAY LOGO EASTER EGG - CLICK ANYTIME
    // =============================================
    function initYouthDayLogoEasterEgg() {
        const homeLogo = document.querySelector('.logo-wrapper');
        if (!homeLogo) return;

        homeLogo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                homeLogo.click();
            }
        });

        homeLogo.addEventListener('click', (e) => {
            launchYouthBurst({ x: e.clientX, y: e.clientY }, {
                palette: ['#facc15', '#ef4444', '#22c55e', '#3b82f6', '#a855f7'],
                words: ['Youth', 'Build', 'Create', 'Shine', 'Lusaka'],
                confettiCount: 30,
                wordCount: 5
            });
        });
    }

    function showYouthToast(message, variant, duration) {
        const existing = document.querySelector('.youth-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'youth-toast ' + (variant || 'activate');
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('visible'));

        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 260);
        }, duration || 2800);
    }

    function launchYouthBurst(origin, options) {
        const settings = options || {};
        const palette = settings.palette || ['#facc15', '#ef4444', '#22c55e', '#3b82f6', '#a855f7'];
        const words = settings.words || ['Youth', 'Build', 'Create', 'Shine'];
        const confettiCount = settings.confettiCount || 24;
        const wordCount = settings.wordCount || Math.min(words.length, 5);

        const layer = document.createElement('div');
        layer.className = 'youth-burst-layer';
        document.body.appendChild(layer);

        const hasPoint = origin && typeof origin.x === 'number' && typeof origin.y === 'number';
        const rect = !hasPoint && origin && origin.getBoundingClientRect ? origin.getBoundingClientRect() : null;
        const centerX = hasPoint ? origin.x : (rect ? rect.left + (rect.width / 2) : window.innerWidth / 2);
        const centerY = hasPoint ? origin.y : (rect ? rect.top + (rect.height / 2) : window.innerHeight / 2);

        for (let i = 0; i < confettiCount; i += 1) {
            const piece = document.createElement('span');
            const angle = (Math.PI * 2 * i) / confettiCount + (Math.random() * 0.45);
            const distance = 80 + Math.random() * 140;
            piece.className = 'youth-confetti';
            piece.style.left = centerX + 'px';
            piece.style.top = centerY + 'px';
            piece.style.background = palette[i % palette.length];
            piece.style.setProperty('--burst-x', (Math.cos(angle) * distance).toFixed(2) + 'px');
            piece.style.setProperty('--burst-y', (Math.sin(angle) * distance - 90).toFixed(2) + 'px');
            piece.style.setProperty('--burst-rotate', (200 + Math.random() * 260).toFixed(0) + 'deg');
            piece.style.animationDelay = (Math.random() * 0.08).toFixed(2) + 's';
            layer.appendChild(piece);
        }

        for (let i = 0; i < wordCount; i += 1) {
            const word = document.createElement('span');
            const angle = (Math.PI * 2 * i) / wordCount + (Math.random() * 0.35);
            const distance = 48 + Math.random() * 84;
            word.className = 'youth-word-burst';
            word.textContent = words[i % words.length];
            word.style.left = centerX + 'px';
            word.style.top = centerY + 'px';
            word.style.color = palette[i % palette.length];
            word.style.setProperty('--word-x', (Math.cos(angle) * distance).toFixed(2) + 'px');
            word.style.setProperty('--word-y', (Math.sin(angle) * distance - 72).toFixed(2) + 'px');
            word.style.animationDelay = (0.04 + Math.random() * 0.1).toFixed(2) + 's';
            layer.appendChild(word);
        }

        setTimeout(() => {
            if (layer.parentNode) layer.remove();
        }, 2200);
    }

    function initYouthKeywordToggle() {
        let buffer = '';
        const target = 'youth';

        document.addEventListener('keydown', (e) => {
            const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
            if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) return;
            if (!e.key || e.key.length !== 1) return;

            buffer = (buffer + e.key.toLowerCase()).slice(-target.length);
            if (buffer !== target) return;
            buffer = '';

            document.body.classList.toggle('youth-day-2026');
            initFloatingCodeSymbols();

            const enabled = document.body.classList.contains('youth-day-2026');
            const centerPoint = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

            if (enabled) {
                showYouthToast('Youth Mode activated - welcome back to the celebration.', 'activate', 2800);
                launchYouthBurst(centerPoint, {
                    palette: ['#facc15', '#ef4444', '#22c55e', '#3b82f6', '#a855f7'],
                    words: ['Youth Mode', 'On', 'Celebrate', 'Build', 'Create'],
                    confettiCount: 22,
                    wordCount: 5
                });
            } else {
                showYouthToast('Goodbye for now - Youth Mode has been tucked away.', 'goodbye', 2600);
                launchYouthBurst(centerPoint, {
                    palette: ['#94a3b8', '#64748b', '#60a5fa'],
                    words: ['Goodbye', 'Later', 'See you'],
                    confettiCount: 12,
                    wordCount: 3
                });
            }
        });
    }
})();



