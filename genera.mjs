/* Genera le pagine del sito di Devid srl.  node genera.mjs
   I testi stanno in contenuti.mjs. */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AZIENDA, SERVIZI, NEWS } from './contenuti.mjs';

const QUI = dirname(fileURLToPath(import.meta.url));
const DOMINIO = 'https://www.devidsrl.it';

/* ---------- segni disegnati ---------- */
const G = {
  freccia: `<svg class="g g-freccia" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 12.5 12.5 3.5M5.5 3.5h7v7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  frecciaDx: `<svg class="g g-dx" viewBox="0 0 18 14" aria-hidden="true"><path d="M1 7h15M10.5 1.5 16 7l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  frecciaGiu: `<svg class="g g-giu" viewBox="0 0 14 18" aria-hidden="true"><path d="M7 1v15M1.5 10.5 7 16l5.5-5.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  mirino: `<svg class="g g-mirino" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="6.5"/><path d="M12 1v6M12 17v6M1 12h6M17 12h6"/></g></svg>`,
  marchio: `<svg class="g g-marchio" viewBox="0 0 40 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="7" cy="6" r="4.4"/><circle cx="7" cy="18" r="4.4"/><path d="M11 8.2 38 19M11 15.8 38 5"/></g></svg>`,
};

const img = (r, nome, alt, { sizes = '100vw', larghe = false, carica = 'lazy', cls = '' } = {}) => {
  const set = [`${r}assets/img/${nome}-800.webp 800w`];
  if (!['cad', 'tuta', 'tuta-piano'].includes(nome)) set.push(`${r}assets/img/${nome}-1400.webp 1400w`);
  if (larghe) set.push(`${r}assets/img/${nome}-2400.webp 2400w`);
  return `<img${cls ? ` class="${cls}"` : ''} src="${r}assets/img/${nome}-800.webp" srcset="${set.join(', ')}" sizes="${sizes}" alt="${alt}" loading="${carica}" decoding="async">`;
};

const NAV = [
  ['Servizi', 'servizi/'],
  ['Azienda', 'azienda/'],
  ['News', 'news/'],
  ['Contatti', 'contatti/'],
];

const TAG = {
  'controllo-tessuti': ['Specula', 'Spettrofotometro', 'Prova vapore'],
  'adesivazione-tessuto': ['Adesivazione', 'Accoppiatura', 'Decatizzo'],
  'modellistica-cad-cam': ['Sviluppo taglie', 'Intelli-di', 'Piazzamento'],
  'taglio-tessuti': ['Intelligenza artificiale', 'Fino a 7 cm', 'Conveyor'],
  'confezione-campioni': ['Campionario', 'Produzione', 'In casa'],
};

const SPEC = {
  'controllo-tessuti': [['Macchina', 'Banco universale a tappeto aspirato'], ['Rotoli', 'Fino a 1 m di diametro'], ['Colore', 'Spettrofotometro Datacolor 3890']],
  'adesivazione-tessuto': [['Lavorazioni', 'Adesivazione, accoppiatura, decatizzo'], ['Strumentazione', 'Nuova, dal 2020'], ['Dove', 'Nello stesso stabilimento del taglio']],
  'modellistica-cad-cam': [['Digitalizzazione', 'Intelli-di, da fotografia'], ['Plotter', 'Algotex Stream 180, 200 cm utili'], ['File', 'DXF in entrata, HPGL e ISO in uscita']],
  'taglio-tessuti': [['Taglio', 'Morgan Next 2 e Investronica Diamond'], ['Materasso', 'Fino a 7 cm'], ['Con l’AI', 'Crea Solution, partner di Devid']],
  'confezione-campioni': [['Capi', 'Campionario e produzione'], ['Operatrici', 'Esperienza decennale'], ['Cicli', 'Ridotti, tutto in casa']],
};

/* ---------- pezzi comuni ---------- */
const testa = ({ r, titolo, descrizione, url }) => `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titolo}</title>
<meta name="description" content="${descrizione}">
<link rel="canonical" href="${DOMINIO}${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="${titolo}">
<meta property="og:description" content="${descrizione}">
<meta property="og:url" content="${DOMINIO}${url}">
<meta property="og:image" content="${DOMINIO}/assets/img/condivisione.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#eceef5">
<link rel="icon" href="${r}favicon.ico" sizes="32x32">
<link rel="icon" href="${r}assets/icona-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="${r}apple-touch-icon.png">
<link rel="preload" href="${r}assets/fonts/inter-tight-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${r}assets/css/sito.css">
<script>(function(h){h.classList.add('js');try{if(sessionStorage.getItem('devid-tenda'))h.classList.add('arrivo');if(sessionStorage.getItem('devid-visto'))h.classList.add('visto-carica')}catch(e){}setTimeout(function(){if(!window.devidPronto)h.classList.remove('js','arrivo')},4000)})(document.documentElement)</script>
</head>`;

