/* I contenuti del sito di Devid srl, presi dal sito attuale devidsrl.it. */
export const AZIENDA = {
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

/* ---------- servizi ---------- */
export const SERVIZI = [
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

export const NEWS = [
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

