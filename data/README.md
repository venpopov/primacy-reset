# Data dictionary

Data for Popov (2023), *Cognitive resources can be intentionally released when
processed information becomes irrelevant*. Each `preproc_data.csv` is the
preprocessed export of the deployed lab.js study for one condition (raw JATOS
output is not in the repository; the study source is in `expfiles/`).

| Directory | Experiment in the paper | Task | Reset signal | Reset duration | Rows | Participants in file |
|---|---|---|---|---|---|---|
| `exp1/` | Experiment 1 | serial order reconstruction (words) | `XXX` | 1000 ms | 25,317 | 97 |
| `exp1b/` | Experiment 1 | serial order reconstruction (words) | `XXX` | 250 ms | 25,839 | 99 |
| `exp2/` | Experiment 2 | random-order probed recall (letters) | `###` | 250 ms | 59,220 | 94 |

`exp1` and `exp1b` are the two **between-subjects reset-duration conditions of
the same experiment**, not two studies. `analyses/analysis_exp1.R`
`bind_rows()` them and the paper reports them together. Participant `id`s do not
overlap between any of the three files.

In `exp1`/`exp1b` every row is one **response** (one click). In `exp2` rows are
of two kinds, distinguished by `sender`: **presentation** events (`"Stim"`, one
per letter shown, including the List 1 letters that are never tested) and
**responses** (`"Reconstruction"`, one per typed letter).

---

## Design in one paragraph

Each trial presented **List 1** (variable length, the `setsize` factor) and, on
reset trials only, a reset signal followed by **List 2** (fixed length: 6 items
in Exp 1, 5 in Exp 2). On **standard** trials (`trial_type == "first"`) List 1
was studied and tested. On **reset** trials (`trial_type == "full"`) List 1 was
cancelled by the reset signal and only List 2 was tested. The paper's core
analyses use `trial_type == "full"`.

Per participant after `trial > 6`: Exp 1 has 48 experimental trials
(2 trial types × 6 set sizes × 4 replications), Exp 2 has 60
(2 × 5 × 6). Response rows per trial:

| | standard trial | reset trial |
|---|---|---|
| Exp 1 | `setsize` rows (1–6) | 6 rows (List 2) |
| Exp 2 | `setsize` rows (1–5) | 5 rows (List 2) |

---

## Columns shared by all three files

| Column | Type | Values | Meaning |
|---|---|---|---|
| *(unnamed first column)* | int | 1…N | Row number written by `write.csv`; `read.csv` names it `X`. No meaning. |
| `id` | int | 38688–39532 | Participant identifier (from JATOS). Unique across all three files. |
| `acc` | int | 0, 1 | Response correct. Exp 1: no missing values. Exp 2: `NA` on `"Stim"` rows. Equals `chosen_stim == correct_response` (Exp 1) / `response == correct_response` (Exp 2) exactly. |
| `correct_response` | chr | 180 nouns / 17 consonants | The item that *should* have been given for this test position. `NA` on Exp 2 `"Stim"` rows. |
| `response` | int (Exp 1) / chr (Exp 2) | 1–6 / letter | Exp 1: **1-based index into `test_order`** — which word on the test display was clicked (`test_order[response] == chosen_stim`). Exp 2: the letter the participant typed. |
| `duration` | num | ms | Exp 1 and Exp 2 `"Reconstruction"` rows: **response time** for that response, in milliseconds. Exp 2 `"Stim"` rows: measured on-screen duration of that letter (nominally 750 ms). Missing for 2 responses in `exp1b` and 6 in `exp2`. |
| `response_position` | int | 1–6 (Exp 1), 1–5 (Exp 2) | **Output position**: the order in which this response was made within the test phase. `NA` on Exp 2 `"Stim"` rows. |
| `setsize` | int | 1–6 (Exp 1), 1–5 (Exp 2) | **Length of List 1** — the manipulated set size, on both standard and reset trials. In Exp 2 it is `NA` on the List 2 presentation rows (see `setsize1`). |
| `setsize1` | — | see note | Exp 1/`exp1b`: column exists but is **entirely empty** (reads as logical `NA`). Exp 2: carries the List 1 set size on List 2 presentation rows only — the complement of `setsize`, under the parameter name used by the second presentation loop. Verified identical to that trial's `setsize`. |
| `trial` | int | 1–54 (Exp 1), 1–66 (Exp 2) | Trial number within the session. Trials 1–6 are practice/warm-up: **every analysis applies `trial > 6`**. |
| `trial_part` | chr | `"first"`, `"second"` | Exp 1/`exp1b`: entirely empty. Exp 2: which list this presentation row belongs to; `NA` on `"Reconstruction"` rows. |
| `trial_type` | chr | `"first"`, `"full"` | `"first"` = **standard** trial (List 1 studied and tested). `"full"` = **reset** trial (List 1 studied then cancelled, List 2 tested). |
| `practice` | chr | `"practice"`, `NA` | **Unreliable — do not filter on it; use `trial > 6`.** Exp 1: flags trials 1–4 only, so the two warm-up trials 5–6 are left unflagged. Exp 2: always `"practice"` on `"Reconstruction"` and List 2 presentation rows regardless of trial; only meaningful on `sender == "Stim" & trial_part == "first"` rows, where it flags trials 1–4. |
| `use_help` | chr | `"Yes"`, `"No"` | Participant-level debriefing answer: used external help (pen and paper) to remember. Exclusion criterion. |
| `analyze_data` | chr | `"Yes"`, `"No"` | Participant-level debriefing answer: performed the task diligently / consents to analysis. Exclusion criterion. |
| `total_duration` | num | ~12–64 | Participant-level total session duration, in **minutes**. |
| `reset_duration` | int | 250, 1000 | Duration of the reset signal in ms — constant within a file (`exp1` = 1000, `exp1b` = 250, `exp2` = 250). This is the between-subjects factor of Experiment 1. |

