# ☕ Chai Timer

A small Pomodoro-style focus timer I built for myself. 25 minutes of work, then a chai break. The cup on the screen slowly empties while the timer runs, which is weirdly motivating.

**Live demo:** https://althafkhan17.github.io/AppsIBuilt/chai-timer/

## Why I built this

I kept losing track of time while coding and would look up two hours later with a headache and cold chai. I tried a few Pomodoro apps, but most of them had too many settings, ads, or wanted me to sign up. I just wanted something simple that opens in a browser tab, so I made one.

## Features

- Three modes: Focus (25 min), Chai Break (5 min) and Long Break (15 min)
- A chai cup that drains as the timer counts down
- Remaining time shows in the browser tab title, so I can see it from other tabs
- Counts how many focus sessions I finished today (resets every day)
- Short beep when a session ends
- No frameworks, no build step. Just HTML, CSS and vanilla JavaScript

## Tech stack

- HTML5
- CSS3 (flexbox, gradients, `backdrop-filter` for the glass card)
- Vanilla JavaScript
- `localStorage` for the daily session count
- Web Audio API for the beep

## What I learned

- **`setInterval` isn't perfectly accurate.** Browsers throttle timers in background tabs, so for a timer that has to be exact, it's better to store the end time and calculate the remaining time from `Date.now()`. My version is fine for Pomodoro, but this is the next thing I want to fix.
- **Web Audio API basics.** I didn't want to add an mp3 file just for one beep, so I generated the sound with an `OscillatorNode`. I also learned browsers block audio until the user interacts with the page, which is why the sound only works after you press Start.
- **Saving per-day data in localStorage.** I store the date together with the count, and if the saved date isn't today, the counter resets. Simple, but it took me a minute to think about it.
- **Drawing with plain CSS.** The cup and handle are just a div with borders and a `::after` pseudo-element. The fill is a div whose height I update from JavaScript, with a CSS transition to keep it smooth.
- **Keeping the state simple.** Mode, remaining seconds and the interval id are the only state. Every button just changes one of these and calls `render()`. That made the bugs much easier to find.

## Run it locally

```bash
git clone https://github.com/althafkhan17/AppsIBuilt.git
cd AppsIBuilt/chai-timer
# open index.html in your browser
```

## What I want to add next

- [ ] Fix timer drift by using timestamps instead of counting ticks
- [ ] Custom durations
- [ ] Browser notifications when a session ends
- [ ] Weekly stats
