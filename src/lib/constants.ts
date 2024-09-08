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