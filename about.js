(function () {
    'use strict';

    const teamMembers = [
        {
            id: 'thuma', badge: 'Cofounder',
            name: 'Thuma', role: 'CTO & CMO',
            bio: 'Sets the technical direction and shapes the NextPhases brand. Leads architecture, development strategy, and how the team communicates what it builds.',
            skills: ['Architecture', 'Brand', 'Strategy'],
            quote: '"Build it right the first time."',
            focus: 'Architecture & brand leadership',
            contact: { label: 'Media & press', email: 'media@nextphases.dev' },
            particles: ['{}', '</>', '=>', '===', '//', 'fn()', '&&', 'const', ';', '!=', '[]', '||']
        },
        {
            id: 'simon', badge: 'Cofounder',
            name: 'Simon', role: 'COO',
            bio: 'Keeps delivery, operations, and client communication in order so projects move from kickoff to launch without losing momentum.',
            skills: ['Operations', 'PM', 'Delivery', 'ExamGuard'],
            quote: '"Good software solves real problems."',
            focus: 'Operations & project delivery',
            contact: { label: 'Partnerships', email: 'team@nextphases.dev' },
            particles: ['OK', 'PR', 'v2.0', 'SHIP', 'TODO', 'GO', 'DONE', 'merge', 'fix', 'push', 'sync', 'done']
        },
        {
            id: 'chris', badge: 'Cofounder',
            name: 'Chris', role: 'CEO & CCO',
            bio: 'Leads the company voice and manages client relationships. Drives commercial direction and keeps the team focused on growth.',
            skills: ['Leadership', 'Clients', 'Growth'],
            quote: '"Every client relationship matters."',
            focus: 'Client success & business leadership',
            contact: { label: 'Client enquiries', email: 'info@nextphases.dev' },
            particles: ['@', 'hi!', 'deal', 'ok!', ':)', 'mail', '$', 'thanks', 'yes!', 'onit', 'note', 'sync']
        },
        {
            id: 'shaun', badge: 'Cofounder',
            name: 'Shaun', role: 'VP Engineering',
            bio: 'Tackles development work across the stack with an eye for quality and a steady hand on the engineering side of every project.',
            skills: ['Engineering', 'Full-Stack', 'Quality'],
            quote: '"Details make the difference."',
            focus: 'Engineering quality & delivery standards',
            contact: null,
            particles: ['[]', 'px', 'rem', '#fff', 'UI', 'flex', 'grid', 'rgb()', 'UX', 'gap', 'em', 'var()']
        },
        {
            id: 'lans', badge: null,
            name: 'Lans', role: 'Developer Contributor',
            bio: 'Supports active development work while building hands-on experience across real projects.',
            skills: ['Development'],
            quote: '"Learn fast, build fast."',
            focus: 'Hands-on development support',
            contact: null,
            particles: ['dev', 'learn', 'ship', 'test', 'build', 'code', 'fix', 'task']
        }
    ];

    const map = {};
    teamMembers.forEach(member => {
        map[member.id] = member;
    });

    const interactiveCards = document.querySelectorAll('.team-card.clickable-team:not(.coming-soon-member)');

    function buildSkills(skills, filled) {
        const cls = filled ? 'back-skill' : '';
        return skills.map(skill => '<span class="' + cls + '">' + skill + '</span>').join('');
    }

    function buildContact(member) {
        if (!member.contact) return '';
        return '<p class="card-back-contact"><i class="fas fa-envelope"></i><span>' + member.contact.label + ':</span> ' + member.contact.email + '</p>';
    }

    function buildCard(member) {
        const card = document.querySelector('.team-card[data-member="' + member.id + '"]');
        if (!card) return;

        card.classList.add('flip-enabled');
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', member.name + ' team card. Press Enter or Space to flip.');

        const badge = member.badge ? '<p class="tier-badge">' + member.badge + '</p>' : '';

        card.innerHTML =
            '<div class="card-inner">' +
                '<div class="card-front">' +
                    '<div class="team-avatar"><i class="fas fa-user-tie"></i></div>' +
                    badge +
                    '<h3>' + member.name + '</h3>' +
                    '<p class="team-role">' + member.role + '</p>' +
                    '<p class="team-desc">' + member.bio + '</p>' +
                    '<div class="team-tags">' + buildSkills(member.skills, false) + '</div>' +
                '</div>' +
                '<div class="card-back">' +
                    '<p class="card-back-name">' + member.name + '</p>' +
                    '<p class="card-back-role">' + member.role + '</p>' +
                    '<p class="card-back-quote"><em>' + member.quote + '</em></p>' +
                    '<p class="card-back-focus">' + member.focus + '</p>' +
                    '<div class="team-tags card-back-tags">' + buildSkills(member.skills, true) + '</div>' +
                    buildContact(member) +
                    '<p class="card-back-hint">Click to close</p>' +
                '</div>' +
            '</div>';
    }

    function createParticles(card, symbols) {
        const front = card.querySelector('.card-front');
        if (!front) return [];

        const particles = [];
        const count = Math.min(symbols.length, 12);
        for (let i = 0; i < count; i += 1) {
            const span = document.createElement('span');
            span.className = 'card-particle';
            span.textContent = symbols[i % symbols.length];
            span.style.top = (Math.random() * 80 + 10) + '%';
            span.style.left = (Math.random() * 80 + 10) + '%';
            span.style.setProperty('--particle-dx', (Math.random() * 40 - 20).toFixed(2) + 'px');
            span.style.setProperty('--particle-dy', (Math.random() * 30 - 15).toFixed(2) + 'px');
            span.style.animationDuration = (Math.random() * 20 + 15).toFixed(2) + 's';
            span.style.animationDelay = (-Math.random() * 20).toFixed(2) + 's';
            front.appendChild(span);
            particles.push(span);
        }
        return particles;
    }

    function pulseParticles(card) {
        const front = card.querySelector('.card-front');
        if (!front) return;

        front.classList.add('particles-boost');
        if (card._particleBoostTimer) {
            clearTimeout(card._particleBoostTimer);
        }
        card._particleBoostTimer = setTimeout(() => {
            front.classList.remove('particles-boost');
            card._particleBoostTimer = null;
        }, 600);
    }

    function toggleFlip(card) {
        const inner = card.querySelector('.card-inner');
        if (!inner) return;

        const flippingToBack = !inner.classList.contains('flipped');
        inner.classList.toggle('flipped');

        if (flippingToBack) pulseParticles(card);
    }

    teamMembers.forEach(buildCard);

    interactiveCards.forEach(card => {
        const memberId = card.getAttribute('data-member');
        const member = map[memberId];
        if (member && Array.isArray(member.particles)) {
            card._particles = createParticles(card, member.particles);
        }

        card.addEventListener('click', (e) => {
            toggleFlip(card);
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFlip(card);
            }
        });
    });
})();
