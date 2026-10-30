# Quick Math ➕

A 60 second mental maths game that gets harder as your score goes up.

**Live demo:** https://althafkhan17.github.io/AppsIBuilt/quick-math/

## Why I built this
This is the last app of my one-app-a-day run. I wanted something tiny and fast to finish on day 10, and a timed maths game felt right because the logic is simple but the feel of it matters.

## Features
- 60 second countdown
- Questions get harder every 3 correct answers
- Multiplication unlocks at higher levels
- Best score saved in the browser
- Works offline and on mobile

## Tech stack
- HTML, CSS, vanilla JavaScript
- localStorage for the best score

## What I learned
- **Keeping logic pure:** I kept the question generator separate from the DOM code so I could test it in Node.
- **Subtraction edge case:** swapping a and b when b is bigger avoids negative answers.
- **Timers:** clearing the old interval on restart stops the clock running double speed.
- **Module guard:** checking `typeof document` lets the same file run in the browser and in Node.

## Run it locally
```bash
git clone https://github.com/althafkhan17/AppsIBuilt.git
cd AppsIBuilt/quick-math
# open index.html in your browser
```

## What I want to add next
- [ ] Difficulty choice
- [ ] Division questions
- [ ] Streak bonus
- [ ] Sound effects

by althafkhan17
