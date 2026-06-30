# PDF Bookmarks URL — Documentazione

Script Node-RED che aggiunge segnalibri automatici a un PDF di listino,
partendo da un file JSON di dati prodotto.

---

## Cosa fa in breve

1. Legge un elenco di prodotti dal JSON (`records`).
2. Li organizza in un albero gerarchico a 3 livelli: **CL1 → CL2 → CL3 → Modello → Codice prodotto → Accessori**.
3. Apre il PDF del listino e cerca al suo interno dei "marcatori invisibili"
   (`#BMK_...`) che erano stati inseriti lato HTML prima della conversione in PDF.
4. Abbina ogni voce dell'albero al marcatore corrispondente nel PDF, ricavando
   così il numero di pagina corretto.
5. Scrive i segnalibri nel PDF e salva il file di output.

---

## Flusso di esecuzione (passo per passo)

```
msg.payload.data  ──►  buildTree()  ──►  albero gerarchico
msg.payload.pdf   ──►  PDFDocument.load()  ──►  pdfDoc

pdfDoc  ──►  extractAnchorPages()  ──►  mappa { marcatore → [pagine] }

albero + mappa  ──►  treeToItems()  ──►  lista segnalibri { titolo, pagina }

lista  ──►  addOutlines()  ──►  PDF con segnalibri incorporati  ──►  file output
```

---

## Struttura del codice

