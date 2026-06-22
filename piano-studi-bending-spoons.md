# Piano di Studi — Graduate Software Engineer & Graduate AI Software Engineer
### Preparazione al processo di selezione di Bending Spoons

---

## Come usare questo piano

- **Durata consigliata:** 8–10 settimane, ~15-20 ore a settimana (adattabile in base al tempo disponibile).
- **Struttura:** 7 moduli. I moduli 1-3 e 6-7 servono per **entrambi i ruoli**. I moduli 4-5 sono specifici per **Graduate AI Software Engineer** (se ti candidi solo al ruolo "puro" SWE puoi alleggerirli, ma vale la pena conoscerli comunque: spesso fanno domande trasversali).
- **Metodo:** per ogni modulo trovi obiettivi → risorse per studiare → esercizi pratici consigliati. Procedi in parallelo (es. 1 ora al giorno di coding + 1 ora a settimana di system design), non in sequenza rigida.
- **Traccia i progressi:** tieni un file/foglio con: data, esercizio fatto, tempo impiegato, errori commessi. Ti aiuterà a capire dove insistere.

---

## Timeline suggerita (8 settimane)

| Settimana | Focus principale |
|---|---|
| 1-2 | Strutture dati base + ripasso logica/IQ |
| 3-4 | Algoritmi (DP, grafi, ricorsione) + primi esercizi system design |
| 5 | System design intensivo + (se AI) ML fundamentals |
| 6 | ML/DL approfondito (se ruolo AI) + altri esercizi coding |
| 7 | Comportamentale + mock interview |
| 8 | Simulazioni complete, ripasso punti debol, riposo pre-colloquio |

---

## MODULO 1 — Algoritmi e Strutture Dati (Coding)

### Obiettivi
Essere fluido su problemi stile coding interview (livello easy/medium, qualche hard), saper analizzare complessità, saper discutere il proprio codice ad alta voce.

### Argomenti da ripassare
- Array, stringhe, hashmap/set
- Liste collegate, stack, queue
- Alberi (binari, BST), grafi (BFS/DFS, Dijkstra, Union-Find)
- Ricorsione e backtracking
- Programmazione dinamica (1D e 2D)
- Sliding window, two pointers, binary search
- Complessità temporale/spaziale (Big-O)

