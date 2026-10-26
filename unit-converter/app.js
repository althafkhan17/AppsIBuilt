const CATS = {
  Length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mile: 1609.344, yard: 0.9144, foot: 0.3048, inch: 0.0254 },
  Weight: { kg: 1, g: 0.001, mg: 1e-6, lb: 0.45359237, oz: 0.028349523125, tola: 0.01166 },
  Volume: { L: 1, mL: 0.001, 'cup (US)': 0.2365882365, 'gallon (US)': 3.785411784, 'fl oz (US)': 0.0295735296 },
  Time: { sec: 1, min: 60, hour: 3600, day: 86400, week: 604800 },
  Temperature: { C: 'C', F: 'F', K: 'K' }
};
function convert(cat, v, from, to) {
  if (cat === 'Temperature') {
    let c = from === 'C' ? v : from === 'F' ? (v - 32) * 5 / 9 : v - 273.15;
    return to === 'C' ? c : to === 'F' ? c * 9 / 5 + 32 : c + 273.15;
  }
  return v * CATS[cat][from] / CATS[cat][to];
}
function fmt(n) { return Number(n.toPrecision(8)).toString(); }
if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  let cat = localStorage.getItem('us-cat') || 'Length';
  let history = JSON.parse(localStorage.getItem('us-hist') || '[]');
  function fill() {
    for (const s of [$('from'), $('to')]) {
      s.textContent = '';
      Object.keys(CATS[cat]).forEach(u => { const o = document.createElement('option'); o.value = o.textContent = u; s.appendChild(o); });
    }
    $('to').selectedIndex = 1;
    $('tabs').textContent = '';
    Object.keys(CATS).forEach(c => {
      const b = document.createElement('button'); b.textContent = c; if (c === cat) b.className = 'on';
      b.onclick = () => { cat = c; localStorage.setItem('us-cat', c); fill(); update(); };
      $('tabs').appendChild(b);
    });
  }
  function update() {
    const v = parseFloat($('val').value);
    if (isNaN(v)) { $('result').textContent = '—'; return; }
    $('result').textContent = fmt(convert(cat, v, $('from').value, $('to').value)) + ' ' + $('to').value;
  }
  function save() {
    const v = parseFloat($('val').value); if (isNaN(v)) return;
    const line = v + ' ' + $('from').value + ' = ' + $('result').textContent;
    history = [line, ...history.filter(h => h !== line)].slice(0, 5);
    localStorage.setItem('us-hist', JSON.stringify(history)); draw();
  }
  function draw() {
    $('history').textContent = '';
    history.forEach(h => { const li = document.createElement('li'); li.textContent = h; $('history').appendChild(li); });
  }
  ['input', 'change'].forEach(e => { $('val').addEventListener(e, update); $('from').addEventListener(e, update); $('to').addEventListener(e, update); });
  $('val').addEventListener('change', save);
  $('swap').onclick = () => { const f = $('from').value; $('from').value = $('to').value; $('to').value = f; update(); save(); };
  fill(); update(); draw();
} else module.exports = { convert, CATS };
