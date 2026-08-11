library(dplyr)
library(tidyr)
library(ggplot2)

#############################################################################!
# DATA preprocessing (same exclusions as analysis_exp2.R)                 ####
#############################################################################!

dat <- read.csv('data/exp2/preproc_data.csv')

# exclude participants who used help or said not to analyze their data;
# keep only the response (Reconstruction) rows, where duration = RT in ms
dat <- filter(dat, use_help == "No", analyze_data == "Yes", sender == "Reconstruction")

# calculate average performance for each subject on the reset trials
oacc_l2 <- dat %>%
  group_by(id) %>%
  filter(trial > 6, trial_type == "full") %>%
  summarise(list2_overall_acc = mean(acc))

oacc_l1 <- dat %>%
  group_by(id) %>%
  filter(trial > 6, setsize > 1, trial_type == "first") %>%
  summarise(list1_overall_acc = mean(acc))

dat <- left_join(dat, oacc_l2, by = "id")
dat <- left_join(dat, oacc_l1, by = "id")

# remove two extremely poorly performing participants
dat <- filter(dat, list1_overall_acc > 0.25)

# RT data: exclude practice and buffer trials; duration is the RT in ms
# (5 responses have a missing duration - all incorrect, scattered across
# participants/trials; dropped for the RT analyses)
rt <- dat %>%
  filter(trial > 6) %>%
  mutate(rt = duration / 1000)  # in seconds

cat("\nResponses with missing duration (dropped):", sum(is.na(rt$rt)),
    "of", nrow(rt), "\n")
rt <- filter(rt, !is.na(rt))

#############################################################################!
# Summary stats                                                           ####
#############################################################################!

cat("\n--- Overall RT summary (seconds) ---\n")
rt %>%
  summarise(
    n = n(),
    mean = mean(rt), sd = sd(rt),
    min = min(rt), max = max(rt),
    skew = mean(((rt - mean(rt)) / sd(rt))^3)
  ) %>%
  print()

cat("\n--- Quantiles (seconds) ---\n")
print(round(quantile(rt$rt, c(0, .001, .01, .05, .1, .25, .5, .75, .9, .95, .99, .999, 1)), 3))

cat("\n--- By trial type ---\n")
rt %>%
  group_by(trial_type) %>%
  summarise(n = n(), mean = mean(rt), median = median(rt), sd = sd(rt)) %>%
  print()

cat("\n--- By accuracy ---\n")
rt %>%
  group_by(acc) %>%
  summarise(n = n(), mean = mean(rt), median = median(rt), sd = sd(rt)) %>%
  print()

cat("\n--- Proportion of responses beyond candidate cutoffs ---\n")
rt %>%
  summarise(
    `rt < 0.15s` = mean(rt < 0.15),
    `rt < 0.2s`  = mean(rt < 0.2),
    `rt < 0.3s`  = mean(rt < 0.3),
    `rt > 5s`    = mean(rt > 5),
    `rt > 10s`   = mean(rt > 10),
    `rt > 20s`   = mean(rt > 20),
    `rt > 30s`   = mean(rt > 30)
  ) %>%
  pivot_longer(everything(), names_to = "criterion", values_to = "proportion") %>%
  mutate(n_trials = round(proportion * nrow(rt))) %>%
  print()

cat("\n--- Per-participant median RT: distribution across participants ---\n")
ppt <- rt %>% group_by(id) %>% summarise(median_rt = median(rt), max_rt = max(rt))
print(round(summary(ppt$median_rt), 3))
cat("\nParticipants with any RT > 10s:", sum(ppt$max_rt > 10), "out of", nrow(ppt), "\n")

#############################################################################!
# Histograms                                                              ####
#############################################################################!

