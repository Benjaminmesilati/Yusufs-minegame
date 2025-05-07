const gridSize = 5;
const mineCount = 5;
let grid = [];
let revealed = [];
let balance = 100;
let betAmount = 10;  // Default bet amount
let winAmount = 0;
const statusText = document.getElementById('status');
const balanceText = document.getElementById('balance');
const winAmountText = document.getElementById('win-amount');
const betInput = document.getElementById('bet-amount');

// Update balance and win amount displays
function updateDisplay() {
  balanceText.textContent = `Balance: $${balance.toFixed(2)}`;
  winAmountText.textContent = `Current Win: $${winAmount.toFixed(2)}`;
}

// Update bet amount when input changes
betInput.addEventListener('input', () => {
  betAmount = parseInt(betInput.value, 10) || 0;
});

// Generate a random grid with mines
function generateGrid() {
  const totalCells = gridSize * gridSize;
  const minePositions = new Set();
  while (minePositions.size < mineCount) {
    minePositions.add(Math.floor(Math.random() * totalCells));
  }
  grid = Array(totalCells).fill("safe");
  minePositions.forEach(pos => grid[pos] = "mine");
  revealed = Array(totalCells).fill(false);
}

// Handle user click on grid cell
function handleClick(index) {
  if (revealed[index] || statusText.textContent !== "Game in progress") return;

  revealed[index] = true;

  if (grid[index] === "mine") {
    statusText.textContent = `You hit a mine! You lose $${betAmount}.`;
    balance -= betAmount;
    winAmount = 0;
  } else {
    statusText.textContent = "Safe! You win $5.";
    balance += 5;
    winAmount += 5;
  }

  updateDisplay();
  checkGameOver();
}

// Check if game is over
function checkGameOver() {
  if (balance <= 0) {
    statusText.textContent = "Game Over! You're out of money!";
    return;
  }
}

// Reset the game
function resetGame() {
  if (balance <= 0) return;
  
  generateGrid();
  statusText.textContent = "Game in progress";
  winAmount = 0;
  updateDisplay();
}

// Initial setup
generateGrid();
updateDisplay();
