/*-----------------------------------------------------------------------------------
/* Init JS
/*----------------------------------------------------------------------------------*/

jQuery(document).ready(function ($) {
  /*----------------------------------------------------
  /* FitText (guarded)
  ------------------------------------------------------*/
  setTimeout(function () {
    if ($.fn.fitText) {
      $('h1.responsive-headline').fitText(1, { minFontSize: '40px', maxFontSize: '90px' });
      $('h3.responsive-headline').fitText(1, { minFontSize: '12px', maxFontSize: '24px' });
    }
  }, 80);

  /*----------------------------------------------------
  /* Smooth Scrolling
  ------------------------------------------------------*/
  $('.smoothscroll').on('click', function (e) {
    e.preventDefault();
    var target = this.hash, $target = $(target);
    if (!$target.length) return;
    $('html, body').stop().animate({ scrollTop: $target.offset().top }, 800, 'swing', function () {
      window.location.hash = target;
    });
  });

  /*----------------------------------------------------
  /* Highlight current section in nav (Waypoints)
  ------------------------------------------------------*/
  var sections = $('section');
  var navigation_links = $('#nav-wrap a');

  if (sections.length && $.fn.waypoint) {
    sections.waypoint({
      handler: function (direction) {
        var active = $(this);
        if (direction === 'up') active = active.prev();
        var link = $('#nav-wrap a[href="#' + active.attr('id') + '"]');
        navigation_links.parent().removeClass('current');
        link.parent().addClass('current');
      },
      offset: '35%'
    });
  }

  /*----------------------------------------------------
  /* Flexslider (guarded)
  ------------------------------------------------------*/
  if ($.fn.flexslider) {
    $('.flexslider').flexslider({
      namespace: 'flex-',
      controlsContainer: '.flex-container',
      animation: 'slide',
      controlNav: true,
      directionNav: false,
      smoothHeight: true,
      slideshowSpeed: 7000,
      animationSpeed: 600,
      randomize: false
    });
  }

  /*----------------------------------------------------
  /* Magnific Popup (guarded)
  ------------------------------------------------------*/
  if ($.fn.magnificPopup) {
    $('.item-wrap a').magnificPopup({
      type: 'inline',
      fixedContentPos: false,
      removalDelay: 200,
      showCloseBtn: false,
      mainClass: 'mfp-fade'
    });
    $(document).on('click', '.popup-modal-dismiss', function (e) {
      e.preventDefault();
      $.magnificPopup.close();
    });
  }
});

/*-----------------------------------------------------------------------------------
/* Formspree-only contact (AJAX enhance + honeypot)
-----------------------------------------------------------------------------------*/
(function () {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    // Honeypot
    const hp = form.querySelector('input[name="company"]');
    if (hp && hp.value.trim() !== '') {
      e.preventDefault();
      return;
    }

    // Map _replyto to visible email so replies work
    const emailVal = form.querySelector('#contactEmail')?.value || '';
    let replyHidden = form.querySelector('input[name="_replyto"]');
    if (!replyHidden) {
      replyHidden = document.createElement('input');
      replyHidden.type = 'hidden';
      replyHidden.name = '_replyto';
      form.appendChild(replyHidden);
    }
    replyHidden.value = emailVal;

    if (window.fetch) {
      e.preventDefault();
      if (statusEl) {
        statusEl.className = 'form-status';
        statusEl.textContent = 'Sending…';
      }

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.reset();
          if (statusEl) {
            statusEl.className = 'form-status success';
            statusEl.textContent = 'Message sent. I’ll get back to you soon.';
          }
        } else {
          if (statusEl) {
            statusEl.className = 'form-status error';
            statusEl.textContent = 'Something went wrong. Please try again.';
          }
        }
      } catch {
        if (statusEl) {
          statusEl.className = 'form-status error';
          statusEl.textContent = 'Network error. Please try again.';
        }
      }
    }
    // no fetch: fall back to normal Formspree POST
  });
})();

/*-----------------------------------------------------------------------------------
/* Scroll reveals (titles reveal once; paragraphs + hero h3 replay)
-----------------------------------------------------------------------------------*/
(function () {
  // Titles: reveal once
  const titles = document.querySelectorAll('.reveal-title');
  if (titles.length) {
    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          titleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    titles.forEach((t) => titleObserver.observe(t));
  }

  // Paragraphs + hero h3: replay on each re-entry
  const paras = document.querySelectorAll(
    '#whatidobest p, #outsidetheoffice p, .outside-office p, #home h3'
  );
  if (!paras.length) return;

  // stagger per section
  const groups = new Map();
  paras.forEach((el) => {
    const section = el.closest('#whatidobest, #outsidetheoffice, .outside-office, #home') || document;
    const i = groups.get(section) || 0;
    el.style.setProperty('--reveal-delay', i * 70 + 'ms');
    groups.set(section, i + 1);
    el.classList.add('reveal'); // base hidden state
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        } else {
          entry.target.classList.remove('in'); // replay when it comes back
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  paras.forEach((el) => io.observe(el));
})();
