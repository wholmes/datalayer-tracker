/* ============================================================
   PARTICLE MESH — Canvas 2D WebGL-style background
   ============================================================ */
class ParticleMesh {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -9999, y: -9999 };
    this.count = window.innerWidth < 768 ? 80 : 180;
    this.maxDist = 140;
    this.repulseRadius = 100;
    this.repulseStrength = 2.5;
    this.animId = null;
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        ox: 0, oy: 0,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.8 + 0.8,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.3,
      });
    }
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());
    const t = Date.now() * 0.001;
    const { ctx, width, height, particles, maxDist, mouse, repulseRadius, repulseStrength } = this;

    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx + Math.sin(t * 0.35 + p.phase) * 0.06;
      p.y += p.vy + Math.cos(t * 0.28 + p.phase) * 0.06;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < repulseRadius) {
        const force = (repulseRadius - dist) / repulseRadius;
        p.x += (dx / dist) * force * repulseStrength;
        p.y += (dy / dist) * force * repulseStrength;
      }
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = dx * dx + dy * dy;
        if (d < maxDist * maxDist) {
          const dist = Math.sqrt(d);
          const alpha = (1 - dist / maxDist) * 0.11;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(27,79,216,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(27,79,216,0.38)';
      ctx.fill();
    }
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.width  = this.canvas.width  = parent ? parent.offsetWidth  : window.innerWidth;
    this.height = this.canvas.height = parent ? parent.offsetHeight : window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    });
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.resize);
  }
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
class CustomCursor {
  constructor() {
    this.dot  = document.querySelector('.cursor-dot');
    this.ring = document.querySelector('.cursor-ring');
    if (!this.dot || !this.ring) return;

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse || reduceMotion) {
      document.body.classList.add('no-custom-cursor');
      return;
    }

    this.hasMoved = false;
    this.dx = 0; this.dy = 0;
    this.rx = 0; this.ry = 0;
    this.mx = 0; this.my = 0;

    this.init();
  }

  init() {
    const syncPointer = (e) => {
      this.mx = e.clientX;
      this.my = e.clientY;
      if (!this.hasMoved) {
        this.hasMoved = true;
        document.body.classList.add('cursor-active');
        // Snap to real coordinates so the ring/dot never sit at (0,0) or trail from there
        this.dx = this.mx;
        this.dy = this.my;
        this.rx = this.mx;
        this.ry = this.my;
        this.dot.style.left  = `${this.dx}px`;
        this.dot.style.top   = `${this.dy}px`;
        this.ring.style.left = `${this.rx}px`;
        this.ring.style.top  = `${this.ry}px`;
      }
    };

    document.addEventListener('pointermove', syncPointer, { passive: true });

    document.querySelectorAll('a, button, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    this.tick();
  }

  tick() {
    requestAnimationFrame(() => this.tick());
    if (!this.hasMoved) return;

    this.dx += (this.mx - this.dx) * 0.9;
    this.dy += (this.my - this.dy) * 0.9;
    this.rx += (this.mx - this.rx) * 0.12;
    this.ry += (this.my - this.ry) * 0.12;

    this.dot.style.left  = this.dx + 'px';
    this.dot.style.top   = this.dy + 'px';
    this.ring.style.left = this.rx + 'px';
    this.ring.style.top  = this.ry + 'px';
  }
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  els.forEach(el => io.observe(el));
}

/* ============================================================
   STICKY NAV
   ============================================================ */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let lastY = 0;
  let hidden = false;
  const HIDE_THRESHOLD = 80; // don't hide until past this scroll position

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);

    if (y < HIDE_THRESHOLD) {
      // Always show near the top
      if (hidden) { nav.classList.remove('nav-hidden'); hidden = false; }
    } else if (y > lastY + 6) {
      // Scrolling down — hide
      if (!hidden) { nav.classList.add('nav-hidden'); hidden = true; }
    } else if (y < lastY - 4) {
      // Scrolling up — reveal
      if (hidden) { nav.classList.remove('nav-hidden'); hidden = false; }
    }

    lastY = y;
  }, { passive: true });

  const burger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      document.body.style.overflow = open ? 'hidden' : '';
      const spans = burger.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  document.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu && mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   NUMBER COUNTER ANIMATION
   ============================================================ */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimals = target % 1 !== 0 ? 1 : 0;
      const duration = 1800;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + (eased * target).toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target.toFixed(decimals) + suffix;
      };

      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function initAccordion() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(i => {
        if (i !== item) i.classList.remove('open');
      });

      item.classList.toggle('open', !isOpen);
    });
  });
}

