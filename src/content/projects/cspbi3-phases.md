---
title: Structure and phases of α- and γ-CsPbI₃
summary: Relaxing the cubic and orthorhombic phases in Quantum ESPRESSO, and reading the transition through the tolerance factor and soft phonon modes. Includes reusable scripts that turn a CIF file into a ready-to-run input.
question: What separates the cubic α phase of CsPbI₃ from the orthorhombic γ phase, and how do you set both up reliably?
status: "[MM.YYYY]"
tags: [DFT, Python]
order: 2
featured: true
figureLabel: "[FIGURE: α and γ crystal structures]"
facts:
  - { label: Status, value: "[STATUS]" }
  - { label: Material, value: CsPbI₃ }
  - { label: Methods, value: "DFT, structural relaxation" }
  - { label: Code, value: "Quantum ESPRESSO, Python, ASE" }
links: []
---

## The question

[WHY YOU STARTED WITH THE TWO PHASES, IN TWO OR THREE SENTENCES]

## Method

1. Relax the cubic α and orthorhombic γ structures in Quantum ESPRESSO, converging the plane-wave cutoff and the k-point mesh.
2. Compare the two through the Goldschmidt tolerance factor and the soft phonon modes that drive the octahedral tilts.
3. Automate the setup with Python scripts that turn a CIF file into a ready-to-run input.

<div class="placeholder">[FIGURE: α and γ structures side by side]</div>
<p class="caption">[CAPTION: WHAT THE FIGURE SHOWS, IN ONE SENTENCE]</p>

## Results

[YOUR RELAXED LATTICE PARAMETERS AND THE ENERGY DIFFERENCE BETWEEN THE PHASES]

## What I learned

[TWO OR THREE SENTENCES]
