Fonte: [video Simone Rizzo](https://www.youtube.com/watch?v=LLxBcc_bMS8&t=123s)

Gli LLM non hanno memoria, non ricordano. **Ogni domanda è un foglio bianco.**

Per poter far funzionare un agente su corpus (documenti, conversazioni, decisioni), bisogna costruirgli una memoria esterna.

# Tre generazioni di memoria 🧠


|                   |                             **RAG**                              |                           **Agentic File Search**                            |                                  **LLM Wiki**                                   |
| :---------------: | :--------------------------------------------------------------: | :--------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: |
|     **Anno**      |                               2022                               |                                     2024                                     |                                      2026                                       |
|   **Concetto**    |                        Retrieval passivo                         |                            Esplorazione dinamica                             |                               Sintesi cumulativa                                |
| **Funzionamento** | Embeddings precomputati. L'LLM riceve chunk simili alla domanda. | L'agente naviga i file come un umano: scansiona, ragiona, segue riferimenti. | La conoscenza viene compilata in un artefatto persistente che cresce nel tempo. |

## RAG - Retrieval Augmented Generation

I documenti vengono suddivisi in pezzi più piccoli, i *chunk*, i quali vengono passati ad un ***embedding model*** che ha il compito di trasformare il testo in una rappresentazione numerica, detta ***embedding*** o **vettore**. Ciascun vettore rappresenta una coordinata in uno **spazio vettoriale N dimensionale**.

La domanda viene convertita in embedding attraverso lo stesso modello di embedding, si effettua un ***retrieval*** dei chunk più simili alla domanda dell'utente attraverso la selezione delle coordinate più vicine alla coordinata della domanda, nello spazio vettoriale.

![[Pasted image 20260430113510.png]]

Questo approccio presenta alcuni **limiti**:
- **I chunk perdono contesto.** Spezzare un documento distrugge le relazioni tra sezioni.
- **Cross-reference invisibili.** I richiami ad altre parti di testi, pagine, ecc. per gli embeddings non hanno significato (es: "Come discusso nel capitolo 4...").
- **Similarità ≠rilevanza.** Il matching semantico trova chunk che assomigliano alla domanda, non quelli logicamente necessari per rispondere.
- **Nessun accumulo.** Non impara dalle domande passate, ogni query è indipendente.

## Agentic File Search 🤖

Nessun embedding precomputato, si crea una struttura di file e cartelle, che diventa parte del ragionamento.

Si basa su 3 fasi:
1. **Anteprima in parallelo.** L'agente sfoglia tutti i documenti di una cartella in una prima passata (header, sommari, prime righe).
2. **Estrazione selettiva.** Solo i documenti giudicati rilevanti vengono letti per intero.
3. **Segue i riferimenti.** Se un documento rilevante rimanda a uno precedentemente saltato, l'agente torna indietro e lo apre.

Il funzionamento avviene attraverso dei ***tools***, e il formato migliore per gestire la memoria è il ***Markdown***.

## LLM Wiki 📖

La conoscenza viene **compilata una volta** e poi tenuta aggiornata, non ri-deriva da ogni domanda. 

In una cartella *raw* vengono posizionati tutti i documenti "sporchi" (PDF, CSV, TXT, MD, IMG), e un agente crea una nuova cartella che conterrà tanti file markdown che contengono dei *backlink* tra loro per i collegamenti, poi un markdown indicen e un markdown di log che traccia tutte le modifiche della conoscenza.

Si può usare Obsidian per visualizzare tali documenti markdown e il grafo.

Il percorso dell'agente consiste nel leggere l'index, leggere i documenti rilevanti e i link linkati dai quei documenti.

L'architettura può essere riassunta in tre livelli:
- **Raw sources.** Articoli, paper, immagini, dati. La fonte di verità che viene letta dal LLM.
- **La Wiki.** Pagine markdown interlinkate, con concetti, entità, sintesi, indice. Viene generata e mantenuta dal LLM.
- **Lo schema.** Un file CLAUDE.md o AGENTS.md con convenzioni, workflow, struttura.

Vi è una funzionalità detta **Lint** che si occupa di manutenere la wiki, come link malformati, contraddizioni, ecc. 


# Riepilogo

![[Pasted image 20260430113447.png]]