/* ============================================================
   PRICING TOGGLE
   ============================================================ */
function initPricingToggle() {
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  if (!toggleBtns.length) return;

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.dataset.mode;
      document.querySelectorAll('[data-price-monthly]').forEach(el => {
        const monthly = el.dataset.priceMonthly;
        const yearly  = el.dataset.priceYearly;
        el.textContent = mode === 'yearly' ? yearly : monthly;
      });

      document.querySelectorAll('[data-billing-note]').forEach(el => {
        el.innerHTML = mode === 'yearly'
          ? el.dataset.yearlyNote
          : el.dataset.monthlyNote;
      });
    });
  });
}

/* ============================================================
   TAB SYSTEM
   ============================================================ */
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabsEl => {
    const buttons = tabsEl.querySelectorAll('.tab-btn');
    const container = tabsEl.closest('.tabs-wrapper') || tabsEl.parentElement;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const target = btn.dataset.tab;
        container.querySelectorAll('.tab-panel').forEach(panel => {
          panel.classList.toggle('active', panel.dataset.panel === target);
        });
      });
    });
  });
}

/* ============================================================
   LIVE EVENT STREAM (hero mockup)
   ============================================================ */
function initEventStream() {
  const stream = document.querySelector('.event-stream');
  if (!stream) return;

  const events = [
    { type: 'purchase',  typeLabel: 'purchase',  name: 'WooCommerce Order #4821',  value: '$142.00', source: 'server-side' },
    { type: 'page_view', typeLabel: 'page_view',  name: '/shop/running-shoes',       value: null,      source: 'client' },
    { type: 'form',      typeLabel: 'form_submit', name: 'Lead Capture — Homepage',   value: null,      source: 'client' },
    { type: 'purchase',  typeLabel: 'purchase',  name: 'WooCommerce Order #4822',  value: '$89.00',  source: 'server-side' },
    { type: 'scroll',    typeLabel: 'scroll_75',  name: 'Blog: GTM Setup Guide',     value: '75%',     source: 'client' },
    { type: 'page_view', typeLabel: 'page_view',  name: '/pricing/',                 value: null,      source: 'client' },
    { type: 'form',      typeLabel: 'form_submit', name: 'Newsletter Signup',         value: null,      source: 'client' },
    { type: 'purchase',  typeLabel: 'purchase',  name: 'WooCommerce Order #4823',  value: '$215.50', source: 'server-side' },
  ];

  let idx = 0;
  let totalCount = 94200;
  const maxRows = 7;
  const countEl = document.getElementById('event-count');

  function addEvent() {
    const ev = events[idx % events.length];
    idx++;
    totalCount += Math.floor(Math.random() * 3) + 1;

    const row = document.createElement('div');
    row.className = 'event-row';
    row.innerHTML = `
      <span class="event-type et-${ev.type}">${ev.typeLabel}</span>
      <span class="event-name">${ev.name}</span>
      ${ev.value ? `<span class="event-value">${ev.value}</span>` : '<span></span>'}
      <span class="event-source">${ev.source}</span>
    `;

    stream.insertBefore(row, stream.firstChild);

    const rows = stream.querySelectorAll('.event-row');
    if (rows.length > maxRows) {
      const stale = rows[rows.length - 1];
      stale.style.transition = 'opacity 0.25s';
      stale.style.opacity = '0';
      // Remove only after the fade completes — the stream is overflow:hidden
      // so the container height never changes regardless.
      stale.addEventListener('transitionend', () => stale.remove(), { once: true });
    }

    if (countEl) {
      countEl.textContent = (totalCount / 1000).toFixed(1) + 'K events';
    }
  }

  addEvent(); addEvent(); addEvent(); addEvent(); addEvent();
  setInterval(addEvent, 1800);
}

