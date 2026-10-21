const STORAGE_KEY = "split-it-v1";

let state = load();
// people we've already drawn a checkbox for, so new people get ticked by default
const seenInSplit = new Set();

const $ = (id) => document.getElementById(id);
const els = {
  personForm: $("person-form"),
  personName: $("person-name"),
  people: $("people"),
  expenseForm: $("expense-form"),
  desc: $("exp-desc"),
  amount: $("exp-amount"),
  payer: $("exp-payer"),
  split: $("exp-split"),
  error: $("form-error"),
  expenses: $("expenses"),
  total: $("total"),
  balances: $("balances"),
  settle: $("settle"),
  copyBtn: $("copy-btn"),
  resetBtn: $("reset-btn"),
};

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.people) && Array.isArray(saved.expenses)) return saved;
  } catch (e) { /* bad data, start fresh */ }
  return { people: [], expenses: [] };
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Money is stored in paise/cents (integers) so 0.1 + 0.2 never bites.
const toCents = (n) => Math.round(Number(n) * 100);
const fmt = (cents) => (cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function nameOf(id) {
  const p = state.people.find((x) => x.id === id);
  return p ? p.name : "?";
}

// Split an amount into n parts that add up exactly. The first few people
// absorb the leftover cent(s).
function splitEvenly(cents, n) {
  const base = Math.floor(cents / n);
  let rest = cents - base * n;
  return Array.from({ length: n }, () => base + (rest-- > 0 ? 1 : 0));
}

function computeBalances() {
  const bal = {};
  state.people.forEach((p) => (bal[p.id] = 0));
  state.expenses.forEach((e) => {
    bal[e.payer] = (bal[e.payer] || 0) + e.amount;
    splitEvenly(e.amount, e.split.length).forEach((share, i) => {
      bal[e.split[i]] = (bal[e.split[i]] || 0) - share;
    });
  });
  return bal;
}

// Greedy settle: biggest debtor pays biggest creditor until everyone is at 0.
// Not always the theoretical minimum, but at most n-1 payments and good enough.
function settleUp(bal) {
  const creditors = [];
  const debtors = [];
  Object.entries(bal).forEach(([id, v]) => {
    if (v > 0) creditors.push({ id, v });
    else if (v < 0) debtors.push({ id, v: -v });
  });
  creditors.sort((a, b) => b.v - a.v);
  debtors.sort((a, b) => b.v - a.v);

  const payments = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amt = Math.min(debtors[i].v, creditors[j].v);
    if (amt > 0) payments.push({ from: debtors[i].id, to: creditors[j].id, amount: amt });
    debtors[i].v -= amt;
    creditors[j].v -= amt;
    if (debtors[i].v === 0) i++;
    if (creditors[j].v === 0) j++;
  }
  return payments;
}

function isInUse(personId) {
  return state.expenses.some((e) => e.payer === personId || e.split.includes(personId));
}

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.assign(node, props);
  children.forEach((c) => node.append(c));
  return node;
}

function emptyRow(text) {
  return el("li", { className: "empty", textContent: text });
}

