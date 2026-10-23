# 🧠 Memory Match

A simple card matching game. Flip two cards, if they match they stay open, if not they flip back. It counts your moves and time and remembers your best score.

**Live demo:** https://althafkhan17.github.io/AppsIBuilt/memory-match/

## Why I built this

I wanted to try a small game after a few utility apps. A memory game looked easy, but I knew the click handling and the flip animation would have some annoying edge cases, and I wanted to deal with those myself.

## Features

- Two board sizes: 4 x 4 and 4 x 6
- Cards flip with a CSS 3D animation
- Move counter and a timer that starts on the first flip
- Best score saved separately for each board size
- Works on phone screens
- No frameworks, no build step. Just HTML, CSS and vanilla JavaScript

## Tech stack

- HTML5
- CSS3 (grid, 3D transforms, `aspect-ratio`)
- Vanilla JavaScript
- `localStorage` for best scores

## What I learned

- **Shuffling properly.** My first idea was `sort(() => Math.random() - 0.5)`, but that gives a biased shuffle. I switched to Fisher-Yates, which is only a few lines and is actually uniform.
- **Locking input while cards flip back.** If you click a third card during the 800 ms delay, the state gets messy. A simple `lock` flag that ignores clicks until the mismatch is cleared fixed it.
- **CSS card flip.** Each card has a front and back face with `backface-visibility: hidden`, and I rotate the inner wrapper 180 degrees. The back face needs to be pre-rotated or it shows mirrored.
- **Keeping the timer honest.** I start it on the first flip and compute elapsed time from `Date.now()` instead of adding one every tick, so it doesn't drift.
- **Using buttons for cards.** I used `<button>` instead of `<div>` so the cards are keyboard focusable for free.

## Run it locally

```bash
git clone https://github.com/althafkhan17/AppsIBuilt.git
cd AppsIBuilt/memory-match
# open index.html in your browser
```

## What I want to add next

- [ ] A hard 6 x 6 mode
- [ ] Sound on match
- [ ] Dark/light theme toggle
- [ ] Keyboard arrow navigation between cards
