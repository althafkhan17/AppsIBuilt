const SENTENCES = [
  "The quick brown fox jumps over the lazy dog while the rain keeps falling outside.",
  "Good code is easy to read, easy to change and easy to delete when it is no longer needed.",
  "A small project that you finish is worth more than a big idea that stays in your notes.",
  "Take a deep breath, sip some chai and fix the bug one step at a time.",
  "Every expert was once a beginner who refused to stop practicing every single day.",
  "Shipping something small every day builds a habit that no tutorial can give you."
];
const DURATION = 30;

function calcStats(target, typed, elapsedSec) {
  let correct = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) correct++;
  const minutes = Math.max(elapsedSec, 1) / 60;
  return {
    wpm: Math.round((correct / 5) / minutes),
    accuracy: typed.length ? Math.round((correct / typed.length) * 100) : 100
  };
}

if (typeof document !== "undefined") {
  const $ = id => document.getElementById(id);
  let target = "", startTime = null, timer = null, done = false, totalCorrect = 0, totalTyped = 0;

  function newText() {
    target = "";
    while (target.length < 200) target += (target ? " " : "") + SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
  }

  function renderText(typed) {
    const box = $("text");
    box.textContent = "";
    for (let i = 0; i < target.length; i++) {
      const s = document.createElement("span");
      s.textContent = target[i];
      if (i < typed.length) s.className = typed[i] === target[i] ? "ok" : "bad";
      else if (i === typed.length) s.className = "cur";
      box.appendChild(s);
    }
  }

  function elapsed() { return startTime ? (Date.now() - startTime) / 1000 : 0; }

  function update() {
    const typed = $("input").value;
    const st = calcStats(target, typed, elapsed());
    $("wpm").textContent = st.wpm;
    $("acc").textContent = st.accuracy;
    $("time").textContent = Math.max(0, Math.ceil(DURATION - elapsed()));
  }

  function finish() {
    done = true;
    clearInterval(timer);
    $("input").disabled = true;
    const typed = $("input").value;
    const st = calcStats(target, typed, DURATION);
    $("wpm").textContent = st.wpm;
    $("acc").textContent = st.accuracy;
    $("time").textContent = 0;
    const best = Math.max(st.wpm, Number(localStorage.getItem("typefast-best") || 0));
    localStorage.setItem("typefast-best", best);
    $("best").textContent = best;
    $("result-text").textContent = "You typed at " + st.wpm + " wpm with " + st.accuracy + "% accuracy.";
    $("result").hidden = false;
  }

  function reset() {
    clearInterval(timer);
    startTime = null; done = false;
    newText();
    const inp = $("input");
    inp.disabled = false; inp.value = ""; inp.focus();
    $("result").hidden = true;
    $("wpm").textContent = 0; $("acc").textContent = 100; $("time").textContent = DURATION;
    $("best").textContent = localStorage.getItem("typefast-best") || 0;
    renderText("");
  }

  $("input").addEventListener("input", () => {
    if (done) return;
    if (!startTime) {
      startTime = Date.now();
      timer = setInterval(() => { update(); if (elapsed() >= DURATION) finish(); }, 200);
    }
    let v = $("input").value;
    if (v.length >= target.length) { v = v.slice(0, target.length); $("input").value = v; }
    renderText(v);
    update();
  });
  $("restart").addEventListener("click", reset);
  reset();
}
if (typeof module !== "undefined") module.exports = { calcStats };