const intestazione = (r, attiva) => `<a class="salta" href="#contenuto">Vai al contenuto</a>
<div class="tenda" aria-hidden="true"><div class="tenda-pannello"><p class="tenda-titolo"></p></div></div>
<header class="testata" data-testata>
  <a class="marchio" href="${r}" aria-label="Devid srl, pagina iniziale" data-tenda="Devid srl"><img src="${r}assets/logo-devid.svg" alt="Devid srl" width="98" height="33"></a>
  <nav class="menu" aria-label="Principale">
    ${NAV.map(([n, h]) => `<a class="menu-voce" href="${r}${h}" ${attiva === h ? 'aria-current="page"' : ''} data-tenda="${n}"><span data-gira>${n}</span></a>`).join('')}
  </nav>
  <div class="testata-destra">
    <a class="bottone bottone-blu" href="${r}contatti/" data-tenda="Contatti" data-magnete><span class="bottone-fondo"></span><span class="bottone-testo"><span data-gira>Scriveteci</span></span></a>
    <button class="bottone bottone-chiaro apri-menu" type="button" aria-expanded="false" aria-controls="menu-telefono" aria-label="Apri il menu"><span class="bottone-fondo"></span><span class="bottone-testo"><span class="hamburger"><i></i><i></i></span></span></button>
  </div>
</header>
<div class="menu-telefono" id="menu-telefono" hidden>
  <div class="menu-telefono-carta">
    <nav aria-label="Menu">
      <a href="${r}" data-tenda="Devid srl"><span>Home</span></a>
      ${NAV.map(([n, h]) => `<a href="${r}${h}" data-tenda="${n}"><span>${n}</span></a>`).join('')}
    </nav>
    <div class="menu-telefono-piede">
      <a href="tel:${AZIENDA.telLink}">${AZIENDA.telefono}</a>
      <a href="mailto:${AZIENDA.email}">${AZIENDA.email}</a>
    </div>
  </div>
</div>`;

const piede = (r, notte = false) => `<section class="chiamata" aria-labelledby="chiamata-t">
  <div class="chiamata-carta" data-carta>
    <h2 id="chiamata-t" class="chiamata-titolo" data-righe>Parliamo del<br>vostro tessuto.</h2>
    <div class="chiamata-azioni">
      <a class="bottone bottone-bianco bottone-grande" href="${r}contatti/" data-tenda="Contatti" data-magnete><span class="bottone-fondo"></span><span class="bottone-testo"><span data-gira>Contattateci</span>${G.frecciaDx}</span></a>
      <a class="chiamata-tel" href="tel:${AZIENDA.telLink}">${AZIENDA.telefono}</a>
    </div>
    <canvas class="chiamata-trama" data-trama aria-hidden="true"></canvas>
  </div>
</section>
<footer class="piede">
  <div class="piede-colonne">
    <div class="piede-colonna piede-intro">
      <p class="piede-frase">Controllo, adesivazione, modellistica, taglio e confezione. Tutto sotto lo stesso tetto, dagli anni ’50.</p>
    </div>
    <div class="piede-colonna">
      <ul>
        <li><a href="${r}" data-tenda="Devid srl"><span data-gira>Home</span></a></li>
        ${NAV.map(([n, h]) => `<li><a href="${r}${h}" data-tenda="${n}"><span data-gira>${n}</span></a></li>`).join('')}
      </ul>
    </div>
    <div class="piede-colonna">
      <ul>${SERVIZI.map((s) => `<li><a href="${r}servizi/${s.slug}/" data-tenda="${s.nome}"><span data-gira>${s.nome}</span></a></li>`).join('')}</ul>
    </div>
    <div class="piede-colonna">
      <ul>
        <li><a href="${AZIENDA.mappa}" target="_blank" rel="noopener">${AZIENDA.via}<br>${AZIENDA.cap} ${AZIENDA.citta} (${AZIENDA.prov})</a></li>
        <li><a href="tel:${AZIENDA.telLink}"><span data-gira>${AZIENDA.telefono}</span></a></li>
        <li><a href="mailto:${AZIENDA.email}"><span data-gira>${AZIENDA.email}</span></a></li>
        <li><a href="${r}assets/devid-srl-brochure.pdf" target="_blank" rel="noopener"><span data-gira>Brochure PDF</span> ${G.freccia}</a></li>
      </ul>
    </div>
  </div>
  <div class="piede-marchio" data-marchio-grande><img src="${r}assets/logo-devid${notte ? '-bianco' : ''}.svg" alt="Devid srl" width="1513" height="476" loading="lazy"></div>
  <div class="piede-fondo">
    <p>${AZIENDA.nome} · P. IVA ${AZIENDA.piva}</p>
    <p><a href="${r}privacy/" data-tenda="Privacy"><span data-gira>Privacy</span></a></p>
    <p>© <span data-anno>2026</span></p>
    <button class="su" type="button" data-su><span data-gira>Torna su</span></button>
  </div>
</footer>`;

const coda = (r, home = false) => `<script src="${r}assets/js/gsap.min.js" defer></script>
<script src="${r}assets/js/ScrollTrigger.min.js" defer></script>
<script src="${r}assets/js/SplitText.min.js" defer></script>
<script src="${r}assets/js/CustomEase.min.js" defer></script>
<script src="${r}assets/js/lenis.min.js" defer></script>
<script src="${r}assets/js/sito.js" defer></script>
${home ? `<script type="module" src="${r}assets/js/tessuto.js"></script>\n` : ''}</body>
</html>
`;

const schema = () => `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Devid srl',
  description: 'Taglio tessuti e modellistica: controllo tessuti, adesivazione, modellistica CAD-CAM, taglio computerizzato, confezione campioni e produzione.',
  url: DOMINIO + '/',
  telephone: '+39 0522 606201',
  email: AZIENDA.email,
  vatID: 'IT' + AZIENDA.piva,
  image: DOMINIO + '/assets/img/condivisione.jpg',
  logo: DOMINIO + '/assets/icona-192.png',
  address: { '@type': 'PostalAddress', streetAddress: AZIENDA.via, postalCode: AZIENDA.cap, addressLocality: AZIENDA.citta, addressRegion: 'RE', addressCountry: 'IT' },
})}</script>`;

