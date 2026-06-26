const {
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFArray,
  PDFDict,
} = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const { PdfReader } = require("pdfreader");

/**
 * Confronto stringhe robusto gestendo null/undefined
 * @param {string} a 
 * @param {string} b 
 * @returns {number} -1 se a < b, 1 se a > b, 0 se uguali
 */
function strcmp(a, b) {
  const sa = String(a ?? "");
  const sb = String(b ?? "");
  return sa < sb ? -1 : sa > sb ? 1 : 0;
}

const PDF_RAW_UNITS_PER_MM = 72 / 25.4 / 16;

const COVER_TITLE_ANCHORS = {
  cl1: { xMm: 60, yMm: 35, xToleranceMm: 20, yToleranceMm: 20 },
  cl2: { xMm: 190, yMm: 10, xToleranceMm: 10, yToleranceMm: 10 },
  cl3: { xMm: 190, yMm: 10, xToleranceMm: 10, yToleranceMm: 10 },
};

function normalizeText(text) {
  return String(text ?? "")
    .replace(/\u00AD/g, "-")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function mmToRawUnits(mm) {
  return mm * PDF_RAW_UNITS_PER_MM;
}

/**
 * Costruzione dell'albero gerarchico dei segnalibri a partire dai records.
 * @param {Array} records - Array di oggetti contenenti i dati dei segnalibri.
 * @param {Function} warn - Funzione di callback per i messaggi di avviso.
 * @returns {Map} - Mappa annidata rappresentante la gerarchia dei segnalibri.
 */
function buildTree(records, warn = console.warn) {
  
  // Ordinamento dei records per garantire la corretta gerarchia: confronta le chiavi in ordine di priorità e, appena trova una differenza, ritorna il risultato del confronto. 
  // Se tutte le chiavi sono uguali, confronta i numeri e infine le date.
  const sorted = [...records].sort((a, b) => {    // ritorna -1 se a < b, 1 se a > b, 0 se uguali
    for (const k of [
      "CL1_descrizione",
      "CL2_descrizione",
      "CL3_descrizione",
      "BOM_modelloanagraficamain",
      "ANAG_codice",
      "tipoacc_ordinevisualizzazione",
    ]) {
      const r = strcmp(a[k], b[k]);
      if (r !== 0) return r;  // se le chiavi sono diverse, ritorna il risultato del confronto
    }

    // Ordinamento numerico: se ord ha risultato negativo, a viene prima di b; se positivo, b viene prima di a; se zero, sono uguali.
    const ord =
      (Number(a.tipoacc_ordinevisualizzazione) || 0) -
      (Number(b.tipoacc_ordinevisualizzazione) || 0);
    
    if (ord !== 0) return ord;

    // Ordinamento secondario
    for (const k of ["ANAG_codice2", "ANAG_prtype"]) {
      const r = strcmp(a[k], b[k]);
      if (r !== 0) return r;
    }

    // Ordinamento finale per data (decrescente)
    return (
      new Date(b.PRE_enddate ?? 0).getTime() -
      new Date(a.PRE_enddate ?? 0).getTime()
    );
  });

  /**
     * COSTRUZIONE MAP ANNIDATE
     *
     * Strategia:
     *      - costruzione top-down usando Map nidificate
     *      - ogni livello rappresenta un nodo della gerarchia
     *
     * tree (Map)
     * └── CL1
     *     └── CL2
     *         └── CL3
     *             └── BOM
     *                 └── CODE
     *                     └── ACCESSORIO
     *                         └── [CODE2, CODE2, ...]
     *
     * Qui definisci la struttura dei segnalibri.
     * Se vuoi:
     * - aggiungere un livello → aggiungi un nuovo Map
     * - rimuovere un livello → elimina un blocco
     * - cambiare campo → sostituisci variabile (es. CL1_descrizione)
     */
  const tree = new Map();

  for (const rec of sorted) {
    const cl1 = rec.CL1_descrizione;
    const cl2 = rec.CL2_descrizione;
    const cl3 = rec.CL3_descrizione;
    const bom = rec.BOM_modelloanagraficamain;
    const code = rec.ANAG_codice;

    if (!tree.has(cl1)) tree.set(cl1, new Map()); // se non esiste il livello CL1, crealo
    const m1 = tree.get(cl1); // m1 rappresenta il livello CL1, ed è una Map che conterrà i livelli successivi (CL2, CL3, BOM, CODE, ACCESSORIO)

    if (!m1.has(cl2)) m1.set(cl2, new Map());
    const m2 = m1.get(cl2);

    if (!m2.has(cl3)) m2.set(cl3, new Map());
    const m3 = m2.get(cl3);

    if (!m3.has(bom)) m3.set(bom, new Map());
    const m4 = m3.get(bom);

    if (!m4.has(code)) m4.set(code, new Map());
    const m5 = m4.get(code);

    // Livello accessori: i dati non sono nel record principale, ma in un array rec.detail[]
    const details = rec.detail || [];

    if (details.length === 0) {
      warn("Tabella di dettaglio accessori vuota.");
    } else {
      for (const d of details) {
        // ?? serve a dire: se null o undefined, inserisci '', altrimenti usa il valore reale
        // \u00AD è un carattere invisibile dei PDF / HTML per la sillabazione, meglio eliminarlo se esiste
        const acc = (d.tipoacc_Descrizione ?? "").replace(/\u00AD/g, "").trim();
        const code2 = d.ANAG_codice2;

        // opzionale: salta accessori senza nome
        if (!acc) continue;

        if (!m5.has(acc)) m5.set(acc, []);  // imposta un array vuoto per raccogliere i codici2 associati all'accessorio

        if (code2) {
          m5.get(acc).push(code2);  // aggiungi il codice2 all'array dell'accessorio
        }
      }
    }
  }

  return tree;
}

/**
 * Trova la prima pagina che contiene il testo specificato, tra startIndex ed endIndex.
 * @param {string} text - Testo da cercare.
 * @param {Array<{text: string, items: Object[]}>} pages - Array di pagine con testo normalizzato.
 * @param {number} startIndex - Indice di inizio della ricerca.
 * @param {number} endIndex - Indice di fine della ricerca.
 * @returns {number|null} - Indice della pagina trovata o null se non trovato.
 */
function findPage(text, pages, startIndex = 0, endIndex = pages.length,) {
  if (!text) return null;

  const norm = normalizeText(text);

  for (let i = startIndex; i < endIndex; i++) {
    if (pages[i].text.includes(norm)) return i;
  }

  return null;
}

/**
 * Trova la prima pagina che contiene il testo specificato in una zona definita da un anchor, tra startIndex ed endIndex.
 * @param {string} text - Testo da cercare.
 * @param {Array<{text: string, items: Object[]}>} pages - Array di pagine con testo normalizzato.
 * @param {Object} anchor - Oggetto che definisce la zona di ricerca.
 * @param {number} startIndex - Indice di inizio della ricerca.
 * @param {number} endIndex - Indice di fine della ricerca.
 * @returns {number|null} - Indice della pagina trovata o null se non trovato.
 */
function findCoverPage(text, pages, anchor, startIndex = 0, endIndex = pages.length) {
  if (!text) return null;

  const norm = normalizeText(text);
  const minX = mmToRawUnits(Math.max(0, anchor.xMm - anchor.xToleranceMm));
  const maxX = mmToRawUnits(anchor.xMm + anchor.xToleranceMm);
  const minY = mmToRawUnits(Math.max(0, anchor.yMm - anchor.yToleranceMm));

  for (let i = startIndex; i < endIndex; i++) {
    const zoneText = normalizeText(
      pages[i].items
        .filter((item) => item.x >= minX && item.x <= maxX && item.y >= minY)
        .sort((left, right) => left.y - right.y || left.x - right.x)
        .map((item) => item.text)
        .join(""),
    );

    if (zoneText.includes(norm)) return i;
  }

  return null;
}

/**
 * Converte l'albero gerarchico dei segnalibri in una struttura di oggetti con pagine associate.
 * @param {Map} tree - L'albero gerarchico dei segnalibri.
 * @param {Array<{text: string, items: Object[]}>} pages - Testo normalizzato e item raw di ogni pagina.
 * @returns {Object[]} - Array di oggetti rappresentanti i segnalibri con le pagine associate.
 */
function treeToItems(tree, pages) {
  const result = [];

  // 1. raccogli tutte le pagine prodotto (p5)
  const productPageMap = []; // [{page, ref}]

  // primo pass: trova tutte le pagine dei prodotti
  for (const [cl1, m1] of tree) {
    for (const [cl2, m2] of m1) {
      for (const [cl3, m3] of m2) {
        for (const [bom, m4] of m3) {
          let lastPage = 0;

          for (const [code] of m4) {
            const p5 = findPage(code, pages, lastPage) ?? lastPage; // ritorna l'indice della prima pagina in cui si trova il codice prodotto, a partire dall'ultima pagina trovata (lastPage). Se non trovato, ritorna lastPage.
            productPageMap.push({
              code,
              page: p5,
            });

            lastPage = p5; // aiuta la progressione
          }
        }
      }
    }
  }

  // 2. ordina le pagine prodotto
  productPageMap.sort((a, b) => a.page - b.page);

  /**
   * Restituisce la pagina del prossimo prodotto dopo la pagina corrente.
   * @param {number} currentPage - Indice della pagina corrente.
   * @returns {number} - Indice della pagina del prossimo prodotto o la lunghezza totale delle pagine se non ci sono prodotti successivi.
   */
  function getNextProductPage(currentPage) {
    for (const p of productPageMap) {
      if (p.page > currentPage) {
        return p.page;
      }
    }
    return pages.length;
  }

  // 3. costruzione finale albero con range limitato
  for (const [cl1, m1] of tree) {
    const p1 =
      findCoverPage(cl1, pages, COVER_TITLE_ANCHORS.cl1) ?? 0;
    const n1 = { title: cl1, page: p1, children: [] };

    for (const [cl2, m2] of m1) {
      const p2 =
        findCoverPage(cl2, pages, COVER_TITLE_ANCHORS.cl2, p1) ?? p1;
      const n2 = { title: cl2, page: p2, children: [] };

      for (const [cl3, m3] of m2) {
        const p3 =
          findCoverPage(cl3, pages, COVER_TITLE_ANCHORS.cl3, p2) ?? p2;
        const n3 = { title: cl3, page: p3, children: [] };

        for (const [bom, m4] of m3) {
          const p4 = findPage(bom, pages, p3) ?? p3;
          const n4 = { title: bom, page: p4, children: [] };

          for (const [code, m5] of m4) {
            const p5 = findPage(code, pages, p4) ?? p4;

            // range del prodotto
            const endPage = getNextProductPage(p5);

            const n5 = { title: code, page: p5, children: [] }; // oggetto rappresentante il prodotto con la pagina associata

            for (const [acc, codes2] of m5) {
              const p6 = findPage(acc, pages, p5, endPage) ?? p5;

              const n6 = { title: acc, page: p6, children: [] };

              for (const code2 of codes2) {
                // Il bookmark del code2 punta al code padre, che è univoco nella gerarchia.
                const p7 = p5;

                n6.children.push({
                  title: code2,
                  page: p7,
                  children: [],
                });
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

/**
 * CREAZIONE SEGNALIBRI PDF (OUTLINES)
 *
 * Parte "low-level" che scrive direttamente nella struttura PDF.
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

function loadRecords(recordsPath) {
  const raw = fs.readFileSync(recordsPath, "utf8");
  const parsed = JSON.parse(raw);

  if (Array.isArray(parsed)) return parsed; // supporto per Node.js puro
  if (parsed && Array.isArray(parsed.data)) return parsed.data; // supporto per Node-RED

  throw new Error(
    "Formato records non valido: atteso array oppure oggetto con campo data[]",
  );
}

/**
 * Estrae il testo di ogni pagina del PDF mantenendo anche gli item raw con coordinate.
 * @param {Uint8Array | ArrayBuffer} pdfBuffer 
 * @returns {Promise<Array<{width: number, height: number, text: string, items: Object[]}>>}
 */
async function extractPageData(pdfBuffer) {
  return new Promise((resolve, reject) => {
    const pages = [];
    new PdfReader().parseBuffer(pdfBuffer, (err, item) => { // parseBuffer legge il PDF e chiama la callback per ogni elemento (testo, immagine, ecc.)
      if (err) return reject(err);  // se c'è un errore, rifiuta la Promise
      if (!item) {  // fine del parsing
        return resolve( // risolvi la Promise con l'array di testi delle pagine, normalizzati
          pages.map((page) => ({
            ...page,
            text: normalizeText(page.text),
          })),
        );
      }

      if (item.page) {
        pages.push({
          width: item.width,
          height: item.height,
          text: "",
          items: [],
        });
      } else if (item.text && pages.length) {
        pages[pages.length - 1].text += item.text + " "; // aggiungi uno spazio per separare le parole
        pages[pages.length - 1].items.push({
          text: item.text,
          x: item.x,
          y: item.y,
          w: item.w,
        });
      }
    });
  });
}

/**
 * Funzione principale che esegue l'intero processo di aggiunta dei segnalibri al PDF.
 * @param {Object} options - Oggetto con i percorsi dei file.
 * @param {string} options.recordsPath - Percorso del file JSON contenente i records dei segnalibri.
 * @param {string} options.inputPdf - Percorso del file PDF di input a cui aggiungere i segnalibri.
 * @param {string} options.outputPdf - Percorso del file PDF di output con i segnalibri aggiunti.
 * @returns {Promise<void>} - Una Promise che si risolve quando l'operazione è completata.
 */
async function runPureNode({recordsPath, inputPdf, outputPdf }) {
  const records = loadRecords(recordsPath);                                 // carica i records da JSON
  const tree = buildTree(records, (warnMsg) => console.warn(`[warn] ${warnMsg}`)); // costruisce l'albero gerarchico dei segnalibri
  const pdfBuffer = fs.readFileSync(inputPdf);                              // legge il PDF di input come buffer

  const pages = await extractPageData(pdfBuffer);                           // estrae testo e coordinate raw di ogni pagina del PDF
  const outlineItems = treeToItems(tree, pages);                            // converte l'albero in una struttura di segnalibri con pagine associate

  const pdfDoc = await PDFDocument.load(pdfBuffer);                         // carica il PDF in pdf-lib
  addOutlines(pdfDoc, outlineItems);                                        // aggiunge i segnalibri al PDF


  fs.mkdirSync(path.dirname(outputPdf), { recursive: true });               // crea la cartella di output se non esiste
  fs.writeFileSync(outputPdf, await pdfDoc.save());                         // salva il PDF modificato con i segnalibri
}

if (require.main === module) {
  (async () => {
    const recordsPath = path.join(__dirname, "records.json");
    const inputPdf = path.join(__dirname, "CANON_Corporate_0001.pdf");
    const outputPdf = path.join(__dirname, "listino_canon.pdf");

    await runPureNode({
      recordsPath,
      inputPdf,
      outputPdf,
    });

    console.log(`OK: segnalibri aggiunti -> ${outputPdf}`);
  })().catch((err) => {
    console.error(`ERROR: ${err.stack || err.message}`);
    process.exit(1);
  });
}

/*
VERSIONE NODE-RED (COMMENTATA)
--------------------------------------------------
Questa e' la forma originale per Function node.

const ROOT = env.get("ENV_CANON");
const records = msg.payload.data;
const inputPdf = msg.payload.pdf;
const outputPdf = path.join(ROOT, "out", "listino_canon.pdf");

return (async () => {
  const tree = buildTree(records, (warnMsg) => node.warn(warnMsg));
  const pdfBuffer = fs.readFileSync(inputPdf);

  const pageTexts = await extractPageTexts(pdfBuffer);
  const outlineItems = treeToItems(tree, pageTexts);

  const pdfDoc = await PDFDocument.load(pdfBuffer);
  addOutlines(pdfDoc, outlineItems);

  fs.writeFileSync(outputPdf, await pdfDoc.save());

  msg.payload = `OK: segnalibri aggiunti -> ${outputPdf}`;
  return msg;
})().catch((err) => {
  node.error(`bookmarks.js: ${err.stack}`, msg);
  msg.payload = `ERROR: ${err.message}`;
  return msg;
});
*/
