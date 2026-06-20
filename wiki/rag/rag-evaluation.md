# RAG Evaluation

> Sources: Davide Abba, 2025
> Raw: [RAG](../../raw/AI/Master's Thesis/Notes/RAG.md)

## Overview

Evaluating a RAG system means evaluating two coupled systems — a retriever and a generator — and then evaluating the joint behaviour under conditions the user actually encounters (noise, missing answers, contradictions). This article covers the metric families, the qualitative aspects to score, and the tooling that automates the loop.

## Two Halves of the Score

### Retrieval Metrics

Measure whether the right chunks were found, independent of what the LLM did with them.

- **Hit Rate.** Fraction of queries where at least one relevant chunk appears in the top-K.
- **Mean Reciprocal Rank (MRR).** Average of `1 / rank_of_first_relevant_chunk`. Rewards putting the right answer near the top.
- **Normalized Discounted Cumulative Gain (NDCG).** Like MRR but accounts for graded relevance and multiple relevant chunks per query.

A retriever can be tuned in isolation against these metrics with a labelled query/chunk dataset.

### Generation Metrics

Measure surface overlap between generated answer and reference answer.

- **BLEU.** N-gram precision. Originally for machine translation, weak for free-form answers.
- **ROUGE (1, 2, L).** N-gram and longest-common-subsequence recall. More forgiving than BLEU for summarization-shaped answers.

Both are blunt: paraphrases score poorly, factual correctness is invisible. Use them as guardrails, not as truth.

## Qualitative Aspects

The interesting questions about a RAG system are not n-gram overlap, they are behavioural. Standard aspects:

| Aspect | Question |
|--------|----------|
| Context Relevance | Are the retrieved chunks actually about the query? |
| Answer Faithfulness | Does the answer only assert things grounded in the retrieved context? |
| Answer Relevance | Does the answer address what was asked? |
| Noise Robustness | Does the system survive irrelevant chunks mixed into the retrieved set? |
| Negative Rejection | Does the system refuse to answer when the corpus has no answer? |
| Counterfactual Robustness | Does the system flag or resist contradictions in retrieved chunks? |

Faithfulness and Negative Rejection are the two that ship-blockers most often catch in production: a system that confidently fabricates answers grounded in no chunk, or that hallucinates an answer when the corpus genuinely doesn't contain one.

## Benchmark Frameworks

Pre-built evaluation corpora and harnesses:

- **RGB (Retrieval-Augmented Generation Benchmark).** Tests noise robustness, negative rejection, integration, and counterfactual robustness on a public QA corpus.
- **RECALL.** Counterfactual robustness benchmark; injects misleading facts to see if the model is fooled.
- **CRUD.** Create / Read / Update / Delete operations against a knowledge base — tests whether RAG systems handle stateful corpora.

## Automated Evaluators

LLM-as-a-judge frameworks that score generated answers automatically:

- **RAGAS.** Scores faithfulness, answer relevance, context precision, and context recall. Most widely adopted.
- **ARES.** Trains lightweight LLM judges on synthetic data to score context relevance, answer faithfulness, and answer relevance.
- **TruLens.** Observability + evaluation. Hooks into the RAG pipeline at runtime to score every response.

## Practical Loop

A workable evaluation cadence:

1. Build a small labelled set (~50–200 queries) with reference answers and known relevant chunks.
2. Run retrieval metrics (Hit Rate, MRR) after every retrieval change.
3. Run RAGAS or ARES after every generation change.
4. Spot-check the qualitative aspects manually on a rotating sample.
5. Add adversarial queries (counterfactual, unanswerable) and watch the Negative Rejection rate; this is where most systems silently degrade.

## See Also

- [RAG Paradigms](rag-paradigms.md)
- [RAG Retrieval Optimization](rag-retrieval-optimization.md)
- [Two-Level RAG Customer Support Assistant](two-level-rag-assistant.md)