const carta = (r, s, i) => `<a class="servizio-carta ${i % 2 ? 'carta-giu' : ''}" href="${r}servizi/${s.slug}/" data-tenda="${s.nome}" data-carta-servizio>
  <div class="servizio-foto" data-cursore="Apri">${img(r, s.foto, s.alt, { sizes: '(max-width: 760px) 92vw, 46vw', larghe: !!s.larghe })}</div>
  <div class="servizio-testo">
    <h3 class="servizio-nome">${s.nome}</h3>
    <p class="servizio-breve">${s.breve}</p>
    <ul class="servizio-tag">${(TAG[s.slug] || []).map((t) => `<li>${t}</li>`).join('')}</ul>
  </div>
</a>`;


/* ---------- pezzi riusati fra home e pagine interne ---------- */
const htmlAccesi = (r, testa = true) => `  <section class="accesi${testa ? '' : ' accesi-apri'}" aria-labelledby="accesi-t">
    ${testa ? `<div class="accesi-testa">
      <div class="accesi-intro">
        <h2 id="accesi-t" class="accesi-titolo" data-righe>Cinque lavorazioni,<br>un solo stabilimento.</h2>
        <p class="accesi-frase" data-righe>Dalla pezza appena arrivata al campione cucito: controlliamo, adesiviamo, sviluppiamo il modello, tagliamo e confezioniamo a Vezzano sul Crostolo, senza viaggi fra un fornitore e l’altro.</p>
      </div>
    </div>` : ''}
    <div class="accesi-elenco">
      ${SERVIZI.map((s, i) => `<a class="acceso" href="${r}servizi/${s.slug}/" data-tenda="${s.nome}" data-acceso>
        <canvas class="acceso-arte" data-arte="${['controllo', 'adesivazione', 'modellistica', 'taglio', 'confezione'][i]}" aria-hidden="true"></canvas>
        <span class="acceso-luce" aria-hidden="true"></span>
        <span class="acceso-testo">
          <h3 class="acceso-nome">${s.nome}</h3>
          <span class="acceso-breve">${s.breve}</span>
          <span class="acceso-scopri"><span class="acceso-scopri-cerchio">${G.frecciaDx}</span><span data-gira>Scopri</span></span>
        </span>
        <span class="acceso-tag">${(TAG[s.slug] || []).map((t) => `<i>${t}</i>`).join('')}</span>
      </a>`).join('')}
    </div>
  </section>`;
const htmlSguardo = (r) => `  <section class="sguardo" data-sguardo aria-labelledby="sguardo-t">
    <div class="sguardo-palco">
      <div class="sguardo-testa">
        <h2 id="sguardo-t" class="sguardo-titolo" data-righe>Macchine sempre aggiornate,<br>mani che sanno cosa fanno.</h2>
      </div>
      <div class="sguardo-binario" data-sguardo-binario>
        ${[
          ['dato', 'scuro', '7', 'cm', 'di materasso tagliato in automatico dall’Investronica Diamond'],
          ['foto', 'zund-portale', 'Crea Solution', 'Il taglio con l’intelligenza artificiale'],
          ['dato', 'chiaro', '200', 'cm', 'di altezza utile del plotter Algotex Stream 180'],
          ['foto', 'taglio-testa', 'Morgan Next 2', 'Taglio automatico fino a 5 cm'],
          ['dato', 'blu', '1', 'm', 'di diametro dei rotoli al banco di controllo'],
          ['foto', 'stesura', 'Oteman e Bkr', 'Stenditori elettronici con conveyor'],
          ['dato', 'scuro', '20', 's', 'al massimo di prova vapore, col metodo Hoffman'],
          ['foto', 'sagome', 'Intelli-di', 'Cartamodelli digitalizzati da una fotografia'],
        ].map((c) => c[0] === 'dato'
          ? `<div class="sguardo-carta sguardo-dato sguardo-${c[1]}"><p class="sguardo-cifra"><span data-conta-lato="${c[2]}">${c[2]}</span><small>${c[3]}</small></p><p class="sguardo-testo">${c[4]}</p></div>`
          : `<figure class="sguardo-carta sguardo-foto"><div class="sguardo-foto-dentro">${img(r, c[1], c[3], { sizes: '(max-width: 760px) 80vw, 34vw', larghe: c[1].startsWith('zund') })}</div><figcaption><span class="sguardo-nome">${c[2]}</span><span class="sguardo-sotto">${c[3]}</span></figcaption></figure>`).join('')}
        <a class="sguardo-carta sguardo-fine" href="${r}servizi/taglio-tessuti/" data-tenda="Taglio computerizzato"><span>Tutte le macchine del taglio</span><span class="sguardo-fine-cerchio">${G.frecciaDx}</span></a>
      </div>
    </div>
  </section>`;
