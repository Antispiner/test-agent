(function () {
  const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],             // diagonals
  ];

  const cells = document.querySelectorAll('.cell');
  const status = document.getElementById('status');
  const restartBtn = document.getElementById('restart');

  let board = Array(9).fill('');
  let currentPlayer = 'X';
  let gameOver = false;

  function handleClick(e) {
    const idx = Number(e.target.dataset.index);
    if (board[idx] || gameOver) return;

    board[idx] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add('taken', currentPlayer.toLowerCase());

    const winCombo = checkWin(currentPlayer);
    if (winCombo) {
      gameOver = true;
      status.textContent = `Player ${currentPlayer} wins!`;
      status.className = 'status winner';
      winCombo.forEach(i => cells[i].classList.add('win'));
      return;
    }

    if (board.every(c => c)) {
      gameOver = true;
      status.textContent = "It's a draw!";
      status.className = 'status draw';
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;
  }

  function checkWin(player) {
    return WIN_COMBOS.find(combo => combo.every(i => board[i] === player)) || null;
  }

  function reset() {
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameOver = false;
    status.textContent = "Player X's turn";
    status.className = 'status';
    cells.forEach(cell => {
      cell.textContent = '';
      cell.className = 'cell';
    });
  }

  cells.forEach(cell => cell.addEventListener('click', handleClick));
  restartBtn.addEventListener('click', reset);
})();
