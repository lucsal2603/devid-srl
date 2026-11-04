# Il sito di Devid srl

Sito nuovo per Devid srl, taglio tessuti e modellistica (Vezzano sul Crostolo, RE). È un sito statico: HTML, CSS e JavaScript, senza server né database. Si può caricare così com'è su qualunque hosting (Aruba, Netlify, Cloudflare Pages, GitHub Pages…).

## Il riferimento

Lo stile viene da **Lusion** (lusion.co), lo studio inglese di siti in 3D premiato più volte su Awwwards: fondo chiaro lavanda, grandi carte arrotondate, blu, bianco e nero, un oggetto 3D vero che risponde al mouse, contatore nel caricamento, bottoni a pillola. Codice, testi, foto e caratteri sono tutti nostri o di Devid: dal loro sito non è copiato niente.

## Le parti

- **Caricamento** (solo alla prima visita): il contatore da 0 a 100 e la barra, poi il nero che sale e scopre la pagina.
- **Apertura**: un vero tessuto in 3D (simulazione fisica, saia, cimosa con la scritta Devid, orli cuciti), appeso a una barra in metallo con gli anelli. Ha la memoria della forma: quando nessuno lo tocca torna sempre a pendere dritto e non resta mai attorcigliato. Arriva che scende ondeggiando. Il mouse lo spinge come una mano. Scorrendo, il laser lo taglia dall'alto in basso con le scintille e il bordo che resta acceso, poi le due metà si aprono come un sipario e appare «Il taglio del futuro è già presente».
- Tutta la home resta del blu notte dell'apertura, fino al fondo.
- **Chi siamo**: al centro, la frase che si accende parola per parola.
- **Servizi**: sul modello di Cuberto (cuberto.com, Agenzia dell'anno su Awwwards). Le cinque carte si accendono una dopo l'altra mentre si scorre: da spente e grigie diventano scure e vive, con titolo, descrizione, tag e «Scopri». Ognuna ha il suo disegno animato: la luce del banco che passa sulla trama e trova un fallo (controllo), due teli che si uniscono col calore (adesivazione), le sagome del cartamodello che si disegnano con le quote (modellistica), la testa di taglio che segue il percorso (taglio), le cuciture che corrono (confezione). Al passaggio del mouse il disegno accelera.
- **Parco macchine**: sul modello di «Rejouice at a Glance» (rejouice.com, premiato su Awwwards). La sezione si ferma e una fila di carte scorre di lato: carte coi numeri (7 cm, 200 cm, 1 m, 20 s) scure, chiare e blu che contano entrando, alternate alle foto delle macchine col nome (Crea Solution, Morgan Next 2, Oteman e Bkr, Intelli-di). Le carte entrano storte e si raddrizzano.
- **Dentro il laboratorio**: sul modello della galleria di Aristide Benoist (aristidebenoist.com, premiato su Awwwards). Quattordici foto del reparto sono strisce verticali sottili in bianco e nero, come i fili di un ordito. Scorrendo, la striscia al centro si allarga e diventa a colori, con nome e reparto sotto; col mouse si apre quella sotto il cursore; si può trascinare e le strisce si piegano in 3D con la velocità. In alto un metro da sarta da 0 a 140 cm con l'ago blu che segna il punto.
- **Per chi tagliamo**: righe bianche che diventano blu al passaggio, con la foto.
- **Ultime novità**: sul modello degli «Highlights» di Rejouice. Ogni notizia, e la brochure, è una grande immagine a tutto schermo col titolo al centro; scorrendo la successiva sale e copre la precedente, che si rimpicciolisce e si scurisce.
- La **carta blu** con i fili della trama che si scostano sotto il mouse, il piede col logo gigante.
- Fra una pagina e l'altra, il pannello blu col nome della pagina.
- Senza WebGL al posto del tessuto si vede la foto. Chi ha attivato «riduci movimento» vede il tessuto fermo e niente spostamenti.

## Le pagine

Home, Servizi (più una pagina per ognuno dei cinque), Azienda, Contatti con le indicazioni stradali e la mappa, News (due articoli), Privacy, pagina 404. Ci sono anche `sitemap.xml`, `robots.txt`, le icone e i dati per Google (LocalBusiness).

## Come si modifica

I testi stanno in `contenuti.mjs`, la struttura delle pagine in `genera.mjs`. Dopo una modifica:

```bash
node genera.mjs
```

e le pagine HTML si riscrivono. Lo stile è in `assets/css/sito.css`, il movimento in `assets/js/sito.js`, il tessuto 3D in `assets/js/tessuto.js`.

Per vederlo sul computer serve un piccolo server, perché le pagine stanno in cartelle:

```bash
python3 -m http.server 8000
```

poi si apre http://localhost:8000.

## Da confermare con Devid

- **«Sessant'anni di esperienza» e «dagli anni ’50»**: li dice il sito attuale (scritto nel 2020). Se l'attività è degli anni Cinquanta, oggi gli anni sono più di settanta: meglio chiedere la data giusta.
- **Indirizzo**: il sito attuale scrive sia «via Grandi 12» sia «via Grandi 12/A» (il ritiro del tessuto). Qui sono rimasti tutti e due così.
- **Il logo**: è il loro, preso dal sito attuale (`devidsrl-new-logo-piccolo.jpg`, solo 219 per 80 pixel) e ricalcato fedelmente in vettoriale in `assets/logo-devid.svg` (colori originali) e `assets/logo-devid-bianco.svg` (per i fondi scuri), con le lettere a timbro e la grana. Le icone del sito sono la loro icona attuale. Se Devid ha il file originale del logo (AI, EPS, PDF o SVG) basta sostituire quei due file e il risultato sarà ancora più preciso.
- **Crea Solution** come partner per il taglio con l'AI e i macchinari (Morgan Next 2, Investronica Diamond, stenditori Oteman e Bkr, plotter Algotex Stream 180, Datacolor 3890): presi dal sito attuale, da confermare che ci siano ancora tutti.
- **Le foto** sono quelle del sito attuale, ritoccate per avere lo stesso colore. Con un servizio fotografico nuovo (soprattutto in verticale e in alta risoluzione) il sito farebbe ancora più effetto.
- **Le news** sono le due del 2020: se ci sono novità recenti, si aggiungono in `NEWS` dentro `contenuti.mjs`.
- La mappa è di OpenStreetMap, così il sito non mette cookie e non serve il banner.

## Caratteri e librerie

Inter Tight e IBM Plex Mono (licenza SIL Open Font, file in `assets/fonts`), GSAP 3.13, Lenis 1.3 e Three.js 0.170, tutti caricati dal sito stesso: nessun servizio esterno.
