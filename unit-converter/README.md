# 🔄 Unit Swap

A small unit converter for the conversions I actually need: length, weight, volume, time and temperature. Type a number, pick two units, done.

**Live demo:** https://althafkhan17.github.io/AppsIBuilt/unit-converter/

## Why I built this

I was following a recipe that used cups and ounces and kept googling every conversion, and every result page was full of ads. I wanted one tiny page that works offline and remembers what I last converted.

## Features

- Five categories: Length, Weight, Volume, Time and Temperature
- Converts live as I type
- Swap button to flip the two units
- Remembers the last category and my 5 most recent conversions
- Works on my phone, no build step

## Tech stack

- HTML5
- CSS3 (flexbox, dark card layout)
- Vanilla JavaScript
- `localStorage` for category and history

## What I learned

- **Base units keep it simple.** Instead of writing every pair of conversions, I store each unit's factor relative to one base unit (metres, kilograms) and convert via the base. That's N factors instead of N×N formulas.
- **Temperature doesn't fit that model.** Celsius to Fahrenheit has an offset, not just a multiplier, so it needed its own function that goes through Celsius.
- **Floating point looks ugly.** 0.1 + 0.2 style noise showed up in results, so I format with `toPrecision(8)` and then `Number()` to strip trailing zeros.
- **Keeping logic testable.** I guard the DOM code with `typeof document` so I can `require` the convert function in Node and test it quickly.

## Run it locally

```bash
git clone https://github.com/althafkhan17/AppsIBuilt.git
cd AppsIBuilt/unit-converter
# open index.html in your browser
```

## What I want to add next

- [ ] Currency with a cached offline rate table
- [ ] Copy result button
- [ ] Speed and data size categories
- [ ] Keyboard shortcut for swap
