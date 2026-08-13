const editor = document.getElementById("entryEditor");
const titleInput = document.getElementById("titleInput");
const termCount = document.getElementById("termCount");
const builderMessage = document.getElementById("builderMessage");
const board = document.getElementById("crosswordBoard");
const acrossClues = document.getElementById("acrossClues");
const downClues = document.getElementById("downClues");
const gameTitle = document.getElementById("gameTitle");
const feedback = document.getElementById("feedback");
const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");
const celebration = document.getElementById("celebration");

let editorEntries = [];
let puzzle = null;
let selectedWordId = null;
let selectedCellKey = null;
let solutionVisible = false;
let revealedCells = new Set();

function setEditorEntries(entries) {
  editorEntries = entries.map(e => ({ answer: e.answer, clue: e.clue }));
  renderEditor();
}

function renderEditor() {
  editor.innerHTML = "";
  editorEntries.forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = "entry-row";
    row.innerHTML = `
      <span class="entry-row__number">${index + 1}</span>
      <input data-index="${index}" data-field="answer" value="${escapeHtml(entry.answer)}" placeholder="Palabra">
      <input data-index="${index}" data-field="clue" value="${escapeHtml(entry.clue)}" placeholder="Pista">
      <button class="remove-entry" data-remove="${index}" title="Eliminar">×</button>
    `;
    editor.appendChild(row);
  });
  termCount.textContent = `${editorEntries.length} término${editorEntries.length === 1 ? "" : "s"}`;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;");
}

editor.addEventListener("input", event => {
  const input = event.target.closest("input[data-index]");
  if (!input) return;
  editorEntries[Number(input.dataset.index)][input.dataset.field] = input.value;
});

editor.addEventListener("click", event => {
  const btn = event.target.closest("[data-remove]");
  if (!btn) return;
  editorEntries.splice(Number(btn.dataset.remove), 1);
  renderEditor();
});

document.getElementById("addEntryBtn").addEventListener("click", () => {
  if (editorEntries.length >= 20) {
    showBuilderMessage("El editor admite hasta 20 términos.", true);
    return;
  }
  editorEntries.push({ answer:"", clue:"" });
  renderEditor();
  editor.lastElementChild?.querySelector("input")?.focus();
});

document.getElementById("clearBtn").addEventListener("click", () => {
  titleInput.value = "Mi crucigrama";
  setEditorEntries(Array.from({length:12}, () => ({answer:"", clue:""})));
  showBuilderMessage("Editor limpio.");
});

document.querySelectorAll(".preset-card").forEach(card => {
  card.addEventListener("click", () => loadPreset(card.dataset.preset));
});

function loadPreset(name) {
  const preset = PRESETS[name];
  if (!preset) return;
  document.querySelectorAll(".preset-card").forEach(c => c.classList.toggle("active", c.dataset.preset === name));
  titleInput.value = preset.title;
  setEditorEntries(preset.entries);
  generatePuzzle();
  document.getElementById("gamePanel").scrollIntoView({behavior:"smooth", block:"start"});
}

document.getElementById("generateBtn").addEventListener("click", generatePuzzle);

function generatePuzzle() {
  const entries = editorEntries
    .map(e => ({answer:e.answer.trim(), clue:e.clue.trim()}))
    .filter(e => e.answer && e.clue);

  if (entries.length < 2) {
    showBuilderMessage("Agrega al menos dos respuestas con sus pistas.", true);
    return;
  }

  const duplicateWords = findDuplicates(entries.map(e => CrosswordEngine.normalizeAnswer(e.answer)));
  if (duplicateWords.length) {
    showBuilderMessage(`Hay respuestas repetidas: ${duplicateWords.join(", ")}.`, true);
    return;
  }

  const result = CrosswordEngine.generate(entries, { attempts: 900 });
  if (result.error) {
    showBuilderMessage(result.error, true);
    return;
  }

  puzzle = result;
  gameTitle.textContent = titleInput.value.trim() || "Mi crucigrama";
  selectedWordId = null;
  selectedCellKey = null;
  solutionVisible = false;
  revealedCells = new Set();
  renderPuzzle();
  resetProgress();

  if (result.unplaced.length) {
    const names = result.unplaced.map(e => e.answer).join(", ");
    showBuilderMessage(`Se ubicaron ${result.placedCount} de ${result.totalCount}. No fue posible conectar: ${names}. Prueba cambiar o agregar palabras con letras en común.`, true);
  } else {
    showBuilderMessage(`¡Listo! Se conectaron los ${result.placedCount} términos.`, false, true);
  }
}

