/**
 * VARIANTE URL-BASED dello script "PDF Bookmarks.js".
 *
 * Differenza fondamentale:
 *  - lo script originale individua le pagine target dei segnalibri cercando
 *    il testo nelle pagine del PDF (con pdfreader e coordinate raw);
 *  - qui invece ogni elemento da segnalibrare è già stato "taggato" lato HTML
 *    con un <a href="#BMK_<id>">testo</a>. Una volta convertito in PDF questi
 *    tag generano delle Link annotation con URI "#BMK_<id>". Basta scorrere
 *    le annotation di ogni pagina per costruire una mappa anchor -> pagina.
 *
 * Regole di normalizzazione (identiche al makeBMK lato HTML):
 *  - trim degli spazi iniziali/finali
 *  - lowercase
 *  - spazi interni -> "_"
 *  - tutti i caratteri non-word (\W) vengono rimossi
 *
 * Tutti i campi (BOM/ANAG_codice/tipoacc/ANAG_codice2) usano il prefisso
 * "BMK_". I campi CL1/CL2/CL3 usano invece il prefisso dedicato "BMK_CL_",
 * per evitare collisioni con voci di pari testo presenti più in basso nella
 * gerarchia (es. un accessorio chiamato come una categoria CL1).
 *
 * GESTIONE DUPLICATI
 * ------------------
 * Una stessa anchor (es. "BMK_prodotti_obsoleti", oppure un ANAG_codice2
 * presente sotto prodotti diversi) compare più volte nel PDF: una per ogni
 * occorrenza di quel testo. La gerarchia dell'albero le disambigua.
 *
 * Strategia: extractAnchorPages restituisce per ogni anchor l'ARRAY ordinato
 * di tutte le pagine in cui appare. Ogni nodo dell'albero chiama pageOf(...)
 * con la pagina del proprio genitore (parentPage) come limite inferiore:
 * viene scelta la prima occorrenza con indice >= parentPage. Poiché i nodi
 * fratelli vengono visitati in ordine e ciascuno ha parentPage crescente,
 * ogni occorrenza viene "abbinata" naturalmente al suo contesto gerarchico
 * senza bisogno di un cursore esplicito.
 *
 * LIVELLO ANAG_codice (sotto BOM)
 * --------------------------------
 * I codici tipo "KKKK..." non hanno un'ancora nel PDF: il bookmark esiste
 * (compare nell'outline) ma punta alla stessa pagina del BOM padre.
 */

const {
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFArray,
  PDFDict,
  PDFRef,
} = require("pdf-lib");
const fs = require("fs");
const path = require("path");

/**
 * Confronto stringhe robusto gestendo null/undefined.
 * @param {string} a
 * @param {string} b
 * @returns {number} -1 se a < b, 1 se a > b, 0 se uguali
 */
function strcmp(a, b) {
  const sa = String(a ?? "");
  const sb = String(b ?? "");
  return sa < sb ? -1 : sa > sb ? 1 : 0;
}

// ---------------------------------------------------------------------------
// ANCHOR NORMALIZATION
// ---------------------------------------------------------------------------

/**
 * Normalizza un testo riproducendo la stessa logica del makeBMK lato HTML.
 * @param {string} text
 * @returns {string} id normalizzato (senza prefisso BMK)
 */
function normalizeAnchorId(text) {
  if (text == null) return "";
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w]/g, "");
}

/**
 * Costruisce l'anchor finale a partire dal testo originale.
 * @param {string} text
 * @param {boolean} isCl true per i livelli CL1/CL2/CL3 (prefisso "BMK_CL_"),
 *                       false (default) per tutti gli altri (prefisso "BMK_")
 * @returns {string} es. "BMK_abc123" oppure "BMK_CL_abc123", "" se text vuoto
 */
function makeAnchor(text, isCl = false) {
  const id = normalizeAnchorId(text);
  if (!id) return "";
  return isCl ? `BMK_CL_${id}` : `BMK_${id}`;
}

// ---------------------------------------------------------------------------
// COSTRUZIONE ALBERO GERARCHICO (invariata rispetto allo script originale)
// ---------------------------------------------------------------------------

