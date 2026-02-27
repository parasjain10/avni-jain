/* ===================================
   NAVIGATION — scroll shrink & hamburger
=================================== */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===================================
   FADE-UP SCROLL ANIMATIONS
=================================== */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling elements in the same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-up:not(.visible)'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

/* ===================================
   ANIMATED NUMBER COUNTERS
=================================== */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const duration = 1800;
  const startTime = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutExpo(progress);
    const current = eased * target;

    el.textContent = current.toFixed(decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toFixed(decimals) + suffix;
    }
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ===================================
   SMOOTH SCROLL — active nav link
=================================== */
const sections = document.querySelectorAll('section[id]');

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav__links a').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => activeObserver.observe(s));

/* ===================================
   HERO — initial fade-in on load
=================================== */
window.addEventListener('load', () => {
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(24px)';
    heroContent.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      });
    });
  }
});

/* ===================================
   METRIC CARD — subtle tilt on hover (pointer devices only)
=================================== */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.metric-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
      card.style.transition = 'transform 0.05s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });
}
