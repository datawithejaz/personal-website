/**
 * main.js — Ejaz Ahmed Personal Website
 *
 * 1. Scroll reveal — IntersectionObserver adds .is-visible to [data-reveal] elements
 * 2. Active nav — marks the current page link with aria-current="page"
 * 3. Email protection — constructs mailto links at runtime to deter scrapers
 * 4. Photo fallback — shows placeholder initial when profile image fails to load
 * 5. Nav accessibility — syncs aria-expanded on mobile nav toggle
 */

'use strict';

/* ============================================================
   1. SCROLL REVEAL
   ============================================================ */

function initScrollReveal() {
  // Graceful fallback — if IntersectionObserver isn't supported, show everything
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Stop observing once visible — no need to toggle back
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    observer.observe(el);
  });
}

/* ============================================================
   2. ACTIVE NAV STATE
   ============================================================ */

function initActiveNav() {
  var currentPath = window.location.pathname;

  // Normalise: treat both '/' and '/index.html' as home
  var normalisedPath = currentPath.replace(/\/index\.html$/, '/');

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var linkPath = new URL(link.href).pathname.replace(/\/index\.html$/, '/');

    if (linkPath === normalisedPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* ============================================================
   3. EMAIL PROTECTION
   ============================================================ */

function initEmailProtection() {
  var p = ['ejazahmed.workemail', 'gmail.com'];
  var addr = p[0] + '@' + p[1];

  document.querySelectorAll('[data-eml]').forEach(function (el) {
    el.setAttribute('href', 'mailto:' + addr);

    // If link contains a <span>, set text there (preserves sibling SVG icons)
    var span = el.querySelector('span');
    if (span) {
      span.textContent = addr;
    } else if (!el.querySelector('svg')) {
      el.textContent = addr;
    }
  });
}

/* ============================================================
   4. PHOTO FALLBACK
   ============================================================ */

function initPhotoFallback() {
  var photo = document.querySelector('.bio-photo');
  if (!photo) return;

  function showFallback() {
    photo.classList.add('is-hidden');
    var placeholder = photo.nextElementSibling;
    if (placeholder) placeholder.classList.add('is-active');
  }

  photo.addEventListener('error', showFallback);

  // Handle case where image already failed before JS loaded
  if (photo.complete && photo.naturalWidth === 0) {
    showFallback();
  }
}

/* ============================================================
   5. NAV ACCESSIBILITY
   ============================================================ */

function initNavAccessibility() {
  var toggle = document.getElementById('nav-toggle');
  var label = document.querySelector('.nav-toggle-label');
  if (!toggle || !label) return;

  toggle.addEventListener('change', function () {
    label.setAttribute('aria-expanded', String(this.checked));
  });
}

/* ============================================================
   INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initScrollReveal();
  initActiveNav();
  initEmailProtection();
  initPhotoFallback();
  initNavAccessibility();
});