const htmlAnnunci = (r, testa = true) => `  <section class="annunci" aria-labelledby="news-t">
    ${testa ? `<div class="annunci-testa">
      <h2 id="news-t" class="annunci-titolo" data-righe>Ultime novità</h2>
      <a class="bottone bottone-linea" href="${r}news/" data-tenda="News" data-magnete><span class="bottone-fondo"></span><span class="bottone-testo"><span data-gira>Tutte le news</span>${G.frecciaDx}</span></a>
    </div>` : ''}
    <ul class="annunci-elenco">
      ${[
        ...NEWS.map((n) => ({ href: `${r}news/${n.slug}/`, foto: n.foto, alt: n.alt, titolo: n.titolo, sopra: n.dataIt, azione: 'Leggi', tenda: n.titolo })),
        { href: `${r}assets/devid-srl-brochure.pdf`, foto: 'zund-schermo', alt: 'La postazione del taglio automatico', titolo: 'La brochure di Devid', sopra: 'PDF da scaricare', azione: 'Scarica', fuori: true },
      ].map((v) => {
        const parole = v.titolo.split(' ');
        const buco = `<span class="annuncio-buco" data-buco aria-hidden="true"><span class="annuncio-foto">${img(r, v.foto, '', { sizes: '320px', larghe: v.foto.startsWith('zund') })}</span></span>`;
        return `<li class="annuncio" data-annuncio>
        <a href="${v.href}"${v.fuori ? ' target="_blank" rel="noopener"' : ` data-tenda="${v.tenda}"`} aria-label="${v.titolo}, ${v.sopra}">
          <span class="annuncio-data etichetta etichetta-chiara">${v.sopra}</span>
          <span class="annuncio-nome" aria-hidden="true">${parole.map((w, i) => `<span class="annuncio-parola">${w}</span>${i < parole.length - 1 ? buco : ''}`).join('')}${parole.length === 1 ? buco : ''}</span>
          <span class="annuncio-azione"><span data-gira>${v.azione}</span>${v.fuori ? G.freccia : G.frecciaDx}</span>
        </a>
      </li>`;
      }).join('')}
    </ul>
  </section>`;

