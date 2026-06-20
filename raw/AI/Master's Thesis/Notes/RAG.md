I LLM soffrono di allucinazioni, conoscenze datate e processi di ragionamento che non sono trasparenti e tracciabili.
RAG dovrebbe risolvere il problema incorporando conoscenza da database esterni. Oltre a migliorare performance e accuratezza, questo consente anche di aggiornare continuamente la base di conoscenza e ampliarla.

I paradigmi RAG hanno subito un processo di sviluppo dalla versione Naive, poi quella Advanced e infine quella Modular.

I fondamenti dei paradigmi RAG sono: *retrieval*, *generation* e *augmentation*.


## <span style="font-size:18pt;color:#39e75aff;"><b>Perchè LLM soffre di allucinazioni?</b></span>

Quando si dice che i **Large Language Models (LLM)**, come GPT o LLaMA, **soffrono di allucinazioni**, ci si riferisce al fenomeno per cui questi modelli generano risposte che sembrano plausibili e ben strutturate, ma che in realtà sono **false, imprecise o completamente inventate**. Le allucinazioni possono includere fatti inesistenti, citazioni di fonti che non esistono, oppure informazioni errate presentate come veritiere.

Le allucinazioni sono dovute alla natura probabilistica e statistica dei LLM, i quali sono basati su dati di addestramento e su dei pattern linguistici piuttosto che sulla comprensione profonda del significato. Infatti, non hanno modo di accedere ad informazioni aggiornate, hanno solo una rappresentazione di ciò che hanno appreso durante l’allenamento.

La natura probabilistica riguarda il fatto che questi modelli cercano solo di predire la sequenza più probabile di parole in base al contesto, per cui se il contesto è ambiguo e manca di informazioni, i buchi verranno riempiti con dettagli inventati che suonano come credibili.


## <span style="font-size:18pt;color:#39e75aff;"><b>Concetti principali e attuali paradigmi RAG</b></span>

Un esempio di applicazione semplice si ha quando un utente interroga un LLM su un argomento discusso di recente. Il modello non riesce a fornire informazioni aggiornate. RAG interviene integrando database esterni che siano affini alla query dell’utente. Queste informazioni vengono combinati con la risposta del LLM per dare l’output all’utente.

### <span style="font-size:16pt;color:#4fffe7ff;"><b>Naive RAG</b></span>

- <span style="color:#b32625ff;"><b>Indexing:</b></span> 
Inizia con la pulizia e l’estrazione di dati grezzi da PDF, HTML, Word e Markdown, con la poi conversione in formato testo semplice. I modelli di linguaggio hanno limitazioni per quanto riguarda il contesto, per cui il testo viene suddiviso in piccoli chunk.
I chunk vengono codificati tramite una rappresentazione vettoriale detta *embedding* e salvati in un db vettoriale. Questo è fondamentale per rendere efficiente la ricerca per similarità.

- <span style="color:#b32625ff;"><b>Retrieval:</b></span>
Anche la query dell’utente viene rappresentata tramite embeddings vettoriali. Si calcola un punteggio di similarità tra gli embedding della query e quelli dei chunk. Il sistema sceglie i primi K chunk che forniscono i risultati di match migliore e così amplia il contesto del prompt dell’utente.

- <span style="color:#b32625ff;"><b>Generation:</b></span>
La query e i documenti scelti vengono sintetizzati in un prompt che viene dato in pasto al LLM per formulare la risposta. In base al task il LLM potrà rispondere basandosi maggiormente o meno sulle informazioni fornite. 
In caso la conversazione continui, lo storico della conversazione diventa altro contesto che viene integrato.

<span style="color:#a615fbff;"><b>Svantaggi:</b></span>
La fase di retrieval solitamente non ha alta Precision e Recall, per cui si selezionano chunk non molto rilevanti.

La fase di generazione soffre di allucinazione, può generare contenuto non legato alla query utente, la qualità si abbassa.

