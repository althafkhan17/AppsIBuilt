# ✅ Streak Board

A small habit tracker. Add habits, tick them off each day and watch the streak grow. It shows the last 7 days for every habit and remembers everything in the browser.

**Live demo:** https://althafkhan17.github.io/AppsIBuilt/habit-tracker/

## Why I built this

I'm doing one app a day, so a streak tracker felt almost too fitting. I also wanted to practice date handling, because I know "what counts as consecutive days" is where simple apps usually get wrong.

## Features

- Add and remove habits
- One tap to mark today done (tap again to undo)
- Current streak, best streak and total days per habit
- Last 7 days shown as a row of dots
- Data saved in `localStorage`, works offline
- Works on phone screens
- No frameworks, no build step. Just HTML, CSS and vanilla JavaScript

## Tech stack

- HTML5
- CSS3 (grid, custom properties)
- Vanilla JavaScript
- `localStorage`

## What I learned

- **Dates as strings, not timestamps.** I store each day as a `YYYY-MM-DD` string built from local date parts. Using `toISOString()` gave me the UTC date, which is the wrong day late at night in my timezone.
- **Stepping days safely.** Adding 24 hours of milliseconds breaks around daylight saving changes, so I use `setDate(getDate() + n)` to move between days.
- **Streak that doesn't punish you early.** If today isn't ticked yet, the streak starts counting from yesterday, so it doesn't show 0 every morning.
- **Keeping logic separate.** The streak functions live in `logic.js` with no DOM code, so I could test them in Node with `node -e` before wiring up the UI.
- **Avoiding innerHTML.** Habit names are user input, so I build the elements with `createElement` and `textContent`.

## Run it locally

```bash
git clone https://github.com/althafkhan17/AppsIBuilt.git
cd AppsIBuilt/habit-tracker
# open index.html in your browser
```

## What I want to add next

- [ ] Tap any past day to fix a missed tick
- [ ] Weekly goals (e.g. 4 times a week)
- [ ] Export and import data as JSON
- [ ] A month calendar view
