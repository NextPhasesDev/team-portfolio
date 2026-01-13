// ===================================
// THEME TOGGLE FUNCTIONALITY
// ===================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);

    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        // Add transition class for smooth theme switching
        document.body.style.transition = 'background-color 0.4s ease, color 0.4s ease';

        // Update theme
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update canvas colors
        updateCanvasTheme(newTheme);

        // Add a small animation to the button
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

// Update canvas colors based on theme
function updateCanvasTheme(theme) {
    // This will be called when theme changes
    // The canvas will pick up the new CSS variables on next render
    if (window.moonAnimationContext) {
        window.moonAnimationContext.needsUpdate = true;
    }
}

// ===================================
// MOON PHASE ANIMATION
// ===================================

function initMoonAnimation() {
    const canvas = document.getElementById('moonCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    window.moonAnimationContext = ctx;

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Moon phases data
    const moons = [];
    const moonCount = 25; // Increased from 8 to 25 for more visual interest

    // Stars for extra detail
    const stars = [];
    const starCount = 50;

    // Get current theme colors
    function getThemeColors() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        if (theme === 'dark') {
            return {
                moonColor1: '#60a5fa',
                moonColor2: '#3b82f6',
                starColor: '#2dd4bf'
            };
        } else {
            return {
                moonColor1: '#3b82f6',
                moonColor2: '#1e3a8a',
                starColor: '#14b8a6'
            };
        }
    }

    // Initialize star objects
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 0.5 + Math.random() * 1.5,
            opacity: 0.1 + Math.random() * 0.2,
            twinkleSpeed: 0.01 + Math.random() * 0.02,
            twinklePhase: Math.random() * Math.PI * 2
        });
    }

    // Initialize moon objects with more variety
    for (let i = 0; i < moonCount; i++) {
        moons.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            phase: Math.random(), // Random phase for variety
            size: 25 + Math.random() * 50, // More size variety (25-75px)
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            opacity: 0.08 + Math.random() * 0.18, // Varying opacity
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.001
        });
    }

    // Draw a star
    function drawStar(star) {
        const colors = getThemeColors();
        ctx.save();
        const twinkle = Math.sin(star.twinklePhase) * 0.5 + 0.5;
        ctx.globalAlpha = star.opacity * twinkle;
        ctx.fillStyle = colors.starColor;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Draw a moon with specific phase
    function drawMoon(moon) {
        const colors = getThemeColors();
        ctx.save();
        ctx.globalAlpha = moon.opacity;
        ctx.translate(moon.x, moon.y);
        ctx.rotate(moon.rotation);
        ctx.translate(-moon.x, -moon.y);

        // Draw moon circle with subtle gradient using theme colors
        const gradient = ctx.createRadialGradient(
            moon.x - moon.size * 0.3,
            moon.y - moon.size * 0.3,
            0,
            moon.x,
            moon.y,
            moon.size
        );
        gradient.addColorStop(0, colors.moonColor1);
        gradient.addColorStop(1, colors.moonColor2);

        ctx.beginPath();
        ctx.arc(moon.x, moon.y, moon.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw phase shadow
        ctx.globalCompositeOperation = 'destination-out';
        const shadowOffset = (moon.phase - 0.5) * moon.size * 2;
        ctx.beginPath();
        ctx.ellipse(
            moon.x + shadowOffset,
            moon.y,
            moon.size,
            moon.size,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Add some crater details for larger moons
        if (moon.size > 50) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = moon.opacity * 0.3;
            ctx.fillStyle = colors.moonColor2;

            // Draw a few craters
            ctx.beginPath();
            ctx.arc(moon.x + moon.size * 0.2, moon.y - moon.size * 0.3, moon.size * 0.15, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(moon.x - moon.size * 0.3, moon.y + moon.size * 0.2, moon.size * 0.1, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw stars first (background layer)
        stars.forEach(star => {
            // Update twinkle
            star.twinklePhase += star.twinkleSpeed;

            // Slowly drift
            star.x += 0.05;
            star.y += 0.02;

            // Wrap around
            if (star.x > canvas.width) star.x = 0;
            if (star.y > canvas.height) star.y = 0;

            drawStar(star);
        });

        // Draw moons
        moons.forEach(moon => {
            // Update position
            moon.x += moon.speedX;
            moon.y += moon.speedY;

            // Wrap around edges
            if (moon.x < -moon.size) moon.x = canvas.width + moon.size;
            if (moon.x > canvas.width + moon.size) moon.x = -moon.size;
            if (moon.y < -moon.size) moon.y = canvas.height + moon.size;
            if (moon.y > canvas.height + moon.size) moon.y = -moon.size;

            // Slowly evolve phase
            moon.phase += 0.0001;
            if (moon.phase > 1) moon.phase = 0;

            // Rotate
            moon.rotation += moon.rotationSpeed;

            drawMoon(moon);
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// ===================================
// SCROLL ANIMATIONS (AOS-like)
// ===================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// ===================================
// SMOOTH SCROLL TO CONTACT
// ===================================

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ===================================
// CONTACT FORM HANDLING
// ===================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('formSuccess');
    const errorMessage = document.getElementById('formError');
    const submitButton = form.querySelector('.submit-button');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            projectType: document.getElementById('projectType').value,
            budget: document.getElementById('budget').value,
            timeline: document.getElementById('timeline').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        // Add loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        try {
            // TODO: Replace this with your actual form submission endpoint
            // For now, we'll simulate a successful submission

            // Simulated API call
            await simulateFormSubmission(formData);

            // Show success message
            successMessage.style.display = 'flex';
            form.reset();

            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } catch (error) {
            console.error('Form submission error:', error);
            errorMessage.style.display = 'flex';
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } finally {
            // Remove loading state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    });
}

// Simulated form submission (replace with real API call)
function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Log form data to console (for testing)
            console.log('Form submitted:', formData);

            // TODO: Replace with actual API endpoint
            // Example using fetch:
            /*
            fetch('YOUR_API_ENDPOINT', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error));
            */

            // For now, always resolve successfully
            resolve({ success: true });

            // Uncomment to test error handling:
            // reject(new Error('Submission failed'));
        }, 1500);
    });
}

// ===================================
// FORM INTEGRATION OPTIONS
// ===================================

/* 
  BACKEND INTEGRATION OPTIONS:
  
  1. FORMSPREE (Easiest - No backend needed)
     - Sign up at formspree.io
     - Get your form endpoint
     - Replace form action or fetch URL with Formspree endpoint
     - Example: https://formspree.io/f/YOUR_FORM_ID
  
  2. EMAILJS (Email directly from frontend)
     - Sign up at emailjs.com
     - Configure email service and template
     - Use EmailJS SDK to send emails
     - No backend server required
  
  3. NETLIFY FORMS (If hosted on Netlify)
     - Add netlify attribute to form tag: <form netlify>
     - Netlify automatically handles form submissions
  
  4. CUSTOM BACKEND API
     - Create your own API endpoint
     - Handle form data and send emails
     - More control but requires backend setup
  
  5. GOOGLE FORMS (Quick solution)
     - Create Google Form
     - Use form action URL
     - Data goes to Google Sheets
     - Less customizable but works instantly
  
  RECOMMENDED FOR NEXTPHASES:
  Start with FormSpree (free tier: 50 submissions/month) or EmailJS.
  Later migrate to custom backend if needed.
*/

// Example EmailJS integration (uncomment when ready):
/*
function sendEmailViaEmailJS(formData) {
  // Initialize EmailJS with your User ID
  emailjs.init("YOUR_EMAILJS_USER_ID");
  
  // Send email using template
  return emailjs.send(
    "YOUR_SERVICE_ID",
    "YOUR_TEMPLATE_ID",
    {
      from_name: formData.name,
      from_email: formData.email,
      company: formData.company,
      project_type: formData.projectType,
      budget: formData.budget,
      timeline: formData.timeline,
      message: formData.message
    }
  );
}
*/

// Example Formspree integration:
/*
async function sendToFormspree(formData) {
  const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  
  if (!response.ok) {
    throw new Error('Form submission failed');
  }
  
  return response.json();
}
*/

// ===================================
// INITIALIZE EVERYTHING
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme toggle
    initThemeToggle();

    // Initialize moon animation
    initMoonAnimation();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize contact form
    initContactForm();

    // Initialize mobile navigation toggle
    initMobileNav();

    // Add smooth scrolling to internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add entrance animations to hero elements
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
});

// ===================================
// MOBILE NAVIGATION TOGGLE
// ===================================

function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// ===================================
// UTILITY: EMAIL VALIDATION
// ===================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add real-time email validation
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (emailInput.value && !validateEmail(emailInput.value)) {
                emailInput.style.borderColor = '#dc3545';
            } else {
                emailInput.style.borderColor = '#e0e0e0';
            }
        });

        emailInput.addEventListener('input', () => {
            if (emailInput.style.borderColor === 'rgb(220, 53, 69)') {
                emailInput.style.borderColor = '#e0e0e0';
            }
        });
    }
});

// ===================================
// EXPORT FOR USE IN HTML
// ===================================

// Make scrollToContact available globally for onclick
window.scrollToContact = scrollToContact;