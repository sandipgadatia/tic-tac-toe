const boardElement = document.getElementById('board');
const resetButton = document.getElementById('reset');
const resultLabel = document.createElement('div');
resultLabel.classList.add('result-label');
document.body.appendChild(resultLabel); // Add result label to the body

let board = ['', '', '', '', '', '', '', '', ''];
let human = 'O';
let ai = 'X';
let currentPlayer = human;
let gameActive = true;

function createBoard() {
  boardElement.innerHTML = '';
  board.forEach((cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.setAttribute('data-index', index);
    cellElement.addEventListener('click', handleHumanMove, { once: true });
    cellElement.innerText = cell;
    boardElement.appendChild(cellElement);
  });
}

function handleHumanMove(event) {
  const index = event.target.getAttribute('data-index');

  if (board[index] === '' && gameActive) {
    board[index] = human;
    event.target.innerText = human;
    event.target.classList.add(human); // Add class "O" to style it

    if (checkWinner(board, human)) {
      gameActive = false;
      showResult(`${human} wins!`);
    } else if (isDraw()) {
      gameActive = false;
      showResult(`It's a draw!`);
    } else {
      currentPlayer = ai;
      setTimeout(aiMove, 500);
    }
  }
}

function aiMove() {
  if (!gameActive) return;

  const bestMove = findBestMove(board);
  board[bestMove] = ai;

  const cell = document.querySelector(`[data-index='${bestMove}']`);
  cell.innerText = ai;
  cell.classList.add(ai); // Add class "X" to style it

  if (checkWinner(board, ai)) {
    gameActive = false;
    showResult(`${ai} wins!`);
  } else if (isDraw()) {
    gameActive = false;
    showResult(`It's a draw!`);
  } else {
    currentPlayer = human;
  }
}

function checkWinner(board, player) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  return winningCombinations.some(combo => {
    return combo.every(index => board[index] === player);
  });
}

function isDraw() {
  return board.every(cell => cell !== '') && !checkWinner(board, human) && !checkWinner(board, ai);
}

function findBestMove(board) {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = ai;
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner(board, ai)) return 10 - depth;
  if (checkWinner(board, human)) return depth - 10;
  if (isDraw()) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = ai;
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = human;
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Function to show result in an overlay
function showResult(message) {
  resultLabel.innerText = message;
  resultLabel.classList.add('show');
}

// Reset the game
resetButton.addEventListener('click', () => {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = human;
  gameActive = true;
  createBoard();
  resultLabel.classList.remove('show'); // Hide the result label on reset
});

// Initialize the game for the first time
createBoard();