L’integrazione di informazioni recuperate durante il retrieval è complesso e a volte può portare a risultati non coesi e a ridondanza. Siccome la complessità può aumentare, una sola IR potrebbe non essere sufficiente per dare adeguato contesto.

<span style="font-family:.AppleSystemUIFontBold;font-size:16pt;color:#4fffe7ff;"><b>Advanced RAG</b></span>

Con l’obiettivo di migliorare la fase di Retrieval, aggiunge fasi di *pre-retrieval* e *post-retrieval.* Per affrontare i problemi di indicizzazione, le tecniche utilizzano una *sliding window*, segmentazione e incorporazione di metadati. 

<span style="color:#b32625ff;"><b>Pre-retrieval process:</b></span>
Per prima cosa ottimizza la struttura di ricerca e la query originale, con l’obiettivo di fornire una qualità più alta del contenuto da indicizzare.

<span style="color:#b32625ff;"><b>Post-retrieval process:</b></span>
Dopo che il contesto è stato recuperato, va integrato bene con la query. I metodi usano tecniche di *re-rank* e di compressione.
Riclassificare le informazioni recuperate per trasferire il contenuto più rilevante ai bordi del prompt è una strategia chiave (accade in LangChain).
L'alimentazione di tutti i documenti rilevanti direttamente negli LLM può portare a un sovraccarico di informazioni, diluendo l'attenzione sui dettagli chiave con contenuti irrilevanti. Per mitigare questo, gli sforzi post-recupero si concentrano sulla selezione delle informazioni essenziali, enfatizzando le sezioni critiche e accorciando il contesto da elaborare.

<span style="font-family:.AppleSystemUIFontBold;font-size:16pt;color:#4fffe7ff;"><b>Modular RAG</b></span>

Fornisce molta più adattabilità e versatilità incorporando diverse strategie per i suoi componenti, come ad esempio un modulo di ricerca. Combina sia un processamento sequenziale sia un allenamento end-to-end con i suoi componenti.

<span style="color:#b32625ff;"><b>Nuovi moduli:</b></span>
Ci sono componenti per migliorare le capacitò di retrieval e processing. 

Il *Search module* si adatta a scenari specifici, consentendo la ricerca attraverso varie sorgenti dati come motori di ricerca, database, knowledge graphs. 

*RAG-Fusion* implementa un meccanismo multi-query che espande le query utente utilizzando vettori paralleli e meccanismi di ricerca intelligente basati sulla ri-classificazione.

Il *Memory module* sfrutta la memoria dell'LLM per guidare il recupero delle informazioni, creando un pool di memoria illimitata che allinea il testo alla distribuzione dei dati con un meccanismo iterativo.

*Routing* serve a navigare attraverso diverse sorgenti dati, selezionando il percorso ottimo per una query.

Il *Predict module* punta a diminuire il rumore e la ridondanza generando il contesto tramite il LLM.

Il modulo *Task Adapter* adatta RAG a varie attività a valle, automatizzando il recupero rapido per gli input *zero-shot* e creando retriever specifici per attività attraverso la generazione di query *few-shot.*

<span style="color:#b32625ff;"><b>Nuovi pattern:</b></span>
In base al task specifico, questo RAG può essere altamente adattabile tramite i suoi moduli, non è un semplice *Retrieve-and-Read* come accade per le altre due versioni di RAG.

L’approccio *Rewrite-Retrieve-Read* consente al LLM di affinare le query attraverso un modulo di riscrittura che sfrutta meccanismi di feedback che alimentano il contesto.

L’approccio *Generate-Read* sostituisce retrieval tradizionali con il contenuto generato dal LLM.

*Recite-Read* enfatizza il recupero dai pesi del modello, potenziando la capacità del modello di gestire compiti ad alta intensità di conoscenza.

I moduli possono essere riorganizzati e sistemati in modo da garantire maggiore sinergia e quindi alta adattabilità e flessibilità. Questo porta vantaggi anche in caso di integrazione con altre tecnologie come il *fine-tuning* e il *reinforcement-learning*).

