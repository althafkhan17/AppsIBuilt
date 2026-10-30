function makeQuestion(level) {
  const max = 10 + level * 5;
  const ops = level > 3 ? ['+', '-', '×'] : ['+', '-'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = 1 + Math.floor(Math.random() * max);
  let b = 1 + Math.floor(Math.random() * (op === '×' ? 12 : max));
  if (op === '-' && b > a) [a, b] = [b, a];
  const ans = op === '+' ? a + b : op === '-' ? a - b : a * b;
  return { text: a + ' ' + op + ' ' + b, ans };
}
if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  let time, score, current, timer, running = false;
  let best = Number(localStorage.getItem('quickmath-best')) || 0;
  $('best').textContent = best;
  function next() { current = makeQuestion(Math.floor(score / 3)); $('question').textContent = current.text + ' = ?'; }
  function start() {
    time = 60; score = 0; running = true;
    $('time').textContent = time; $('score').textContent = 0; $('msg').textContent = '';
    $('answer').disabled = false; $('answer').value = ''; $('answer').focus();
    $('start').textContent = 'Restart'; next();
    clearInterval(timer);
    timer = setInterval(() => { time--; $('time').textContent = time; if (time <= 0) end(); }, 1000);
  }
  function end() {
    clearInterval(timer); running = false; $('answer').disabled = true;
    $('question').textContent = 'Time up!';
    const m = $('msg');
    if (score > best) { best = score; localStorage.setItem('quickmath-best', best); $('best').textContent = best; m.textContent = 'New best: ' + score; m.className = 'msg good'; }
    else { m.textContent = 'You solved ' + score; m.className = 'msg'; }
  }
  $('start').addEventListener('click', start);
  $('form').addEventListener('submit', e => {
    e.preventDefault();
    if (!running || $('answer').value === '') return;
    if (Number($('answer').value) === current.ans) { score++; $('score').textContent = score; $('msg').textContent = ''; }
    else { $('msg').textContent = 'Nope, it was ' + current.ans; $('msg').className = 'msg bad'; }
    $('answer').value = ''; next();
  });
}
if (typeof module !== 'undefined') module.exports = { makeQuestion };
