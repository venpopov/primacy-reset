# Shared helpers for the analysis scripts.
# Source from the repository root: source('analyses/utils.R')

# within-subject 95% CIs via the Cousineau (2005) method with Morey (2008)
# correction: aggregate to subject x cell means, remove each subject's overall
# mean, then widen the CI by sqrt(J/(J-1)) for J within-subject cells
summary_wsci <- function(data, dv, within, id = "id") {
  cellmeans <- data %>%
    group_by(across(all_of(c(id, within)))) %>%
    summarise(.y = mean(.data[[dv]], na.rm = TRUE), .groups = "drop")
  grand <- mean(cellmeans$.y)
  J <- nrow(distinct(cellmeans[, within, drop = FALSE]))
  cellmeans %>%
    group_by(across(all_of(id))) %>%
    mutate(.norm = .y - mean(.y) + grand) %>%
    group_by(across(all_of(within))) %>%
    summarise(acc = mean(.y),
              ci = qt(0.975, n() - 1) * sd(.norm) / sqrt(n()) * sqrt(J / (J - 1)),
              .groups = "drop")
}

# common figure theme: theme_bw without grid lines
theme_paper <- function() {
  theme_bw() +
    theme(panel.grid.major = element_blank(),
          panel.grid.minor = element_blank())
}
