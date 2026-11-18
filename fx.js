/* Shared effects for both pages: roll text, scramble, progress bar, cursor spotlight and trail,
   click ripples, letter proximity, image tilt, panel parallax, highlighter underlines.
   Everything here is decoration. If anything fails, the pages still work. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var fx = window.__fx = {};

  /* ----------------------------------------------------- roll text on links */
  function roll(el) {
    if (el.__rt) return; el.__rt = 1;
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3 && n.textContent.replace(/\s+/g, '')) {
        var t = n.textContent.replace(/\s+/g, ' ').trim();
        var w = document.createElement('span'); w.className = 'rt';
        var a = document.createElement('i'); a.textContent = t;
        var b = document.createElement('i'); b.textContent = t; b.setAttribute('aria-hidden', 'true');
        w.appendChild(a); w.appendChild(b);
        el.replaceChild(w, n);
        return;
      }
    }
  }
  try {
    $$('a.btn, button.btn, .nav a.lnk, .nav-logo, .menu-btn, .menu-x, .menu ul a, .menu-foot a, .c-links a, .ep-top .x').forEach(roll);
  } catch (e) {}

  /* every button, link and logo gets the magnetic pull (the page scripts bind [data-mag]) */
  if (fine && !reduce) {
    $$('a.btn, button.btn, .nav .hello, .nav-logo, .menu-btn, .c-links a').forEach(function (el) { el.setAttribute('data-mag', ''); });
  }

  /* -------------------------------------------------------------- scramble */
  var GLYPHS = '!<>-_/[]{}=+*^?#ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  fx.scramble = function (el, dur) {
    if (!el || reduce) return;
    var txt = el.getAttribute('data-txt');
    if (txt === null) { txt = el.textContent; el.setAttribute('data-txt', txt); }
    var t0 = performance.now(), d = (dur || 0.7) * 1000;
    if (el.__scr) cancelAnimationFrame(el.__scr);
    (function tick(now) {
      var p = clamp((now - t0) / d, 0, 1), out = '', i, n = txt.length;
      for (i = 0; i < n; i++) {
        var c = txt.charAt(i);
        if (c === ' ' || i < p * n * 1.15 - 1) out += c; else out += GLYPHS.charAt((Math.random() * GLYPHS.length) | 0);
      }
      el.textContent = out;
      if (p < 1) el.__scr = requestAnimationFrame(tick); else { el.textContent = txt; el.__scr = 0; }
    })(t0);
  };
  if ('IntersectionObserver' in window && !reduce) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { sio.unobserve(e.target); fx.scramble(e.target, 0.75); } });
    }, { threshold: 0.8 });
    $$('.a-tag, .d-n, .facts b, .fld label, .ep-tags, .lens-head .a-tag').forEach(function (el) { sio.observe(el); });
  }

  /* ----------------------------------------------------------- progress bar */
  (function () {
    var bar = document.createElement('div'); bar.className = 'sp'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var queued = false;
    function upd() {
      queued = false;
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      bar.style.transform = 'scaleX(' + clamp(window.scrollY / max, 0, 1).toFixed(4) + ')';
    }
    window.addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(upd); } }, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  })();

  /* ------------------------------------------- spotlight, trail, click bursts */
  var cvs = null, ctx = null, W = 0, H = 0, dpr = 1;
  var pts = [], rings = [], bits = [], running = false;
  var trailColor = '255,85,102';
  function sizeCanvas() {
    if (!cvs) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cvs.width = Math.round(W * dpr); cvs.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(draw); } }
  function draw(now) {
    if (!ctx) { running = false; return; }
    ctx.clearRect(0, 0, W, H);
    var i, p, alive = false;
    /* comet trail */
    var life = 520;
    pts = pts.filter(function (q) { return now - q.t < life; });
    if (pts.length > 1) {
      alive = true;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (i = 1; i < pts.length; i++) {
        var a = pts[i - 1], b = pts[i], k = clamp(1 - (now - b.t) / life, 0, 1);
        ctx.strokeStyle = 'rgba(' + b.c + ',' + (0.55 * k * k).toFixed(3) + ')';
        ctx.lineWidth = 1 + 5 * k;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    /* ripples */
    rings = rings.filter(function (r) { return now - r.t < 800; });
    rings.forEach(function (r) {
      alive = true;
      var k = clamp((now - r.t) / 800, 0, 1), e = 1 - Math.pow(1 - k, 3);
      ctx.strokeStyle = 'rgba(' + r.c + ',' + (0.7 * (1 - k)).toFixed(3) + ')';
      ctx.lineWidth = 2.2 * (1 - k) + 0.4;
      ctx.beginPath(); ctx.arc(r.x, r.y, 8 + e * 90, 0, 6.2832); ctx.stroke();
      ctx.strokeStyle = 'rgba(' + r.c + ',' + (0.35 * (1 - k)).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(r.x, r.y, 4 + e * 46, 0, 6.2832); ctx.stroke();
    });
    /* shards and confetti */
    bits = bits.filter(function (s) { return now - s.t < s.life; });
    bits.forEach(function (s) {
      alive = true;
      var dt = clamp((now - s.pt) / 1000, 0, 0.034); s.pt = now;
      s.vy += s.g * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vx *= 0.985; s.rot += s.vr * dt;
      var k = clamp(1 - (now - s.t) / s.life, 0, 1);
      ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rot);
      ctx.fillStyle = 'rgba(' + s.c + ',' + clamp(k * 1.4, 0, 1).toFixed(3) + ')';
      ctx.fillRect(-s.w / 2, -s.h / 2, s.w, s.h);
      ctx.restore();
    });
    if (alive) requestAnimationFrame(draw); else { running = false; ctx.clearRect(0, 0, W, H); }
  }
  fx.burst = function (x, y, n, col) {
    if (!ctx || reduce) return;
    var c = col || trailColor, now = performance.now(), i;
    rings.push({ x: x, y: y, t: now, c: c });
    n = n || 14;
    for (i = 0; i < n; i++) {
      var ang = Math.random() * 6.2832, sp = 160 + Math.random() * 360;
      bits.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 120, g: 700, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 18,
        w: 3 + Math.random() * 7, h: 2 + Math.random() * 3, c: Math.random() < 0.3 ? '231,228,218' : c, t: now, pt: now, life: 700 + Math.random() * 500 });
    }
    kick();
  };
  function colorFor(el) {
    if (el && el.closest) {
      if (el.closest('.a-out, .tx-red')) return '231,228,218';
      if (el.closest('.bone, .a-man, .a-lens')) return '201,19,43';
    }
    return '255,85,102';
  }
  if (fine && !reduce) {
    var spot = document.createElement('div'); spot.className = 'spot'; spot.setAttribute('aria-hidden', 'true'); document.body.appendChild(spot);
    cvs = document.createElement('canvas'); cvs.className = 'trail'; cvs.setAttribute('aria-hidden', 'true'); document.body.appendChild(cvs);
    ctx = cvs.getContext('2d');
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    var sx = -999, sy = -999, tx = -999, ty = -999, lx = -999, ly = -999, spotOn = false, spotRun = false;
    function spotLoop() {
      sx += (tx - sx) * 0.14; sy += (ty - sy) * 0.14;
      spot.style.transform = 'translate3d(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px,0)';
      if (Math.abs(tx - sx) + Math.abs(ty - sy) > 0.4) requestAnimationFrame(spotLoop); else spotRun = false;
    }
    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!spotOn) { spotOn = true; sx = tx; sy = ty; }
      if (!spotRun) { spotRun = true; requestAnimationFrame(spotLoop); }
      trailColor = colorFor(e.target);
      if (Math.hypot(tx - lx, ty - ly) > 4) {
        pts.push({ x: tx, y: ty, t: performance.now(), c: trailColor });
        if (pts.length > 40) pts.shift();
        lx = tx; ly = ty; kick();
      }
    }, { passive: true });
    window.addEventListener('pointerdown', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      trailColor = colorFor(e.target);
      fx.burst(e.clientX, e.clientY, 9);
    }, { passive: true });

    /* the ring grows over big type */
    document.addEventListener('mouseover', function (e) {
      var surf = 'ink';
      if (e.target.closest) { if (e.target.closest('.a-out, .tx-red')) surf = 'red'; else if (e.target.closest('.bone, .a-man, .a-lens')) surf = 'bone'; }
      if (root.getAttribute('data-surface') !== surf) root.setAttribute('data-surface', surf);
      var ring = $('.cur-ring'); if (!ring) return;
      var big = e.target.closest && e.target.closest('h1, h2, .d-t, .num-v, .chap-t, [data-big]');
      ring.classList.toggle('big', !!big);
    });
  }

  /* ------------------------------------------------- letter proximity (width) */
  var groups = [], pmx = -9999, pmy = -9999, ploop = false;
  function parseRGB(s) { var m = /rgba?\(([^)]+)\)/.exec(s || ''); if (!m) return [231, 228, 218]; var a = m[1].split(',').map(parseFloat); return [a[0], a[1], a[2]]; }
  fx.prox = function (letters, o) {
    if (!fine || reduce || !letters || !letters.length) return;
    o = o || {};
    var cs = getComputedStyle(letters[0]);
    var base = parseFloat(cs.fontStretch) || 125;
    var g = { l: letters, R: o.R || 230, base: base, lo: o.lo || 68, tint: o.tint !== false, col: parseRGB(cs.color), box: o.box || letters[0].parentElement, cur: letters.map(function () { return 0; }), sv: [], cx: [], cy: [], sig: 0 };
    groups.push(g);
  };
  function cacheGroup(g) {
    g.cx = []; g.cy = [];
    g.l.forEach(function (el) { var r = el.getBoundingClientRect(); g.cx.push(r.left + r.width / 2 + window.scrollX); g.cy.push(r.top + r.height / 2 + window.scrollY); });
  }
  var vio = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.__pv = e.isIntersecting; }); }, { rootMargin: '300px' }) : null;
  function ploopRun() {
    var busy = false, work = [];
    /* 1. read phase: layout is only measured here, never after a write */
    groups.forEach(function (g) {
      if (!g.watched && vio) { g.watched = true; g.box.__pv = true; vio.observe(g.box); }
      if (g.box.__pv === false && !g.on) return;
      var box = g.box.getBoundingClientRect();
      var near = pmx > box.left - g.R && pmx < box.right + g.R && pmy > box.top - g.R && pmy < box.bottom + g.R;
      if (!g.on && near) { g.on = true; cacheGroup(g); }
      work.push([g, near]);
    });
    /* 2. write phase: only letters whose value actually changed */
    work.forEach(function (w) {
      var g = w[0], near = w[1], any = false, chg = false;
      g.l.forEach(function (el, i) {
        var tgt = 0;
        if (near) {
          var dx = pmx - (g.cx[i] - window.scrollX), dy = pmy - (g.cy[i] - window.scrollY);
          tgt = clamp(1 - Math.hypot(dx, dy) / g.R, 0, 1); tgt = tgt * tgt * (3 - 2 * tgt);
        }
        var c = g.cur[i] + (tgt - g.cur[i]) * 0.22;
        if (Math.abs(c - tgt) < 0.01) c = tgt;
        if (c === g.cur[i]) return;
        var st = (Math.round((g.base - c * (g.base - g.lo)) * 2) / 2);
        g.cur[i] = c; chg = true;
        if (c === 0) { el.style.fontStretch = ''; el.style.color = ''; g.sv[i] = null; return; }
        any = true;
        if (g.sv[i] === st) return;
        g.sv[i] = st;
        el.style.fontStretch = st + '%';
        if (g.tint) { el.style.color = 'rgb(' + Math.round(g.col[0] + (255 - g.col[0]) * c) + ',' + Math.round(g.col[1] + (85 - g.col[1]) * c) + ',' + Math.round(g.col[2] + (102 - g.col[2]) * c) + ')'; }
      });
      if (!any && !near) g.on = false;
      if (chg) busy = true;
    });
    if (busy) requestAnimationFrame(ploopRun); else ploop = false;
  }
  if (fine && !reduce) {
    window.addEventListener('mousemove', function (e) { pmx = e.clientX; pmy = e.clientY; if (groups.length && !ploop) { ploop = true; requestAnimationFrame(ploopRun); } }, { passive: true });
    document.documentElement.addEventListener('mouseleave', function () { pmx = -9999; pmy = -9999; if (groups.length && !ploop) { ploop = true; requestAnimationFrame(ploopRun); } });
    /* big headings: split into letters now, before the page script measures them */
    $$('.c-big .fit-in, .m-big .fit-in').forEach(function (inner) {
      var t = inner.textContent; inner.textContent = ''; inner.setAttribute('aria-label', t);
      var ls = t.split('').map(function (ch) { var s = document.createElement('span'); s.className = 'pl'; s.setAttribute('aria-hidden', 'true'); s.textContent = ch === ' ' ? ' ' : ch; inner.appendChild(s); return s; });
      inner.__letters = ls;
    });
    window.addEventListener('load', function () {
      $$('.c-big .fit-in, .m-big .fit-in').forEach(function (inner) { fx.prox(inner.__letters, { R: 260, lo: 70, box: inner.parentElement }); });
      var nm = $$('.nm-l'); if (nm.length) fx.prox(nm, { R: 240, lo: 74, box: $('.name') });
    });
  }

  /* ------------------------------------------------------ tilt + parallax */
  if (fine && !reduce) {
    var tq = null, tqOn = false;
    function tiltFlush() {
      tqOn = false; var e = tq; if (!e) return;
      var t = e.target.closest ? e.target.closest('.pf, .gi') : null;
      var pn = e.target.closest ? e.target.closest('.ep-panel') : null;
      var r = t ? t.getBoundingClientRect() : null, q = pn ? pn.getBoundingClientRect() : null;
      if (t) {
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        t.style.setProperty('--ry', ((px - 0.5) * 14).toFixed(1) + 'deg');
        t.style.setProperty('--rx', ((0.5 - py) * 12).toFixed(1) + 'deg');
        t.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        t.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      }
      if (pn) {
        pn.style.setProperty('--px', ((e.clientX - q.left) / q.width - 0.5).toFixed(2));
        pn.style.setProperty('--py', ((e.clientY - q.top) / q.height - 0.5).toFixed(2));
      }
    }
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      if (!e.target.closest || !e.target.closest('.pf, .gi, .ep-panel')) return;
      tq = e; if (!tqOn) { tqOn = true; requestAnimationFrame(tiltFlush); }
    }, { passive: true });
    document.addEventListener('pointerout', function (e) {
      var t = e.target.closest ? e.target.closest('.pf, .gi') : null;
      if (t && !(e.relatedTarget && t.contains(e.relatedTarget))) { t.style.setProperty('--rx', '0deg'); t.style.setProperty('--ry', '0deg'); }
      var pn = e.target.closest ? e.target.closest('.ep-panel') : null;
      if (pn && !(e.relatedTarget && pn.contains(e.relatedTarget))) { pn.style.setProperty('--px', '0'); pn.style.setProperty('--py', '0'); }
    });
  }

  /* ------------------------------------------------ highlighter underlines */
  var hls = $$('.state em, .ab-copy em, .man-big b');
  hls.forEach(function (el) { el.classList.add('hl'); });
  window.addEventListener('load', function () {
    if (reduce || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') { hls.forEach(function (el) { el.style.setProperty('--ul', '100%'); }); return; }
    gsap.registerPlugin(ScrollTrigger);
    hls.forEach(function (el, i) {
      gsap.fromTo(el, { '--ul': '0%' }, { '--ul': '100%', duration: 1.3, ease: 'power3.inOut', delay: 0.15, scrollTrigger: { trigger: el, start: 'top 68%', once: true } });
    });
  });
})();
