# Checks supporting the response to reviews (PBR-BR-23-176.R1):
#   R2.1 - number of experimental trials per participant
#   R2.3 - overlap between List 1 and List 2 stimuli within a trial
# Run from the repository root: Rscript analyses/reviewer_checks.R

library(tidyverse)

#############################################################################!
# Experiment 1                                                            ####
#############################################################################!

d1 <- bind_rows(read.csv('data/exp1/preproc_data.csv'),
                read.csv('data/exp1b/preproc_data.csv'))
exp1 <- filter(d1, trial > 6)  # exclude practice and buffer trials

# R2.1: experimental trials per participant
# expect 48 = 2 trial types x 6 set sizes x 4 replications
cat("\nExp1: distribution of experimental trial counts per participant\n")
exp1 %>% distinct(id, trial) %>% count(id, name = "n_trials") %>%
  count(n_trials, name = "n_participants") %>% print()

cat("\nExp1: distribution of trial counts per trial type x set size cell\n")
exp1 %>% distinct(id, trial, trial_type, setsize) %>%
  count(id, trial_type, setsize) %>%
  count(n, name = "n_cells") %>% print()

# R2.3: no word repeats within a tested list. List 1 words on reset trials
# were never tested and are not in the data; that no word could appear in
# both lists of a trial is guaranteed by the experiment code
# (expfiles/apps/exp1/primacy-resource-exp1-add/script.js), which draws all
# of a trial's words, List 1 then List 2, from a single random shuffle of
# the participant's 12-word pool (i.e., without replacement).
cat("\nExp1: any tested list containing a repeated word?\n")
exp1 %>% group_by(id, trial) %>%
  summarise(has_duplicate = anyDuplicated(correct_response) > 0, .groups = "drop") %>%
  count(has_duplicate, name = "n_trials") %>% print()

#############################################################################!
# Experiment 2                                                            ####
#############################################################################!

d2 <- read.csv('data/exp2/preproc_data.csv')

# R2.1: experimental trials per participant
# expect 60 = 2 trial types x 5 set sizes x 6 replications
cat("\nExp2: distribution of experimental trial counts per participant\n")
d2 %>% filter(sender == "Reconstruction", trial > 6) %>%
  distinct(id, trial) %>% count(id, name = "n_trials") %>%
  count(n_trials, name = "n_participants") %>% print()

cat("\nExp2: distribution of trial counts per trial type x set size cell\n")
d2 %>% filter(sender == "Reconstruction", trial > 6) %>%
  distinct(id, trial, trial_type, setsize) %>%
  count(id, trial_type, setsize) %>%
  count(n, name = "n_cells") %>% print()

# R2.3: the exp2 data contain presentation rows (sender == "Stim") for both
# lists, including the untested List 1 on reset trials, so overlap can be
# checked directly
pres <- filter(d2, sender == "Stim", trial > 6)

cat("\nExp2: list lengths on reset trials (sanity check)\n")
pres %>% filter(trial_type == "full") %>%
  count(id, trial, trial_part, name = "list_length") %>%
  count(trial_part, list_length, name = "n_trials") %>% print()

cat("\nExp2: letters appearing in both List 1 and List 2 of a reset trial\n")
pres %>% filter(trial_type == "full") %>%
  group_by(id, trial) %>%
  summarise(n_overlap = length(intersect(stim[trial_part == "first"],
                                         stim[trial_part == "second"])),
            .groups = "drop") %>%
  count(n_overlap, name = "n_trials") %>% print()

cat("\nExp2: any trial presenting the same letter twice?\n")
pres %>% group_by(id, trial) %>%
  summarise(has_duplicate = anyDuplicated(stim) > 0, .groups = "drop") %>%
  count(has_duplicate, name = "n_trials") %>% print()
