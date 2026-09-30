/* ============================================================
   PORTFOLIO - main.js
   Particles, typed text, scroll effects, filtering & form
   ============================================================ */

// =============================================
// PARTICLES
// =============================================
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '#7c3aed' : '#06b6d4';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const COUNT = 120;
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 100) * 0.08;
          ctx.strokeStyle = '#7c3aed';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
})();

// =============================================
// NAVBAR — scroll effect + mobile toggle
// =============================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// =============================================
// TYPED TEXT EFFECT
// =============================================
(function typedEffect() {
  const el = document.getElementById('typed');
  const phrases = [
    'Full Stack Developer',
    'Solucionador de problemas',
    'Amante del código limpio',
    'Open Source Contributor',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 50 : 80);
  }
  type();
})();

// =============================================
// INTERSECTION OBSERVER — fade-in + skill bars
// =============================================
const fadeEls = document.querySelectorAll(
  '.section-header, .about-grid, .skill-category, .project-card, .timeline-item, .blog-card, .contact-grid'
);
fadeEls.forEach(el => el.classList.add('fade-in-up'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate skill bars when category becomes visible
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.classList.add('animated');
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => observer.observe(el));

// =============================================
// PROJECT FILTER
// =============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.4s ease both';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// =============================================
// CONTACT FORM
// =============================================
const form = document.getElementById('contact-form');
const formMsg = document.getElementById('form-msg');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"] span');
  btn.textContent = 'Enviando...';

  // Simulate sending (replace with real API call, e.g. EmailJS or Formspree)
  setTimeout(() => {
    btn.textContent = 'Enviar mensaje';
    formMsg.textContent = '✅ ¡Mensaje enviado! Te responderé pronto.';
    formMsg.className = 'form-note success';
    form.reset();
    setTimeout(() => formMsg.textContent = '', 5000);
  }, 1500);
});

// =============================================
// FOOTER YEAR
// =============================================
document.getElementById('year').textContent = new Date().getFullYear();

// =============================================
// SMOOTH ACTIVE NAV LINKS on scroll
// =============================================
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navLinkEls.forEach(link => {
    link.classList.toggle('active-link', link.getAttribute('href') === `#${current}`);
  });
});
