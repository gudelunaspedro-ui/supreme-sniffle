const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const PATTERN_SIZE = 5;

const COLORS = {
  0: "#161b22",
  1: "#f85149",
  2: "#39d0d8",
  3: "#f0883e",
  4: "#bc8cff",
  5: "#d2a8ff",
  6: "#58a6ff",
  7: "#3fb950",
  8: "#000000",
};

const SHAPES = [
  [[1]],
  [[2, 2]],
  [[3], [3]],
  [[4, 4], [4, 4]],
  [[5, 5, 5]],
  [[8]],
  [[8, 8]],
];

let canvas, ctx, patternCanvas, patternCtx;
let board = [];
let currentPiece = null;
let currentX = 0;
let currentY = 0;
let score = 0;
let highScore = 0;
let level = 1;
let patternsCleared = 0;
let gameOver = false;
let isPaused = false;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let targetPattern = null;

function init() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  patternCanvas = document.getElementById("patternCanvas");
  patternCtx = patternCanvas.getContext("2d");

  highScore = Number(localStorage.getItem("stackOverflownHighScore")) || 0;
  document.getElementById("high-score").textContent = highScore;

  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  setNewTargetPattern();
  spawnPiece();
  updateStatus();
  requestAnimationFrame(gameLoop);
  document.addEventListener("keydown", handleKeyPress);
}

function gameLoop(time = 0) {
  if (!gameOver && !isPaused) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
      moveDown();
      dropCounter = 0;
    }
  }
  draw();
  requestAnimationFrame(gameLoop);
}

function draw() {
  ctx.fillStyle = COLORS[0];
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col]) drawBlock(ctx, col, row, board[row][col]);
    }
  }

  if (currentPiece) drawPiece(ctx, currentPiece, currentX, currentY);

  ctx.strokeStyle = "#30363d";
  ctx.lineWidth = 0.5;
  for (let row = 0; row <= ROWS; row++) {
    ctx.beginPath();
    ctx.moveTo(0, row * BLOCK_SIZE);
    ctx.lineTo(COLS * BLOCK_SIZE, row * BLOCK_SIZE);
    ctx.stroke();
  }
  for (let col = 0; col <= COLS; col++) {
    ctx.beginPath();
    ctx.moveTo(col * BLOCK_SIZE, 0);
    ctx.lineTo(col * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    ctx.stroke();
  }
}

function drawBlock(context, x, y, colorCode) {
  context.fillStyle = COLORS[colorCode];
  context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  context.strokeStyle = "#0d1117";
  context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawPiece(context, piece, offsetX, offsetY) {
  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      if (piece[row][col]) drawBlock(context, offsetX + col, offsetY + row, piece[row][col]);
    }
  }
}

function spawnPiece() {
  const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  currentPiece = randomShape.map((row) => [...row]);
  currentX = Math.floor(COLS / 2) - Math.floor(currentPiece[0].length / 2);
  currentY = 0;
  if (checkCollision(currentPiece, currentX, currentY)) endGame();
}

function checkCollision(piece, x, y) {
  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      if (!piece[row][col]) continue;
      const newX = x + col;
      const newY = y + row;
      if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
      if (newY >= 0 && board[newY][newX]) return true;
    }
  }
  return false;
}

function moveDown() {
  if (!checkCollision(currentPiece, currentX, currentY + 1)) {
    currentY++;
    return;
  }
  lockPiece();
  checkPatternMatch();
  spawnPiece();
}

function lockPiece() {
  for (let row = 0; row < currentPiece.length; row++) {
    for (let col = 0; col < currentPiece[row].length; col++) {
      if (!currentPiece[row][col]) continue;
      const boardY = currentY + row;
      const boardX = currentX + col;
      if (boardY >= 0) board[boardY][boardX] = currentPiece[row][col];
    }
  }
}

function rotate() {
  const rotated = currentPiece[0].map((_, i) => currentPiece.map((row) => row[i]).reverse());
  if (!checkCollision(rotated, currentX, currentY)) currentPiece = rotated;
}

function moveLeft() {
  if (!checkCollision(currentPiece, currentX - 1, currentY)) currentX--;
}

function moveRight() {
  if (!checkCollision(currentPiece, currentX + 1, currentY)) currentX++;
}

function hardDrop() {
  while (!checkCollision(currentPiece, currentX, currentY + 1)) currentY++;
  lockPiece();
  checkPatternMatch();
  spawnPiece();
}

function setNewTargetPattern() {
  targetPattern = ERROR_PATTERNS[Math.floor(Math.random() * ERROR_PATTERNS.length)];
  document.getElementById("patternName").textContent = targetPattern.name;
  drawTargetPattern();
}

function drawTargetPattern() {
  if (!targetPattern) return;
  const blockSize = 20;
  patternCtx.fillStyle = "#0d1117";
  patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

  for (let row = 0; row < PATTERN_SIZE; row++) {
    for (let col = 0; col < PATTERN_SIZE; col++) {
      if (targetPattern.pattern[row][col]) {
        patternCtx.fillStyle = "#f0883e";
        patternCtx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
        patternCtx.strokeStyle = "#30363d";
        patternCtx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
      }
    }
  }
}

function checkPatternMatch() {
  for (let startRow = 0; startRow <= ROWS - PATTERN_SIZE; startRow++) {
    for (let startCol = 0; startCol <= COLS - PATTERN_SIZE; startCol++) {
      if (!matchesPattern(startRow, startCol)) continue;
      clearPattern();
      score += 100;
      patternsCleared++;
      if (patternsCleared % 5 === 0) {
        level++;
        dropInterval = Math.max(200, 1000 - (level - 1) * 100);
      }
      updateScore();
      setNewTargetPattern();
      return;
    }
  }
}

function matchesPattern(startRow, startCol) {
  for (let row = 0; row < PATTERN_SIZE; row++) {
    for (let col = 0; col < PATTERN_SIZE; col++) {
      const cellValue = board[startRow + row][startCol + col];
      const hasBlock = cellValue !== 0 && cellValue !== 8;
      const needsBlock = targetPattern.pattern[row][col] === 1;
      if (hasBlock !== needsBlock) return false;
    }
  }
  return true;
}

function clearPattern() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function updateScore() {
  document.getElementById("score").textContent = score;
  document.getElementById("high-score").textContent = highScore;
  document.getElementById("level").textContent = level;
  if (score > highScore) {
    highScore = score;
    document.getElementById("high-score").textContent = highScore;
    localStorage.setItem("stackOverflownHighScore", highScore);
  }
}

function updateStatus() {
  const status = document.getElementById("status");
  status.textContent = isPaused ? "● Pausado" : "● Em execução";
}

function handleKeyPress(e) {
  if (gameOver) return;
  switch (e.key) {
    case "ArrowLeft": e.preventDefault(); if (!isPaused) moveLeft(); break;
    case "ArrowRight": e.preventDefault(); if (!isPaused) moveRight(); break;
    case "ArrowDown": e.preventDefault(); if (!isPaused) moveDown(); break;
    case "ArrowUp": e.preventDefault(); if (!isPaused) rotate(); break;
    case " ": e.preventDefault(); if (!isPaused) hardDrop(); break;
    case "p":
    case "P": e.preventDefault(); togglePause(); break;
  }
}

function togglePause() {
  isPaused = !isPaused;
  lastTime = performance.now();
  updateStatus();
}

function endGame() {
  gameOver = true;
  document.getElementById("finalScore").textContent = score;
  document.getElementById("gameOver").classList.add("show");
}

window.addEventListener("load", init);