# raw scale, truncated at 10s for visibility (count above shown in caption)
n_above10 <- sum(rt$rt > 10)
p1 <- rt %>%
  filter(rt <= 10) %>%
  ggplot(aes(rt)) +
  geom_histogram(binwidth = 0.1, fill = "grey40", color = "white", linewidth = 0.1) +
  labs(x = "Response time (s)", y = "Count",
       title = "Raw scale (truncated at 10 s)",
       subtitle = paste0(n_above10, " responses (",
                         round(100 * n_above10 / nrow(rt), 2), "%) above 10 s not shown"),
       caption = "All responses (correct and incorrect)") +
  theme_bw() +
  theme(panel.grid.major = element_blank(), panel.grid.minor = element_blank())
ggsave('figures/exp2_rt_hist_raw.svg', p1, width = 5, height = 3.5, units = 'in')

# log scale, full range
p2 <- rt %>%
  ggplot(aes(rt)) +
  geom_histogram(bins = 80, fill = "grey40", color = "white", linewidth = 0.1) +
  scale_x_log10(breaks = c(0.1, 0.3, 1, 3, 10, 30, 100)) +
  labs(x = "Response time (s, log scale)", y = "Count", title = "Log scale (full range)",
       caption = "All responses (correct and incorrect)") +
  theme_bw() +
  theme(panel.grid.major = element_blank(), panel.grid.minor = element_blank())
ggsave('figures/exp2_rt_hist_log.svg', p2, width = 5, height = 3.5, units = 'in')

# log scale by trial type and accuracy
p_hist_acc <- rt %>%
  mutate(trial_type = ifelse(trial_type == "first", "Standard trials (List 1)", "Reset trials (List 2)"),
         accuracy = ifelse(acc == 1, "Correct", "Incorrect")) %>%
  ggplot(aes(rt, fill = accuracy)) +
  geom_histogram(bins = 80, position = "identity", alpha = 0.6) +
  scale_x_log10(breaks = c(0.1, 0.3, 1, 3, 10, 30, 100)) +
  facet_wrap(~trial_type) +
  labs(x = "Response time (s, log scale)", y = "Count", fill = NULL) +
  theme_bw() +
  theme(panel.grid.major = element_blank(), panel.grid.minor = element_blank(),
        legend.position = "bottom")
ggsave('figures/exp2_rt_hist_by_type_acc.svg', p_hist_acc, width = 6.5, height = 3.5, units = 'in')

#############################################################################!
# Condition-level RT analyses (cleaned data)                              ####
#############################################################################!

source('analyses/utils.R')

# trim implausibly fast and extremely slow responses (see histograms above):
# < 0.2 s and > 10 s, dropping ~0.7% of responses
rtc <- rt %>% filter(rt >= 0.2, rt <= 10)
cat("\nResponses removed by 0.2-10s cutoffs:", nrow(rt) - nrow(rtc),
    "of", nrow(rt), sprintf("(%.2f%%)\n", 100 * (1 - nrow(rtc) / nrow(rt))))

# summary_wsci names the mean column 'acc'; rename it for the RT plots
wsci_rt <- function(data, within) {
  summary_wsci(data, "rt", within) %>% rename(rt = acc)
}

relabel_tt <- function(data) {
  mutate(data, trial_type = ifelse(trial_type == "first",
                                   " Standard trials: List 1",
                                   "Reset trials: List 2"))
}
relabel_acc <- function(data) {
  mutate(data, accuracy = ifelse(acc == 1, "Correct", "Incorrect"))
}

## 1) RT as a function of List 1 set size and trial type ----
wsci_rt(relabel_tt(rtc), c("trial_type", "setsize")) %>%
  ggplot(aes(setsize, rt, color = trial_type, shape = trial_type, group = trial_type)) +
  geom_errorbar(aes(ymin = rt - ci, ymax = rt + ci), width = 0.15, linewidth = 0.3, show.legend = FALSE) +
  geom_point() +
  geom_line() +
  scale_color_discrete('', labels = c("List 1 (standard trials)", "List 2 (reset trials)")) +
  scale_shape_discrete('', labels = c("List 1 (standard trials)", "List 2 (reset trials)")) +
  xlab('Set size of List 1') +
  ylab('Mean RT (s)') +
  theme_paper() +
  theme(legend.position = "bottom") +
  labs(caption = "All responses (correct and incorrect)")
