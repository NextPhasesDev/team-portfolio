// NextPhases -- Master Script (stabilized)

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
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
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navContainer = document.querySelector('.nav-container');

        if (!navToggle || !navMenu) return;

        function setMenuOpen(isOpen) {
            navMenu.classList.toggle('active', isOpen);
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.classList.toggle('nav-open', isOpen);

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

        const particles = Array.from({ length: 38 }).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: 1 + Math.random() * 2.4,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            a: 0.08 + Math.random() * 0.18
        }));

        function getColor() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark' ? '96,165,250' : '20,184,166';
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const rgb = getColor();

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -8) p.x = canvas.width + 8;
                if (p.x > canvas.width + 8) p.x = -8;
                if (p.y < -8) p.y = canvas.height + 8;
                if (p.y > canvas.height + 8) p.y = -8;

                ctx.beginPath();
                ctx.fillStyle = 'rgba(' + rgb + ',' + p.a + ')';
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(draw);
        }

        draw();
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
        const budgetSelect = form.querySelector('#budget');
        const budgetHint = form.querySelector('#budgetHint');

        const budgetMap = {
            USD: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-300-1000', label: 'From USD 300 - 1,000' },
                { value: 'usd-1000-3000', label: 'USD 1,000 - 3,000' },
                { value: 'usd-3000-10000', label: 'USD 3,000 - 10,000' },
                { value: 'usd-10000+', label: 'USD 10,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            ZMW: [
                { value: '', label: 'Select budget range' },
                { value: 'zmw-2000-8000', label: 'From ZMW 2,000 - 8,000' },
                { value: 'zmw-8000-25000', label: 'ZMW 8,000 - 25,000' },
                { value: 'zmw-25000-80000', label: 'ZMW 25,000 - 80,000' },
                { value: 'zmw-80000+', label: 'ZMW 80,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            ZAR: [
                { value: '', label: 'Select budget range' },
                { value: 'zar-2500-10000', label: 'From ZAR 2,500 - 10,000' },
                { value: 'zar-10000-35000', label: 'ZAR 10,000 - 35,000' },
                { value: 'zar-35000-100000', label: 'ZAR 35,000 - 100,000' },
                { value: 'zar-100000+', label: 'ZAR 100,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            GBP: [
                { value: '', label: 'Select budget range' },
                { value: 'gbp-500-2000', label: 'From GBP 500 - 2,000' },
                { value: 'gbp-2000-7000', label: 'GBP 2,000 - 7,000' },
                { value: 'gbp-7000-18000', label: 'GBP 7,000 - 18,000' },
                { value: 'gbp-18000+', label: 'GBP 18,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            EUR: [
                { value: '', label: 'Select budget range' },
                { value: 'eur-450-1800', label: 'From EUR 450 - 1,800' },
                { value: 'eur-1800-6000', label: 'EUR 1,800 - 6,000' },
                { value: 'eur-6000-15000', label: 'EUR 6,000 - 15,000' },
                { value: 'eur-15000+', label: 'EUR 15,000+' },
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
            const options = budgetMap[currencyCode] || budgetMap.USD;
            budgetSelect.innerHTML = options.map(option => '<option value="' + option.value + '">' + option.label + '</option>').join('');

            if (budgetHint) {
                budgetHint.textContent = 'Budget adjusted for ' + currencyCode + '. You can change currency manually.';
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

            try {
                const endpoint = 'https://formspree.io/f/xgoldrwl';
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) throw new Error('Submission failed');

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
            } catch (error) {
                if (errorMsg) {
                    errorMsg.style.display = 'flex';
                    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } finally {
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
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
            '        <div class="footer-logo"><img src="favicon.png" alt="NextPhases" class="footer-icon" /><span>NextPhases</span></div>',
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
})();

