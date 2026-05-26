---
title: Obfuscation via Segmentation
date: 2026-05-26
tag: note
---

## Segmentation

A program that divides its executable code into segments and randomizes the links
between them using `jmp` instructions.

The jumps bounce across segments in a random order until hitting the chosen
segment. The chosen segment then jumps deterministically to the second
instruction of other segments, chaining across them to find the first segment
to execute. That segment executes and jumps to the third instruction (or
whichever) of the next, and so on.

Let's say `seg_6` is the chosen segment:

```
random chain:
seg_1 --> seg_7 --> seg_4 --> seg_5 --> seg_3 --> seg_6

deterministic chain:
seg_6 --> seg_5 --> seg_3 --> seg_1

actual execution:
seg_1 --> seg_2 --> seg_3 ... --> seg_7
```

The paths are decided by the injector, pairing it with techniques like packing and
environment keying can make it truly useful.

working on PoC.
