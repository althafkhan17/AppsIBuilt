# 🃏 Flip Deck

A simple flashcard app. Flip the card, mark if you got it, and the cards you miss show up more often.

**Live demo:** https://althafkhan17.github.io/AppsIBuilt/flashcards/

## Why I built this

I keep forgetting small things like array methods and CSS rules, and I didn't want to set up a big app just to make a few cards. I wanted something I can open in a second, add a card to, and use on my phone. I also wanted to try a simple version of spaced repetition.

## Features

- Tap the card to flip between question and answer
- "Got it" and "Missed it" buttons, plus keyboard shortcuts
- Cards you miss come up more often
- Add and remove your own cards
- Progress counter of learned cards
- Saved in the browser, works offline

## Tech stack

- HTML5
- CSS3 (flexbox)
- Vanilla JavaScript
- `localStorage` for the deck and scores

## What I learned

- **Weighted random picking.** Each card gets a weight of `1 / (1 + score)`. I subtract a random number from the total weight until it goes below zero, and that card is the next one. Low scores get picked more.
- **Never show the same card twice.** The current card gets weight 0, otherwise a missed card could repeat right away.
- **Build DOM with textContent.** Since users type their own cards, I avoided `innerHTML` so nothing typed can turn into markup.
- **Keyboard events and inputs.** Space was flipping the card even while typing in the form. I had to check `e.target.tagName` first.
- **Testing without a browser.** I export `pickNext()` with a `typeof module` check so I can test it in Node.

## Run it locally

```bash
git clone https://github.com/althafkhan17/AppsIBuilt.git
cd AppsIBuilt/flashcards
# open index.html in your browser
```

## What I want to add next

- [ ] Multiple decks
- [ ] Import and export as JSON
- [ ] Real spaced repetition intervals
- [ ] Card flip animation
