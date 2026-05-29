let board = Array(9).fill(null);
let current = "X";
let gameOver = false;
let mode = "pvp";
let scores = { X: 0, O: 0, D: 0 };

const WIN_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWin(b, p) {
  return WIN_COMBOS.find((c) => c.every((i) => b[i] === p)) || null;
}

function renderBoard() {
  for (let i = 0; i < 9; i++) {
    const el = document.getElementById("c" + i);
    el.textContent = board[i] === "X" ? "✕" : board[i] === "O" ? "◯" : "";
    el.className =
      "cell" + (board[i] ? " taken " + board[i].toLowerCase() : "");
  }
}

function highlightWin(combo) {
  combo.forEach((i) => document.getElementById("c" + i).classList.add("win"));
}

function setStatus(msg) {
  document.getElementById("status").textContent = msg;
}

function updateScores() {
  document.getElementById("score-x").textContent = scores.X;
  document.getElementById("score-o").textContent = scores.O;
  document.getElementById("score-d").textContent = scores.D;
}

function handleClick(idx) {
  if (gameOver || board[idx]) return;
  if (mode === "ai" && current === "O") return;
  makeMove(idx);
}

function makeMove(idx) {
  board[idx] = current;
  renderBoard();

  const winCombo = checkWin(board, current);
  if (winCombo) {
    highlightWin(winCombo);
    const label =
      mode === "ai" && current === "O" ? "AI (O)" : "Player " + current;
    setStatus(label + " wins! 🎉");
    scores[current]++;
    updateScores();
    gameOver = true;
    return;
  }

  if (board.every((c) => c)) {
    setStatus("It's a draw! 🤝");
    scores.D++;
    updateScores();
    gameOver = true;
    return;
  }

  current = current === "X" ? "O" : "X";

  if (mode === "ai" && current === "O" && !gameOver) {
    setStatus("AI is thinking…");
    setTimeout(aiMove, 400);
  } else {
    setStatus(
      mode === "ai" ? "Your turn (X)" : "Player " + current + "'s turn",
    );
  }
}

function aiMove() {
  makeMove(getBestMove());
}

function getBestMove() {
  let best = -Infinity,
    idx = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      const s = minimax(board, 0, false);
      board[i] = null;
      if (s > best) {
        best = s;
        idx = i;
      }
    }
  }
  return idx;
}

function minimax(b, depth, isMax) {
  if (checkWin(b, "O")) return 10 - depth;
  if (checkWin(b, "X")) return depth - 10;
  if (b.every((c) => c)) return 0;
  let best = isMax ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = isMax ? "O" : "X";
      const s = minimax(b, depth + 1, !isMax);
      b[i] = null;
      best = isMax ? Math.max(best, s) : Math.min(best, s);
    }
  }
  return best;
}

function setMode(m) {
  mode = m;
  document.getElementById("btn-pvp").classList.toggle("active", m === "pvp");
  document.getElementById("btn-ai").classList.toggle("active", m === "ai");
  resetGame();
}

function resetGame() {
  board = Array(9).fill(null);
  current = "X";
  gameOver = false;
  renderBoard();
  setStatus(mode === "ai" ? "Your turn (X)" : "Player X's turn");
}

function resetScores() {
  scores = { X: 0, O: 0, D: 0 };
  updateScores();
  resetGame();
}