/**
 * Costruzione dell'albero gerarchico dei segnalibri a partire dai records.
 * @param {Array} records - Array di oggetti contenenti i dati dei segnalibri.
 * @param {Function} warn - Callback per i messaggi di avviso.
 * @returns {Map} - Mappa annidata rappresentante la gerarchia dei segnalibri.
 */
function buildTree(records, warn = console.warn) {
  // Ordinamento dei records per garantire la corretta gerarchia.
  const sorted = [...records].sort((a, b) => {
    for (const k of [
      "CL1_descrizione",
      "CL2_descrizione",
      "CL3_descrizione",
      "BOM_modelloanagraficamain",
      "ANAG_codice",
      "tipoacc_ordinevisualizzazione",
    ]) {
      const r = strcmp(a[k], b[k]);
      if (r !== 0) return r;
    }

    const ord =
      (Number(a.tipoacc_ordinevisualizzazione) || 0) -
      (Number(b.tipoacc_ordinevisualizzazione) || 0);
    if (ord !== 0) return ord;

    for (const k of ["ANAG_codice2", "ANAG_prtype"]) {
      const r = strcmp(a[k], b[k]);
      if (r !== 0) return r;
    }

    return (
      new Date(b.PRE_enddate ?? 0).getTime() -
      new Date(a.PRE_enddate ?? 0).getTime()
    );
  });

  /**
   * Struttura prodotta (Map annidate):
   *
   * tree
   * └── CL1
   *     └── CL2
   *         └── CL3
   *             └── BOM
   *                 └── CODE
   *                     └── ACCESSORIO
   *                         └── [CODE2, CODE2, ...]
   */
  const tree = new Map();

  for (const rec of sorted) {
    const cl1 = rec.CL1_descrizione;
    const cl2 = rec.CL2_descrizione;
    const cl3 = rec.CL3_descrizione;
    const bom = rec.BOM_modelloanagraficamain;
    const code = rec.ANAG_codice;

    if (!tree.has(cl1)) tree.set(cl1, new Map());
    const m1 = tree.get(cl1);

    if (!m1.has(cl2)) m1.set(cl2, new Map());
    const m2 = m1.get(cl2);

    if (!m2.has(cl3)) m2.set(cl3, new Map());
    const m3 = m2.get(cl3);

    if (!m3.has(bom)) m3.set(bom, new Map());
    const m4 = m3.get(bom);

    if (!m4.has(code)) m4.set(code, new Map());
    const m5 = m4.get(code);

    const details = rec.detail || [];
    if (details.length === 0) {
      warn("Tabella di dettaglio accessori vuota.");
    } else {
      for (const d of details) {
        const acc = (d.tipoacc_Descrizione ?? "").replace(/\u00AD/g, "").trim();
        const code2 = d.ANAG_codice2;
        if (!acc) continue;

        if (!m5.has(acc)) m5.set(acc, []);
        if (code2) m5.get(acc).push(code2);
      }
    }
  }

  return tree;
}

// ---------------------------------------------------------------------------
// ESTRAZIONE LINK ANNOTATION DAL PDF
// ---------------------------------------------------------------------------

/**
 * Decodifica un PDFString / PDFHexString in stringa JS.
 * @param {*} obj
 * @returns {string|null}
 */
function decodePdfString(obj) {
  if (!obj) return null;
  if (typeof obj.decodeText === "function") return obj.decodeText();
  if (typeof obj.asString === "function") return obj.asString();
  return obj.toString();
}

/**
 * Scorre tutte le pagine del PDF, individua le Link annotation e ricava
 * la mappa anchor (BMK_*) -> ARRAY di indici di pagina (0-based) in cui
 * quella anchor compare.
 *
 * Per ogni annotation di sottotipo /Link cerca prima l'azione /A /URI
 * (caso classico per <a href="#...">), poi in fallback la /Dest
 * (destinazione nominata).
 *
 * L'array di pagine è ordinato in modo crescente (le pagine vengono
 * iterate in ordine). Ogni pagina viene aggiunta UNA SOLA volta per
 * anchor, anche se la stessa anchor è ripetuta più volte su una stessa
 * pagina: per i bookmark serve solo la pagina target.
 *
 * @param {PDFDocument} pdfDoc
 * @returns {Map<string, number[]>} anchor -> array di pageIndex
 */
