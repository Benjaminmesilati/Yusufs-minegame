// -- Elements --
const gridEl      = document.getElementById('grid');
const betBtn      = document.getElementById('bet-button');
const betInput    = document.getElementById('bet-amount');
const quickBtns   = document.querySelectorAll('.quick-btns button');
const minesSelect = document.getElementById('mines');
const balanceEl   = document.getElementById('balance');
const modeBtns    = document.querySelectorAll('.mode-btn');

let balance = 100;
let grid, revealed, inRound = false;

// -- Mode Toggle (UI only) --
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// -- Quick-bet buttons (½, 2×) --
quickBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    let val = parseFloat(betInput.value) || 0;
    if (btn.dataset.func === 'half')  val /= 2;
    if (btn.dataset.func === 'double') val *= 2;
    betInput.value = val.toFixed(8);
  });
});

// -- Helpers --
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

// -- Render Grid --
function renderGrid() {
  gridEl.innerHTML = '';
  grid.forEach((cell, idx) => {
    const div = document.createElement('div');
    div.className = 'cell' + (revealed[idx] ? ' revealed ' + cell : '');
    if (revealed[idx]) div.textContent = cell === 'mine' ? '💣' : '💎';
    if (!inRound)     div.classList.add('disabled');
    div.addEventListener('click', () => handleCell(idx));
    gridEl.appendChild(div);
  });
}

// -- Handle Tile Click --
function handleCell(idx) {
  if (!inRound || revealed[idx]) return;
  revealed[idx] = true;

  const bet    = parseFloat(betInput.value) || 0;
  const mines  = parseInt(minesSelect.value, 10);

  if (grid[idx] === 'mine') {
    // lose
    balance   -= bet;
    inRound    = false;
    betBtn.disabled = false;
  } else {
    // win 1× per safe tile
    balance   += bet;
  }

  updateBalance();
  renderGrid();
}

// -- Start Round --
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

// -- Init --
updateBalance();
generateGrid(5, parseInt(minesSelect.value,10));
renderGrid();
