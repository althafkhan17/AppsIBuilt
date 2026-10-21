# 💸 Split It

A small expense splitter for trips and dinners with friends. Add who's in, log who paid for what, and it tells you the fewest payments needed to settle everything.

**Live demo:** https://althafkhan17.github.io/AppsIBuilt/expense-splitter/

## Why I built this

After every trip with friends there's that one person (usually me) sitting with a notes app trying to figure out who owes whom. Someone paid for petrol, someone else paid for dinner, two people skipped the movie, and by the end nobody trusts the math. The popular apps work, but everyone has to install them and make an account. I wanted something I could open in a browser, fill in in two minutes, and share the result in the group chat.

## Features

- Add people and expenses, with who paid and who it should be split between
- Split with everyone or just some people (for the two who skipped the movie)
- Live balances: who gets money back and who owes
- "Settle up" list with the fewest payments I could get with a simple algorithm
- Copy a plain-text summary to paste into WhatsApp
- Everything is saved in the browser, so a refresh doesn't wipe the trip
- Works on mobile, no sign-up, no build step

## Tech stack

- HTML5
- CSS3 (custom properties, flexbox)
- Vanilla JavaScript
- `localStorage` for saving the trip
- Clipboard API for the summary

## What I learned

- **Never store money as floats.** My first version did `0.1 + 0.2` style math and showed balances like `-0.0000001`. Now every amount is converted to paise (integers) as soon as it's entered, and only formatted back to rupees when it's shown.
- **Splitting has leftovers.** ₹100 split three ways is 33.33 + 33.33 + 33.33, which is 99.99. I wrote a small `splitEvenly` function that gives the leftover paise to the first few people, so the shares always add up to the exact total and the balances sum to zero.
- **Settling up is a real algorithm problem.** Finding the true minimum number of payments is actually NP-hard. I went with a greedy approach: sort debtors and creditors by amount and keep matching the biggest debtor with the biggest creditor. It's at most n-1 payments, which is more than good enough for a group of friends.
- **Building DOM without `innerHTML`.** People's names go straight into the page, so I wrote a tiny `el()` helper that uses `createElement` and `textContent`. No escaping bugs, and no chance of someone named `<img onerror=...>` breaking things.
- **Clipboard needs a fallback.** `navigator.clipboard.writeText` only works on HTTPS or localhost and needs permission, so if it fails I fall back to a `prompt()` with the text selected. Not pretty, but it always works.

## Run it locally

```bash
git clone https://github.com/althafkhan17/AppsIBuilt.git
cd AppsIBuilt/expense-splitter
# open index.html in your browser
```

## What I want to add next

- [ ] Unequal splits (by amount or percentage)
- [ ] Multiple trips saved side by side
- [ ] Currency picker
- [ ] Share a trip with a link instead of copying text
