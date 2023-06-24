library(tidyverse)
library(brms)
library(lme4)

#############################################################################!
# DATA preprocessing                                                      ####
#############################################################################!

# load('output/exp1.RData')
dat <- read.csv('data/exp2/preproc_data.csv')

# total number of participants 
dat$id %>% unique() %>% length()

# participants who said they used help or said not to analyze their data
dat %>% 
  select(id, use_help, analyze_data) %>% 
  unique() %>% 
  count(use_help, analyze_data)

# exclude participants who used help or said not to analyze their data
dat <- filter(dat, use_help == "No", analyze_data == "Yes", sender == "Reconstruction")


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

# remove two extremely poorly performing participants
dat <- filter(dat, list1_overall_acc > 0.25)

# final number of participants
dat$id %>% unique() %>% length()


#############################################################################!
# PLOTS                                                                  ####
#############################################################################!




# accuracy as a function of setsize
dat %>% 
  filter(trial > 6) %>%  # exclude practice and buffer trials
  ggplot(aes(setsize, acc)) +
  stat_summary(geom="pointrange") +
  stat_summary(geom="line") +
  facet_wrap(~trial_type) +
  theme_classic() +
  scale_x_continuous('Set size of Part 1')


# accuracy as a function of response_position and setsize
dat %>% 
  filter(trial > 6) %>%  # exclude practice and buffer trials
  mutate(trial_type = ifelse(trial_type == "first", " Standard trials: List 1 accuracy", "Reset trials: List 2 accuracy")) %>% 
  ggplot(aes(input_position, acc, color=as.factor(setsize), shape=as.factor(setsize), fill=as.factor(setsize))) +
  stat_summary(geom="point") +
  stat_summary(geom="line") +
  scale_color_discrete('Set size of List 1') +
  scale_fill_discrete('Set size of List 1') +
  scale_shape_manual('Set size of List 1', values=c(21,22,23,24,25, 3)) +
  facet_wrap(~trial_type) +
  xlab('Serial position within list') +
  ylab('Probed Recall Accuracy') +
  theme_bw() +
  theme(panel.grid.major = element_blank(),
        panel.grid.minor = element_blank())
ggsave('figures/exp2_acc_by_trial_type_l1setsize_serial_position.svg', width=6.5, height=3, units='in')

dat %>% 
  filter(trial > 6, trial_type == "full") %>%  # exclude practice and buffer trials
  mutate(trial_type = ifelse(trial_type == "first", " Standard trials: List 1 accuracy", "Reset trials: List 2 accuracy")) %>% 
  ggplot(aes(input_position, acc, color=as.factor(response_position), shape=as.factor(response_position), fill=as.factor(response_position))) +
  stat_summary(geom="point") +
  stat_summary(geom="line") +
  scale_color_discrete('Output position') +
  scale_fill_discrete('Output position') +
  scale_shape_manual('Output position', values=c(21,22,23,24,25, 3)) +
  facet_wrap(~trial_type) +
  xlab('Input serial position within list') +
  ylab('Probed Recall Accuracy') +
  theme_bw() +
  theme(panel.grid.major = element_blank(),
        panel.grid.minor = element_blank())
ggsave('figures/exp2_input_vs_output_position.svg', width=4.5, height=3, units='in')


dat %>% 
  filter(trial > 6, trial_type == "full") %>%  # exclude practice and buffer trials
  ggplot(aes(as.factor(input_position+setsize), acc, color=as.factor(setsize), shape=as.factor(setsize), fill=as.factor(setsize), group=as.factor(setsize))) +
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
ggsave('figures/exp2_acc_shifted_sp.svg', width=4.5, height=3, units='in')


dat %>% 
  filter(trial > 6) %>%  # exclude practice and buffer trials
  mutate(abs_resp_pos = ifelse(trial_type == "first", input_position, input_position+setsize)) %>% 
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
  geom_vline(data=filter(dat, setsize==5), aes(xintercept=5.5), color='darkgrey', linetype="dotdash")
ggsave('figures/exp2_acc_abs_sp_both_lists.svg', width=6, height=4, units='in')




#############################################################################!
#                                                                        ####
#############################################################################!

mldat <- dat %>% 
  filter(trial > 6, trial_type == "full") 


ml0 <- glmer(acc ~ input_position + response_position + (setsize+input_position|id)+ (1|correct_response), data=mldat, family="binomial")
ml1 <- glmer(acc ~ input_position + setsize + response_position + (setsize+input_position|id)+ (1|correct_response), data=mldat, family="binomial")

anova(ml0, ml1)


bml1 <- brm(acc ~ response_position + (response_position+setsize|id) + (1|correct_response), 
            data=mldat, family=bernoulli(), save_all_pars = TRUE, iter = 5000, cores = 3, chains = 3)

bml2 <- brm(acc ~ response_position + setsize + (setsize+response_position|id) + (1|correct_response), 
            data=mldat, family=bernoulli(), save_all_pars = TRUE, iter = 5000, cores = 3, chains = 3, 
            prior  = set_prior('student_t(3, 0, 2.5)', class = 'b'))



#############################################################################!
#                                                                        ####
#############################################################################!