### Risorse
| Risorsa | Tipo | Note |
|---|---|---|
| [LeetCode](https://leetcode.com) | Esercizi | Usa la lista "Top Interview Questions" o "Blind 75/NeetCode 150" |
| [NeetCode.io](https://neetcode.io) | Corso + esercizi | Roadmap gratuita molto ben organizzata, con video-spiegazioni per ogni problema |
| [HackerRank](https://www.hackerrank.com) | Esercizi | Buono anche per simulare test a tempo |
| [Codewars](https://www.codewars.com) | Esercizi | Ottimo per allenarsi su problemi più "puzzle-like", simili allo stile logico di BS |
| *Cracking the Coding Interview* (G. L. McDowell) | Libro | Riferimento classico, ottimo per teoria + esercizi |
| [AlgoExpert](https://www.algoexpert.io) | Corso (a pagamento) | Se vuoi un percorso guidato con video-spiegazioni |

### Esercizi consigliati (ordine progressivo)
1. Two Sum, Valid Anagram, Group Anagrams (hashmap)
2. Reverse Linked List, Linked List Cycle
3. Valid Parentheses, Min Stack
4. Binary Tree traversal (in/pre/post-order), Maximum Depth, Validate BST
5. Number of Islands, Clone Graph (BFS/DFS)
6. Climbing Stairs, Coin Change, Longest Common Subsequence (DP)
7. Sliding Window Maximum, Longest Substring Without Repeating Characters

**Consiglio pratico:** fai i problemi a tempo (20-30 min ciascuno) e **parla ad alta voce** mentre risolvi, come se fossi in call — è la parte che spaventa di più ma è puro allenamento.

---

## MODULO 2 — Logica, Quiz IQ e Test Attitudinali

### Obiettivi
Bending Spoons usa test di ragionamento logico/quantitativo/astratto simili a test psicometrici aziendali (stile quelli usati anche da consulting e big tech). Non richiedono nozioni tecniche, ma **velocità e allenamento al pattern**.

### Argomenti
- Ragionamento numerico (sequenze, proporzioni, percentuali, interpretazione dati/grafici)
- Ragionamento logico-deduttivo (sillogismi, problemi a vincoli)
- Ragionamento astratto/non verbale (sequenze di figure, matrici tipo Raven)
- Problemi di "business reasoning" / stima (tipo Fermi estimation: "quante persone usano X app in Italia?")

### Risorse
| Risorsa | Tipo | Note |
|---|---|---|
| [JobTestPrep](https://www.jobtestprep.com) | Test pratica | Ha sezioni dedicate a test cognitivi/attitudinali stile aziendale |
| [AssessmentDay](https://www.assessmentday.com) | Test pratica | Test numerici/logici gratuiti e a pagamento |
| [123test](https://www.123test.com) | Test pratica | Test IQ e ragionamento gratuiti, buoni per allenare la velocità |
| [PrepInsta](https://prepinsta.com) | Test pratica | Ampia raccolta di test attitudinali e aptitude |
| Raven's Progressive Matrices (cerca esempi online) | Pratica | Per il ragionamento non verbale/figurale |
| *Case in Point* (M. Cosentino) | Libro | Ottimo per allenare il "business reasoning" e le stime alla Fermi |

### Esercizi consigliati
- 15-20 minuti al giorno di test numerici/logici a tempo (la velocità conta tanto quanto l'accuratezza)
- 2-3 problemi di stima alla Fermi a settimana (es: "Quante chiamate Zoom avvengono al mondo ogni giorno?")
- Simula condizioni reali: stesso timer che useresti nel test vero, niente calcolatrice se non specificato

---

## MODULO 3 — System Design

### Obiettivi
Essere in grado di progettare ad alto livello un sistema scalabile, discutendo trade-off in modo chiaro. Per un graduate non ci si aspetta espertise da senior, ma **ragionamento strutturato e consapevolezza dei concetti base**.

### Argomenti
- Client-server, load balancer, caching (Redis/CDN)
- Database: SQL vs NoSQL, indexing, sharding, replication
- API design: REST vs gRPC
- Code asincrone, message queue (Kafka/RabbitMQ concettualmente)
- Monolite vs microservizi, containerizzazione (Docker/Kubernetes a livello concettuale)
- Scalabilità: come gestire milioni di utenti (rilevante perché è proprio il contesto BS)
- CAP theorem, consistency vs availability

### Risorse
| Risorsa | Tipo | Note |
|---|---|---|
| [System Design Primer (GitHub)](https://github.com/donnemartin/system-design-primer) | Guida gratuita | La risorsa di riferimento gratuita più usata al mondo per questo argomento |
| [Grokking the System Design Interview (Educative)](https://www.educative.io/courses/grokking-the-system-design-interview) | Corso (a pagamento) | Molto strutturato, con esempi risolti passo-passo |
| [ByteByteGo (Alex Xu)](https://bytebytego.com) | Blog/Newsletter | Diagrammi chiarissimi su temi di system design, ottimo anche gratis |
| *Designing Data-Intensive Applications* (M. Kleppmann) | Libro | Il riferimento più completo e rigoroso, utile anche oltre il colloquio |
| [High Scalability](http://highscalability.com) | Blog | Case study reali di architetture (utile per esempi concreti) |

### Esercizi consigliati
Pratica progettando ad alto livello (su carta o lavagna, 30-45 min ciascuno):
1. Progetta un URL shortener (tipo bit.ly)
2. Progetta un sistema di notifiche push per un'app con milioni di utenti
3. Progetta un servizio di file transfer simile a **WeTransfer** (uno dei loro prodotti — ottimo per mostrare interesse genuino!)
4. Progetta un sistema di rate limiting per un'API
5. Progetta il backend di un'app di photo-enhancement come **Remini** (upload immagine → coda di processing → notifica risultato)
6. Progetta un sistema di feed/notizie con milioni di letture al secondo

**Consiglio pratico:** in ogni esercizio segui sempre questo schema: 1) chiarisci i requisiti (funzionali/non funzionali), 2) stima il carico (utenti, QPS, storage), 3) disegna l'architettura ad alto livello, 4) approfondisci 1-2 componenti critici, 5) discuti i trade-off.

---

## MODULO 4 — Machine Learning Fundamentals (per ruolo AI)

### Obiettivi
Solidità sui concetti base di ML: quando e perché si usa un modello, come si valuta, errori comuni.

### Argomenti
- Supervised vs unsupervised learning
- Regressione lineare/logistica, alberi decisionali, random forest, SVM (concettualmente)
- Overfitting/underfitting, bias-variance trade-off, regolarizzazione (L1/L2)
- Metriche: accuracy, precision/recall, F1, AUC-ROC, MSE/RMSE
- Cross-validation, train/val/test split
- Feature engineering e preprocessing

### Risorse
| Risorsa | Tipo | Note |
|---|---|---|
| [Machine Learning Specialization (Andrew Ng, Coursera/DeepLearning.AI)](https://www.coursera.org/specializations/machine-learning-introduction) | Corso | Il punto di partenza più riconosciuto per i fondamenti |
| [StatQuest (YouTube)](https://www.youtube.com/c/joshstarmer) | Video | Spiegazioni semplici e molto efficaci sui concetti statistici/ML |
| [Kaggle Learn](https://www.kaggle.com/learn) | Corso pratico | Micro-corsi gratuiti con esercizi su dataset reali |
| *Hands-On Machine Learning* (A. Géron) | Libro | Teoria + codice pratico (scikit-learn/TensorFlow) |

### Esercizi consigliati
- Completa almeno 1 competizione "starter" su Kaggle (es. Titanic, House Prices) implementando da zero pipeline di preprocessing + 2-3 modelli diversi + confronto metriche
- Implementa una regressione logistica e un decision tree "from scratch" (senza libreria) per capire davvero cosa succede sotto il cofano

---

## MODULO 5 — Deep Learning, e MLOps (per ruolo AI)

### Obiettivi
Capire le basi delle reti neurali e avere consapevolezza di cosa significhi portare un modello in produzione a scala (molto rilevante per BS, che ha centinaia di milioni di utenti).

### Argomenti
- Reti neurali feedforward, backpropagation, funzioni di attivazione
- CNN (per task su immagini — pensa a Remini)
- Concetti base di Transformer/attention (anche solo a livello concettuale)
- Inferenza a scala: latenza, costi, quantizzazione/distillazione dei modelli
- Versionamento modelli, monitoraggio drift, A/B testing di modelli in produzione

### Risorse
| Risorsa | Tipo | Note |
|---|---|---|
| [3Blue1Brown — Neural Networks (YouTube)](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi) | Video | La migliore introduzione visiva/intuitiva alle reti neurali |
| [PyTorch Tutorials](https://pytorch.org/tutorials/) | Documentazione/corso | Per la parte pratica di implementazione |
| [Fast.ai — Practical Deep Learning](https://course.fast.ai) | Corso gratuito | Approccio molto pratico, "top-down" |
| [Distill.pub](https://distill.pub) | Articoli | Spiegazioni visive avanzate (utile se vuoi andare più a fondo) |
| [Designing Machine Learning Systems (C. Huyen)](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/) | Libro | Riferimento ottimo per la parte MLOps/produzione |

### Esercizi consigliati
- Allena una piccola CNN su MNIST o CIFAR-10 con PyTorch, da zero
- Prova a fare fine-tuning di un modello pre-addestrato (es. ResNet) su un piccolo dataset di immagini a tua scelta
- Rifletti/scrivi 1 paragrafo su: "come servirei un modello di image enhancement a 10 milioni di richieste al giorno mantenendo bassa latenza?" — è il tipo di domanda ibrida ML + system design che potrebbero farti

---

## MODULO 6 — Comportamentale e Cultural Fit

### Obiettivi
Bending Spoons valuta molto "reasoning ability" e allineamento culturale (ambiente esigente, alta ownership, voglia di "semplificare").

### Come prepararsi
- Usa il metodo **STAR** (Situation, Task, Action, Result) per strutturare 4-5 esempi concreti dalla tua esperienza (progetti universitari, lavori, hackathon, tesi)
- Prepara risposte a:
  - "Raccontami di un problema complesso che hai risolto e come"
  - "Raccontami di un fallimento e cosa hai imparato"
  - "Perché Bending Spoons? Cosa ti attira del loro modello (acquisire e rilanciare prodotti)?"
  - "Come gestisci ambienti ad alta pressione/ambizione?"
- Studia il loro sito [bendingspoons.com](https://bendingspoons.com) e le pagine "careers"/"jobs" per capire i valori che citano esplicitamente (ownership, semplicità, reasoning)

### Risorsa utile
- [Glassdoor — recensioni interviste Bending Spoons](https://www.glassdoor.com/Interview/Bending-Spoons-Interview-Questions-E1164562.htm): leggi le recensioni recenti per "Graduate Software Engineer" e "First Ascent Candidate" per farti un'idea delle domande reali.

---

## MODULO 7 — Simulazioni finali e Mock Interview

### Obiettivi
Le ultime 1-2 settimane vanno dedicate a simulare condizioni reali, non più a studiare nuova teoria.

### Risorse per mock interview
| Risorsa | Tipo | Note |
|---|---|---|
| [Pramp](https://www.pramp.com) | Mock interview gratuite | Ti accoppia con altri candidati per simulare colloqui tecnici a turno |
| [interviewing.io](https://interviewing.io) | Mock interview | Anche con interviewer anonimi esperti (alcune gratuite) |
| Amici/colleghi di corso | Mock interview | Anche solo simulare a voce alta un problema di coding/system design con un'altra persona è molto efficace |

### Checklist finale pre-colloquio
- [ ] Ho risolto almeno 50-80 problemi di coding (mix easy/medium)
- [ ] Ho fatto almeno 5-6 esercizi completi di system design parlando ad alta voce
- [ ] Ho fatto test di logica/IQ a tempo regolarmente, non solo all'inizio
- [ ] (Se ruolo AI) Ho almeno un progetto ML/DL implementato da zero che posso raccontare in dettaglio
- [ ] Ho 4-5 storie STAR pronte per il comportamentale
- [ ] Ho letto le recensioni Glassdoor più recenti sul ruolo specifico
- [ ] Ho dormito bene la notte prima del colloquio (sì, conta davvero)

---

## Risorse aggiuntive specifiche Bending Spoons

- [jobs.bendingspoons.com](https://jobs.bendingspoons.com) — pagina ufficiale posizioni e descrizione del processo di selezione
- [Glassdoor interviste Bending Spoons](https://www.glassdoor.com/Interview/Bending-Spoons-Interview-Questions-E1164562.htm) — domande reali riportate dai candidati
- Pagina/iniziativa **First Ascent** (firstascent.io) — il loro programma di selezione per giovani talenti, utile per farsi un'idea del tipo di test che usano anche nel processo graduate standard

---

*Buono studio! Il loro processo è impegnativo ma molto trasparente su cosa aspettarsi — il vantaggio è che, sapendolo, puoi prepararti in modo mirato invece di studiare "alla cieca".*