function findDuplicates(items) {
  const seen = new Set();
  const duplicates = new Set();
  items.forEach(i => {
    if (seen.has(i)) duplicates.add(i);
    seen.add(i);
  });
  return [...duplicates];
}

function showBuilderMessage(message, error=false, success=false) {
  builderMessage.textContent = message;
  builderMessage.className = `builder-message${error ? " error" : success ? " success" : ""}`;
}

function renderPuzzle() {
  renderBoard();
  renderClues();
  updateProgress();
  feedback.textContent = "";
  feedback.className = "feedback";
}

function renderBoard() {
  if (!puzzle) return;
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${puzzle.cols}, var(--cell))`;
  board.style.gridTemplateRows = `repeat(${puzzle.rows}, var(--cell))`;

  const startNumbers = new Map();
  puzzle.placements.forEach(p => startNumbers.set(`${p.row},${p.col}`, p.number));

  for (let r=0; r<puzzle.rows; r++) {
    for (let c=0; c<puzzle.cols; c++) {
      const k = `${r},${c}`;
      const data = puzzle.grid.get(k);

      if (!data) {
        const block = document.createElement("div");
        block.className = "crossword-cell block";
        board.appendChild(block);
        continue;
      }

      const cell = document.createElement("div");
      cell.className = "crossword-cell";
      cell.dataset.key = k;

      if (startNumbers.has(k)) {
        const n = document.createElement("span");
        n.className = "cell-number";
        n.textContent = startNumbers.get(k);
        cell.appendChild(n);
      }

      const input = document.createElement("input");
      input.className = "cell-input";
      input.maxLength = 1;
      input.autocomplete = "off";
      input.spellcheck = false;
      input.dataset.row = r;
      input.dataset.col = c;
      input.setAttribute("aria-label", `Fila ${r+1}, columna ${c+1}`);
      cell.appendChild(input);
      board.appendChild(cell);
    }
  }
}

function renderClues() {
  acrossClues.innerHTML = "";
  downClues.innerHTML = "";
  const sorted = [...puzzle.placements].sort((a,b) => a.number - b.number || a.dir.localeCompare(b.dir));

  sorted.forEach(p => {
    const button = document.createElement("button");
    button.className = "clue";
    button.dataset.wordId = p.id;
    button.innerHTML = `<span class="clue__number">${p.number}</span><span>${escapeHtml(p.clue)}</span>`;
    button.addEventListener("click", () => selectWord(p.id, true));
    (p.dir === "H" ? acrossClues : downClues).appendChild(button);
  });
}

board.addEventListener("click", event => {
  const input = event.target.closest(".cell-input");
  if (!input || !puzzle) return;
  const k = `${input.dataset.row},${input.dataset.col}`;
  const words = wordsAtCell(k);
  if (!words.length) return;

  if (selectedCellKey === k && words.length > 1) {
    const idx = words.findIndex(w => w.id === selectedWordId);
    selectWord(words[(idx + 1) % words.length].id);
  } else {
    const preferred = words.find(w => w.id === selectedWordId) || words[0];
    selectWord(preferred.id);
  }
  selectedCellKey = k;
  input.focus();
});

board.addEventListener("input", event => {
  const input = event.target.closest(".cell-input");
  if (!input) return;
  input.value = CrosswordEngine.normalizeAnswer(input.value).slice(-1);
  clearCellStatus(input);
  if (input.value) moveAlongSelected(input, 1);
  updateProgress();
});

board.addEventListener("keydown", event => {
  const input = event.target.closest(".cell-input");
  if (!input || !puzzle) return;

  if (event.key === "Backspace" && !input.value) {
    event.preventDefault();
    moveAlongSelected(input, -1, true);
  } else if (event.key === "ArrowRight") {
    event.preventDefault(); moveToNeighbor(input, 0, 1);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault(); moveToNeighbor(input, 0, -1);
  } else if (event.key === "ArrowDown") {
    event.preventDefault(); moveToNeighbor(input, 1, 0);
  } else if (event.key === "ArrowUp") {
    event.preventDefault(); moveToNeighbor(input, -1, 0);
  } else if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    const k = `${input.dataset.row},${input.dataset.col}`;
    const words = wordsAtCell(k);
    if (words.length > 1) {
      const idx = words.findIndex(w => w.id === selectedWordId);
      selectWord(words[(idx + 1) % words.length].id);
    }
  }
});

function wordsAtCell(k) {
  const [r,c] = k.split(",").map(Number);
  return puzzle.placements.filter(p => p.cells.some(cell => cell.row === r && cell.col === c));
}

function selectWord(id, focusFirst=false) {
  selectedWordId = id;
  document.querySelectorAll(".crossword-cell").forEach(c => c.classList.remove("selected","in-word"));
  document.querySelectorAll(".clue").forEach(c => c.classList.toggle("active", c.dataset.wordId === id));

  const p = puzzle.placements.find(p => p.id === id);
  if (!p) return;

  p.cells.forEach((pos, i) => {
    const cell = getCell(pos.row, pos.col);
    if (cell) cell.classList.add(i === 0 ? "selected" : "in-word");
  });

  if (focusFirst) {
    const target = p.cells.map(pos => getInput(pos.row,pos.col)).find(i => !i.value) || getInput(p.cells[0].row,p.cells[0].col);
    target?.focus();
  }
}

function moveAlongSelected(input, delta, clear=false) {
  const p = puzzle.placements.find(p => p.id === selectedWordId);
  if (!p) return;
  const r = Number(input.dataset.row), c = Number(input.dataset.col);
  const idx = p.cells.findIndex(pos => pos.row===r && pos.col===c);
  const next = p.cells[idx + delta];
  if (!next) return;
  const nextInput = getInput(next.row,next.col);
  if (clear) nextInput.value = "";
  nextInput?.focus();
}

function moveToNeighbor(input, dr, dc) {
  const r = Number(input.dataset.row) + dr;
  const c = Number(input.dataset.col) + dc;
  getInput(r,c)?.focus();
}

function getCell(r,c) {
  return board.querySelector(`.crossword-cell[data-key="${r},${c}"]`);
}
function getInput(r,c) {
  return board.querySelector(`.cell-input[data-row="${r}"][data-col="${c}"]`);
}
function clearCellStatus(input) {
  input.parentElement.classList.remove("correct","incorrect","revealed");
}

document.getElementById("checkBtn").addEventListener("click", () => {
  if (!puzzle) return;
  let filled = 0, correct = 0, wrong = 0;

  puzzle.grid.forEach((data, k) => {
    const [r,c] = k.split(",").map(Number);
    const input = getInput(r,c);
    const cell = input.parentElement;
    cell.classList.remove("correct","incorrect");

    if (!input.value) return;
    filled++;
    if (input.value === data.char) {
      correct++;
      cell.classList.add("correct");
    } else {
      wrong++;
      cell.classList.add("incorrect");
    }
  });

  if (filled === 0) {
    setFeedback("Escribe algunas letras antes de comprobar.");
  } else if (wrong === 0 && isComplete()) {
    setFeedback("¡Perfecto! Todas las respuestas son correctas.", "good");
    showCelebration();
  } else if (wrong === 0) {
    setFeedback(`Todo lo que llevas está correcto. Te faltan ${puzzle.grid.size - filled} casillas.`, "good");
  } else {
    setFeedback(`${correct} letras correctas y ${wrong} por revisar.`, "bad");
  }
  updateProgress();
});

document.getElementById("hintBtn").addEventListener("click", () => {
  if (!puzzle) return;
  const candidates = [];
  puzzle.grid.forEach((data,k) => {
    const [r,c] = k.split(",").map(Number);
    const input = getInput(r,c);
    if (input.value !== data.char) candidates.push({data,k,r,c,input});
  });
  if (!candidates.length) {
    setFeedback("No quedan letras por revelar.", "good");
    return;
  }
  const pick = candidates[Math.floor(Math.random()*candidates.length)];
  pick.input.value = pick.data.char;
  revealedCells.add(pick.k);
  pick.input.parentElement.classList.remove("incorrect");
  pick.input.parentElement.classList.add("revealed");
  setFeedback("Revelé una letra. Las casillas amarillas corresponden a ayudas.");
  updateProgress();
});

document.getElementById("solutionBtn").addEventListener("click", () => {
  if (!puzzle) return;
  solutionVisible = !solutionVisible;

  puzzle.grid.forEach((data,k) => {
    const [r,c] = k.split(",").map(Number);
    const input = getInput(r,c);
    if (solutionVisible) {
      if (!input.dataset.previous) input.dataset.previous = input.value || " ";
      input.value = data.char;
    } else {
      input.value = input.dataset.previous === " " ? "" : (input.dataset.previous || "");
      delete input.dataset.previous;
    }
  });

  document.getElementById("solutionBtn").textContent = solutionVisible ? "🙈 Ocultar solución" : "👁 Ver solución";
  setFeedback(solutionVisible ? "Solución visible. Ocúltala para continuar resolviendo." : "Solución oculta.");
  updateProgress();
});

document.getElementById("resetBtn").addEventListener("click", resetPuzzle);
function resetPuzzle() {
  if (!puzzle) return;
  board.querySelectorAll(".cell-input").forEach(input => {
    input.value = "";
    delete input.dataset.previous;
    input.parentElement.classList.remove("correct","incorrect","revealed");
  });
  revealedCells.clear();
  solutionVisible = false;
  document.getElementById("solutionBtn").textContent = "👁 Ver solución";
  resetProgress();
  setFeedback("Crucigrama reiniciado.");
}

function resetProgress() {
  updateProgress();
}

function wordIsCorrect(p) {
  return p.cells.every((pos,i) => getInput(pos.row,pos.col)?.value === p.word[i]);
}

function isComplete() {
  return puzzle.placements.every(wordIsCorrect);
}

function updateProgress() {
  if (!puzzle) return;
  const solved = puzzle.placements.filter(wordIsCorrect).length;
  const total = puzzle.placements.length;
  const pct = total ? Math.round(solved/total*100) : 0;

  progressText.textContent = `${solved} de ${total} palabra${total === 1 ? "" : "s"}`;
  progressPercent.textContent = `${pct}%`;
  progressBar.style.width = `${pct}%`;

  document.querySelectorAll(".clue").forEach(btn => {
    const p = puzzle.placements.find(p => p.id === btn.dataset.wordId);
    btn.classList.toggle("solved", p ? wordIsCorrect(p) : false);
  });
}

function setFeedback(message, type="") {
  feedback.textContent = message;
  feedback.className = `feedback${type ? " " + type : ""}`;
}

document.getElementById("printBtn").addEventListener("click", () => window.print());

function showCelebration() {
  celebration.classList.add("show");
  celebration.setAttribute("aria-hidden","false");
}
document.getElementById("closeCelebrationBtn").addEventListener("click", () => {
  celebration.classList.remove("show");
  celebration.setAttribute("aria-hidden","true");
});

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("light");
  const light = document.body.classList.contains("light");
  document.getElementById("themeBtn").textContent = light ? "🌙" : "☀️";
  localStorage.setItem("crucilab-theme", light ? "light" : "dark");
});
if (localStorage.getItem("crucilab-theme") === "light") {
  document.body.classList.add("light");
  document.getElementById("themeBtn").textContent = "🌙";
}

loadPreset("biologiaCelular");