<span style="font-family:.AppleSystemUIFontBold;font-size:16pt;color:#4fffe7ff;"><b>RAG vs Fine-Tuning vs Prompt Engineering</b></span>

RAG è spesso messo a paragone con il Fine-Tuning e il Prompt Engineering. 
In realtà queste tecniche differiscono in quanto a due aspetti principali: requisiti di conoscenza esterni e requisiti di adattamento del modello.

<span style="font-family:.AppleSystemUIFontBold;color:#b32625ff;"><b>1. Prompt Engineering</b></span>

Sfrutta le capacità innate di un modello con un intervento minimo, senza richiedere conoscenza esterna o adattamenti significativi del modello.

Vantaggi: Ideale per ottenere rapidamente risposte sfruttando ciò che il modello sa già, senza bisogno di risorse aggiuntive.

Limiti: Non è adatto per scenari che richiedono conoscenze specifiche o aggiornate che il modello non ha già appreso.

<span style="font-family:.AppleSystemUIFontBold;color:#b32625ff;"><b>2. RAG (Retrieval-Augmented Generation)</b></span>

Simile a fornire un libro di testo su misura per il modello, permettendo il recupero di informazioni esterne al volo.

Vantaggi:
	•	Eccelle nei contesti dinamici con aggiornamenti in tempo reale.
	•	Alta interpretabilità grazie all’uso di fonti di conoscenza esterne.

Limiti:
	•	Maggiore latenza dovuta al recupero delle informazioni.
	•	Considerazioni etiche legate alla gestione dei dati esterni.

<span style="font-family:.AppleSystemUIFontBold;color:#b32625ff;"><b>3. Fine-Tuning (FT)</b></span>

Paragonabile a uno studente che assimila conoscenze nel tempo, adattando il modello a replicare strutture, stili o formati specifici.

Vantaggi:
	•	Consente una personalizzazione profonda del comportamento e dello stile 		del modello.
	•	Può ridurre le “allucinazioni” (informazioni inventate dal modello).

Limiti:
	•	Statico: richiede un nuovo addestramento per aggiornamenti.
	•	Necessita di risorse computazionali elevate per la preparazione del 					dataset e il training.
	•	Può avere difficoltà con dati completamente nuovi o non visti durante 				l’addestramento.

<span style="font-family:.AppleSystemUIFontBold;color:#b32625ff;"><b>Confronto e Sinergia</b></span>

Prestazioni: RAG supera costantemente il Fine-Tuning in compiti che richiedono recupero di informazioni, sia per conoscenze già note che per nuove.

Adattabilità: RAG è migliore per ambienti dinamici, mentre FT offre personalizzazioni profonde ma richiede tempo e risorse per gli aggiornamenti.

Combinazione: RAG e FT non sono mutualmente esclusivi. Insieme, possono potenziare le capacità di un modello, combinando la flessibilità del recupero esterno con la specializzazione interna. Iterazioni multiple possono essere necessarie per ottimizzare i risultati.


## <span style="font-size:18pt;color:#39e75aff;"><b>Information Retrieval (IR): Metodi di ottimizzazione</b></span>

<span style="font-family:.AppleSystemUIFontBold;font-size:16pt;color:#86fbe7ff;"><b>Retrieval Source</b></span>

<span style="color:#a5332dff;"><b>Struttura dei dati</b></span>

- **Unstructured Data:** Principalmente fonti basate su testo come Wikipedia, articoli di notizie e dati specifici del dominio.
- **Semi-Structured Data:** Formati di dati come i PDF che combinano testo e informazioni tabulari. L'elaborazione di questi può essere difficile a causa della potenziale corruzione dei dati e delle difficoltà di ricerca semantica.
- **Structured Data:** Knowledge graphs (KGs) offrono informazioni precise e verificate, ma costruirle e mantenerle può richiedere molte risorse.
- **LLM-Generated Content:** Sfruttare gli LLM per generare informazioni rilevanti può essere efficace, ma richiede un'attenta considerazione della qualità e dell'allineamento con il compito.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Granularità</b></span>

