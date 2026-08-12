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

  function canPlace(word, row, col, dir, grid, requireCross) {
    const dr = dir === "V" ? 1 : 0;
    const dc = dir === "H" ? 1 : 0;

    const before = grid.get(key(row - dr, col - dc));
    const after = grid.get(key(row + dr * word.length, col + dc * word.length));
    if (before || after) return null;

    let crossings = 0;

    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      const current = grid.get(key(r, c));

      if (current) {
        if (current.char !== word[i]) return null;
        if (current.dirs.has(dir)) return null;
        crossings++;
      } else {
        if (dir === "H") {
          if (grid.get(key(r - 1, c)) || grid.get(key(r + 1, c))) return null;
        } else {
          if (grid.get(key(r, c - 1)) || grid.get(key(r, c + 1))) return null;
        }
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
    return { minR, minC, maxR, maxC, width: maxC - minC + 1, height: maxR - minR + 1 };
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
          const score = valid.crossings * 120 - area * 0.25 - squareness * 1.4 + Math.random() * 8;
          candidates.push({ row, col, dir, score, crossings: valid.crossings });
        }
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates;
  }

  function attempt(entries) {
    const grid = new Map();
    const placements = [];
    const sorted = entries
      .map(e => ({ ...e, word: normalizeAnswer(e.answer) }))
      .filter(e => e.word.length >= 2)
      .sort((a, b) => b.word.length - a.word.length + (Math.random() - .5) * 2);

    if (!sorted.length) return null;

    const seedPool = sorted.slice(0, Math.min(4, sorted.length));
    const seed = seedPool[Math.floor(Math.random() * seedPool.length)];
    const remaining = sorted.filter(e => e !== seed);

    place(seed.word, 0, 0, "H", grid);
    placements.push({ ...seed, row: 0, col: 0, dir: "H", crossings: 0 });

    let pending = remaining.slice();
    let changed = true;

    while (pending.length && changed) {
      changed = false;
      pending.sort((a, b) => {
        const ca = candidatePositions(a.word, grid, placements).length;
        const cb = candidatePositions(b.word, grid, placements).length;
        if (ca === 0 && cb > 0) return 1;
        if (cb === 0 && ca > 0) return -1;
        return b.word.length - a.word.length;
      });

      const nextPending = [];
      for (const entry of pending) {
        const candidates = candidatePositions(entry.word, grid, placements);
        if (!candidates.length) {
          nextPending.push(entry);
          continue;
        }
        const pickFrom = candidates.slice(0, Math.min(4, candidates.length));
        const chosen = pickFrom[Math.floor(Math.random() * pickFrom.length)];
        place(entry.word, chosen.row, chosen.col, chosen.dir, grid);
        placements.push({ ...entry, ...chosen });
        changed = true;
      }
      pending = nextPending;
    }

    const b = boundsFromPlacements(placements);
    const totalCrossings = placements.reduce((sum, p) => sum + (p.crossings || 0), 0);
    const score = placements.length * 10000 + totalCrossings * 120 - b.width * b.height - Math.abs(b.width - b.height) * 8;

    return { grid, placements, unplaced: pending, bounds: b, score };
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
      .sort((a,b) => a.r - b.r || a.c - b.c);

    const numberMap = new Map();
    numberedStarts.forEach((item, index) => numberMap.set(item.k, index + 1));

    finalPlacements.forEach((p, index) => {
      p.id = `word-${index}`;
      p.number = numberMap.get(key(p.row, p.col));
      p.cells = Array.from({length:p.word.length}, (_, i) => ({
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
    const valid = entries.filter(e => normalizeAnswer(e.answer).length >= 2 && (e.clue || "").trim());
    if (valid.length < 2) {
      return { error: "Necesitas al menos dos términos con pista." };
    }

    const attempts = options.attempts || 700;
    let best = null;

    for (let i = 0; i < attempts; i++) {
      const result = attempt(valid);
      if (!result) continue;
      if (!best || result.score > best.score) best = result;
      if (result.placements.length === valid.length && result.bounds.width <= 24 && result.bounds.height <= 24) {
        if (i > 80) break;
      }
    }

    if (!best) return { error: "No fue posible construir el crucigrama." };
    return finalize(best, valid.length);
  }

  const api = { generate, normalizeAnswer };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.CrosswordEngine = api;
})(typeof window !== "undefined" ? window : globalThis);
