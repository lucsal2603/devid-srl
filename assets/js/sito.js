/* Devid srl: movimento del sito. GSAP 3 + ScrollTrigger + SplitText + ScrambleText + Lenis. */
(function () {
  'use strict';
  var html = document.documentElement;
  var corpo = document.body;
  window.devidPronto = true;
  if (!window.gsap || !window.ScrollTrigger) { html.classList.remove('js'); return; }

  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase);
  CustomEase.create('uscita', '0.16,1,0.3,1');
  CustomEase.create('tenda', '0.76,0,0.24,1');
  CustomEase.create('morbida', '0.65,0,0.35,1');
  ScrollTrigger.config({ ignoreMobileResize: true });

  var ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tocco = matchMedia('(hover: none)').matches;
  var telefono = matchMedia('(max-width: 760px)');
  var CARATTERI = 'ABCDEFGHIKLMNOPRSTUVZ0123456789<>/[]=+#';
  if (ridotto) html.classList.add('ridotto');

  var memoria = {
    leggi: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    scrivi: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    togli: function (k) { try { sessionStorage.removeItem(k); } catch (e) {} },
  };

  /* ---------- scorrimento morbido ---------- */
  var lenis = null;
  if (!ridotto && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  var ferma = function () { if (lenis) lenis.stop(); };
  var riparti = function () { if (lenis) lenis.start(); };
  if (lenis) lenis.stop();

  var tutti = function (sel, dove) { return Array.prototype.slice.call((dove || document).querySelectorAll(sel)); };
  var anno = tutti('[data-anno]');
  anno.forEach(function (a) { a.textContent = String(new Date().getFullYear()); });

  /* ---------- testo che gira al passaggio ---------- */
  tutti('[data-gira]').forEach(function (el) {
    var t = el.textContent;
    el.textContent = '';
    var a = document.createElement('span'); a.className = 'gira-a'; a.textContent = t;
    var b = document.createElement('span'); b.className = 'gira-b'; b.textContent = t; b.setAttribute('aria-hidden', 'true');
    el.appendChild(a); el.appendChild(b);
  });

  /* ---------- testata: si nasconde scendendo, cambia colore sulle parti scure ---------- */
  var testata = document.querySelector('[data-testata]');
  var scure = new Set();
  tutti('[data-tema="scuro"]').forEach(function (sez) {
    ScrollTrigger.create({
      trigger: sez, start: 'top 34px', end: 'bottom 34px',
      onToggle: function (s) { if (s.isActive) scure.add(sez); else scure.delete(sez); testata.classList.toggle('su-scuro', scure.size > 0 || menuAperto); },
    });
  });
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: function (s) {
      var giu = s.direction === 1 && s.scroll() > 140;
      testata.classList.toggle('nascosta', giu && !menuAperto);
    },
  });

  /* ---------- menu del telefono ---------- */
  var menuAperto = false;
  var bottone = document.querySelector('.apri-menu');
  var menuTel = document.getElementById('menu-telefono');
  if (bottone && menuTel) {
    var voci = tutti('nav a span', menuTel);
    bottone.addEventListener('click', function () {
      menuAperto = !menuAperto;
      bottone.setAttribute('aria-expanded', String(menuAperto));
      testata.classList.toggle('su-scuro', menuAperto || scure.size > 0);
      if (menuAperto) {
        menuTel.hidden = false; ferma();
        gsap.timeline()
          .fromTo(menuTel, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: ridotto ? 0.01 : 0.8, ease: 'tenda' })
          .fromTo(voci, { yPercent: 105 }, { yPercent: 0, duration: ridotto ? 0.01 : 0.9, stagger: 0.06, ease: 'uscita' }, '-=0.35')
          .fromTo('.menu-telefono-piede', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, '-=0.6');
      } else {
        gsap.to(menuTel, { clipPath: 'inset(0% 0% 100% 0%)', duration: ridotto ? 0.01 : 0.7, ease: 'tenda', onComplete: function () { menuTel.hidden = true; riparti(); } });
      }
    });
  }

  /* ---------- tenda fra le pagine ---------- */
  var tenda = document.querySelector('.tenda');
  var tendaFondo = tenda && tenda.querySelector('.tenda-fondo');
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
    tendaTitolo.textContent = '';
    gsap.set(tenda, { visibility: 'visible' });
    gsap.timeline({ onComplete: fare })
      .fromTo(tendaFondo, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'tenda' })
      .to(tendaTitolo, { duration: 0.5, scrambleText: { text: titolo || 'Devid srl', chars: CARATTERI, speed: 0.9 } }, '-=0.25');
  }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a');
    if (!interno(a)) return;
    e.preventDefault();
    var titolo = a.getAttribute('data-tenda') || a.textContent.trim().slice(0, 40);
    var vaIndietro = a.hasAttribute('data-indietro') && document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1;
    esci(function () { if (vaIndietro) history.back(); else location.href = a.href; }, titolo);
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      inUscita = false;
      gsap.set(tenda, { visibility: 'hidden' });
      gsap.set(tendaFondo, { clipPath: 'inset(100% 0% 0% 0%)' });
      riparti();
    }
  });

  /* ---------- pezzi riusati ---------- */
  function scrambla(el, ritardo, durata) {
    var t = el.getAttribute('data-testo') || el.textContent;
    el.setAttribute('data-testo', t);
    if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', t);
    return gsap.fromTo(el, { autoAlpha: 1, scrambleText: { text: '' } }, {
      duration: durata || Math.min(1.4, 0.35 + t.length * 0.035), delay: ritardo || 0, ease: 'none',
      scrambleText: { text: t, chars: CARATTERI, speed: 0.6, revealDelay: 0.15 },
    });
  }

  /* comparse allo scorrimento */
  function comparse() {
    /* filetti */
    ScrollTrigger.batch('[data-linea]', {
      start: 'top 94%',
      onEnter: function (els) { els.forEach(function (el, i) { el.style.setProperty('--ritardo', (i * 0.07) + 's'); el.classList.add('visto'); }); },
    });

    /* righe di testo che salgono */
    tutti('[data-righe]').forEach(function (el) {
      if (ridotto) return;
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'riga-split', autoSplit: true,
        onSplit: function (self) {
          return gsap.from(self.lines, {
            yPercent: 108, duration: 1.25, ease: 'uscita', stagger: 0.085,
            scrollTrigger: { trigger: el, start: 'top 90%' },
          });
        },
      });
    });

    /* scritte che si compongono */
    tutti('[data-scramble]').forEach(function (el) {
      if (ridotto) return;
      gsap.set(el, { autoAlpha: 0 });
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: function () { scrambla(el); } });
    });

    /* foto che si aprono */
    tutti('[data-foto]').forEach(function (fig) {
      if (ridotto) return;
      var im = fig.querySelector('img');
      var tl = gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 88%' } });
      tl.fromTo(fig, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'tenda' });
      if (im) tl.fromTo(im, { scale: 1.32 }, { scale: 1, duration: 2, ease: 'uscita' }, 0);
    });

    /* parallasse dentro le cornici */
    tutti('[data-parallasse]').forEach(function (el) {
      if (ridotto) return;
      var v = parseFloat(el.getAttribute('data-parallasse')) || -10;
      gsap.fromTo(el, { yPercent: -v / 2 }, {
        yPercent: v / 2, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    /* numeri che contano */
    tutti('[data-conta]').forEach(function (el) {
      var fine = parseFloat(el.getAttribute('data-conta'));
      if (ridotto || el.closest('[data-taglio]')) return;
      var o = { v: 0 };
      el.textContent = '0';
      gsap.to(o, {
        v: fine, duration: 1.8, ease: 'morbida',
        scrollTrigger: { trigger: el, start: 'top 90%' },
        onUpdate: function () { el.textContent = String(Math.round(o.v)); },
      });
    });

    /* manifesto: le parole si accendono mentre si scorre */
    tutti('[data-parole]').forEach(function (el) {
      if (ridotto) return;
      SplitText.create(el, { type: 'words', wordsClass: 'parola' });
      var pezzi = tutti('.parola, :scope > .g, .manifesto-segno', el);
      gsap.fromTo(pezzi, { opacity: 0.13 }, {
        opacity: 1, ease: 'none', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 42%', scrub: 0.6 },
      });
      tutti(':scope > .g', el).forEach(function (g) {
        gsap.fromTo(g, { rotate: -14, scale: 0.7 }, { rotate: 0, scale: 1, ease: 'back.out(2.2)', duration: 1.1, scrollTrigger: { trigger: g, start: 'top 72%' } });
      });
    });

    /* pillole magnetiche */
    if (!tocco && !ridotto) {
      tutti('[data-magnete]').forEach(function (p) {
        var x = gsap.quickTo(p, 'x', { duration: 0.6, ease: 'power3' });
        var y = gsap.quickTo(p, 'y', { duration: 0.6, ease: 'power3' });
        var testo = p.querySelector('.pillola-testo');
        var tx = gsap.quickTo(testo, 'x', { duration: 0.6, ease: 'power3' });
        var ty = gsap.quickTo(testo, 'y', { duration: 0.6, ease: 'power3' });
        p.addEventListener('pointermove', function (e) {
          var r = p.getBoundingClientRect();
          var dx = e.clientX - (r.left + r.width / 2);
          var dy = e.clientY - (r.top + r.height / 2);
          x(dx * 0.28); y(dy * 0.36); tx(dx * 0.12); ty(dy * 0.16);
        });
        p.addEventListener('pointerleave', function () {
          gsap.to([p, testo], { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.38)', overwrite: true });
        });
      });
    }

    /* il piede sale da sotto */
    var piede = document.querySelector('[data-piede]');
    if (piede && !ridotto) {
      gsap.fromTo(piede, { yPercent: -14 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: piede.parentElement, start: 'top bottom', end: 'top 20%', scrub: true },
      });
      var righe = tutti('.indirizzo-riga > span', piede);
      gsap.from(righe, { yPercent: 105, duration: 1.3, ease: 'uscita', stagger: 0.09, scrollTrigger: { trigger: '.indirizzo', start: 'top 92%' } });
    }
    tutti('[data-su]').forEach(function (b) {
      b.addEventListener('click', function () { if (lenis) lenis.scrollTo(0, { duration: 2.2, easing: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; } }); else window.scrollTo(0, 0); });
    });
  }

  /* ---------- elenchi grandi con la foto che segue il cursore ---------- */
  function elenchi() {
    tutti('[data-elenco]').forEach(function (lista) {
      var sezione = lista.parentElement;
      var voci = tutti('.voce', lista);
      /* entrata: il nome sale dalla sua riga */
      if (!ridotto) {
        voci.forEach(function (v, i) {
          gsap.from(v.querySelector('.voce-testo'), { yPercent: 105, duration: 1.3, ease: 'uscita', delay: (i % 6) * 0.06, scrollTrigger: { trigger: v, start: 'top 94%' } });
        });
      }
      var fin = sezione.querySelector('[data-finestra]');
      if (!fin || tocco || ridotto) return;
      var dentro = fin.querySelector('.finestra-dentro');
      var foto = {};
      tutti('.finestra-foto', fin).forEach(function (f) { foto[f.getAttribute('data-foto-nome')] = f; });
      var px = gsap.quickTo(fin, 'x', { duration: 0.75, ease: 'power3' });
      var py = gsap.quickTo(fin, 'y', { duration: 0.75, ease: 'power3' });
      var rot = gsap.quickTo(fin, 'rotation', { duration: 0.9, ease: 'power3' });
      var ultimoX = 0, sopra = 0, attuale = null, indice = -1;
      gsap.set(fin, { xPercent: -50, yPercent: -50 });
      lista.addEventListener('pointermove', function (e) {
        px(e.clientX); py(e.clientY);
        var dx = e.clientX - ultimoX; ultimoX = e.clientX;
        rot(gsap.utils.clamp(-7, 7, dx * 0.35));
      });
      lista.addEventListener('pointerenter', function (e) {
        gsap.set(fin, { x: e.clientX, y: e.clientY, visibility: 'visible' });
        ultimoX = e.clientX;
        gsap.to(dentro, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'uscita', overwrite: true });
      });
      lista.addEventListener('pointerleave', function () {
        gsap.to(dentro, { clipPath: 'inset(50% 50% 50% 50%)', duration: 0.6, ease: 'uscita', overwrite: true });
        rot(0); attuale = null; indice = -1;
      });
      voci.forEach(function (v, i) {
        var a = v.querySelector('a');
        a.addEventListener('pointerenter', function () {
          var f = foto[a.getAttribute('data-foto-voce')];
          if (!f || f === attuale) return;
          var giu = i > indice;
          indice = i; attuale = f;
          f.style.zIndex = String(++sopra);
          gsap.fromTo(f, { yPercent: giu ? 100 : -100 }, { yPercent: 0, duration: 0.8, ease: 'uscita', overwrite: true });
          gsap.fromTo(f.querySelector('img'), { yPercent: giu ? -40 : 40, scale: 1.3 }, { yPercent: 0, scale: 1.08, duration: 1.1, ease: 'uscita', overwrite: true });
        });
      });
    });
  }

  /* ---------- prossimo servizio: la foto segue il cursore dentro la riga ---------- */
  function prossimo() {
    var p = document.querySelector('.prossimo-link');
    if (!p || tocco || ridotto) return;
    var f = p.querySelector('.prossimo-foto');
    var x = gsap.quickTo(f, 'x', { duration: 0.8, ease: 'power3' });
    p.addEventListener('pointermove', function (e) {
      var r = p.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.35);
    });
  }

  /* ---------- la sezione del taglio, bloccata mentre si scorre ---------- */
  function taglio() {
    var sez = document.querySelector('[data-taglio]');
    if (!sez) return;
    var svg = sez.querySelector('.taglio-svg');
    var NS = 'http://www.w3.org/2000/svg';
    var pezzi = tutti('[data-pezzo]', sez);
    var tracce = sez.querySelector('.taglio-tracce');
    var testa = sez.querySelector('.testa-taglio');
    var raggio = sez.querySelector('.taglio-raggio');
    var stampa = sez.querySelector('.taglio-stampa');
    var fasi = tutti('[data-fase]', sez);
    var dato = sez.querySelector('[data-conta]');

    var tagli = pezzi.map(function (p) {
      var forma = p.querySelector('.pezzo-forma');
      var t = document.createElementNS(NS, 'path');
      t.setAttribute('d', forma.getAttribute('d'));
      tracce.appendChild(t);
      var lun = t.getTotalLength();
      gsap.set(t, { strokeDasharray: lun, strokeDashoffset: lun });
      return { pezzo: p, forma: forma, traccia: t, lun: lun };
    });

    if (ridotto) {
      tagli.forEach(function (c) { gsap.set(c.traccia, { strokeDashoffset: 0 }); gsap.set(c.forma, { fill: 'rgba(43,59,212,.32)' }); });
      gsap.set(stampa, { opacity: 0.35 });
      return;
    }

    var sparsi = [
      { x: -160, y: -90, rotation: -24 }, { x: 140, y: 120, rotation: 18 },
      { x: 120, y: -140, rotation: 40 }, { x: 160, y: 60, rotation: -32 },
    ];
    gsap.set(pezzi, { transformOrigin: '50% 50%', transformBox: 'fill-box' });
    pezzi.forEach(function (p, i) { gsap.set(p, Object.assign({ opacity: 0 }, sparsi[i % sparsi.length])); });
    gsap.set(fasi.slice(1), { autoAlpha: 0, y: 30 });
    gsap.set(fasi[0], { autoAlpha: 1 });
    if (dato) dato.textContent = '0';

    var cambio = function (tl, da, a, at) {
      tl.to(fasi[da], { autoAlpha: 0, y: -30, duration: 0.35, ease: 'power2.in' }, at)
        .to(fasi[a], { autoAlpha: 1, y: 0, duration: 0.5, ease: 'uscita' }, at + 0.3);
      var nome = fasi[a].querySelector('.fase-nome');
      tl.fromTo(nome, { scrambleText: { text: '' } }, { duration: 0.5, scrambleText: { text: nome.textContent, chars: CARATTERI, speed: 0.6 } }, at + 0.3);
    };

    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sez, start: 'top top', end: function () { return '+=' + Math.round(innerHeight * 3.4); },
        pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
      },
    });

    /* scansione: il raggio passa e svela la stampa */
    tl.set(raggio, { opacity: 1 }, 0)
      .fromTo(raggio, { attr: { x: -120 } }, { attr: { x: 1000 }, duration: 1.4, ease: 'morbida' }, 0.1)
      .fromTo(stampa, { opacity: 0 }, { opacity: 0.55, duration: 1.2 }, 0.2)
      .to(raggio, { opacity: 0, duration: 0.15 }, 1.45);

    /* piazzamento: i pezzi si incastrano */
    cambio(tl, 0, 1, 1.5);
    pezzi.forEach(function (p, i) {
      tl.to(p, { opacity: 1, x: 0, y: 0, rotation: 0, duration: 1.1, ease: 'back.out(1.15)' }, 1.7 + i * 0.16);
    });
    tl.to(stampa, { opacity: 0.22, duration: 0.6 }, 2.4);

    /* taglio: la testa segue ogni contorno */
    cambio(tl, 1, 2, 3.25);
    var inizio = 3.55;
    tl.set(testa, { opacity: 1 }, inizio);
    tagli.forEach(function (c, i) {
      var o = { p: 0 };
      var dur = 0.35 + c.lun / 2400;
      tl.to(o, {
        p: 1, duration: dur,
        onUpdate: function () {
          var l = c.lun * o.p;
          c.traccia.style.strokeDashoffset = String(c.lun - l);
          var pt = c.traccia.getPointAtLength(l);
          testa.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
        },
      }, inizio);
      tl.to(c.forma, { fill: 'rgba(43,59,212,.34)', duration: 0.3 }, inizio + dur - 0.05)
        .to(c.pezzo, { y: -6, duration: 0.3, ease: 'back.out(3)' }, inizio + dur - 0.05);
      inizio += dur + 0.06;
    });
    tl.to(testa, { opacity: 0, duration: 0.2 }, inizio);
    if (dato) {
      var n = { v: 0 };
      tl.to(n, { v: 7, duration: inizio - 3.55, onUpdate: function () { dato.textContent = String(Math.round(n.v)); } }, 3.55);
    }
    tl.to({}, { duration: 0.4 });
  }

  /* ---------- il laboratorio scorre di lato ---------- */
  function laboratorio() {
    var sez = document.querySelector('[data-laboratorio]');
    if (!sez || ridotto) return;
    var binario = sez.querySelector('[data-binario]');
    var distanza = function () { return Math.max(0, binario.scrollWidth - innerWidth); };
    var corsa = gsap.to(binario, {
      x: function () { return -distanza(); }, ease: 'none',
      scrollTrigger: {
        trigger: sez, start: 'top top', end: function () { return '+=' + distanza(); },
        pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
      },
    });
    tutti('.scatto-dentro img', binario).forEach(function (im) {
      gsap.fromTo(im, { xPercent: 6 }, {
        xPercent: -6, ease: 'none',
        scrollTrigger: { trigger: im.closest('.scatto'), containerAnimation: corsa, start: 'left right', end: 'right left', scrub: true },
      });
    });
    tutti('.scatto', binario).forEach(function (s) {
      var q = s.querySelector('.scatto-quadro');
      var cap = s.querySelector('figcaption span');
      if (!q) return;
      gsap.fromTo(q, { clipPath: 'inset(0% 0% 0% 100%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', ease: 'tenda', duration: 1.3,
        scrollTrigger: { trigger: s, containerAnimation: corsa, start: 'left 96%' },
      });
      if (cap) {
        gsap.set(cap, { autoAlpha: 0 });
        ScrollTrigger.create({ trigger: s, containerAnimation: corsa, start: 'left 80%', once: true, onEnter: function () { scrambla(cap); } });
      }
    });
  }

  /* ---------- eroe della home ---------- */
  function eroe(subito) {
    var sez = document.querySelector('[data-eroe]');
    if (!sez) return gsap.timeline();
    var foto = sez.querySelector('[data-eroe-foto]');
    var img = foto.querySelector('img');
    var righe = tutti('.eroe-titolo .riga-dentro', sez);
    var mirino = sez.querySelector('.eroe-mirino');
    var scan = sez.querySelector('.eroe-scansione');
    var piccole = tutti('[data-scramble-eroe]', sez);

    var tl = gsap.timeline({ paused: true });
    if (ridotto) {
      tl.fromTo(sez, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 });
      gsap.set(righe, { y: 0, yPercent: 0 });
      return tl;
    }
    tl.fromTo(img, { scale: 1.38 }, { scale: 1.04, duration: 2.6, ease: 'uscita' }, 0)
      .fromTo(righe, { y: 0, yPercent: 108 }, { y: 0, yPercent: 0, duration: 1.5, ease: 'uscita', stagger: 0.12 }, subito ? 0.1 : 0.35)
      .fromTo(mirino, { rotate: -180, scale: 0 }, { rotate: 0, scale: 1, duration: 1.4, ease: 'back.out(1.8)' }, subito ? 0.5 : 0.8);
    piccole.forEach(function (p, i) { gsap.set(p, { autoAlpha: 0 }); tl.add(function () { scrambla(p); }, (subito ? 0.6 : 1) + i * 0.15); });

    /* la luce di controllo che scorre sul tessuto */
    gsap.timeline({ repeat: -1, repeatDelay: 2.4, delay: 2.2 })
      .fromTo(scan, { top: '0%', opacity: 0 }, { top: '100%', duration: 5.5, ease: 'morbida' })
      .to(scan, { opacity: 0.85, duration: 0.8 }, 0)
      .to(scan, { opacity: 0, duration: 0.8 }, 4.7);

    /* scorrendo, la foto rallenta e il titolo si alza */
    gsap.to(foto, { yPercent: 24, ease: 'none', scrollTrigger: { trigger: sez, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.eroe-testo', { yPercent: -60, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: sez, start: 'top top', end: 'bottom top', scrub: true } });

    /* il cursore sposta appena la foto */
    if (!tocco) {
      var mx = gsap.quickTo(img, 'x', { duration: 1.6, ease: 'power3' });
      var my = gsap.quickTo(img, 'y', { duration: 1.6, ease: 'power3' });
      sez.addEventListener('pointermove', function (e) {
        mx((e.clientX / innerWidth - 0.5) * -22);
        my((e.clientY / innerHeight - 0.5) * -14);
      });
    }
    return tl;
  }

  /* ---------- apertura delle pagine interne ---------- */
  function apertura() {
    var tl = gsap.timeline({ paused: true });
    var righe = tutti('.apertura-titolo .riga-dentro');
    if (ridotto) { gsap.set(righe, { y: 0, yPercent: 0 }); return tl; }
    if (righe.length) tl.fromTo(righe, { y: 0, yPercent: 108 }, { y: 0, yPercent: 0, duration: 1.4, ease: 'uscita', stagger: 0.1 }, 0);
    var piena = document.querySelector('[data-foto-piena]');
    if (piena) {
      tl.fromTo(piena, { clipPath: 'inset(22% 8% 0% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'tenda' }, 0.25)
        .fromTo(piena.querySelector('img'), { scale: 1.35 }, { scale: 1, duration: 2.2, ease: 'uscita' }, 0.25);
    }
    return tl;
  }

  /* ---------- caricamento della prima visita ---------- */
  function caricamento(poi) {
    var c = document.querySelector('[data-carica]');
    if (!c || getComputedStyle(c).display === 'none' || ridotto) { if (c) c.style.display = 'none'; poi(true); return; }
    memoria.scrivi('devid-visto', '1');
    var frasi = tutti('[data-frase]', c);
    var marchio = c.querySelector('.carica-marchio');
    var laser = c.querySelector('.carica-laser');
    var su = c.querySelector('.carica-su');
    var giu = c.querySelector('.carica-giu');
    var tl = gsap.timeline();
    tl.fromTo(marchio, { autoAlpha: 0, y: 12, filter: 'blur(6px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'uscita' }, 0.1)
      .fromTo(marchio.querySelector('.g'), { rotate: -90 }, { rotate: 0, duration: 1.1, ease: 'back.out(2)' }, 0.1);
    frasi.forEach(function (f, i) {
      var t = f.getAttribute('data-frase');
      tl.to(f, { duration: 0.7, scrambleText: { text: t, chars: CARATTERI, speed: 0.7 } }, 0.3 + i * 0.22)
        .to(f, { duration: 0.45, scrambleText: { text: '', chars: CARATTERI, speed: 1 } }, 1.55 + i * 0.07);
    });
    tl.to(marchio, { autoAlpha: 0, y: -10, duration: 0.45, ease: 'power2.in' }, 1.75)
      .to(laser, { scaleX: 1, duration: 0.8, ease: 'tenda' }, 1.85)
      .add(function () { poi(false); }, 2.55)
      .to(su, { yPercent: -101, duration: 1.25, ease: 'tenda' }, 2.6)
      .to(giu, { yPercent: 101, duration: 1.25, ease: 'tenda' }, 2.6)
      .to(laser, { opacity: 0, duration: 0.5 }, 2.75)
      .set(c, { display: 'none' });
  }

  /* ---------- avvio ---------- */
  function avvio() {
    var home = corpo.classList.contains('pagina-home');
    var intro = home ? eroe(false) : apertura();
    comparse();
    elenchi();
    prossimo();
    taglio();
    laboratorio();

    var arrivo = html.classList.contains('arrivo');
    var titolo = memoria.leggi('devid-tenda');
    memoria.togli('devid-tenda');
    html.classList.remove('arrivo');

    if (arrivo && tenda && !ridotto) {
      gsap.set(tenda, { visibility: 'visible' });
      gsap.set(tendaFondo, { clipPath: 'inset(0% 0% 0% 0%)' });
      tendaTitolo.textContent = titolo || '';
      gsap.timeline()
        .to(tendaTitolo, { yPercent: -60, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 0.1)
        .to(tendaFondo, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.95, ease: 'tenda' }, 0.2)
        .add(function () { intro.play(); riparti(); }, 0.45)
        .set(tenda, { visibility: 'hidden' });
    } else if (home) {
      caricamento(function () { intro.play(); riparti(); });
    } else {
      intro.play(); riparti();
    }
    html.classList.add('pronto');
  }

  if (document.fonts && document.fonts.ready) {
    var partito = false;
    var via = function () { if (!partito) { partito = true; avvio(); } };
    document.fonts.ready.then(via);
    setTimeout(via, 1200);
  } else avvio();
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