/* ---------- home ---------- */
function home() {
  const r = '';
  const foto = [
    ['zund-operatrice', 'Il taglio guidato dallo schermo', 'Sala taglio'],
    ['taglio-testa', 'La testa di taglio', 'Sala taglio'],
    ['sagome', 'Le sagome di un piazzamento', 'Modellistica'],
    ['proiettore', 'Il proiettore sul tavolo', 'Sala taglio'],
    ['zund-portale', 'Il portale di scansione', 'Taglio con l’AI'],
    ['cartamodello', 'I cartamodelli', 'Modellistica'],
    ['pannello', 'Il pannello comandi', 'Stesura'],
    ['metro', 'Metro e forbici', 'Confezione'],
    ['adesivazione', 'La macchina per l’adesivazione', 'Adesivazione'],
    ['zund-piano', 'Il piano di taglio', 'Sala taglio'],
    ['zund-sala', 'La sala taglio', 'Sala taglio'],
    ['stesura', 'La pezza stesa sul tavolo', 'Stesura'],
    ['zund-schermo', 'La postazione del taglio', 'Taglio con l’AI'],
    ['pressa', 'La pressa', 'Adesivazione'],
  ];
  const macchine = ['Morgan Next 2', 'Investronica Diamond', 'Stenditori Oteman e Bkr', 'Algotex Stream 180', 'Intelli-di', 'Datacolor 3890', 'Crea Solution'];
  return `${testa({ r, titolo: 'Devid srl, taglio tessuti e modellistica a Reggio Emilia', descrizione: 'Controllo tessuti, adesivazione, modellistica CAD-CAM, taglio computerizzato e confezione campioni a Vezzano sul Crostolo, Reggio Emilia. Dagli anni Cinquanta.', url: '/' })}
<body class="pagina-home tema-notte">
<div class="carica" data-carica aria-hidden="true">
  <div class="carica-scena">
    <div class="carica-logo-box" data-carica-box>
      <img class="carica-fantasma" src="assets/logo-devid-bianco.svg" alt="" width="1513" height="476">
      <img class="carica-logo" src="assets/logo-devid-bianco.svg" alt="" width="1513" height="476" data-carica-logo>
      <span class="carica-raggio" data-carica-raggio><i class="carica-testa" data-carica-testa></i></span>
      <span class="carica-scintille" data-carica-scintille></span>
    </div>
  </div>
  <p class="carica-conta"><span data-conta-carica>0</span></p>
</div>
${intestazione(r, '')}
<main id="contenuto">
  <section class="eroe" data-eroe>
    <div class="eroe-palco">
      <div class="eroe-carta" data-eroe-carta>
        <div class="eroe-dietro" aria-hidden="true">
          <p class="eroe-dietro-titolo">Il taglio del futuro<br>è già presente.</p>
        </div>
        <canvas class="eroe-tela" data-tela aria-hidden="true"></canvas>
        <div class="eroe-velo" aria-hidden="true"></div>
        <div class="eroe-sopra">
          <h1 class="eroe-titolo"><span class="riga"><span class="riga-dentro">Il tessuto,</span></span><span class="riga"><span class="riga-dentro">tagliato al millimetro.</span></span></h1>
          <div class="eroe-basso">
            <p class="eroe-testo">Taglio tessuti e modellistica dagli anni ’50: controllo, adesivazione, CAD-CAM, taglio automatico e confezione campioni.</p>
          </div>
        </div>
        <div class="eroe-laser-dato etichetta etichetta-chiara" aria-hidden="true"><span>Taglio</span><span data-cut>0%</span></div>
      </div>
    </div>
  </section>

  <section class="dichiarazione" aria-labelledby="dich-t">
    <h2 id="dich-t" class="dichiarazione-testo" data-accende>L’esperienza dell’artigianato italiano, unita alla ricerca e alle macchine più moderne. <em>Generazioni di lavoro sartoriale</em> e un aggiornamento continuo, per un tagliato preciso e capi che escono come devono.</h2>
    <div class="dichiarazione-sotto">
      <a class="bottone bottone-bianco" href="azienda/" data-tenda="Azienda" data-magnete><span class="bottone-fondo"></span><span class="bottone-testo"><span data-gira>L’azienda</span>${G.frecciaDx}</span></a>
      <a class="bottone bottone-linea-chiara" href="assets/devid-srl-brochure.pdf" target="_blank" rel="noopener" data-magnete><span class="bottone-fondo"></span><span class="bottone-testo"><span data-gira>Brochure</span>${G.freccia}</span></a>
    </div>
  </section>

  ${htmlAccesi(r)}

  ${htmlSguardo(r)}

  <section class="caroselli" aria-labelledby="caroselli-t">
    <div class="caroselli-testa">
      <h2 id="caroselli-t" class="caroselli-titolo" data-righe>Dentro il laboratorio</h2>
    </div>
    ${[
      { verso: -1, pezzi: [
        ['foto', 'zund-operatrice', 'Il taglio guidato dallo schermo'],
        ['frase', 'Controlliamo ogni pezza alla specula, prima che entri in lavorazione'],
        ['foto', 'taglio-testa', 'La testa di taglio'],
        ['frase', 'Tagliamo fino a 7 cm di materasso, anche con l’intelligenza artificiale'],
        ['foto', 'sagome', 'Le sagome di un piazzamento'],
        ['frase', 'Sviluppiamo le taglie al CAD-CAM e piazziamo i pezzi per consumare meno tessuto'],
        ['foto', 'zund-portale', 'Il portale di scansione'],
        ['frase', 'Piazzamenti automatici da file DXF di qualsiasi sistema CAD-CAM'],
      ] },
      { verso: 1, pezzi: [
        ['foto', 'adesivazione', 'La macchina per l’adesivazione'],
        ['frase', 'Adesivazione, accoppiatura e decatizzo nello stesso stabilimento del taglio'],
        ['foto', 'metro', 'Metro e forbici sulla macchina'],
        ['frase', 'Campioni e produzione cuciti da operatrici con esperienza decennale'],
        ['foto', 'cartamodello', 'I cartamodelli sul tavolo'],
        ['frase', 'Generazioni di lavoro sartoriale, dagli anni ’50 a Vezzano sul Crostolo'],
        ['foto', 'stesura', 'La pezza stesa sul tavolo'],
        ['frase', 'Stenditori elettronici senza tensioni, perché il tessuto non cali dopo il taglio'],
      ] },
    ].map((riga) => `<div class="carosello" data-carosello="${riga.verso}">
      <div class="carosello-binario" data-carosello-binario>
        ${[0, 1].map((k) => `<div class="carosello-giro"${k ? ' aria-hidden="true"' : ''}>${riga.pezzi.map((p) => p[0] === 'foto'
          ? `<figure class="carosello-foto">${img(r, p[1], k ? '' : p[2], { sizes: '(max-width: 760px) 60vw, 30vw', larghe: p[1].startsWith('zund') })}</figure>`
          : `<p class="carosello-frase">${p[1]}</p>`).join('')}</div>`).join('')}
      </div>
    </div>`).join('')}
  </section>

  <section class="settori" aria-labelledby="settori-t">
    <div class="sezione-testa">
      <h2 id="settori-t" class="sezione-titolo" data-righe>Per chi tagliamo</h2>
    </div>
    <ul class="settori-elenco">
      ${[
        ['Moda e lusso', 'Allover, stampa digitale, loghi e motivi ripetuti, tagliati con l’intelligenza artificiale.', 'zund-schermo'],
        ['Automotive', 'Materiali tecnici e spalmati, fino a 7 cm di materasso.', 'taglio-testa'],
        ['Arredamento', 'Tessuti per imbottiti e tendaggi, stesi senza tensioni.', 'stesura'],
        ['Modellistica', 'Sviluppo taglie, digitalizzazione e piazzamenti da qualsiasi CAD-CAM.', 'cad'],
        ['Sanitario', 'Mascherine, tute e camici in poliestere idrorepellente.', 'tuta'],
      ].map(([n, t, f]) => `<li class="settore" data-settore>
        <span class="settore-fondo"></span>
        <span class="settore-nome">${n}</span>
        <span class="settore-testo">${t}</span>
        <span class="settore-foto">${img(r, f, '', { sizes: '160px' })}</span>
      </li>`).join('')}
    </ul>
  </section>

  ${htmlAnnunci(r)}
</main>
${piede(r, true)}
<div class="cursore" aria-hidden="true" data-cursore-bolla><span></span></div>
${schema()}
${coda(r, true)}`;
}

/* ---------- pagine interne ---------- */
const apertura = ({ r, sopra, titolo, testo, indietro, arte, data }) => `<section class="apertura${arte ? ' apertura-con-arte' : ''}">
    ${arte ? `<canvas class="apertura-arte" data-arte-sola="${arte}" aria-hidden="true"></canvas>` : ''}
    <div class="apertura-sopra">
      ${indietro ? `<a class="indietro" href="${r}${indietro[1]}" data-tenda="${indietro[0]}" data-indietro>${G.frecciaDx}<span data-gira>${indietro[0]}</span></a>` : ''}
      ${data ? `<p class="apertura-data" data-sale>${data}</p>` : ''}
    </div>
    <h1 class="apertura-titolo">${titolo.map((t) => `<span class="riga"><span class="riga-dentro">${t}</span></span>`).join('')}</h1>
    ${testo ? `<p class="apertura-testo" data-righe>${testo}</p>` : ''}
  </section>`;

