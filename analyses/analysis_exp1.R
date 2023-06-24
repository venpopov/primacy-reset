library(tidyverse)
library(brms)
library(lme4)

#############################################################################!
# DATA preprocessing                                                      ####
#############################################################################!

# load('output/exp1.RData')
dat1a <- read.csv('data/exp1/preproc_data.csv')
dat1b <- read.csv('data/exp1b/preproc_data.csv')
dat <- bind_rows(dat1a, dat1b)

# total number of participants 
dat$id %>% unique() %>% length()

# participants who said they used help or said not to analyze their data
dat %>% 
  select(id, use_help, analyze_data) %>% 
  unique() %>% 
  count(use_help, analyze_data)

# exclude participants who used help or said not to analyze their data
dat <- filter(dat, use_help == "No", analyze_data == "Yes")


# calculate average performance for each subject on the reset trials
oacc_l2 <- dat %>% 
  group_by(id) %>% 
  filter(trial > 6, trial_type=="full") %>% 
  summarise(list2_overall_acc = mean(acc)) %>% 
  arrange(list2_overall_acc) %>% 
  print()

oacc_l1 <- dat %>% 
  group_by(id) %>% 
  filter(trial > 6, setsize > 1, trial_type=="first") %>% 
  summarise(list1_overall_acc = mean(acc)) %>% 
  arrange(list1_overall_acc) %>% 
  print()


dat <- left_join(dat, oacc_l2)
dat <- left_join(dat, oacc_l1)

# Bootstrapping simulation to determine chance performance on both lists
set.seed(142134)
l1_sim <- sapply(1:10000, function(i) mean(c(colMeans(replicate(4, sample(1:2) == 1:2)),
                                          colMeans(replicate(4, sample(1:3) == 1:3)),
                                          colMeans(replicate(4, sample(1:4) == 1:4)),
                                          colMeans(replicate(4, sample(1:5) == 1:5)),
                                          colMeans(replicate(4, sample(1:6) == 1:6)))))
hist(l1_sim)
mean(l1_sim)
mean(l1_sim)-1.96*sd(l1_sim)
mean(l1_sim)+1.96*sd(l1_sim)


l2_sim <- sapply(1:10000, function(i) mean(colMeans(replicate(24, sample(1:6) == 1:6))))
hist(l2_sim)
mean(l2_sim)
mean(l2_sim)-1.96*sd(l2_sim)
mean(l2_sim)+1.96*sd(l2_sim)

# exclude participants with near chance performance
dat <- filter(dat, list1_overall_acc > mean(l1_sim)+1.96*sd(l1_sim), list2_overall_acc > mean(l2_sim)+1.96*sd(l2_sim))

# final number of participants
dat$id %>% unique() %>% length()

# exclude practice trials
dat <- filter(dat, trial > 6)

#############################################################################!
# PLOTS                                                                  ####
#############################################################################!



# accuracy as a function of setsize
dat %>% 
  filter(is.na(practice), trial > 6) %>%  # exclude practice and buffer trials
  ggplot(aes(setsize, acc)) +
  stat_summary(geom="pointrange") +
  stat_summary(geom="line") +
  facet_wrap(~trial_type) +
  theme_classic() +
  scale_x_continuous('Set size of Part 1')


# accuracy as a function of response_position and setsize
dat %>% 
  filter(is.na(practice), trial > 6) %>%  # exclude practice and buffer trials
  mutate(trial_type = ifelse(trial_type == "first", " Standard trials: List 1 accuracy", "Reset trials: List 2 accuracy")) %>% 
  ggplot(aes(response_position, acc, color=as.factor(setsize), shape=as.factor(setsize), fill=as.factor(setsize))) +
  stat_summary(geom="point") +
  stat_summary(geom="line") +
  scale_color_discrete('Set size of List 1') +
  scale_fill_discrete('Set size of List 1') +
  scale_shape_manual('Set size of List 1', values=c(21,22,23,24,25, 3)) +
  facet_wrap(~trial_type) +
  xlab('Serial position within list') +
  ylab('Serial Order Reconstruction Accuracy') +
  theme_bw() +
  theme(panel.grid.major = element_blank(),
        panel.grid.minor = element_blank())
