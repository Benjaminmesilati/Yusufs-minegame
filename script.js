const gridSize = 5;
const mineCount = 5;
let grid = [];
let revealed = [];
let balance = 100;
const statusText = document.getElementById('status');
const balanceText = document.getElementById('balance');

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

function updateDisplay() {
  const gridDiv = document.getElementById('grid');
  gridDiv.innerHTML = "";
  grid.forEach((cell, index) => {
    const div = document.createElement('div');
    div.className = 'cell';
    if (revealed[index]) {
      div.classList.add('revealed');
      div.classList.add(cell);
      div.textContent = cell === "mine" ? "💣" : "💎";
    }
    div.onclick = () => handleClick(index);
    gridDiv.appendChild(div);
  });
  balanceText.textContent = `Balance: $${balance.toFixed(2)}`;
}

function handleClick(index) {
  if (revealed[index] || statusText.textContent !== "Game in progress") return;
  revealed[index] = true;
  if (grid[index] === "mine") {
    statusText.textContent = "You hit a mine! You lose $10.";
    balance -= 10;
  } else {
    statusText.textContent = "Safe! You win $5.";
    balance += 5;
  }
  updateDisplay();
}

function resetGame() {
  generateGrid();
  statusText.textContent = "Game in progress";
  updateDisplay();
}

generateGrid();
updateDisplay();