- La scelta della granularità (ad esempio, token, frase, proposizione, documento) influisce sull'equilibrio tra precision e recall.
- La retrieval a grana fine può aumentare la precisione ma può perdere informazioni rilevanti, mentre il recupero a grana grossa può migliorare il richiamo ma introdurre rumore.
- La granularità ottimale dipende dall'attività specifica e dalla natura dell'origine dati.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Considerazioni aggiuntive</b></span>

- **Pre-processing:** Le tecniche di preelaborazione del testo come la tokenizzazione, la stemming e la rimozione delle *stop-word* possono migliorare la precision e la recall.
- **Embedding Model:** La scelta del modello di embedding influenza significativamente la qualità dei calcoli di somiglianza semantica tra query e documenti.
- **Retrieval Efficiency:** Algoritmi di retrieval efficienti sono essenziali per la gestione di set di dati su larga scala e applicazioni in tempo reale.


<span style="font-family:.AppleSystemUIFontBold;font-size:16pt;color:#86fbe7ff;"><b>Indexing Optimization</b></span>

La fase di indicizzazione in RAG è una fase critica che prevede l'elaborazione, la segmentazione e l'incorporazione di documenti per prepararli per un recupero efficiente.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Chunking Strategy</b></span>

- **Fixed-Size Chunking:** I documenti sono divisi in blocchi di dimensioni fisse, bilanciando l'acquisizione del contesto e la riduzione del rumore.
- **Recursive Splits and Sliding Window:** Questo metodo mira a ottimizzare la dimensione del blocco considerando sia il contesto locale che quello globale.
- **Small2Big:** Le frasi sono utilizzate come unità di base e il contesto circostante viene fornito agli LLM per una comprensione più sfumata.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Metadata Attachments</b></span>

- **Document Metadata:** Informazioni come il numero di pagina, l'autore e il timestamp possono essere utilizzate per filtrare e dare priorità ai risultati del recupero.
- **Artificial Metadata:** I riassunti generati e le domande ipotetiche possono migliorare la corrispondenza semantica tra query e documenti.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Structural Index</b></span>

- **Hierarchical Index:** Organizzare i documenti gerarchicamente può accelerare il recupero e migliorare la comprensione del contesto.
- **Knowledge Graph Index:** Sfruttare i KG può perfezionare ulteriormente il processo di indicizzazione catturando le relazioni semantiche tra concetti ed entità.


<span style="font-family:.AppleSystemUIFontBold;font-size:16pt;color:#86fbe7ff;"><b>Query optimization</b></span>

La qualità della query ha un impatto significativo sull'efficacia di un sistema RAG. Per affrontare i limiti di fare affidamento esclusivamente sulla query originale, sono state proposte varie tecniche di perfezionamento delle query.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>1. Query Expansion:</b></span>
- **Multi-Query:** Espandere la query originale in più query correlate per ampliare l'ambito della ricerca e migliorare la pertinenza.
- **Sub-Query:** Suddividere query complesse in sotto-domande più semplici per concentrarsi su aspetti specifici.
- **Chain-of-Verification (CoVe):** Convalida delle query espanse utilizzando LLM per ridurre le allucinazioni e migliorare l'affidabilità.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>2. Query Transformation:</b></span>
- **Query Rewriting:** Riformulare la query originale per migliorarne l'idoneità al retrieval.
- **Hypothetical Document (HyDE):** Generare risposte ipotetiche alla query e concentrarsi sulla somiglianza semantica tra le risposte.
- **Step-Back Prompting:** Astrarre la query a un concetto di livello superiore per migliorare l'ampiezza e la profondità del recupero.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>3. Query Routing:</b></span>
- **Metadata-Based Routing:** Filtrare i documenti in base a metadati come autore, data o argomento.
- **Semantic-Based Routing:** Utilizzo della somiglianza semantica tra la query e il contenuto del documento per instradare le query a modelli di recupero appropriati.
- **Hybrid Routing:** Combinando il routing basato su metadati e semantico per un routing avanzato delle query.


