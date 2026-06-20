# LLM Quantization Schemes

> Sources: Davide Abba, 2025
> Raw: [Quantizzazione](../../raw/AI/Master's Thesis/Notes/Quantizzazione.md)

## Overview

Quantization reduces the precision of an LLM's weights from FP16/FP32 down to integers (typically 4–8 bits), shrinking memory footprint and accelerating inference at a small cost to output quality. In the llama.cpp / GGUF ecosystem, quantized models are named with codes like `Q4_K_M`, `Q5_K_S`, `Q8_0`. The suffix encodes **how** the quantization was done. This article decodes the scheme so you can read a model name and know what trade-off you are getting.

## The Code Anatomy

A typical name: `Q4_K_M`.

- `Q4` — bits per weight. Lower = smaller and faster, more quality loss.
- `K` — block-wise k-means quantization (the modern default).
- `M` — mixed precision: some sensitive layers kept at higher precision.

The letters after the bit count come from a small alphabet:

| Letter | Meaning |
|--------|---------|
| K | K-means block quantization |
| M | Mixed precision (sensitive layers higher) |
| L | Layer-wise (different layers, different bits) |
| S | Symmetric (signed, balanced around zero) |
| 0, 1 | Legacy schemes pre-K-means |

So `Q4_K_M` reads as: 4-bit weights, k-means blocks, mixed precision on sensitive layers.

## Bit-Count Choices

- **Q2.** Extreme compression. Usable for chat but quality drops noticeably.
- **Q3.** Aggressive. Smaller models suffer; larger models hold up.
- **Q4.** The current sweet spot. `Q4_K_M` is the de facto default for local inference.
- **Q5.** Slightly larger, slightly better. Good for quality-sensitive use cases.
- **Q6 / Q8.** Near-lossless vs FP16. Useful when memory is plentiful but you want a final speedup.

## Mixed Precision (M vs S)

Not all layers are equally sensitive to precision loss. Mixed precision keeps the attention/output layers at higher bits while shrinking the bulk of the FFN weights. The `M` variant typically gives noticeably better quality than `S` at the same nominal bit count.

`Q4_K_S` is smaller than `Q4_K_M` and slightly faster; `Q4_K_M` is the safer default unless RAM is the binding constraint.

## K-Means Block Quantization

The `K` family quantizes weights in small blocks (typically 32 weights). For each block:

1. Cluster the weight values with k-means.
2. Store the cluster centroids plus a per-weight index into the cluster table.

This captures local distributional structure within each block instead of forcing a single global scale, which is why `K`-quantized models outperform older `Q4_0` / `Q4_1` formats at the same bit count.

## Practical Choices

Recommendations distilled from the thesis project:

- **Default.** `Q4_K_M`. Best balance for 7B–13B local models on consumer hardware.
- **Memory-tight.** `Q4_K_S` or `Q3_K_M` for 4-bit deployments on small GPUs.
- **Quality-tight.** `Q5_K_M` if you have the VRAM; `Q6_K` or `Q8_0` if you want near-lossless.
- **Tiny models.** Stay at `Q5` or higher; small models tolerate quantization worse than large ones.

## Trade-off Summary

| Variant | Size vs FP16 | Speed | Quality |
|---------|--------------|-------|---------|
| Q2_K | ~1/8 | Fastest | Visible degradation |
| Q3_K_M | ~3/16 | Very fast | Acceptable on large models |
| Q4_K_M | ~1/4 | Fast | Near-FP16 on most tasks |
| Q5_K_M | ~5/16 | Fast | Very close to FP16 |
| Q6_K | ~3/8 | Moderate | Effectively lossless |
| Q8_0 | ~1/2 | Moderate | Lossless |

## See Also

- [Two-Level RAG Customer Support Assistant](../rag/two-level-rag-assistant.md)
- [Simple AI Deployment Patterns](../mlops/simple-ai-deployment.md)
