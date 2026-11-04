/* Genera le pagine HTML del sito di Devid srl.
   node genera.mjs  →  scrive index.html e le cartelle delle pagine qui accanto.
   Testi presi dal sito attuale devidsrl.it (novembre 2026). */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const QUI = dirname(fileURLToPath(import.meta.url));
const DOMINIO = 'https://www.devidsrl.it';

const AZIENDA = {
  nome: 'Devid srl',
  via: 'Via Achille Grandi 12',
  cap: '42030',
  citta: 'Vezzano sul Crostolo',
  prov: 'RE',
  telefono: '0522 606201',
  telLink: '+390522606201',
  email: 'info@devidsrl.it',
  piva: '01704150356',
  mappa: 'https://www.google.com/maps/search/?api=1&query=Via+Achille+Grandi+12+42030+Vezzano+sul+Crostolo+RE',
};

/* ---------- segni disegnati (niente emoji) ---------- */
const G = {
  freccia: `<svg class="g g-freccia" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M5.5 3H13v7.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`,
  frecciaDx: `<svg class="g g-freccia-dx" viewBox="0 0 18 12" aria-hidden="true"><path d="M0 6h16M11 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`,
  frecciaGiu: `<svg class="g g-freccia-giu" viewBox="0 0 12 18" aria-hidden="true"><path d="M6 0v16M1 11l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`,
  forbici: `<svg class="g g-forbici" viewBox="0 0 40 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="6" r="4.6"/><circle cx="7" cy="18" r="4.6"/><path d="M11 8.2 38 19M11 15.8 38 5"/></g></svg>`,
  mirino: `<svg class="g g-mirino" viewBox="0 0 32 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="16" cy="16" r="9"/><path d="M16 1v9M16 22v9M1 16h9M22 16h9"/></g></svg>`,
  rocchetto: `<svg class="g g-rocchetto" viewBox="0 0 28 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 2h22M3 30h22M6 2c0 5 2 6 2 14s-2 9-2 14M22 2c0 5-2 6-2 14s2 9 2 14"/><path d="M8 9l12 3M8 14l12 3M8 19l12 3M8 24l12-1"/></g></svg>`,
  ago: `<svg class="g g-ago" viewBox="0 0 48 16" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 8h38c3 0 6-1.6 6-3.2S43 2 40 2H31"/><ellipse cx="41" cy="5" rx="2.6" ry="1.1"/><path d="M2 8c8 0 10 6 20 6s14-4 18-6" stroke-dasharray="2 2"/></g></svg>`,
  segnaposto: `<svg class="g g-pin" viewBox="0 0 22 30" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 29s9-10 9-17a9 9 0 0 0-18 0c0 7 9 17 9 17Z"/><circle cx="11" cy="12" r="3.2"/></g></svg>`,
  busta: `<svg class="g g-busta" viewBox="0 0 34 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1.5" y="1.5" width="31" height="21" rx="1"/><path d="m2 2 15 12L32 2"/></g></svg>`,
  metro: `<svg class="g g-metro" viewBox="0 0 64 20" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1" y="3" width="62" height="14" rx="1"/><path d="M8 3v6M16 3v4M24 3v6M32 3v4M40 3v6M48 3v4M56 3v6"/></g></svg>`,
};
const etichetta = (alto, basso) =>
  `<span class="etichetta" aria-hidden="true"><b>${alto}</b><span>${basso.map((x) => `<i>${x}</i>`).join('')}</span></span>`;
const numero = (a, b) => `<span class="numero" aria-hidden="true"><b>${a}</b><span><i>${b[0]}</i><i>${b[1]}</i></span></span>`;

/* ---------- immagini ---------- */
const img = (r, nome, alt, { cls = '', sizes = '100vw', larghe = false, carica = 'lazy' } = {}) => {
  const set = [`${r}assets/img/${nome}-800.webp 800w`];
  if (!['cad', 'tuta', 'tuta-piano'].includes(nome)) set.push(`${r}assets/img/${nome}-1400.webp 1400w`);
  if (larghe) set.push(`${r}assets/img/${nome}-2400.webp 2400w`);
  return `<img class="${cls}" src="${r}assets/img/${nome}-800.webp" srcset="${set.join(', ')}" sizes="${sizes}" alt="${alt}" loading="${carica}" decoding="async">`;
};

