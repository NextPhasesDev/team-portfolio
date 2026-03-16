(function () {
    'use strict';

    const teamMembers = [
        {
            id: 'thuma',
            initials: 'TH',
            badge: 'Cofounder',
            name: 'Thuma',
            role: 'Lead Developer',
            bio: 'Full-stack development, architecture, and keeping the ship on course. Also serves as ICTAZ Secretary.',
            skills: ['Lead Dev', 'Full-Stack', 'Architecture'],
            quote: '"Build it right the first time."',
            focus: 'Systems architecture & dev leadership',
            email: 'thuma@nextphases.dev',
            github: '#',
            particles: ['{}', '</>', '=>', '===', '//', 'fn()', '&&', 'const', ';', '!=', '[]', '||']
        },
        {
            id: 'simon',
            initials: 'SI',
            badge: 'Cofounder',
            name: 'Simon',
            role: 'Full-Stack Developer & Project Manager',
            bio: 'Code and commerce. Simon handles full-stack development, manages projects, and drives the business side of NextPhases.',
            skills: ['Full-Stack', 'PM', 'Business', 'ExamGuard'],
            quote: '"Good software solves real problems."',
            focus: 'Project management & business development',
            email: 'simon@nextphases.dev',
            github: '#',
            particles: ['✓', 'PR', 'v2.0', 'SHIP', 'TODO', '→', 'DONE', '#1', 'merge', 'fix', 'push', 'done']
        },
        {
            id: 'shaun',
            initials: 'SH',
            badge: 'Cofounder',
            name: 'Shaun',
            role: 'Junior Developer',
            bio: 'Full-stack generalist tackling any development task assigned. Brings versatility and a keen eye for polish.',
            skills: ['Full-Stack', 'Versatile', 'UI Polish'],
            quote: '"Details make the difference."',
            focus: 'Frontend polish & UI/UX',
            email: 'shaun@nextphases.dev',
            github: '#',
            particles: ['[]', 'px', 'rem', '#fff', '◆', 'flex', 'grid', 'rgb()', '▲', 'gap', 'em', 'var()']
        },
        {
            id: 'chris',
            initials: 'CH',
            badge: null,
            name: 'Chris',
            role: 'Client Relations Lead',
            bio: 'The bridge between our team and our clients. Chris ensures smooth communication and manages relationships.',
            skills: ['Client Relations', 'Communication', 'Onboarding'],
            quote: '"Every client relationship matters."',
            focus: 'Client success & business relationships',
            email: 'chris@nextphases.dev',
            github: null,
            particles: ['@', 'hi!', 'deal', 'ok!', ':)', '→', '✉', '$', 'thanks', 'yes!', 'onit', 'note']
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

    function buildActions(member) {
        const email = '<a href="mailto:' + member.email + '" class="card-back-email"><i class="fas fa-envelope"></i> Contact ' + member.name + '</a>';
        const github = member.github
            ? '<a href="' + member.github + '" class="card-back-github" target="_blank" rel="noopener" aria-label="' + member.name + ' GitHub profile"><i class="fab fa-github"></i></a>'
            : '';
        return '<div class="card-back-actions">' + email + github + '</div>';
    }

    function buildCard(member) {
        const card = document.querySelector('.team-card[data-member="' + member.id + '"]');
        if (!card) return;

        card.classList.add('flip-enabled');
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', member.name + ' team card. Press Enter or Space to flip.');

        const badge = member.badge
            ? '<p class="tier-badge">' + member.badge + '</p>'
            : '<p class="tier-badge neutral">Team</p>';

        // TODO: Replace placeholder GitHub href values with real profiles.
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
                    buildActions(member) +
                    '<p class="card-back-hint">Click to close</p>' +
                '</div>' +
            '</div>';
    }

    function createParticles(card, symbols) {
        const particles = [];
        const count = Math.min(symbols.length, 12);
        for (let i = 0; i < count; i += 1) {
            const span = document.createElement('span');
            span.className = 'card-particle';
            span.textContent = symbols[i % symbols.length];
            span.style.color = i % 2 === 0 ? 'var(--primary-teal)' : '#ffffff';
            card.appendChild(span);
            particles.push(span);
        }
        return particles;
    }

    function burstParticles(particles) {
        particles.forEach(function (p, i) {
            const angle = (i / particles.length) * Math.PI * 2 + Math.random() * 0.4;
            const dist = 65 + Math.random() * 70;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;
            p.style.transition = 'transform 0.5s cubic-bezier(0.2,0,0,1) ' + (i * 25) + 'ms, opacity 0.4s ease ' + (i * 25) + 'ms';
            p.style.transform = 'translate(calc(-50% + ' + tx + 'px), calc(-50% + ' + ty + 'px)) scale(1)';
            p.style.opacity = '1';
        });
    }

    function retractParticles(particles) {
        particles.forEach(function (p, i) {
            p.style.transition = 'transform 0.4s cubic-bezier(0.4,0,1,1) ' + (i * 15) + 'ms, opacity 0.3s ease';
            p.style.transform = 'translate(-50%, -50%) scale(0)';
            p.style.opacity = '0';
        });
    }

    function toggleFlip(card) {
        const inner = card.querySelector('.card-inner');
        if (!inner) return;

        const flippingToBack = !inner.classList.contains('flipped');
        inner.classList.toggle('flipped');

        if (Array.isArray(card._particles)) {
            if (flippingToBack) burstParticles(card._particles);
            else retractParticles(card._particles);
        }
    }

    teamMembers.forEach(buildCard);

    interactiveCards.forEach(card => {
        const memberId = card.getAttribute('data-member');
        const member = map[memberId];
        if (member && Array.isArray(member.particles)) {
            card._particles = createParticles(card, member.particles);
        }

        card.addEventListener('click', (e) => {
            if (e.target.closest('.card-back-email, .card-back-github')) return;
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