function extractAnchorPages(pdfDoc) {
  const result = new Map();
  const context = pdfDoc.context;
  const pages = pdfDoc.getPages();

  pages.forEach((page, pageIndex) => {
    const annotsRaw = page.node.get(PDFName.of("Annots"));
    if (!annotsRaw) return;

    // /Annots può essere PDFArray inline oppure un riferimento indiretto
    const annotsArr =
      annotsRaw instanceof PDFArray ? annotsRaw : context.lookup(annotsRaw);
    if (!annotsArr || typeof annotsArr.asArray !== "function") return;

    for (const entry of annotsArr.asArray()) {
      // ogni voce può essere un PDFRef oppure un PDFDict inline
      const annot = entry instanceof PDFRef ? context.lookup(entry) : entry;
      if (!annot || typeof annot.get !== "function") continue;

      const subtype = annot.get(PDFName.of("Subtype"));
      if (!subtype || subtype.toString() !== "/Link") continue;

      let uriString = null;

      // 1) Azione URI (caso normale per i link HTML convertiti)
      const A = annot.get(PDFName.of("A"));
      if (A) {
        const action = A instanceof PDFRef ? context.lookup(A) : A;
        if (action && typeof action.get === "function") {
          const uri = action.get(PDFName.of("URI"));
          if (uri) uriString = decodePdfString(uri);
        }
      }

      // 2) Fallback: destinazione nominata
      if (!uriString) {
        const Dest = annot.get(PDFName.of("Dest"));
        if (Dest) uriString = Dest.toString();
      }

      if (!uriString) continue;

      // Estrae l'identificatore BMK_<id> (singolo underscore dopo BMK)
      const match = /BMK_\w+/.exec(uriString);
      if (!match) continue;

      const anchor = match[0];
      let arr = result.get(anchor);
      if (!arr) {
        arr = [];
        result.set(anchor, arr);
      }
      // Evita di registrare più volte la stessa pagina per la stessa anchor
      if (arr.length === 0 || arr[arr.length - 1] !== pageIndex) {
        arr.push(pageIndex);
      }
    }
  });

  return result;
}

// ---------------------------------------------------------------------------
// COSTRUZIONE OUTLINE ITEMS A PARTIRE DALLA MAPPA ANCHOR
// ---------------------------------------------------------------------------

/**
 * Converte l'albero gerarchico in una struttura di outline items
 * usando la mappa anchor -> pagine estratta dal PDF.
 *
 * Mantiene SEMPRE la gerarchia completa: se un'ancora non è presente
 * nel PDF il nodo viene comunque inserito e la pagina target eredita
 * quella del nodo genitore (fallback). Viene emesso un warn diagnostico.
 *
 * Gestione duplicati / disambiguazione:
 * - per ogni anchor che compare più volte nel PDF si sceglie la prima
 *   occorrenza con page >= parentPage (la pagina del nodo genitore);
 * - nodi fratelli vengono visitati in ordine e ciascuno ha parentPage
 *   crescente, quindi l'occorrenza giusta viene selezionata in modo
 *   naturale senza cursori espliciti.
 *
 * Eccezione livello ANAG_codice (es. "KKKK0401"):
 * - questi codici non hanno anchor nel PDF, quindi NON viene tentata
 *   alcuna lookup: il bookmark eredita direttamente la pagina del BOM.
 *
 * @param {Map} tree - albero prodotto da buildTree
 * @param {Map<string, number[]>} anchorPages - mappa anchor -> array di pageIndex
 * @param {Function} warn - callback per le anchor non trovate
 * @returns {Object[]} array di outline items
 */
