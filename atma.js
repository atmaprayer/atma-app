/* ============================================
   ATMA — Shared JavaScript
   ============================================ */

(function () {
  const Atma = {};

  // ----- Cursor -----
  Atma.initCursor = function () {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    if (!cursor || !ring) return;

    let targetX = 0, targetY = 0;
    let ringX = 0, ringY = 0;
    const lerp = (a, b, t) => a + (b - a) * t;

    const move = (x, y) => {
      cursor.style.left = x + 'px';
      cursor.style.top = y + 'px';
      targetX = x;
      targetY = y;
    };

    document.addEventListener('mousemove', (e) => move(e.clientX, e.clientY), { passive: true });

    // Smooth ring follow
    const tick = () => {
      ringX = lerp(ringX, targetX, 0.16);
      ringY = lerp(ringY, targetY, 0.16);
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Hover enlarge
    const hoverables = () => document.querySelectorAll('a, button, .clickable, [data-cursor]');
    const bindHover = () => {
      hoverables().forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursor.style.width = '20px';
          cursor.style.height = '20px';
        });
        el.addEventListener('mouseleave', () => {
          cursor.style.width = '10px';
          cursor.style.height = '10px';
        });
      });
    };
    bindHover();
  };

  // ----- Stars -----
  Atma.initStars = function (count = 150) {
    const container = document.getElementById('stars');
    if (!container) return;
    if (container.dataset.inited === '1') return;
    container.dataset.inited = '1';

    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const sz = Math.random() * 2 + 0.4;
      s.style.cssText =
        `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;` +
        `--dur:${3 + Math.random() * 5}s;--min-op:${0.05 + Math.random() * 0.1};--max-op:${0.25 + Math.random() * 0.4};` +
        `animation-delay:${Math.random() * 6}s;`;
      container.appendChild(s);
    }
  };

  // ----- Scroll reveal -----
  Atma.initReveal = function () {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.08 }
    );

    els.forEach((el) => obs.observe(el));
  };

  // ----- Mobile nav -----
  Atma.initMobileNav = function () {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

    // Close on navigation
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  };

  // ----- Active link -----
  Atma.initActiveNav = function () {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    const here = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.querySelectorAll('a').forEach((a) => {
      const href = (a.getAttribute('href') || '').split('/').pop();
      if (!href) return;
      if (href === here) a.classList.add('active');
      else a.classList.remove('active');
    });
  };

  // ----- Init all -----
  Atma.init = function () {
    Atma.initCursor();
    Atma.initStars();
    Atma.initReveal();
    Atma.initMobileNav();
    Atma.initActiveNav();
  };

  window.Atma = Atma;
  document.addEventListener('DOMContentLoaded', Atma.init);
})();