/* ---------- servizi ---------- */
const SERVIZI = [
  {
    slug: 'controllo-tessuti',
    nome: 'Controllo tessuti',
    breve: 'Ogni pezza verificata alla specula, misurata senza tensione e segnalata fallo per fallo.',
    foto: 'stesura',
    alt: 'Un tavolo di stesura con il tessuto disteso nel reparto di Devid',
    titolo: ['Il controllo', 'dei tessuti'],
    apertura:
      'Controlliamo la qualità del tessuto acquistato dal cliente prima che entri in lavorazione: tempo ed energie risparmiate in tutte le fasi successive.',
    blocchi: [
      {
        tipo: 'testo',
        titolo: 'Perché',
        testo: [
          'Sotto la pressante richiesta di garantire alti livelli qualitativi ai capi confezionati, la tecnica e gli strumenti per il rilevamento della difettosità si sono affinati insieme ai progressi tecnologici.',
          'Servono banchi di verifica universali, capaci di far risaltare i difetti ricercati su qualsiasi tipo di tessuto.',
        ],
      },
      {
        tipo: 'righe',
        titolo: 'Quattro posizioni di lettura',
        righe: [
          ['Verticale', 'Fa emergere i difetti di filato in ordito e in trama: filo grosso, filo teso, filo poco o troppo ritorto. È la posizione più importante per l’abbigliamento perché imita il capo indossato.'],
          ['Obliqua, 30°–40°', 'Rivela barrature, rigature e disuniformità di tintura.'],
          ['Effetto fodera', 'Sui tessuti leggeri e trasparenti si alternano sotto la pezza riscontri della stessa nuance, per vedere il tessuto come sarà sul capo.'],
          ['Campo lungo', 'Per quadri e stampati, un piano di riscontro lungo e quasi orizzontale.'],
        ],
      },
      {
        tipo: 'righe',
        titolo: 'La macchina',
        righe: [
          ['Tappeto aspirato', 'Il flusso d’aria è normale al tappeto: la misura è esatta su qualsiasi tessuto, maglia compresa, perché lavora senza nessuna tensione.'],
          ['Carrello avvolgitore', 'Estraibile in automatico verso l’esterno, controlla rotoli fino a un metro di diametro.'],
          ['Braccio oscillante', 'Sul retro della macchina: alimenta il controllo da falda oppure da grande rotolo.'],
        ],
      },
      {
        tipo: 'tabella',
        titolo: 'I falli e le detrazioni',
        testo: 'I falli si segnalano sulla cimosa destra con strisce adesive, i campanelli, di colore diverso secondo la gravità, e con un adesivo vicino al difetto. A ogni fallo corrisponde una detrazione dalla lunghezza utilizzabile della pezza.',
        colonne: ['Fallo', 'Campanello', 'Detrazione'],
        righe: [
          ['Lieve, da 0 a 5 cm in qualsiasi direzione', 'giallo', '30 cm'],
          ['Medio, da 5 a 50 cm in qualsiasi direzione', 'verde', '50 cm'],
          ['Grave, oltre 50 cm', 'rosso', '100 cm'],
          ['Continuo, oltre 100 cm nel senso dell’ordito', 'rosso', 'la lunghezza effettiva del fallo'],
        ],
      },
      {
        tipo: 'righe',
        titolo: 'Verifiche in più',
        righe: [
          ['Manichetta di 20 cm', 'Da ogni pezza, per stabilire differenze di mano, colore e peso rispetto al tipo qualità. Segnaliamo i centri cimosa simmetrici e asimmetrici.'],
          ['Prova vapore', 'Con il metodo Hoffman: da 15 a 20 secondi a vapore libero.'],
          ['Spettrofotometro', 'Comparazione colori con Datacolor 3890, con metodologie e tolleranze riconosciute: centro cimosa, tipo campione contro lotti di produzione, lotti per nuance, solidità per degradazione e scarico.'],
          ['Collegamento audio-video', 'Per risolvere a distanza i problemi nati durante il controllo, senza far uscire un tecnico.'],
          ['Arrotolatura', 'Dopo il controllo le pezze tornano alla loro consistenza, fermate con nastro di carta o con due cordicelle quando l’adesivo rovinerebbe il tessuto. La macchina allinea anche un rotolo nato storto.'],
        ],
      },
      {
        tipo: 'testo',
        titolo: 'Ricezione e spedizione',
        testo: [
          'Il tessuto si riceve nella nostra sede di via Grandi 12/A a Vezzano sul Crostolo in porto franco e, dopo il controllo, parte verso il destinatario in porto assegnato.',
          'Alla ricezione controlliamo imballaggi e merce, la sistemiamo su bancali per evitare danni e pieghe e segnaliamo subito ogni anomalia. Bolla d’accompagnamento e packing list arrivano al cliente in giornata. Cartelle colori e tipi qualità, possibilmente prima della merce, ci permettono di codificare ogni pezza con precisione.',
        ],
      },
    ],
  },
  {
    slug: 'adesivazione-tessuto',
    nome: 'Adesivazione',
    breve: 'Adesivazione, accoppiatura e decatizzo con la strumentazione nuova del reparto.',
    foto: 'adesivazione',
    alt: 'La macchina per l’adesivazione dei tessuti di Devid',
    titolo: ['Adesivazione', 'del tessuto'],
    apertura:
      'L’esperienza dell’artigianato italiano, con la sua cura e la sua precisione, sempre alla ricerca di strumenti nuovi per tenere insieme tradizione e modernità.',
    blocchi: [
      {
        tipo: 'righe',
        titolo: 'Tre lavorazioni',
        righe: [
          ['Adesivazione', 'La teletta termoadesiva unita al tessuto, per dare corpo e stabilità alle parti del capo.'],
          ['Accoppiatura', 'Due materiali uniti in uno, con la stessa precisione su tutta la pezza.'],
          ['Decatizzo', 'Il tessuto stabilizzato prima del taglio, perché non cali dopo.'],
        ],
      },
      {
        tipo: 'testo',
        titolo: 'Dentro casa',
        testo: [
          'Avere l’adesivazione nello stesso stabilimento del taglio e della confezione vuol dire niente viaggi fra un fornitore e l’altro: il tessuto passa da un reparto all’altro e i tempi si accorciano.',
        ],
      },
    ],
  },
  {
    slug: 'modellistica-cad-cam',
    nome: 'Modellistica CAD-CAM',
    breve: 'Sviluppo taglie, digitalizzazione dei cartamodelli e piazzamento automatico.',
    foto: 'sagome',
    alt: 'Sagome di un piazzamento stampate sul piano di lavoro',
    titolo: ['Modellistica', 'computerizzata'],
    apertura:
      'Lo sviluppo taglie con il CAD-CAM ottimizza i supporti cartacei di tutte le taglie e il consumo di tessuto, con i piazzamenti fatti al computer e una copia sempre aggiornata dei lavori.',
    blocchi: [
      {
        tipo: 'righe',
        titolo: 'Digitalizzazione e stampa',
        righe: [
          ['Intelli-di', 'Al posto del classico digitizer: da una fotografia ad alta definizione di un insieme di cartamodelli, un algoritmo rileva perimetri, tacche e caratteristiche di ogni pezzo in pochi secondi.'],
          ['Plotter Algotex Stream 180', 'Produzione alta e stampa pulita, su carta normale o termoadesiva, fino a 200 cm di altezza utile.'],
          ['Grafici di taglio', 'Stampati con gli incrementi e i decrementi in percentuale.'],
        ],
      },
      {
        tipo: 'testo',
        titolo: 'Piazzamento automatico',
        testo: [
          'Eseguiamo piazzamenti automatici da file DXF provenienti da qualsiasi sistema CAD-CAM e inviamo per email i file HPGL per la stampa su plotter, con le miniature dei piazzamenti in PDF, e i file di taglio in formato ISO.',
        ],
      },
      {
        tipo: 'righe',
        titolo: 'Le variabili del piazzato',
        righe: [
          ['Tempo d’elaborazione', 'Quanto lasciar lavorare il calcolo per stringere i pezzi.'],
          ['Incroci', 'Se i pezzi possono incrociarsi.'],
          ['Margine', 'Lo spazio fra un pezzo e l’altro.'],
          ['Gradini', 'La distanza fra le taglie nei piazzamenti a gradini.'],
        ],
      },
    ],
  },
  {
    slug: 'taglio-tessuti',
    nome: 'Taglio computerizzato',
    breve: 'Dai tessuti leggeri agli spalmati, fino a 7 cm di materasso, anche con l’intelligenza artificiale.',
    foto: 'zund-sala',
    alt: 'La sala taglio con il tavolo di taglio automatico e il portale di scansione',
    larghe: true,
    titolo: ['Taglio tessuti', 'computerizzato'],
    apertura:
      'Tagliamo le tipologie di materiale più diverse: tessuti leggeri ed elasticizzati, sintetici, spalmati. Per la moda e il lusso, l’automotive, l’arredamento, la modellistica.',
    blocchi: [
      {
        tipo: 'testo',
        titolo: 'Con l’intelligenza artificiale',
        testo: [
          'Il taglio dei tessuti del futuro è già presente: quello basato sull’intelligenza artificiale di Crea Solution, partner di Devid. Scansioni complete e dettagliate e taglio automatico di allover, immagini, stampa digitale, loghi e motivi ripetuti.',
          'Qualità e precisione per la moda e i marchi del lusso, con una produzione rapida.',
        ],
      },
      {
        tipo: 'righe',
        titolo: 'Il parco macchine',
        righe: [
          ['Morgan Next 2', 'Taglio automatico fino a 5 cm di spessore.'],
          ['Investronica Diamond', 'Taglio automatico fino a 7 cm di spessore.'],
          ['Stenditori Oteman e Bkr', 'Elettronici: eliminano le tensioni del tessuto durante la stesura ed evitano i cali dopo il taglio. Tutti e due i tavoli hanno il conveyor.'],
        ],
      },
    ],
  },
  {
    slug: 'confezione-campioni',
    nome: 'Confezione campioni',
    breve: 'Capi campionario e di produzione, cuciti da operatrici con esperienza decennale.',
    foto: 'camice',
    alt: 'Un camice in poliestere confezionato da Devid, disteso sul tavolo',
    titolo: ['Confezione campioni', 'e produzione'],
    apertura:
      'Confezioniamo capi campionario e di produzione. La qualità la garantiscono le nostre operatrici, alcune con esperienza decennale, e macchinari sempre aggiornati.',
    blocchi: [
      {
        tipo: 'testo',
        titolo: 'Tutto sotto lo stesso tetto',
        testo: [
          'Le lavorazioni principali si fanno dentro l’azienda: i cicli si accorciano e spariscono i tempi morti, cioè i trasporti e i file che arrivano quando la produzione è già ferma ad aspettarli.',
        ],
      },
      {
        tipo: 'righe',
        titolo: 'Dal controllo al capo',
        righe: [
          ['Controllo', 'La pezza verificata prima di tutto.'],
          ['Modello', 'Sviluppato e piazzato al CAD-CAM.'],
          ['Taglio', 'Automatico, senza tensioni.'],
          ['Confezione', 'Il campione cucito e pronto da provare.'],
        ],
      },
    ],
  },
];

