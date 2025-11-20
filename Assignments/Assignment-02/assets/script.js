let boardSize = 10;
let selectedAmountOfMines = 10;
let grid = [];
let isGameOver = false;
let revealedCellsCount = 0;
let focusedCell = null;
let score = 0;
let highScore = 0;
let selectedBombSprite = 'Bomb.svg';
let selectedFlagSprite = 'Flag.svg';

const board = document.getElementById('board');
const scoreValueElement = document.getElementById('scoreValue');
const highScoreValueElement = document.getElementById('highScoreValue');
const explosionSound = document.getElementById('gameOverSound');
const flagSound = document.getElementById('flagSound');
const winSound = document.getElementById('winSound');
const startSound = document.getElementById('startSound');
board.style.display = 'none';

const dialog = document.getElementById('dialog');
const dialogMessageElement = document.getElementById('dialogMessage');
const dialogScoreElement = document.getElementById('dialogScore');
const spriteSelectionDialog = document.getElementById('spriteSelectionDialog');

document.getElementById('startGame').addEventListener('click', () => {
    boardSize = parseInt(document.getElementById('boardSize').value);
    selectedAmountOfMines = parseInt(document.getElementById('mineCount').value);

    showSpriteSelectionDialog();
});

document.getElementById('dialogButton').addEventListener('click', () => {
    dialog.close();
    showSpriteSelectionDialog();
});

// Sprite selection dialog handlers
let selectedBombOption = null;
let selectedFlagOption = null;
let spriteSelectionInitialized = false;

function initializeSpriteSelection() {
    const bombOptions = document.querySelectorAll('.sprite-group:first-child .sprite-option');
    const flagOptions = document.querySelectorAll('.sprite-group:last-child .sprite-option');

    // Only add event listeners once
    if (!spriteSelectionInitialized) {
        bombOptions.forEach(option => {
            option.addEventListener('click', () => {
                bombOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedBombOption = option.dataset.sprite;
            });
        });

        flagOptions.forEach(option => {
            option.addEventListener('click', () => {
                flagOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedFlagOption = option.dataset.sprite;
            });
        });
        spriteSelectionInitialized = true;
    }

    // Clear all selections first
    bombOptions.forEach(opt => opt.classList.remove('selected'));
    flagOptions.forEach(opt => opt.classList.remove('selected'));

    // Set selections based on previously chosen sprites, or default to first
    if (bombOptions.length > 0) {
        const matchingBomb = Array.from(bombOptions).find(opt => opt.dataset.sprite === selectedBombSprite);
        if (matchingBomb) {
            matchingBomb.classList.add('selected');
            selectedBombOption = matchingBomb.dataset.sprite;
        } else {
            bombOptions[0].classList.add('selected');
            selectedBombOption = bombOptions[0].dataset.sprite;
        }
    }
    
    if (flagOptions.length > 0) {
        const matchingFlag = Array.from(flagOptions).find(opt => opt.dataset.sprite === selectedFlagSprite);
        if (matchingFlag) {
            matchingFlag.classList.add('selected');
            selectedFlagOption = matchingFlag.dataset.sprite;
        } else {
            flagOptions[0].classList.add('selected');
            selectedFlagOption = flagOptions[0].dataset.sprite;
        }
    }
}

document.getElementById('confirmSprites').addEventListener('click', () => {
    if (selectedBombOption) {
        selectedBombSprite = selectedBombOption;
    }
    if (selectedFlagOption) {
        selectedFlagSprite = selectedFlagOption;
    }
    spriteSelectionDialog.close();
    startGame();
});

function showSpriteSelectionDialog() {
    initializeSpriteSelection();
    spriteSelectionDialog.showModal();
}

function startGame() {
    console.log(`Starting game with board size ${boardSize} and ${selectedAmountOfMines} mines.`);
    board.style.display = 'grid';
    startSound.play();
    isGameOver = false;
    revealedCellsCount = 0;
    score = 0;
    updateScoreDisplay();
    grid = [];
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;

    createBoard();
    placeMines();
    calculateNeighbors();

    // Focus first cell after DOM is ready
    setTimeout(() => {
        updateFocus(grid[0][0]);
    }, 0);
}

function createBoard() {
    for (let row = 0; row <= boardSize - 1; row++) {
        const rowArr = [];
        for (let col = 0; col <= boardSize - 1; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            const cellData = {
                element: cell,
                row: row,
                col: col,
                isMine: false,
                mineCount: 0,
                isRevealed: false,
                isFlagged: false
            }

            cell.addEventListener('click', () => revealCell(cellData));
            cell.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                toggleFlag(cellData);
                flagSound.play();
            });

            rowArr.push(cellData);
            board.appendChild(cell);
            console.log(`Created cell at (${row}, ${col})`);
        }
        grid.push(rowArr);
    }
}


function placeMines() {
    let minesPlacedCount = 0;

    while (minesPlacedCount < selectedAmountOfMines) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);

        if (!grid[row][col].isMine) {
            grid[row][col].isMine = true;
            minesPlacedCount++;
        }
    }
}

