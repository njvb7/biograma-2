(function(global) {
  function normalizeAnswer(text) {
    return (text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
  }

  function key(r, c) {
    return `${r},${c}`;
  }

  function cloneGrid(grid) {
    const copy = new Map();
    for (const [k, v] of grid.entries()) {
      copy.set(k, { char: v.char, dirs: new Set(v.dirs) });
    }
    return copy;
  }

  // A valid crossword placement must:
  // 1. fit every existing crossing with the same letter;
  // 2. cross at least one existing word (except the first word);
  // 3. never touch another letter side-by-side without crossing;
  // 4. never overlap a word in the same direction.
  function canPlace(word, row, col, dir, grid, requireCross = true) {
    const dr = dir === "V" ? 1 : 0;
    const dc = dir === "H" ? 1 : 0;

    // The cells immediately before and after the word must be empty.
    if (grid.has(key(row - dr, col - dc))) return null;
    if (grid.has(key(row + dr * word.length, col + dc * word.length))) return null;

    let crossings = 0;

    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      const current = grid.get(key(r, c));

      if (current) {
        if (current.char !== word[i]) return null;
        if (current.dirs.has(dir)) return null;
        crossings++;
        continue;
      }

      // Empty cells cannot touch another word on the sides.
      if (dir === "H") {
        if (grid.has(key(r - 1, c)) || grid.has(key(r + 1, c))) return null;
      } else {
        if (grid.has(key(r, c - 1)) || grid.has(key(r, c + 1))) return null;
      }
    }

    if (requireCross && crossings === 0) return null;
    return { crossings };
  }

  function place(word, row, col, dir, grid) {
    const dr = dir === "V" ? 1 : 0;
    const dc = dir === "H" ? 1 : 0;

    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      const k = key(r, c);
      const current = grid.get(k);

      if (current) {
        current.dirs.add(dir);
      } else {
        grid.set(k, { char: word[i], dirs: new Set([dir]) });
      }
    }
  }

  function boundsFromPlacements(placements) {
    let minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity;

    for (const p of placements) {
      const endR = p.row + (p.dir === "V" ? p.word.length - 1 : 0);
      const endC = p.col + (p.dir === "H" ? p.word.length - 1 : 0);
      minR = Math.min(minR, p.row, endR);
      minC = Math.min(minC, p.col, endC);
      maxR = Math.max(maxR, p.row, endR);
      maxC = Math.max(maxC, p.col, endC);
    }

    return {
      minR, minC, maxR, maxC,
      width: maxC - minC + 1,
      height: maxR - minR + 1
    };
  }

  function candidatePositions(word, grid, placements) {
    const cellsByChar = new Map();

    for (const [k, cell] of grid.entries()) {
      if (!cellsByChar.has(cell.char)) cellsByChar.set(cell.char, []);
      const [r, c] = k.split(",").map(Number);
      cellsByChar.get(cell.char).push({ r, c });
    }

    const candidates = [];
    const seen = new Set();

    for (let i = 0; i < word.length; i++) {
      const matches = cellsByChar.get(word[i]) || [];

      for (const match of matches) {
        for (const dir of ["H", "V"]) {
          const row = match.r - (dir === "V" ? i : 0);
          const col = match.c - (dir === "H" ? i : 0);
          const sig = `${row},${col},${dir}`;

          if (seen.has(sig)) continue;
          seen.add(sig);

          const valid = canPlace(word, row, col, dir, grid, true);
          if (!valid) continue;

          const prospective = placements.concat([{ word, row, col, dir }]);
          const b = boundsFromPlacements(prospective);
          const area = b.width * b.height;
          const squareness = Math.abs(b.width - b.height);

          // Prefer many real crossings and a compact, reasonably square board.
          const score =
            valid.crossings * 1000 -
            area * 1.2 -
            squareness * 5 +
            Math.random() * 15;

          candidates.push({
            row, col, dir,
            score,
            crossings: valid.crossings
          });
        }
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates;
  }

  function searchAll(words, initialGrid, initialPlacements, maxNodes = 25000) {
    let nodes = 0;

    function dfs(pending, grid, placements) {
      nodes++;
      if (nodes > maxNodes) return null;
      if (!pending.length) return { grid, placements };

      // Minimum Remaining Values: choose the word with the fewest
      // legal crossings first. This dramatically reduces dead ends.
      let selectedIndex = -1;
      let selectedCandidates = null;

      for (let i = 0; i < pending.length; i++) {
        const candidates = candidatePositions(pending[i].word, grid, placements);

        if (!candidates.length) return null;

        if (
          selectedCandidates === null ||
          candidates.length < selectedCandidates.length ||
          (candidates.length === selectedCandidates.length &&
            pending[i].word.length > pending[selectedIndex].word.length)
        ) {
          selectedIndex = i;
          selectedCandidates = candidates;
        }
      }

      const entry = pending[selectedIndex];
      const rest = pending.filter((_, i) => i !== selectedIndex);

      // Try the best candidates first, but keep several alternatives
      // so the generator can recover from a bad early crossing.
      const limit = Math.min(selectedCandidates.length, 32);

      for (let i = 0; i < limit; i++) {
        const candidate = selectedCandidates[i];
        const nextGrid = cloneGrid(grid);
        const nextPlacements = placements.slice();

        place(entry.word, candidate.row, candidate.col, candidate.dir, nextGrid);
        nextPlacements.push({ ...entry, ...candidate });

        const result = dfs(rest, nextGrid, nextPlacements);
        if (result) return result;
      }

      return null;
    }

    return dfs(words, initialGrid, initialPlacements);
  }

  function attempt(entries) {
    const sorted = entries
      .map(e => ({ ...e, word: normalizeAnswer(e.answer) }))
      .filter(e => e.word.length >= 2)
      .sort((a, b) => b.word.length - a.word.length);

    if (!sorted.length) return null;

    // Long words make a stable backbone. Try different seeds across attempts.
    const seed = sorted[Math.floor(Math.random() * Math.min(sorted.length, 4))];
    const remaining = sorted.filter(e => e !== seed);

    const grid = new Map();
    const placements = [];

    place(seed.word, 0, 0, "H", grid);
    placements.push({
      ...seed,
      row: 0,
      col: 0,
      dir: "H",
      crossings: 0
    });

    const result = searchAll(remaining, grid, placements, 30000);
    if (!result) return null;

    const b = boundsFromPlacements(result.placements);
    const totalCrossings = result.placements.reduce(
      (sum, p) => sum + (p.crossings || 0), 0
    );

    const score =
      result.placements.length * 100000 +
      totalCrossings * 1000 -
      b.width * b.height * 2 -
      Math.abs(b.width - b.height) * 10;

    return {
      grid: result.grid,
      placements: result.placements,
      unplaced: [],
      bounds: b,
      score
    };
  }

  function finalize(best, totalEntries) {
    const { placements, grid, bounds } = best;
    const shiftR = -bounds.minR;
    const shiftC = -bounds.minC;

    const finalPlacements = placements.map(p => ({
      ...p,
      row: p.row + shiftR,
      col: p.col + shiftC
    }));

    const finalGrid = new Map();

    for (const [k, cell] of grid.entries()) {
      const [r, c] = k.split(",").map(Number);
      finalGrid.set(key(r + shiftR, c + shiftC), {
        char: cell.char,
        dirs: new Set(cell.dirs)
      });
    }

    // A crossword number belongs to every word that starts in the same cell.
    const starts = new Map();

    for (const p of finalPlacements) {
      const k = key(p.row, p.col);
      if (!starts.has(k)) starts.set(k, []);
      starts.get(k).push(p);
    }

    const numberedStarts = [...starts.keys()]
      .map(k => {
        const [r, c] = k.split(",").map(Number);
        return { k, r, c };
      })
      .sort((a, b) => a.r - b.r || a.c - b.c);

    const numberMap = new Map();
    numberedStarts.forEach((item, index) => {
      numberMap.set(item.k, index + 1);
    });

    finalPlacements.forEach((p, index) => {
      p.id = `word-${index}`;
      p.number = numberMap.get(key(p.row, p.col));
      p.cells = Array.from({ length: p.word.length }, (_, i) => ({
        row: p.row + (p.dir === "V" ? i : 0),
        col: p.col + (p.dir === "H" ? i : 0)
      }));
    });

    return {
      rows: bounds.height,
      cols: bounds.width,
      grid: finalGrid,
      placements: finalPlacements,
      unplaced: best.unplaced,
      placedCount: finalPlacements.length,
      totalCount: totalEntries
    };
  }

  function generate(entries, options = {}) {
    const valid = entries
      .filter(e => normalizeAnswer(e.answer).length >= 2 && (e.clue || "").trim());

    if (valid.length < 2) {
      return { error: "Necesitas al menos dos términos con pista." };
    }

    const attempts = options.attempts || 30;
    let best = null;

    for (let i = 0; i < attempts; i++) {
      const result = attempt(valid);
      if (!result) continue;

      if (!best || result.score > best.score) best = result;

      // If every term is placed, we already have a complete crossword.
      if (result.placements.length === valid.length) {
        // Keep searching a little to find a more compact/connected layout.
        if (i >= Math.min(8, attempts - 1)) break;
      }
    }

    if (!best) {
      return {
        error: "No fue posible formar un crucigrama válido con estas palabras. Prueba con términos que compartan algunas letras."
      };
    }

    return finalize(best, valid.length);
  }

  const api = { generate, normalizeAnswer };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.CrosswordEngine = api;
})(typeof window !== "undefined" ? window : globalThis);
