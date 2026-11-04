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
    var lettere = tutti('[data-marchio-grande] span');
    if (lettere.length) gsap.from(lettere, { yPercent: 100, duration: 1.4, ease: 'uscita', stagger: 0.06, scrollTrigger: { trigger: '[data-marchio-grande]', start: 'top 95%' } });
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

  /* ---------- il campionario che si sfoglia ---------- */
  function dentella(el) {
    /* il bordo tagliato con la forbice dentellata */
    var w = el.offsetWidth, h = el.offsetHeight;
    if (!w || !h) return;
    var d = 7, passo = 14, p = [];
    var nx = Math.max(4, Math.round(w / passo)), ny = Math.max(4, Math.round(h / passo));
    var sx = w / nx, sy = h / ny, i;
    for (i = 0; i <= nx; i++) p.push((i * sx).toFixed(1) + 'px ' + (i % 2 ? d : 0) + 'px');
    for (i = 0; i <= ny; i++) p.push((w - (i % 2 ? d : 0)).toFixed(1) + 'px ' + (i * sy).toFixed(1) + 'px');
    for (i = nx; i >= 0; i--) p.push((i * sx).toFixed(1) + 'px ' + (h - (i % 2 ? d : 0)).toFixed(1) + 'px');
    for (i = ny; i >= 0; i--) p.push((i % 2 ? d : 0) + 'px ' + (i * sy).toFixed(1) + 'px');
    el.style.clipPath = 'polygon(' + p.join(',') + ')';
  }
  function mazzetta() {
    var sez = document.querySelector('[data-mazzetta]');
    if (!sez) return;
    var campioni = tutti('[data-campione]', sez);
    var voci = tutti('[data-voce]', sez);
    var tacche = tutti('[data-tacca]', sez);
    var n = campioni.length;
    var taglia = function () { campioni.forEach(dentella); };
    taglia(); addEventListener('resize', taglia);
    var posto = function (k) { return { y: k * 12, scale: 1 - k * 0.04, rotation: k === 0 ? 0 : (k % 2 ? 2.2 : -1.8), x: k === 0 ? 0 : (k % 2 ? 6 : -6) }; };
    campioni.forEach(function (c, i) {
      gsap.set(c, Object.assign({ transformPerspective: 1600 }, posto(i)));
      gsap.set(c.querySelector('.campione-ombra'), { opacity: Math.min(0.55, i * 0.16) });
    });
    var segna = function (k) {
      tacche.forEach(function (t, i) { t.classList.toggle('attiva', i === k); });
      voci.forEach(function (v, i) {
        v.setAttribute('aria-hidden', i === k ? 'false' : 'true');
        var a = v.querySelector('a'); if (a) a.tabIndex = i === k ? 0 : -1;
      });
    };
    segna(0);
    if (ridotto) return;
    gsap.set(voci.slice(1), { autoAlpha: 0, y: 40 });
    var ultimo = 0;
    var tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: sez, start: 'top top', end: function () { return '+=' + Math.round(innerHeight * (n - 1) * 0.85); },
        pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (st) {
          var k = Math.min(n - 1, Math.round(st.progress * (n - 1) + 0.0001));
          if (k !== ultimo) { ultimo = k; segna(k); }
        },
      },
    });
    for (var i = 0; i < n - 1; i++) {
      var c = campioni[i];
      tl.to(c, { rotationX: 172, y: -30, duration: 1, ease: 'power2.in' }, i)
        .to(c.querySelector('.campione-ombra'), { opacity: 0.75, duration: 1, ease: 'power1.in' }, i)
        .set(c, { autoAlpha: 0 }, i + 1);
      for (var k = i + 1; k < n; k++) {
        tl.to(campioni[k], Object.assign({ duration: 0.8, ease: 'back.out(1.4)' }, posto(k - i - 1)), i + 0.25)
          .to(campioni[k].querySelector('.campione-ombra'), { opacity: Math.min(0.55, (k - i - 1) * 0.16), duration: 0.8 }, i + 0.25);
      }
      tl.to(voci[i], { autoAlpha: 0, y: -40, duration: 0.4, ease: 'power2.in' }, i + 0.1)
        .to(voci[i + 1], { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' }, i + 0.5);
    }
    tl.to({}, { duration: 0.35 });
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
      .to([conta, c.querySelector('.carica-nome')], { yPercent: -40, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, '+=0.1')
      .to(c.querySelector('.carica-barra'), { scaleX: 0, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, '<')
      .add(poi, '-=0.05')
      .to(c, { clipPath: 'inset(0% 0% 100% 0% round 0px 0px 60px 60px)', duration: 1.1, ease: 'tenda' }, '-=0.1')
      .set(c, { display: 'none' });
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
    mazzetta(); bobina(); comparse(); nastro(); galleria(); cursore(); magneti(); trama();
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