function calculateNeighbors() {
    for (let row = 0; row <= boardSize - 1; row++) {
        for (let col = 0; col <= boardSize - 1; col++) {
            const cellData = grid[row][col];

            if (cellData.isMine) {
                continue;
            }

            let mineCount = 0;

            for (let r = -1; r <= 1; r++) {
                for (let c = -1; c <= 1; c++) {
                    const newRow = row + r;
                    const newCol = col + c;

                    if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                        if (grid[newRow][newCol].isMine) {
                            mineCount++;
                        }
                    }
                }
            }

            cellData.mineCount = mineCount;
        }
    }

}


function revealCell(cellData) {
    if (isGameOver || cellData.isRevealed) {
        return;
    }

    const cell = cellData.element;

    if (cellData.isFlagged) {
        cellData.isFlagged = false;
        cell.classList.remove('flagged');
        cell.style.backgroundImage = '';
    }

    cellData.isRevealed = true;
    revealedCellsCount++;
    cell.classList.add('revealed');

    if (cellData.isMine) {
        isGameOver = true;
        explosionSound.play();
        revealAllMines();
        updateHighScoreIfNeeded();
        showdialog('Game Over! Do you want to play again?');
        return
    }
    else {
        score += 10;  // Add 10 points per cell revealed
        updateScoreDisplay();
        cell.setAttribute('data-count', cellData.mineCount);

        if (cellData.mineCount > 0) {
            cell.textContent = cellData.mineCount;
        } else {
            revealNeighbors(cellData.row, cellData.col);
        }
    }

    checkWinCondition();
}


function revealAllMines() {
    for (let row = 0; row <= boardSize - 1; row++) {
        for (let col = 0; col <= boardSize - 1; col++) {
            const cellData = grid[row][col];

            if (cellData.isMine) {
                cellData.element.classList.add('revealed');
                cellData.element.classList.add('mine');
                cellData.element.style.backgroundImage = `url('assets/img/${selectedBombSprite}')`;
            }
        }
    }
}

function revealNeighbors(row, col) {
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            const newRow = row + r;
            const newCol = col + c;

            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                const neighbor = grid[newRow][newCol];

                if (!neighbor.isRevealed && !neighbor.isMine) {
                    if (neighbor.isFlagged) {
                        neighbor.isFlagged = false;
                        neighbor.element.classList.remove('flagged');
                        neighbor.element.style.backgroundImage = '';
                    }

                    neighbor.isRevealed = true;
                    neighbor.element.classList.add('revealed');
                    revealedCellsCount++;
                    score += 10;  // Add 10 points per cell revealed
                    updateScoreDisplay();

                    if (neighbor.mineCount === 0) {
                        revealNeighbors(newRow, newCol);
                    } else {
                        neighbor.element.setAttribute('data-count', neighbor.mineCount);
                        neighbor.element.textContent = neighbor.mineCount;
                    }
                }
            }
        }
    }
}

function checkWinCondition() {
    if (revealedCellsCount === boardSize * boardSize - selectedAmountOfMines) {
        isGameOver = true;
        updateHighScoreIfNeeded();
        showdialog('Congratulations! You Won! Do you want to play again?');
        winSound.play();
    }
}

function showdialog(message) {
    if (dialogMessageElement) {
        dialogMessageElement.textContent = message;
    }

    if (dialogScoreElement) {
        dialogScoreElement.textContent = `Score: ${score}`;
    }

    dialog.showModal();
}

function updateScoreDisplay() {
    if (scoreValueElement) {
        scoreValueElement.textContent = score.toString();
    }
    if (highScoreValueElement) {
        highScoreValueElement.textContent = highScore.toString();
    }
}

function updateHighScoreIfNeeded() {
    if (score > highScore) {
        highScore = score;
        updateScoreDisplay();
    }
}


function toggleFlag(cellData) {
    if (isGameOver || cellData.isRevealed) {
        return;
    }

    cellData.isFlagged = !cellData.isFlagged;
    cellData.element.classList.toggle('flagged');
    
    if (cellData.isFlagged) {
        cellData.element.style.backgroundImage = `url('assets/img/${selectedFlagSprite}')`;
    } else {
        cellData.element.style.backgroundImage = '';
    }
}

// Keyboard navigation
document.addEventListener('keydown', (event) => {
    if (isGameOver || !focusedCell) return;

    const row = focusedCell.row;
    const col = focusedCell.col;
    let newRow = row;
    let newCol = col;

    // Arrow key navigation
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        newRow = Math.max(0, row - 1);
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        newRow = Math.min(boardSize - 1, row + 1);
    } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        newCol = Math.max(0, col - 1);
    } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        newCol = Math.min(boardSize - 1, col + 1);
    } else if (event.key === ' ') {
        // Space to flag
        event.preventDefault();
        toggleFlag(focusedCell);
        flagSound.play();
    } else if (event.key === 'Enter') {
        // Enter to reveal
        event.preventDefault();
        revealCell(focusedCell);
    }

    // Move focus to new cell
    if (newRow !== row || newCol !== col) {
        updateFocus(grid[newRow][newCol]);
    }
});

// Update visual focus and track focused cell
function updateFocus(cellData) {
    // Remove focus from previous cell
    if (focusedCell) {
        focusedCell.element.style.boxShadow = 'none';
    }

    // Set focus to new cell
    focusedCell = cellData;
    cellData.element.style.boxShadow = 'inset 0 0 0 2px #3b82f6';
}