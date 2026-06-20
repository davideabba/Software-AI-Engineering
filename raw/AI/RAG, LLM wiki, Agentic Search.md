
---
title: "RAG, LLM Wiki, Agentic Search: Differenze, Costi e Use Case (2026)"
source: "https://pasqualepillitteri.it/news/1495/differenza-rag-llm-wiki-agentic-search-guida-2026"
author:
  - "[[Pasquale Pillitteri]]"
published: 2026-04-28
created: 2026-05-04
description: "Differenze tra RAG, LLM Wiki di Karpathy e agentic search. Evoluzione 2022-2026, vantaggi, svantaggi, costi enterprise e use case reali per scegliere l'architettura AI giusta."
tags:
  - "clippings"
---
Tre architetture si contendono il ruolo di "memoria esterna" per i Large Language Model nel 2026, e la scelta sbagliata può costare a un'azienda fino a 500.000 dollari al mese in bolletta cloud. RAG (Retrieval-Augmented Generation, la tecnica che recupera frammenti di documenti al momento della query e li passa al modello come contesto) ha dominato dal 2020 al 2024, poi è arrivato il pattern LLM Wiki (per una guida pratica end-to-end vedi il workflow completo con [GLM-OCR di Z.AI in locale per costruire una base di conoscenza con Obsidian](https://pasqualepillitteri.it/news/1791/glm-ocr-locale-pdf-markdown-obsidian-llm-wiki)) proposto da Andrej Karpathy nell'aprile 2026, mentre l'agentic search ha consolidato la sua posizione come standard de facto per le applicazioni enterprise complesse. Secondo i dati raccolti da Techment, il 75% delle applicazioni enterprise userà architetture ibride entro la fine del 2026, combinando questi tre approcci invece di sceglierne uno solo.

Questo articolo spiega le tre architetture in modo concreto, con cifre verificabili sui costi, esempi pratici di adozione e un confronto onesto sui vantaggi e svantaggi reali. La differenza tra RAG, LLM Wiki e agentic search non è accademica: tocca direttamente il TCO (Total Cost of Ownership, il costo totale di proprietà di un sistema software) e la qualità delle risposte che gli utenti finali vedono ogni giorno.