const NEWS = [
  {
    slug: 'adesivazione-tessuti',
    titolo: 'Adesivazione tessuti',
    data: '2020-09-03',
    dataIt: '3 settembre 2020',
    foto: 'adesivazione',
    alt: 'La nuova macchina per l’adesivazione',
    testo: [
      'L’esperienza decennale dell’artigianato italiano, con la sua passione, cura e precisione al servizio di tutti i clienti, è sempre alla ricerca di nuovi strumenti per unire al meglio tradizione e modernità.',
      'Ecco quindi la nuova strumentazione di Devid srl per i servizi di adesivazione, accoppiatura e decatizzo dei tessuti.',
    ],
  },
  {
    slug: 'tute-e-camici-in-poliestere',
    titolo: 'Tute e camici in poliestere',
    data: '2020-08-28',
    dataIt: '28 agosto 2020',
    foto: 'tuta',
    alt: 'Una tuta protettiva in poliestere idrorepellente prodotta da Devid',
    testo: [
      'Devid ha messo la propria esperienza nel settore dei tessuti al servizio dell’emergenza sanitaria nata dalla pandemia.',
      'Abbiamo iniziato la produzione di mascherine, tute e camici in poliestere idrorepellente da 50 grammi al metro quadro.',
    ],
  },
];

/* ---------- pezzi comuni ---------- */
const testa = ({ r, titolo, descrizione, url, img: og = 'condivisione.jpg' }) => `<!doctype html>
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
<meta property="og:image" content="${DOMINIO}/assets/img/${og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0d0d0c">
<link rel="icon" href="${r}favicon.ico" sizes="32x32">
<link rel="icon" href="${r}assets/icona.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${r}apple-touch-icon.png">
<link rel="preload" href="${r}assets/fonts/instrument-serif-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${r}assets/fonts/inter-tight-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${r}assets/css/sito.css">
<script>(function(h){h.classList.add('js');try{if(sessionStorage.getItem('devid-tenda'))h.classList.add('arrivo');if(sessionStorage.getItem('devid-visto'))h.classList.add('visto-carica')}catch(e){}setTimeout(function(){if(!window.devidPronto)h.classList.remove('js','arrivo')},4000)})(document.documentElement)</script>
</head>`;

const NAV = [
  ['Servizi', 'servizi/'],
  ['Azienda', 'azienda/'],
  ['News', 'news/'],
  ['Contatti', 'contatti/'],
];

const intestazione = (r, attiva) => `<a class="salta" href="#contenuto">Vai al contenuto</a>
<div class="tenda" aria-hidden="true"><div class="tenda-fondo"></div><p class="tenda-titolo"></p></div>
<header class="testata" data-testata>
  <a class="marchio" href="${r}" aria-label="Devid srl, pagina iniziale" data-tenda="Devid srl">
    <span class="marchio-nome">Devid<sup>®</sup></span>
    <span class="marchio-segno">${G.forbici}</span>
  </a>
  <nav class="menu" aria-label="Principale">
    ${NAV.map(([n, h], i) => `<a href="${r}${h}" ${attiva === h ? 'aria-current="page"' : ''} data-tenda="${n}"><span data-gira>${n}</span></a>${i < NAV.length - 1 ? '<span class="virgola">,</span>' : ''}`).join(' ')}
  </nav>
  <a class="testata-scrivi" href="${r}contatti/" data-tenda="Contatti"><span data-gira>Scriveteci</span></a>
  <button class="apri-menu" type="button" aria-expanded="false" aria-controls="menu-telefono"><span data-apri>Menu</span><span data-chiudi>Chiudi</span></button>
</header>
<div class="menu-telefono" id="menu-telefono" hidden>
  <nav aria-label="Menu del telefono">
    <a href="${r}" data-tenda="Devid srl"><span>Home</span></a>
    ${NAV.map(([n, h]) => `<a href="${r}${h}" data-tenda="${n}"><span>${n}</span></a>`).join('')}
  </nav>
  <div class="menu-telefono-piede">
    <a href="tel:${AZIENDA.telLink}">${AZIENDA.telefono}</a>
    <a href="mailto:${AZIENDA.email}">${AZIENDA.email}</a>
  </div>
</div>`;

