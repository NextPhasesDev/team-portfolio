// =============================================
// NextPhases — Master Script
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMoonAnimation();
    initScrollAnimations();
    initMobileNav();
    initSmartNavbar();
    initScrollToTop();
    initSmoothScrollLinks();
    initHeroEntrance();

    // Only init contact form if it exists on the page
    if (document.getElementById('contactForm')) {
        initContactForm();
        prefillFromURL();
    }

    // Update the copyright year dynamically
    updateCopyrightYear();

    // Load the footer
    loadFooter();
});

// =============================================
// THEME TOGGLE
// =============================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Load saved preference or default to light
    const saved = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', saved);

    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';

        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);

        // Update canvas theme colors
        if (window.moonAnimationContext) {
            window.moonAnimationContext.needsUpdate = true;
        }

        // Spin animation
        themeToggle.classList.remove('spinning');
        // Force reflow so removing + re-adding the class always re-triggers the animation
        void themeToggle.offsetWidth;
        themeToggle.classList.add('spinning');
        setTimeout(() => themeToggle.classList.remove('spinning'), 500);
    });
}

// =============================================
// SMART NAVBAR — Hide on scroll down, show on scroll up
// =============================================

function initSmartNavbar() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    let lastScroll = 0;
    let ticking = false;
    const threshold = 80; // px before hiding kicks in

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.scrollY;

                if (currentScroll <= threshold) {
                    // Always show at top
                    nav.classList.remove('hidden');
                } else if (currentScroll > lastScroll + 5) {
                    // Scrolling down — hide
                    nav.classList.add('hidden');
                    // Close mobile menu if open
                    const menu = document.getElementById('navMenu');
                    if (menu && menu.classList.contains('active')) {
                        menu.classList.remove('active');
                        resetHamburger();
                    }
                } else if (currentScroll < lastScroll - 5) {
                    // Scrolling up — show
                    nav.classList.remove('hidden');
                }

                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// =============================================
// MOBILE NAVIGATION
// =============================================

function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navContainer = document.querySelector('.nav-container');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');

        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        } else {
            resetHamburger();
        }
    });

    // Close menu on click outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && !navContainer.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            resetHamburger();
        }
    });

    // Close menu on nav link click (for mobile)
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            resetHamburger();
        });
    });
}

function resetHamburger() {
    const navToggle = document.getElementById('navToggle');
    if (!navToggle) return;
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
}

// =============================================
// SCROLL TO TOP BUTTON
// =============================================

function initScrollToTop() {
    const btn = document.getElementById('scrollToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// =============================================
// SMOOTH SCROLL FOR INTERNAL LINKS
// =============================================

function initSmoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.main-nav')?.offsetHeight || 70;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });
}

// =============================================
// HERO ENTRANCE ANIMATIONS
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
        }, 300 + (index * 150));
    });
}

// =============================================
// SCROLL ANIMATIONS (AOS-like)
// =============================================

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Respect data-aos-delay
                const delay = parseInt(entry.target.getAttribute('data-aos-delay')) || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
}

// =============================================
// BACKGROUND ANIMATION — Different per page
// =============================================

