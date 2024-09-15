# NextJs Template

This starts with [create t3-app](https://create.t3.gg/) and adds boilerplate for the dependencies if necessary.

## To-do List

### p2

- UX: exercises can be moved around using drag and drop on `/workout`

### p1

- UI: we have a new logo!
- UI: we have a new color scheme!
- added: the tidbits of advice are now randomized on the `/workout/complete` page

### p0

- added: dashboard page has a calendar of days worked out and a current streak, only being broken by days not in the days off setting
- bug: the auth button no longer flashes
- added: settings now has a days off, where the user can set days they do not workout, so that their streaks are not affected

## Change Log

2024/09/16

- fixed: exercises are now marked as used correctly
- added: dashboard now has a basic page

2024/09/08

- UX: adding loading.tsx to all (user_logged_in) subdirectories
- UX: added suspense to all (user_logged_in) subdirectories
- refactored everything to use tanstack query
- fixed: exercises that are required on certain days are now shuffled into the routine correctly
- UX: exercises page is no longer reloaded when deleting an exercise
- UX: exercise page is no longer reloaded when creating a new exercise
- fixed: can now edit exercises
- fixed: can now delete an exercise
- optimized: rendering of `workout` no longer has the strange content shift
- fixed: hitting done on a stopwatch exercise now adds the time to the field in the set

2024/07/28

- backend: the previous weight and reps now loads on a per-set basis, i.e. if set 1 had 0x12, but set 2 had 0x10, that would load correctly in the PREVIOUS column
- fixed: add set button now functions for exercises that have previous data displayed
- added: a sound now plays when the res timer ends and a short beep on 3, 2, and 1 second remaining

2024/07/27

- UI: updated the exercises table to account for the two new columns: unit and forced_days
- UX: when clicking into stopwatch inputs, a stopwatch is started in a `Drawer.tsx` which has a stop button that automatically sets the time when clicked in the appropriate input
- UX: when completing a set in the last exercise of the routine, the rest timer starts automatically in a `Drawer.tsx`
- feature: can set an exercise to always be included, or only include on certain days you generate a routine
- backend: added the unit and forced_days columns in preparation for supporting stopwatch or timer exercises and exercises that are forcibly added to the workout as an extra exercise.
- backend: filtered out exercises that are forced when randomly picking exercises

2024/07/25

- optimized: `MainNav` no longer has the weird content shift. Set `UserAndTheme.tsx` to have a min-w-24
- meta: updated the site description
- meta: updated the site title
- meta: updated the favicon

2024/07/21

MILESTONE: MVP Released!

- added: a basic workout-complete page
- added: workouts are now saved to the db
- added: exercises that have been used are no longer considered for the new routine until all exercises have been used
- added: theme button and user button are no displayed on the mobile nav
- added: on `/workout`, when the checkbox is checked, the row's bg color changes
- UI: updated `/workout` a little bit

2024/07/20

- added: updated main nav with appropriate links
- added: user can create an exercise
- added: user can delete exercises
- added: settings page is done