const piede = (r) => `<footer class="piede" data-tema="scuro">
  <div class="piede-dentro" data-piede>
    <div class="piede-chiamata">
      <p class="sopratitolo" data-scramble>Avete richieste?</p>
      <h2 class="piede-titolo" data-righe>Non esitate,<br>scriveteci.</h2>
      <a class="pillola pillola-chiara" href="${r}contatti/" data-magnete data-tenda="Contatti"><span class="pillola-fondo"></span><span class="pillola-testo">Contattateci ${G.frecciaDx}</span></a>
    </div>
    <div class="piede-colonne">
      <div class="colonna">
        <p class="colonna-titolo" data-linea>Menu</p>
        <ul>
          <li><a href="${r}" data-tenda="Devid srl"><span data-gira>Home</span></a></li>
          ${NAV.map(([n, h]) => `<li><a href="${r}${h}" data-tenda="${n}"><span data-gira>${n}</span></a></li>`).join('')}
          <li><a href="${r}privacy/" data-tenda="Privacy"><span data-gira>Privacy</span></a></li>
        </ul>
      </div>
      <div class="colonna">
        <p class="colonna-titolo" data-linea>Servizi</p>
        <ul>
          ${SERVIZI.map((s) => `<li><a href="${r}servizi/${s.slug}/" data-tenda="${s.nome}"><span data-gira>${s.nome}</span></a></li>`).join('')}
        </ul>
      </div>
      <div class="colonna">
        <p class="colonna-titolo" data-linea>Altro</p>
        <ul>
          <li><a href="${r}assets/devid-srl-brochure.pdf" target="_blank" rel="noopener"><span data-gira>Brochure</span> ${G.freccia}</a></li>
          <li><a href="${AZIENDA.mappa}" target="_blank" rel="noopener"><span data-gira>Google Maps</span> ${G.freccia}</a></li>
        </ul>
      </div>
    </div>
    <address class="indirizzo">
      <a class="indirizzo-riga" href="${AZIENDA.mappa}" target="_blank" rel="noopener"><span>${G.segnaposto}${AZIENDA.via},</span></a>
      <span class="indirizzo-riga"><span>${AZIENDA.cap} ${AZIENDA.citta}${etichetta(AZIENDA.prov, ['Reggio', 'Emilia'])}</span></span>
      <a class="indirizzo-riga" href="tel:${AZIENDA.telLink}"><span>Telefono ${numero('0522', ['606', '201'])}</span></a>
      <a class="indirizzo-riga" href="mailto:${AZIENDA.email}"><span>info${G.busta}devidsrl.it</span></a>
    </address>
    <div class="piede-fondo">
      <p>${AZIENDA.nome} · P. IVA ${AZIENDA.piva}</p>
      <p>Taglio tessuti e modellistica</p>
      <p>©<span data-anno>2026</span></p>
      <button class="su" type="button" data-su>Torna su ${G.freccia}</button>
    </div>
  </div>
</footer>`;

const coda = (r, extra = '') => `<script src="${r}assets/js/gsap.min.js" defer></script>
<script src="${r}assets/js/ScrollTrigger.min.js" defer></script>
<script src="${r}assets/js/SplitText.min.js" defer></script>
<script src="${r}assets/js/ScrambleTextPlugin.min.js" defer></script>
<script src="${r}assets/js/CustomEase.min.js" defer></script>
<script src="${r}assets/js/lenis.min.js" defer></script>
<script src="${r}assets/js/sito.js" defer></script>${extra}
</body>
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
  address: {
    '@type': 'PostalAddress',
    streetAddress: AZIENDA.via,
    postalCode: AZIENDA.cap,
    addressLocality: AZIENDA.citta,
    addressRegion: 'RE',
    addressCountry: 'IT',
  },
})}</script>`;