<span style="font-family:.AppleSystemUIFontBold;font-size:16pt;color:#86fbe7ff;"><b>Embedding</b></span>

I modelli di embedding sono essenziali per un efficace recupero delle informazioni nei sistemi RAG. Mappano il testo in rappresentazioni numeriche che catturano informazioni semantiche e sintattiche.

- **Sparse vs. Dense Embeddings:**
	- **Sparse Embeddings:** Affidarsi al *keyword matching* e *term frequency-inverse document frequency (TF-IDF)* per identificare i documenti pertinenti.
	- **Dense Embeddings:** Utilizzare reti neurali per catturare relazioni semantiche e sintattiche tra parole e frasi, consentendo calcoli di somiglianza più sfumati.
- **Advanced Embedding Models:** I recenti progressi hanno portato allo sviluppo di potenti modelli di embedding come AngIE, Voyage e BGE, che sono spesso sintonizzati su compiti o domini specifici.
- **Hybrid Approaches:** La combinazione di recupero sparso e denso può migliorare le prestazioni sfruttando i punti di forza di entrambi i metodi.
- **Fine-Tuning:** Il Fine-tuning di modelli di embedding su dati specifici del dominio può migliorare le prestazioni su attività specializzate e ridurre l'impatto dello spostamento del dominio.
- **LLM-Based Fine-Tuning:** L'utilizzo degli LLM come fonte di supervisione può migliorare ulteriormente la qualità degli embedding, specialmente negli scenari con dati limitati.


<span style="font-family:.AppleSystemUIFontBold;font-size:16pt;color:#86fbe7ff;"><b>Adapter</b></span>

*Adapter-based fine-tuning* è una tecnica che consente un adattamento efficiente ed efficace di grandi modelli linguistici a compiti specifici senza richiedere una riqualificazione completa del modello. Introducendo moduli leggeri, questi approcci mirano a:

- **Improve Task-Specific Performance:** I moduli dell'adattatore possono essere addestrati per migliorare le prestazioni del modello su compiti particolari, come la risposta alle domande o il riepilogo.
- **Reduce Computational Cost:** Allenando solo una piccola parte del modello, i metodi basati su adattatori possono ridurre significativamente i tempi di allenamento e le risorse computazionali.
- **Facilitate Multi-Task Learning:** I moduli adattatore possono essere aggiunti o rimossi per consentire al modello di gestire più attività senza interferire con le sue prestazioni su altre attività.

**Approcci chiave:**
- **UP-RISE:** Sfrutta un prompt retriever per selezionare i prompt pertinenti per le attività zero-shot.
- **AAR:** Introduce un adattatore universale per adattarsi a varie attività a valle.
- **PRCA:** Aggiunge un adattatore contestuale basato sulla ricompensa collegabile per il miglioramento delle prestazioni specifiche delle attività.
- **BGM:** Impiega un modello di bridge Seq2Seq per trasformare le informazioni recuperate in un formato adatto per l'elaborazione LLM.
- **PKG:** Integra la conoscenza in modelli white-box attraverso la messa a punto direttiva, sostituendo il modulo retriever per generare documenti pertinenti.


## <span style="font-size:18pt;color:#39e75aff;"><b>Generation: processi post-retrieval e LLM fine-tuning</b></span>

Per migliorare la qualità degli output RAG, è fondamentale perfezionare sia il contenuto recuperato che l'LLM stesso.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Context Curation</b></span>

- **Reranking:** Riordinare i documenti recuperati in base alla pertinenza e alla diversità.
- **Context Selection/Compression:** Ridurre la quantità di testo di input per concentrarsi sulle informazioni più rilevanti. Ciò può essere ottenuto attraverso tecniche come la potatura dei token, l'estrazione delle informazioni e il filtraggio basato su LLM.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>LLM Fine-Tuning</b></span>