ggsave('figures/exp2_rt_by_setsize.svg', width = 4, height = 3.5, units = 'in')

## 2) RT by input serial position and List 1 set size (mirror of Figure 4) ----
wsci_rt(relabel_tt(rtc), c("trial_type", "setsize", "input_position")) %>%
  ggplot(aes(input_position, rt, color = as.factor(setsize), shape = as.factor(setsize), fill = as.factor(setsize))) +
  geom_errorbar(aes(ymin = rt - ci, ymax = rt + ci), width = 0.25, linewidth = 0.3, show.legend = FALSE) +
  geom_point() +
  geom_line() +
  scale_color_discrete('Set size of List 1') +
  scale_fill_discrete('Set size of List 1') +
  scale_shape_manual('Set size of List 1', values = c(21, 22, 23, 24, 25, 3)) +
  facet_wrap(~trial_type) +
  xlab('Input serial position within list') +
  ylab('Mean RT (s)') +
  theme_paper() +
  labs(caption = "All responses (correct and incorrect)")
ggsave('figures/exp2_rt_by_trial_type_l1setsize_serial_position.svg', width = 6.5, height = 3, units = 'in')

# robustness check: same figure on the log scale (geometric means, back-transformed)
rtc %>%
  relabel_tt() %>%
  mutate(rt = log(rt)) %>%
  summary_wsci("rt", c("trial_type", "setsize", "input_position")) %>%
  mutate(rt = exp(acc), lo = exp(acc - ci), hi = exp(acc + ci)) %>%
  ggplot(aes(input_position, rt, color = as.factor(setsize), shape = as.factor(setsize), fill = as.factor(setsize))) +
  geom_errorbar(aes(ymin = lo, ymax = hi), width = 0.25, linewidth = 0.3, show.legend = FALSE) +
  geom_point() +
  geom_line() +
  scale_color_discrete('Set size of List 1') +
  scale_fill_discrete('Set size of List 1') +
  scale_shape_manual('Set size of List 1', values = c(21, 22, 23, 24, 25, 3)) +
  facet_wrap(~trial_type) +
  xlab('Input serial position within list') +
  ylab('Geometric mean RT (s)') +
  theme_paper() +
  labs(caption = "All responses (correct and incorrect)")
ggsave('figures/exp2_rt_geomean_by_trial_type_l1setsize_serial_position.svg', width = 6.5, height = 3, units = 'in')

## 3) RT by output (testing) position and List 1 set size ----
wsci_rt(relabel_tt(rtc), c("trial_type", "setsize", "response_position")) %>%
  ggplot(aes(response_position, rt, color = as.factor(setsize), shape = as.factor(setsize), fill = as.factor(setsize))) +
  geom_errorbar(aes(ymin = rt - ci, ymax = rt + ci), width = 0.25, linewidth = 0.3, show.legend = FALSE) +
  geom_point() +
  geom_line() +
  scale_color_discrete('Set size of List 1') +
  scale_fill_discrete('Set size of List 1') +
  scale_shape_manual('Set size of List 1', values = c(21, 22, 23, 24, 25, 3)) +
  facet_wrap(~trial_type) +
  xlab('Output (testing) position') +
  ylab('Mean RT (s)') +
  theme_paper() +
  labs(caption = "All responses (correct and incorrect)")
ggsave('figures/exp2_rt_by_output_position.svg', width = 6.5, height = 3, units = 'in')

## 4) RT by input x output position (mirror of Figure S5, both trial types) ----
wsci_rt(relabel_tt(rtc), c("trial_type", "response_position", "input_position")) %>%
  ggplot(aes(input_position, rt, color = as.factor(response_position), shape = as.factor(response_position), fill = as.factor(response_position))) +
  geom_errorbar(aes(ymin = rt - ci, ymax = rt + ci), width = 0.25, linewidth = 0.3, show.legend = FALSE) +
  geom_point() +
  geom_line() +
  scale_color_discrete('Output position') +
  scale_fill_discrete('Output position') +
  scale_shape_manual('Output position', values = c(21, 22, 23, 24, 25, 3)) +
  facet_wrap(~trial_type) +
  xlab('Input serial position within list') +
  ylab('Mean RT (s)') +
  theme_paper() +
  labs(caption = "All responses (correct and incorrect)")
