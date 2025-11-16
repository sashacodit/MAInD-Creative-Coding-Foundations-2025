let boardSize = 10;
let selectedAmountOfMines = 10;
let grid = [];
let isGameOver = false;
let revealedCellsCount = 0;

const board = document.getElementById('board');
const dialog = document.getElementById('dialog');

document.getElementById('startGame').addEventListener('click', () => {
    boardSize = parseInt(document.getElementById('boardSize').value);
    selectedAmountOfMines = parseInt(document.getElementById('mineCount').value);

    startGame();
});

document.getElementById('dialogButton').addEventListener('click', () => {
    dialog.close();
    startGame();
});

function startGame() {
    console.log(`Starting game with board size ${boardSize} and ${selectedAmountOfMines} mines.`);
    isGameOver = false;
    revealedCellsCount = 0;
    grid = [];
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;

    createBoard();
    placeMines();
    calculateNeighbors();
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
    }

    cellData.isRevealed = true;
    revealedCellsCount++;
    cell.classList.add('revealed');

    if (cellData.isMine) {
        isGameOver = true;
        revealAllMines();
        showdialog('Game Over! Do you want to play again?');
        return
    }

    if (cellData.mineCount > 0) {
        cell.textContent = cellData.mineCount;
    } else {
        revealNeighbors(cellData.row, cellData.col);
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
                    }

                    neighbor.isRevealed = true;
                    neighbor.element.classList.add('revealed');
                    revealedCellsCount++;

                    if (neighbor.mineCount === 0) {
                        revealNeighbors(newRow, newCol);
                    } else {
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
        showdialog('Congratulations! You Win! Do you want to play again?');
    }
}

function showdialog(message) {
    document.getElementById('dialogMessage').textContent = message;
    dialog.showModal();
}


function toggleFlag(cellData) {
    if (isGameOver || cellData.isRevealed) {
        return;
    }

    cellData.isFlagged = !cellData.isFlagged;
    cellData.element.classList.toggle('flagged');
}