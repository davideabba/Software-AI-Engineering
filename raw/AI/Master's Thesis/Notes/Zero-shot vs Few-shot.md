Nel contesto dei Large Language Models (LLM) e delle tecniche di Retrieval-Augmented Generation (RAG), i termini zero-shot e few-shot si riferiscono a due approcci diversi per guidare il modello a generare risposte accurate, anche su argomenti per i quali non è stato specificamente addestrato. Questi approcci si basano sul concetto di prompting, ovvero l’abilità di ottenere risposte dal modello fornendo istruzioni chiare e contestuali.

<span style="color:#b32625ff;"><b>1. Zero-shot Learning</b></span>

Zero-shot significa che il modello è in grado di rispondere a domande o risolvere compiti senza aver mai visto esempi specifici di quel compito durante il suo addestramento. In pratica, il modello deve fare affidamento esclusivamente sulla sua comprensione generale del linguaggio e delle conoscenze acquisite durante l’addestramento.

Si fornisce al modello una domanda o un prompt direttamente, senza fornire esempi specifici su come dovrebbe rispondere.

Esempio:

Prompt: Qual è la capitale della Francia?
Il modello risponde: Parigi

Vantaggi:
	•	Flessibilità e rapidità nel rispondere a un’ampia gamma di domande senza 		bisogno di addestramento aggiuntivo.
	•	Utile per esplorare la capacità generale del modello su vari task.

Svantaggi:
	•	Può generare risposte meno accurate, specialmente per domande 					complesse o domini molto specifici.

<span style="color:#b32625ff;"><b>2. Few-shot Learning</b></span>

Few-shot significa che il modello è in grado di apprendere o risolvere un compito fornendo alcuni esempi (solitamente tra 1 e 10) all’interno del prompt. In questo modo, il modello utilizza gli esempi forniti come contesto per capire meglio cosa si aspetta l’utente.

Si fornisce una serie di esempi (input-output) nel prompt, seguiti da una nuova richiesta per cui si desidera una risposta.

Esempio:

Prompt: 
Q: Qual è la capitale della Germania? 
A: Berlino
Q: Qual è la capitale del Giappone? 
A: Tokyo
Q: Qual è la capitale dell'Italia?

Il modello risponde: 
A: Roma

Vantaggi:
	•	Migliora l’accuratezza delle risposte, specialmente per domande specifiche 		o task complessi.
	•	Aiuta il modello a capire meglio il contesto e il formato della risposta 				desiderata.

Svantaggi:
	•	Richiede prompt più lunghi e più complessi.
	•	Il numero di esempi forniti è limitato dalla lunghezza massima del prompt 			(token limit).

## <span style="color:#4fffe7ff;"><b>Zero-shot e Few-shot nell’ambito RAG</b></span>

Nelle tecniche di Retrieval-Augmented Generation (RAG), l’obiettivo è combinare la potenza di un LLM con un sistema di recupero informazioni (retrieval) da una base di conoscenze esterna, come documenti, database, o articoli web. 

<span style="color:#b32625ff;"><b>Zero-shot RAG:</b></span>
	•	Il modello utilizza il retrieval per cercare informazioni rilevanti da una base 			di dati esterna senza esempi specifici. Una volta recuperati i documenti più 		pertinenti, li utilizza per generare una risposta.
	•	Scenario: Fare domande su argomenti per cui il modello non è stato 					specificamente addestrato, affidandosi ai documenti recuperati per 					migliorare la precisione.

<span style="color:#b32625ff;"><b>Few-shot RAG:</b></span>
	•	Si forniscono alcuni esempi nel prompt per mostrare al modello come 				utilizzare le informazioni recuperate in modo efficace. Questo approccio è 			particolarmente utile per compiti che richiedono una certa struttura o 				formato di risposta.
	•	Scenario: Mostrare al modello esempi di domande e risposte basate sui 			documenti recuperati, in modo che possa replicare quel formato per nuove 		domande.

**Esempio di Zero-shot vs Few-shot RAG**

	•	Zero-shot RAG:

Prompt: Usando le informazioni disponibili, rispondi alla domanda:
"Qual è la popolazione attuale di Berlino?"


	•	Few-shot RAG:

Prompt:
Documenti recuperati: [Informazioni su Berlino 1], [Informazioni su Berlino 2]
Esempio 1:
Q: Qual è la popolazione attuale di Tokyo?
A: Secondo i documenti, la popolazione di Tokyo è di circa 14 milioni di persone.

Esempio 2:
Q: Qual è l'altezza del Monte Fuji?
A: Secondo i documenti, il Monte Fuji è alto 3.776 metri.

Nuova domanda:
Q: Qual è la popolazione attuale di Berlino?

#tesi-lm