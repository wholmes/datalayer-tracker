/* ============================================================
   SCROLL.JS — Lenis + GSAP ScrollTrigger cinematic scroll
   ============================================================ */

// ============================================================
// LENIS SMOOTH SCROLL
// ============================================================
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.8,
    infinite: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  window.lenisInstance = lenis;
}

// ============================================================
// TEXT SPLIT — word by word
// ============================================================

// Inline elements whose styling uses background-clip (gradients, etc.)
// must NOT be recursed into. Wrap the whole element as one animation unit.
const ATOMIC_SPAN_CLASSES = ['gradient-text', 'gradient-text-2', 'gradient-text-teal'];

function splitIntoWords(el) {
  if (!el) return [];
  if (el.classList.contains('is-split')) {
    return el.querySelectorAll('.split-word-inner');
  }
  el.dataset.originalHtml = el.innerHTML;

  const isAtomic = (node) =>
    node.nodeType === Node.ELEMENT_NODE && (
      ATOMIC_SPAN_CLASSES.some(cls => node.classList.contains(cls)) ||
      node.hasAttribute('data-atomic')
    );

  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach(word => {
        if (word.match(/^\s+$/)) {
          // Preserve word spacing (single space is sufficient)
          frag.appendChild(document.createTextNode(' '));
        } else if (word.length > 0) {
          const wrap = document.createElement('span');
          wrap.className = 'split-word';
          const inner = document.createElement('span');
          inner.className = 'split-word-inner';
          inner.textContent = word;
          wrap.appendChild(inner);
          frag.appendChild(wrap);
        }
      });
      node.parentNode.replaceChild(frag, node);

    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (isAtomic(node)) {
        // Wrap the whole styled span as ONE animation unit
        const wrap = document.createElement('span');
        wrap.className = 'split-word';
        const inner = document.createElement('span');
        inner.className = 'split-word-inner';
        // Move the original node inside inner, preserving all its CSS classes
        node.parentNode.insertBefore(wrap, node);
        inner.appendChild(node);
        wrap.appendChild(inner);
      } else if (node.tagName !== 'BR') {
        // Normal elements: recurse into children, preserve the element itself
        Array.from(node.childNodes).forEach(processNode);
      }
      // <br> tags are left untouched — they still force line breaks
    }
  };

  Array.from(el.childNodes).forEach(processNode);
  el.classList.add('is-split');
  return el.querySelectorAll('.split-word-inner');
}

// ============================================================
// HERO ANIMATIONS
// ============================================================
function triggerHeroEntrance(hero) {
  const headline = hero.querySelector('.hero-headline');

  // Strip the class → browser forgets animation state
  hero.classList.remove('hero-animated');

  // Re-split if needed (first run or after DOM restore)
  if (headline && !headline.classList.contains('is-split')) {
    const words = splitIntoWords(headline);
    words.forEach((word, i) => {
      word.style.animationDelay = (0.35 + i * 0.055) + 's';
    });
  }

  // Force a reflow so the browser registers the class removal
  void hero.offsetWidth;

  // Re-add → all animations restart from their 'from' state
  hero.classList.add('hero-animated');
}