/* ============================================================
   SMOOTH HOVER TILT on cards
   ============================================================ */
function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = (e.clientY - cy) / rect.height * 8;
      const ry = (e.clientX - cx) / rect.width * -8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================================================
   KB SEARCH — real-time filter across articles, categories, steps
   ============================================================ */
function initKBSearch() {
  const input = document.querySelector('.kb-search');
  if (!input) return;

  // Collect all searchable cards with their text content cached
  const buildIndex = () => [
    ...document.querySelectorAll('.kb-article-card'),
    ...document.querySelectorAll('.kb-category-card'),
    ...document.querySelectorAll('.step-item'),
  ].map(card => ({
    el: card,
    // Parent section wrapper — used to show/hide whole sections when empty
    section: card.closest('section') || card.closest('.section'),
    // Cache lowercased text for fast matching
    text: card.textContent.toLowerCase(),
    // Remember original inner HTML so we can restore after highlighting
    originalHTML: card.innerHTML,
  }));

  let index = null;

  // Highlight a query term inside text nodes only (safe, no HTML corruption)
  function highlight(card, query) {
    if (!query) {
      card.el.innerHTML = card.originalHTML;
      return;
    }
    // Walk text nodes and wrap matches in <mark>
    const walker = document.createTreeWalker(card.el, NodeFilter.SHOW_TEXT, null);
    const matches = [];
    let node;
    while ((node = walker.nextNode())) {
      const idx = node.textContent.toLowerCase().indexOf(query);
      if (idx !== -1) matches.push(node);
    }
    matches.forEach(node => {
      const parent = node.parentNode;
      if (!parent || parent.classList?.contains('kb-search-highlight')) return;
      const before = node.textContent.slice(0, node.textContent.toLowerCase().indexOf(query));
      const match  = node.textContent.slice(node.textContent.toLowerCase().indexOf(query), node.textContent.toLowerCase().indexOf(query) + query.length);
      const after  = node.textContent.slice(node.textContent.toLowerCase().indexOf(query) + query.length);
      const mark = document.createElement('mark');
      mark.className = 'kb-search-highlight';
      mark.textContent = match;
      const frag = document.createDocumentFragment();
      if (before) frag.appendChild(document.createTextNode(before));
      frag.appendChild(mark);
      if (after) frag.appendChild(document.createTextNode(after));
      parent.replaceChild(frag, node);
    });
  }

  // Per-section empty state messages
  const emptyMessages = {};
  const getSectionEmptyEl = (section) => {
    if (!section) return null;
    if (!emptyMessages[section]) {
      const msg = document.createElement('p');
      msg.className = 'kb-search-empty';
      msg.setAttribute('aria-live', 'polite');
      section.querySelector('.container')?.appendChild(msg);
      emptyMessages[section] = msg;
    }
    return emptyMessages[section];
  };

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (!index) index = buildIndex();

      const raw = input.value.trim();
      const query = raw.toLowerCase();

      // Restore all originals first
      index.forEach(card => { card.el.innerHTML = card.originalHTML; });

      // Track visible counts per section
      const sectionCounts = new Map();
      index.forEach(({ section }) => {
        if (section && !sectionCounts.has(section)) sectionCounts.set(section, 0);
      });

      index.forEach(card => {
        const matches = !query || card.text.includes(query);
        card.el.style.display = matches ? '' : 'none';
        if (matches && card.section) {
          sectionCounts.set(card.section, (sectionCounts.get(card.section) || 0) + 1);
        }
        if (matches && query) highlight(card, query);
      });

      // Show/hide empty-state messages per section
      sectionCounts.forEach((count, section) => {
        const msg = getSectionEmptyEl(section);
        if (msg) {
          msg.textContent = count === 0 && query
            ? `No results for "${raw}" in this section.`
            : '';
        }
      });

      // Global empty state on the input itself
      input.classList.toggle('kb-search--empty', query.length > 0 && [...sectionCounts.values()].every(c => c === 0));
    }, 120);
  });

  // Clear on Escape
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.blur();
    }
  });
}

/* ============================================================
   SECTION RAIL — collapsible in-page section jumps
   ============================================================ */
const SECTION_RAIL_KEY = 'dt-section-rail-open';