/* ---------- home ---------- */
function home() {
  const r = '';
  const pezzi = `
      <svg class="taglio-svg" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <pattern id="fori" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="9" cy="9" r="1.15" fill="currentColor"/></pattern>
          <linearGradient id="raggio" x1="0" x2="1"><stop offset="0" stop-color="#aab6ff" stop-opacity="0"/><stop offset=".85" stop-color="#aab6ff" stop-opacity=".35"/><stop offset="1" stop-color="#eef0ff" stop-opacity="1"/></linearGradient>
          <pattern id="stampa" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)"><path d="M10 32c8-14 22-14 30 0s22 14 30 0M-22 32c8-14 22-14 30 0" fill="none" stroke="#7d8cff" stroke-width="1.2"/><circle cx="25" cy="12" r="2.2" fill="#7d8cff"/></pattern>
        </defs>
        <rect class="taglio-fori" width="1000" height="620" fill="url(#fori)"/>
        <rect class="taglio-stampa" width="1000" height="620" fill="url(#stampa)"/>
        <g class="taglio-pezzi">
          <g class="pezzo" data-pezzo>
            <path class="pezzo-forma" d="M118 96 L214 74 C226 128 286 150 334 126 L352 104 C356 176 388 226 432 246 L446 548 L104 552 L112 262 C134 216 132 154 118 96 Z"/>
            <path class="pezzo-filo" d="M276 230 V470 M266 244 l10-14 10 14 M266 456 l10 14 10-14"/>
            <path class="pezzo-tacche" d="M104 400 h14 M446 400 h-14 M228 552 v-12 M322 552 v-12"/>
          </g>
          <g class="pezzo" data-pezzo>
            <path class="pezzo-forma" d="M500 552 L520 330 C540 178 608 116 660 116 C712 116 780 178 800 330 L820 552 C760 566 560 566 500 552 Z"/>
            <path class="pezzo-filo" d="M660 230 V490 M650 244 l10-14 10 14 M650 476 l10 14 10-14"/>
            <path class="pezzo-tacche" d="M618 132 l6 12 M702 132 l-6 12 M660 116 v14"/>
          </g>
          <g class="pezzo" data-pezzo>
            <path class="pezzo-forma" d="M850 90 Q918 62 972 96 L962 168 Q912 140 858 160 Z"/>
            <path class="pezzo-filo" d="M884 128 H940"/>
          </g>
          <g class="pezzo" data-pezzo>
            <path class="pezzo-forma" d="M852 250 H964 V420 Q964 462 924 462 H892 Q852 462 852 420 Z"/>
            <path class="pezzo-filo" d="M908 290 V420 M898 304 l10-14 10 14"/>
          </g>
        </g>
        <g class="taglio-tracce"></g>
        <rect class="taglio-raggio" x="-120" y="0" width="120" height="620" fill="url(#raggio)"/>
        <g class="testa-taglio">
          <circle r="16" fill="none" stroke="currentColor" stroke-width="1.2"/>
          <path d="M0 -26V-8M0 8V26M-26 0H-8M8 0H26" stroke="currentColor" stroke-width="1.2"/>
          <circle r="2.4" fill="currentColor"/>
        </g>
      </svg>`;

  const galleria = [
    ['zund-operatrice', 'Sala taglio', 'Il taglio automatico guidato dallo schermo', 'g-alta'],
    ['taglio-testa', 'Testa di taglio', 'Il gruppo di taglio, da vicino', 'g-larga'],
    ['cartamodello', 'Cartamodelli', 'Cartamodelli pronti per la digitalizzazione', 'g-media'],
    ['proiettore', 'Proiezione', 'Il proiettore sopra il tavolo di taglio', 'g-stretta'],
    ['zund-portale', 'Scansione', 'Il portale che scansiona il tessuto', 'g-larga'],
    ['pannello', 'Comandi', 'Il pannello comandi di una macchina', 'g-media'],
    ['pressa', 'Pressa', 'Un operatore alla pressa', 'g-alta'],
  ];

  return `${testa({
    r,
    titolo: 'Devid srl, taglio tessuti e modellistica a Reggio Emilia',
    descrizione: 'Controllo tessuti, adesivazione, modellistica CAD-CAM, taglio computerizzato e confezione campioni a Vezzano sul Crostolo, Reggio Emilia. Dagli anni Cinquanta.',
    url: '/',
  })}
<body class="pagina-home">
<div class="carica" data-carica aria-hidden="true">
  <div class="carica-meta carica-su"></div>
  <div class="carica-meta carica-giu"></div>
  <div class="carica-dentro">
    <p class="carica-marchio"><span class="carica-segno">${G.forbici}</span><span data-carica-nome>Devid</span><sup>®</sup></p>
    <p class="carica-frase f1" data-frase="Taglio tessuti"></p>
    <p class="carica-frase f2" data-frase="Modellistica CAD-CAM"></p>
    <p class="carica-frase f3" data-frase="Vezzano sul Crostolo, Reggio Emilia"></p>
    <p class="carica-frase f4" data-frase="Dagli anni Cinquanta"></p>
    <span class="carica-laser"></span>
  </div>
</div>
${intestazione(r, '')}
<main id="contenuto">
  <section class="eroe" data-tema="scuro" data-eroe>
    <div class="eroe-foto" data-eroe-foto>
      <img src="assets/img/hero-laser-blu-1400.webp" srcset="assets/img/hero-laser-blu-800.webp 800w, assets/img/hero-laser-blu-1400.webp 1400w" sizes="100vw" alt="Le linee del laser di posizionamento proiettate sul tessuto steso sul tavolo di taglio" fetchpriority="high">
      <span class="eroe-scansione" aria-hidden="true"></span>
      <span class="grana" aria-hidden="true"></span>
    </div>
    <div class="eroe-testo">
      <h1 class="eroe-titolo">
        <span class="riga"><span class="riga-dentro">${etichetta('TAGLIO', ['CAD', 'CAM'])}Devid<sup>®</sup></span></span>
        <span class="riga"><span class="riga-dentro">Taglio tessuti e modellistica<span class="eroe-mirino">${G.mirino}</span><a class="eroe-srl" href="azienda/" data-tenda="Azienda">srl</a></span></span>
      </h1>
    </div>
    <p class="eroe-luogo"><span data-scramble-eroe>Vezzano sul Crostolo, Reggio Emilia</span></p>
    <p class="eroe-anni"><span data-scramble-eroe>Dagli anni ’50</span></p>
  </section>

  <section class="sessanta" aria-labelledby="sessanta-t">
    <h2 id="sessanta-t" class="nascosto">Sessant’anni di esperienza</h2>
    <div class="sessanta-quadro">
      <p class="cap cap-a" data-scramble>Sessant’anni</p>
      <p class="cap cap-b" data-scramble>di esperienza</p>
      <figure class="sessanta-foto" data-foto>
        <div class="foto-dentro" data-parallasse="-12">${img(r, 'metro', 'Metro da sarta e forbici appoggiati sulla macchina, davanti al rotolo di tessuto', { sizes: '(max-width: 760px) 70vw, 30vw' })}</div>
      </figure>
      <p class="cap cap-c" data-scramble>Dagli anni ’50</p>
      <a class="cap cap-d riga-link" href="azienda/" data-tenda="Azienda" data-linea><span data-gira>La nostra storia</span>${G.frecciaDx}</a>
    </div>
  </section>

  <section class="servizi" aria-labelledby="servizi-t">
    <div class="servizi-testa" data-linea>
      <h2 id="servizi-t" class="sopratitolo">Servizi</h2>
      <p class="sopratitolo">(${SERVIZI.length})</p>
    </div>
    <ul class="elenco-grande" data-elenco>
      ${SERVIZI.map((s) => `<li class="voce" data-linea>
        <a href="servizi/${s.slug}/" data-foto-voce="${s.foto}" data-tenda="${s.nome}">
          <span class="voce-nome"><span class="voce-testo">${s.nome}</span></span>
          <span class="voce-breve">${s.breve}</span>
          <span class="voce-mini">${img(r, s.foto, '', { sizes: '40vw' })}</span>
        </a>
      </li>`).join('')}
    </ul>
    <div class="finestra" aria-hidden="true" data-finestra>
      <div class="finestra-dentro">
        ${SERVIZI.map((s) => `<div class="finestra-foto" data-foto-nome="${s.foto}">${img(r, s.foto, '', { sizes: '30vw' })}</div>`).join('')}
      </div>
    </div>
  </section>

  <section class="manifesto" aria-labelledby="manifesto-t">
    <h2 id="manifesto-t" class="nascosto">Come lavoriamo</h2>
    <p class="manifesto-testo" data-parole>
      <span class="manifesto-segno">${etichetta('DAL', ['19', '50'])}</span>L’esperienza dell’artigianato italiano ${G.ago} unita alla ricerca e alle macchine più moderne. Generazioni di lavoro sartoriale ${G.rocchetto} e un aggiornamento continuo, per un tagliato preciso al millimetro ${G.metro} e capi che escono come devono.
    </p>
    <div class="manifesto-griglia">
      <figure class="manifesto-foto" data-foto>
        <div class="foto-dentro" data-parallasse="-10">${img(r, 'zund-postazione', 'Un’operatrice alla postazione del tavolo di taglio automatico', { sizes: '(max-width: 760px) 90vw, 34vw', larghe: true })}</div>
      </figure>
      <div class="manifesto-lato">
        <p class="testo" data-righe>Controlliamo il tessuto acquistato dal cliente, sviluppiamo i modelli al computer per consumarne il meno possibile, lo tagliamo in automatico e confezioniamo i campioni. Tutto a Vezzano sul Crostolo, senza viaggi fra un fornitore e l’altro.</p>
        <a class="riga-link" href="azienda/" data-linea data-tenda="Azienda"><span data-gira>Azienda</span>${G.frecciaDx}</a>
        <a class="riga-link" href="contatti/" data-linea data-tenda="Contatti"><span data-gira>Dove siamo</span>${G.frecciaDx}</a>
      </div>
    </div>
  </section>

  <section class="taglio" data-tema="scuro" data-taglio aria-labelledby="taglio-t">
    <div class="taglio-palco">
      <div class="taglio-testa">
        <p class="sopratitolo" data-scramble>Taglio con l’intelligenza artificiale</p>
        <h2 id="taglio-t" class="taglio-titolo" data-righe>Il taglio del futuro<br>è già presente.</h2>
      </div>
      <div class="taglio-tavolo">${pezzi}</div>
      <ol class="taglio-fasi">
        <li class="fase" data-fase>
          <p class="fase-nome">Scansione</p>
          <p class="fase-testo">Il portale legge tutta la pezza: allover, immagini, stampa digitale, loghi e motivi ripetuti.</p>
        </li>
        <li class="fase" data-fase>
          <p class="fase-nome">Piazzamento</p>
          <p class="fase-testo">I pezzi si incastrano sul tessuto per consumarne il meno possibile, anche da file DXF di qualsiasi CAD-CAM.</p>
        </li>
        <li class="fase" data-fase>
          <p class="fase-nome">Taglio</p>
          <p class="fase-testo">Automatico e senza tensioni, fino a <span class="dato" data-conta="7">7</span> cm di materasso.</p>
        </li>
      </ol>
      <p class="taglio-partner">Con <strong>Crea Solution</strong>, partner di Devid</p>
    </div>
  </section>

  <section class="laboratorio" data-laboratorio aria-labelledby="lab-t">
    <div class="laboratorio-testa">
      <h2 id="lab-t" class="laboratorio-titolo" data-righe>Dentro il laboratorio</h2>
      <p class="sopratitolo" data-scramble>Vezzano sul Crostolo</p>
    </div>
    <div class="laboratorio-binario" data-binario>
      ${galleria.map(([f, nome, alt, cls]) => `<figure class="scatto ${cls}">
        <div class="scatto-quadro"><div class="scatto-dentro">${img(r, f, alt, { sizes: '(max-width: 760px) 80vw, 40vw', larghe: f.startsWith('zund') })}</div></div>
        <figcaption><span>${nome}</span></figcaption>
      </figure>`).join('')}
      <a class="scatto scatto-fine" href="servizi/taglio-tessuti/" data-tenda="Taglio computerizzato">
        <span class="scatto-fine-testo">Vedi il parco macchine</span>${G.frecciaDx}
      </a>
    </div>
  </section>

  <section class="numeri" aria-labelledby="numeri-t">
    <div class="numeri-testa" data-linea>
      <h2 id="numeri-t" class="sopratitolo">Il parco macchine</h2>
      <p class="sopratitolo">(6)</p>
    </div>
    <ul class="numeri-elenco">
      ${[
        ['7', 'cm', 'di materasso con l’Investronica Diamond'],
        ['5', 'cm', 'di materasso con il Morgan Next 2'],
        ['200', 'cm', 'di altezza utile del plotter Algotex Stream 180'],
        ['1', 'm', 'di diametro dei rotoli al banco di controllo'],
        ['2', '', 'stenditori elettronici, Oteman e Bkr, con conveyor'],
        ['20', 's', 'al massimo di prova vapore col metodo Hoffman'],
      ].map(([n, u, t]) => `<li class="numero-voce" data-linea>
        <p class="numero-cifra"><span data-conta="${n}">${n}</span><small>${u}</small></p>
        <p class="numero-testo">${t}</p>
      </li>`).join('')}
    </ul>
  </section>

  <section class="settori" aria-labelledby="settori-t">
    <div class="settori-sx">
      <h2 id="settori-t" class="sopratitolo" data-scramble>Per chi tagliamo</h2>
    </div>
    <ul class="settori-elenco">
      ${['Moda e lusso', 'Automotive', 'Arredamento', 'Modellistica', 'Sanitario'].map((s) => `<li data-linea><span class="settore" data-righe>${s}</span></li>`).join('')}
    </ul>
  </section>

  <section class="ultime" aria-labelledby="ultime-t">
    <div class="ultime-testa">
      <h2 id="ultime-t" class="ultime-titolo" data-righe>Ultime novità</h2>
      <p class="ultime-conta">(${NEWS.length})</p>
    </div>
    <div class="ultime-griglia">
      <p class="sopratitolo" data-linea>News</p>
      <ul class="ultime-elenco">
        ${NEWS.map((n) => `<li data-linea><a href="news/${n.slug}/" data-tenda="${n.titolo}" data-foto-voce="${n.foto}"><span data-gira>${n.titolo}</span><time datetime="${n.data}">${n.dataIt}</time></a></li>`).join('')}
        <li data-linea><a href="assets/devid-srl-brochure.pdf" target="_blank" rel="noopener"><span data-gira>La brochure di Devid</span><span>PDF ${G.freccia}</span></a></li>
      </ul>
    </div>
  </section>
</main>
${piede(r)}
${schema()}
${coda(r)}`;
}