function initHeroAnimations() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Skip parallax/scrub effects on mobile — they feel wrong on touch
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (isMobile) {
    gsap.set(['.hero-content', '.hero-mockup-wrap'], { clearProps: 'all' });
    const headline = hero.querySelector('.hero-headline');
    if (headline && !headline.classList.contains('is-split')) {
      const words = splitIntoWords(headline);
      words.forEach((word, i) => {
        word.style.animationDelay = (0.35 + i * 0.055) + 's';
      });
    }
    // Still fire the entrance on mobile
    triggerHeroEntrance(hero);
    return;
  }

  // Fire immediately on first load
  triggerHeroEntrance(hero);

  // Re-fire every time the hero scrolls back into view
  ScrollTrigger.create({
    trigger: hero,
    start: 'top 80%',
    onEnter: () => triggerHeroEntrance(hero),
    onEnterBack: () => triggerHeroEntrance(hero),
  });

  gsap.to('.blob-1', {
    y: -100,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 2,
    }
  });

  gsap.to('.blob-2', {
    y: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 3,
    }
  });

  gsap.to('.blob-3', {
    y: -80,
    x: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 2.5,
    }
  });

  // Canvas parallax
  gsap.to('#hero-canvas', {
    y: 150,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    }
  });

  // Hero content drifts up gently as you scroll out.
  // immediateRender: false → GSAP won't apply y:-60/opacity:0 on init
  // (avoids blank hero when browser restores a non-zero scroll position).
  gsap.to('.hero-content', {
    y: -50,
    opacity: 0,
    ease: 'none',
    immediateRender: false,
    scrollTrigger: {
      trigger: hero,
      start: '20% top',
      end: 'bottom top',
      scrub: 1.2,
    }
  });

  // Mockup parallax — slower than the text for depth
  gsap.to('.hero-mockup-wrap', {
    y: -30,
    ease: 'none',
    immediateRender: false,
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.8,
    }
  });

  // Scroll hint fade out on scroll
  gsap.to('.scroll-hint', {
    opacity: 0,
    y: 10,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=200',
      scrub: true,
    }
  });
}

// ============================================================
// SCROLL STORY (Pinned How It Works)
// ============================================================
function initScrollStory() {
  const storyInner = document.querySelector('.scroll-story-inner');
  if (!storyInner) return;

  const sticky = document.querySelector('.scroll-story-sticky');
  const scroller = document.querySelector('.scroll-story-scroller');
  const panels = document.querySelectorAll('.story-panel');
  const steps = document.querySelectorAll('.story-step');

  if (!sticky || !scroller || !panels.length) return;

  // Activate first step immediately
  steps[0] && steps[0].classList.add('is-active');

  // ScrollTrigger for each panel — activates the corresponding step
  panels.forEach((panel, i) => {
    const card = panel.querySelector('.story-panel-card');

    ScrollTrigger.create({
      trigger: panel,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => {
        steps.forEach((s, si) => s.classList.toggle('is-active', si === i));
        if (card) card.classList.add('is-visible');
      },
      onEnterBack: () => {
        steps.forEach((s, si) => s.classList.toggle('is-active', si === i));
        if (card) card.classList.add('is-visible');
      },
      // Only reset when scrolling BACK UP past the panel start — never on forward scroll
      onLeaveBack: () => {
        if (card) card.classList.remove('is-visible');
      },
    });
  });

  // Section headline word split
  const storyHeadline = document.querySelector('.scroll-story-headline');
  if (storyHeadline) {
    const words = splitIntoWords(storyHeadline);
    gsap.from(words, {
      y: '100%',
      opacity: 0,
      duration: 0.65,
      stagger: 0.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: storyHeadline,
        start: 'top bottom',
        toggleActions: 'play none none reset',
      }
    });
  }
}