function scrollToSectionTarget(el) {
  const offset = 96;
  const lenis = window.lenisInstance;
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(el, { offset: -offset, duration: 1.15 });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }
}

function initSectionRail() {
  const sections = [...document.querySelectorAll('section[id][data-rail-label]')].filter(
    (s) => !s.closest('footer')
  );
  if (sections.length < 2) return;

  const rail = document.createElement('aside');
  rail.className = 'section-rail';
  rail.setAttribute('aria-label', 'On this page');

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'section-rail__toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'section-rail-panel');
  toggle.id = 'section-rail-toggle';
  toggle.title = 'On this page';
  toggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;

  const panel = document.createElement('nav');
  panel.className = 'section-rail__panel';
  panel.id = 'section-rail-panel';
  panel.setAttribute('aria-label', 'Page sections');

  const links = [];

  sections.forEach((sec) => {
    const label = sec.dataset.railLabel.trim();
    const id = sec.id;
    const a = document.createElement('a');
    a.className = 'section-rail__slot';
    a.href = `#${id}`;
    a.setAttribute('data-rail-target', id);
    a.innerHTML = `
      <div class="section-rail__slot-titlebar">
        <span class="section-rail__slot-dot" aria-hidden="true"></span>
        <span class="section-rail__slot-dot" aria-hidden="true"></span>
        <span class="section-rail__slot-dot" aria-hidden="true"></span>
        <span class="section-rail__slot-label"></span>
      </div>
      <div class="section-rail__slot-body" aria-hidden="true"></div>
    `;
    a.querySelector('.section-rail__slot-label').textContent = label;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSectionTarget(sec);
      setActive(id);
      rail.classList.remove('is-expanded');
      toggle.setAttribute('aria-expanded', 'false');
      try {
        localStorage.setItem(SECTION_RAIL_KEY, '0');
      } catch (_) {}
    });
    panel.appendChild(a);
    links.push({ id, el: a, sec });
  });

  function setActive(activeId) {
    links.forEach(({ id, el }) => el.classList.toggle('is-active', id === activeId));
  }

  function readExpandedPref() {
    try {
      return localStorage.getItem(SECTION_RAIL_KEY) === '1';
    } catch (_) {
      return false;
    }
  }

  function applyExpanded(expanded) {
    rail.classList.toggle('is-expanded', expanded);
    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    try {
      localStorage.setItem(SECTION_RAIL_KEY, expanded ? '1' : '0');
    } catch (_) {}
  }

  // Default collapsed; open if user left it open last visit
  if (readExpandedPref()) {
    applyExpanded(true);
  }

  toggle.addEventListener('click', () => {
    applyExpanded(!rail.classList.contains('is-expanded'));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && rail.classList.contains('is-expanded')) {
      applyExpanded(false);
      toggle.focus();
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((en) => en.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) {
        const id = visible[0].target.id;
        if (id) setActive(id);
      }
    },
    { root: null, rootMargin: '-42% 0px -42% 0px', threshold: [0, 0.08, 0.2, 0.35] }
  );
  sections.forEach((sec) => io.observe(sec));

  rail.appendChild(toggle);
  rail.appendChild(panel);
  document.body.appendChild(rail);

  if (sections[0]?.id) setActive(sections[0].id);
}

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 2px;
    left: 0;
    height: 2px;
    background: rgba(255,255,255,0.35);
    z-index: 10000;
    pointer-events: none;
    transform-origin: left;
    transform: scaleX(0);
    transition: transform 0.1s linear;
    width: 100%;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${progress})`;
  }, { passive: true });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  new CustomCursor();

  // BFCache restore: clear stale tilt transforms
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      document.querySelectorAll('[data-tilt]').forEach((c) => {
        c.style.transform = '';
      });
    }
  });

  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) new ParticleMesh(heroCanvas);

  initNav();
  initScrollReveal();
  animateCounters();
  initAccordion();
  initPricingToggle();
  initTabs();
  initEventStream();
  initTilt();
  initSmoothScroll();
  initScrollProgress();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  initKBSearch();

  // After scroll.js (same tick) registers Lenis
  setTimeout(() => initSectionRail(), 0);
});