/* ---------- pagina servizio ---------- */
const blocco = (b) => {
  if (b.tipo === 'testo')
    return `<section class="blocco">
      <h2 class="blocco-titolo" data-linea><span data-scramble>${b.titolo}</span></h2>
      <div class="blocco-corpo">${b.testo.map((t) => `<p class="testo-grande" data-righe>${t}</p>`).join('')}</div>
    </section>`;
  if (b.tipo === 'righe')
    return `<section class="blocco">
      <h2 class="blocco-titolo" data-linea><span data-scramble>${b.titolo}</span></h2>
      <dl class="blocco-righe">${b.righe.map(([n, t]) => `<div class="riga-dato" data-linea><dt data-righe>${n}</dt><dd>${t}</dd></div>`).join('')}</dl>
    </section>`;
  if (b.tipo === 'tabella')
    return `<section class="blocco">
      <h2 class="blocco-titolo" data-linea><span data-scramble>${b.titolo}</span></h2>
      <div class="blocco-corpo">
        <p class="testo" data-righe>${b.testo}</p>
        <div class="tabella-scorre"><table class="tabella">
          <thead><tr>${b.colonne.map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead>
          <tbody>${b.righe.map((rr) => `<tr data-linea><td>${rr[0]}</td><td><span class="campanello campanello-${rr[1]}">${rr[1]}</span></td><td>${rr[2]}</td></tr>`).join('')}</tbody>
        </table></div>
      </div>
    </section>`;
  return '';
};

function servizio(s, i) {
  const r = '../../';
  const dopo = SERVIZI[(i + 1) % SERVIZI.length];
  return `${testa({ r, titolo: `${s.nome}, Devid srl`, descrizione: s.breve, url: `/servizi/${s.slug}/` })}
<body class="pagina-interna">
${intestazione(r, 'servizi/')}
<main id="contenuto">
  <section class="apertura">
    <nav class="briciole" aria-label="Sei qui"><a href="${r}servizi/" data-tenda="Servizi"><span data-gira>Servizi</span></a><span>/</span><span data-scramble>${s.nome}</span></nav>
    <h1 class="apertura-titolo">${s.titolo.map((t) => `<span class="riga"><span class="riga-dentro">${t}</span></span>`).join('')}</h1>
    <div class="apertura-sotto">
      <a class="indietro" href="${r}servizi/" data-tenda="Servizi" data-indietro>${G.frecciaDx}<span>Tutti i servizi</span></a>
      <p class="apertura-testo" data-righe>${s.apertura}</p>
    </div>
  </section>
  <figure class="foto-piena" data-foto-piena>
    <div class="foto-dentro" data-parallasse="-14">${img(r, s.foto, s.alt, { carica: 'eager', larghe: !!s.larghe })}</div>
  </figure>
  <div class="blocchi">
    ${s.blocchi.map(blocco).join('')}
  </div>
  <section class="prossimo">
    <a href="${r}servizi/${dopo.slug}/" data-tenda="${dopo.nome}" class="prossimo-link">
      <span class="sopratitolo">Servizio successivo</span>
      <span class="prossimo-nome"><span class="voce-testo">${dopo.nome}</span></span>
      <span class="prossimo-foto">${img(r, dopo.foto, '', { sizes: '40vw' })}</span>
    </a>
  </section>
</main>
${piede(r)}
${coda(r)}`;
}

