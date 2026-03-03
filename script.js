/* =============================================
   NAVIGATION — shrink on scroll + hamburger
============================================= */
const nav       = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* =============================================
   HERO — entrance animation on load
============================================= */
window.addEventListener('load', () => {
  const heroText = document.querySelector('.hero__text');
  if (!heroText) return;
  heroText.style.cssText = 'opacity:0;transform:translateY(20px);transition:opacity .9s ease,transform .9s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    heroText.style.opacity = '1';
    heroText.style.transform = 'translateY(0)';
  }));
});

/* =============================================
   PROFILE PHOTO FALLBACK
   If profile.jpg fails to load, show "AJ" initials.
   Drop your photo as profile.jpg in this folder.
============================================= */
function setupImgFallback(imgEl, fallbackEl) {
  if (!imgEl || !fallbackEl) return;
  const showFallback = () => {
    imgEl.style.display = 'none';
    fallbackEl.style.display = 'flex';
  };
  const showPhoto = () => {
    fallbackEl.style.display = 'none';
  };
  imgEl.addEventListener('error', showFallback);
  imgEl.addEventListener('load',  showPhoto);
  if (imgEl.complete) {
    imgEl.naturalHeight ? showPhoto() : showFallback();
  }
}

setupImgFallback(
  document.getElementById('heroPhoto'),
  document.getElementById('heroInitials')
);
setupImgFallback(
  document.querySelector('.about-photo'),
  document.querySelector('.about-photo-fb')
);

/* =============================================
   FADE-UP SCROLL ANIMATIONS
============================================= */
const fadeObs = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.querySelectorAll('.fade-up:not(.visible)')];
      const delay = siblings.indexOf(entry.target) * 90;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      fadeObs.unobserve(entry.target);
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.fade-up').forEach(el => fadeObs.observe(el));

/* =============================================
   ANIMATED NUMBER COUNTERS
============================================= */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix   || '';
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const duration = 2000;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = easeOutExpo(progress) * target;
    el.textContent = value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* =============================================
   ACTIVE NAV LINK HIGHLIGHT
============================================= */
const sections = document.querySelectorAll('section[id]');
const activeObs = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.querySelectorAll('a').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => activeObs.observe(s));