function render() {
  // people chips
  els.people.replaceChildren(...state.people.map((p) => {
    const btn = el("button", { type: "button", textContent: "×", title: "Remove" });
    btn.setAttribute("aria-label", `Remove ${p.name}`);
    btn.addEventListener("click", () => removePerson(p.id));
    return el("li", {}, [el("span", { textContent: p.name }), btn]);
  }));

  // payer dropdown, keep the current selection if it still exists
  const prevPayer = els.payer.value;
  els.payer.replaceChildren(...state.people.map((p) => el("option", { value: p.id, textContent: `${p.name} paid` })));
  if (state.people.some((p) => p.id === prevPayer)) els.payer.value = prevPayer;

  // split checkboxes, everyone ticked by default
  const prevChecked = new Set([...els.split.querySelectorAll("input:checked")].map((c) => c.value));
  els.split.replaceChildren(...state.people.map((p) => {
    const cb = el("input", { type: "checkbox", value: p.id });
    cb.checked = !seenInSplit.has(p.id) || prevChecked.has(p.id);
    seenInSplit.add(p.id);
    return el("label", {}, [cb, p.name]);
  }));
  if (!state.people.length) els.split.append(el("span", { className: "muted", textContent: "Add people first" }));

  // expenses
  const total = state.expenses.reduce((s, e) => s + e.amount, 0);
  els.total.textContent = state.expenses.length ? `Total ${fmt(total)}` : "";
  els.expenses.replaceChildren(...(state.expenses.length
    ? state.expenses.slice().reverse().map((e) => {
        const x = el("button", { type: "button", className: "x", textContent: "×", title: "Delete expense" });
        x.addEventListener("click", () => removeExpense(e.id));
        const who = e.split.length === state.people.length ? "everyone" : e.split.map(nameOf).join(", ");
        return el("li", {}, [
          el("div", {}, [e.desc, el("span", { className: "sub", textContent: `${nameOf(e.payer)} paid · split with ${who}` })]),
          el("div", { className: "right" }, [fmt(e.amount), x]),
        ]);
      })
    : [emptyRow("No expenses yet.")]));

  // balances
  const bal = computeBalances();
  els.balances.replaceChildren(...(state.people.length
    ? state.people.map((p) => {
        const v = bal[p.id] || 0;
        const label = v > 0 ? `gets back ${fmt(v)}` : v < 0 ? `owes ${fmt(-v)}` : "settled";
        return el("li", {}, [p.name, el("span", { className: v > 0 ? "pos" : v < 0 ? "neg" : "muted", textContent: label })]);
      })
    : [emptyRow("Add some people to get started.")]));

  // settle up
  const payments = settleUp(bal);
  els.settle.replaceChildren(...(payments.length
    ? payments.map((pm) => el("li", {}, [
        el("span", { textContent: `${nameOf(pm.from)} → ${nameOf(pm.to)}` }),
        el("strong", { textContent: fmt(pm.amount) }),
      ]))
    : [emptyRow(state.expenses.length ? "All square. Nobody owes anything." : "Nothing to settle yet.")]));
}

function addPerson(name) {
  const clean = name.trim();
  if (!clean) return;
  if (state.people.some((p) => p.name.toLowerCase() === clean.toLowerCase())) {
    els.personName.select();
    return;
  }
  state.people.push({ id: uid(), name: clean });
  save();
  render();
}

function removePerson(id) {
  if (isInUse(id)) {
    alert(`${nameOf(id)} is part of an expense. Delete those expenses first.`);
    return;
  }
  state.people = state.people.filter((p) => p.id !== id);
  seenInSplit.delete(id);
  save();
  render();
}

function addExpense() {
  els.error.textContent = "";
  const desc = els.desc.value.trim();
  const amount = toCents(els.amount.value);
  const payer = els.payer.value;
  const split = [...els.split.querySelectorAll("input:checked")].map((c) => c.value);

  if (state.people.length < 2) return (els.error.textContent = "Add at least two people.");
  if (!desc) return (els.error.textContent = "Give the expense a name.");
  if (!(amount > 0)) return (els.error.textContent = "Enter an amount above zero.");
  if (!split.length) return (els.error.textContent = "Pick at least one person to split with.");

  state.expenses.push({ id: uid(), desc, amount, payer, split });
  save();
  els.desc.value = "";
  els.amount.value = "";
  els.desc.focus();
  render();
}

function removeExpense(id) {
  state.expenses = state.expenses.filter((e) => e.id !== id);
  save();
  render();
}

function summaryText() {
  const payments = settleUp(computeBalances());
  const total = state.expenses.reduce((s, e) => s + e.amount, 0);
  const lines = [`Split It summary (total ${fmt(total)})`, ""];
  state.expenses.forEach((e) => lines.push(`- ${e.desc}: ${fmt(e.amount)} paid by ${nameOf(e.payer)}`));
  lines.push("", "To settle up:");
  if (!payments.length) lines.push("Nobody owes anything.");
  payments.forEach((p) => lines.push(`${nameOf(p.from)} pays ${nameOf(p.to)} ${fmt(p.amount)}`));
  return lines.join("\n");
}

els.personForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addPerson(els.personName.value);
  els.personName.value = "";
  els.personName.focus();
});

els.expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addExpense();
});

els.copyBtn.addEventListener("click", async () => {
  const text = summaryText();
  try {
    await navigator.clipboard.writeText(text);
    els.copyBtn.textContent = "Copied!";
  } catch (err) {
    window.prompt("Copy this:", text);
  }
  setTimeout(() => (els.copyBtn.textContent = "Copy summary"), 1500);
});

els.resetBtn.addEventListener("click", () => {
  if (!confirm("Clear all people and expenses?")) return;
  state = { people: [], expenses: [] };
  seenInSplit.clear();
  save();
  render();
});

render();