- **Domain-Specific Fine-Tuning:** Adattare l'LLM a domini o compiti specifici per migliorare le prestazioni.
- **Alignment with Human Preferences:** Usare il reinforcement learning per allineare i risultati del LLM con i giudizi umani.
- **Alignment with Retriever Preferences:** Coordinare la formazione del retriever e dell'LLM per garantire la coerenza.
- **Knowledge Distillation:** Trasferire la conoscenza da modelli più grandi e complessi a quelli più piccoli e più efficienti.

Combinando efficacemente queste tecniche, i sistemi RAG possono fornire risposte più accurate, pertinenti e coerenti.


## <span style="font-size:18pt;color:#39e75aff;"><b>Augmentation process</b></span>


![[Pasted Graphic 24.png]]


<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Iterative retrieval</b></span>

Il recupero iterativo è una tecnica che prevede più cicli di recupero e generazione per migliorare la qualità delle risposte. Incorporando il feedback del processo di generazione, il sistema di recupero può adattare e perfezionare la sua ricerca per fornire informazioni più pertinenti.

- **Multiple Retrieval Steps:** Invece di un singolo passaggio di recupero, il recupero iterativo comporta più cicli di ricerca nella knowledge base.
- **Enhanced Contextual Understanding:** Considerando il testo generato, il sistema di recupero può comprendere meglio il contesto in evoluzione della query e fornire informazioni più pertinenti.
- **Improved Response Quality:** Il recupero iterativo può portare a risposte più accurate, coerenti e informative.

**Example: ITER-RETGEN** Utilizza un approccio sinergico che combina la generazione potenziata dal recupero e il recupero potenziato dalla generazione. Ciò consente al modello di perfezionare iterativamente la sua comprensione del compito e generare risposte migliori. Impiegando il recupero iterativo, i sistemi RAG possono superare i limiti del recupero in una sola fase e fornire risposte più sofisticate e informative.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Recursive retrieval</b></span>

Il recupero ricorsivo è una tecnica che prevede il perfezionamento iterativo delle query di ricerca in base ai risultati ottenuti dalle ricerche precedenti. Questo approccio aiuta a migliorare la precisione e la pertinenza dei risultati di ricerca, specialmente in scenari complessi in cui l'intento dell'utente non è immediatamente chiaro.

- **Iterative Refinement:** Il recupero ricorsivo comporta più cicli di ricerca, con ogni ricerca successiva che si basa sui risultati della precedente.
- **Improved Search Accuracy:** Perfezionando la query di ricerca in base ai risultati intermedi, il recupero ricorsivo può portare a informazioni più accurate e pertinenti.
- **Enhanced User Experience:** Il recupero ricorsivo può fornire un'esperienza di ricerca più soddisfacente convergendo gradualmente sulle informazioni desiderate.

**Applicazioni:**
- **Complex Search Scenarios:** Il recupero ricorsivo è particolarmente utile negli scenari in cui la query dell'utente è ambigua o le informazioni desiderate sono altamente specializzate.
- **Hierarchical Data Structures:** Il recupero ricorsivo può essere utilizzato per navigare ed estrarre informazioni da strutture di dati gerarchiche, come documenti con più sezioni o database annidati.
- **Graph-Structured Data:** Se combinato con il recupero multi-hop, il recupero ricorsivo può essere utilizzato per esplorare relazioni complesse tra entità nei dati strutturati con grafici.

Sfruttando il recupero ricorsivo, i sistemi RAG possono migliorare significativamente la loro capacità di comprendere e soddisfare le domande degli utenti, portando a risposte più accurate e informative.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Adaptive retrieval</b></span>

Il recupero adattivo è una tecnica che consente agli LLM di determinare in modo proattivo quando e cosa recuperare, migliorando così l'efficienza e la pertinenza dell'approvvigionamento delle informazioni.

