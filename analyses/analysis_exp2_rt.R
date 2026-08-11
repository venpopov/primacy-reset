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
                         round(100 * n_above10 / nrow(rt), 2), "%) above 10 s not shown")) +
  theme_bw() +
  theme(panel.grid.major = element_blank(), panel.grid.minor = element_blank())
ggsave('figures/exp2_rt_hist_raw.svg', p1, width = 5, height = 3.5, units = 'in')

# log scale, full range
p2 <- rt %>%
  ggplot(aes(rt)) +
  geom_histogram(bins = 80, fill = "grey40", color = "white", linewidth = 0.1) +
  scale_x_log10(breaks = c(0.1, 0.3, 1, 3, 10, 30, 100)) +
  labs(x = "Response time (s, log scale)", y = "Count", title = "Log scale (full range)") +
  theme_bw() +
  theme(panel.grid.major = element_blank(), panel.grid.minor = element_blank())
ggsave('figures/exp2_rt_hist_log.svg', p2, width = 5, height = 3.5, units = 'in')

# log scale by trial type and accuracy
p3 <- rt %>%
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
ggsave('figures/exp2_rt_hist_by_type_acc.svg', p3, width = 6.5, height = 3.5, units = 'in')