function initMoonAnimation() {
    const canvas = document.getElementById('moonCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    window.moonAnimationContext = ctx;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Detect which page we're on by checking the body class or URL
    const path = window.location.pathname;
    let animationType = 'moon'; // default

    if (path.includes('services.html')) animationType = 'code';
    else if (path.includes('portfolio.html')) animationType = 'grid';
    else if (path.includes('about.html')) animationType = 'orbit';
    else if (path.includes('contact.html')) animationType = 'paperplane';
    else if (path.includes('testimonials.html')) animationType = 'quotes';
    else if (path.includes('terms.html') || path.includes('privacy.html')) animationType = 'lines';

    // Initialize the appropriate animation
    switch(animationType) {
        case 'code': initCodeAnimation(canvas, ctx); break;
        case 'grid': initGridAnimation(canvas, ctx); break;
        case 'orbit': initOrbitAnimation(canvas, ctx); break;
        case 'paperplane': initPaperPlaneAnimation(canvas, ctx); break;
        case 'quotes': initQuotesAnimation(canvas, ctx); break;
        case 'lines': initLinesAnimation(canvas, ctx); break;
        default: initMoonPhaseAnimation(canvas, ctx);
    }
}

// =============================================
// ANIMATION 1: Moon Phase (Home Page)
// =============================================

function initMoonPhaseAnimation(canvas, ctx) {
    // Theme-aware colors
    function getColors() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        return theme === 'dark'
            ? { moon1: '#60a5fa', moon2: '#3b82f6', star: '#2dd4bf' }
            : { moon1: '#3b82f6', moon2: '#1e3a8a', star: '#14b8a6' };
    }

    // Stars
    const stars = [];
    const starCount = 60;
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 0.5 + Math.random() * 1.5,
            opacity: 0.08 + Math.random() * 0.15,
            twinkleSpeed: 0.01 + Math.random() * 0.02,
            twinklePhase: Math.random() * Math.PI * 2
        });
    }

    // Moons
    const moons = [];
    const moonCount = 30;
    for (let i = 0; i < moonCount; i++) {
        moons.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            phase: Math.random(),
            size: 20 + Math.random() * 55,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: 0.06 + Math.random() * 0.14,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.001
        });
    }

    function drawStar(star) {
        const c = getColors();
        ctx.save();
        const twinkle = Math.sin(star.twinklePhase) * 0.5 + 0.5;
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
            moon.x - moon.size * 0.3, moon.y - moon.size * 0.3, 0,
            moon.x, moon.y, moon.size
        );
        gradient.addColorStop(0, c.moon1);
        gradient.addColorStop(1, c.moon2);

        ctx.beginPath();
        ctx.arc(moon.x, moon.y, moon.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Phase shadow
        ctx.globalCompositeOperation = 'destination-out';
        const shadowOffset = (moon.phase - 0.5) * moon.size * 2;
        ctx.beginPath();
        ctx.ellipse(moon.x + shadowOffset, moon.y, moon.size, moon.size, 0, 0, Math.PI * 2);
        ctx.fill();

        // Crater details for larger moons
        if (moon.size > 40) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = moon.opacity * 0.25;
            ctx.fillStyle = c.moon2;
            ctx.beginPath();
            ctx.arc(moon.x + moon.size * 0.2, moon.y - moon.size * 0.3, moon.size * 0.12, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(moon.x - moon.size * 0.3, moon.y + moon.size * 0.2, moon.size * 0.08, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(moon.x + moon.size * 0.1, moon.y + moon.size * 0.15, moon.size * 0.06, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.twinklePhase += star.twinkleSpeed;
            star.x += 0.03;
            star.y += 0.01;
            if (star.x > canvas.width) star.x = 0;
            if (star.y > canvas.height) star.y = 0;
            drawStar(star);
        });

        moons.forEach(moon => {
            moon.x += moon.speedX;
            moon.y += moon.speedY;
            if (moon.x < -moon.size) moon.x = canvas.width + moon.size;
            if (moon.x > canvas.width + moon.size) moon.x = -moon.size;
            if (moon.y < -moon.size) moon.y = canvas.height + moon.size;
            if (moon.y > canvas.height + moon.size) moon.y = -moon.size;
            moon.phase += 0.0001;
            if (moon.phase > 1) moon.phase = 0;
            moon.rotation += moon.rotationSpeed;
            drawMoon(moon);
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// =============================================
// ANIMATION 2: Code Symbols (Services Page)
// =============================================

function initCodeAnimation(canvas, ctx) {
    function getColors() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        return theme === 'dark'
            ? { primary: '#60a5fa', secondary: '#2dd4bf', accent: '#a78bfa' }
            : { primary: '#3b82f6', secondary: '#14b8a6', accent: '#7c3aed' };
    }

    const symbols = ['</>',  '{}', '[]', '()', '<', '>', '{', '}', ';', '=', '+', '*'];
    const particles = [];
    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            symbol: symbols[Math.floor(Math.random() * symbols.length)],
            size: 18 + Math.random() * 28,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            opacity: 0.08 + Math.random() * 0.15,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.005,
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

            if (particle.x < -50) particle.x = canvas.width + 50;
            if (particle.x > canvas.width + 50) particle.x = -50;
            if (particle.y < -50) particle.y = canvas.height + 50;
            if (particle.y > canvas.height + 50) particle.y = -50;

            ctx.save();
            ctx.globalAlpha = particle.opacity;
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.font = `${particle.size}px "Courier New", monospace`;
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

// =============================================
// ANIMATION 3: Grid Nodes (Portfolio Page)
// =============================================

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

    for (let i = 0; i < nodeCount; i++) {
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

        // Draw connections
        ctx.strokeStyle = colors.line;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
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

        // Draw and update nodes
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

            node.pulsePhase += node.pulseSpeed;
            const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;

            // Outer glow
            ctx.globalAlpha = 0.2 * pulse;
            ctx.fillStyle = colors.pulse;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
            ctx.fill();

            // Node
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

// =============================================
// ANIMATION 4: Orbiting Circles (About Page)
// =============================================

function initOrbitAnimation(canvas, ctx) {
    function getColors() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        return theme === 'dark'
            ? { orbit1: '#60a5fa', orbit2: '#2dd4bf', orbit3: '#a78bfa', orbit4: '#f472b6' }
            : { orbit1: '#3b82f6', orbit2: '#14b8a6', orbit3: '#7c3aed', orbit4: '#ec4899' };
    }

    const orbiters = [];
    const centerCount = 4;

    for (let i = 0; i < centerCount; i++) {
        const center = {
            x: (canvas.width / (centerCount + 1)) * (i + 1),
            y: canvas.height / 2 + (Math.random() - 0.5) * 200,
            satellites: []
        };

        const satelliteCount = 2 + Math.floor(Math.random() * 3);
        for (let j = 0; j < satelliteCount; j++) {
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
            // Draw center
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = colors.orbit1;
            ctx.beginPath();
            ctx.arc(orbiter.x, orbiter.y, 8, 0, Math.PI * 2);
            ctx.fill();

            // Draw orbit paths
            ctx.globalAlpha = 0.08;
            ctx.strokeStyle = colors.orbit1;
            ctx.lineWidth = 1;
            orbiter.satellites.forEach(sat => {
                ctx.beginPath();
                ctx.arc(orbiter.x, orbiter.y, sat.distance, 0, Math.PI * 2);
                ctx.stroke();
            });

            // Draw and update satellites
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

// =============================================
// ANIMATION 5: Paper Planes (Contact Page)
// =============================================

function initPaperPlaneAnimation(canvas, ctx) {
    function getColors() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        return theme === 'dark'
            ? { plane: '#60a5fa', trail: '#3b82f6', envelope: '#2dd4bf' }
            : { plane: '#3b82f6', trail: '#93c5fd', envelope: '#14b8a6' };
    }

    const planes = [];
    const planeCount = 8;

    for (let i = 0; i < planeCount; i++) {
        planes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: 0.5 + Math.random() * 0.8,
            vy: (Math.random() - 0.5) * 0.3,
            size: 18 + Math.random() * 22,
            opacity: 0.1 + Math.random() * 0.15,
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

        // Paper plane shape
        ctx.fillStyle = colors.plane;
        ctx.beginPath();
        ctx.moveTo(plane.size, 0);
        ctx.lineTo(-plane.size * 0.6, -plane.size * 0.4);
        ctx.lineTo(-plane.size * 0.4, 0);
        ctx.lineTo(-plane.size * 0.6, plane.size * 0.4);
        ctx.closePath();
        ctx.fill();

        // Trail
        ctx.globalAlpha = plane.opacity * 0.5;
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

            // Add to trail
            plane.trail.unshift({ x: plane.x, y: plane.y });
            if (plane.trail.length > 15) plane.trail.pop();

            // Wrap around
            if (plane.x > canvas.width + 50) {
                plane.x = -50;
                plane.trail = [];
            }
            if (plane.y < -50) plane.y = canvas.height + 50;
            if (plane.y > canvas.height + 50) plane.y = -50;

            drawPlane(plane);
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// =============================================
// ANIMATION 6: Floating Quotes (Testimonials Page)
// =============================================

function initQuotesAnimation(canvas, ctx) {
    function getColors() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        return theme === 'dark'
            ? { quote: '#60a5fa', star: '#fbbf24', accent: '#2dd4bf' }
            : { quote: '#3b82f6', star: '#f59e0b', accent: '#14b8a6' };
    }

    const elements = [];
    const quoteCount = 12;
    const starCount = 15;

    // Quotes
    for (let i = 0; i < quoteCount; i++) {
        elements.push({
            type: 'quote',
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            char: Math.random() > 0.5 ? '"' : '"',
            size: 30 + Math.random() * 40,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: 0.08 + Math.random() * 0.12,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.003
        });
    }

    // Stars
    for (let i = 0; i < starCount; i++) {
        elements.push({
            type: 'star',
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 8 + Math.random() * 14,
            speedX: (Math.random() - 0.5) * 0.25,
            speedY: (Math.random() - 0.5) * 0.25,
            opacity: 0.1 + Math.random() * 0.15,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.03 + Math.random() * 0.03
        });
    }

    function drawStar(x, y, size, rotation) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
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

            if (el.x < -50) el.x = canvas.width + 50;
            if (el.x > canvas.width + 50) el.x = -50;
            if (el.y < -50) el.y = canvas.height + 50;
            if (el.y > canvas.height + 50) el.y = -50;

            if (el.type === 'quote') {
                el.rotation += el.rotationSpeed;
                ctx.save();
                ctx.globalAlpha = el.opacity;
                ctx.translate(el.x, el.y);
                ctx.rotate(el.rotation);
                ctx.font = `${el.size}px Georgia, serif`;
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

// =============================================
// ANIMATION 7: Document Lines (Legal Pages)
// =============================================

function initLinesAnimation(canvas, ctx) {
    function getColors() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        return theme === 'dark'
            ? { line: '#475569', accent: '#60a5fa' }
            : { line: '#cbd5e1', accent: '#3b82f6' };
    }

    const lines = [];
    const lineCount = 35;

    for (let i = 0; i < lineCount; i++) {
        lines.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: 80 + Math.random() * 180,
            speedX: 0.1 + Math.random() * 0.2,
            opacity: 0.05 + Math.random() * 0.08,
            isAccent: Math.random() > 0.85
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

// =============================================
// CONTACT FORM
// =============================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');
    const errorMsg = document.getElementById('formError');
    if (!form) return;

    const submitBtn = form.querySelector('.submit-button');

    // Track form fill time for anti-spam (bots fill instantly)
    let formLoadTime = Date.now();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Anti-spam: Honeypot check
        const honeypot = form.querySelector('#website');
        if (honeypot && honeypot.value) {
            // Bot detected — silently pretend success
            if (successMsg) successMsg.style.display = 'flex';
            form.reset();
            return;
        }

        // Anti-spam: Time check (if filled in under 3 seconds, likely a bot)
        if (Date.now() - formLoadTime < 3000) {
            if (successMsg) successMsg.style.display = 'flex';
            form.reset();
            return;
        }

        // Hide previous messages
        if (successMsg) successMsg.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';

        const formData = {
            name: form.querySelector('#name')?.value || '',
            email: form.querySelector('#email')?.value || '',
            company: form.querySelector('#company')?.value || '',
            projectType: form.querySelector('#projectType')?.value || '',
            budget: form.querySelector('#budget')?.value || '',
            timeline: form.querySelector('#timeline')?.value || '',
            message: form.querySelector('#message')?.value || '',
            timestamp: new Date().toISOString()
        };

        // Email validation
        if (!validateEmail(formData.email)) {
            const emailInput = form.querySelector('#email');
            if (emailInput) {
                emailInput.style.borderColor = '#dc2626';
                emailInput.focus();
            }
            return;
        }

        // Loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Replace the hardcoded Formspree endpoint with a dynamic value sourced from an environment variable or configuration file.
            const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT || 'YOUR_DEFAULT_ENDPOINT';

            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Submission failed');

            // Simulated submission for now
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Form data:', formData);

            if (successMsg) {
                successMsg.style.display = 'flex';
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            form.reset();
            formLoadTime = Date.now(); // Reset timer

        } catch (error) {
            console.error('Form error:', error);
            if (errorMsg) {
                errorMsg.style.display = 'flex';
                errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    // Real-time email validation
    const emailInput = form.querySelector('#email');
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (emailInput.value && !validateEmail(emailInput.value)) {
                emailInput.style.borderColor = '#dc2626';
            } else {
                emailInput.style.borderColor = '';
            }
        });
        emailInput.addEventListener('input', () => {
            emailInput.style.borderColor = '';
        });
    }
}

// =============================================
// URL PARAMETER PRE-FILLING
// e.g. contact.html?service=webapp will pre-select project type
// =============================================

function prefillFromURL() {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');

    if (serviceParam) {
        const projectType = document.getElementById('projectType');
        if (projectType) {
            const optionMap = {
                'website': 'website',
                'webapp': 'webapp',
                'mobile': 'mobile',
                'consulting': 'consulting'
            };
            const value = optionMap[serviceParam];
            if (value) {
                projectType.value = value;
            }
        }
    }
}

// =============================================
// UTILITIES
// =============================================

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Smooth scroll for CTA button (used in older onclick)
function scrollToContact() {
    const contact = document.getElementById('contact');
    if (contact) {
        const navHeight = document.querySelector('.main-nav')?.offsetHeight || 70;
        const pos = contact.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: pos, behavior: 'smooth' });
    }
}

window.scrollToContact = scrollToContact;

// =============================================
// COPYRIGHT YEAR UPDATE
// =============================================

function updateCopyrightYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// =============================================
// LOAD FOOTER FROM EXTERNAL FILE
// =============================================

function loadFooter() {
    fetch('footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Footer not found');
            return response.text();
        })
        .then(html => {
            // Insert footer before the scroll-to-top button
            const scrollBtn = document.querySelector('.scroll-to-top');
            if (scrollBtn) {
                scrollBtn.insertAdjacentHTML('beforebegin', html);
                // Update copyright year after footer loads
                updateCopyrightYear();
            }
        })
        .catch(error => console.warn('Footer loading warning:', error));
}