// ============================================================
// HORIZONTAL SCROLL SHOWCASE
// ============================================================
function initHorizontalScroll() {
  const section  = document.querySelector('.h-scroll-section');
  const track    = document.querySelector('.h-scroll-track');
  const progressFill = document.querySelector('.h-scroll-progress-fill');

  if (!section || !track) return;

  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    // Distance = full track width minus one viewport width
    // Recalculated on resize via invalidateOnRefresh + function syntax
    const getDistance = () => track.scrollWidth - window.innerWidth;

    const anim = gsap.to(track, {
      x: () => -getDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${getDistance()}`,
        pin: true,
        anticipatePin: 1,
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressFill) progressFill.style.width = (self.progress * 100) + '%';
        },
      },
    });

    return () => anim.kill();
  });

  // Mobile: CSS already sets overflow-x:auto; just ensure the track
  // has no leftover GSAP transform from a previous resize
  mm.add('(max-width: 767px)', () => {
    gsap.set(track, { x: 0, clearProps: 'x' });
  });
}

// ============================================================
// SECTION TEXT REVEALS
// ============================================================
function initTextReveals() {
  const reduced = window.matchMedia('(max-width: 768px)').matches;

  // Word-split section headings — skip hero and scroll-story (each handled by their own init)
  document.querySelectorAll('[data-split]').forEach(el => {
    if (el.closest('.hero')) return;
    if (el.closest('.scroll-story')) return;

    const words = splitIntoWords(el);
    if (!words.length) return;

    gsap.from(words, {
      y: reduced ? '60%' : '105%',
      opacity: 0,
      duration: reduced ? 0.5 : 0.68,
      stagger: reduced ? 0.03 : 0.048,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        toggleActions: 'play none none reset',
      }
    });
  });

  // Sub-copy fade-ups
  document.querySelectorAll('[data-fade-up]').forEach(el => {
    if (el.closest('.hero')) return;
    if (el.closest('.scroll-story')) return;

    gsap.from(el, {
      y: reduced ? 16 : 28,
      opacity: 0,
      duration: 0.65,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        toggleActions: 'play none none reset',
      }
    });
  });
}

// ============================================================
// STAGGERED CARD CASCADES
// ============================================================
function initCardCascades() {
  document.querySelectorAll('.card-group').forEach(group => {
    // pain-card is handled exclusively by initPainCards to avoid double-trigger
    const cards = group.querySelectorAll('.feature-card, .kb-category-card, .kb-article-card, .step-item, .pricing-value-card');
    if (!cards.length) return;

    gsap.to(cards, {
      y: 0,
      opacity: 1,
      duration: 0.65,
      stagger: { amount: 0.5, ease: 'power2.out' },
      ease: 'power3.out',
      scrollTrigger: {
        trigger: group,
        start: 'top bottom',
        toggleActions: 'play none none reset',
        onLeaveBack: () => gsap.set(cards, { opacity: 0, y: 30 }),
      }
    });
  });

  // Spotlight sections
  document.querySelectorAll('.spotlight').forEach(spotlight => {
    const text = spotlight.querySelector('.spotlight-text');
    const visual = spotlight.querySelector('.spotlight-visual, .feature-visual-box');
    const isReverse = spotlight.classList.contains('reverse');

    if (text) {
      gsap.from(text, {
        x: isReverse ? 60 : -60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: spotlight,
          start: 'top bottom',
          toggleActions: 'play none none reset',
        }
      });
    }

    if (visual) {
      gsap.from(visual, {
        x: isReverse ? -60 : 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.15,
        scrollTrigger: {
          trigger: spotlight,
          start: 'top bottom',
          toggleActions: 'play none none reset',
        }
      });
    }
  });
}

// ============================================================
// STATS SECTION — scrubbed count-up
// ============================================================
function initStatsScrub() {
  const statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;

  document.querySelectorAll('.stat-number [data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = (target % 1 !== 0) ? 1 : 0;
    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 1.6,
      ease: 'power3.out',
      onUpdate: () => {
        el.textContent = prefix + obj.val.toFixed(decimals) + suffix;
      },
      scrollTrigger: {
        trigger: statsBar,
        start: 'top bottom',
        toggleActions: 'restart none none reset',
      }
    });
  });

  // Stats bar itself slides up
  gsap.from('.stat-item', {
    y: 40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: statsBar,
      start: 'top bottom',
      toggleActions: 'play none none reset',
    }
  });
}

// ============================================================
// SECTION RULES (decorative lines that draw in)
// ============================================================
function initSectionRules() {
  document.querySelectorAll('.section-rule').forEach(rule => {
    gsap.from(rule, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: rule,
        start: 'top bottom',
        toggleActions: 'play none none reset',
      }
    });
  });
}

// ============================================================
// CTA SECTION ENTRANCE
// ============================================================
function initCtaEntrance() {
  const cta = document.querySelector('.cta-section');
  if (!cta) return;

  const inner = cta.querySelector('.cta-inner');

  gsap.from(inner, {
    scale: 0.95,
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: cta,
      start: 'top bottom',
      toggleActions: 'play none none reset',
    }
  });
}

// ============================================================
// SOCIAL PROOF BAR ENTRANCE
// ============================================================
function initSocialProof() {
  const bar = document.querySelector('.social-proof-bar');
  if (!bar) return;

  gsap.from('.social-proof-stat', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: bar,
      start: 'top bottom',
      toggleActions: 'play none none reset',
    }
  });
}

// ============================================================
// PRICING CARDS ENTRANCE
// ============================================================
function initPricingEntrance() {
  const grid = document.querySelector('.pricing-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.pricing-card');

  gsap.from(cards[0], {
    x: -60,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: grid, start: 'top bottom', toggleActions: 'play none none reset' }
  });

  if (cards[1]) {
    gsap.from(cards[1], {
      x: 60,
      opacity: 0,
      duration: 0.8,
      delay: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: grid, start: 'top bottom', toggleActions: 'play none none reset' }
    });
  }
}

// ============================================================
// PAIN CARDS STAGGER
// ============================================================
function initPainCards() {
  const grid = document.querySelector('.pain-grid');
  if (!grid) return;

  gsap.from(grid.querySelectorAll('.pain-card'), {
    y: 48,
    opacity: 0,
    duration: 0.65,
    stagger: { amount: 0.6, from: 'start' },
    ease: 'power3.out',
    scrollTrigger: {
      trigger: grid,
      start: 'top bottom',
      toggleActions: 'play none none reset',
    }
  });
}

// ============================================================
// COMPARISON TABLE — row by row reveal
// ============================================================
function initTableReveal() {
  const table = document.querySelector('.comparison-table');
  if (!table) return;

  gsap.from(table, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: table,
      start: 'top bottom',
      toggleActions: 'play none none reset',
    }
  });

  gsap.from(table.querySelectorAll('tbody tr'), {
    x: -20,
    opacity: 0,
    duration: 0.4,
    stagger: 0.05,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: table,
      start: 'top bottom',
      toggleActions: 'play none none reset',
    }
  });
}

// ============================================================
// FAQ ENTRANCE
// ============================================================
function initFaqEntrance() {
  const list = document.querySelector('.faq-list');
  if (!list) return;

  gsap.from(list.querySelectorAll('.faq-item'), {
    y: 24,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: list,
      start: 'top bottom',
      toggleActions: 'play none none reset',
    }
  });
}

// ============================================================
// KB ARTICLES ENTRANCE
// ============================================================
function initKBEntrance() {
  const articleGrid = document.querySelector('.kb-article-grid');
  if (!articleGrid) return;

  const cards = articleGrid.querySelectorAll('.kb-article-card');
  gsap.to(cards, {
    y: 0,
    opacity: 1,
    duration: 0.55,
    stagger: 0.07,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: articleGrid,
      start: 'top bottom',
      toggleActions: 'play none none reset',
      onLeaveBack: () => gsap.set(cards, { opacity: 0, y: 32 }),
    }
  });
}

// ============================================================
// PAGE HERO (non-home pages) — entrance
// ============================================================
function initPageHeroEntrance() {
  const pageHero = document.querySelector('.page-hero');
  if (!pageHero) return;

  const eyebrow = pageHero.querySelector('.chip');
  const h1 = pageHero.querySelector('h1');
  const p = pageHero.querySelector('p');
  const actions = pageHero.querySelector('.flex, .kb-search-wrap');
  const toggleWrap = document.querySelector('.pricing-toggle');

  const els = [eyebrow, h1, p, actions, toggleWrap].filter(Boolean);
  gsap.from(els, {
    y: 24,
    opacity: 0,
    duration: 0.65,
    stagger: 0.1,
    ease: 'power3.out',
    delay: 0.2,
  });
}

// ============================================================
// FEATURE FULL CARDS
// ============================================================
function initFeatureFullCards() {
  // Skip stack items — handled by initCardStack
  document.querySelectorAll('.feature-full-card:not(.card-stack-item)').forEach((card) => {
    gsap.to(card, {
      y: 0,
      opacity: 1,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        toggleActions: 'play none none reset',
        onLeaveBack: () => gsap.set(card, { opacity: 0, y: 30 }),
      }
    });
  });
}

// ============================================================
// CARD STACK — stacked cards that peel away on scroll
// ============================================================
function initCardStack() {
  const stacks = document.querySelectorAll('.card-stack');
  if (!stacks.length) return;

  // Disable on mobile
  if (window.matchMedia('(max-width: 768px)').matches) return;

  stacks.forEach(stack => {
    const cards = stack.querySelectorAll('.card-stack-item');
    if (cards.length < 2) return;

    // Stagger sticky top so cards peek below the one above — 12px per level
    const PEEK = 12;
    cards.forEach((card, i) => {
      card.style.top = `${100 + (cards.length - 1 - i) * PEEK}px`;
    });

    cards.forEach((card, i) => {
      const isLast = i === cards.length - 1;
      // depth: 0 = frontmost (last in DOM), n = furthest behind
      const depth = cards.length - 1 - i;

      // Set initial resting scale — cards behind are slightly smaller
      gsap.set(card, {
        scale: 1 - depth * 0.02,
        transformOrigin: 'top center',
      });

      // As each subsequent card scrolls into place, push the one below
      // slightly further back (scale down + fade)
      if (!isLast) {
        ScrollTrigger.create({
          trigger: cards[i + 1],
          start: 'top 85%',
          end: 'top 15%',
          scrub: true,
          onUpdate: self => {
            gsap.set(card, {
              scale:   1 - depth * 0.02 - self.progress * 0.03,
              opacity: 1 - self.progress * 0.25,
            });
          },
        });
      }
    });
  });
}

// ============================================================
// SMOOTH NAV PROGRESS LINE (extends top accent bar)
// ============================================================
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 2px;
    left: 0;
    height: 2px;
    background: rgba(255,255,255,0.4);
    z-index: 10001;
    pointer-events: none;
    transform-origin: left;
    transform: scaleX(0);
    will-change: transform;
  `;
  document.body.appendChild(bar);

  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      gsap.set(bar, { scaleX: self.progress });
    }
  });
}

