/**
 * NODE-RED FUNCTION NODE — PDF Bookmarks URL-based
 *
 * Incolla TUTTO questo file nel campo "On Message" di una Function node.
 *
 * SETUP (una tantum):
 * 1) Tab "Setup" della Function node → "Modules":
 *      - pdf-lib   → import as: pdfLib
 *      - fs        → import as: fs
 *      - path      → import as: path
 *    (richiede Node-RED >= 1.3 con functionExternalModules abilitato in
 *    settings.js: `functionExternalModules: true`)
 * 2) Output: 1
 * 3) Env var ENV_CANON deve puntare alla root del progetto (cartella
 *    `out/` deve esistere).
 *
 * INPUT msg atteso:
 *   msg.payload.data   Array records (dal topic "data")
 *   msg.payload.pdf    Path PDF input (dal topic "pdf")
 *
 * OUTPUT msg.payload:
 *   stringa "OK: segnalibri aggiunti → <path>" oppure "ERROR: ..."
 */

const {
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFArray,
  PDFDict,
  PDFRef,
} = pdfLib;

const ROOT = env.get("ENV_CANON");
const records = msg.payload.data;
const inputPdf = msg.payload.pdf;
const outputPdf = path.join(ROOT, "out", "listino_canon_url.pdf");

// ---------------------------------------------------------------------------
// UTILS
// ---------------------------------------------------------------------------

function strcmp(a, b) {
  const sa = String(a ?? "");
  const sb = String(b ?? "");
  return sa < sb ? -1 : sa > sb ? 1 : 0;
}

function normalizeAnchorId(text) {
  if (text == null) return "";
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w]/g, "");
}

function makeAnchor(text, isCl = false) {
  const id = normalizeAnchorId(text);
  if (!id) return "";
  return isCl ? `BMK_CL_${id}` : `BMK_${id}`;
}

// ---------------------------------------------------------------------------
// ALBERO GERARCHICO
// ---------------------------------------------------------------------------

function buildTree(records, warn) {
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
// ESTRAZIONE LINK ANNOTATION
// ---------------------------------------------------------------------------

function decodePdfString(obj) {
  if (!obj) return null;
  if (typeof obj.decodeText === "function") return obj.decodeText();
  if (typeof obj.asString === "function") return obj.asString();
  return obj.toString();
}

function extractAnchorPages(pdfDoc) {
  const result = new Map();
  const context = pdfDoc.context;
  const pages = pdfDoc.getPages();

  pages.forEach((page, pageIndex) => {
    const annotsRaw = page.node.get(PDFName.of("Annots"));
    if (!annotsRaw) return;

    const annotsArr =
      annotsRaw instanceof PDFArray ? annotsRaw : context.lookup(annotsRaw);
    if (!annotsArr || typeof annotsArr.asArray !== "function") return;

    for (const entry of annotsArr.asArray()) {
      const annot = entry instanceof PDFRef ? context.lookup(entry) : entry;
      if (!annot || typeof annot.get !== "function") continue;

      const subtype = annot.get(PDFName.of("Subtype"));
      if (!subtype || subtype.toString() !== "/Link") continue;

      let uriString = null;
      const A = annot.get(PDFName.of("A"));
      if (A) {
        const action = A instanceof PDFRef ? context.lookup(A) : A;
        if (action && typeof action.get === "function") {
          const uri = action.get(PDFName.of("URI"));
          if (uri) uriString = decodePdfString(uri);
        }
      }
      if (!uriString) {
        const Dest = annot.get(PDFName.of("Dest"));
        if (Dest) uriString = Dest.toString();
      }
      if (!uriString) continue;

      const match = /BMK_\w+/.exec(uriString);
      if (!match) continue;

      const anchor = match[0];
      let arr = result.get(anchor);
      if (!arr) {
        arr = [];
        result.set(anchor, arr);
      }
      if (arr.length === 0 || arr[arr.length - 1] !== pageIndex) {
        arr.push(pageIndex);
      }
    }
  });

  return result;
}

// ---------------------------------------------------------------------------
// OUTLINE ITEMS
// ---------------------------------------------------------------------------

function treeToItems(tree, anchorPages, warn) {
  function pageOf(text, parentPage, fallback, isCl = false) {
    const anchor = makeAnchor(text, isCl);
    if (!anchor) return fallback;
    const arr = anchorPages.get(anchor);
    if (!arr || arr.length === 0) {
      warn(`Anchor non trovata nel PDF: ${anchor} (titolo: "${text}")`);
      return fallback;
    }
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] >= parentPage) return arr[i];
    }
    warn(
      `Anchor ${anchor} senza occorrenze >= parentPage=${parentPage} ` +
        `(titolo: "${text}"); uso ultima occorrenza disponibile.`,
    );
    return arr[arr.length - 1];
  }

  const result = [];
  for (const [cl1, m1] of tree) {
    const p1 = pageOf(cl1, 0, 0, true);
    const n1 = { title: cl1, page: p1, children: [] };

    for (const [cl2, m2] of m1) {
      const p2 = pageOf(cl2, p1, p1, true);
      const n2 = { title: cl2, page: p2, children: [] };

      for (const [cl3, m3] of m2) {
        const p3 = pageOf(cl3, p2, p2, true);
        const n3 = { title: cl3, page: p3, children: [] };

        for (const [bom, m4] of m3) {
          const p4 = pageOf(bom, p3, p3);
          const n4 = { title: bom, page: p4, children: [] };

          for (const [code, m5] of m4) {
            const p5 = p4;
            const n5 = { title: code, page: p5, children: [] };

            for (const [acc, codes2] of m5) {
              const p6 = pageOf(acc, p5, p5);
              const n6 = { title: acc, page: p6, children: [] };

              for (const code2 of codes2) {
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
// OUTLINES PDF
// ---------------------------------------------------------------------------

function addOutlines(pdfDoc, items) {
  const { context } = pdfDoc;

  function dest(page) {
    const arr = PDFArray.withContext(context);
    arr.push(page.ref);
    arr.push(PDFName.of("Fit"));
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
  pdfDoc.catalog.set(PDFName.of("PageMode"), PDFName.of("UseOutlines"));
}

// ---------------------------------------------------------------------------
// ENTRYPOINT NODE-RED
// ---------------------------------------------------------------------------

/** 
 * Funzione principale eseguita dal Node-RED Function node.
 * async IIFE per gestire le promesse e gli errori.
 * @param {Object} msg - messaggio in ingresso con payload {data, pdf}
 * @returns {Promise<*>} msg con payload aggiornato
 */
return (async () => {
  const warn = (m) => node.warn(m);

  const tree = buildTree(records, warn);
  const pdfBuffer = fs.readFileSync(inputPdf);
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  const anchorPages = extractAnchorPages(pdfDoc);
  const totalOccurrences = Array.from(anchorPages.values()).reduce(
    (acc, arr) => acc + arr.length,
    0,
  );
  node.log(
    `Ancore BMK_* distinte: ${anchorPages.size} (occorrenze: ${totalOccurrences})`,
  );

  const outlineItems = treeToItems(tree, anchorPages, warn);
  addOutlines(pdfDoc, outlineItems);

  fs.writeFileSync(outputPdf, await pdfDoc.save());

  msg.payload = `OK: segnalibri aggiunti → ${outputPdf}`;
  return msg;
})().catch((err) => {
  node.error(`bookmarks-url.js: ${err.stack}`, msg);
  msg.payload = `ERROR: ${err.message}`;
  return msg;
});
