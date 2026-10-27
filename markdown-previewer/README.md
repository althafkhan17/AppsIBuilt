# 📝 Mark Down

A tiny markdown previewer. You type on the left, the formatted result shows on the right as you type.

**Live demo:** https://althafkhan17.github.io/AppsIBuilt/markdown-previewer/

## Why I built this

I write notes and READMEs in markdown all the time and I was always pushing a commit just to see how it looked. I wanted a quick scratchpad that works offline and doesn't need an account. I also wanted to see how hard a markdown parser really is without using a library.

## Features

- Live preview while typing
- Headings, bold, italic, inline code, code blocks, quotes, links and lists
- Word count
- Your text is saved in the browser, so it's still there when you come back
- Side by side on desktop, stacked on mobile
- No frameworks, no build step

## Tech stack

- HTML5
- CSS3 (grid, media query)
- Vanilla JavaScript
- `localStorage` for saving the text

## What I learned

- **Escape first, format after.** I run every line through an HTML escape function before turning markdown into tags. Otherwise typing `<script>` into the box would actually run it when I set `innerHTML`.
- **Parsing line by line with a little state.** The parser only needs to remember whether it is inside a code block or a list. Once I thought of it as a small state machine, it got much easier than regex on the whole text.
- **Order of regex matters.** Inline code has to be handled before bold and italic, or `*` inside code gets turned into tags.
- **Paragraphs are just joined lines.** Consecutive lines go into a buffer and become one `<p>` when a blank line or another block shows up.
- **Making code testable in Node.** I export `render()` with a `typeof module` check, so I can test the parser in the terminal without opening a browser.

## Run it locally

```bash
git clone https://github.com/althafkhan17/AppsIBuilt.git
cd AppsIBuilt/markdown-previewer
# open index.html in your browser
```

## What I want to add next

- [ ] Tables
- [ ] Nested lists
- [ ] Download as .md or .html
- [ ] Synced scrolling between the two panes
