/* Devid srl: movimento del sito. GSAP 3 + ScrollTrigger + SplitText + Lenis. */
(function () {
  'use strict';
  var html = document.documentElement;
  var corpo = document.body;
  window.devidPronto = true;
  if (!window.gsap || !window.ScrollTrigger) { html.classList.remove('js'); return; }

  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  CustomEase.create('uscita', '0.16,1,0.3,1');
  CustomEase.create('tenda', '0.76,0,0.24,1');
  CustomEase.create('morbida', '0.65,0,0.35,1');
  ScrollTrigger.config({ ignoreMobileResize: true });

  var ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tocco = matchMedia('(hover: none)').matches;
  if (ridotto) html.classList.add('ridotto');
  var stato = (window.devidEroe = window.devidEroe || { taglio: 0, apertura: 0, entrata: 0, pronto: false });

  var memoria = {
    leggi: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    scrivi: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    togli: function (k) { try { sessionStorage.removeItem(k); } catch (e) {} },
  };
  var tutti = function (sel, dove) { return Array.prototype.slice.call((dove || document).querySelectorAll(sel)); };
  tutti('[data-anno]').forEach(function (a) { a.textContent = String(new Date().getFullYear()); });

  /* ---------- scorrimento morbido ---------- */
  var lenis = null;
  if (!ridotto && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  var ferma = function () { if (lenis) lenis.stop(); };
  var riparti = function () { if (lenis) lenis.start(); };

  /* ---------- testo che gira al passaggio ---------- */
  tutti('[data-gira]').forEach(function (el) {
    var t = el.textContent;
    el.textContent = '';
    var a = document.createElement('span'); a.className = 'gira-a'; a.textContent = t;
    var b = document.createElement('span'); b.className = 'gira-b'; b.textContent = t; b.setAttribute('aria-hidden', 'true');
    el.appendChild(a); el.appendChild(b);
  });

  /* ---------- testata ---------- */
  var testata = document.querySelector('[data-testata]');
  var menuAperto = false;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: function (s) { testata.classList.toggle('nascosta', s.direction === 1 && s.scroll() > 160 && !menuAperto); },
  });

  /* ---------- menu del telefono ---------- */
  var bottone = document.querySelector('.apri-menu');
  var menuTel = document.getElementById('menu-telefono');
  if (bottone && menuTel) {
    var cartaMenu = menuTel.querySelector('.menu-telefono-carta');
    var voci = tutti('nav a span', menuTel);
    var chiudi = function () {
      menuAperto = false;
      bottone.setAttribute('aria-expanded', 'false');
      gsap.to(cartaMenu, { scale: 0.9, autoAlpha: 0, duration: ridotto ? 0.01 : 0.45, ease: 'power3.in', onComplete: function () { menuTel.hidden = true; riparti(); } });
      gsap.to(menuTel, { backgroundColor: 'rgba(11,12,20,0)', duration: 0.4 });
    };
    bottone.addEventListener('click', function () {
      if (menuAperto) { chiudi(); return; }
      menuAperto = true;
      bottone.setAttribute('aria-expanded', 'true');
      menuTel.hidden = false; ferma();
      gsap.fromTo(menuTel, { backgroundColor: 'rgba(11,12,20,0)' }, { backgroundColor: 'rgba(11,12,20,.28)', duration: 0.5 });
      gsap.fromTo(cartaMenu, { scale: 0.86, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: ridotto ? 0.01 : 0.8, ease: 'back.out(1.5)' });
      gsap.fromTo(voci, { yPercent: 110 }, { yPercent: 0, duration: ridotto ? 0.01 : 0.9, stagger: 0.05, ease: 'uscita', delay: 0.08 });
    });
    menuTel.addEventListener('click', function (e) { if (e.target === menuTel) chiudi(); });
  }

  /* ---------- tenda fra le pagine ---------- */
  var tenda = document.querySelector('.tenda');
  var pannello = tenda && tenda.querySelector('.tenda-pannello');
  var tendaTitolo = tenda && tenda.querySelector('.tenda-titolo');
  var inUscita = false;
  function interno(a) {
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
    var h = a.getAttribute('href') || '';
    if (!h || h.charAt(0) === '#' || /^(mailto|tel):/i.test(h)) return false;
    var u = new URL(a.href, location.href);
    if (u.origin !== location.origin) return false;
    if (/\.(pdf|zip|jpg|png|webp)$/i.test(u.pathname)) return false;
    if (u.pathname === location.pathname && u.hash) return false;
    return true;
  }
  function esci(fare, titolo) {
    if (inUscita) return;
    inUscita = true;
    memoria.scrivi('devid-tenda', titolo || 'Devid srl');
    if (ridotto) { fare(); return; }
    tendaTitolo.textContent = titolo || 'Devid srl';
    gsap.set(tenda, { visibility: 'visible' });
    gsap.timeline({ onComplete: fare })
      .fromTo(pannello, { clipPath: 'inset(100% 0% 0% 0% round 40px 40px 0px 0px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', duration: 0.8, ease: 'tenda' })
      .fromTo(tendaTitolo, { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'uscita' }, 0.35)
      .fromTo('main', { y: 0 }, { y: -80, duration: 0.8, ease: 'tenda' }, 0);
  }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a');
    if (!interno(a)) return;
    e.preventDefault();
    var titolo = a.getAttribute('data-tenda') || a.textContent.trim().slice(0, 40);
    var indietro = a.hasAttribute('data-indietro') && document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1;
    esci(function () { if (indietro) history.back(); else location.href = a.href; }, titolo);
  });
  addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    inUscita = false;
    gsap.set(tenda, { visibility: 'hidden' });
    gsap.set('main', { y: 0 });
    riparti();
  });

  /* ---------- comparse allo scorrimento ---------- */
  function comparse() {
    if (ridotto) return;

    /* righe dei titoli */
    tutti('[data-righe]').forEach(function (el) {
      SplitText.create(el, {
        type: 'lines', mask: 'lines', autoSplit: true,
        onSplit: function (self) {
          return gsap.from(self.lines, { yPercent: 112, duration: 1.3, ease: 'uscita', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 90%' } });
        },
      });
    });

    /* etichette piccole */
    tutti('[data-sale]').forEach(function (el) {
      gsap.from(el, { y: 14, autoAlpha: 0, duration: 1, ease: 'uscita', scrollTrigger: { trigger: el, start: 'top 94%' } });
    });

    /* la dichiarazione si accende parola per parola */
    tutti('[data-accende]').forEach(function (el) {
      SplitText.create(el, { type: 'words', wordsClass: 'parola' });
      var parole = tutti('.parola', el);
      var notte = corpo.classList.contains('tema-notte');
      var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.5 } });
      parole.forEach(function (p, i) {
        var blu = p.closest('em');
        tl.to(p, { color: notte ? (blu ? '#8e9bff' : '#ffffff') : (blu ? '#1f35df' : '#0b0c14'), duration: 1, ease: 'none' }, i * 0.18);
      });
    });

    /* le carte scure e blu si allargano entrando */
    tutti('[data-carta]').forEach(function (c) {
      gsap.fromTo(c, { scale: 0.92, borderRadius: 64 }, {
        scale: 1, borderRadius: getComputedStyle(c).borderRadius, ease: 'none',
        scrollTrigger: { trigger: c, start: 'top bottom', end: 'top 35%', scrub: true },
      });
    });

    /* le carte dei servizi salgono, con la foto che si apre */
    tutti('[data-carta-servizio]').forEach(function (c, i) {
      var f = c.querySelector('.servizio-foto');
      var im = f.querySelector('img');
      var tl = gsap.timeline({ scrollTrigger: { trigger: c, start: 'top 92%' } });
      tl.from(c, { y: 90, duration: 1.4, ease: 'uscita' })
        .fromTo(f, { clipPath: 'inset(14% 10% 14% 10% round 40px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.5, ease: 'uscita' }, 0)
        .fromTo(im, { scale: 1.35 }, { scale: 1.02, duration: 1.8, ease: 'uscita' }, 0)
        .from(c.querySelectorAll('.servizio-nome, .servizio-breve, .servizio-tag li'), { y: 16, autoAlpha: 0, duration: 0.9, stagger: 0.05, ease: 'uscita' }, 0.25);
      gsap.to(im, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* foto generiche e carte delle pagine interne */
    tutti('[data-foto]').forEach(function (f) {
      var im = f.querySelector('img, iframe');
      var tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 90%' } });
      tl.fromTo(f, { clipPath: 'inset(12% 8% 12% 8% round 40px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.5, ease: 'uscita' });
      if (im && im.tagName === 'IMG') tl.fromTo(im, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'uscita' }, 0);
    });
    ScrollTrigger.batch('[data-scheda]', {
      start: 'top 92%',
      onEnter: function (els) { gsap.from(els, { y: 50, autoAlpha: 0, scale: 0.97, duration: 1.1, ease: 'uscita', stagger: 0.07 }); },
    });
    tutti('.novita-carta').forEach(function (c) {
      gsap.from(c, { y: 70, autoAlpha: 0, duration: 1.3, ease: 'uscita', scrollTrigger: { trigger: c, start: 'top 92%' } });
    });

    /* settori: entrano uno dopo l'altro */
    ScrollTrigger.batch('[data-settore]', {
      start: 'top 94%',
      onEnter: function (els) { gsap.from(els, { y: 40, autoAlpha: 0, duration: 1, ease: 'uscita', stagger: 0.08 }); },
    });

    /* numeri che contano */
    tutti('[data-conta]').forEach(function (el) {
      var fine = parseFloat(el.getAttribute('data-conta'));
      var o = { v: 0 };
      el.textContent = '0';
      gsap.to(o, { v: fine, duration: 2, ease: 'morbida', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: function () { el.textContent = String(Math.round(o.v)); } });
    });

    /* il marchio grande in fondo */
    var grande = document.querySelector('[data-marchio-grande] img');
    if (grande) gsap.fromTo(grande, { yPercent: 70, clipPath: 'inset(0% 0% 100% 0%)' }, { yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'uscita', scrollTrigger: { trigger: '[data-marchio-grande]', start: 'top 96%' } });
  }

  /* ---------- foto grande delle pagine interne ---------- */
  function fotoGrande() {
    var f = document.querySelector('[data-foto-grande]');
    if (!f) return null;
    var im = f.querySelector('img');
    if (!ridotto) gsap.to(im, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } });
    return function (tl, at) {
      tl.fromTo(f, { clipPath: 'inset(18% 12% 0% 12% round 60px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.8, ease: 'tenda' }, at)
        .fromTo(im, { scale: 1.35 }, { scale: 1, duration: 2.2, ease: 'uscita' }, at);
    };
  }

  /* ---------- nastro delle macchine ---------- */
  function nastro() {
    var b = document.querySelector('[data-nastro]');
    if (!b || ridotto) return;
    var giro = b.firstElementChild;
    var x = 0, vel = 0;
    gsap.ticker.add(function (t, dt) {
      var w = giro.offsetWidth;
      if (!w) return;
      var extra = lenis ? Math.abs(lenis.velocity) * 0.25 : 0;
      vel += (1 + extra - vel) * 0.08;
      x -= vel * dt * 0.06;
      if (x <= -w) x += w;
      b.style.transform = 'translate3d(' + x + 'px,0,0)';
    });
  }

  /* ---------- galleria: scorre da sola, si trascina, segue lo scroll ---------- */
  function galleria() {
    var g = document.querySelector('[data-galleria]');
    if (!g) return;
    var b = g.querySelector('[data-galleria-binario]');
    var foto = tutti('.galleria-foto', b);
    var meta = foto.length / 2;
    var giro = function () { return foto[meta].offsetLeft - foto[0].offsetLeft; };
    if (ridotto) { g.style.overflowX = 'auto'; return; }
    var x = 0, spinta = 0, preso = false, ultimoX = 0, vista = false;
    new IntersectionObserver(function (v) { vista = v[0].isIntersecting; }).observe(g);
    g.addEventListener('pointerdown', function (e) { preso = true; ultimoX = e.clientX; g.setPointerCapture(e.pointerId); spinta = 0; });
    g.addEventListener('pointermove', function (e) { if (!preso) return; var d = e.clientX - ultimoX; ultimoX = e.clientX; x += d; spinta = d; });
    var lascia = function () { preso = false; };
    g.addEventListener('pointerup', lascia); g.addEventListener('pointercancel', lascia);
    var inclina = foto.map(function (f) { return gsap.quickSetter(f, 'skewX', 'deg'); });
    var curva = 0;
    gsap.ticker.add(function (t, dt) {
      if (!vista) return;
      var w = giro();
      var sv = lenis ? lenis.velocity : 0;
      if (!preso) { spinta *= 0.94; x += spinta - (0.5 + Math.abs(sv) * 0.35) * dt * 0.06; }
      if (x <= -w) x += w; if (x > 0) x -= w;
      b.style.transform = 'translate3d(' + x + 'px,0,0)';
      var obiettivo = gsap.utils.clamp(-8, 8, (preso ? -spinta : sv) * 0.25);
      curva += (obiettivo - curva) * 0.1;
      for (var i = 0; i < inclina.length; i++) inclina[i](curva);
    });
  }

  /* ---------- bolla del cursore sopra le foto ---------- */
  function cursore() {
    var c = document.querySelector('[data-cursore-bolla]');
    if (!c || tocco || ridotto) return;
    var testo = c.querySelector('span');
    var px = gsap.quickTo(c, 'x', { duration: 0.5, ease: 'power3' });
    var py = gsap.quickTo(c, 'y', { duration: 0.5, ease: 'power3' });
    addEventListener('pointermove', function (e) { px(e.clientX); py(e.clientY); }, { passive: true });
    tutti('[data-cursore]').forEach(function (z) {
      z.addEventListener('pointerenter', function () { testo.textContent = z.getAttribute('data-cursore'); gsap.to(c, { scale: 1, duration: 0.6, ease: 'back.out(2)', overwrite: 'auto' }); });
      z.addEventListener('pointerleave', function () { gsap.to(c, { scale: 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto' }); });
    });
  }

  /* ---------- bottoni magnetici ---------- */
  function magneti() {
    if (tocco || ridotto) return;
    tutti('[data-magnete]').forEach(function (p) {
      var x = gsap.quickTo(p, 'x', { duration: 0.6, ease: 'power3' });
      var y = gsap.quickTo(p, 'y', { duration: 0.6, ease: 'power3' });
      var t = p.querySelector('.bottone-testo');
      var tx = gsap.quickTo(t, 'x', { duration: 0.6, ease: 'power3' });
      var ty = gsap.quickTo(t, 'y', { duration: 0.6, ease: 'power3' });
      p.addEventListener('pointermove', function (e) {
        var r = p.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        x(dx * 0.3); y(dy * 0.4); tx(dx * 0.12); ty(dy * 0.16);
      });
      p.addEventListener('pointerleave', function () { gsap.to([p, t], { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)', overwrite: true }); });
    });
  }

  /* ---------- la trama di fili nella carta blu ---------- */
  function trama() {
    var c = document.querySelector('[data-trama]');
    if (!c) return;
    var g = c.getContext('2d');
    var mx = -999, my = -999, vista = false, w = 0, h = 0, dpr = Math.min(devicePixelRatio || 1, 2);
    var carta = c.parentElement;
    var misura = function () { w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
    misura(); addEventListener('resize', misura);
    new IntersectionObserver(function (v) { vista = v[0].isIntersecting; }).observe(c);
    carta.addEventListener('pointermove', function (e) { var r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    carta.addEventListener('pointerleave', function () { mx = my = -999; });
    var t = 0;
    var disegna = function () {
      g.clearRect(0, 0, w, h);
      g.lineWidth = 1;
      var passo = 22;
      for (var y = passo / 2; y < h; y += passo) {
        g.beginPath();
        for (var x = 0; x <= w; x += 12) {
          var dx = x - mx, dy = y - my, d = Math.sqrt(dx * dx + dy * dy);
          var spinta = d < 170 ? (1 - d / 170) * 26 * (dy < 0 ? -1 : 1) : 0;
          var yy = y + Math.sin(x * 0.012 + t + y * 0.05) * 2.4 + spinta;
          if (x === 0) g.moveTo(x, yy); else g.lineTo(x, yy);
        }
        g.strokeStyle = 'rgba(255,255,255,' + (0.07 + 0.05 * Math.sin(y * 0.1 + t)) + ')';
        g.stroke();
      }
    };
    if (ridotto) { disegna(); return; }
    gsap.ticker.add(function () { if (!vista) return; t += 0.012; disegna(); });
  }

  /* ---------- servizi: le carte si accendono scorrendo, ognuna col suo disegno ---------- */
  var ARTE = {
    /* la trama sotto la luce del banco di controllo, che trova un fallo */
    controllo: function (g, w, h, t) {
      var passo = 9, luce = (Math.sin(t * 0.5) * 0.5 + 0.5) * w;
      for (var x = 0; x < w; x += passo) {
        var d = Math.abs(x - luce), a = 0.06 + Math.max(0, 1 - d / 160) * 0.5;
        g.strokeStyle = 'rgba(170,185,255,' + a + ')'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, h); g.stroke();
      }
      for (var y = 0; y < h; y += passo) {
        g.strokeStyle = 'rgba(120,140,255,.07)';
        g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(w, y + 0.5); g.stroke();
      }
      var gr = g.createLinearGradient(luce - 120, 0, luce + 120, 0);
      gr.addColorStop(0, 'rgba(120,140,255,0)'); gr.addColorStop(0.5, 'rgba(200,210,255,.28)'); gr.addColorStop(1, 'rgba(120,140,255,0)');
      g.fillStyle = gr; g.fillRect(luce - 120, 0, 240, h);
      g.fillStyle = 'rgba(240,243,255,.95)'; g.fillRect(luce - 0.75, 0, 1.5, h);
      var fx = w * 0.62, fy = h * 0.42, vicino = Math.max(0, 1 - Math.abs(luce - fx) / 90);
      if (vicino > 0) {
        g.strokeStyle = 'rgba(255,255,255,' + vicino + ')'; g.lineWidth = 1.2;
        g.strokeRect(fx - 22, fy - 14, 44, 28);
        g.font = '500 11px "Plex Mono", monospace'; g.fillStyle = 'rgba(255,255,255,' + vicino + ')';
        g.fillText('FALLO  CM 30', fx - 22, fy - 22);
      }
    },
    /* due teli che si avvicinano e si uniscono, col calore della pressa */
    adesivazione: function (g, w, h, t) {
      var k = Math.sin(t * 0.9) * 0.5 + 0.5, cx = w * 0.55, cy = h * 0.5;
      var gap = 8 + k * 46;
      for (var l = 0; l < 2; l++) {
        var y = cy + (l ? gap / 2 : -gap / 2);
        g.save(); g.translate(cx, y); g.transform(1, 0, -0.9, 0.32, 0, 0);
        g.fillStyle = l ? 'rgba(60,80,240,.55)' : 'rgba(190,200,255,.18)';
        g.strokeStyle = 'rgba(220,226,255,.6)'; g.lineWidth = 1;
        g.beginPath(); g.rect(-w * 0.32, -h * 0.55, w * 0.64, h * 1.1); g.fill(); g.stroke();
        g.strokeStyle = 'rgba(220,226,255,.12)';
        for (var i = -w * 0.32; i < w * 0.32; i += 12) { g.beginPath(); g.moveTo(i, -h * 0.55); g.lineTo(i, h * 0.55); g.stroke(); }
        g.restore();
      }
      var caldo = Math.max(0, 1 - gap / 30);
      g.fillStyle = 'rgba(255,255,255,' + caldo * 0.7 + ')';
      g.fillRect(cx - w * 0.36, cy - 0.75, w * 0.72, 1.5);
    },
    /* le sagome del cartamodello che si disegnano, con le quote */
    modellistica: function (g, w, h, t) {
      for (var x = 12; x < w; x += 24) for (var y = 12; y < h; y += 24) { g.fillStyle = 'rgba(170,185,255,.12)'; g.fillRect(x, y, 1.5, 1.5); }
      var sc = Math.min(w / 1050, h / 640) * 1.05, ox = w * 0.5 - 500 * sc, oy = h * 0.5 - 320 * sc;
      var pezzi = [
        'M118 96 L214 74 C226 128 286 150 334 126 L352 104 C356 176 388 226 432 246 L446 548 L104 552 L112 262 C134 216 132 154 118 96 Z',
        'M500 552 L520 330 C540 178 608 116 660 116 C712 116 780 178 800 330 L820 552 C760 566 560 566 500 552 Z',
        'M850 90 Q918 62 972 96 L962 168 Q912 140 858 160 Z',
        'M852 250 H964 V420 Q964 462 924 462 H892 Q852 462 852 420 Z',
      ];
      g.save(); g.translate(ox, oy); g.scale(sc, sc);
      var ciclo = (t * 0.22) % 1.35;
      pezzi.forEach(function (d, i) {
        var path = new Path2D(d), p = Math.min(1, Math.max(0, (ciclo - i * 0.18) / 0.55));
        g.setLineDash([2400 * p, 2400]); g.lineWidth = 1.4 / sc; g.strokeStyle = 'rgba(230,234,255,.85)'; g.stroke(path);
        g.setLineDash([]);
        if (p >= 1) { g.fillStyle = 'rgba(60,80,240,.28)'; g.fill(path); }
      });
      g.setLineDash([4 / sc, 4 / sc]); g.strokeStyle = 'rgba(170,185,255,.5)'; g.lineWidth = 1 / sc;
      g.beginPath(); g.moveTo(104, 590); g.lineTo(446, 590); g.moveTo(500, 590); g.lineTo(820, 590); g.stroke(); g.setLineDash([]);
      g.font = (11 / sc) + 'px "Plex Mono", monospace'; g.fillStyle = 'rgba(200,210,255,.7)';
      g.fillText('DAVANTI  TG 46', 200, 620); g.fillText('MANICA  TG 46', 600, 620);
      g.restore();
    },
    /* archi concentrici e la testa di taglio che lascia la scia */
    taglio: function (g, w, h, t) {
      var cx = w * 0.72, cy = h * 0.55;
      for (var r = 30; r < Math.max(w, h) * 1.1; r += 26) {
        g.strokeStyle = 'rgba(120,140,255,' + (0.05 + 0.08 * Math.sin(r * 0.05 - t * 1.4) ** 2) + ')'; g.lineWidth = 1;
        g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
      }
      var punto = function (u) { return [w * 0.08 + u * w * 0.84, h * 0.5 + Math.sin(u * 9) * h * 0.22 + Math.sin(u * 23) * h * 0.04]; };
      var testa = (t * 0.16) % 1;
      g.lineWidth = 1.6; g.lineCap = 'round';
      for (var i = 0; i < 70; i++) {
        var u0 = testa - i * 0.004, u1 = u0 - 0.004; if (u1 < 0) break;
        var a = punto(u0), b = punto(u1);
        g.strokeStyle = 'rgba(235,240,255,' + (1 - i / 70) + ')';
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      }
      var p = punto(testa);
      g.strokeStyle = '#fff'; g.lineWidth = 1.2;
      g.beginPath(); g.arc(p[0], p[1], 11, 0, Math.PI * 2); g.moveTo(p[0] - 20, p[1]); g.lineTo(p[0] - 6, p[1]); g.moveTo(p[0] + 6, p[1]); g.lineTo(p[0] + 20, p[1]);
      g.moveTo(p[0], p[1] - 20); g.lineTo(p[0], p[1] - 6); g.moveTo(p[0], p[1] + 6); g.lineTo(p[0], p[1] + 20); g.stroke();
    },
    /* cuciture che corrono */
    confezione: function (g, w, h, t) {
      for (var k = 0; k < 7; k++) {
        var y0 = h * (0.15 + k * 0.12);
        g.beginPath();
        for (var x = 0; x <= w; x += 8) {
          var y = y0 + Math.sin(x * 0.008 + k * 0.7 + t * 0.4) * 18;
          if (x === 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
        g.strokeStyle = 'rgba(80,100,240,.25)'; g.lineWidth = 10; g.setLineDash([]); g.stroke();
        g.strokeStyle = 'rgba(230,234,255,' + (0.35 + k * 0.07) + ')'; g.lineWidth = 1.3;
        g.setLineDash([9, 7]); g.lineDashOffset = -t * (30 + k * 6); g.stroke();
      }
      g.setLineDash([]);
    },
  };
  function accesi() {
    var carte = tutti('[data-acceso]');
    if (!carte.length) return;
    var dpr = Math.min(devicePixelRatio || 1, 2);
    var vive = carte.map(function (c) {
      var cv = c.querySelector('canvas'), g = cv.getContext('2d');
      var v = { c: c, cv: cv, g: g, arte: ARTE[cv.getAttribute('data-arte')], w: 0, h: 0, vista: false, veloce: 1, t: Math.random() * 10 };
      v.misura = function () { v.w = cv.clientWidth; v.h = cv.clientHeight; cv.width = v.w * dpr; cv.height = v.h * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
      v.misura();
      c.addEventListener('pointerenter', function () { gsap.to(v, { veloce: 2.6, duration: 0.6 }); });
      c.addEventListener('pointerleave', function () { gsap.to(v, { veloce: 1, duration: 0.8 }); });
      return v;
    });
    addEventListener('resize', function () { vive.forEach(function (v) { v.misura(); }); });
    var oss = new IntersectionObserver(function (es) {
      es.forEach(function (e) { vive.forEach(function (v) { if (v.c === e.target) v.vista = e.isIntersecting; }); });
    });
    vive.forEach(function (v) { oss.observe(v.c); });
    var disegna = function (v, dt) {
      v.t += dt * v.veloce;
      v.g.clearRect(0, 0, v.w, v.h);
      if (v.arte) v.arte(v.g, v.w, v.h, v.t);
    };
    if (ridotto) { vive.forEach(function (v) { disegna(v, 0); }); return; }
    gsap.ticker.add(function (t, dt) { vive.forEach(function (v) { if (v.vista) disegna(v, dt / 1000); }); });

    /* l'accensione: spenta e grigia, poi viva, legata allo scroll */
    carte.forEach(function (c) {
      var tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: c, start: 'top 92%', end: 'top 42%', scrub: 0.5 } });
      tl.fromTo(c, { scale: 0.94, backgroundColor: '#1a1d33' }, { scale: 1, backgroundColor: '#0b0e26', duration: 1 }, 0)
        .to(c.querySelector('.acceso-luce'), { opacity: 1, duration: 0.7 }, 0.3)
        .to(c.querySelector('.acceso-arte'), { opacity: 1, duration: 0.6 }, 0.35)
        .to(c.querySelector('.acceso-nome'), { color: '#ffffff', duration: 0.5 }, 0.3)
        .fromTo(c.querySelectorAll('.acceso-breve, .acceso-scopri'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }, 0.55)
        .fromTo(c.querySelector('.acceso-tag'), { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.4 }, 0.6);
    });
  }

  /* ---------- parco macchine: le carte scorrono di lato ---------- */
  function sguardo() {
    var sez = document.querySelector('[data-sguardo]');
    if (!sez) return;
    var b = sez.querySelector('[data-sguardo-binario]');
    var carte = tutti('.sguardo-carta', b);
    if (ridotto) { sez.querySelector('.sguardo-palco').style.overflowX = 'auto'; return; }
    var distanza = function () { return Math.max(0, b.scrollWidth - innerWidth); };
    var corsa = gsap.to(b, {
      x: function () { return -distanza(); }, ease: 'none',
      scrollTrigger: { trigger: sez, start: 'top top', end: function () { return '+=' + Math.round(distanza() * 1.1); }, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true },
    });
    carte.forEach(function (c, i) {
      gsap.fromTo(c, { yPercent: i % 2 ? 14 : -10, rotation: i % 2 ? 3 : -3, scale: 0.9 }, {
        yPercent: 0, rotation: 0, scale: 1, ease: 'none',
        scrollTrigger: { trigger: c, containerAnimation: corsa, start: 'left right', end: 'left 55%', scrub: true },
      });
      var im = c.querySelector('img');
      if (im) gsap.fromTo(im, { xPercent: 7 }, { xPercent: -7, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: corsa, start: 'left right', end: 'right left', scrub: true } });
      var n = c.querySelector('[data-conta-lato]');
      if (n) {
        var fine = parseFloat(n.getAttribute('data-conta-lato')), o = { v: 0 };
        n.textContent = '0';
        gsap.to(o, { v: fine, duration: 1.6, ease: 'morbida', onUpdate: function () { n.textContent = String(Math.round(o.v)); }, scrollTrigger: { trigger: c, containerAnimation: corsa, start: 'left 80%' } });
      }
    });
  }

  /* ---------- dentro il laboratorio: le foto passano nel mirino ---------- */
  function mirino() {
    var sez = document.querySelector('[data-mirino]');
    if (!sez) return;
    var col = sez.querySelector('[data-mirino-colonna]');
    var cornice = sez.querySelector('.mirino-cornice');
    var foto = tutti('[data-mirino-foto]', sez);
    var nomi = tutti('[data-mirino-nome]', sez);
    var reparti = tutti('[data-mirino-reparto]', sez);
    var n = foto.length;
    var fw, fh, sw, sh, passo, extra, obiettivo = 0, ora = 0, attivo = -1, vista = false, tel = false;
    var misura = function () {
      var w = innerWidth, h = innerHeight; tel = w < 760;
      fw = Math.min(w * (tel ? 0.78 : 0.32), h * (tel ? 0.36 : 0.46) * 4 / 3);
      fh = fw * 0.75;
      sw = fw * (tel ? 0.34 : 0.36); sh = sw * 0.75;
      passo = sh + 14;
      extra = (fh - sh) / 2 + 14;
      col.style.width = sw + 'px'; col.style.marginLeft = (-sw / 2) + 'px';
      foto.forEach(function (f) { f.style.top = (-sh / 2) + 'px'; });
      cornice.style.setProperty('--mc-w', fw + 'px'); cornice.style.setProperty('--mc-h', fh + 'px');
    };
    misura(); addEventListener('resize', misura);
    var segna = function (k) {
      if (k === attivo) return;
      attivo = k;
      nomi.forEach(function (x, i) { x.classList.toggle('attiva', i === k); });
      reparti.forEach(function (x, i) { gsap.to(x, { opacity: i === k ? 1 : 0, y: i === k ? 0 : (i < k ? -10 : 10), duration: 0.4, overwrite: true }); });
    };
    var disegna = function () {
      ora += (obiettivo - ora) * (ridotto ? 1 : 0.12);
      var off = ora * (n - 1) * passo;
      for (var i = 0; i < n; i++) {
        var rel = i * passo - off, d = Math.abs(rel);
        var f = Math.max(0, 1 - d / passo); f = f * f * (3 - 2 * f);
        var y = rel + (rel < 0 ? -1 : 1) * extra * Math.min(1, d / passo);
        var sc = 1 + (fw / sw - 1) * f;
        foto[i].style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0) scale(' + sc.toFixed(3) + ')';
        foto[i].style.filter = 'grayscale(' + (1 - f).toFixed(2) + ') brightness(' + (0.5 + 0.5 * f).toFixed(2) + ')';
        foto[i].style.zIndex = f > 0.5 ? 2 : 1;
        foto[i].style.opacity = Math.max(0, 1 - Math.max(0, d - passo) / (passo * (tel ? 1.4 : 3.2))).toFixed(2);
      }
      segna(Math.round(off / passo));
    };
    new IntersectionObserver(function (v) { vista = v[0].isIntersecting; }).observe(sez);
    disegna();
    if (ridotto) return;
    ScrollTrigger.create({
      trigger: sez, start: 'top top', end: function () { return '+=' + Math.round(innerHeight * n * 0.42); },
      pin: true, anticipatePin: 1, onUpdate: function (st) { obiettivo = st.progress; },
    });
    gsap.from(cornice.querySelectorAll('i'), { scale: 0, opacity: 0, duration: 1, ease: 'back.out(2)', stagger: 0.06, scrollTrigger: { trigger: sez, start: 'top 60%' } });
    gsap.ticker.add(function () { if (vista) disegna(); });
  }

  /* ---------- ultime novità: le vetrine si coprono una con l'altra ---------- */
  function vetrine() {
    var v = tutti('[data-vetrina]');
    if (!v.length || ridotto) return;
    v.forEach(function (el, i) {
      var carta = el.querySelector('.vetrina-carta');
      var im = el.querySelector('.vetrina-foto img');
      var titolo = el.querySelector('.vetrina-titolo');
      gsap.fromTo(im, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: true } });
      SplitText.create(titolo, { type: 'words', mask: 'words', autoSplit: true, onSplit: function (self) {
        return gsap.from(self.words, { yPercent: 110, duration: 1.2, ease: 'uscita', stagger: 0.06, scrollTrigger: { trigger: el, start: 'top 45%' } });
      } });
      var dopo = v[i + 1];
      if (dopo) gsap.to(carta, { scale: 0.88, opacity: 0.35, borderRadius: 48, ease: 'none', scrollTrigger: { trigger: dopo, start: 'top bottom', end: 'top top', scrub: true } });
    });
  }

  /* ---------- dentro il laboratorio: le foto come i fili di un ordito ---------- */
  function ordito() {
    var sez = document.querySelector('[data-ordito]');
    if (!sez) return;
    var scena = sez.querySelector('[data-ordito-scena]');
    var fila = sez.querySelector('[data-ordito-fila]');
    var fili = tutti('[data-filo]', sez);
    var nome = sez.querySelector('[data-ordito-nome]');
    var reparto = sez.querySelector('[data-ordito-reparto]');
    var tacche = sez.querySelector('[data-tacche]');
    var ago = sez.querySelector('[data-ago]');
    var n = fili.length;
    for (var c = 0; c <= n; c++) { var sp = document.createElement('span'); sp.style.left = (c / n * 100) + '%'; sp.textContent = c * 10; tacche.appendChild(sp); }
    var base, grande, gap, W, larghi = fili.map(function () { return 0; });
    var fuoco = 0, fuocoScroll = 0, tira = 0, spinta = 0, sopra = -1, preso = false, ultimoX = 0, vel = 0, xPrima = 0, attivo = -1, vista = false;
    var misura = function () {
      W = innerWidth;
      var tel = W < 760;
      base = tel ? Math.max(14, W * 0.042) : Math.min(W * 0.034, 54);
      grande = tel ? W * 0.62 : Math.min(W * 0.3, innerHeight * 0.46 * 1.3);
      gap = tel ? 5 : 8;
      sez.style.setProperty('--grande', grande + 'px');
      sez.style.setProperty('--gap-filo', gap + 'px');
    };
    misura(); addEventListener('resize', misura);
    var mostra = function (k) {
      if (k === attivo) return;
      attivo = k;
      var f = fili[k];
      var cambia = function () { nome.textContent = f.getAttribute('data-nome'); reparto.textContent = f.getAttribute('data-reparto'); };
      if (ridotto) { cambia(); return; }
      gsap.timeline().to([nome, reparto], { y: -10, autoAlpha: 0, duration: 0.16, ease: 'power2.in' }).add(cambia).to([nome, reparto], { y: 0, autoAlpha: 1, duration: 0.4, ease: 'power3.out', stagger: 0.05 });
    };
    fili.forEach(function (f, i) {
      f.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && !preso) sopra = i; });
      f.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && sopra === i) sopra = -1; });
    });
    scena.addEventListener('pointerdown', function (e) { preso = true; ultimoX = e.clientX; spinta = 0; sopra = -1; scena.setPointerCapture(e.pointerId); });
    scena.addEventListener('pointermove', function (e) { if (!preso) return; var d = e.clientX - ultimoX; ultimoX = e.clientX; spinta = -d / (base + gap) * 0.9; tira += spinta; });
    var lascia = function () { preso = false; };
    scena.addEventListener('pointerup', lascia); scena.addEventListener('pointercancel', lascia);
    new IntersectionObserver(function (v) { vista = v[0].isIntersecting; }).observe(sez);
    var disegna = function () {
      if (!preso) { spinta *= 0.92; tira += spinta; }
      var obiettivo = gsap.utils.clamp(0, n - 1, fuocoScroll * (n - 1) + tira);
      if (obiettivo !== fuocoScroll * (n - 1) + tira) tira = obiettivo - fuocoScroll * (n - 1);
      fuoco += (obiettivo - fuoco) * (ridotto ? 1 : 0.1);
      var centro = sopra >= 0 ? sopra : Math.round(fuoco);
      var pos = 0, centri = [];
      for (var i = 0; i < n; i++) {
        var meta = sopra >= 0 ? (i === sopra ? 1 : 0) : Math.max(0, 1 - Math.abs(i - fuoco));
        larghi[i] += ((base + (grande - base) * meta) - larghi[i]) * (ridotto ? 1 : 0.14);
        centri.push(pos + larghi[i] / 2);
        pos += larghi[i] + gap;
      }
      var a = Math.floor(fuoco), b = Math.min(n - 1, a + 1), t = fuoco - a;
      var x = W / 2 - (centri[a] * (1 - t) + centri[b] * t);
      vel += ((x - xPrima) - vel) * 0.2; xPrima = x;
      var piega = gsap.utils.clamp(-28, 28, vel * 1.6);
      fila.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      for (var j = 0; j < n; j++) {
        var luce = Math.min(1, Math.max(0, (larghi[j] - base) / (grande - base)));
        fili[j].style.width = larghi[j].toFixed(1) + 'px';
        fili[j].style.filter = 'grayscale(' + (1 - luce).toFixed(2) + ') brightness(' + (0.5 + 0.5 * luce).toFixed(2) + ')';
        fili[j].style.setProperty('--ombra', (1 - luce).toFixed(2));
        fili[j].style.transform = 'rotateY(' + (piega * (1 - luce)).toFixed(2) + 'deg)';
      }
      ago.style.transform = 'translate3d(' + (fuoco / (n - 1) * (tacche.clientWidth - 2)).toFixed(1) + 'px,0,0)';
      mostra(centro);
    };
    disegna();
    if (ridotto) return;
    ScrollTrigger.create({
      trigger: sez, start: 'top top', end: function () { return '+=' + Math.round(innerHeight * n * 0.32); },
      pin: true, anticipatePin: 1, onUpdate: function (st) { fuocoScroll = st.progress; },
    });
    gsap.fromTo(fila, { clipPath: 'inset(50% 0% 50% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'tenda', scrollTrigger: { trigger: sez, start: 'top 65%' } });
    gsap.ticker.add(function () { if (vista) disegna(); });
  }

  /* ---------- dentro il laboratorio: la parola si apre sulla foto, poi il laser taglia ---------- */
  function lente() {
    var sez = document.querySelector('[data-lente]');
    if (!sez) return;
    var palco = sez.querySelector('.lente-palco');
    var svg = sez.querySelector('[data-maschera]');
    var parola = svg.querySelector('.lente-parola');
    var pieno = svg.querySelector('.lente-pieno'), notte = svg.querySelector('.lente-notte');
    var strati = tutti('[data-strato]', sez);
    var laser = sez.querySelector('[data-laser]');
    var velo = sez.querySelector('.lente-velo');
    var nome = sez.querySelector('[data-lente-nome]'), reparto = sez.querySelector('[data-lente-reparto]');
    var aiuto = sez.querySelector('[data-lente-aiuto]');
    var W = 0, H = 0, attivo = -1, scala = 40;
    var misura = function () {
      W = palco.clientWidth; H = palco.clientHeight;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      [pieno, notte].forEach(function (r) { r.setAttribute('width', W); r.setAttribute('height', H); });
      parola.setAttribute('x', W / 2); parola.setAttribute('y', H * 0.5);
      var fs = W * 0.15; parola.setAttribute('font-size', fs);
      var l = parola.getComputedTextLength() || W;
      fs = fs * (W * 0.92 / l); parola.setAttribute('font-size', fs);
      var e = parola.getExtentOfChar(9);
      var cx = e.x + e.width / 2, cy = e.y + e.height * 0.52;
      svg.style.transformOrigin = cx + 'px ' + cy + 'px';
      scala = Math.max(W, H) / Math.max(4, e.width * 0.22) * 1.8;
    };
    misura();
    var mostra = function (k) {
      if (k === attivo) return;
      attivo = k;
      var f = strati[k];
      var cambia = function () { nome.textContent = f.getAttribute('data-nome'); reparto.textContent = f.getAttribute('data-reparto'); };
      if (ridotto) { cambia(); return; }
      gsap.timeline().to([nome, reparto], { y: -14, autoAlpha: 0, duration: 0.18, ease: 'power2.in' }).add(cambia).to([nome, reparto], { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', stagger: 0.06 });
    };
    if (ridotto) {
      gsap.set(svg, { autoAlpha: 0 }); gsap.set(velo, { opacity: 1 }); gsap.set(aiuto, { autoAlpha: 0 });
      mostra(0); return;
    }
    gsap.set([nome, reparto], { autoAlpha: 0 });
    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sez, start: 'top top', end: function () { return '+=' + Math.round(innerHeight * 3.6); },
        pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
        onRefresh: misura,
        onUpdate: function () {
          var t = tl.time();
          if (t < 1) { if (attivo !== -1) { attivo = -1; gsap.to([nome, reparto], { autoAlpha: 0, duration: 0.2 }); } return; }
          mostra(t < 1.75 ? 0 : t < 2.95 ? 1 : 2);
        },
      },
    });
    tl.to(aiuto, { autoAlpha: 0, duration: 0.15 }, 0)
      .fromTo(svg, { scale: 1 }, { scale: function () { return scala; }, duration: 1, ease: 'power3.in' }, 0)
      .fromTo(strati[0].querySelector('img'), { scale: 1.4 }, { scale: 1.05, duration: 1.1, ease: 'power2.out' }, 0)
      .to(svg, { autoAlpha: 0, duration: 0.18 }, 0.84)
      .to(velo, { opacity: 1, duration: 0.25 }, 0.9);
    for (var k = 1; k < strati.length; k++) {
      (function (k) {
        var at = 1.3 + (k - 1) * 1.2, o = { p: 0 }, s = strati[k], im = s.querySelector('img');
        tl.set(laser, { opacity: 1 }, at)
          .to(o, {
            p: 1, duration: 0.9, ease: 'power1.inOut',
            onUpdate: function () {
              var x = (1 - o.p) * 100;
              s.style.clipPath = 'inset(0% 0% 0% ' + x.toFixed(2) + '%)';
              laser.style.transform = 'translate3d(' + (W * (1 - o.p)).toFixed(1) + 'px,0,0)';
              laser.style.opacity = o.p > 0.98 ? 0 : 1;
            },
          }, at)
          .fromTo(im, { scale: 1.25, xPercent: 6 }, { scale: 1.05, xPercent: 0, duration: 1.1, ease: 'power2.out' }, at)
          .to(strati[k - 1].querySelector('img'), { scale: 1.12, xPercent: -4, duration: 0.9 }, at)
          .set(laser, { opacity: 0 }, at + 0.92);
      })(k);
    }
    tl.to({}, { duration: 0.4 });
    addEventListener('resize', misura);
  }

  /* ---------- dentro il laboratorio: due colonne che scorrono a velocità diverse ---------- */
  function colonne() {
    var sez = document.querySelector('[data-colonne]');
    if (!sez || ridotto) return;
    var cols = tutti('[data-colonna]', sez);
    if (cols[0]) gsap.fromTo(cols[0], { y: 60 }, { y: -60, ease: 'none', scrollTrigger: { trigger: sez, start: 'top bottom', end: 'bottom top', scrub: true } });
    if (cols[1]) gsap.fromTo(cols[1], { y: 160 }, { y: -220, ease: 'none', scrollTrigger: { trigger: sez, start: 'top bottom', end: 'bottom top', scrub: true } });
    tutti('[data-colonne-carta]', sez).forEach(function (c) {
      var f = c.querySelector('.colonne-foto'), im = f.querySelector('img');
      gsap.timeline({ scrollTrigger: { trigger: c, start: 'top 90%' } })
        .fromTo(f, { clipPath: 'inset(100% 0% 0% 0% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.5, ease: 'tenda' })
        .fromTo(im, { scale: 1.35 }, { scale: 1, duration: 1.9, ease: 'uscita' }, 0)
        .from(c.querySelectorAll('.colonne-rep, .colonne-riga'), { y: 18, autoAlpha: 0, duration: 1, ease: 'uscita', stagger: 0.08 }, 0.4);
      gsap.fromTo(im, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------- la bobina del laboratorio ---------- */
  function bobina() {
    var sez = document.querySelector('[data-bobina]');
    if (!sez) return;
    var scena = sez.querySelector('[data-bobina-scena]');
    var rullo = sez.querySelector('[data-rullo]');
    var pannelli = tutti('[data-pannello]', sez);
    var dida = sez.querySelector('[data-dida]');
    var n = pannelli.length, passo = 360 / n;
    var raggio = 0, giro = 0, trascina = 0, spinta = 0, preso = false, ultimoX = 0, davanti = -1, vista = false, scroll = 0;
    var misura = function () {
      var w = scena.clientWidth, h = scena.clientHeight;
      var largo = Math.min(w * (w < 760 ? 0.52 : 0.27), h * 0.74);
      sez.style.setProperty('--pannello', largo + 'px');
      raggio = (largo * 1.12) / (2 * Math.tan(Math.PI / n));
      pannelli.forEach(function (p, i) { p.style.transform = 'rotateY(' + i * passo + 'deg) translateZ(' + raggio + 'px)'; });
    };
    misura(); addEventListener('resize', misura);
    new IntersectionObserver(function (v) { vista = v[0].isIntersecting; }).observe(sez);
    scena.addEventListener('pointerdown', function (e) { preso = true; ultimoX = e.clientX; spinta = 0; scena.setPointerCapture(e.pointerId); });
    scena.addEventListener('pointermove', function (e) { if (!preso) return; var d = e.clientX - ultimoX; ultimoX = e.clientX; spinta = d * 0.18; trascina += spinta; });
    var lascia = function () { preso = false; };
    scena.addEventListener('pointerup', lascia); scena.addEventListener('pointercancel', lascia);
    if (!ridotto) {
      ScrollTrigger.create({
        trigger: sez, start: 'top top', end: function () { return '+=' + Math.round(innerHeight * 2.2); },
        pin: true, scrub: true, anticipatePin: 1,
        onUpdate: function (st) { scroll = -st.progress * 324; },
      });
      gsap.from(scena, { autoAlpha: 0, scale: 0.85, duration: 1.6, ease: 'uscita', scrollTrigger: { trigger: sez, start: 'top 70%' } });
    }
    var disegna = function () {
      if (!preso) { spinta *= 0.94; trascina += spinta; }
      var obiettivo = scroll + trascina;
      giro += (obiettivo - giro) * (ridotto ? 1 : 0.09);
      var inclina = gsap.utils.clamp(-10, 10, spinta * 1.5);
      rullo.style.transform = 'translateZ(' + (-raggio) + 'px) rotateX(-7deg) rotateY(' + giro + 'deg) rotateZ(' + (inclina * 0.15) + 'deg)';
      var migliore = 0, mc = -2;
      for (var i = 0; i < n; i++) {
        var a = ((i * passo + giro) % 360) * Math.PI / 180;
        var c = Math.cos(a);
        pannelli[i].style.setProperty('--buio', (0.82 - Math.max(0, c) * 0.82).toFixed(3));
        if (c > mc) { mc = c; migliore = i; }
      }
      if (migliore !== davanti) {
        davanti = migliore;
        var t = pannelli[migliore].querySelector('figcaption').textContent;
        if (ridotto) dida.textContent = t;
        else gsap.timeline().to(dida, { autoAlpha: 0, y: -8, duration: 0.18 }).add(function () { dida.textContent = t; }).to(dida, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' });
      }
    };
    disegna();
    gsap.ticker.add(function () { if (vista) disegna(); });
  }

  /* ---------- l'eroe col tessuto ---------- */
  function eroe() {
    var sez = document.querySelector('[data-eroe]');
    if (!sez) return null;
    var carta = sez.querySelector('[data-eroe-carta]');
    var sopra = sez.querySelector('.eroe-sopra');
    var dietro = sez.querySelector('.eroe-dietro');
    var dato = sez.querySelector('.eroe-laser-dato');
    var cut = sez.querySelector('[data-cut]');
    var righe = tutti('.eroe-titolo .riga-dentro', sez);
    var basso = tutti('.eroe-basso > *, .eroe-luogo', sez);

    if (ridotto) {
      gsap.set(righe, { y: 0, yPercent: 0 });
      gsap.set(dietro, { autoAlpha: 0 });
      stato.entrata = 1;
      return function () {};
    }

    gsap.set(dietro, { autoAlpha: 0, scale: 0.9 });
    var proxy = { taglio: 0, apertura: 0 };
    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sez, start: 'top top', end: function () { return '+=' + Math.round(innerHeight * 2.2); },
        pin: true, scrub: 0.6, anticipatePin: 1,
        onUpdate: function (s) { stato.velocita = s.getVelocity() / 10000; },
      },
      onUpdate: function () {
        stato.taglio = proxy.taglio; stato.apertura = proxy.apertura;
        cut.textContent = Math.round(proxy.taglio * 100) + '%';
      },
    });
    tl.to(sopra, { autoAlpha: 0, y: -60, duration: 0.14 }, 0.02)
      .to(dato, { autoAlpha: 1, duration: 0.06 }, 0.08)
      .to(proxy, { taglio: 1, duration: 0.44 }, 0.1)
      .to(dato, { autoAlpha: 0, duration: 0.06 }, 0.56)
      .to(proxy, { apertura: 1, duration: 0.32, ease: 'power1.inOut' }, 0.58)
      .to(dietro, { autoAlpha: 1, scale: 1, duration: 0.26, ease: 'power2.out' }, 0.66)
      .to('.eroe-velo', { opacity: 0.4, duration: 0.3 }, 0.6)
      .to({}, { duration: 0.08 }, 0.92);

    /* entrata: la pezza scende sulla barra e il titolo sale */
    return function () {
      gsap.to(stato, { entrata: 1, duration: 2.4, ease: 'power3.out' });
      gsap.fromTo(righe, { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.5, ease: 'uscita', stagger: 0.1, delay: 0.5 });
      gsap.from(basso, { y: 20, autoAlpha: 0, duration: 1.2, ease: 'uscita', stagger: 0.08, delay: 0.8 });
      gsap.fromTo(carta, { scale: 0.94, borderRadius: 60 }, { scale: 1, borderRadius: getComputedStyle(carta).borderRadius, duration: 1.8, ease: 'uscita' });
    };
  }

  /* ---------- apertura delle pagine interne ---------- */
  function apertura() {
    var tl = gsap.timeline({ paused: true });
    var righe = tutti('.apertura-titolo .riga-dentro');
    var foto = fotoGrande();
    if (ridotto) { gsap.set(righe, { y: 0, yPercent: 0 }); return tl; }
    if (righe.length) tl.fromTo(righe, { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.4, ease: 'uscita', stagger: 0.09 }, 0);
    var tag = tutti('.apertura-tag li, .indietro');
    if (tag.length) tl.from(tag, { y: 14, autoAlpha: 0, duration: 0.9, ease: 'uscita', stagger: 0.05 }, 0.3);
    if (foto) foto(tl, 0.2);
    return tl;
  }

  /* ---------- caricamento della prima visita ---------- */
  function caricamento(poi) {
    var c = document.querySelector('[data-carica]');
    if (!c || getComputedStyle(c).display === 'none' || ridotto) { if (c) c.style.display = 'none'; poi(); return; }
    memoria.scrivi('devid-visto', '1');
    var barra = c.querySelector('.carica-barra i');
    var conta = c.querySelector('[data-conta-carica]');
    var o = { v: 0 };
    var inizio = performance.now();
    var tl = gsap.timeline({ paused: true });
    tl.to(o, { v: 100, duration: 2, ease: 'morbida', onUpdate: function () { conta.textContent = String(Math.round(o.v)); barra.style.transform = 'scaleX(' + o.v / 100 + ')'; } })
      .to([conta, c.querySelector('.carica-logo')], { yPercent: -40, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, '+=0.1')
      .to(c.querySelector('.carica-barra'), { scaleX: 0, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, '<')
      .add(poi, '-=0.05')
      .to(c, { clipPath: 'inset(0% 0% 100% 0% round 0px 0px 60px 60px)', duration: 1.1, ease: 'tenda' }, '-=0.1')
      .set(c, { display: 'none' });
    var logo = c.querySelector('.carica-logo');
    if (logo) tl.fromTo(logo, { clipPath: 'inset(0% 100% 0% 0%)', x: -10 }, { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: 1.4, ease: 'uscita' }, 0);
    gsap.set(c, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)' });
    var parti = function () { tl.play(); };
    /* aspetta il tessuto, ma mai più di tre secondi */
    var attesa = setInterval(function () {
      if (stato.pronto || performance.now() - inizio > 3000) { clearInterval(attesa); parti(); }
    }, 60);
  }

  /* ---------- avvio ---------- */
  function avvio() {
    var home = corpo.classList.contains('pagina-home');
    var entra = home ? eroe() : null;
    var intro = home ? null : apertura();
    accesi(); sguardo(); colonne(); vetrine(); bobina(); comparse(); nastro(); galleria(); cursore(); magneti(); trama();
    ScrollTrigger.sort(); ScrollTrigger.refresh();
    tutti('[data-su]').forEach(function (b) { b.addEventListener('click', function () { if (lenis) lenis.scrollTo(0, { duration: 2 }); else scrollTo(0, 0); }); });

    var parti = function () { if (entra) entra(); if (intro) intro.play(); riparti(); };
    var arrivo = html.classList.contains('arrivo');
    var titolo = memoria.leggi('devid-tenda');
    memoria.togli('devid-tenda');
    html.classList.remove('arrivo');

    if (arrivo && tenda && !ridotto) {
      tendaTitolo.textContent = titolo || '';
      gsap.set(tenda, { visibility: 'visible' });
      gsap.timeline()
        .to(tendaTitolo, { yPercent: -120, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 0.05)
        .to(pannello, { clipPath: 'inset(0% 0% 100% 0% round 0px 0px 40px 40px)', duration: 0.95, ease: 'tenda' }, 0.2)
        .add(parti, 0.4)
        .set(tenda, { visibility: 'hidden' });
    } else if (home) {
      caricamento(parti);
    } else {
      parti();
    }
  }

  var partito = false;
  var via = function () { if (!partito) { partito = true; avvio(); } };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(via);
  setTimeout(via, 1200);
  addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