function treeToItems(tree, anchorPages, warn = console.warn) {
  /**
   * Restituisce la pagina target per il nodo identificato da `text`.
   * Cerca la prima occorrenza con page >= parentPage nella lista
   * ordinata di pagine associate all'anchor. Se l'anchor non esiste
   * o non ha occorrenze valide, ritorna fallback e logga un warn.
   * @param {string} text - testo del nodo (verrà normalizzato in anchor)
   * @param {number} parentPage - pagina del genitore (limite inferiore)
   * @param {number} fallback - pagina da usare se l'anchor non è risolvibile
   * @returns {number}
   */
  function pageOf(text, parentPage, fallback, isCl = false) {
    const anchor = makeAnchor(text, isCl);
    if (!anchor) return fallback;

    const arr = anchorPages.get(anchor);
    if (!arr || arr.length === 0) {
      warn(`Anchor non trovata nel PDF: ${anchor} (titolo: "${text}")`);
      return fallback;
    }

    // arr è ordinato crescente per costruzione: prima pagina >= parentPage
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] >= parentPage) return arr[i];
    }

    // Tutte le occorrenze precedono parentPage: indica un mismatch d'ordine
    // tra albero e PDF. Usa l'ultima occorrenza nota come best-effort.
    warn(
      `Anchor ${anchor} senza occorrenze >= parentPage=${parentPage} ` +
        `(titolo: "${text}"); uso ultima occorrenza disponibile.`,
    );
    return arr[arr.length - 1];
  }

  const result = [];

  for (const [cl1, m1] of tree) {
    const p1 = pageOf(cl1, 0, 0, true); // CL1 -> prefisso BMK_CL_
    const n1 = { title: cl1, page: p1, children: [] };

    for (const [cl2, m2] of m1) {
      const p2 = pageOf(cl2, p1, p1, true); // CL2 -> prefisso BMK_CL_
      const n2 = { title: cl2, page: p2, children: [] };

      for (const [cl3, m3] of m2) {
        const p3 = pageOf(cl3, p2, p2, true); // CL3 -> prefisso BMK_CL_
        const n3 = { title: cl3, page: p3, children: [] };

        for (const [bom, m4] of m3) {
          const p4 = pageOf(bom, p3, p3);
          const n4 = { title: bom, page: p4, children: [] };

          for (const [code, m5] of m4) {
            // ANAG_codice (es. "KKKK..."): nessuna anchor nel PDF,
            // il bookmark eredita la pagina del BOM padre.
            const p5 = p4;
            const n5 = { title: code, page: p5, children: [] };

            for (const [acc, codes2] of m5) {
              const p6 = pageOf(acc, p5, p5);
              const n6 = { title: acc, page: p6, children: [] };

              for (const code2 of codes2) {
                // ANAG_codice2: stesso codice può comparire sotto prodotti
                // diversi; il bound parentPage=p5 garantisce di selezionare
                // l'occorrenza relativa a QUESTO prodotto.
                const p7 = pageOf(code2, p5, p5);
                n6.children.push({ title: code2, page: p7, children: [] });
              }
              n5.children.push(n6);
            }
            n4.children.push(n5);
          }
          n3.children.push(n4);
        }
        n2.children.push(n3);
      }
      n1.children.push(n2);
    }
    result.push(n1);
  }

  return result;
}

// ---------------------------------------------------------------------------
// CREAZIONE SEGNALIBRI PDF (OUTLINES) - invariata rispetto all'originale
// ---------------------------------------------------------------------------

/**
 * Scrive l'albero di outline nella struttura "low-level" del PDF.
 * @param {PDFDocument} pdfDoc
 * @param {Object[]} items - array di nodi {title, page, children}
 */
