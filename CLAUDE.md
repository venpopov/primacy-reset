# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

Research compendium for Popov (2023), *Cognitive resources can be intentionally released when processed information becomes irrelevant* — experiment software, data, analysis code, and the manuscript. The paper is under revision at PBR (submission **PBR-BR-23-176.R1**), so most work here is **revising the manuscript and response letter**, not building software. Analysis code exists to support claims in the paper.

R project (`137-measuring-resource-recovery-rate.Rproj`); no package, no build, no test suite.

## Commands

All R is run **from the repository root** — every path in the scripts is repo-relative (`data/...`, `analyses/utils.R`, `figures/...`).

```r
Rscript analyses/reviewer_checks.R   # trial counts + stimulus-overlap checks (R2.1, R2.3); runs end-to-end
```

`analyses/analysis_exp1.R` and `analysis_exp2.R` are **interactive scripts, not batch jobs**: they print counts to console, draw exploratory plots, and end with `brm()` calls that take a long time to sample. Source the sections you need in an R session rather than `Rscript`-ing the whole file. Dependencies: `tidyverse`, `lme4`, `brms` (no `renv` — packages come from the user library).

Regenerating a figure means running that script's preprocessing block (top of file, through the exclusions) plus the one `ggplot`/`ggsave` chunk.

## Data model

Three data directories, one row per response, already preprocessed (raw lab.js output is not in the repo):

| Directory | Experiment in the paper | Task | Reset signal |
|---|---|---|---|
| `data/exp1/` | Experiment 1 | serial order reconstruction | 1000 ms |
| `data/exp1b/` | Experiment 1 | serial order reconstruction | 250 ms |
| `data/exp2/` | Experiment 2 | probed recall of letters | 250 ms |

**`exp1` and `exp1b` are the two between-subjects reset-duration conditions of the same experiment** — `analysis_exp1.R` `bind_rows()` them and the paper reports them as one. `exp1b` is not a separate study. After exclusions: 96 participants in the 250 ms condition (`exp1b`), 92 in the 1000 ms condition (`exp1`), 188 total.

Key columns:

- `trial_type`: `"first"` = standard trial (List 1 studied and tested), `"full"` = reset trial (List 1 studied then cancelled, List 2 tested). The paper's core analyses use `"full"`.
- `setsize` = length of List 1 (1–6 in Exp 1, 1–5 in Exp 2); List 2 is fixed length.
- `trial > 6` drops practice/buffer trials — applied in *every* analysis.
- `response_position` (output position) exists in both experiments; `input_position` exists only in Exp 2, where input and output position are decoupled by probed recall. Exp 2 plots are keyed on `input_position`.
- Exp 2 has two row types in `sender`: `"Stim"` (presentation events, including the untested List 1) and `"Reconstruction"` (responses). Analysis filters to `"Reconstruction"`; `reviewer_checks.R` uses `"Stim"` rows to verify List 1/List 2 stimulus overlap, which is only possible in Exp 2.

**Exclusions are inlined at the top of each analysis script and must run before anything else.** Exp 1 excludes self-reported help / "don't analyze my data", then participants at chance, where chance is derived by a bootstrap simulation with `set.seed(142134)` (changing the seed shifts the thresholds and can change N). Exp 2 uses a simpler `list1_overall_acc > 0.25` cutoff.

`analyses/utils.R` holds the two shared helpers — `summary_wsci()` (Cousineau–Morey within-subject 95% CIs; all published error bars use it, per R1.4) and `theme_paper()`. Both analysis scripts `source()` it *after* preprocessing.

## Figure pipeline

Two distinct paths, and confusing them has already caused one revert:

**Results figures — generated.** R writes to `figures/`; the manuscript reads `drafts/media/` under manuscript-facing names. The copy is manual, so after regenerating, copy across:

| `figures/` (R output) | `drafts/media/` (manuscript) |
|---|---|
| `exp1_acc_by_trial_type_l1setsize_serial_position.svg` | `fig2_exp1_accuracy_by_trial_type.svg` |
| `exp2_acc_by_trial_type_l1setsize_serial_position.svg` | `fig4_exp2_accuracy_by_trial_type.svg` |
| `exp1_acc_shifted_sp.svg` | `figS1_exp1_list2_absolute_position.svg` |
| `exp1_acc_abs_sp_both_lists.svg` | `figS2_exp1_absolute_position_by_setsize.svg` |
| `exp2_acc_shifted_sp.svg` | `figS3_exp2_list2_absolute_position.svg` |
| `exp2_acc_abs_sp_both_lists.svg` | `figS4_exp2_absolute_position_by_setsize.svg` |
| `exp2_input_vs_output_position.svg` | `figS5_exp2_input_output_position.svg` |

**Procedure figures — hand-made, do not regenerate casually.** `fig1_exp1_procedure.svg` and `fig3_exp2_procedure.svg` come from `figures/Exp1_procedure.pptx` (both experiments live in that one deck). The copies in `drafts/media/` are **not** identical to `figures/exp1_procedure.svg` / `exp2_procedure.svg` — the latter are the older exports, still showing a single red X and the wrong Exp 2 reset duration. The manuscript versions are the original SVGs with only the reset panel PNG swapped for the corrected one (XXX for Exp 1, ### for Exp 2) and Exp 2's duration label repointed to `250 ms`.

Do not "fix" them by re-exporting the whole deck: PowerPoint's SVG export writes caption text as Calibri, which renders with broken spacing anywhere MS Office fonts are absent (QuickLook, browsers, GitHub preview). Exporting to PDF and converting with `pdftocairo` avoids the font problem but rasterizes the rotated timing labels. The working method is the minimal graft into the pristine SVGs (see #6/#7 and commits `2d6af52`, `ef109b6`, `6dab972`).

## Revision workflow

`drafts/` holds three documents that must stay in sync:

- `reviews-PBR-BR-23-176.md` — the received reviews, verbatim. Read-only reference.
- `response-to-reviews-PBR-BR-23-176.md` — the reply, one `###` section per numbered point (`### R1.4: Error bars in figures`).
- `revision-tracker-PBR-BR-23-176.md` — triage table; each row links to its response section by heading anchor and carries two checkboxes: *replied in letter* and *implemented in ms*.

When addressing a review point: edit the manuscript, write the reply section, and flip both tracker boxes in the same change. Keep the numbering (`E1`, `R1.4`, `R3.1 (M1)`) exactly as the reviewers used it — the anchors depend on it. Work one review point per branch/PR; that is how the history so far is organized (`#4` = R1.2/R2.1–R2.4, `#5` = R1.6, `#7` = figure fixes).

`drafts/primacy_reset_apa.md` is the **live manuscript**; `.docx` files are the frozen originals as submitted and are not updated. The manuscript is a fictional dialogue between "VP" and an imaginary colleague "IC" — an intentional format, currently under discussion with the editor (E3/R1.8), not a style problem to clean up.

## `expfiles/`

Deployed lab.js studies, one directory per condition (`exp1`, `exp1b`, `exp2`), each with the built app (`index.html` / `script.js` / `static/`), the lab.js `.study.json` source, and a JATOS `.jas`/`.zip` archive. This is an archival record of what participants ran — treat it as read-only, but it is the authoritative source for procedure questions the data can't answer (e.g. that a trial's words are drawn without replacement from one shuffled pool, cited in `reviewer_checks.R`).
