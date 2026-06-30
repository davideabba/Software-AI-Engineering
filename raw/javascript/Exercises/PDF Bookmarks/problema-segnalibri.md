# Problema: segnalibro CL2 punta a pagina errata

## Sintomo

Navigando l'albero dei segnalibri, tutti i CL2 di una stessa CL1 portano a
pagine in ordine crescente (es. 50 → 120 → 250 → 356), tranne uno che fa un
salto all'indietro e porta a una pagina molto precedente (es. 173).

Nel caso concreto: `Sistemi di Finitura` appare ultimo nell'elenco dei CL2,
ma il clic porta a pag. 173 invece di seguire i fratelli che si trovano
intorno a pag. 356.

---

## Come funziona il meccanismo di risoluzione delle pagine

Lo script costruisce l'albero dei segnalibri ordinando le voci
**alfabeticamente** (confronto Unicode sulle stringhe). Per ogni nodo cerca
nel PDF l'ancora `BMK_CL_<testo>` e sceglie la **prima occorrenza con numero
di pagina ≥ pagina del genitore**.

Il problema nasce quando **l'ordine alfabetico dell'albero non coincide con
l'ordine fisico delle sezioni nel PDF**.

---

## Cause possibili

### Causa 1 — Maiuscole e minuscole nell'ordinamento alfabetico

Il confronto Unicode tratta maiuscole e minuscole come caratteri distinti:
`'D'` (codice 68) viene prima di `'d'` (codice 100).

Esempio:

| Stringa | Ordine Unicode |
|---|---|
| `Sistemi Digitali  Bianco / Nero` | prima (`'D'` = 68) |
| `Sistemi di Finitura` | dopo (`'d'` = 100) |

Se nel PDF le sezioni sono invece ordinate in modo case-insensitive (o per
un altro criterio), i due ordini divergono e il segnalibro che capita "fuori
posto" nell'albero viene abbinato all'occorrenza sbagliata nel PDF.

### Causa 2 — Ordine nel PDF basato su ID numerici, non sul testo

I record JSON contengono i campi `ANAG_class1`, `ANAG_class2`, `ANAG_class3`
(es. `"ANAG_class2": 99` per *Sistemi di Finitura*, `"ANAG_class2": 2` per
*Sistemi Digitali*). Se la query SQL che genera il PDF ordina per questi ID
numerici, l'ordine fisico delle pagine segue i numeri — non l'alfabeto.

L'albero dei segnalibri, invece, viene costruito ordinando per testo. Il
risultato è che voci con `ANAG_class2` basso (es. 2) finiscono presto nel
PDF ma in fondo all'alfabeto, e viceversa.

### Causa 3 — Spazi iniziali nelle descrizioni

Alcune descrizioni iniziano con uno spazio (es. `" Sistemi di Finitura"`).
Nel confronto Unicode lo spazio (codice 32) è inferiore a qualunque lettera,
quindi quelle voci finiscono **in cima** all'ordinamento alfabetico — ma
potrebbero stare in tutt'altra posizione nel PDF.

---

## Soluzione raccomandata

Allineare il criterio di ordinamento dell'albero a quello usato dal PDF.
Se il PDF è generato con `ORDER BY ANAG_class1, ANAG_class2, ANAG_class3`,
usare quegli stessi campi come chiavi primarie nel comparator di `buildTree`,
prima (o al posto) delle descrizioni testuali.

```js
// Ordinamento per ID numerico di categoria (specchio dell'ORDER BY SQL)
const sorted = [...records].sort((a, b) => {
  const n = (k) => Number(a[k] ?? 0) - Number(b[k] ?? 0);
  return n("ANAG_class1") || n("ANAG_class2") || n("ANAG_class3")
    || strcmp(a.BOM_modelloanagraficamain, b.BOM_modelloanagraficamain)
    || /* ... */;
});
```

Questo garantisce che l'albero attraversi i nodi nello stesso ordine in cui
le sezioni compaiono nel PDF, eliminando i mismatch.
