const SYMBOLS = ["🍎","🚀","🎧","🌵","🐙","⚡","🎲","🍕","🌙","🔥","🎈","🐢"];
const board = document.getElementById("board");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const bestEl = document.getElementById("best");
const msgEl = document.getElementById("msg");
const sizeEl = document.getElementById("size");

let first = null, lock = false, moves = 0, matched = 0, pairs = 8;
let startTime = 0, timer = null;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function bestKey() { return "memory-match-best-" + pairs; }

function loadBest() {
  const b = localStorage.getItem(bestKey());
  bestEl.textContent = b ? b : "-";
}

function stopTimer() { clearInterval(timer); timer = null; }

function startTimer() {
  startTime = Date.now();
  timer = setInterval(() => {
    timeEl.textContent = Math.floor((Date.now() - startTime) / 1000) + "s";
  }, 500);
}

function newGame() {
  stopTimer();
  pairs = parseInt(sizeEl.value, 10);
  first = null; lock = false; moves = 0; matched = 0;
  movesEl.textContent = "0";
  timeEl.textContent = "0s";
  msgEl.textContent = "";
  board.style.gridTemplateColumns = "repeat(4, 1fr)";
  board.textContent = "";
  loadBest();
  const deck = shuffle(SYMBOLS.slice(0, pairs).concat(SYMBOLS.slice(0, pairs)));
  deck.forEach(sym => {
    const card = document.createElement("button");
    card.className = "card";
    card.dataset.sym = sym;
    card.setAttribute("aria-label", "Hidden card");
    const inner = document.createElement("div");
    inner.className = "inner";
    const front = document.createElement("div");
    front.className = "face front";
    front.textContent = "?";
    const back = document.createElement("div");
    back.className = "face back";
    back.textContent = sym;
    inner.append(front, back);
    card.appendChild(inner);
    card.addEventListener("click", () => flip(card));
    board.appendChild(card);
  });
}

function flip(card) {
  if (lock || card.classList.contains("flipped") || card.classList.contains("matched")) return;
  if (!timer) startTimer();
  card.classList.add("flipped");
  if (!first) { first = card; return; }
  moves++;
  movesEl.textContent = moves;
  if (first.dataset.sym === card.dataset.sym) {
    first.classList.add("matched");
    card.classList.add("matched");
    first = null;
    matched++;
    if (matched === pairs) win();
  } else {
    lock = true;
    const a = first;
    first = null;
    setTimeout(() => {
      a.classList.remove("flipped");
      card.classList.remove("flipped");
      lock = false;
    }, 800);
  }
}

function win() {
  stopTimer();
  const secs = Math.floor((Date.now() - startTime) / 1000);
  const prev = parseInt(localStorage.getItem(bestKey()), 10);
  let text = "Done in " + moves + " moves, " + secs + "s.";
  if (!prev || moves < prev) {
    localStorage.setItem(bestKey(), moves);
    text += " New best!";
    loadBest();
  }
  msgEl.textContent = text;
}

document.getElementById("restart").addEventListener("click", newGame);
sizeEl.addEventListener("change", newGame);
newGame();
