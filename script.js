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

  /* --------- PRELOADER --------- */
  const preloader = document.getElementById('preloader');
  function dismissPreloader() {
    if (!preloader) return;
    preloader.classList.add('hidden');
    // Trigger hero stagger entrance once preloader is gone
    setTimeout(() => document.body.classList.add('page-ready'), 100);
  }

  // Minimum display time so the animation is visible, then wait for load
  const minTime  = 700;
  const loadStart = Date.now();
  window.addEventListener('load', () => {
    const elapsed = Date.now() - loadStart;
    const remaining = Math.max(0, minTime - elapsed);
    setTimeout(dismissPreloader, remaining);
  });
  // Hard fallback in case 'load' already fired (cached page)
  if (document.readyState === 'complete') {
    setTimeout(dismissPreloader, minTime);
  }

  /* --------- HERO: headline underline animation --------- */
  const accentEl = document.querySelector('.hero__headline-accent');
  if (accentEl) {
    setTimeout(() => accentEl.classList.add('line-on'), 1000);
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

  /* --------- SCROLL PROGRESS BAR --------- */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
      progressBar.style.width = pct + '%';
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

  /* --------- ANIMATED COUNTERS (replay every time in view) --------- */
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix  || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1800;

    // Cancel any animation already running on this element
    if (el._rafId) {
      cancelAnimationFrame(el._rafId);
      el._rafId = null;
    }

    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const val      = eased * target;
      el.textContent = decimals > 0 ? val.toFixed(decimals) + suffix : Math.round(val) + suffix;
      if (progress < 1) {
        el._rafId = requestAnimationFrame(step);
      } else {
        el.textContent = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
        el._rafId = null;
      }
    }
    el._rafId = requestAnimationFrame(step);
  }

  // Keep watching — no unobserve, so it fires every time the number enters view.
  // When it leaves, reset to 0 so the next entry always starts from zero.
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
      } else {
        // Cancel any running animation and reset display to 0
        if (e.target._rafId) {
          cancelAnimationFrame(e.target._rafId);
          e.target._rafId = null;
        }
        const suffix   = e.target.dataset.suffix  || '';
        const decimals = parseInt(e.target.dataset.decimals || '0', 10);
        e.target.textContent = (decimals > 0 ? '0.0' : '0') + suffix;
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

  /* --------- ACTIVE NAV LINK on scroll --------- */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(a => {
          a.classList.remove('active');
          a.style.color = '';
          if (a.getAttribute('href') === `#${id}`) {
            a.classList.add('active');
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
      const navH = nav ? nav.offsetHeight : 68;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* --------- CASE STUDY: block & result stagger on reveal --------- */
  const csObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const art     = e.target;
        const blocks  = art.querySelectorAll('.cs__block');
        const results = art.querySelectorAll('.cs__result');

        // Stagger blocks — small delay so article fade-up starts first
        setTimeout(() => {
          blocks.forEach((b, i) => {
            setTimeout(() => b.classList.add('anim-in'), i * 90);
          });
        }, 120);

        // Results after blocks finish
        setTimeout(() => {
          results.forEach((r, i) => {
            setTimeout(() => r.classList.add('anim-in'), i * 70);
          });
        }, 460);

        csObs.unobserve(art);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.cs').forEach(cs => csObs.observe(cs));

  /* --------- ABOUT: credential dot reveal --------- */
  const credObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const dots = e.target.querySelectorAll('.cred__dot');
        dots.forEach((d, i) => {
          setTimeout(() => d.classList.add('anim-in'), i * 120);
        });
        credObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  const credWrap = document.querySelector('.about__creds');
  if (credWrap) credObs.observe(credWrap);

  /* --------- CARD TILT (pointer devices only) --------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.metric-card, .exp-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx   = rect.width  / 2;
        const cy   = rect.height / 2;
        const rx   = ((e.clientY - rect.top  - cy) / cy) * -7;
        const ry   = ((e.clientX - rect.left - cx) / cx) *  7;
        // Suppress transform transition during active tilt for responsiveness
        card.style.transition = 'border-color 0.3s, box-shadow 0.3s';
        card.style.transform  = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = '';
        card.style.transform  = '';
      });
    });
  }

  /* --------- MAGNETIC BUTTONS (pointer devices only) --------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x    = (e.clientX - rect.left - rect.width  / 2) * 0.14;
        const y    = (e.clientY - rect.top  - rect.height / 2) * 0.14;
        btn.style.transform = `translate(${x}px, ${y - 2}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* --------- BUTTON CURSOR SPOTLIGHT --------- */
  document.querySelectorAll('.btn--primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      btn.style.setProperty('--bx', x + '%');
      btn.style.setProperty('--by', y + '%');
    });
  });

})();