function elencoServizi() {
  const r = '../';
  return `${testa({ r, titolo: 'Servizi, Devid srl', descrizione: 'Controllo tessuti, adesivazione, modellistica CAD-CAM, taglio computerizzato e confezione campioni: tutte le lavorazioni sotto lo stesso tetto.', url: '/servizi/' })}
<body class="pagina-interna">
${intestazione(r, 'servizi/')}
<main id="contenuto">
  <section class="apertura">
    <p class="sopratitolo" data-scramble>Cinque lavorazioni, un solo stabilimento</p>
    <h1 class="apertura-titolo"><span class="riga"><span class="riga-dentro">Servizi</span></span></h1>
    <div class="apertura-sotto">
      <span></span>
      <p class="apertura-testo" data-righe>Le fasi che fanno un capo, dalla pezza appena arrivata al campione cucito. Si possono chiedere tutte insieme o una per volta.</p>
    </div>
  </section>
  <section class="servizi servizi-pagina">
    <ul class="elenco-grande" data-elenco>
      ${SERVIZI.map((s) => `<li class="voce" data-linea>
        <a href="${s.slug}/" data-foto-voce="${s.foto}" data-tenda="${s.nome}">
          <span class="voce-nome"><span class="voce-testo">${s.nome}</span></span>
          <span class="voce-breve">${s.breve}</span>
          <span class="voce-mini">${img(r, s.foto, '', { sizes: '40vw' })}</span>
        </a>
      </li>`).join('')}
    </ul>
    <div class="finestra" aria-hidden="true" data-finestra>
      <div class="finestra-dentro">
        ${SERVIZI.map((s) => `<div class="finestra-foto" data-foto-nome="${s.foto}">${img(r, s.foto, '', { sizes: '30vw' })}</div>`).join('')}
      </div>
    </div>
  </section>
</main>
${piede(r)}
${coda(r)}`;
}

function azienda() {
  const r = '../';
  return `${testa({ r, titolo: 'Azienda, Devid srl', descrizione: 'Generazioni di lavoro sartoriale dagli anni Cinquanta e macchine sempre aggiornate: chi è Devid srl.', url: '/azienda/' })}
<body class="pagina-interna">
${intestazione(r, 'azienda/')}
<main id="contenuto">
  <section class="apertura">
    <p class="sopratitolo" data-scramble>Chi siamo, cosa facciamo</p>
    <h1 class="apertura-titolo"><span class="riga"><span class="riga-dentro">Dagli anni ’50,</span></span><span class="riga"><span class="riga-dentro">con le mani e il CAD</span></span></h1>
    <div class="apertura-sotto">
      <span></span>
      <p class="apertura-testo" data-righe>L’esperienza accumulata in generazioni di lavoro sartoriale, insieme ai continui aggiornamenti tecnologici, ci permette di garantire alti standard qualitativi al prodotto finito.</p>
    </div>
  </section>
  <figure class="foto-piena" data-foto-piena>
    <div class="foto-dentro" data-parallasse="-14">${img(r, 'zund-sala', 'La sala taglio di Devid a Vezzano sul Crostolo', { carica: 'eager', larghe: true })}</div>
  </figure>
  <div class="blocchi">
    <section class="blocco">
      <h2 class="blocco-titolo" data-linea><span data-scramble>Il metodo</span></h2>
      <dl class="blocco-righe">
        <div class="riga-dato" data-linea><dt data-righe>Il tessuto prima di tutto</dt><dd>Controlliamo la qualità del tessuto acquistato dal cliente: un risparmio di tempo ed energie in tutte le fasi successive della lavorazione.</dd></div>
        <div class="riga-dato" data-linea><dt data-righe>Il modello al computer</dt><dd>La modellistica computerizzata ottimizza i consumi di tessuto e tiene sempre una copia aggiornata dei lavori.</dd></div>
        <div class="riga-dato" data-linea><dt data-righe>Il taglio automatico</dt><dd>Unito al modello digitale, garantisce la massima precisione del tagliato.</dd></div>
        <div class="riga-dato" data-linea><dt data-righe>Il campione cucito</dt><dd>Operatrici con esperienza decennale e macchinari aggiornati, nello stesso stabilimento.</dd></div>
      </dl>
    </section>
    <section class="doppia">
      <figure class="doppia-foto" data-foto><div class="foto-dentro" data-parallasse="-10">${img(r, 'cartamodello', 'Un modellista sistema i cartamodelli sul tavolo', { sizes: '(max-width: 760px) 90vw, 45vw' })}</div></figure>
      <figure class="doppia-foto doppia-bassa" data-foto><div class="foto-dentro" data-parallasse="-16">${img(r, 'metro', 'Metro e forbici sulla macchina', { sizes: '(max-width: 760px) 90vw, 35vw' })}</div></figure>
    </section>
    <section class="blocco">
      <h2 class="blocco-titolo" data-linea><span data-scramble>Nell’emergenza</span></h2>
      <div class="blocco-corpo">
        <p class="testo-grande" data-righe>Durante la pandemia abbiamo messo la nostra esperienza nei tessuti al servizio dell’emergenza sanitaria, producendo mascherine, tute e camici in poliestere idrorepellente.</p>
        <a class="riga-link" href="${r}news/tute-e-camici-in-poliestere/" data-linea data-tenda="Tute e camici"><span data-gira>Leggi la notizia</span>${G.frecciaDx}</a>
      </div>
    </section>
  </div>
</main>
${piede(r)}
${coda(r)}`;
}

function contatti() {
  const r = '../';
  return `${testa({ r, titolo: 'Contatti e dove siamo, Devid srl', descrizione: 'Devid srl, via Achille Grandi 12, 42030 Vezzano sul Crostolo (RE). Telefono 0522 606201, info@devidsrl.it.', url: '/contatti/' })}
<body class="pagina-interna">
${intestazione(r, 'contatti/')}
<main id="contenuto">
  <section class="apertura">
    <p class="sopratitolo" data-scramble>Richieste tecniche o commerciali</p>
    <h1 class="apertura-titolo"><span class="riga"><span class="riga-dentro">Parliamo del</span></span><span class="riga"><span class="riga-dentro">vostro tessuto</span></span></h1>
  </section>
  <section class="contatti">
    <a class="contatto" href="mailto:${AZIENDA.email}" data-linea>
      <span class="sopratitolo">Email</span><span class="contatto-valore"><span class="voce-testo">${AZIENDA.email}</span></span>${G.freccia}
    </a>
    <a class="contatto" href="tel:${AZIENDA.telLink}" data-linea>
      <span class="sopratitolo">Telefono</span><span class="contatto-valore"><span class="voce-testo">${AZIENDA.telefono}</span></span>${G.freccia}
    </a>
    <a class="contatto" href="${AZIENDA.mappa}" target="_blank" rel="noopener" data-linea>
      <span class="sopratitolo">Indirizzo</span><span class="contatto-valore"><span class="voce-testo">${AZIENDA.via}, ${AZIENDA.citta}</span></span>${G.freccia}
    </a>
  </section>
  <div class="blocchi">
    <section class="blocco">
      <h2 class="blocco-titolo" data-linea><span data-scramble>Dove siamo</span></h2>
      <dl class="blocco-righe">
        <div class="riga-dato" data-linea><dt data-righe>Dall’autostrada</dt><dd>Uscite a Reggio Emilia e prendete la SS 63 in direzione Passo del Cerreto.</dd></div>
        <div class="riga-dato" data-linea><dt data-righe>A Puianello</dt><dd>Alla rotonda proseguite sempre in direzione Passo del Cerreto per 2,5 km.</dd></div>
        <div class="riga-dato" data-linea><dt data-righe>Il ritiro del tessuto</dt><dd>Nella nostra sede di via Grandi 12/A, in porto franco.</dd></div>
      </dl>
    </section>
    <figure class="mappa" data-foto>
      <iframe title="Mappa: Devid srl a Vezzano sul Crostolo" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=10.5150%2C44.5940%2C10.5560%2C44.6150&amp;layer=mapnik"></iframe>
      <a class="pillola" href="${AZIENDA.mappa}" target="_blank" rel="noopener" data-magnete><span class="pillola-fondo"></span><span class="pillola-testo">Apri in Google Maps ${G.freccia}</span></a>
    </figure>
  </div>
</main>
${piede(r)}
${coda(r)}`;
}