const fotoGrande = (r, nome, alt, larghe) => `<figure class="foto-grande" data-foto-grande><div class="foto-grande-dentro">${img(r, nome, alt, { carica: 'eager', larghe })}</div></figure>`;

const blocco = (b) => {
  if (b.tipo === 'testo')
    return `<section class="blocco">
      <h2 class="nascosto">${b.titolo}</h2>
      <div class="blocco-corpo">${b.testo.map((t) => `<p class="testo-grande" data-accende>${t}</p>`).join('')}</div>
    </section>`;
  if (b.tipo === 'righe')
    return `<section class="blocco">
      <h2 class="nascosto">${b.titolo}</h2>
      <dl class="schede">${b.righe.map(([n, t]) => `<div class="scheda" data-scheda><dt>${n}</dt><dd>${t}</dd></div>`).join('')}</dl>
    </section>`;
  if (b.tipo === 'tabella')
    return `<section class="blocco">
      <h2 class="nascosto">${b.titolo}</h2>
      <div class="blocco-corpo">
        <p class="testo" data-righe>${b.testo}</p>
        <div class="tabella-carta" data-scheda><div class="tabella-scorre"><table class="tabella">
          <thead><tr>${b.colonne.map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead>
          <tbody>${b.righe.map((rr) => `<tr><td>${rr[0]}</td><td><span class="campanello campanello-${rr[1]}">${rr[1]}</span></td><td>${rr[2]}</td></tr>`).join('')}</tbody>
        </table></div></div>
      </div>
    </section>`;
  return '';
};

function servizio(s, i) {
  const r = '../../';
  const dopo = SERVIZI[(i + 1) % SERVIZI.length];
  return `${testa({ r, titolo: `${s.nome}, Devid srl`, descrizione: s.breve, url: `/servizi/${s.slug}/` })}
<body class="pagina-interna tema-notte">
${intestazione(r, 'servizi/')}
<main id="contenuto">
  ${apertura({ r, sopra: 'Servizi', titolo: s.titolo, testo: s.apertura, indietro: ['Tutti i servizi', 'servizi/'], arte: ['controllo', 'adesivazione', 'modellistica', 'taglio', 'confezione'][i] })}
  <ul class="apertura-tag">${(TAG[s.slug] || []).map((t) => `<li>${t}</li>`).join('')}</ul>
  ${fotoGrande(r, s.foto, s.alt, !!s.larghe)}
  <div class="blocchi">${s.blocchi.map(blocco).join('')}</div>
  <section class="prossimo">
    <a class="prossimo-carta" href="${r}servizi/${dopo.slug}/" data-tenda="${dopo.nome}">
      <div class="prossimo-foto">${img(r, dopo.foto, '', { sizes: '100vw', larghe: !!dopo.larghe })}</div>
      <div class="prossimo-testo">
        <p class="prossimo-nome">${dopo.nome}</p>
        <span class="prossimo-cerchio">${G.frecciaDx}</span>
      </div>
    </a>
  </section>
</main>
${piede(r, true)}
<div class="cursore" aria-hidden="true" data-cursore-bolla><span></span></div>
${coda(r)}`;
}

function elencoServizi() {
  const r = '../';
  return `${testa({ r, titolo: 'Servizi, Devid srl', descrizione: 'Controllo tessuti, adesivazione, modellistica CAD-CAM, taglio computerizzato e confezione campioni: tutte le lavorazioni sotto lo stesso tetto.', url: '/servizi/' })}
<body class="pagina-interna tema-notte">
${intestazione(r, 'servizi/')}
<main id="contenuto">
  ${apertura({ r, sopra: 'Servizi', titolo: ['Dalla pezza', 'al campione'], testo: 'Le fasi che fanno un capo, dalla pezza appena arrivata al campione cucito. Si possono chiedere tutte insieme o una per volta.' })}
  ${htmlAccesi(r, false)}
</main>
${piede(r, true)}
<div class="cursore" aria-hidden="true" data-cursore-bolla><span></span></div>
${coda(r)}`;
}

