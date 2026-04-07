/* ============================================================
   FOTIS ZAGAS — Photography Portfolio
   Vanilla ES6+ JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM References ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileHeader = document.getElementById('mobile-header');
  const drawerLinks = document.querySelectorAll('.mobile-drawer__link');
  const yearSpan = document.getElementById('year');

  /* ---------- Set Current Year ---------- */
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }


  /* ============================================================
     ACTIVE NAV LINK — Highlight current page
     ============================================================ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.sidebar__link').forEach(function (link) {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('sidebar__link--active');
    }
  });

  document.querySelectorAll('.mobile-drawer__link').forEach(function (link) {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('mobile-drawer__link--active');
    }
  });


  /* ============================================================
     MOBILE HAMBURGER MENU
     ============================================================ */
  function toggleDrawer() {
    const isOpen = hamburger.classList.toggle('hamburger--active');
    mobileDrawer.classList.toggle('mobile-drawer--open', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  }

  function closeDrawer() {
    hamburger.classList.remove('hamburger--active');
    mobileDrawer.classList.remove('mobile-drawer--open');
    document.body.classList.remove('no-scroll');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', toggleDrawer);

  // Close drawer when a link is clicked
  drawerLinks.forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  });


  /* ============================================================
     MOBILE HEADER — Scroll Effect
     Adds semi-transparent blur background when scrolled
     ============================================================ */
  let lastScrollY = 0;
  let ticking = false;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (lastScrollY > 50) {
          mobileHeader.classList.add('mobile-header--scrolled');
        } else {
          mobileHeader.classList.remove('mobile-header--scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ============================================================
     INTERSECTION OBSERVER — Scroll Reveal (Fade-in-up)
     ============================================================ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      rootMargin: '-80px 0px',
      threshold: 0.05,
    }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ============================================================
     SERVICES — Click accordion + carousel (services.html)
     ============================================================ */
  var interactiveServices = document.querySelector('.services--interactive');
  var serviceItems = document.querySelectorAll('.services--interactive .services__item');

  if (interactiveServices && serviceItems.length) {
    var openItem = null;

    serviceItems.forEach(function (item) {
      var track  = item.querySelector('.carousel__track');
      var slides = item.querySelectorAll('.carousel__slide');
      var prevBtn = item.querySelector('.carousel__btn--prev');
      var nextBtn = item.querySelector('.carousel__btn--next');
      var idx = 0;

      function goTo(n) {
        idx = (n + slides.length) % slides.length;
        track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          goTo(idx - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          goTo(idx + 1);
        });
      }

      item.addEventListener('click', function () {
        var isOpen = item.classList.contains('services__item--open');

        if (openItem && openItem !== item) {
          openItem.classList.remove('services__item--open');
        }

        item.classList.toggle('services__item--open', !isOpen);
        openItem = isOpen ? null : item;

        interactiveServices.classList.toggle('services--inverted', openItem !== null);
      });
    });
  }


  /* ============================================================
     LIGHTBOX — Carousel image fullscreen viewer
     ============================================================ */
  var lightbox     = document.getElementById('lightbox');
  var lightboxImg  = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxPrev = document.getElementById('lightbox-prev');
  var lightboxNext = document.getElementById('lightbox-next');

  if (lightbox && lightboxImg) {
    var lbSlides = [];
    var lbIndex  = 0;

    function lbShow(slides, index) {
      lbSlides = slides;
      lbIndex  = index;
      lightboxImg.src = lbSlides[lbIndex].querySelector('img').src;
      lightbox.classList.add('lightbox--open');
      document.body.classList.add('no-scroll');
    }

    function lbClose() {
      lightbox.classList.remove('lightbox--open');
      document.body.classList.remove('no-scroll');
    }

    function lbGo(dir) {
      lbIndex = (lbIndex + dir + lbSlides.length) % lbSlides.length;
      lightboxImg.classList.add('lightbox__img--fade');
      setTimeout(function () {
        lightboxImg.src = lbSlides[lbIndex].querySelector('img').src;
        lightboxImg.classList.remove('lightbox__img--fade');
      }, 200);
    }

    /* Bind clicks on every carousel slide */
    document.querySelectorAll('.services--interactive .carousel__slide').forEach(function (slide, i, all) {
      /* Collect siblings from the same carousel */
      slide.addEventListener('click', function (e) {
        e.stopPropagation();
        var siblings = Array.from(slide.closest('.carousel__viewport')
          .querySelectorAll('.carousel__slide'));
        lbShow(siblings, siblings.indexOf(slide));
      });
    });

    lightboxClose.addEventListener('click', lbClose);
    lightboxPrev.addEventListener('click', function () { lbGo(-1); });
    lightboxNext.addEventListener('click', function () { lbGo(1); });

    /* Close on backdrop click (outside the image) */
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lbClose();
    });

    /* Keyboard navigation */
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('lightbox--open')) return;
      if (e.key === 'Escape')      lbClose();
      if (e.key === 'ArrowLeft')   lbGo(-1);
      if (e.key === 'ArrowRight')  lbGo(1);
    });
  }

})();