ggsave('figures/exp2_rt_input_vs_output_position.svg', width = 6.5, height = 3, units = 'in')

## 5) List 2 RT by serial position from the beginning of the trial ----
rtc %>%
  filter(trial_type == "full") %>%
  mutate(shifted_sp = input_position + setsize) %>%
  wsci_rt(c("setsize", "shifted_sp")) %>%
  ggplot(aes(as.factor(shifted_sp), rt, color = as.factor(setsize), shape = as.factor(setsize), fill = as.factor(setsize), group = as.factor(setsize))) +
  geom_errorbar(aes(ymin = rt - ci, ymax = rt + ci), width = 0.25, linewidth = 0.3, show.legend = FALSE) +
  geom_point() +
  geom_line() +
  scale_color_discrete('Set size of List 1') +
  scale_fill_discrete('Set size of List 1') +
  scale_shape_manual('Set size of List 1', values = c(21, 22, 23, 24, 25, 3)) +
  xlab('Serial position from begining of the trial') +
  ylab('List 2 Mean RT (s)') +
  theme_paper() +
  labs(caption = "All responses (correct and incorrect)")
ggsave('figures/exp2_rt_shifted_sp.svg', width = 4.5, height = 3, units = 'in')

## 6) RT by absolute serial position, both lists (mirror of Figure S4) ----
rtc %>%
  mutate(abs_resp_pos = ifelse(trial_type == "first", input_position, input_position + setsize)) %>%
  wsci_rt(c("trial_type", "setsize", "abs_resp_pos")) %>%
  ggplot(aes(as.factor(abs_resp_pos), rt, color = trial_type, group = trial_type, shape = trial_type)) +
  geom_errorbar(aes(ymin = rt - ci, ymax = rt + ci), width = 0.25, linewidth = 0.3, show.legend = FALSE) +
  geom_point() +
  geom_line() +
  xlab('Serial position from begining of the trial') +
  ylab('Mean RT (s)') +
  scale_color_discrete('', labels = c("List 1 (standard trials)", "List 2 (reset trials)")) +
  scale_shape_discrete('', labels = c("List 1 (standard trials)", "List 2 (reset trials)")) +
  facet_wrap(~setsize) +
  theme_paper() +
  theme(legend.position = "bottom") +
  geom_vline(data = filter(rtc, setsize == 1), aes(xintercept = 1.5), color = 'darkgrey', linetype = "dotdash") +
  geom_vline(data = filter(rtc, setsize == 2), aes(xintercept = 2.5), color = 'darkgrey', linetype = "dotdash") +
  geom_vline(data = filter(rtc, setsize == 3), aes(xintercept = 3.5), color = 'darkgrey', linetype = "dotdash") +
  geom_vline(data = filter(rtc, setsize == 4), aes(xintercept = 4.5), color = 'darkgrey', linetype = "dotdash") +
  geom_vline(data = filter(rtc, setsize == 5), aes(xintercept = 5.5), color = 'darkgrey', linetype = "dotdash") +
  labs(caption = "All responses (correct and incorrect)")
ggsave('figures/exp2_rt_abs_sp_both_lists.svg', width = 6, height = 4, units = 'in')

#############################################################################!
# Same analyses split by accuracy                                         ####
#############################################################################!
# note: cells are sparser here (not every participant contributes incorrect
# responses to every cell), collapse over setsize where noted

## 7) RT by input serial position, split by accuracy (collapsed over setsize) ----
wsci_rt(relabel_acc(relabel_tt(rtc)), c("trial_type", "accuracy", "input_position")) %>%
  ggplot(aes(input_position, rt, color = accuracy, shape = accuracy, group = accuracy)) +
  geom_errorbar(aes(ymin = rt - ci, ymax = rt + ci), width = 0.25, linewidth = 0.3, show.legend = FALSE) +
  geom_point() +
  geom_line() +
  scale_color_discrete('') +
  scale_shape_discrete('') +
  facet_wrap(~trial_type) +
  xlab('Input serial position within list') +
  ylab('Mean RT (s)') +
  theme_paper() +
  theme(legend.position = "bottom")