function azienda() {
  const r = '../';
  return `${testa({ r, titolo: 'Azienda, Devid srl', descrizione: 'Generazioni di lavoro sartoriale dagli anni Cinquanta e macchine sempre aggiornate: chi è Devid srl.', url: '/azienda/' })}
<body class="pagina-interna tema-notte">
${intestazione(r, 'azienda/')}
<main id="contenuto">
  ${apertura({ r, sopra: 'Chi siamo', titolo: ['Dagli anni ’50,', 'con le mani e il CAD'], testo: 'L’esperienza accumulata in generazioni di lavoro sartoriale, insieme ai continui aggiornamenti tecnologici, ci permette di garantire alti standard qualitativi al prodotto finito.' })}
  ${fotoGrande(r, 'zund-sala', 'La sala taglio di Devid a Vezzano sul Crostolo', true)}
  <div class="blocchi">
    ${blocco({ tipo: 'righe', titolo: 'Il metodo', righe: [
      ['Il tessuto prima di tutto', 'Controlliamo la qualità del tessuto acquistato dal cliente: un risparmio di tempo ed energie in tutte le fasi successive della lavorazione.'],
      ['Il modello al computer', 'La modellistica computerizzata ottimizza i consumi di tessuto e tiene sempre una copia aggiornata dei lavori.'],
      ['Il taglio automatico', 'Unito al modello digitale, garantisce la massima precisione del tagliato.'],
      ['Il campione cucito', 'Operatrici con esperienza decennale e macchinari aggiornati, nello stesso stabilimento.'],
    ] })}
    <section class="intreccio" data-intreccio>
      <div class="intreccio-testo">
        <p class="intreccio-frase" data-accende>Il modello nasce sul tavolo, a mano, con il metro e il gesso. Poi diventa digitale al CAD, e torna sul tessuto preciso al millimetro.</p>
      </div>
      <div class="intreccio-foto">
        <figure class="intreccio-a" data-intreccio-foto="a"><span class="intreccio-dentro">${img(r, 'cartamodello', 'Un modellista sistema i cartamodelli sul tavolo', { sizes: '(max-width: 760px) 70vw, 30vw' })}</span><figcaption>Il cartamodello</figcaption></figure>
        <figure class="intreccio-b" data-intreccio-foto="b"><span class="intreccio-dentro">${img(r, 'metro', 'Metro e forbici sulla macchina', { sizes: '(max-width: 760px) 55vw, 22vw' })}</span><figcaption>Il metro</figcaption></figure>
      </div>
    </section>
  </div>
  ${htmlSguardo(r)}
  <div class="blocchi blocchi-dopo">
    <section class="blocco">
      <h2 class="nascosto">Nell’emergenza</h2>
      <div class="blocco-corpo">
        <p class="testo-grande" data-accende>Durante la pandemia abbiamo messo la nostra esperienza nei tessuti al servizio dell’emergenza sanitaria, producendo mascherine, tute e camici in poliestere idrorepellente.</p>
        <a class="bottone bottone-linea" href="${r}news/tute-e-camici-in-poliestere/" data-tenda="Tute e camici" data-magnete><span class="bottone-fondo"></span><span class="bottone-testo"><span data-gira>Leggi la notizia</span>${G.frecciaDx}</span></a>
      </div>
    </section>
  </div>
</main>
${piede(r, true)}
${coda(r)}`;
}

function contatti() {
  const r = '../';
  return `${testa({ r, titolo: 'Contatti e dove siamo, Devid srl', descrizione: 'Devid srl, via Achille Grandi 12, 42030 Vezzano sul Crostolo (RE). Telefono 0522 606201, info@devidsrl.it.', url: '/contatti/' })}
<body class="pagina-interna">
${intestazione(r, 'contatti/')}
<main id="contenuto">
  ${apertura({ r, sopra: 'Contatti', titolo: ['Parliamo del', 'vostro tessuto'], testo: 'Per ogni richiesta tecnica o commerciale scriveteci o chiamateci: la nostra esperienza è a vostra disposizione.' })}
  <section class="contatti">
    <a class="contatto" href="mailto:${AZIENDA.email}" data-scheda><span class="contatto-valore">${AZIENDA.email}</span><span class="contatto-cerchio">${G.freccia}</span></a>
    <a class="contatto" href="tel:${AZIENDA.telLink}" data-scheda><span class="contatto-valore">${AZIENDA.telefono}</span><span class="contatto-cerchio">${G.freccia}</span></a>
    <a class="contatto contatto-largo" href="${AZIENDA.mappa}" target="_blank" rel="noopener" data-scheda><span class="contatto-valore">${AZIENDA.via}, ${AZIENDA.cap} ${AZIENDA.citta} (${AZIENDA.prov})</span><span class="contatto-cerchio">${G.freccia}</span></a>
  </section>
  <div class="blocchi">
    ${blocco({ tipo: 'righe', titolo: 'Dove siamo', righe: [
      ['Dall’autostrada', 'Uscite a Reggio Emilia e prendete la SS 63 in direzione Passo del Cerreto.'],
      ['A Puianello', 'Alla rotonda proseguite sempre in direzione Passo del Cerreto per 2,5 km.'],
      ['Il ritiro del tessuto', 'Nella nostra sede di via Grandi 12/A, in porto franco.'],
    ] })}
    <figure class="mappa" data-foto>
      <iframe title="Mappa: Devid srl, via Achille Grandi 12, Vezzano sul Crostolo" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Devid+srl,+Via+Achille+Grandi+12,+42030+Vezzano+sul+Crostolo+RE&amp;z=16&amp;hl=it&amp;output=embed"></iframe>
      <figcaption class="mappa-carta">
        <img class="mappa-logo" src="${r}assets/logo-devid.svg" alt="Devid srl" width="120" height="38">
        <p class="mappa-indirizzo">${AZIENDA.via}<br>${AZIENDA.cap} ${AZIENDA.citta} (${AZIENDA.prov})</p>
        <p class="mappa-tel"><a href="tel:${AZIENDA.telLink}">${AZIENDA.telefono}</a></p>
        <a class="bottone bottone-blu" href="https://www.google.com/maps/dir/?api=1&amp;destination=Via+Achille+Grandi+12+42030+Vezzano+sul+Crostolo+RE" target="_blank" rel="noopener" data-magnete><span class="bottone-fondo"></span><span class="bottone-testo"><span data-gira>Indicazioni stradali</span>${G.freccia}</span></a>
      </figcaption>
    </figure>
  </div>
</main>
${piede(r)}
${coda(r)}`;
}

