---
title: Iodine defect migration near the CsPbI₃ surface
summary: How do the hopping barriers of iodine vacancies and interstitials change with depth below the surface? Slab models and nudged elastic band calculations, with a machine-learned potential planned for larger cells.
question: How do the hopping barriers of iodine vacancies and interstitials change with depth below the surface?
status: Ongoing
tags: [DFT, NEB]
order: 1
featured: true
figureLabel: "[FIGURE: slab model with migration path]"
facts:
  - { label: Status, value: Ongoing }
  - { label: Started, value: "[MONTH YEAR]" }
  - { label: Material, value: CsPbI₃ }
  - { label: Methods, value: "DFT, slab models, nudged elastic band" }
  - { label: Code, value: "[DFT CODE AND VERSION]" }
links: []
---

## The question

Iodine vacancies and interstitials are mobile defects in halide perovskites. Their barriers are usually computed in the bulk, but in a real film many of them sit close to a surface. This project asks how the hopping barrier changes, layer by layer, as the defect approaches the CsPbI₃ surface.

[ONE OR TWO SENTENCES ON WHY THIS MATTERS FOR DEVICES, IN YOUR WORDS]

## Method

1. Build a CsPbI₃ slab: [SURFACE ORIENTATION AND TERMINATION], [NUMBER OF LAYERS], [VACUUM THICKNESS].
2. Place an iodine vacancy or interstitial at each depth below the surface and relax the structure.
3. Compute the hopping barrier between neighbouring sites at each depth with the nudged elastic band method.
4. Compare each barrier with the bulk value.

<div class="placeholder">[FIGURE: slab geometry with the defect sites labelled by depth]</div>
<p class="caption">[CAPTION: WHAT THE FIGURE SHOWS, IN ONE SENTENCE]</p>

## Results so far

[YOUR MAIN RESULT IN TWO OR THREE SENTENCES. LEAD WITH THE NUMBER: THE BARRIER AT THE SURFACE AGAINST THE BARRIER IN THE BULK]

<div class="placeholder">[FIGURE: migration barrier against depth below the surface]</div>
<p class="caption">[CAPTION: WHAT THE FIGURE SHOWS, IN ONE SENTENCE]</p>

## What comes next

- A defect phase diagram: the vacancy formation energy and concentration as a function of the iodine chemical potential, the Fermi level and the depth below the surface.
- A machine-learned interatomic potential trained on these calculations, to reach larger cells and longer times.

## What I learned

[TWO OR THREE SENTENCES: A CONVERGENCE PROBLEM YOU SOLVED, A WRONG ASSUMPTION YOU CORRECTED, OR A TOOL YOU BUILT]
