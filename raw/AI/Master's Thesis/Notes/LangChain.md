[**Introduction | 🦜️🔗 LangChain**](https://python.langchain.com/docs/introduction/)
 


LangChain è una libreria progettata per semplificare l’uso e l’integrazione dei modelli di linguaggio, è particolarmente utile per lavorare con LLMs e per creare pipeline di Retrieval-Augmented Generation.

<span style="color:#b32625ff;"><b>Collegamento ai dati esterni:</b></span> 
LangChain può essere configurato per connettersi a varie fonti di dati (database, API, file locali) e utilizzare questi dati per migliorare le risposte del modello.

<span style="color:#b32625ff;"><b>Pipeline di retrieval:</b></span>
Consente di definire un flusso in cui, per esempio, l’LLM può interrogare una base di conoscenza, selezionare i documenti più rilevanti, e poi usarli per generare risposte in modo contestuale.

<span style="color:#b32625ff;"><b>Memoria e stato della conversazione:</b></span> 
Permette di mantenere uno stato di conversazione, quindi l’assistente può ricordare il contesto in una sessione, migliorando l’interazione con i tecnici.

<span style="color:#b32625ff;"><b>Facilità di integrazione:</b></span> 
Puoi facilmente combinare LangChain con strumenti di indicizzazione dei dati come Elasticsearch o Pinecone per implementare RAG, nonché con piattaforme cloud come AWS per l’hosting del tuo assistente.

LangChain ti permette di implementare RAG senza dover creare manualmente un’infrastruttura di retrieval. Grazie alla sua flessibilità, puoi anche aggiungere componenti come memoria a lungo termine, workflow personalizzati e gestione di feedback.

## <span style="font-size:18pt;color:#4fffe7ff;"><b>LangSmith</b></span>

LangSmith è uno strumento di sviluppo integrato che ti aiuta a progettare, monitorare, e ottimizzare i flussi di lavoro dei modelli linguistici.

### <span style="font-size:16pt;color:#4fffe7ff;"><b>Funzionalità</b></span>

	•	<span style="color:#b32625ff;">Debugging e ottimizzazione delle catene:</span> LangSmith consente di eseguire il debug delle catene LangChain, ovvero sequenze di chiamate o istruzioni che coinvolgono modelli di linguaggio e altre componenti. Questa funzione ti permette di verificare come i diversi passaggi del flusso interagiscono tra loro, identificando e risolvendo eventuali problemi di prestazioni o precisione.

	•	<span style="color:#b32625ff;">Visualizzazione e monitoraggio:</span> Grazie a LangSmith, puoi visualizzare come i dati attraversano le diverse fasi di un workflow e verificare se ogni passaggio funziona come previsto. È particolarmente utile quando lavori su pipeline complesse o su flussi che coinvolgono interazioni multiple con il modello.

	•	<span style="color:#b32625ff;">A/B Testing:</span> LangSmith facilita l’esecuzione di test comparativi (A/B testing) tra diverse configurazioni di modelli o componenti di una pipeline, consentendoti di confrontare le performance e ottimizzare la configurazione del flusso di lavoro.

### <span style="font-size:16pt;color:#4fffe7ff;"><b>Vantaggi</b></span>

LangSmith è particolarmente utile per gli sviluppatori di applicazioni AI che desiderano ottimizzare e perfezionare continuamente i loro flussi di lavoro, testando nuove versioni dei modelli o modificando parametri.
Il suo monitoraggio facilita la manutenzione delle applicazioni, rendendolo uno strumento ideale in contesti di produzione.

## <span style="font-size:18pt;"><b>LangGraph</b></span>

LangGraph consente di creare workflow complessi per orchestrare componenti come modelli di linguaggio, sorgenti di dati, e funzionalità di recupero in una struttura di grafo.

### <span style="font-size:16pt;color:#4fffe7ff;"><b>Funzionalità</b></span>

	•	<span style="color:#b32625ff;">Struttura a grafo per le pipeline:</span> LangGraph consente di strutturare flussi di lavoro in modo non lineare. Invece di definire una semplice sequenza di passaggi, puoi collegare tra loro più componenti e strutturarli in modo che il workflow si adatti dinamicamente ai risultati o alle condizioni.

	•	<span style="color:#b32625ff;">Interazione dinamica tra modelli e dati:</span> È possibile combinare vari modelli di linguaggio e fonti di dati, definendo percorsi multipli che il sistema può scegliere a seconda delle esigenze o dei risultati parziali.

	•	<span style="color:#b32625ff;">Automazione e branching logico:</span> LangGraph supporta la logica condizionale, cioè permette di configurare il grafo in modo che diverse azioni vengano intraprese in base a risposte o input ricevuti. Ad esempio, puoi impostare percorsi diversi per l’analisi dei dati e per il recupero delle risposte a seconda del tipo di richiesta ricevuta.