![RAG vs LLM Wiki vs Agentic Search: confronto architetture AI knowledge base 2026](https://pasqualepillitteri.it/uploads/img/news/rag-llm-wiki-agentic-search-2026.png)

Le tre architetture di knowledge base AI a confronto: RAG (2020), Agentic Search (2025), LLM Wiki (2026)


## Le tre architetture in 60 secondi

Prima di entrare nei dettagli vale la pena fissare le definizioni con un esempio concreto, lo stesso che useremo poi per il confronto pratico. Immaginiamo un'azienda di consulenza che ha 50.000 documenti interni (contratti, report, slide, paper) e vuole permettere ai dipendenti di interrogarli in linguaggio naturale.

Con il **RAG tradizionale** ogni documento viene spezzato in chunk da 500-1000 token, ciascun chunk viene trasformato in un vettore numerico e salvato in un database vettoriale come Pinecone o Weaviate; quando l'utente fa una domanda, il sistema cerca i chunk più simili e li passa all'LLM insieme alla query. È un processo veloce ma stateless: ogni domanda riparte da zero.

Con la **LLM Wiki** di Karpathy l'agente AI legge i documenti una volta sola, ne estrae i concetti chiave e costruisce un wiki in markdown organizzato per topic, entità e relazioni. Il wiki diventa un artefatto persistente che cresce nel tempo, e quando arriva una nuova domanda l'LLM consulta direttamente le pagine già sintetizzate, senza vector search.

Con l' **agentic search** il modello agisce come un ricercatore: decide autonomamente quali fonti interrogare, raffina le query iterativamente, valuta la qualità dei risultati e, se serve, lancia nuove ricerche fino ad avere abbastanza informazioni per rispondere. Ogni interazione è un workflow multi-step orchestrato dall'agente, non una semplice lookup.

**Nota tecnica:** queste tre architetture non sono mutuamente esclusive. Le implementazioni enterprise più moderne nel 2026 combinano agentic loop, retrieval vettoriale e wiki strutturati in pipeline ibride, dove l'agente decide quale strumento usare in base al tipo di query.

## RAG: come funziona e perché ha rivoluzionato l'AI dal 2020 al 2024

Il termine RAG nasce nel 2020 con il paper di Patrick Lewis e colleghi, ricercatori allora a Facebook AI Research, che proponevano di affiancare alla generazione del modello un motore di retrieval per ridurre le allucinazioni. L'idea era semplice: invece di chiedere al modello di rispondere solo dalla sua memoria parametrica (i pesi addestrati), gli si fornisce contesto fresco recuperato da una fonte esterna verificabile.

Il vero salto di scala arriva nel 2022 con RETRO (Retrieval-Enhanced Transformer) di DeepMind, che dimostra come un modello da 7,5 miliardi di parametri possa eguagliare le prestazioni di GPT-3 da 175 miliardi se ha accesso a un retrieval engine ben costruito. Da quel momento RAG diventa il pattern di riferimento per quasi tutti i prodotti enterprise basati su LLM, da Notion AI a Microsoft Copilot, fino agli assistenti documentali interni di banche, studi legali e aziende sanitarie.

### L'architettura tipica di un sistema RAG

Una pipeline RAG completa nel 2026 ha cinque livelli ben distinti: ingestion (caricamento e parsing dei documenti), chunking (divisione in frammenti gestibili), embedding (trasformazione di ogni chunk in un vettore numerico tramite modelli come OpenAI text-embedding-3 o Cohere embed), indexing (salvataggio in un database vettoriale) e query-time retrieval (ricerca dei chunk più simili al momento della domanda). Su questa base si possono aggiungere tecniche più sofisticate come hybrid search (combinazione di ricerca vettoriale e keyword search BM25), reranking con modelli dedicati, e citation extraction per attribuire ogni affermazione a una fonte specifica.

### I limiti emersi nel 2024-2025

Sotto la patina di affidabilità, RAG ha mostrato fragilità importanti. Il chunking spezza il contesto: un frammento da 500 token estratto da un report di 50 pagine perde gran parte del significato circostante, e l'LLM riceve informazioni decontestualizzate. La ricerca vettoriale può confondere documenti simili: se cerco "differenza tra modello A e modello B" il sistema spesso recupera testi che parlano di entrambi senza distinguerli, generando risposte miste e inaccurate. Le allucinazioni non spariscono: come hanno notato i ricercatori di Ars Technica nel 2025, "RAG non è una soluzione diretta perché l'LLM può ancora allucinare sopra il materiale recuperato". E soprattutto i costi crescono linearmente con il volume di query, perché ogni domanda paga embedding, vector search e finestra di contesto allungata.

**Costo nascosto del RAG enterprise:** a 50 milioni di query mensili, l'overhead della finestra di contesto allungata raggiunge circa 43.750 dollari al mese in costi LLM aggiuntivi, secondo le analisi di Stratagem Systems del marzo 2026.

## LLM Wiki: il pattern di Karpathy che bypassa il vector store

Il 18 aprile 2026 Andrej Karpathy, ex direttore AI di Tesla e co-fondatore di OpenAI, pubblica un gist su GitHub intitolato "llm-wiki.md" in cui descrive un'architettura radicalmente diversa per l'accesso alla conoscenza. Il post diventa virale nelle 24 ore successive e ispira una decina di implementazioni open-source nelle settimane immediatamente successive, da llmwiki di Lucas Astorian al packaging in Agent Skills di Astro-Han, fino al second-brain di Nicholas Spisak per Obsidian.

L'intuizione di fondo è che gli LLM moderni sono molto bravi a sintetizzare, ma vengono usati nei sistemi RAG come semplici motori di lookup. Karpathy capovolge la prospettiva: invece di interrogare i documenti raw a ogni query, l'LLM compila una volta sola una conoscenza strutturata in markdown e poi consulta questa conoscenza già digerita. Il wiki diventa un artefatto persistente che cresce, si auto-corregge e mantiene cross-reference tra concetti.

### L'architettura a tre strati

Il pattern LLM Wiki si articola in tre directory ben distinte. La directory `raw/` contiene le fonti originali immutabili (paper, articoli, screenshot, trascrizioni). La directory `wiki/` raccoglie le pagine markdown generate dall'LLM, organizzate per entità, concetti e topic. Il file `CLAUDE.md` definisce lo schema, le convenzioni di naming e il workflow di compilazione. Quando si aggiunge una nuova fonte, l'agente AI legge il documento, identifica le entità menzionate, aggiorna le pagine esistenti, crea nuove pagine se necessario e segnala contraddizioni con quanto già scritto.

### Il vantaggio della "compilazione una tantum"

Karpathy stesso lo riassume con una frase efficace nel suo gist: "Obsidian è l'IDE; l'LLM è il programmatore; il wiki è il codebase". Il punto è che il lavoro di sintesi viene fatto in fase di ingest, non in fase di query. Quando un utente fa una domanda, l'LLM lavora con sintesi pulite e dense invece che con prosa raw chunkizzata. Non serve embedding, non serve similarity search, non serve reranking: la struttura stessa del wiki guida la navigazione, esattamente come un buon manuale tecnico permette di trovare quello che serve sfogliando l'indice invece di fare ricerche full-text.

### Quando LLM Wiki batte RAG

- **Knowledge base finite e ben definite:** 20-50 documenti su un dominio chiuso (FAQ aziendale, manuale di prodotto, libro di studio)
- **Domini concettuali ricchi di relazioni:** dove le entità si rimandano l'una all'altra (ricerca scientifica, knowledge graph aziendali)
- **Casi d'uso personali:** tracciamento obiettivi, lettura libri, ricerca tematica su settimane o mesi
- **Esigenza di trasparenza totale:** il wiki è leggibile da un umano, mentre i vettori in Pinecone sono opachi

Il pattern si sposa naturalmente con strumenti come [Obsidian abbinato a Claude Code per costruire un secondo cervello](https://pasqualepillitteri.it/news/961/obsidian-claude-code-second-brain-memoria-persistente), e diversi sviluppatori stanno già usando il pattern di Karpathy come base per le proprie skill personali. Anche progetti come [CodeSpeak di Andrey Breslav, basato su specifiche in markdown](https://pasqualepillitteri.it/news/940/codespeak-breslav-specifiche-markdown-ai-recensione), condividono la stessa filosofia di "compilare la conoscenza prima di usarla".

## Agentic Search: il modello diventa ricercatore

L'agentic search rappresenta l'evoluzione più ambiziosa: trasformare l'LLM da semplice rispondente a vero e proprio ricercatore autonomo che pianifica, esegue ricerche multiple, valuta i risultati e itera fino a trovare la risposta. Il paradigma nasce a fine 2023 con i primi esperimenti di ReAct prompting (Reasoning + Acting, una tecnica che alterna passi di ragionamento e chiamate a strumenti esterni) e matura nel 2024-2025 con framework come LangGraph di LangChain, AutoGen di Microsoft e Claude Agent SDK di Anthropic.

Il survey "Agentic Retrieval-Augmented Generation" pubblicato su arXiv nel gennaio 2025 identifica quattro pattern fondamentali che caratterizzano questi sistemi: reflection (capacità di valutare criticamente la propria risposta), planning (decomposizione di un problema complesso in sotto-task), tool use (chiamata dinamica di API, database e motori di ricerca esterni) e multi-agent collaboration (più agenti specializzati che cooperano su un singolo problema).

### Self-RAG e Corrective RAG

Due varianti specifiche meritano attenzione perché stanno entrando in produzione su scala enterprise. Self-RAG, introdotto da ricercatori dell'Università di Washington nel 2024, aggiunge un meccanismo di riflessione: il modello critica i propri output e decide se le evidenze recuperate supportano davvero la risposta, altrimenti lancia una nuova ricerca. Corrective RAG (CRAG), proposto pochi mesi dopo, valuta dinamicamente la qualità dei documenti recuperati e applica azioni correttive (riscrivere la query, cercare su web, scartare frammenti irrilevanti) prima di generare la risposta finale.

### Le applicazioni enterprise nel 2026

L'agentic search sta diventando il backbone di prodotti come [Google Deep Research e Deep Research Max basati su Gemini 3.1 Pro](https://pasqualepillitteri.it/news/1190/google-deep-research-max-gemini-3-1-pro-agenti-ai), di [Gemini Enterprise con Agent Designer visivo](https://pasqualepillitteri.it/news/1430/gemini-enterprise-2026-agent-designer-inbox-esempi-pratici), di Glean Enterprise Search e di tool verticali come [Consensus AI per la ricerca scientifica su 220 milioni di paper](https://pasqualepillitteri.it/news/1290/consensus-ai-motore-ricerca-paper-scientifici-guida-2026). Anche i framework open-source per costruire questi sistemi sono esplosi: la nostra [guida ai 10 framework AI Agent open-source del 2026](https://pasqualepillitteri.it/news/1475/10-framework-ai-agent-open-source-2026) copre LangChain, CrewAI, AutoGen, OpenHands e altri sette progetti che permettono di assemblare agentic loop in produzione.

I numeri di adozione enterprise raccontano la stessa storia: secondo Glean Research, in una valutazione cieca su circa 280 query enterprise complesse, le risposte di un agentic search dedicato sono state preferite 1,9 volte più spesso di quelle di ChatGPT generico e 1,6 volte più spesso di quelle di Claude direttamente. Il motivo è semplice: l'agente sa quando fermarsi, quando cercare ancora, quando ammettere di non avere informazioni sufficienti.

## Confronto diretto: vantaggi, svantaggi e costi

Mettendo le tre architetture una accanto all'altra emerge un quadro chiaro. RAG resta la scelta più semplice e veloce da implementare, con costi di sviluppo iniziali tra i 15.000 e i 40.000 dollari per un MVP secondo i dati di ZTABS del 2026. LLM Wiki ha costi di setup ridicoli (basta uno script Python e un account Claude o GPT-5) ma scala male quando le fonti sono in ordine di milioni. L'agentic search richiede investimento iniziale serio (100.000-200.000 dollari per implementazioni enterprise complete) ma ripaga in qualità delle risposte e flessibilità.

### Tabella di confronto sintetica

| Caratteristica | RAG | LLM Wiki | Agentic Search |
| --- | --- | --- | --- |
| **Setup costo** | $15K-$40K MVP | $0-$2K (script open) | $100K-$200K enterprise |
| **Costo per query** | $0.005-$0.01 | $0.001-$0.003 | $0.05-$0.30 |
| **Scala max** | Miliardi di documenti | Migliaia di pagine wiki | Dipende dai tool collegati |
| **Latenza** | 300-800ms | 200-500ms | 2-30 secondi |
| **Aggiornamento** | Re-embedding chunk | Re-compile incrementale | Real-time via tool |
| **Trasparenza** | Bassa (vettori opachi) | Alta (markdown leggibile) | Media (trace agent) |

![RAG vs LLM Wiki vs Agentic Search: quale scegliere nel 2026 per la knowledge base AI](https://pasqualepillitteri.it/uploads/img/news/rag-llm-wiki-agentic-search-infographic-it.jpg)

Confronto visivo delle tre architetture AI per knowledge management con costi, latenza e scenari di scelta

I prezzi delle infrastrutture vector database confermano questa stratificazione. Pinecone fa pagare 16 dollari per milione di Read Units sul piano Standard, Weaviate Cloud parte da 25 dollari mensili e Qdrant Cloud parte da 0,014 dollari per ora di nodo. Il punto di pareggio tra cloud gestito e self-hosted si raggiunge intorno ai 60-80 milioni di query mensili, secondo le analisi di Ranksquire pubblicate a marzo 2026.

## Casi d'uso reali per ogni architettura

La scelta dell'architettura giusta dipende quasi sempre dal tipo di query, dal volume e dal grado di reasoning richiesto. Vediamo tre scenari concreti che illustrano dove ciascuno approccio brilla davvero.

### RAG vince qui

Customer support con knowledge base di prodotto stabile (5.000-50.000 articoli), policy lookup nelle aziende regolamentate, ricerca interna su archivi di contratti, chatbot per portali e-commerce. In tutti questi casi le query sono ripetitive, le risposte si trovano in documenti chiari e singoli, e la latenza sub-secondo è importante. Lo studio legale che cerca clausole standard nei propri contratti, l'azienda farmaceutica che vuole interrogare i propri SOP (Standard Operating Procedure, le procedure operative standardizzate), la banca che deve rispondere a domande sui prodotti finanziari: tutti casi da manuale per il RAG.

### LLM Wiki vince qui

Knowledge base personali e ricerca individuale, secondo cervello per professionisti, documentazione tecnica strutturata di un progetto software, study guide per studenti universitari, archivi di interviste e note di lavoro. Il discrimine è la dimensione contenuta (qualche migliaio di pagine al massimo) e la presenza di relazioni concettuali ricche tra le entità. Un giornalista che lavora su un'inchiesta pluriennale, un ricercatore che segue una linea di studio per dottorato, un consulente che vuole tenere traccia delle proprie esperienze cliente: per loro l'LLM Wiki è imbattibile in termini di rapporto qualità-costo.

### Agentic Search vince qui

Analisi finanziaria multi-fonte (combinare report SEC, dati di mercato, news, filing aziendali), ricerca scientifica che attraversa decine di paper, due diligence M&A, discovery legale su corpora eterogenei, intelligence competitiva, supporto medico decisionale. Tutti contesti in cui la domanda iniziale dell'utente è solo il punto di partenza e la risposta vera richiede esplorazione iterativa. Anche le moderne tecniche di [prompt engineering avanzato spiegate nei paper scientifici del 2026](https://pasqualepillitteri.it/news/1089/prompt-engineering-2026-framework-guida-completa) convergono verso pattern agentici di tipo planning + reflection.

## Quanto costa davvero implementare ognuna nel 2026

I numeri ufficiali del 2026 mostrano una forbice ampia che riflette la maturità diversa delle tre soluzioni. Per RAG, una pipeline base costa tra 15.000 e 40.000 dollari di sviluppo iniziale e si realizza in 4-8 settimane; un sistema RAG di produzione completo richiede 40.000-100.000 dollari e 3-5 mesi; una piattaforma RAG enterprise con governance, monitoring e multi-tenancy raggiunge facilmente i 100.000-200.000 dollari e 5-8 mesi di lavoro. I costi operativi mensili per un sistema mid-market sono 8.000-15.000 dollari di piattaforma più 6.000-12.000 dollari di tempo ingegneristico allocato.

Per la LLM Wiki la situazione è diametralmente opposta: il setup costa praticamente zero (uno script Python più un account Claude o GPT-5), e i costi operativi sono dominati dalle chiamate LLM in fase di compilazione iniziale. Compilare un wiki da 10.000 documenti costa circa 200-500 dollari una tantum con i prezzi di aprile 2026, poi gli aggiornamenti incrementali costano pochi centesimi a documento aggiunto. Il limite vero è la scala: oltre i 50.000-100.000 documenti la manutenzione diventa scomoda anche per un LLM.

L'agentic search ha la struttura di costo più articolata. Lo sviluppo enterprise parte da 100.000 dollari e arriva facilmente a 500.000 per sistemi multi-agente complessi con governance avanzata. Il costo per query è il più alto perché ogni interazione attiva multipli round-trip al modello: una query di Deep Research di Google può consumare 5-30 dollari di compute, e i piani enterprise di Glean partono da 40-50 dollari per utente al mese.

**Attenzione al costo nascosto numero uno:** il data cleaning e il preprocessing dei documenti rappresentano il 30-50% del costo totale di un progetto RAG, secondo Stratagem Systems. Molte aziende sottostimano questo costo di un fattore 2-3 perché guardano solo a infrastruttura e LLM.

## Quale scegliere nel 2026: il decision tree

Una regola operativa che funziona nella maggioranza dei casi: parti dalla domanda "quanto è bounded la mia knowledge base?". Se hai un dominio finito e ben definito (un manuale, una FAQ, un libro), il pattern LLM Wiki è quasi sempre la scelta giusta perché ti dà controllo totale, costi minimi e trasparenza massima. Se invece il tuo corpus è grande e relativamente statico (decine di migliaia o milioni di documenti), il RAG resta lo standard di riferimento per il rapporto costo-prestazioni. Se infine le query degli utenti richiedono esplorazione, comparazione tra fonti diverse e ragionamento multi-step, allora investi nell'agentic search.

Per le applicazioni enterprise serie nel 2026 la risposta più diffusa è ibrida: un agentic system che ha al suo interno un RAG come uno dei tool disponibili, e magari anche un wiki strutturato per i topic core del business. Questo pattern permette di combinare il miglioramento del 50% in accuratezza tipico del RAG con i guadagni del 35-45% in efficienza tipici degli agenti, secondo i benchmark di Techment.

## Domande Frequenti (FAQ)

#### 1\. RAG e fine-tuning sono alternative o complementari?

**Sono complementari, non alternative.** Il fine-tuning insegna al modello "come comportarsi" (formato di output, vocabolario di dominio, stile di risposta), mentre il RAG fornisce "cosa sapere" (fatti aggiornati, documenti proprietari). Un'architettura comune nel 2026 combina un modello fine-tuned su un dominio specifico con una pipeline RAG che recupera contesto fresco a query time. Il fine-tuning conviene quando hai più di 10 milioni di query mensili sullo stesso dominio, perché il costo di training si ammortizza sul volume.

#### 2\. Quanto è grande davvero il rischio di allucinazione con RAG?

**RAG riduce le allucinazioni del 60-80% ma non le elimina.** Studi di Pinecone e Writer del 2025 mostrano che con RAG ben implementato le risposte fattualmente errate scendono dal 25-30% di un LLM puro al 5-10%. Le allucinazioni residue arrivano da chunk decontestualizzati, retrieval imperfetto o tentativi del modello di "completare" informazioni mancanti. Le tecniche di Self-RAG e CRAG abbattono ulteriormente questo numero introducendo verifica attiva, ma a costo di latenza maggiore.

#### 3\. Posso costruire una LLM Wiki senza essere uno sviluppatore?

**Sì, esistono già diverse implementazioni no-code.** Il progetto llmwiki di Lucas Astorian permette di caricare documenti via interfaccia web e collegare un account Claude tramite MCP (Model Context Protocol, lo standard aperto per l'integrazione di tool con i modelli AI). Anche il pacchetto Agent Skills di Astro-Han funziona out-of-the-box con Claude Code, Cursor e Codex senza configurazione. Per casi semplici basta una cartella di file markdown e un prompt iniziale ben fatto.

#### 4\. Qual è la latenza media reale di un agentic search in produzione?

**Tra 2 e 30 secondi a seconda della complessità.** Una query semplice che richiede un solo round di tool use risponde in 2-5 secondi. Un Deep Research che esplora dieci fonti e itera tre volte può richiedere 15-30 secondi. Per applicazioni interattive consumer questo è inaccettabile, motivo per cui l'agentic search nel 2026 è spesso esposto come "modalità background" che restituisce un report dopo pochi minuti invece di una risposta sincrona.

#### 5\. Quali aziende dovrebbero rimanere su RAG e quali passare ad agentic?

**Resta su RAG se: hai meno di 5 milioni di query/mese, le tue domande sono lookup semplici e prevedibili, la tua infrastruttura tecnica è limitata.** Passa ad agentic se: le tue query richiedono comparazione tra fonti, hai bisogno di citazioni verificate per uso legale o medico, i tuoi utenti finali sono knowledge worker disposti ad aspettare risposte di qualità superiore. Per la maggioranza delle PMI italiane nel 2026 il consiglio resta RAG ben fatto, eventualmente potenziato con un agentic loop solo per i 10-20% di query più complesse.

#### 6\. Quanto incidono i vector database sul costo totale del RAG?

**Tra il 15% e il 40% dei costi infrastrutturali, a seconda del provider.** Pinecone Serverless conviene fino a 60 milioni di query mensili, oltre questa soglia Qdrant self-hosted o Weaviate su VPS dedicato risparmiano dal 3 al 10 volte. Lo storage di 10 milioni di vettori 1536-dimensionali (formato standard di OpenAI) costa circa 28,71 dollari/mese su Pinecone, ma il vero driver di costo sono le Read Units a 16 dollari per milione. Le aziende con traffico costante e prevedibile dovrebbero valutare seriamente il self-hosting.

## Conclusioni

RAG, LLM Wiki e agentic search non sono in competizione tra loro: rappresentano tre punti diversi su uno spettro di compromessi tra costo, latenza, qualità delle risposte e complessità di implementazione. Il RAG resta la scelta default per il 2026 in ambito enterprise, l'LLM Wiki di Karpathy è la novità più interessante per knowledge base personali e domini contenuti, l'agentic search è il futuro per applicazioni che richiedono ragionamento multi-step verificabile.

Il consiglio operativo è partire piccoli e misurare: un proof of concept RAG su 1.000 documenti costa qualche centinaio di dollari e si fa in due settimane. Da lì, in base ai pattern di query reali degli utenti, si decide se vale la pena complicare l'architettura con agentic loop o se invece il caso d'uso si presta a un wiki compilato. Le aziende che falliscono con l'AI nel 2026 non sono quelle che scelgono l'architettura sbagliata: sono quelle che scelgono senza misurare.