ggsave('figures/exp2_rt_by_serial_position_acc.svg', width = 6.5, height = 3.5, units = 'in')

## 8) RT by input serial position and set size, split by accuracy ----
wsci_rt(relabel_acc(relabel_tt(rtc)), c("trial_type", "accuracy", "setsize", "input_position")) %>%
  ggplot(aes(input_position, rt, color = as.factor(setsize), shape = as.factor(setsize), fill = as.factor(setsize))) +
  geom_errorbar(aes(ymin = rt - ci, ymax = rt + ci), width = 0.25, linewidth = 0.3, show.legend = FALSE) +
  geom_point() +
  geom_line() +
  scale_color_discrete('Set size of List 1') +
  scale_fill_discrete('Set size of List 1') +
  scale_shape_manual('Set size of List 1', values = c(21, 22, 23, 24, 25, 3)) +
  facet_grid(accuracy ~ trial_type) +
  xlab('Input serial position within list') +
  ylab('Mean RT (s)') +
  theme_paper()
ggsave('figures/exp2_rt_by_trial_type_l1setsize_serial_position_acc.svg', width = 6.5, height = 5, units = 'in')

## 9) RT by output position, split by accuracy (collapsed over setsize) ----
wsci_rt(relabel_acc(relabel_tt(rtc)), c("trial_type", "accuracy", "response_position")) %>%
  ggplot(aes(response_position, rt, color = accuracy, shape = accuracy, group = accuracy)) +
  geom_errorbar(aes(ymin = rt - ci, ymax = rt + ci), width = 0.25, linewidth = 0.3, show.legend = FALSE) +
  geom_point() +
  geom_line() +
  scale_color_discrete('') +
  scale_shape_discrete('') +
  facet_wrap(~trial_type) +
  xlab('Output (testing) position') +
  ylab('Mean RT (s)') +
  theme_paper() +
  theme(legend.position = "bottom")
ggsave('figures/exp2_rt_by_output_position_acc.svg', width = 6.5, height = 3.5, units = 'in')

## 10) RT by input x output position, split by accuracy ----
wsci_rt(relabel_acc(relabel_tt(rtc)), c("trial_type", "accuracy", "response_position", "input_position")) %>%
  ggplot(aes(input_position, rt, color = as.factor(response_position), shape = as.factor(response_position), fill = as.factor(response_position))) +
  geom_errorbar(aes(ymin = rt - ci, ymax = rt + ci), width = 0.25, linewidth = 0.3, show.legend = FALSE) +
  geom_point() +
  geom_line() +
  scale_color_discrete('Output position') +
  scale_fill_discrete('Output position') +
  scale_shape_manual('Output position', values = c(21, 22, 23, 24, 25, 3)) +
  facet_grid(accuracy ~ trial_type) +
  xlab('Input serial position within list') +
  ylab('Mean RT (s)') +
  theme_paper()
ggsave('figures/exp2_rt_input_vs_output_position_acc.svg', width = 6.5, height = 5, units = 'in')

## numeric summaries ----
cat("\n--- Mean RT by trial type and input position (cleaned) ---\n")
rtc %>%
  group_by(trial_type, input_position) %>%
  summarise(mean_rt = mean(rt), median_rt = median(rt), n = n(), .groups = "drop") %>%
  print(n = 20)

cat("\n--- Mean RT by trial type and output position (cleaned) ---\n")
rtc %>%
  group_by(trial_type, response_position) %>%
  summarise(mean_rt = mean(rt), median_rt = median(rt), n = n(), .groups = "drop") %>%
  print(n = 20)

cat("\n--- Mean RT by trial type and accuracy (cleaned) ---\n")
rtc %>%
  group_by(trial_type, acc) %>%
  summarise(mean_rt = mean(rt), median_rt = median(rt), n = n(), .groups = "drop") %>%
  print()