function elencoNews() {
  const r = '../';
  return `${testa({ r, titolo: 'News, Devid srl', descrizione: 'Le novità di Devid srl: macchine nuove, lavorazioni, produzione.', url: '/news/' })}
<body class="pagina-interna">
${intestazione(r, 'news/')}
<main id="contenuto">
  <section class="apertura">
    <p class="sopratitolo" data-scramble>Dal laboratorio</p>
    <h1 class="apertura-titolo"><span class="riga"><span class="riga-dentro">Ultime novità</span></span></h1>
  </section>
  <section class="servizi servizi-pagina">
    <ul class="elenco-grande elenco-news" data-elenco>
      ${NEWS.map((n) => `<li class="voce" data-linea>
        <a href="${n.slug}/" data-foto-voce="${n.foto}" data-tenda="${n.titolo}">
          <span class="voce-nome"><span class="voce-testo">${n.titolo}</span></span>
          <span class="voce-breve"><time datetime="${n.data}">${n.dataIt}</time></span>
          <span class="voce-mini">${img(r, n.foto, '', { sizes: '40vw' })}</span>
        </a>
      </li>`).join('')}
    </ul>
    <div class="finestra" aria-hidden="true" data-finestra>
      <div class="finestra-dentro">
        ${NEWS.map((n) => `<div class="finestra-foto" data-foto-nome="${n.foto}">${img(r, n.foto, '', { sizes: '30vw' })}</div>`).join('')}
      </div>
    </div>
  </section>
</main>
${piede(r)}
${coda(r)}`;
}

function articolo(n) {
  const r = '../../';
  return `${testa({ r, titolo: `${n.titolo}, Devid srl`, descrizione: n.testo[0].slice(0, 150), url: `/news/${n.slug}/` })}
<body class="pagina-interna">
${intestazione(r, 'news/')}
<main id="contenuto">
  <article>
    <section class="apertura">
      <nav class="briciole" aria-label="Sei qui"><a href="${r}news/" data-tenda="News"><span data-gira>News</span></a><span>/</span><time data-scramble datetime="${n.data}">${n.dataIt}</time></nav>
      <h1 class="apertura-titolo"><span class="riga"><span class="riga-dentro">${n.titolo}</span></span></h1>
    </section>
    <figure class="foto-piena foto-piena-bassa" data-foto-piena>
      <div class="foto-dentro" data-parallasse="-14">${img(r, n.foto, n.alt, { carica: 'eager' })}</div>
    </figure>
    <div class="blocchi">
      <section class="blocco">
        <p class="blocco-titolo" data-linea><span data-scramble>${n.dataIt}</span></p>
        <div class="blocco-corpo">${n.testo.map((t) => `<p class="testo-grande" data-righe>${t}</p>`).join('')}
          <a class="riga-link" href="${r}news/" data-linea data-tenda="News" data-indietro><span data-gira>Tutte le novità</span>${G.frecciaDx}</a>
        </div>
      </section>
    </div>
  </article>
</main>
${piede(r)}
${coda(r)}`;
}

function privacy() {
  const r = '../';
  return `${testa({ r, titolo: 'Privacy, Devid srl', descrizione: 'Informativa sulla privacy del sito di Devid srl.', url: '/privacy/' })}
<body class="pagina-interna">
${intestazione(r, '')}
<main id="contenuto">
  <section class="apertura">
    <p class="sopratitolo">Informativa</p>
    <h1 class="apertura-titolo"><span class="riga"><span class="riga-dentro">Privacy</span></span></h1>
  </section>
  <div class="blocchi">
    <section class="blocco">
      <h2 class="blocco-titolo" data-linea><span>Titolare</span></h2>
      <div class="blocco-corpo"><p class="testo">${AZIENDA.nome}, ${AZIENDA.via}, ${AZIENDA.cap} ${AZIENDA.citta} (${AZIENDA.prov}), P. IVA ${AZIENDA.piva}. Per ogni richiesta: <a href="mailto:${AZIENDA.email}">${AZIENDA.email}</a>.</p></div>
    </section>
    <section class="blocco">
      <h2 class="blocco-titolo" data-linea><span>Cookie</span></h2>
      <div class="blocco-corpo"><p class="testo">Questo sito non usa cookie di profilazione né strumenti di statistica. Caratteri e script sono caricati dal sito stesso, senza servizi esterni. Ricorda soltanto, per la durata della visita, che l’animazione d’apertura è già stata vista.</p></div>
    </section>
    <section class="blocco">
      <h2 class="blocco-titolo" data-linea><span>Mappa</span></h2>
      <div class="blocco-corpo"><p class="testo">Nella pagina Contatti la mappa è fornita da OpenStreetMap, che riceve l’indirizzo IP di chi la visualizza. Il collegamento a Google Maps si apre solo se lo si sceglie.</p></div>
    </section>
    <section class="blocco">
      <h2 class="blocco-titolo" data-linea><span>Email e telefono</span></h2>
      <div class="blocco-corpo"><p class="testo">I dati che ci mandate scrivendoci o chiamandoci li usiamo solo per rispondere alla vostra richiesta. Potete chiederne in ogni momento la cancellazione all’indirizzo qui sopra.</p></div>
    </section>
  </div>
</main>
${piede(r)}
${coda(r)}`;
}

function nonTrovata() {
  const r = '/';
  return `${testa({ r, titolo: 'Pagina non trovata, Devid srl', descrizione: 'La pagina cercata non esiste.', url: '/404' })}
<body class="pagina-interna">
${intestazione(r, '')}
<main id="contenuto">
  <section class="apertura apertura-404">
    <p class="sopratitolo" data-scramble>Errore 404</p>
    <h1 class="apertura-titolo"><span class="riga"><span class="riga-dentro">Questo pezzo</span></span><span class="riga"><span class="riga-dentro">non è nel piazzato</span></span></h1>
    <div class="apertura-sotto"><span></span><a class="pillola" href="/" data-magnete data-tenda="Devid srl"><span class="pillola-fondo"></span><span class="pillola-testo">Torna alla home ${G.frecciaDx}</span></a></div>
  </section>
</main>
${piede(r)}
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
