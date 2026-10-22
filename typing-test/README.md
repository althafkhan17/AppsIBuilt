# ⌨️ Type Fast

A 30 second typing speed test. It gives you a random bit of text, colours each letter as you type, and shows your WPM and accuracy live.

**Live demo:** https://althafkhan17.github.io/AppsIBuilt/typing-test/

## Why I built this

I write code all day, but I never actually knew how fast I type. Most typing test sites are full of ads and popups, and some want you to make an account to see your score. I wanted a clean page that just starts when I start typing, so I built my own.

## Features

- 30 second timer that only starts on your first keystroke
- Each letter turns white if correct and red if wrong, with a cursor on the next one
- Live WPM and accuracy while you type
- Random text from a small list of sentences every round
- Remembers my best WPM
- Works on mobile and offline, no frameworks, no build step

## Tech stack

- HTML5
- CSS3 (flexbox, CSS variables)
- Vanilla JavaScript
- `localStorage` for the best score

## What I learned

- **How WPM is actually measured.** The standard is one "word" equals 5 characters, so WPM is correct characters divided by 5, divided by minutes. That is fairer than counting spaces because long and short words count the same.
- **Accuracy and speed are separate numbers.** I only count correctly typed characters for WPM, so mashing the keyboard doesn't give a high score. Accuracy is correct characters divided by everything typed.
- **Don't trust `setInterval` for time.** I save `Date.now()` on the first keystroke and calculate elapsed time from it on every tick, so the timer stays correct even if the tab lags.
- **Rendering one span per letter.** It was easy to colour each character this way, but I had to build the spans with `createElement` and `textContent` on every keystroke. Fine for 200 characters, but I'd need something smarter for long texts.
- **Keeping logic out of the DOM.** `calcStats` is a plain function with no DOM access, so I could test it quickly in Node before wiring up the page.

## Run it locally

```bash
git clone https://github.com/althafkhan17/AppsIBuilt.git
cd AppsIBuilt/typing-test
# open index.html in your browser
```

## What I want to add next

- [ ] Choose 15, 30 or 60 second rounds
- [ ] Punctuation and numbers mode
- [ ] Show a history of my last 10 scores
- [ ] Highlight the keys I miss most