ggsave('figures/exp1_acc_by_trial_type_l1setsize_serial_position.svg', width=6.5, height=3, units='in')


dat %>% 
  filter(is.na(practice), trial > 6, trial_type == "full") %>%  # exclude practice and buffer trials
  ggplot(aes(as.factor(response_position+setsize), acc, color=as.factor(setsize), shape=as.factor(setsize), fill=as.factor(setsize), group=as.factor(setsize))) +
  stat_summary(geom="point") +
  stat_summary(geom="line") +
  scale_color_discrete('Set size of List 1') +
  scale_fill_discrete('Set size of List 1') +
  scale_shape_manual('Set size of List 1', values=c(21,22,23,24,25, 3)) +
  xlab('Serial position from begining of the trial') +
  ylab('List 2 Accuracy') +
  theme_bw() +
  theme(panel.grid.major = element_blank(),
        panel.grid.minor = element_blank())
ggsave('figures/exp1_acc_shifted_sp.svg', width=4.5, height=3, units='in')


dat %>% 
  filter(is.na(practice), trial > 6) %>%  # exclude practice and buffer trials
  mutate(abs_resp_pos = ifelse(trial_type == "first", response_position, response_position+setsize)) %>% 
  ggplot(aes(as.factor(abs_resp_pos), acc, color=trial_type, group=trial_type, shape=trial_type)) +
  stat_summary(geom="point") +
  stat_summary(geom="line") +
  xlab('Serial position from begining of the trial') +
  ylab('Accuracy') + 
  scale_color_discrete('', labels=c("List 1 (standard trials)", "List 2 (reset trials)")) +
  scale_shape_discrete('', labels=c("List 1 (standard trials)", "List 2 (reset trials)")) +
  facet_wrap(~setsize) +
  theme_bw() +
  theme(panel.grid.major = element_blank(),
        panel.grid.minor = element_blank(),
        legend.position = "bottom") +
  geom_vline(data=filter(dat, setsize==1), aes(xintercept=1.5), color='darkgrey', linetype="dotdash") +
  geom_vline(data=filter(dat, setsize==2), aes(xintercept=2.5), color='darkgrey', linetype="dotdash") +
  geom_vline(data=filter(dat, setsize==3), aes(xintercept=3.5), color='darkgrey', linetype="dotdash") +
  geom_vline(data=filter(dat, setsize==4), aes(xintercept=4.5), color='darkgrey', linetype="dotdash") +
  geom_vline(data=filter(dat, setsize==5), aes(xintercept=5.5), color='darkgrey', linetype="dotdash") +
  geom_vline(data=filter(dat, setsize==6), aes(xintercept=6.5), color='darkgrey', linetype="dotdash")
ggsave('figures/exp1_acc_abs_sp_both_lists.svg', width=6, height=4, units='in')




#############################################################################!
#                                                                        ####
#############################################################################!

mldat <- dat %>% 
  filter(is.na(practice), trial > 6, trial_type == "full") 


ml0 <- glmer(acc ~ response_position + (setsize+response_position|id)+ (1|correct_response), data=mldat, family="binomial")
ml1 <- glmer(acc ~ response_position + setsize + (setsize+response_position|id)+ (1|correct_response), data=mldat, family="binomial")

anova(ml0, ml1)


bml1 <- brm(acc ~ response_position + (response_position+setsize|id) + (1|correct_response), 
           data=mldat, family=bernoulli(), save_all_pars = TRUE, iter = 2000, cores = 4, chains = 4,
           prior  = set_prior('student_t(3, 0, 2.5)', class = 'b'))

bml2 <- brm(acc ~ response_position + setsize + (setsize+response_position|id) + (1|correct_response), 
           data=mldat, family=bernoulli(), save_all_pars = TRUE, iter = 2000, cores = 4, chains = 4, 
           prior  = set_prior('student_t(3, 0, 2.5)', class = 'b'))



#############################################################################!
#                                                                        ####
#############################################################################!

