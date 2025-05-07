// -- Cached DOM --
const gridEl      = document.getElementById('grid');
const betBtn      = document.getElementById('bet-button');
const betInput    = document.getElementById('bet-amount');
const minesSelect = document.getElementById('mines');
const balanceEl   = document.getElementById('balance');
const modeBtns    = document.querySelectorAll('.mode-btn');

let balance   = 100;
let grid      = [];
let revealed  = [];
let inRound   = false;

// -- Mode toggle (just UI stub) --
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// -- Helpers --
function updateBalance() {
  balanceEl.textContent = balance.toFixed(8);
}

function generateGrid(size = 5, mineCount = 3) {
  const total = size * size;
  const mines = new Set();
  while (mines.size < mineCount) {
    mines.add(Math.floor(Math.random() * total));
  }
  grid     = Array(total).fill('safe');
  mines.forEach(i=>grid[i] = 'mine');
  revealed = Array(total).fill(false);
}

// -- Render --
function renderGrid() {
  gridEl.innerHTML = '';
  grid.forEach((cell, idx) => {
    const div = document.createElement('div');
    div.className = 'cell' + (revealed[idx] ? ' revealed ' + cell : '');
    if (revealed[idx]) {
      div.textContent = cell === 'mine' ? '💣' : '💎';
    }
    if (!inRound) div.classList.add('disabled');
    div.addEventListener('click', ()=> handleCell(idx));
    gridEl.appendChild(div);
  });
}

// -- Cell click handler --
function handleCell(idx) {
  if (!inRound || revealed[idx]) return;
  revealed[idx] = true;

  const bet = parseFloat(betInput.value) || 0;
  if (grid[idx] === 'mine') {
    balance -= bet;
    inRound = false;
    betBtn.disabled = false;
  } else {
    // simple 1× payout per diamond
    balance += bet;
  }

  updateBalance();
  renderGrid();
}

// -- Start a new round --
betBtn.addEventListener('click', () => {
  const bet   = parseFloat(betInput.value);
  const mines = parseInt(minesSelect.value, 10);

  if (bet <= 0 || bet > balance) {
    return alert('Invalid bet');
  }

  generateGrid(5, mines);
  inRound = true;
  betBtn.disabled = true;
  updateBalance();
  renderGrid();
});

// -- Init --
updateBalance();
renderGrid();