function elencoNews() {
  const r = '../';
  return `${testa({ r, titolo: 'News, Devid srl', descrizione: 'Le novità di Devid srl: macchine nuove, lavorazioni, produzione.', url: '/news/' })}
<body class="pagina-interna tema-notte">
${intestazione(r, 'news/')}
<main id="contenuto">
  ${apertura({ r, sopra: 'News', titolo: ['Ultime novità'], testo: 'Macchine nuove, lavorazioni, produzione: quello che succede nel laboratorio.' })}
  ${htmlAnnunci('../', false)}
</main>
${piede(r, true)}
<div class="cursore" aria-hidden="true" data-cursore-bolla><span></span></div>
${coda(r)}`;
}

function articolo(n) {
  const r = '../../';
  return `${testa({ r, titolo: `${n.titolo}, Devid srl`, descrizione: n.testo[0].slice(0, 150), url: `/news/${n.slug}/` })}
<body class="pagina-interna tema-notte">
${intestazione(r, 'news/')}
<main id="contenuto">
  <article>
    ${apertura({ r, sopra: n.dataIt, data: n.dataIt, titolo: [n.titolo], indietro: ['Tutte le news', 'news/'] })}
    ${fotoGrande(r, n.foto, n.alt, false)}
    <div class="blocchi">
      <section class="blocco">
        <div class="blocco-corpo">${n.testo.map((t) => `<p class="testo-grande" data-accende>${t}</p>`).join('')}</div>
      </section>
    </div>
  </article>
</main>
${piede(r, true)}
${coda(r)}`;
}

function privacy() {
  const r = '../';
  const voce = (t, x) => `<section class="blocco"><h2 class="nascosto">${t}</h2><div class="blocco-corpo"><p class="testo"><strong>${t}.</strong> ${x}</p></div></section>`;
  return `${testa({ r, titolo: 'Privacy, Devid srl', descrizione: 'Informativa sulla privacy del sito di Devid srl.', url: '/privacy/' })}
<body class="pagina-interna tema-notte">
${intestazione(r, '')}
<main id="contenuto">
  ${apertura({ r, sopra: 'Informativa', titolo: ['Privacy'] })}
  <div class="blocchi">
    ${voce('Titolare', `${AZIENDA.nome}, ${AZIENDA.via}, ${AZIENDA.cap} ${AZIENDA.citta} (${AZIENDA.prov}), P. IVA ${AZIENDA.piva}. Per ogni richiesta: <a href="mailto:${AZIENDA.email}">${AZIENDA.email}</a>.`)}
    ${voce('Cookie', 'Questo sito non usa cookie di profilazione né strumenti di statistica. Caratteri e script sono caricati dal sito stesso. Ricorda soltanto, per la durata della visita, che l’animazione d’apertura è già stata vista. Fa eccezione la mappa di Google nella pagina Contatti (vedi sotto).')}
    ${voce('Mappa', 'Nella pagina Contatti la mappa è fornita da Google Maps: quando la pagina la mostra, Google riceve l’indirizzo IP di chi la visualizza e può usare i propri cookie, secondo la sua informativa. Le altre pagine del sito non caricano servizi esterni.')}
    ${voce('Email e telefono', 'I dati che ci mandate scrivendoci o chiamandoci li usiamo solo per rispondere alla vostra richiesta. Potete chiederne in ogni momento la cancellazione all’indirizzo qui sopra.')}
  </div>
</main>
${piede(r, true)}
${coda(r)}`;
}

function nonTrovata() {
  const r = '/';
  return `${testa({ r, titolo: 'Pagina non trovata, Devid srl', descrizione: 'La pagina cercata non esiste.', url: '/404' })}
<body class="pagina-interna tema-notte">
${intestazione(r, '')}
<main id="contenuto">
  ${apertura({ r, sopra: 'Errore 404', titolo: ['Questo pezzo non', 'è nel piazzato'], testo: 'La pagina che cercate non c’è più o non c’è mai stata.' })}
  <div class="apertura-azioni"><a class="bottone bottone-blu" href="/" data-tenda="Devid srl" data-magnete><span class="bottone-fondo"></span><span class="bottone-testo"><span data-gira>Torna alla home</span>${G.frecciaDx}</span></a></div>
</main>
${coda(r)}`;
}

/* ---------- scrittura ---------- */
const scrivi = (rel, html) => {
  const p = join(QUI, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, html);
};
scrivi('index.html', home());
scrivi('servizi/index.html', elencoServizi());
SERVIZI.forEach((s, i) => scrivi(`servizi/${s.slug}/index.html`, servizio(s, i)));
scrivi('azienda/index.html', azienda());
scrivi('contatti/index.html', contatti());
scrivi('news/index.html', elencoNews());
NEWS.forEach((n) => scrivi(`news/${n.slug}/index.html`, articolo(n)));
scrivi('privacy/index.html', privacy());
scrivi('404.html', nonTrovata());
const urls = ['/', '/servizi/', ...SERVIZI.map((s) => `/servizi/${s.slug}/`), '/azienda/', '/contatti/', '/news/', ...NEWS.map((n) => `/news/${n.slug}/`), '/privacy/'];
scrivi('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${DOMINIO}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
scrivi('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${DOMINIO}/sitemap.xml\n`);
console.log('pagine scritte:', urls.length + 1);
