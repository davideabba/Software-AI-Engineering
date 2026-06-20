# Zero-shot vs Few-shot Prompting

> Sources: Davide Abba, 2025
> Raw: [Zero-shot vs Few-shot](../../raw/AI/Master's Thesis/Notes/Zero-shot vs Few-shot.md)

## Overview

Zero-shot and few-shot are two ends of a spectrum describing how many examples the prompt gives the model before asking it to perform a task. **Zero-shot** gives instructions only; **few-shot** gives instructions plus N worked examples. The choice changes accuracy, prompt length, latency, and cost, and the same vocabulary carries over into RAG variants.

## Zero-shot

The prompt describes the task in natural language; no example outputs are provided. The model relies entirely on its parametric knowledge plus the instruction.

```
Classify the following review as positive or negative.

Review: "The screen broke within a week. Avoid."
Label:
```

Strengths: shortest possible prompt, lowest token cost, no labelled examples needed.
Weaknesses: brittle on tasks where the desired output format is unusual or the instruction is ambiguous.

## Few-shot

The prompt includes N input/output pairs demonstrating the task, then asks for the next output.

```
Review: "Best laptop I've owned in years."
Label: positive

Review: "Battery died on day three."
Label: negative

Review: "The screen broke within a week. Avoid."
Label:
```

Strengths: dramatically better on tasks with unusual output formats, edge cases, or domain-specific vocabulary. The examples implicitly define what the labels mean.
Weaknesses: longer prompts (more tokens, higher cost, slower), and example selection becomes its own problem — bad examples poison the output.

One-shot is the N=1 boundary case.

## How Many Shots

There is no universal answer; the empirical rule is to start with zero-shot, measure failures, and add shots until the failure mode disappears. Diminishing returns kick in quickly — typically 3–8 examples capture most of the available signal.

## Example Selection

For few-shot, the examples must be **representative** of the input distribution. Two common strategies:

- **Static.** Hand-curated examples baked into the prompt template. Simple, predictable.
- **Dynamic (retrieval-augmented).** Use a vector retriever to pick the K examples most similar to the current input from a labelled pool. Better generalization on diverse inputs at the cost of an extra retrieval step.

## RAG Variants

The same shot terminology applies to RAG when the retrieved context is the "example":

- **Zero-shot RAG.** Retrieve context; generate answer. No worked examples in the prompt.
- **Few-shot RAG.** Retrieve context **and** include N example question/answer pairs (often from prior support tickets or curated FAQs) demonstrating the desired answer format.

Few-shot RAG is particularly useful when answers must conform to a specific style — citations, structured fields, tone — that the retrieved corpus alone does not enforce.

## When To Use Which

- Pick **zero-shot** when the task is common, the output format is natural language, and token cost matters.
- Pick **few-shot** when the output format is unusual, the task has many edge cases, or zero-shot quality is unacceptable.
- Pick **dynamic few-shot** when input variance is high enough that no fixed example set covers it.

## See Also

- [RAG Paradigms](../rag/rag-paradigms.md)
- [LangChain Ecosystem](langchain-ecosystem.md)