function addOutlines(pdfDoc, items) {
  const { context } = pdfDoc;

  function dest(page) {
    const arr = PDFArray.withContext(context);
    arr.push(page.ref);
    arr.push(PDFName.of("Fit")); // visualizzazione pagina
    return arr;
  }

  function buildLevel(nodes, parentRef) {
    if (!nodes.length) return null;
    const refs = nodes.map(() => context.nextRef());

    nodes.forEach((node, i) => {
      const dict = PDFDict.withContext(context);
      const page = pdfDoc.getPage(node.page);

      dict.set(PDFName.of("Title"), PDFHexString.fromText(node.title));
      dict.set(PDFName.of("Dest"), dest(page));
      dict.set(PDFName.of("Parent"), parentRef);

      if (i > 0) dict.set(PDFName.of("Prev"), refs[i - 1]);
      if (i < nodes.length - 1) dict.set(PDFName.of("Next"), refs[i + 1]);

      if (node.children.length) {
        const sub = buildLevel(node.children, refs[i]);
        dict.set(PDFName.of("First"), sub.first);
        dict.set(PDFName.of("Last"), sub.last);
        // Count negativo = collapsed
        dict.set(PDFName.of("Count"), PDFNumber.of(-sub.count));
      }

      context.assign(refs[i], dict);
    });

    return { first: refs[0], last: refs[refs.length - 1], count: nodes.length };
  }

  const rootRef = context.nextRef();
  const rootDict = PDFDict.withContext(context);
  rootDict.set(PDFName.of("Type"), PDFName.of("Outlines"));

  const top = buildLevel(items, rootRef);
  if (top) {
    rootDict.set(PDFName.of("First"), top.first);
    rootDict.set(PDFName.of("Last"), top.last);
    rootDict.set(PDFName.of("Count"), PDFNumber.of(top.count));
  }

  context.assign(rootRef, rootDict);
  pdfDoc.catalog.set(PDFName.of("Outlines"), rootRef);

  // apre automaticamente il pannello bookmark
  pdfDoc.catalog.set(PDFName.of("PageMode"), PDFName.of("UseOutlines"));
}

// ---------------------------------------------------------------------------
// LOAD RECORDS (invariata)
// ---------------------------------------------------------------------------

function loadRecords(recordsPath) {
  const raw = fs.readFileSync(recordsPath, "utf8");
  const parsed = JSON.parse(raw);

  if (Array.isArray(parsed)) return parsed; // Node.js puro
  if (parsed && Array.isArray(parsed.data)) return parsed.data; // Node-RED

  throw new Error(
    "Formato records non valido: atteso array oppure oggetto con campo data[]",
  );
}

// ---------------------------------------------------------------------------
// PIPELINE PRINCIPALE
// ---------------------------------------------------------------------------

/**
 * Pipeline completa: carica records + PDF, estrae le ancore BMK_* dalle
 * Link annotation, costruisce l'albero dei segnalibri e lo scrive nel PDF.
 * @param {Object} options
 * @param {string} options.recordsPath
 * @param {string} options.inputPdf
 * @param {string} options.outputPdf
 * @returns {Promise<void>}
 */
async function runPureNode({ recordsPath, inputPdf, outputPdf }) {
  const records = loadRecords(recordsPath);
  const tree = buildTree(records, (m) => console.warn(`[warn] ${m}`));

  const pdfBuffer = fs.readFileSync(inputPdf);
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  // Estrazione anchor dal PDF (nessun text search, nessuna coordinata)
  const anchorPages = extractAnchorPages(pdfDoc);
  const totalOccurrences = Array.from(anchorPages.values()).reduce(
    (acc, arr) => acc + arr.length,
    0,
  );
  console.log(
    `[info] Ancore BMK_* distinte: ${anchorPages.size} ` +
      `(occorrenze totali: ${totalOccurrences})`,
  );

  const outlineItems = treeToItems(tree, anchorPages, (m) =>
    console.warn(`[warn] ${m}`),
  );

  addOutlines(pdfDoc, outlineItems);

  fs.mkdirSync(path.dirname(outputPdf), { recursive: true });
  fs.writeFileSync(outputPdf, await pdfDoc.save());
}

if (require.main === module) {
  (async () => {
    const recordsPath = path.join(__dirname, "records.json");
    const inputPdf = path.join(__dirname, "CANON_Corporate.pdf");
    const outputPdf = path.join(__dirname, "listino_canon_url.pdf");

    await runPureNode({ recordsPath, inputPdf, outputPdf });
    console.log(`OK: segnalibri aggiunti -> ${outputPdf}`);
  })().catch((err) => {
    console.error(`ERROR: ${err.stack || err.message}`);
    process.exit(1);
  });
}
