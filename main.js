(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* ------------------------------------------------------------------ data */
  var W = 'assets/work/';
  var EPS = [
    {
      n: '01', title: 'Graphic Design',
      desc: 'Posters with a point of view. Editorial layouts, concept pieces and experiments where culture meets craft.',
      items: [
        { src: W + 'spider.jpg', alt: 'Spider-Man 2099 poster' },
        { src: W + 'duolingo.jpg', alt: 'Duolingo brutalist poster' },
        { src: W + 'love.jpg', alt: 'This Is Love poster' },
        { src: W + 'shoes.jpg', alt: 'Shoes poster' },
        { src: W + 'abstract.jpg', alt: 'Abstract editorial composition' },
        { drive: '1pwRmUrJB8PhgCxVf1dK2pUYdAIxoihKF', alt: 'Spotify editorial' }
      ]
    },
    {
      n: '02', title: 'Brand Content',
      desc: 'Content systems for founders who would rather be building. Visuals made for the feed, with strategy under every post.',
      items: [
        { src: W + 'prada.jpg', alt: 'Prada x Kolhapuri' },
        { src: W + 'killer.jpg', alt: 'Biggest killer of startups' },
        { src: W + 'success.jpg', alt: 'Success' },
        { drive: '1pk3MFCfb-8l53tQUH8jOS9QBg_Ru7AWC', alt: 'Hotels revenue' },
        { drive: '1Dj32r8xW8F25t3z0kdtEIEVRo3gk48jw', alt: 'Do not burn out' },
        { drive: '1ifUlFzBn-gFxe3ZTVQPOYyAPkHlbQHpi', alt: 'Holiday season' },
        { drive: '1KQ-iQVpiPr-VBIcpVi9JOw2baYwqNasC', alt: 'Yett' },
        { drive: '1vLda-Y5mwHUT9W25rElrmN9PecKvkZtx', alt: 'Bootstrapped' },
        { drive: '1ECUZEkML7ts4at2BuFfi9nAuHdUngpeK', alt: 'Artisan' },
        { drive: '12Zfh5QmtKZB6O4zQOHRpp8tCqMHXMTOi', alt: 'BITS IIT' },
        { drive: '1yoYw7upnKaHCvNWnYO6Vsb4vaPspR1hJ', alt: 'Start building' },
        { drive: '1m1gI_BXKJf-UORuBxNiRbMfuKDxYv3cW', alt: 'Camera to brand' }
      ]
    },
    {
      n: '03', title: 'Poster & Visual Work',
      desc: 'Fan art and character studies with no brief and no brakes. Personal taste, pushed as far as the skills allow.',
      items: [
        { src: W + 'deadpool.jpg', alt: 'Deadpool poster' },
        { src: W + 'chainsaw.jpg', alt: 'Chainsaw Man poster' },
        { src: W + 'manu.jpg', alt: 'Manchester United poster' },
        { drive: '1srbKqfED2Ir5ttZA2JDBwqzo3ImEbkXd', alt: 'Messi poster' },
        { drive: '1C-O50v5vb3t8wtVAxW0V5WWEqAHq-Dhs', alt: 'Maradona poster' },
        { drive: '1qylaBFZzg1smnjt5LM09r71g-b3G-y6P', alt: 'Abstract poster' },
        { drive: '1teZA-QESJQZuMX76my92USL6leTWGFJb', alt: 'Final poster' },
        { drive: '1XHIFMxqGGCdmfKaYh-AXkZhOjw3z2MKp', alt: 'CR7 poster' }
      ]
    }
  ];

  function srcFor(it, size, alt) {
    if (it.src) return it.src;
    if (alt) return 'https://lh3.googleusercontent.com/d/' + it.drive + '=w' + size;
    return 'https://drive.google.com/thumbnail?id=' + it.drive + '&sz=w' + size;
  }

  /* --------------------------------------------------------------- helpers */
  function splitWords(el) {
    var out = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span');
            s.className = 'w'; s.textContent = p; frag.appendChild(s); out.push(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) { walk(n); }
      });
    })(el);
    return out;
  }

  function fitName() {
    var h = $('.name'); if (!h) return;
    var words = $$('.nm-w', h);
    var cs = getComputedStyle(h);
    var avail = h.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var mobile = window.innerWidth < 900;
    h.style.fontSize = '100px';
    var ws = words.map(function (w) { return w.getBoundingClientRect().width; });
    var s = mobile ? avail / Math.max.apply(null, ws) * 100 : avail / ((ws[0] + ws[1]) / 100 + 0.3);
    s = Math.min(s, mobile ? 150 : 400);
    h.style.fontSize = s + 'px';
    root.style.setProperty('--nameH', Math.round(h.offsetHeight) + 'px');
  }
  function fitAll() {
    $$('.fit').forEach(function (el) {
      var inner = el.firstElementChild; if (!inner) return;
      el.style.fontSize = '100px';
      var w = inner.getBoundingClientRect().width;
      el.style.fontSize = Math.min(el.clientWidth / w * 100 * 0.995, 520) + 'px';
    });
  }
  function layout() { fitName(); fitAll(); }

  /* name letters */
  $$('.nm-w').forEach(function (w) {
    var t = w.textContent; w.textContent = '';
    t.split('').forEach(function (ch) {
      var m = document.createElement('span'); m.className = 'nm-m';
      var l = document.createElement('span'); l.className = 'nm-l'; l.textContent = ch;
      m.appendChild(l); w.appendChild(m);
    });
  });
  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layout(); if (hasGsap) ScrollTrigger.refresh(); });
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { layout(); }, 120); });

  /* ------------------------------------------------------ overlay + lightbox */
  var lenis = null;
  var vg = $('#vg');
  var ep = $('#ep'), gal = $('#gal'), lb = $('#lb'), lbStage = $('#lb-stage'), lbN = $('#lb-n');
  var curEp = null, lastFocus = null, lbItems = [], lbIndex = 0, lbOpen = false, epIO = null;

  function lockScroll(on) { if (lenis) { on ? lenis.stop() : lenis.start(); } else { document.body.style.overflow = on ? 'hidden' : ''; } }

  function buildGallery(data) {
    gal.innerHTML = '';
    if (epIO) epIO.disconnect();
    epIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); epIO.unobserve(e.target); } });
    }, { root: ep, rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    data.items.forEach(function (it, i) {
      var f = document.createElement('figure'); f.className = 'gi sk'; f.tabIndex = 0;
      f.setAttribute('role', 'button'); f.setAttribute('aria-label', 'View ' + it.alt);
      f.setAttribute('data-cursor', 'View');
      var img = new Image(); img.alt = it.alt; img.decoding = 'async'; img.loading = i < 6 ? 'eager' : 'lazy';
      var tried = 0;
      img.onload = function () { f.classList.remove('sk'); };
      img.onerror = function () {
        if (it.drive && tried === 0) { tried = 1; img.src = srcFor(it, 1000, true); }
        else { f.classList.add('er'); }
      };
      img.src = srcFor(it, 1000, false);
      f.appendChild(img);
      var open = function () { openLb(data, i); };
      f.addEventListener('click', open);
      f.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      gal.appendChild(f);
      epIO.observe(f);
    });
  }

  function openEp(i, trigger, push) {
    var data = EPS[i - 1]; if (!data) return;
    var wasOpen = ep.classList.contains('on');
    curEp = i; lastFocus = wasOpen ? lastFocus : (trigger || document.activeElement);
    $('#ep-n').textContent = 'EP.' + data.n;
    $('#ep-title').textContent = data.title;
    $('#ep-desc').textContent = data.desc;
    var nx = EPS[i] ? (i + 1) : 0;
    var nb = $('#ep-next');
    nb.textContent = nx ? 'Next: EP.' + EPS[i].n + ' ' + EPS[i].title + ' →' : 'Back to the work';
    nb.setAttribute('data-next', nx);
    buildGallery(data);
    ep.classList.add('on'); ep.scrollTop = 0;
    if (!wasOpen) lockScroll(true);
    if (push !== false) { try { history.pushState({ ep: i }, '', '#ep-' + i); } catch (e) {} }
    if (hasGsap && !reduce) {
      gsap.killTweensOf(ep);
      gsap.fromTo(ep, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: wasOpen ? 0.7 : 1, ease: 'power4.inOut', onComplete: function () { gsap.set(ep, { clearProps: 'clipPath' }); } });
      gsap.fromTo('#ep-title', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'power4.out', delay: 0.45 });
      gsap.fromTo('#ep-n,#ep-desc', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.6, stagger: 0.1 });
    }
    setTimeout(function () { var c = $('#ep-close'); if (c) c.focus({ preventScroll: true }); }, 60);
  }

  function closeEp(fromPop) {
    if (!ep.classList.contains('on')) return;
    if (!fromPop) { try { if (location.hash.indexOf('#ep-') === 0) history.back(); } catch (e) {} }
    var done = function () {
      ep.classList.remove('on'); gal.innerHTML = ''; if (hasGsap) gsap.set(ep, { clearProps: 'clipPath' });
      lockScroll(false); curEp = null;
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };
    if (hasGsap && !reduce) gsap.to(ep, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'power4.inOut', onComplete: done });
    else done();
  }

  function lbRender() {
    var it = lbItems[lbIndex];
    lbStage.innerHTML = '';
    var img = new Image(); img.alt = it.alt;
    var tried = 0;
    img.onerror = function () { if (it.drive && tried === 0) { tried = 1; img.src = srcFor(it, 1800, true); } };
    img.src = srcFor(it, 1800, false);
    lbStage.appendChild(img);
    lbN.innerHTML = '';
    var p = document.createElement('button'); p.type = 'button'; p.textContent = '← Prev';
    var c = document.createElement('span'); c.textContent = (lbIndex + 1) + ' / ' + lbItems.length; c.style.padding = '6px 2px'; c.style.color = 'var(--bmute)';
    var n = document.createElement('button'); n.type = 'button'; n.textContent = 'Next →';
    p.onclick = function () { lbStep(-1); }; n.onclick = function () { lbStep(1); };
    lbN.appendChild(p); lbN.appendChild(c); lbN.appendChild(n);
    if (hasGsap && !reduce) gsap.fromTo(img, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' });
  }
  function lbStep(d) { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; lbRender(); }
  function openLb(data, i) {
    lbItems = data.items.filter(function (it, idx) { return !gal.children[idx] || !gal.children[idx].classList.contains('er'); });
    lbIndex = Math.max(0, lbItems.indexOf(data.items[i]));
    lbOpen = true; lb.classList.add('on'); lbRender();
    setTimeout(function () { $('#lb-x').focus({ preventScroll: true }); }, 40);
  }
  function openVideo(id, isShort) {
    if (location.protocol === 'file:') { window.open(isShort ? 'https://www.youtube.com/shorts/' + id : 'https://www.youtube.com/watch?v=' + id, '_blank', 'noopener'); return; }
    lbOpen = true; lb.classList.add('on'); lbStage.innerHTML = ''; lbN.innerHTML = '';
    lockScroll(true);
    var v = document.createElement('div'); v.className = 'vid' + (isShort ? ' p' : '');
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1';
    f.title = 'Video player'; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.referrerPolicy = 'strict-origin-when-cross-origin'; f.allowFullscreen = true;
    v.appendChild(f); lbStage.appendChild(v);
    var a = document.createElement('a'); a.href = isShort ? 'https://www.youtube.com/shorts/' + id : 'https://www.youtube.com/watch?v=' + id;
    a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Open on YouTube ↗'; lbN.appendChild(a);
    lb.setAttribute('data-video', '1');
    setTimeout(function () { $('#lb-x').focus({ preventScroll: true }); }, 40);
  }
  function closeLb() {
    if (!lbOpen) return;
    lbOpen = false; lb.classList.remove('on'); lbStage.innerHTML = ''; lbN.innerHTML = '';
    if (lb.getAttribute('data-video')) { lb.removeAttribute('data-video'); if (!ep.classList.contains('on') && !vg.classList.contains('on')) lockScroll(false); }
  }

  $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { openEp(parseInt(b.getAttribute('data-open'), 10), b); }); });
  $('#ep-close').addEventListener('click', function () { closeEp(false); });
  $('#ep-next').addEventListener('click', function (e) {
    var nx = parseInt(e.currentTarget.getAttribute('data-next'), 10);
    if (nx) openEp(nx, null, false); else closeEp(false);
  });
  $('#lb-x').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbStage) closeLb(); });
  $$('[data-play]').forEach(function (b) { b.addEventListener('click', function () { openVideo(b.getAttribute('data-play'), !!b.getAttribute('data-short')); }); });

  /* --------------------------------------------------- drive-hosted work */
  var IG = 'https://instagram.com/medhansh_._editx';
  var SOCIAL = [
    { id: '1zW7XmUwdX4Q-2S8_rSVuvaGKNnuL6P6j', t: 'Phonk' },
    { id: '1T_GxuqcSuk0Fp692ftKsrhl6iO8ADqMo', t: 'RoomEase' },
    { id: '1PDCEOADnXg7wf_oASqSWWvJNAyLqvC8C', t: 'Montage' },
    { id: '14M6zz7cuI7y0GKC7DBZKzoSDWX3-A3qC', t: 'Storytime' },
    { id: '1FNWHQO043rc-qYiOY67_ODsV4ArU4-J6', t: 'Goal' },
    { id: '1-5quglLG1QaSpF54Y6Lr-EsEeuzCFI4A', t: 'Intro' },
    { id: '1o3RZNh_s3NZduncbgWvWWCASOqT39jWm', t: 'Game practice' },
    { id: '1qqo6ESUjl_yMDvPYRFk_QRODH6_nJcW8', t: 'Football edit' }
  ];
  var VIDS = [
    { id: '1E4kkLPgp27pIuj4MCVtzP4uHroGHfAJB', t: 'Zoro AMV', g: 'AMVs' },
    { id: '1crmedi73oui36kac4c7ejUELsXfbubxE', t: 'Tanjiro AMV', g: 'AMVs' },
    { id: '1E-dp6KYJy_t6zXJWGBtvqwyX4AU64DHo', t: 'Toji edit', g: 'AMVs' },
    { id: '1jf6W9YQK99fxul9yJKSwPOg2WhZQQl5A', t: 'Luffy 5 stages', g: 'AMVs' },
    { id: '1FOgbzCG0YMzsgua4KF5mHFROGfirJY2K', t: "Miguel O'Hara", g: 'AMVs' },
    { id: '1SzFrSC2ESco9vlLCa_Zi8BVyYEyXJetp', t: 'UNESCO edit', g: 'Edits' },
    { id: '17eoNOo2TrB6IyN6pWabP17dLna_iYkym', t: 'Sh4hir edit', g: 'Edits' },
    { id: '1zW7XmUwdX4Q-2S8_rSVuvaGKNnuL6P6j', t: 'Phonk', g: 'Football' },
    { id: '1PDCEOADnXg7wf_oASqSWWvJNAyLqvC8C', t: 'Montage', g: 'Football' },
    { id: '1FNWHQO043rc-qYiOY67_ODsV4ArU4-J6', t: 'Goal', g: 'Football' },
    { id: '1o3RZNh_s3NZduncbgWvWWCASOqT39jWm', t: 'Game practice', g: 'Football' },
    { id: '1qqo6ESUjl_yMDvPYRFk_QRODH6_nJcW8', t: 'Football edit', g: 'Football' },
    { id: '1T_GxuqcSuk0Fp692ftKsrhl6iO8ADqMo', t: 'RoomEase', g: 'Storytime' },
    { id: '14M6zz7cuI7y0GKC7DBZKzoSDWX3-A3qC', t: 'Storytime', g: 'Storytime' },
    { id: '1-5quglLG1QaSpF54Y6Lr-EsEeuzCFI4A', t: 'Intro presentation', g: 'Storytime' }
  ];
  function dThumb(id, w, alt) { return alt ? 'https://drive.google.com/thumbnail?id=' + id + '&sz=w' + w : 'https://lh3.googleusercontent.com/d/' + id + '=w' + w; }
  function dImg(id, w, host) {
    var im = new Image(), tried = 0; im.alt = ''; im.decoding = 'async'; im.loading = 'lazy'; im.draggable = false;
    im.onerror = function () { if (!tried) { tried = 1; im.src = dThumb(id, w, true); } else if (host) host.classList.add('er'); };
    im.src = dThumb(id, w, false);
    return im;
  }

  /* social: rows drift on their own and follow the cursor; a click blurs the page, then Instagram opens */
  (function () {
    var sg = $('#sg'); if (!sg) return;
    var veil = $('#sg-veil'), vimg = $('img', veil), vcard = $('.sg-card', veil);
    var ROWS = 3, rows = [];
    function rot(arr, n) { return arr.slice(n).concat(arr.slice(0, n)); }
    [0, 3, 5].forEach(function (off, ri) {
      var row = document.createElement('div'); row.className = 'sg-row';
      var order = rot(SOCIAL, off);
      for (var c = 0; c < 3; c++) {
        order.forEach(function (it) {
          var a = document.createElement('a'); a.className = 'sg-t'; a.href = it.u || IG; a.target = '_blank'; a.rel = 'noopener';
          a.setAttribute('data-cursor', 'Instagram'); a.setAttribute('aria-label', it.t + ', open on Instagram'); a.setAttribute('data-id', it.id);
          if (c > 0) { a.tabIndex = -1; a.setAttribute('aria-hidden', 'true'); }
          a.appendChild(dImg(it.id, 480, a));
          var b = document.createElement('b'); b.textContent = it.t; a.appendChild(b);
          row.appendChild(a);
        });
      }
      sg.appendChild(row);
      rows.push({ el: row, x: 0, dir: ri % 2 ? 1 : -1, k: [1, 0.7, 1.25][ri], setW: 0 });
    });
    var N = SOCIAL.length;
    function measure() {
      rows.forEach(function (r) {
        var kids = r.el.children; r.setW = kids[N].offsetLeft - kids[0].offsetLeft;
        if (!r.setW) return;
        while (r.x <= -r.setW) r.x += r.setW; while (r.x > 0) r.x -= r.setW;
        if (r.x === 0) r.x = r.dir > 0 ? -r.setW * 0.5 : -r.setW * 0.3 * (1 + rows.indexOf(r));
      });
    }
    var vis = false, running = false, last = 0, ptr = 0, ptrS = 0, drag = false, moved = 0, lastX = 0, inertia = 0;
    var BASE = 26, MAX = 340;
    function frame(t) {
      if (!vis) { running = false; return; }
      var dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
      ptrS += (ptr - ptrS) * Math.min(1, dt * 4);
      inertia *= Math.pow(0.001, dt);
      rows.forEach(function (r) {
        if (!r.setW) return;
        var v = r.dir * BASE * r.k - ptrS * MAX * r.k + inertia * r.k * 60;
        r.x += v * dt;
        if (r.x <= -r.setW) r.x += r.setW; else if (r.x > 0) r.x -= r.setW;
        r.el.style.transform = 'translate3d(' + r.x.toFixed(1) + 'px,0,0)';
      });
      requestAnimationFrame(frame);
    }
    function go() { if (running || reduce) return; running = true; last = performance.now(); requestAnimationFrame(frame); }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) go(); }, { rootMargin: '80px 0px' }).observe(sg);
    } else { vis = true; go(); }
    if (fine) {
      sg.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        var rc = sg.getBoundingClientRect(); ptr = Math.max(-1, Math.min(1, ((e.clientX - rc.left) / rc.width - 0.5) * 2));
      });
      sg.addEventListener('pointerleave', function () { ptr = 0; });
    }
    sg.addEventListener('dragstart', function (e) { e.preventDefault(); });
    sg.addEventListener('pointerdown', function (e) { drag = true; moved = 0; lastX = e.clientX; sg.classList.add('drag'); });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return; var dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); inertia = dx * 0.5;
      rows.forEach(function (r) { r.x += dx * r.k; });
    });
    function endDrag() { drag = false; sg.classList.remove('drag'); }
    window.addEventListener('pointerup', endDrag); window.addEventListener('pointercancel', endDrag);
    sg.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('.sg-t') : null; if (!t) return;
      if (moved > 8) { e.preventDefault(); return; }
      vimg.src = dThumb(t.getAttribute('data-id'), 700, false);
      veil.classList.add('on');
      if (hasGsap && !reduce) {
        gsap.killTweensOf([vimg, vcard, '.sg-say']);
        gsap.fromTo(vimg, { filter: 'blur(34px)', scale: 1.4 }, { filter: 'blur(0px)', scale: 1.05, duration: 0.9, ease: 'power3.out' });
        gsap.fromTo(vcard, { scale: 0.86 }, { scale: 1, duration: 0.9, ease: 'power3.out' });
        gsap.fromTo('.sg-say', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.25, ease: 'power3.out' });
      }
      setTimeout(function () { veil.classList.remove('on'); }, 1800);
    });
    window.addEventListener('resize', function () { measure(); });
    var mi = 0; (function again() { measure(); if (rows[0].setW === 0 && mi++ < 20) setTimeout(again, 200); })();
    window.addEventListener('load', measure);
  })();

  /* all motion: every clip plays right here, nothing leaves the site */
  var vgBuilt = false, vgIO = null, vgFocus = null;
  function openDrive(id, title) {
    lbOpen = true; lb.classList.add('on'); lbStage.innerHTML = ''; lbN.innerHTML = '';
    lockScroll(true);
    var v = document.createElement('div'); v.className = 'vid';
    var f = document.createElement('iframe');
    f.src = 'https://drive.google.com/file/d/' + id + '/preview';
    f.title = title; f.allow = 'autoplay; fullscreen; picture-in-picture'; f.allowFullscreen = true; f.referrerPolicy = 'no-referrer';
    v.appendChild(f); lbStage.appendChild(v);
    var cp = document.createElement('span'); cp.textContent = title; cp.style.color = 'var(--bmute)'; lbN.appendChild(cp);
    lb.setAttribute('data-video', '1');
    setTimeout(function () { $('#lb-x').focus({ preventScroll: true }); }, 40);
  }
  function buildVg(filter) {
    var grid = $('#vg-grid'); grid.innerHTML = '';
    if (vgIO) vgIO.disconnect();
    vgIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); vgIO.unobserve(e.target); } });
    }, { root: vg, rootMargin: '0px 0px -4% 0px', threshold: 0.05 });
    var list = VIDS.filter(function (v) { return filter === 'All' || v.g === filter; });
    list.forEach(function (it) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'vg-c'; b.setAttribute('data-cursor', 'Play'); b.setAttribute('aria-label', 'Play ' + it.t);
      var th = document.createElement('span'); th.className = 'th'; th.appendChild(dImg(it.id, 640, b));
      var cap = document.createElement('span'); cap.className = 'cap'; cap.innerHTML = '<em></em><span></span>';
      cap.firstChild.textContent = it.t; cap.firstChild.style.fontStyle = 'normal'; cap.lastChild.textContent = it.g;
      b.appendChild(th); b.appendChild(cap);
      b.addEventListener('click', function () { openDrive(it.id, it.t); });
      grid.appendChild(b); vgIO.observe(b);
    });
    $('#vg-count').textContent = list.length + (list.length === 1 ? ' video' : ' videos');
  }
  function openVg() {
    if (!vgBuilt) {
      var tabs = $('#vg-tabs'); var cur = 'All';
      ['All', 'AMVs', 'Edits', 'Football', 'Storytime'].forEach(function (g) {
        var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = g; b.setAttribute('aria-selected', g === 'All' ? 'true' : 'false');
        b.addEventListener('click', function () {
          $$('button', tabs).forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
          cur = g; buildVg(g); vg.scrollTop = Math.min(vg.scrollTop, tabs.offsetTop);
        });
        tabs.appendChild(b);
      });
      vgBuilt = true;
    }
    buildVg('All');
    $$('#vg-tabs button').forEach(function (x, i) { x.setAttribute('aria-selected', i === 0 ? 'true' : 'false'); });
    vgFocus = document.activeElement;
    vg.classList.add('on'); vg.scrollTop = 0; lockScroll(true);
    if (hasGsap && !reduce) {
      gsap.killTweensOf(vg);
      gsap.fromTo(vg, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power4.inOut', onComplete: function () { gsap.set(vg, { clearProps: 'clipPath' }); } });
      gsap.fromTo('#vg .ep-head h2', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'power4.out', delay: 0.45 });
      gsap.fromTo('#vg .ep-n, #vg .ep-head p', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.6, stagger: 0.1 });
    }
    setTimeout(function () { $('#vg-close').focus({ preventScroll: true }); }, 60);
  }
  function closeVg() {
    if (!vg.classList.contains('on')) return;
    var done = function () {
      vg.classList.remove('on'); $('#vg-grid').innerHTML = ''; if (hasGsap) gsap.set(vg, { clearProps: 'clipPath' });
      if (!ep.classList.contains('on')) lockScroll(false);
      if (vgFocus && vgFocus.focus) vgFocus.focus({ preventScroll: true });
    };
    if (hasGsap && !reduce) gsap.to(vg, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'power4.inOut', onComplete: done });
    else done();
  }
  $('#vg-open').addEventListener('click', openVg);
  $('#vg-close').addEventListener('click', closeVg);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (lbOpen) closeLb(); else if (menuOpen) closeMenu(); else if (vg.classList.contains('on')) closeVg(); else closeEp(false); }
    else if (lbOpen && !lb.getAttribute('data-video')) { if (e.key === 'ArrowRight') lbStep(1); if (e.key === 'ArrowLeft') lbStep(-1); }
  });
  window.addEventListener('popstate', function () {
    if (lbOpen) closeLb();
    if (ep.classList.contains('on') && location.hash.indexOf('#ep-') !== 0) closeEp(true);
  });

  /* ------------------------------------------------------------- menu (mobile) */
  var menu = $('#menu'), menuBtn = $('.menu-btn'), menuX = $('.menu-x'), menuOpen = false;
  function openMenu() {
    menuOpen = true; menu.classList.add('on'); menuBtn.setAttribute('aria-expanded', 'true'); lockScroll(true);
    if (hasGsap && !reduce) {
      gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power4.inOut' });
      gsap.fromTo('.menu ul a', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.07, delay: 0.25 });
    } else { menu.style.clipPath = 'none'; }
    setTimeout(function () { var a = $('.menu a'); if (a) a.focus({ preventScroll: true }); }, 80);
  }
  function closeMenu(cb) {
    if (!menuOpen) { if (cb) cb(); return; }
    menuOpen = false; menuBtn.setAttribute('aria-expanded', 'false');
    var done = function () { menu.classList.remove('on'); lockScroll(false); if (cb) cb(); };
    if (hasGsap && !reduce) gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'power4.inOut', onComplete: done }); else done();
  }
  menuBtn.addEventListener('click', openMenu);
  menuX.addEventListener('click', function () { closeMenu(); });

  /* anchor scrolling */
  function goTo(hash) {
    var t = hash === '#top' ? 0 : $(hash); if (t === null) return;
    if (lenis) lenis.scrollTo(t, { duration: 1.8, easing: function (x) { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); } });
    else if (t === 0) window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var h = a.getAttribute('href'); if (h.length < 2) return;
      e.preventDefault();
      if (menuOpen) closeMenu(function () { goTo(h); }); else goTo(h);
    });
  });

  /* ----------------------------------------------- page transitions */
  var curtain = $('.curtain');
  function leaveTo(href) {
    if (reduce || !curtain) { location.href = href; return; }
    try { sessionStorage.setItem('mt-curtain', '1'); } catch (e) {}
    curtain.classList.add('cover');
    setTimeout(function () { location.href = href; }, 720);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|https?:)/.test(href)) return;
    e.preventDefault();
    if (menuOpen) closeMenu(function () { leaveTo(href); }); else leaveTo(href);
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && curtain) { curtain.classList.remove('cover'); root.classList.remove('curtain-in'); }
  });
  function arrive() {
    var had = false;
    try { had = !!sessionStorage.getItem('mt-curtain'); sessionStorage.removeItem('mt-curtain'); } catch (e) {}
    if (had && curtain && !reduce) {
      void curtain.offsetWidth;
      curtain.classList.add('leave');
      setTimeout(function () { root.classList.remove('curtain-in'); curtain.classList.remove('leave'); }, 1000);
    } else { root.classList.remove('curtain-in'); }
  }
  var userMoved = false;
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, function () { userMoved = true; }, { passive: true, once: true }); });
  function settleHash() {
    if (!location.hash || location.hash.length < 2) return;
    jumpHash();
    var step = function () { if (!userMoved) jumpHash(); };
    var run = function () { setTimeout(step, 80); setTimeout(step, 700); setTimeout(step, 1600); };
    if (document.readyState === 'complete') run(); else window.addEventListener('load', run);
  }
  function jumpHash() {
    var h = location.hash;
    if (!h || h.length < 2 || h.indexOf('#ep-') === 0) return;
    var t = null; try { t = $(h); } catch (e) {}
    if (!t) return;
    if (lenis) lenis.scrollTo(t, { immediate: true, force: true }); else t.scrollIntoView();
  }

  /* ---------------------------------------------------------------- form */
  var form = $('#cf'), st = $('#cf-status');
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var name = $('#f-name').value.trim(), email = $('#f-email').value.trim(), msg = $('#f-msg').value.trim();
    if (!name || !email || !msg) { st.textContent = 'Please fill in all three fields, so I know who to answer.'; return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { st.textContent = 'That email address does not look right.'; return; }
    var btn = form.querySelector('.send'); btn.disabled = true; st.textContent = 'Sending...';
    try {
      var formData = new FormData();
      formData.append('q2_fullName', name);
      formData.append('q3_emailAddress', email);
      formData.append('q4_message', msg);
      formData.append('formID', '261585350797065');
      await fetch('https://submit.jotform.com/submit/261585350797065/', { method: 'POST', mode: 'no-cors', body: formData });
      st.textContent = 'Sent. Thank you, I will reply soon.';
      form.reset();
      if (window.__fx) { var br = btn.getBoundingClientRect(); window.__fx.burst(br.left + br.width / 2, br.top + br.height / 2, 46); }
    } catch (err) {
      st.textContent = 'That did not go through. Please email medhansh.editz7@gmail.com directly.';
    }
    btn.disabled = false;
  });

  /* ------------------------------------------------------- motion videos
     Muted preview that starts when the clip is reached and resumes on hover.
     Uses the YouTube player API so playback is checked, retried and, if it cannot
     happen (opened from a folder, blocked, offline), the thumbnail stays with a clear tap prompt. */
  var boxes = $$('.box[data-yt]');
  var onFile = location.protocol === 'file:';
  var vstate = [];
  function chip(box, text) {
    var c = box.querySelector('.vchip');
    if (!c) { c = document.createElement('span'); c.className = 'vchip'; c.setAttribute('aria-hidden', 'true'); box.appendChild(c); }
    c.textContent = text;
  }
  function vGiveUp(st, text) { st.dead = true; st.box.classList.remove('vplaying'); st.box.classList.add('vstuck'); chip(st.box, text || 'Tap to watch'); }
  function vSync(st) {
    if (st.dead || !st.ready) return;
    var want = (st.vis || st.hover) && !document.hidden;
    try {
      if (want) {
        st.p.mute();
        if (st.p.getPlayerState() !== 1) { st.p.playVideo(); vWatch(st); }
      } else if (st.p.getPlayerState() === 1) { st.p.pauseVideo(); }
    } catch (err) { /* player not ready yet */ }
  }
  function vWatch(st) {
    clearTimeout(st.wd);
    st.wd = setTimeout(function () {
      if (st.dead || !(st.vis || st.hover)) return;
      var state = -2; try { state = st.p.getPlayerState(); } catch (err) { /* ignore */ }
      if (state === 1 || state === 3) return;
      st.tries = (st.tries || 0) + 1;
      if (st.tries > 2) { vGiveUp(st, 'Tap to play'); return; }
      try { st.p.mute(); st.p.playVideo(); } catch (err) { /* ignore */ }
      vWatch(st);
    }, 3200);
  }
  function vPlain(st) { /* fallback when the player API is unreachable: plain muted embed */
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + st.id + '?autoplay=1&mute=1&loop=1&playlist=' + st.id + '&controls=0&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3';
    f.title = 'Motion reel preview'; f.allow = 'autoplay; encrypted-media'; f.referrerPolicy = 'strict-origin-when-cross-origin';
    f.setAttribute('tabindex', '-1'); f.setAttribute('aria-hidden', 'true');
    f.addEventListener('load', function () { st.box.classList.add('vplaying'); });
    st.box.insertBefore(f, st.box.firstChild);
  }
  var ytQ = [], ytLoading = false, ytFailed = false;
  function ytApi(cb) {
    if (window.YT && window.YT.Player) { cb(true); return; }
    if (ytFailed) { cb(false); return; }
    ytQ.push(cb);
    if (ytLoading) return;
    ytLoading = true;
    var prev = window.onYouTubeIframeAPIReady, done = false;
    function flush(ok) { if (done) return; done = true; ytFailed = !ok; ytQ.splice(0).forEach(function (f) { f(ok); }); }
    window.onYouTubeIframeAPIReady = function () { if (typeof prev === 'function') prev(); flush(true); };
    var sc = document.createElement('script'); sc.src = 'https://www.youtube.com/iframe_api'; sc.async = true;
    sc.onerror = function () { flush(false); };
    document.head.appendChild(sc);
    setTimeout(function () { flush(!!(window.YT && window.YT.Player)); }, 7000);
  }
  function vStart(st) {
    if (st.started) return; st.started = true;
    ytApi(function (ok) {
      if (!ok) { vPlain(st); return; }
      var holder = document.createElement('div'); st.box.insertBefore(holder, st.box.firstChild);
      st.p = new window.YT.Player(holder, {
        host: 'https://www.youtube-nocookie.com', videoId: st.id, width: '100%', height: '100%',
        playerVars: { autoplay: 0, mute: 1, controls: 0, loop: 1, playlist: st.id, playsinline: 1, rel: 0, modestbranding: 1, disablekb: 1, iv_load_policy: 3, fs: 0, enablejsapi: 1, origin: location.origin },
        events: {
          onReady: function (e) {
            st.ready = true;
            var fr = e.target.getIframe && e.target.getIframe();
            if (fr) { fr.setAttribute('tabindex', '-1'); fr.setAttribute('aria-hidden', 'true'); fr.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin'); fr.title = 'Motion reel preview'; }
            e.target.mute(); vSync(st);
          },
          onStateChange: function (e) {
            if (e.data === 1) { st.tries = 0; clearTimeout(st.wd); st.box.classList.remove('vstuck'); st.box.classList.add('vplaying'); }
            else if (e.data === 0) { try { e.target.playVideo(); } catch (err) { /* ignore */ } }
            else if (e.data === 2 && (st.vis || st.hover) && !document.hidden) { vSync(st); }
          },
          onError: function () { vGiveUp(st, 'Tap to watch'); }
        }
      });
    });
  }
  if (boxes.length) {
    boxes.forEach(function (b) {
      var st = { box: b, id: b.getAttribute('data-yt'), vis: false, hover: false, ready: false, dead: false };
      vstate.push(st);
      if (onFile) { vGiveUp(st, 'Plays once the site is live'); return; }
      if (reduce) { vGiveUp(st, 'Tap to play'); return; }
      var host = b.closest('.mc') || b;
      host.addEventListener('mouseenter', function () { st.hover = true; vStart(st); vSync(st); });
      host.addEventListener('mouseleave', function () { st.hover = false; vSync(st); });
    });
    if ('IntersectionObserver' in window && !onFile && !reduce) {
      var vio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var st = vstate[boxes.indexOf(e.target)]; if (!st) return;
          st.vis = e.isIntersecting && e.intersectionRatio >= 0.3;
          if (e.isIntersecting) vStart(st);
          vSync(st);
        });
      }, { threshold: [0, 0.3, 0.6], rootMargin: '120px 0px' });
      boxes.forEach(function (b) { vio.observe(b); });
    }
    document.addEventListener('visibilitychange', function () { vstate.forEach(vSync); });
  }

  /* ----------------------------------------------------------- cursor */
  if (fine && hasGsap) {
    root.classList.add('has-cursor');
    var cur = $('.cur'), ring = $('.cur-ring'), lab = $('span', ring);
    var cx = gsap.quickTo(cur, 'x', { duration: 0.12, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: 0.12, ease: 'power3' });
    var rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
    var shown = false;
    window.addEventListener('mousemove', function (e) {
      if (!shown) { shown = true; gsap.set([cur, ring], { x: e.clientX, y: e.clientY }); root.classList.add('cur-on'); }
      cx(e.clientX); cy(e.clientY); rx(e.clientX); ry(e.clientY);
    }, { passive: true });
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest ? e.target.closest('[data-cursor],a,button') : null;
      var label = t && t.getAttribute('data-cursor');
      if (label) { lab.textContent = label; ring.classList.add('lbl'); gsap.to(ring, { scale: 2.1, duration: 0.4, ease: 'power3.out' }); }
      else if (t) { ring.classList.remove('lbl'); gsap.to(ring, { scale: 1.5, duration: 0.4, ease: 'power3.out' }); }
      else { ring.classList.remove('lbl'); gsap.to(ring, { scale: 1, duration: 0.4, ease: 'power3.out' }); }
    });
    document.addEventListener('mouseleave', function () { gsap.to([cur, ring], { opacity: 0, duration: 0.2 }); });
    document.addEventListener('mouseenter', function () { gsap.to([cur, ring], { opacity: 1, duration: 0.2 }); });
    /* magnetic buttons */
    $$('[data-mag]').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4, ease: 'power3.out' });
      });
      b.addEventListener('mouseleave', function () { gsap.to(b, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,0.4)' }); });
    });
  }

  if (!hasGsap) { root.classList.remove('loading'); return; }

  /* -------------------------------------------------------------- GSAP */
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  if (!reduce && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.14, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  /* big type leans with the scroll speed */
  var calmSkew = !fine || window.matchMedia('(max-width: 899px)').matches;
  if (lenis && !reduce && !calmSkew) {
    var skewEls = $$('.state p, .ab-copy, .m-big, .c-big, .w-intro h2'), skewOn = false, skLast = 0, skVis = [];
    if ('IntersectionObserver' in window) {
      var skio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var i = skVis.indexOf(e.target);
          if (e.isIntersecting) { if (i < 0) skVis.push(e.target); }
          else if (i > -1) { skVis.splice(i, 1); gsap.set(e.target, { skewY: 0 }); }
        });
      }, { rootMargin: '10% 0px' });
      skewEls.forEach(function (el) { skio.observe(el); });
    } else { skVis = skewEls; }
    gsap.ticker.add(function () {
      var sk = gsap.utils.clamp(-1.1, 1.1, lenis.velocity * -0.08);
      sk = Math.round(sk * 8) / 8;
      if (sk === skLast || !skVis.length) return;
      skLast = sk;
      if (Math.abs(sk) > 0.1) { gsap.set(skVis, { skewY: sk }); skewOn = true; }
      else if (skewOn) { gsap.set(skVis, { skewY: 0 }); skewOn = false; }
    });
  }

  /* nav hides on the way down, returns on the way up */
  var navEl = $('.nav'), navHidden = false;
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (self) {
    if (menuOpen) return;
    var hide = self.direction === 1 && self.scroll() > 260;
    if (hide !== navHidden) { navHidden = hide; gsap.to(navEl, { yPercent: hide ? -110 : 0, duration: 0.5, ease: 'power3.out' }); }
  } });

  /* stickers */
  var stks = $$('.stk');
  stks.forEach(function (s) {
    s.__r = parseFloat(s.getAttribute('data-r')) || 0;
    s.__d = parseFloat(s.getAttribute('data-d')) || 1;
    s.__qx = gsap.quickTo(s, 'x', { duration: 0.9, ease: 'power3' });
    s.__qy = gsap.quickTo(s, 'y', { duration: 0.9, ease: 'power3' });
    if (!reduce) gsap.set(s, { autoAlpha: 0, rotation: s.__r });
    else gsap.set(s, { rotation: s.__r });
  });
  function slap(s, delay) {
    if (reduce) return;
    gsap.fromTo(s, { scale: 2.4, autoAlpha: 0, rotation: s.__r + 28 }, { scale: 1, autoAlpha: 1, rotation: s.__r, duration: 0.55, ease: 'back.out(1.9)', delay: delay || 0 });
  }
  var heroStks = stks.filter(function (s) { return s.closest('.hero'); });
  stks.forEach(function (s) {
    if (heroStks.indexOf(s) > -1) return;
    ScrollTrigger.create({ trigger: s, start: 'top 94%', once: true, onEnter: function () { slap(s, 0.1); } });
  });
  if (fine && !reduce) {
    var mx = 0, my = 0, moved = false;
    var lastMove = 0;
    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; moved = true; lastMove = performance.now(); }, { passive: true });
    var stkVis = [], stkFrame = 0;
    if ('IntersectionObserver' in window) {
      var stkio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { var i = stkVis.indexOf(e.target); if (e.isIntersecting) { if (i < 0) stkVis.push(e.target); } else if (i > -1) stkVis.splice(i, 1); });
      }, { rootMargin: '200px' });
      stks.forEach(function (s) { stkio.observe(s); });
    } else { stkVis = stks; }
    gsap.ticker.add(function () {
      if (!moved || performance.now() - lastMove > 2500 || !stkVis.length) return;
      if ((stkFrame++ & 1) === 1) return;
      var vw = window.innerWidth, vh = window.innerHeight, rects = [];
      stkVis.forEach(function (s) { rects.push(s.getBoundingClientRect()); });
      stkVis.forEach(function (s, i) {
        var r = rects[i];
        var cxs = r.left + r.width / 2, cys = r.top + r.height / 2;
        var dx = cxs - mx, dy = cys - my, d = Math.sqrt(dx * dx + dy * dy) || 1;
        var px = (mx / vw - 0.5) * -26 * s.__d, py = (my / vh - 0.5) * -18 * s.__d;
        var push = d < 190 ? (190 - d) / 190 * 46 : 0;
        s.__qx(px + dx / d * push); s.__qy(py + dy / d * push);
      });
    });
  }

  /* statement + about word reveals */
  function scrubWords(sel, start, end) {
    var p = $(sel); if (!p) return;
    var ws = splitWords(p);
    if (reduce) { gsap.set(ws, { opacity: 1 }); return; }
    gsap.to(ws, { opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: p, start: start, end: end, scrub: 0.35 } });
  }
  scrubWords('#state-p', 'top 82%', 'bottom 48%');
  scrubWords('#ab-copy', 'top 82%', 'bottom 52%');

  /* fit headings reveal */
  if (!reduce) {
    $$('.fit-in').forEach(function (el) {
      gsap.from(el, { yPercent: 105, duration: 1.4, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    gsap.from('.facts li', { opacity: 0, y: 34, duration: 1, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.facts', start: 'top 85%', once: true } });
    gsap.from('.m-sub,.m-all', { opacity: 0, y: 26, duration: 1, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.m-sub', start: 'top 90%', once: true } });
    gsap.from('.mc', { opacity: 0, y: 70, duration: 1.2, ease: 'power3.out', stagger: 0.14, scrollTrigger: { trigger: '.m-grid', start: 'top 85%', once: true } });
    gsap.from('.c-copy,#cf', { opacity: 0, y: 40, duration: 1.1, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: '.c-grid', start: 'top 88%', once: true } });
  }

  /* hero scroll drift */
  if (!reduce) {
    var wds = $$('.nm-w');
    if (wds[0] && window.innerWidth >= 900) {
      gsap.to(wds[0], { x: '-6vw', ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to(wds[1], { x: '6vw', ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
    gsap.to('.proofs', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* work: horizontal on desktop, stacked on mobile */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', function () {
    var pin = $('.work-pin'), track = $('.work-track');
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    var tween = gsap.to(track, { x: function () { return -dist(); }, ease: 'none' });
    ScrollTrigger.create({ animation: tween, trigger: pin, start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 });
    gsap.to('.work-bar i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: function () { return '+=' + dist(); }, scrub: true, invalidateOnRefresh: true } });
    $$('.ep-panel').forEach(function (p) {
      var imgs = $$('.fi img', p);
      gsap.set(imgs, { scale: 1.25 });
      gsap.fromTo(imgs, { yPercent: -9 }, { yPercent: 9, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 100%', end: 'right 0%', scrub: true } });
      gsap.from($$('.fi', p), { opacity: 0, y: 90, rotation: '+=10', duration: 1, ease: 'power3.out', stagger: 0.12, clearProps: 'transform,opacity', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 88%', once: true } });
      gsap.from($$('.ep-meta > *', p), { opacity: 0, x: 40, duration: 0.9, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 85%', once: true } });
    });
    gsap.from('.w-intro h2', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'power4.out', scrollTrigger: { trigger: '.work', start: 'top 70%', once: true } });
  });
  mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', function () {
    $$('.ep-panel').forEach(function (p) {
      var imgs = $$('.fi img', p);
      gsap.set(imgs, { scale: 1.15 });
      gsap.fromTo(imgs, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from($$('.fi', p), { opacity: 0, y: 60, duration: 1, ease: 'power3.out', stagger: 0.12, clearProps: 'transform,opacity', scrollTrigger: { trigger: p, start: 'top 82%', once: true } });
      gsap.from($$('.ep-meta > *', p), { opacity: 0, y: 28, duration: 0.9, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: p, start: 'top 82%', once: true } });
    });
    gsap.from('.w-intro h2', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.w-intro', start: 'top 85%', once: true } });
  });

  /* to be continued band: infinite, right to left */
  (function () {
    var band = $('.tbc'), track = $('.tbc-track'), first = $('.tbc-i'); if (!band || !first) return;
    var SET = 4, i;
    for (i = 0; i < SET * 2 - 1; i++) { var c = first.cloneNode(true); var im = $('img', c); im.alt = ''; im.setAttribute('aria-hidden', 'true'); track.appendChild(c); }
    if (reduce) return;
    var tween, active = false, cur = 0;
    function build() {
      if (tween) tween.kill();
      gsap.set(track, { x: 0 });
      var items = $$('.tbc-i', track);
      var setW = items[SET].offsetLeft - items[0].offsetLeft;
      tween = gsap.to(track, { x: -setW, duration: setW / 110, ease: 'none', repeat: -1 });
    }
    function start() { build(); }
    if ($('img', first).complete) start(); else $('img', first).addEventListener('load', start);
    window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { layout(); build(); }, 140); });
    ScrollTrigger.create({ trigger: band, start: 'top bottom', end: 'bottom top', onToggle: function (s) { active = s.isActive; if (!active && tween) { /* keep running, cheap */ } } });
    gsap.ticker.add(function () {
      if (!tween) return;
      var v = lenis ? lenis.velocity : 0;
      var target = calmSkew ? 0 : gsap.utils.clamp(-3, 3, v * -0.1);
      cur += (target - cur) * 0.1;
      if (active || Math.abs(cur) > 0.01) gsap.set(track, { skewX: cur });
      tween.timeScale(1 + Math.abs(cur) * 0.5);
    });
  })();

  /* ------------------------------------------------------------ intro */
  function heroIn() {
    if (reduce) { gsap.set('.hero-lede,.hero .btn', { opacity: 1 }); heroStks.forEach(function (s) { gsap.set(s, { autoAlpha: 1 }); }); return; }
    var tl = gsap.timeline();
    tl.from('.nm-l', { yPercent: 115, duration: 1.3, ease: 'power4.out', stagger: { each: 0.045, from: 'start' } }, 0)
      .from('.hero-lede', { opacity: 0, y: 24, duration: 1, ease: 'power3.out' }, 0.5)
      .from('.hero .btn', { opacity: 0, y: 24, duration: 1, ease: 'power3.out' }, 0.62)
      .from('.pf', { yPercent: 115, duration: 1.4, ease: 'power4.out', stagger: 0.1, clearProps: 'transform' }, 0.35);
    heroStks.forEach(function (s, i) { slap(s, 1.15 + i * 0.22); });
  }

  function finishLoad() {
    root.classList.remove('loading');
    if (lenis) lenis.start();
    ScrollTrigger.refresh();
    settleHash();
  }

  var loader = $('.loader');
  if (root.classList.contains('loading') && loader && !reduce) {
    var count = $('#ld-count'), nameEl = $('#ld-name span'), bar = $('.ld-bar'), imgsWrap = $('.ld-imgs'), imgs = $$('.ld-imgs img');
    var frame = $('.ld-frame'), state = { v: 0 }, shown = -1;
    var fr = frame.getBoundingClientRect(), W = window.innerWidth, H = window.innerHeight;
    function setClip(t, r, b, l) { imgsWrap.style.clipPath = 'inset(' + t + 'px ' + r + 'px ' + b + 'px ' + l + 'px)'; }
    var clip = { t: fr.top + fr.height / 2, r: W - fr.right + fr.width / 2, b: H - fr.bottom + fr.height / 2, l: fr.left + fr.width / 2 };
    var openR = { t: fr.top, r: W - fr.right, b: H - fr.bottom, l: fr.left };
    setClip(clip.t, clip.r, clip.b, clip.l);
    gsap.set(count, { yPercent: 40, opacity: 0 });
    gsap.set(nameEl, { yPercent: 105 });
    gsap.set('.ld-top', { opacity: 0 });
    gsap.set(frame, { opacity: 0 });
    var N = imgs.length;
    function show(i) {
      if (i === shown) return; shown = i;
      imgs.forEach(function (im, k) { im.style.opacity = k === i ? 1 : 0; });
      gsap.fromTo(imgs[i], { scale: 1.18 }, { scale: 1, duration: 0.55, ease: 'power3.out', overwrite: true });
    }
    var tl = gsap.timeline({ onComplete: function () { loader.style.display = 'none'; finishLoad(); } });
    tl.to('.ld-top', { opacity: 1, duration: 0.5 }, 0.1)
      .to(frame, { opacity: 1, duration: 0.3 }, 0.1)
      .to(clip, { t: openR.t, r: openR.r, b: openR.b, l: openR.l, duration: 0.8, ease: 'power4.out', onUpdate: function () { setClip(clip.t, clip.r, clip.b, clip.l); } }, 0.15)
      .to(count, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power4.out' }, 0.2)
      .to(nameEl, { yPercent: 0, duration: 0.9, ease: 'power4.out' }, 0.3)
      .to(bar, { scaleX: 1, duration: 2.3, ease: 'power1.inOut' }, 0.5)
      .to(state, {
        v: 100, duration: 2.3, ease: 'power1.inOut',
        onUpdate: function () {
          var v = Math.round(state.v);
          count.textContent = ('00' + v).slice(-3);
          show(Math.min(N - 1, Math.floor(state.v / (100 / N))));
        }
      }, 0.5)
      .to([count, '.ld-top', nameEl, frame], { opacity: 0, duration: 0.3, ease: 'power2.in' }, 2.95)
      .to(clip, { t: 0, r: 0, b: 0, l: 0, duration: 0.85, ease: 'power4.inOut', onUpdate: function () { setClip(clip.t, clip.r, clip.b, clip.l); } }, 2.9)
      .to(loader, { yPercent: -100, duration: 0.95, ease: 'power4.inOut' }, 3.85)
      .add(heroIn, 4.3);
    window.__loaderTL = tl;
  } else {
    root.classList.remove('loading');
    if (loader) loader.style.display = 'none';
    heroIn();
    requestAnimationFrame(function () { if (lenis) lenis.start(); ScrollTrigger.refresh(); settleHash(); });
    arrive();
  }

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
