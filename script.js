// NextPhases -- Master Script (stabilized)

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        initThemeToggle();
        initMoonAnimation();
        initScrollAnimations();
        initMobileNav();
        initSmartNavbar();
        initAnnouncementMarquee();
        initFloatingCodeSymbols();
        initYouthKeywordToggle();
        initScrollToTop();
        initSmoothScrollLinks();
        initHeroEntrance();
        initWelcomeGuide();
        initTeamDetails();
        initYouthDayLogoEasterEgg();

        if (document.getElementById('contactForm')) {
            initContactForm();
            prefillFromURL();
        }

        updateCopyrightYear();
        loadFooter();
    });

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
    // ANNOUNCEMENT MARQUEE
    // =============================================
    function initAnnouncementMarquee() {
        const bar = document.querySelector('.nav-announcement');
        const nav = document.getElementById('mainNav');
        if (!bar || !nav) return;

        // Keep announcement attached to nav so hide/show behavior is unified.
        if (bar.parentElement !== nav) nav.appendChild(bar);

        const items = [
            'Happy Youth Day 2026',
            'Built by the youth',
            'For the future',
            'Build your site today with NextPhases',
            'Ideas from Lusaka to the world',
            'Youth Mode is live - type youth'
        ];

        const baseLine = items.join('   ✦   ');
        const repeated = Array.from({ length: 8 }).map(() => baseLine).join('   ✦   ');

        bar.setAttribute('aria-label', items.join('. '));
        bar.innerHTML = '<div class="announcement-track" aria-hidden="true">'
            + '<span class="announcement-line">' + repeated + '</span>'
            + '<span class="announcement-line">' + repeated + '</span>'
            + '</div>';
    }

    // =============================================
    // LIGHTWEIGHT BACKGROUND ANIMATION
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

        const symbols = symbolMap[page] || symbolMap['index.html'];
        const palette = ['255,215,0', '239,68,68', '34,197,94', '59,130,246', '168,85,247'];

        const particles = Array.from({ length: 34 }).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: 1 + Math.random() * 2.6,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            a: 0.08 + Math.random() * 0.18
        }));

        const symbolParticles = Array.from({ length: 18 }).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            text: symbols[Math.floor(Math.random() * symbols.length)],
            color: palette[Math.floor(Math.random() * palette.length)],
            size: 10 + Math.random() * 10,
            vx: (Math.random() - 0.5) * 0.2,
            vy: -0.15 - Math.random() * 0.22,
            a: 0.16 + Math.random() * 0.22
        }));

        function getDotColor() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark' ? '96,165,250' : '20,184,166';
        }

        function wrap(item, pad) {
            if (item.x < -pad) item.x = canvas.width + pad;
            if (item.x > canvas.width + pad) item.x = -pad;
            if (item.y < -pad) item.y = canvas.height + pad;
            if (item.y > canvas.height + pad) item.y = -pad;
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const dotRgb = getDotColor();
            const footer = document.querySelector('footer');
            const footerTop = footer ? footer.getBoundingClientRect().top : Number.POSITIVE_INFINITY;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                wrap(p, 8);

                ctx.beginPath();
                ctx.fillStyle = 'rgba(' + dotRgb + ',' + p.a + ')';
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });

            symbolParticles.forEach(s => {
                s.x += s.vx;
                s.y += s.vy;
                wrap(s, 24);

                // Keep symbols out of the visible footer zone.
                if (s.y > footerTop - 14) return;

                ctx.font = '700 ' + s.size + 'px Consolas, "Courier New", monospace';
                ctx.fillStyle = 'rgba(' + s.color + ',' + s.a + ')';
                ctx.fillText(s.text, s.x, s.y);
            });

            requestAnimationFrame(draw);
        }

        draw();
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
        const currencySelect = form.querySelector('#currency');
        const projectTypeSelect = form.querySelector('#projectType');
        const budgetSelect = form.querySelector('#budget');
        const budgetHint = form.querySelector('#budgetHint');

        // Default budget tiers for all project types except System Development
        const budgetMapDefault = {
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

        function detectCurrencyByRegion() {
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

        function renderBudgetOptions(currencyCode) {
            if (!budgetSelect) return;

            // Check if project type is "system" to use different pricing
            const projectType = projectTypeSelect ? projectTypeSelect.value : '';
            const isSystems = projectType === 'system';
            const budgetMap = isSystems ? budgetMapSystems : budgetMapDefault;

            const options = budgetMap[currencyCode] || budgetMap.USD;
            budgetSelect.innerHTML = options.map(option => '<option value="' + option.value + '">' + option.label + '</option>').join('');

            if (budgetHint) {
                const tierType = isSystems ? ' (System Development pricing)' : '';
                budgetHint.textContent = 'Budget adjusted for ' + currencyCode + tierType + '. You can change currency or project type manually.';
            }
        }

        if (currencySelect) {
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
                const currentCurrency = currencySelect ? currencySelect.value : 'USD';
                renderBudgetOptions(currentCurrency);
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
                        handleSuccess();
                    }, 700); // Match the plane-fly animation duration
                } else {
                    handleSuccess();
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
            '        <div class="footer-logo"><img src="NextPhases_Swirl_YouthDay2026_Transparent.png" alt="NextPhases" class="footer-icon" /><span>NextPhases</span></div>',
            '        <p class="footer-tagline">Built by the youth. For the world.</p>',
            '        <div class="footer-socials">',
            '          <a href="https://github.com/NextPhasesDev" class="social-link" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>',
            '          <a href="https://x.com/NextPhases" class="social-link" target="_blank" rel="noopener" aria-label="Twitter"><i class="fab fa-twitter"></i></a>',
            '          <a href="https://www.tiktok.com/@nextphases.dev?lang=en" class="social-link" target="_blank" rel="noopener" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>',
            '          <a href="https://www.instagram.com/nextphases.dev/" class="social-link" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>',
            '          <a href="https://www.linkedin.com/company/nextphases" class="social-link" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>',
            '          <a href="https://discord.gg/DkybgpuRwp" class="social-link" target="_blank" rel="noopener" aria-label="Discord"><i class="fab fa-discord"></i></a>',
            '        </div>',
            '      </div>',
            '      <div class="footer-column"><h4>Services</h4><ul><li><a href="services.html#web-dev">Web Development</a></li><li><a href="services.html#app-dev">App Development</a></li><li><a href="services.html#consulting">Consulting</a></li></ul></div>',
            '      <div class="footer-column"><h4>Projects</h4><ul><li><a href="portfolio.html#examguard">ExamGuard</a></li><li><a href="portfolio.html#nsolo">Nsolo</a></li><li><a href="portfolio.html">View All</a></li></ul></div>',
            '      <div class="footer-column"><h4>Company</h4><ul><li><a href="about.html">About Us</a></li><li><a href="testimonials.html">Testimonials</a></li><li><a href="contact.html">Contact</a></li><li><a href="privacy.html">Privacy Policy</a></li><li><a href="terms.html">Terms of Service</a></li></ul></div>',
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

        fetch('footer.html')
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