- **Proactive Retrieval:** Gli LLM possono decidere autonomamente quando cercare informazioni, piuttosto che fare affidamento su trigger predefiniti.
- **Contextual Awareness:** Gli LLM possono adattare le loro strategie di recupero in base al contesto attuale della conversazione o dell'attività.
- **Improved Efficiency:** Evitando recuperi non necessari, il recupero adattivo può risparmiare risorse computazionali e migliorare i tempi di risposta.
- **Enhanced Accuracy:** Recuperando selettivamente informazioni rilevanti, il recupero adattivo può migliorare l'accuratezza delle risposte generate da LLM.

**Esempi di Adaptive Retrieval:**
- **Flare:** Monitora la fiducia del processo di generazione e attiva il recupero quando la fiducia scende al di sotto di una soglia.
- **Self-RAG:** Utilizza i "token di riflessione" per consentire al modello di introspezionare i suoi output e decidere quando avviare il recupero.
- **Graph-Toolformer:** Sfrutta un approccio basato su grafici per pianificare ed eseguire azioni di recupero.

Incorporando tecniche di recupero adattivo, i sistemi RAG possono diventare più intelligenti ed efficienti, portando a prestazioni migliorate e l'esperienza dell'utente.

<span style="font-size:18pt;color:#39e75aff;"><b>Valutazione dei modelli RAG</b></span>

Il rapido progresso e la crescente adozione di RAG nel campo della NLP hanno reso necessari metodi di valutazione rigorosi per valutare le loro prestazioni in diverse applicazioni. L'obiettivo principale della valutazione è comprendere e ottimizzare le prestazioni dei modelli RAG in vari scenari.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Downstream Tasks</b></span>

Mentre il compito principale di RAG rimane Question Answering (QA), le sue applicazioni si sono ampliate per comprendere una serie di attività a valle:

- **Single-hop/Multi-hop QA:** Rispondere a domande semplici e complesse recuperando ed elaborando informazioni rilevanti da una base di conoscenza.
- **Multiple-Choice QA:** Selezionando la risposta corretta da una serie di opzioni.
- **Domain-Specific QA:** Affrontare domande all'interno di domini specifici come medicina, diritto o finanza.
- **Long-Form QA:** Generare risposte complete e informative a domande aperte.
- **Information Extraction (IE):** Estrazione di informazioni strutturate da testo non strutturato.
- **Dialogue Generation:** Generare risposte coerenti e contestualmente rilevanti nei sistemi di dialogo.
- **Code Search:** Trovare frammenti di codice pertinenti basati su query di linguaggio naturale.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Evaluation Targets</b></span>

Per valutare in modo completo i modelli RAG, gli sforzi di valutazione si concentrano su due obiettivi chiave:

1. **Retrieval Quality:** Ciò comporta la valutazione dell'efficacia del componente di recupero nell'identificare le informazioni rilevanti dalla knowledge base. Metriche come Hit Rate, Mean Reciprocal Rank (MRR) e Normalized Discounted Cumulative Gain (NDCG) sono comunemente utilizzate per misurare le prestazioni di recupero.
2. **Generation Quality:** Questo valuta la qualità del testo generato, considerando fattori come coerenza, rilevanza e realtà. Metriche come BLEU, ROUGE e valutazione umana sono impiegate per valutare la qualità della generazione.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Evaluation Aspects</b></span>

I modelli RAG sono valutati in base ai seguenti aspetti chiave:
- **Context Relevance:** La capacità del modello di recuperare informazioni rilevanti che affrontano direttamente la query.
- **Answer Faithfulness:** La misura in cui la risposta generata si allinea con le informazioni fornite nel contesto recuperato.
- **Answer Relevance:** La rilevanza della risposta generata alla query originale.
- **Noise Robustness:** La capacità del modello di gestire informazioni rumorose o irrilevanti nel contesto recuperato.
- **Negative Rejection:** La capacità del modello di identificare e rifiutare le domande a cui non è possibile rispondere in base alle informazioni disponibili.
- **Information Integration:** La capacità del modello di combinare informazioni da più fonti per fornire una risposta completa.
- **Counterfactual Robustness:** La resistenza del modello a generare informazioni errate o fuorvianti, anche quando viene richiesto con domande fuorvianti o di parte.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Evaluation Benchmarks and Tools</b></span>

