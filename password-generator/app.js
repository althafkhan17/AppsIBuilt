const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?'
};
const AMBIGUOUS = /[O0lI1]/g;

function randInt(max) {
  // rejection sampling so there is no modulo bias
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
  return buf[0] % max;
}

function buildPools(opts) {
  return Object.keys(SETS)
    .filter(k => opts[k])
    .map(k => opts.ambig ? SETS[k].replace(AMBIGUOUS, '') : SETS[k]);
}

function generate(length, opts) {
  const pools = buildPools(opts);
  if (!pools.length) return '';
  const all = pools.join('');
  const chars = pools.map(p => p[randInt(p.length)]); // one from each chosen set
  while (chars.length < length) chars.push(all[randInt(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) { // Fisher-Yates shuffle
    const j = randInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.slice(0, length).join('');
}

function entropyBits(length, opts) {
  const size = buildPools(opts).join('').length;
  return size ? length * Math.log2(size) : 0;
}

function label(bits) {
  if (bits < 40) return ['Weak', '#ff6b6b', 25];
  if (bits < 60) return ['Okay', '#ffb84d', 50];
  if (bits < 90) return ['Strong', '#3ecf8e', 80];
  return ['Very strong', '#3ecf8e', 100];
}

if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  const ids = ['lower', 'upper', 'digits', 'symbols', 'ambig'];
  const opts = () => Object.fromEntries(ids.map(i => [i, $(i).checked]));

  function render() {
    const length = +$('len').value;
    $('lenVal').textContent = length;
    const o = opts();
    const pw = generate(length, o);
    $('pw').textContent = pw || 'Pick at least one option';
    const bits = entropyBits(length, o);
    const [text, color, pct] = label(bits);
    $('bar').style.width = pw ? pct + '%' : '0';
    $('bar').style.background = color;
    $('strength').textContent = pw ? text + ' (about ' + Math.round(bits) + ' bits)' : '';
    localStorage.setItem('locksmith', JSON.stringify({ length, ...o }));
  }

  try {
    const s = JSON.parse(localStorage.getItem('locksmith'));
    if (s) { $('len').value = s.length; ids.forEach(i => $(i).checked = !!s[i]); }
  } catch (e) {}

  $('gen').onclick = render;
  $('len').oninput = render;
  ids.forEach(i => $(i).onchange = render);
  $('copy').onclick = async () => {
    const t = $('pw').textContent;
    try { await navigator.clipboard.writeText(t); $('copy').textContent = 'Copied!'; }
    catch (e) { $('copy').textContent = 'Press Ctrl+C'; }
    setTimeout(() => $('copy').textContent = 'Copy', 1200);
  };
  render();
} else {
  module.exports = { generate, entropyBits };
}
