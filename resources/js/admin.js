/**
 * NLM Admin — Clockwork Terminal
 * Cursor, boot overlay, and interaction animations
 * Vanilla JS — no framework dependencies
 */
(function () {
  'use strict';

  const PANEL_CLASSES = ['fi-panel-admin', 'fi-panel-app', 'fi-panel-server'];
  const PANEL_ID = PANEL_CLASSES.find(cls => document.body.classList.contains(cls));
  if (!PANEL_ID) return;

  const IS_ADMIN  = PANEL_ID === 'fi-panel-admin';
  // const IS_APP    = PANEL_ID === 'fi-panel-app';
  // const IS_SERVER = PANEL_ID === 'fi-panel-server';

  /* ── FORCE DARK MODE ─────────────────────────────────── */
  document.documentElement.classList.add('dark');
  localStorage.setItem('theme', 'dark');

  /* ── BOOT OVERLAY ────────────────────────────────────── */
  function createBoot() {
    const key = 'nlm-booted-' + PANEL_ID;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');

    const el = document.createElement('div');
    el.id = 'nlm-boot';
    el.innerHTML = `
      <p class="nlm-boot-title">NLManager ·· INIT_SEQUENCE</p>
      <div class="nlm-boot-bar-wrap"><div class="nlm-boot-bar-fill"></div></div>
      <p class="nlm-boot-sub">Loading system modules…</p>
    `;
    document.body.appendChild(el);

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
      setTimeout(() => el.remove(), 450);
    }, 1000);
  }

  /* ── SCANLINES ───────────────────────────────────────── */
  function createScanlines() {
    if (document.getElementById('nlm-scanlines')) return;
    const el = document.createElement('div');
    el.id = 'nlm-scanlines';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
  }

  /* ── REVEAL ANIMATIONS (IntersectionObserver) ─────────── */
  function setupReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    function observe() {
      document.querySelectorAll(
        '.fi-section:not([data-nlm-observed]), .fi-wi-stats-overview-stat:not([data-nlm-observed]), .fi-ta-ctn:not([data-nlm-observed])'
      ).forEach((el, i) => {
        el.setAttribute('data-nlm-observed', '1');
        el.style.animationDelay = (i * 60) + 'ms';
        el.style.animationPlayState = 'paused';
        observer.observe(el);
      });
    }

    observe();
    document.addEventListener('livewire:navigated', () => {
      setTimeout(observe, 80);
    });
  }

  /* ── HOVER: SIDEBAR ITEM SWEEP LINES ─────────────────── */
  function sidebarRipple() {
    function attach() {
      document.querySelectorAll('.fi-sidebar-item-btn:not([data-nlm-r])').forEach(btn => {
        btn.setAttribute('data-nlm-r', '1');
        btn.addEventListener('mouseenter', () => {
          const line = btn.querySelector('[data-nlm-line]');
          if (line) { line.style.width = '100%'; }
        });
        btn.addEventListener('mouseleave', () => {
          const line = btn.querySelector('[data-nlm-line]');
          if (line) { line.style.width = '0'; }
        });
      });
    }
    attach();
    document.addEventListener('livewire:navigated', attach);
  }

  /* ── PAGE TRANSITION SHIMMER ──────────────────────────── */
  function setupPageGlint() {
    const glint = document.createElement('div');
    glint.style.cssText = `
      position:fixed; top:0; left:0; right:0; height:2px;
      background:linear-gradient(90deg,transparent,var(--nlm-gold),transparent);
      z-index:9998; pointer-events:none; opacity:0;
      transition:opacity .2s;
    `;
    document.body.appendChild(glint);

    document.addEventListener('livewire:navigate', () => {
      glint.style.opacity = '1';
      glint.style.animation = 'nlm-boot-bar .6s ease both';
    });
    document.addEventListener('livewire:navigated', () => {
      glint.style.animation = '';
      glint.style.opacity = '0';
    });
  }

  /* ── TERMINAL TYPING EFFECT ON PAGE HEADINGS ──────────── */
  function typingEffect() {
    function apply() {
      document.querySelectorAll('.fi-header-heading:not([data-nlm-typed])').forEach(el => {
        el.setAttribute('data-nlm-typed', '1');
        const text = el.textContent.trim();
        el.textContent = '';
        el.style.borderRight = '2px solid var(--nlm-gold)';
        el.style.animation = 'none';

        let i = 0;
        const speed = Math.max(18, 500 / text.length);
        const interval = setInterval(() => {
          el.textContent = text.slice(0, ++i);
          if (i >= text.length) {
            clearInterval(interval);
            // Blink cursor then remove
            setTimeout(() => { el.style.borderRight = 'none'; }, 800);
          }
        }, speed);
      });
    }
    setTimeout(apply, 200);
    document.addEventListener('livewire:navigated', () => setTimeout(apply, 200));
  }

  /* ── INIT ────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    createBoot();
    createScanlines();
    setupReveal();
    sidebarRipple();
    setupPageGlint();
    typingEffect();
  }
})();