| Funzione | Cosa fa |
|---|---|
| `buildTree()` | Legge i record, li ordina e costruisce l'albero dei segnalibri |
| `extractAnchorPages()` | Scorre le pagine del PDF e raccoglie tutti i marcatori `BMK_*` con i relativi numeri di pagina |
| `treeToItems()` | Percorre l'albero e, per ogni voce, cerca il marcatore corrispondente nel PDF per ottenere la pagina |
| `addOutlines()` | Scrive fisicamente i segnalibri nella struttura interna del PDF |
| `strcmp()` | Confronto alfabetico tra stringhe (usato per l'ordinamento) |
| `makeAnchor()` / `normalizeAnchorId()` | Trasformano il testo di una voce nel nome del marcatore HTML corrispondente (es. `"Sistemi di Finitura"` → `"BMK_CL_sistemi_di_finitura"`) |

---

## Parametri di configurazione (in cima allo script)

```js
const ROOT = env.get("ENV_CANON");      // cartella root del progetto
const records = msg.payload.data;       // dati prodotto dal messaggio in ingresso
const inputPdf = msg.payload.pdf;       // percorso del PDF sorgente
const outputPdf = path.join(ROOT, "out", "listino_canon_url.pdf");  // file di output
```

**Per cambiare il percorso del PDF di output**: modifica l'ultimo parametro
di `path.join(...)`.

---

## Cosa cambiare per le personalizzazioni più comuni

### 1. Cambiare l'ordinamento dei segnalibri

L'ordinamento è definito dentro `buildTree()`, nel blocco `.sort(...)`:

```js
const sorted = [...records].sort((a, b) => {
  for (const k of [
    "CL1_descrizione",   // ← 1° criterio di ordinamento
    "CL2_descrizione",   // ← 2° criterio
    "CL3_descrizione",   // ← 3° criterio
    "BOM_modelloanagraficamain",
    "ANAG_codice",
    "tipoacc_ordinevisualizzazione",
  ]) {
    ...
  }
```

- **Per ordinare per numero di categoria invece che per testo**: sostituire
  (o anteporre) i campi `CL1_descrizione`, `CL2_descrizione`, `CL3_descrizione`
  con i corrispondenti ID numerici `ANAG_class1`, `ANAG_class2`, `ANAG_class3`.
  Esempio:
  ```js
  const n = (k) => Number(a[k] ?? 0) - Number(b[k] ?? 0);
  return n("ANAG_class1") || n("ANAG_class2") || n("ANAG_class3") || strcmp(...);
  ```
  > ⚠️ Questo è importante se i segnalibri puntano a pagine sbagliate: vedi
  > il file `problema-segnalibri.md` per la spiegazione completa.

- **Per invertire l'ordine di una voce**: cambia `strcmp(a[k], b[k])` in
  `strcmp(b[k], a[k])` per quel campo.

---

### 2. Aggiungere o rimuovere livelli di gerarchia

La gerarchia attuale è: **CL1 → CL2 → CL3 → BOM → Codice → Accessorio → Codice accessorio**.

La struttura è costruita in `buildTree()` con blocchi `if (!map.has(key)) map.set(key, new Map())`.
Ogni livello aggiunto qui deve avere il suo ciclo corrispondente anche in
`treeToItems()` (dove si percorre l'albero) e in `addOutlines()` (dove si
scrivono i nodi).

> ⚠️ Modificare la gerarchia richiede di toccare **tre funzioni diverse** in
> modo coordinato. Non è consigliabile senza conoscere la struttura del codice.

---

### 3. Cambiare i campi dei record usati come etichette dei segnalibri

In `buildTree()`, le variabili `cl1`, `cl2`, `cl3`, `bom`, `code` vengono
lette direttamente dai campi del record JSON:

```js
const cl1  = rec.CL1_descrizione;
const cl2  = rec.CL2_descrizione;
const cl3  = rec.CL3_descrizione;
const bom  = rec.BOM_modelloanagraficamain;
const code = rec.ANAG_codice;
```

**Per usare un campo diverso come etichetta**, basta sostituire il nome del
campo. Ad esempio, per mostrare `ANAG_descr_loc` invece di `ANAG_codice`:

```js
const code = rec.ANAG_descr_loc;
```

> ⚠️ Il testo usato come etichetta **deve corrispondere esattamente** al testo
> del marcatore HTML nel PDF (dopo normalizzazione: tutto minuscolo, spazi → `_`,
> caratteri speciali rimossi). Se non c'è corrispondenza, il segnalibro non
> troverà la pagina giusta e verrà emesso un avviso (`node.warn`).

---

### 4. Cambiare il formato del marcatore HTML (prefisso BMK)

I marcatori nel PDF derivano da tag HTML del tipo `<a href="#BMK_CL_sistemi_di_finitura">`.
La logica di costruzione del nome del marcatore è in `makeAnchor()`:

```js
function makeAnchor(text, isCl = false) {
  const id = normalizeAnchorId(text);
  return isCl ? `BMK_CL_${id}` : `BMK_${id}`;
}
```

- I livelli **CL1, CL2, CL3** usano il prefisso `BMK_CL_` (per evitare
  conflitti con accessori omonimi).
- Tutti gli altri livelli usano il prefisso `BMK_`.

Se l'HTML del listino usa un prefisso diverso, va modificato qui e anche nel
pattern di ricerca dentro `extractAnchorPages()`:

```js
const match = /BMK_\w+/.exec(uriString);  // ← cambia "BMK_" con il tuo prefisso
```

---

### 5. Cambiare il percorso o il nome del file PDF di output

Modifica questa riga nella sezione di configurazione in cima allo script:

```js
const outputPdf = path.join(ROOT, "out", "listino_canon_url.pdf");
//                                         ↑ cambia questo nome
```

---

## Avvisi di warning e cosa significano

Durante l'esecuzione possono comparire avvisi nel log di Node-RED
(tab "Debug"). I più comuni:

| Avviso | Significato |
|---|---|
| `Anchor non trovata nel PDF: BMK_...` | Il marcatore HTML per quella voce non esiste nel PDF. La voce compare nel segnalibro ma punta alla pagina del suo genitore. |
| `Anchor ... senza occorrenze >= parentPage=N` | Il marcatore esiste, ma si trova fisicamente in una pagina precedente rispetto a dove ci si aspettava. Il segnalibro usa l'ultima occorrenza disponibile come stima. Spesso indica che l'ordinamento dell'albero non corrisponde all'ordine delle pagine nel PDF. |
| `Tabella di dettaglio accessori vuota.` | Un prodotto nel JSON non ha accessori. È normale per alcune categorie. |
