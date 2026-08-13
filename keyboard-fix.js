// Fix de escritura en intersecciones del crucigrama.
// Permite reemplazar una letra ya escrita cuando pertenece a otra orientación,
// sin que maxlength="1" bloquee la entrada del teclado.
(function () {
  const board = document.getElementById("crosswordBoard");
  if (!board) return;

  function isLetterKey(event) {
    return event.key && event.key.length === 1 && /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9]/.test(event.key);
  }

  function writeLetter(input, raw) {
    const letter = CrosswordEngine.normalizeAnswer(raw).slice(-1);
    if (!letter) return;

    // Reemplaza siempre la letra actual. Esto es especialmente importante
    // cuando la casilla ya contiene la letra de una palabra cruzada.
    input.value = letter;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  // Teclado físico: evitamos que maxlength=1 impida reemplazar una letra.
  board.addEventListener("keydown", function (event) {
    const input = event.target.closest(".cell-input");
    if (!input || !window.puzzle && !window.CrosswordEngine) return;
    if (!isLetterKey(event) || event.ctrlKey || event.metaKey || event.altKey) return;

    event.preventDefault();
    writeLetter(input, event.key);
  }, true);

  // Teclado virtual/móvil: beforeinput permite el mismo comportamiento.
  board.addEventListener("beforeinput", function (event) {
    const input = event.target.closest(".cell-input");
    if (!input || event.inputType !== "insertText" || !event.data) return;

    const letter = CrosswordEngine.normalizeAnswer(event.data).slice(-1);
    if (!letter) return;

    event.preventDefault();
    writeLetter(input, letter);
  }, true);
})();
