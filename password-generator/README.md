# 🔐 Lock Smith

A small password generator that runs fully in the browser. Pick a length and character types, get a strong password, copy it.

**Live demo:** https://althafkhan17.github.io/AppsIBuilt/password-generator/

## Why I built this

I was reusing the same two or three passwords for small accounts because making a new one felt like a chore. Most generator sites are cluttered, and I don't love typing a password into a random website that might log it. So I made one where nothing leaves my machine.

## Features

- Length from 6 to 48 characters
- Toggle lowercase, uppercase, numbers and symbols
- Option to skip look-alike characters like O, 0, l, 1 and I
- Strength meter based on estimated entropy in bits
- One-click copy
- Remembers my last settings

## Tech stack

- HTML5
- CSS3 (flexbox, custom properties)
- Vanilla JavaScript
- Web Crypto API for randomness
- `localStorage` for settings

## What I learned

- **`Math.random()` is not for passwords.** It isn't cryptographically secure, so I used `crypto.getRandomValues()` instead.
- **Modulo bias is real.** Doing `random % length` slightly favours some characters when the range doesn't divide evenly. I used rejection sampling: throw away values above the largest even multiple and draw again.
- **Guaranteeing every chosen type shows up.** Pure random can give a password with no symbol even when symbols are ticked. I pick one character from each selected set first, fill the rest randomly, then shuffle with Fisher-Yates so the first characters aren't predictable.
- **Entropy is simple maths.** Bits = length x log2(pool size). It's a rough guide, but it makes the strength meter honest instead of just counting characters.
- **Making code testable without a framework.** I export the pure functions with a `typeof document` check, so I can test them in Node without a browser.

## Run it locally

```bash
git clone https://github.com/althafkhan17/AppsIBuilt.git
cd AppsIBuilt/password-generator
# open index.html in your browser
```

## What I want to add next

- [ ] Passphrase mode with random words
- [ ] Check against common leaked passwords
- [ ] Keyboard shortcut to regenerate
- [ ] Save a short history in the session
