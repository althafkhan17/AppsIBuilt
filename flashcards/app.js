const DEFAULTS = [
  { q: 'What does DOM stand for?', a: 'Document Object Model', s: 0 },
  { q: 'Which array method returns a new array of items that pass a test?', a: 'filter()', s: 0 },
  { q: 'What does CSS specificity rank highest?', a: 'Inline styles, then IDs, classes, elements', s: 0 },
  { q: 'What is a closure?', a: 'A function that remembers variables from where it was created', s: 0 }
];

function load() {
  try { const d = JSON.parse(localStorage.getItem('flipdeck')); if (Array.isArray(d) && d.length) return d; } catch (e) {}
  return DEFAULTS.map(c => ({ ...c }));
}

// pick the next card, weighting low scores higher so missed cards come back more
function pickNext(cards, current) {
  if (cards.length < 2) return 0;
  const weights = cards.map((c, i) => i === current ? 0 : 1 / (1 + Math.max(0, c.s)));
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r <= 0) return i; }
  return 0;
}

if (typeof module !== 'undefined') module.exports = { pickNext };

if (typeof document !== 'undefined') {
  let cards = load(), cur = 0, flipped = false;
  const $ = id => document.getElementById(id);
  const save = () => localStorage.setItem('flipdeck', JSON.stringify(cards));

  function show() {
    const c = cards[cur];
    $('face').textContent = flipped ? c.a : c.q;
    $('card').classList.toggle('flipped', flipped);
    const mastered = cards.filter(x => x.s >= 2).length;
    $('progress').textContent = mastered + ' / ' + cards.length + ' learned';
    const list = $('list');
    list.textContent = '';
    cards.forEach((x, i) => {
      const li = document.createElement('li');
      const t = document.createElement('span');
      t.textContent = x.q + ' ';
      const sm = document.createElement('small');
      sm.textContent = 'score ' + x.s;
      t.appendChild(sm);
      const del = document.createElement('button');
      del.textContent = '×';
      del.setAttribute('aria-label', 'Remove card');
      del.onclick = () => {
        if (cards.length < 2) return;
        cards.splice(i, 1);
        cur = 0; flipped = false; save(); show();
      };
      li.append(t, del);
      list.appendChild(li);
    });
  }

  function mark(delta) {
    cards[cur].s += delta;
    save();
    cur = pickNext(cards, cur);
    flipped = false;
    show();
  }

  $('card').onclick = () => { flipped = !flipped; show(); };
  $('right').onclick = () => mark(1);
  $('wrong').onclick = () => mark(-1);
  $('shuffle').onclick = () => { cur = Math.floor(Math.random() * cards.length); flipped = false; show(); };
  $('reset').onclick = () => { cards.forEach(c => c.s = 0); save(); show(); };
  $('form').onsubmit = e => {
    e.preventDefault();
    cards.push({ q: $('q').value.trim(), a: $('a').value.trim(), s: 0 });
    e.target.reset(); save(); show();
  };
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === ' ') { e.preventDefault(); flipped = !flipped; show(); }
    if (e.key === 'ArrowRight') mark(1);
    if (e.key === 'ArrowLeft') mark(-1);
  });
  show();
}
