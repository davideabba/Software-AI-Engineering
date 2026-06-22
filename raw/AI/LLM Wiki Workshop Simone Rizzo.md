Un LLM non ricorda, ogni interazione parte da un foglio bianco.

La memoria del LLM vive in 3 posti:
1. **Nei pesi:** la conoscenza viene incorporata nel modello tramite training o fine-tuning. è una pratica dal costo elevato, che offre una conoscenza statica nel modello, senza citazioni, con latenza minima.
2. **Nel contesto:** Tutto il sapere viene incollato nel prompt, ad ogni chiamata. Testo iniettato come token. è trasparente, ha una finestra limitata e ha un costo proporzionale al numero di token. è la cosiddetta memoria a breve termine.
3. **Memoria esterna:** database, file su disco, che vengono letti dall'AI (richiamati quando serve).

## Come si crea la memoria esterna

Tre generazioni:
1. RAG. Ricerche semantiche per concetto.
2. Agentic File Search. Un agente naviga i file come un umano. Esplora, ragiona e segue riferimenti.
3. LLM Wiki. Conoscenza compilata come un artefatto persistente che cresce nel tempo.

I dati vanno puliti e trasformati in markdown.

In caso di PDF, si usano dei modelli OCR, opzioni:
- DeepSeek OCR
- Dots.ocr
- GLM OCR

Con Codex: posso creare il convertitore PDF a MArkdown con Ollama.

unsloth quantizzano. Lm studio. GPU offload al massimo. Lo carichi sul server e lo usi in open code.

Il contro è che quando si hanno molti documenti (tipo 1000), diventa molto costoso.

La LLM Wiki crea una conoscenza compilata e manutenuta dall'AI.
Funziona bene con 400 documenti, altrimenti meglio il RAG.

La LLM wiki va fatta da un agente solo, non paralleli.

Consideriamo il caso di un app RAG AI sulla documentazione eterogenea di un software: manuali, ticket di supporto, forum, ecc. L'app è stata fatta con FastAPI, Azure OpenAI e pgvector per il db vettoriale.

Ho creato la LLM Wiki usando Github Copilot su tutti quei documenti, e il risultato supera di molto quello che il mio assistente è capace di fare, specialmente nei ragionamenti e collegamenti tra argomenti, e le negazioni o comparazioni.

Dal punto di vista dello sviluppo codice in Python, come avverrebbe la migrazione dal RAG al LLM Wiki? Richiede la creazione delle facoltà agentiche che OpenCode o Claude Code hanno intrinsecamente (tool per l'injestion, per il lint, per leggere i file, ecc.)? 
Come cambierebbero i costi di utilizzo? 
LLM Wiki sotto al cofano sfrutta l'agentic file search?
Voglio vendere ai miei clienti questa versione potenziata a cui al momento ho accesso solo io tramite GitHub Copilot.
