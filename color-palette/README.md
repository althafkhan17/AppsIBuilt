# 🎨 Hue Hunt

A colour palette generator where you can lock the colours you like and keep rolling for the rest.

**Live demo:** https://althafkhan17.github.io/AppsIBuilt/color-palette/

## Why I built this

Every time I start a small project I waste time picking colours and end up with the same dark theme. I wanted a quick way to get five colours that actually go together, and keep the ones I like.

## Features

- Analogous, complementary, triadic and fully random modes
- Click a colour to lock it, then generate the rest around it
- Spacebar shortcut to roll a new palette
- Double click a colour to copy its hex code
- Save up to 8 palettes, stored in localStorage
- Text colour flips between black and white so hex codes stay readable
- Works on mobile, the palette stacks vertically

## Tech stack

- Plain HTML, CSS and JavaScript
- localStorage for saved palettes
- No libraries, no build step

## What I learned

- **HSL is way easier to generate from than hex.** Picking a base hue and adding offsets gives palettes that look intentional, then I convert to hex at the end.
- **Writing the HSL to RGB conversion by hand.** I used the standard formula with a helper `f(n)` and it finally clicked how hue maps to the RGB channels.
- **Readable text on any colour.** I compute relative luminance with the sRGB gamma correction and pick black or white from that.
- **Locking needs state kept apart from the DOM.** I keep a `locked` array and re-render, which was simpler than patching elements.
- **Small random jitter matters.** Adding a few degrees of random hue and varying saturation stops palettes looking flat.

## Run it locally

```bash
git clone https://github.com/althafkhan17/AppsIBuilt.git
cd AppsIBuilt/color-palette
# open index.html in your browser
```

## What I want to add next

- [ ] Export palette as CSS variables
- [ ] Generate a palette from an image
- [ ] Contrast ratio checker
- [ ] Shareable links
