// ~/lib/constants.ts
import type { Exercise } from "~/server/db/types"

export const APP_NAME = "11-11 Coach"
export const SECOND = 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24
export const SETTINGS = {
    upper_pull: 1,
    upper_push: 1,
    lower: 1,
    abs: 1,
    sets: 2,
    rest_duration: 3 * MINUTE,
  };
export const EXERCISES: Omit<Exercise, "id">[] = [
  {"user_id":"","name":"pull-up","variant":"standard","body_part":"upper","type":"pull","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"push-up","variant":"triangle","body_part":"upper","type":"push","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"bulgarian split squat","variant":"","body_part":"lower","type":"","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"v-up","variant":"","body_part":"abs","type":"","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"pull-up","variant":"wide","body_part":"upper","type":"pull","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"push-up","variant":"standard","body_part":"upper","type":"push","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"deadlift","variant":"single-leg","body_part":"lower","type":"","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"heels to the heavens","variant":"","body_part":"abs","type":"","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"push-up","variant":"wide","body_part":"upper","type":"push","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"row","variant":"inverted","body_part":"upper","type":"pull","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"lunge","variant":"standard","body_part":"lower","type":"","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"scissors","variant":"","body_part":"abs","type":"","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"chin-up","variant":"standard","body_part":"upper","type":"pull","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"flat leg raise","variant":"","body_part":"abs","type":"","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"push-up","variant":"pike","body_part":"upper","type":"push","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"hanging leg raise","variant":"","body_part":"abs","type":"","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"chin-up","variant":"wide","body_part":"upper","type":"pull","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"push-up","variant":"clap","body_part":"upper","type":"push","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"push-up","variant":"archer","body_part":"upper","type":"push","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"deadlift","variant":"sumo","body_part":"lower","type":"","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"row","variant":"inverted, face","body_part":"upper","type":"pull","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"squat","variant":"pistol","body_part":"lower","type":"","used":false,"unit":"reps","forced_days":[]},
  {"user_id":"","name":"lunge","variant":"reverse","body_part":"lower","type":"","used":false,"unit":"reps","forced_days":[]}
]
export const LOADING_MESSAGES: string[] = [
  "Shuffling those exercises... time to sweat!",
  "Ready for your unique workout? Let's go!",
  "No repeat routines... ever (well, almost)!",
  "Today's workout: fresh, fierce, and ready!",
  "Breaking the monotony, one shuffle at a time!",
  "No planning, just pure sweat!",
  "New day, new workout... let's crush it!",
  "Workout roulette is spinning... get ready!",
  "Revving up your 11-11 routine!",
  "No same workout twice... because you're too epic!",
  "Unlocking today's challenge... push hard!",
  "Fresh set of moves coming your way!",
  "Shuffle mode activated... time to hustle!",
  "Mixing it up for you... workout magic!",
  "Your fresh workout is loading... bring the heat!",
  "Never a dull workout here!",
  "A new day, a new challenge!",
  "Today's exercises, shuffled and served!",
  "Get ready for something different... again!",
  "We shuffle. You sweat. It's a deal!",
  "Fresh moves incoming... let's get stronger!",
  "No repeats here... only gains!",
  "Your body loves variety, and so do we!",
  "New exercises, same intensity!",
  "11-11 workout unlocked... let's crush it!",
  "Why plan? Let’s just sweat!",
  "Fresh moves, zero planning!",
  "Routine? We don’t know her!",
  "Today's workout: perfectly randomized!",
  "Get ready to push through today’s shuffle!",
  "Feeling lucky? Your workout is!",
  "Unlocking moves you didn’t know"
]