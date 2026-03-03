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
  heroText.style.cssText = 'opacity:0;transform:translateY(18px);transition:opacity .85s ease,transform .85s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    heroText.style.opacity = '1';
    heroText.style.transform = 'translateY(0)';
  }));
});

/* =============================================
   PROFILE PHOTO FALLBACK
   Drop your photo as profile.jpg in this folder.
   "AJ" initials show automatically if the image is missing.
============================================= */
function setupPhotoFallback(imgEl, fallbackEl) {
  if (!imgEl || !fallbackEl) return;
  const showFallback = () => {
    imgEl.style.display = 'none';
    fallbackEl.style.display = 'flex';
  };
  const showPhoto = () => {
    fallbackEl.style.display = 'none';
    imgEl.style.display = 'block';
  };
  imgEl.addEventListener('error', showFallback);
  imgEl.addEventListener('load',  showPhoto);
  if (imgEl.complete) {
    imgEl.naturalHeight ? showPhoto() : showFallback();
  }
}

setupPhotoFallback(
  document.getElementById('heroPhoto'),
  document.getElementById('heroInitials')
);
setupPhotoFallback(
  document.querySelector('.about-photo'),
  document.querySelector('.about-photo-fb')
);

/* =============================================
   LOGO WALL — apply brand color CSS var to glow
   (CSS custom property --gc needs hex, not var())
============================================= */
const colorMap = {
  '--gc:#2f8d46': '47,141,70',
  '--gc:#4d8eff': '77,142,255',
  '--gc:#a78bfa': '167,139,250',
  '--gc:#fbbf24': '251,191,36',
};
document.querySelectorAll('.logo-wall__glow').forEach(glow => {
  const style = glow.getAttribute('style') || '';
  for (const [key, rgb] of Object.entries(colorMap)) {
    if (style.includes(key)) {
      glow.style.background = `radial-gradient(ellipse 60% 60% at 50% 100%, rgba(${rgb},0.12) 0%, transparent 70%)`;
      break;
    }
  }
});

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
   LOGO WALL — stagger reveal animation
============================================= */
const logoObs = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = [...document.querySelectorAll('.logo-wall__item')];
        items.forEach((item, i) => {
          setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease, filter 0.35s ease, background 0.35s ease';
            item.style.opacity = '0.55';
            item.style.transform = 'translateY(0)';
          }, i * 80);
        });
        logoObs.disconnect();
      }
    });
  },
  { threshold: 0.3 }
);
const logoWall = document.querySelector('.logo-wall__grid');
if (logoWall) {
  // Initial state
  document.querySelectorAll('.logo-wall__item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(12px)';
  });
  logoObs.observe(logoWall);
}

/* =============================================
   ACTIVE NAV LINK
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
