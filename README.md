# Il sito di Devid srl

Sito nuovo per Devid srl, taglio tessuti e modellistica (Vezzano sul Crostolo, RE). È un sito statico: HTML, CSS e JavaScript, senza server né database. Si può caricare così com'è su qualunque hosting (Aruba, Netlify, Cloudflare Pages, GitHub Pages…).

## Il riferimento

Il linguaggio visivo viene da **Locomotive** (locomotive.ca), l'agenzia di Montréal premiata più volte su Awwwards: titoli grandi in un serif stretto, filetti sottili, didascalie piccole sparse intorno alle foto, l'elenco gigante centrato con la foto che segue il cursore, l'indirizzo grande in fondo con i riquadri disegnati dentro le righe, lo scroll morbido. Il codice, i testi, le foto e i caratteri sono tutti nostri o di Devid: niente è copiato dal loro sito.

## Le parti

- **Caricamento** (solo alla prima visita): le scritte che si compongono, il raggio che taglia lo schermo e lo apre sulla foto.
- **Apertura**: la foto delle linee laser sul tessuto, in blu, con la luce di controllo che scorre e la grana della pellicola.
- **Servizi**: l'elenco gigante. Sul computer la foto segue il cursore; sul telefono c'è la miniatura accanto.
- **Manifesto**: le parole si accendono mentre si scorre.
- **Il taglio con l'intelligenza artificiale**: la sezione resta ferma e scorrendo si vedono la scansione, il piazzamento dei pezzi e la testa di taglio che segue ogni contorno.
- **Dentro il laboratorio**: le foto scorrono di lato.
- Parco macchine, settori, novità, l'invito a scrivere e il piede con l'indirizzo.
- Fra una pagina e l'altra, la tendina nera col nome della pagina.
- Chi ha attivato «riduci movimento» nel telefono vede tutto fermo, solo con le dissolvenze.

## Le pagine

Home, Servizi (più una pagina per ognuno dei cinque), Azienda, Contatti con le indicazioni stradali e la mappa, News (due articoli), Privacy, pagina 404. Ci sono anche `sitemap.xml`, `robots.txt`, le icone e i dati per Google (LocalBusiness).

## Come si modifica

I testi stanno tutti in `genera.mjs`. Dopo una modifica:

```bash
node genera.mjs
```

e le pagine HTML si riscrivono. Lo stile è in `assets/css/sito.css`, il movimento in `assets/js/sito.js`.

Per vederlo sul computer serve un piccolo server, perché le pagine stanno in cartelle:

```bash
python3 -m http.server 8000
```

poi si apre http://localhost:8000.

## Da confermare con Devid

- **«Sessant'anni di esperienza» e «dagli anni ’50»**: li dice il sito attuale (scritto nel 2020). Se l'attività è degli anni Cinquanta, oggi gli anni sono più di settanta: meglio chiedere la data giusta.
- **Indirizzo**: il sito attuale scrive sia «via Grandi 12» sia «via Grandi 12/A» (il ritiro del tessuto). Qui sono rimasti tutti e due così.
- **Il logo**: c'è solo un JPG piccolo (219 per 80). Nel sito il marchio è scritto col carattere del sito; se Devid ha il logo in vettoriale (SVG, AI, PDF) lo si mette al suo posto.
- **Crea Solution** come partner per il taglio con l'AI e i macchinari (Morgan Next 2, Investronica Diamond, stenditori Oteman e Bkr, plotter Algotex Stream 180, Datacolor 3890): presi dal sito attuale, da confermare che ci siano ancora tutti.
- **Le foto** sono quelle del sito attuale, ritoccate per avere lo stesso colore. Con un servizio fotografico nuovo (soprattutto in verticale e in alta risoluzione) il sito farebbe ancora più effetto.
- **Le news** sono le due del 2020: se ci sono novità recenti, si aggiungono in `NEWS` dentro `genera.mjs`.
- La mappa è di OpenStreetMap, così il sito non mette cookie e non serve il banner.

## Caratteri e librerie

Instrument Serif e Inter Tight (licenza SIL Open Font, file in `assets/fonts`), GSAP 3.13 e Lenis 1.3, tutti caricati dal sito stesso: nessun servizio esterno.