## Columns in `exp1/` and `exp1b/` only

| Column | Type | Meaning |
|---|---|---|
| `chosen_stim` | chr | The word the participant clicked at this output position. Compare with `correct_response` to get `acc`. |
| `test_order` | chr | Comma-separated words as displayed **on the test screen**, in the randomized left-to-right order. Its length equals the tested list length (`setsize` on standard trials, always 6 on reset trials); `response` indexes into it. Identical for all rows of a trial. |
| `Instructions` | num | Participant-level: milliseconds spent on the first instruction screen. |
| `Instructions2` | num | Participant-level: milliseconds spent on the second instruction screen. |

Each participant drew a closed pool of **12 words** (verified) from the 180-noun
pool of Popov & Dames (2022); within a trial words were drawn without
replacement, so no word appears twice in a trial and List 1 words never
reappear in List 2 of the same trial.

Note that on reset trials **List 1 leaves no rows at all** in Exp 1 — it was
never tested and presentation events were not logged. Its length is recoverable
only from `setsize`.

## Columns in `exp2/` only

| Column | Type | Meaning |
|---|---|---|
| `sender` | chr | `"Stim"` = presentation event (one row per letter shown, both lists); `"Reconstruction"` = response event. Analyses filter to `"Reconstruction"`; `analyses/reviewer_checks.R` uses the `"Stim"` rows to verify List 1/List 2 stimulus overlap, which is only possible in this experiment. |
| `stim` | chr | The letter presented on this `"Stim"` row. `NA` on response rows. |
| `input_position` | int 1–5 | **Study (input) position** of the item within its own list. Present on both row types. Because testing order was random, this is decoupled from `response_position`, which is the point of Experiment 2 — **Exp 2 serial-position figures are keyed on `input_position`**. |
| `stim_loc` | int 0–9 | 0-based index of the frame (of ten arranged in a circle) in which this letter appeared. `NA` on response rows. |
| `location` | int 0–9 | 0-based index of the frame highlighted as the probe for this response. `NA` on `"Stim"` rows. Joining on `location == stim_loc` within a trial recovers the probed item exactly (verified: it always matches `correct_response` and its `input_position`). |

Each participant drew a closed pool of **10 letters** (verified) from the 17
consonants B C D F G J K L M N P Q S T V X Z, one per frame; within a trial
letters were drawn without replacement, so no letter appears in both List 1 and
List 2 of a trial (checked directly in `analyses/reviewer_checks.R`).

---

## Exclusions

Exclusions are inlined at the top of each analysis script and must run before
anything else. Reproduced numbers (verified against the files):

**Experiment 1** (`analyses/analysis_exp1.R`)

1. Drop participants with `use_help != "No"` or `analyze_data != "Yes"`
   → 95 (`exp1`) + 98 (`exp1b`).
2. Drop participants at chance, where chance is derived from a bootstrap
   simulation with `set.seed(142134)`: List 1 accuracy (`trial > 6`,
   `setsize > 1`, standard trials) must exceed 0.4283, List 2 accuracy
   (`trial > 6`, reset trials) must exceed 0.2346.
   **Changing the seed shifts these thresholds and can change N.**
   → **92** in the 1000 ms condition (`exp1`) and **96** in the 250 ms
   condition (`exp1b`), **188 total**.
3. Drop practice/warm-up trials with `trial > 6`.

*(The manuscript's Procedure section currently says "97 participants" for the
250 ms group; the data give 96, and 92 + 96 = 188 matches the reported final
sample.)*

**Experiment 2** (`analyses/analysis_exp2.R`)

1. Drop `use_help != "No"` / `analyze_data != "Yes"` and keep
   `sender == "Reconstruction"` → 91.
2. Drop the two extremely poor performers with `list1_overall_acc <= 0.25`
   → **89**.
3. Drop practice/warm-up trials with `trial > 6`.

Both scripts add two derived participant-level columns before excluding:
`list1_overall_acc` (mean `acc` on standard trials with `trial > 6`,
`setsize > 1`) and `list2_overall_acc` (mean `acc` on reset trials with
`trial > 6`).

---

## Gotchas

- **`trial > 6`, always.** `practice` does not identify the non-experimental
  trials in either experiment (see the table above).
- **`setsize` is always List 1's length**, including on reset trials where
  List 2 (fixed length) is the tested list. It is not the length of the tested
  list.
- **`setsize1` is not a second set size.** In Exp 2 it is the same List 1 set
  size recorded on the List 2 presentation rows; in Exp 1 it is an empty
  column.
- **Exp 1 confounds input and output position** (`response_position` is both);
  Exp 2 separates them (`input_position` vs `response_position`). Use
  `input_position` for Exp 2 serial-position analyses.
- **`duration` means two different things in Exp 2** depending on `sender`.
  RT analyses (`analyses/analysis_exp2_rt.R`) filter to
  `sender == "Reconstruction"` first, then trim RTs to 0.2–10 s.
- Only Exp 2 logs the untested List 1; Exp 1 does not.

## See also

- `analyses/analysis_exp1.R`, `analyses/analysis_exp2.R` — preprocessing,
  exclusions, published figures, and the mixed-effects models.
- `analyses/analysis_exp2_rt.R` — response-time analyses.
- `analyses/reviewer_checks.R` — trial counts and stimulus-overlap checks; runs
  end-to-end with `Rscript analyses/reviewer_checks.R` from the repository root.
- `expfiles/` — the deployed lab.js studies, authoritative for procedure
  questions the data cannot answer.
- `drafts/primacy_reset_apa.md` — the manuscript's Method sections.