// ============================================================
// REMOVE OLD INTERSECTION-OBSERVER REVEALS
// (GSAP handles everything now)
// ============================================================
function disableOldReveals() {
  document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale').forEach(el => {
    el.classList.add('is-revealed');
  });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof Lenis === 'undefined') {
    console.warn('GSAP/Lenis not loaded, scroll effects disabled');
    window.lenisInstance = null;
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Lenis must be first
  initLenis();

  // Immediately resolve old reveal classes
  disableOldReveals();

  // Page-specific
  const isHome = document.querySelector('.hero') !== null;
  const isPageWithHero = document.querySelector('.page-hero') !== null;

  if (isHome) {
    initHeroAnimations();
    initScrollStory();
    initHorizontalScroll();
    initPainCards();
    initSocialProof();
  }

  if (isPageWithHero) {
    initPageHeroEntrance();
    initPricingEntrance();
    initFaqEntrance();
    initKBEntrance();
    initFeatureFullCards();
    initCardStack();
    initTableReveal();
  }

  // Shared across all pages
  initTextReveals();
  initCardCascades();
  initStatsScrub();
  initSectionRules();
  initCtaEntrance();
  initScrollProgress();

  // Fonts/images can shift layout after first paint; refresh trigger positions
  window.addEventListener('load', () => ScrollTrigger.refresh());
});
