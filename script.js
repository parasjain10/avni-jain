/* ============================================================
   AVNI JAIN — PORTFOLIO · script.js
   ============================================================ */

(function () {
  'use strict';

  /* --------- NAV: scroll shrink + mobile toggle --------- */
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const links  = document.querySelector('.nav__links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (burger && links) {
    burger.addEventListener('click', () => {
      links.classList.toggle('open');
      const isOpen = links.classList.contains('open');
      burger.setAttribute('aria-expanded', isOpen);
      const spans = burger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* --------- HERO: headline underline animation --------- */
  const accent = document.querySelector('.hero__headline-accent');
  if (accent) {
    // trigger after a short delay so user sees it animate in
    setTimeout(() => accent.classList.add('line-on'), 700);
  }

  /* --------- HERO: photo fallback --------- */
  function setupPhotoFallback(imgId, fbId) {
    const img = document.getElementById(imgId);
    const fb  = document.getElementById(fbId);
    if (!img || !fb) return;
    const show = () => { img.style.display = 'none'; fb.style.display = 'flex'; };
    img.addEventListener('error', show);
    if (img.complete && img.naturalWidth === 0) show();
  }
  setupPhotoFallback('heroPhoto', 'heroInit');

  // About section photo fallback (no explicit ids, use class)
  document.querySelectorAll('.about__photo').forEach(img => {
    img.addEventListener('error', () => {
      const fb = img.nextElementSibling;
      if (fb && fb.classList.contains('about__photo-fb')) {
        img.style.display = 'none';
        fb.style.display = 'flex';
      }
    });
    if (img.complete && img.naturalWidth === 0) {
      const fb = img.nextElementSibling;
      if (fb && fb.classList.contains('about__photo-fb')) {
        img.style.display = 'none';
        fb.style.display = 'flex';
      }
    }
  });

  /* --------- HERO: parallax background on scroll --------- */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroBg.style.transform = `translateY(${y * 0.25}px)`;
      }
    }, { passive: true });
  }

  /* --------- SCROLL REVEAL: fade-up --------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => revealObs.observe(el));

  /* --------- ANIMATED COUNTERS --------- */
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix  || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const val   = eased * target;
      el.textContent = decimals > 0 ? val.toFixed(decimals) + suffix : Math.round(val) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
    }
    requestAnimationFrame(step);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

  /* --------- ACTIVE NAV LINK on scroll --------- */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === `#${id}`) {
            a.style.color = 'var(--text)';
          }
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(s => activeObs.observe(s));

  /* --------- SMOOTH SCROLL for nav links --------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH   = nav ? nav.offsetHeight : 68;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
