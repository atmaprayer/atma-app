// ============================================
// ATMA — Shared JavaScript
// ============================================

// ---- CURSOR ----
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
if (cursor) {
  let ringX = 0, ringY = 0;
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    ringX += (e.clientX - ringX) * 0.15;
    ringY += (e.clientY - ringY) * 0.15;
    if (cursorRing) { cursorRing.style.left = e.clientX + 'px'; cursorRing.style.top = e.clientY + 'px'; }
  });
  document.querySelectorAll('a, button, .clickable').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '20px'; cursor.style.height = '20px'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '10px'; cursor.style.height = '10px'; });
  });
}

// ---- STARS ----
function initStars(count = 150) {
  const container = document.getElementById('stars');
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const sz = Math.random() * 2 + 0.4;
    s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--dur:${3+Math.random()*5}s;--min-op:${0.05+Math.random()*0.1};--max-op:${0.25+Math.random()*0.4};animation-delay:${Math.random()*6}s;`;
    container.appendChild(s);
  }
}

// ---- SCROLL REVEAL ----
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

// ---- MOBILE NAV ----
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
}

// ---- AUDIO PLAYER ----
let currentAudio = null;
function toggleAudio(btn, src) {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    document.querySelectorAll('.play-btn').forEach(b => b.innerHTML = '&#9654;');
    if (currentAudio._btn === btn) { currentAudio = null; return; }
  }
  if (src) {
    currentAudio = new Audio(src);
    currentAudio._btn = btn;
    currentAudio.play();
    btn.innerHTML = '&#9646;&#9646;';
    currentAudio.addEventListener('ended', () => { btn.innerHTML = '&#9654;'; });
  } else {
    btn.innerHTML = '&#9654;';
  }
}

// ---- INIT ALL ----
document.addEventListener('DOMContentLoaded', () => {
  initStars();
  initReveal();
  initMobileNav();
});