Sono stati sviluppati diversi parametri di riferimento e strumenti per facilitare la valutazione dei modelli RAG:
- **RGB:** Un benchmark che si concentra sulla valutazione delle capacità di recupero e generazione dei modelli RAG.
- **RECALL:** Un benchmark che valuta la capacità del modello di richiamare informazioni rilevanti dalla memoria.
- **CRUD:** Un benchmark che valuta la capacità del modello di ragionare su più documenti e rispondere a domande complesse.
- **RAGAS, ARES, and TruLens:** Strumenti automatizzati che possono essere utilizzati per valutare i modelli RAG su varie metriche.

Impiegando queste tecniche e strumenti di valutazione, i ricercatori e i professionisti possono ottenere preziose informazioni sui punti di forza e di debolezza dei modelli RAG, portando allo sviluppo di sistemi più robusti ed efficaci.

<span style="font-size:18pt;color:#39e75aff;"><b>Prospetti futuri</b></span>

Nonostante i suoi progressi, la tecnologia RAG affronta diverse sfide che aprono strade entusiasmanti per la ricerca futura.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Challenges:</b></span>
- **Long Context with LLMs:** Mentre gli LLM possono ora gestire contesti più ampi, RAG offre vantaggi in termini di efficienza e interpretabilità. La ricerca futura dovrebbe esplorare l'utilizzo di RAG per compiti complessi anche con lunghi contesti.
- **RAG Robustness:** Le informazioni contraddittorie possono avere un impatto negativo sulla produzione di RAG. Sviluppare strategie per migliorare la robustezza di RAG è fondamentale.
- **Hybrid Approaches:** L'ottimizzazione dell'integrazione di RAG con le tecniche di messa a punto presenta un'area promettente per l'indagine.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Future Research Directions:</b></span>
- **Scaling Laws:** Determinare come le leggi di ridimensionamento si applicano ai RAG rispetto agli LLM è importante per l'ottimizzazione delle dimensioni del modello.
- **Production-Ready RAG:** Migliorare l'efficienza del recupero, il richiamo dei documenti e la sicurezza dei dati sono fondamentali per l'implementazione pratica di RAG.
- **Multi-modal RAG:** L'integrazione dei concetti RAG con varie modalità di dati come immagini, audio, video e codice apre possibilità entusiasmanti. 

	Questo include:

- &nbsp;
	- **Image-Text Integration:** RA-CM3, BLIP-2 e "Visualize Before You Write" mostrano il potenziale di combinare il recupero e la generazione di immagini con il testo.
	- **Audio-Video Integration:** Le tecniche di fusione dell'attenzione basate su GSS, UEOP e KNN dimostrano progressi nell'elaborazione vocale e video multimodale.
	- **Code Integration:** RBPS evidenzia il potenziale dell'utilizzo di RAG per le attività di recupero e generazione del codice.
	- **Structured Knowledge Integration:** CoK mostra l'efficacia dell'integrazione dei grafici di conoscenza con RAG per le attività di risposta alle domande.

<span style="font-family:.AppleSystemUIFontBold;color:#a5332dff;"><b>Overall Trend:</b></span>
La tecnologia RAG si sta evolvendo verso la specializzazione, la personalizzazione e la semplificazione per gli ambienti di produzione. Lo sviluppo dell'ecosistema RAG con strumenti come LangChain, LLamaIndex, Flowise AI, HayStack e Weaviate Verba indica una crescente attenzione alla facilità d'utente e alle applicazioni aziendali. Il RAG multimodale ha un immenso potenziale per integrare diversi tipi di dati per creare sistemi di intelligenza artificiale più completi. Il futuro di RAG sta nello sfruttare i suoi punti di forza insieme ai progressi nello stack tecnologico per costruire soluzioni di intelligenza artificiale potenti e versatili.


#tesi-lm