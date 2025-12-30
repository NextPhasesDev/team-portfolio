function contactUs() {
  // Opens user's email client with NextPhases email pre-filled
  window.location.href = "mailto:team@nextphases.dev?subject=Project Inquiry&body=Hi NextPhases team,%0D%0A%0D%0AI'm interested in discussing a project.%0D%0A%0D%0AProject Type: [Website/App/Other]%0D%0ABudget Range: %0D%0ATimeline: %0D%0A%0D%0APlease let me know when we can discuss further.%0D%0A%0D%0AThank you!";
}

// Smooth scroll for future navigation links
document.addEventListener('DOMContentLoaded', function() {
  // Add smooth scrolling to all links
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add animation on scroll (for future sections)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe service cards and benefit items for scroll animations
  document.querySelectorAll('.service-card, .benefit').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});