### <span style="font-size:16pt;color:#4fffe7ff;"><b>Vantaggi</b></span>

LangGraph è ideale per flussi di lavoro complessi o per applicazioni AI che richiedono percorsi decisionali sofisticati, migliorando l’efficienza e la capacità di adattamento del sistema.
In applicazioni di assistenza al cliente come il tuo progetto, LangGraph permette di personalizzare la risposta dell’assistente AI in base a specifici casi d’uso o contesti operativi.

## <span style="font-size:18pt;"><b>Altri strumenti e funzionalità avanzate di LangChain</b></span>

### <span style="font-size:16pt;color:#4fffe7ff;"><b>Pipeline di Retrieval e Memoria</b></span>

LangChain offre strumenti per implementare funzionalità di memoria, che consentono ai modelli di <span style="color:#b32625ff;">ricordare informazioni o contesti di conversazione tra diverse interazioni</span>. Esistono varie opzioni di memoria (a breve termine, a lungo termine, e basata su modelli di retrieval) che possono essere configurate a seconda del tipo di interazione che desideri mantenere.

Consente di <span style="color:#b32625ff;">combinare LLM con meccanismi di retrieval come RAG</span>, configurando query automatiche verso database o motori di ricerca. Questo è utile per recuperare informazioni aggiornate o dati specifici da archivi aziendali.

### <span style="font-size:16pt;color:#4fffe7ff;"><b>Collegamenti e Connettori</b></span>

	•	<span style="color:#b32625ff;">API esterne:</span> LangChain può integrarsi facilmente con API esterne, permettendoti di connettere il modello ad applicazioni come Outlook, Odoo, o piattaforme cloud per accedere ai dati aziendali.

	•	<span style="color:#b32625ff;">Componenti custom e tool custom:</span> Oltre agli strumenti standard, puoi creare componenti personalizzati o tool che si integrano nella tua catena di LangChain, ad esempio per collegarti a un database specifico o per fare operazioni avanzate di elaborazione dati.

### <span style="font-size:16pt;color:#4fffe7ff;"><b>Toolkits e Agenti</b></span>

LangChain mette a disposizione <span style="color:#b32625ff;">pacchetti preconfigurati per attività comuni,</span> come l’analisi testuale, il riassunto o la classificazione. Ciò velocizza la costruzione di pipeline focalizzate su compiti specifici.

Gli <span style="color:#b32625ff;">agenti</span> sono componenti in LangChain che, basandosi su LLM, possono <span style="color:#b32625ff;">prendere decisioni autonome all’interno di una catena</span>, eseguendo azioni condizionali o completando compiti specifici in base al contesto.

<span style="font-family:.AppleSystemUIFontBold;font-size:18pt;"><b>Metodi di sottomissione delle domande al modello</b></span>

<span style="font-family:.AppleSystemUIFontBold;font-size:16pt;color:#86fbe7ff;"><b>Metodo invoke</b></span>

Elabora un singolo input (ad esempio, una domanda o un prompt) e restituisce l'output.

Casi d'uso:
• Quando hai una singola query o prompt.
• Quando hai bisogno di una risposta semplice e diretta senza parallelismo o streaming.


```
response = llm.invoke("What is AI?")
```

<span style="font-family:.AppleSystemUIFontBold;font-size:16pt;color:#86fbe7ff;"><b>Metodo batch</b></span>

Elabora più input contemporaneamente in un batch e restituisce un elenco di output.

Casi d'uso:
• Quando hai più input indipendenti (ad esempio, un elenco di domande) e vuoi elaborarli insieme per efficienza.
• Quando il batching è supportato dal backend del modello per un'inferenza ottimizzata.


```
responses = llm.batch(["What is AI?", "What is machine learning?", "What are neural networks?"])
```

<span style="font-family:.AppleSystemUIFontBold;font-size:16pt;color:#86fbe7ff;"><b>Metodo stream</b></span>

Trasmette l'output token per token man mano che viene generato.

Casi d'uso:
• Quando vuoi visualizzare le risposte in tempo reale, ad esempio per l'intelligenza artificiale conversazionale o gli aggiornamenti in tempo reale.
• Quando la latenza è critica e devi iniziare a visualizzare l'output non appena vengono generati i token.


```
response = llm.stream("What is AI?")
```

<span style="font-family:.AppleSystemUIFontBold;font-size:16pt;color:#86fbe7ff;"><b>Metodi asincroni</b></span>

LangChain fornisce versioni asincrone dei suoi metodi (ainvoke, abatch, astream) per l'uso in flussi di lavoro asincroni.

Casi d'uso:
• Quando è necessario gestire più query contemporaneamente (ad esempio, interrogando più modelli contemporaneamente).
• Quando si integra in un'applicazione asincrona o in un server API (ad esempio, utilizzando FastAPI o asyncio).

#tesi-lm