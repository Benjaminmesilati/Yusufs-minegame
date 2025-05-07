// --- CACHED DOM NODES & STATE (same as before) ---
const gridEl      = document.getElementById('grid');
const betBtn      = document.getElementById('bet-button');
const betInput    = document.getElementById('bet-amount');
const minesSelect = document.getElementById('mines');
const balanceEl   = document.getElementById('balance');
const modeBtns    = document.querySelectorAll('.mode-btn');

let balance = 100;
let grid, revealed, inRound = false;

// --- UTILS (same as before) ---
function updateBalance() {
  balanceEl.textContent = balance.toFixed(8);
}

function generateGrid(size = 5, mineCount = 3) {
  const total = size * size;
  const mineSet = new Set();
  while (mineSet.size < mineCount) {
    mineSet.add(Math.floor(Math.random() * total));
  }
  grid     = Array(total).fill('safe');
  mineSet.forEach(i => grid[i] = 'mine');
  revealed = Array(total).fill(false);
}

// --- RENDER (same as before) ---
function renderGrid() {
  gridEl.innerHTML = '';
  grid.forEach((cell, idx) => {
    const div = document.createElement('div');
    div.className = 'cell' + (revealed[idx] ? ' revealed ' + cell : '');
    if (revealed[idx]) div.textContent = cell === 'mine' ? '💣' : '💎';
    if (!inRound) div.classList.add('disabled');
    div.addEventListener('click', () => handleCell(idx));
    gridEl.appendChild(div);
  });
}

// --- UPDATED handleCell! ---
function handleCell(idx) {
  // only allow clicks during a round on unrevealed cells
  if (!inRound || revealed[idx]) return;
  revealed[idx] = true;

  const bet   = parseFloat(betInput.value) || 0;

  if (grid[idx] === 'mine') {
    // You hit a mine → round ends
    balance   -= bet;
    inRound    = false;
    betBtn.disabled = false;        // re-enable betting
    alert(`💥 Boom! You lost ${bet.toFixed(8)}₿`);
  } else {
    // Safe pick → earn your bet and keep going
    balance   += bet;
    alert(`💎 Nice! You won ${bet.toFixed(8)}₿ — pick another tile.`);
    // inRound stays true, betBtn stays disabled
  }

  updateBalance();
  renderGrid();
}

// --- START ROUND (same as before) ---
betBtn.addEventListener('click', () => {
  const bet   = parseFloat(betInput.value) || 0;
  const mines = parseInt(minesSelect.value, 10);

  if (bet <= 0 || bet > balance) {
    return alert('Enter a valid bet (≤ your balance)');
  }

  generateGrid(5, mines);
  inRound        = true;
  betBtn.disabled = true;
  updateBalance();
  renderGrid();
});

// --- INITIALIZE ---
updateBalance();
generateGrid(5, parseInt(minesSelect.value,10));
renderGrid();
