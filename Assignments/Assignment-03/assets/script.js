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
let selectedBombSpriteType = 'local'; // 'local' or 'giphy'
let selectedFlagSpriteType = 'local'; // 'local' or 'giphy'
let currentSpriteSource = 'local'; // 'local' or 'giphy'
let giphyBombImages = [];
let giphyFlagImages = [];

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
let selectedBombOptionType = 'local';
let selectedFlagOptionType = 'local';
let spriteSelectionInitialized = false;
let toggleButtonsInitialized = false;

// GIPHY API functions

// Fetch GIPHY images based on query
// returns array of objects with url and title
async function fetchGiphyImages(query, limit = 10) {
    try {
        let apiKey = null; 

        if(typeof APIKEY !== 'undefined'){
            apiKey = APIKEY;
        }
        else{
            apiKey = "";
        }

        if (!apiKey) {
            console.error('GIPHY API key not found');
            return [];
        }

        const response = await fetch(
            `https://api.giphy.com/v1/stickers/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=${limit}&rating=g&lang=en`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log(data);
        return data.data.map(gif => ({ // returns array of objects with url and title
            url: gif.images.fixed_height.url,
            title: gif.title // for alt text if image not loaded
        })); 
    } catch (error) {
        console.error('Error fetching GIPHY images:', error);
        return [];
    }
}

// 
async function loadGiphyImages() {
    const bombOptions = document.getElementById('bombOptions');
    const flagOptions = document.getElementById('flagOptions');
    const bombLoading = document.getElementById('bombLoading');
    const flagLoading = document.getElementById('flagLoading');
    const bombError = document.getElementById('bombError');
    const flagError = document.getElementById('flagError');

    // Show loading states
    bombLoading.style.display = 'flex';
    flagLoading.style.display = 'flex';
    bombError.style.display = 'none';
    flagError.style.display = 'none';
    bombOptions.innerHTML = '';
    flagOptions.innerHTML = '';

    // Fetch images in parallel API USE 
    const [bombImages, flagImages] = await Promise.all([
        fetchGiphyImages('bomb ', 10),
        fetchGiphyImages('flag surrender', 10)
    ]);

    // Hide loading states
    bombLoading.style.display = 'none';
    flagLoading.style.display = 'none';

    // Add class for GIPHY sprites (scrollable)
    bombOptions.classList.add('giphy-sprites');
    flagOptions.classList.add('giphy-sprites');
    bombOptions.classList.remove('local-sprites');
    flagOptions.classList.remove('local-sprites');

    // Handle bomb images
    if (bombImages.length > 0) {
        giphyBombImages = bombImages;
        bombImages.forEach((img, index) => {
            const option = document.createElement('div');
            option.className = 'sprite-option';
            option.dataset.sprite = img.url;
            option.dataset.type = 'giphy';
            option.dataset.index = index;
            option.innerHTML = `<img src="${img.url}" alt="${img.title || 'Bomb ' + (index + 1)}" loading="lazy">`;
            bombOptions.appendChild(option);
        });
    } else {
        bombError.style.display = 'block';
    }

    // Handle flag images
    if (flagImages.length > 0) {
        giphyFlagImages = flagImages;
        flagImages.forEach((img, index) => {
            const option = document.createElement('div');
            option.className = 'sprite-option';
            option.dataset.sprite = img.url;
            option.dataset.type = 'giphy';
            option.dataset.index = index;
            option.innerHTML = `<img src="${img.url}" alt="${img.title || 'Flag ' + (index + 1)}" loading="lazy">`;
            flagOptions.appendChild(option);
        });
    } else {
        flagError.style.display = 'block';
    }

    // Re-initialize sprite selection to attach event listeners
    initializeSpriteSelection();
}

// Prepares sprite selection dialog to be shown. 
// Makes current selected sprites shown as selected in the dialog.
// If no sprites were previously selected, defaults to first option in each category.
function initializeSpriteSelection() {
    const bombOptions = document.querySelectorAll('#bombOptions .sprite-option');
    const flagOptions = document.querySelectorAll('#flagOptions .sprite-option');

    // Remove old event listeners by cloning and replacing
    bombOptions.forEach(option => {
        const newOption = option.cloneNode(true);
        option.parentNode.replaceChild(newOption, option);
    });

    flagOptions.forEach(option => {
        const newOption = option.cloneNode(true);
        option.parentNode.replaceChild(newOption, option);
    });

    // Get fresh references after cloning
    const freshBombOptions = document.querySelectorAll('#bombOptions .sprite-option');
    const freshFlagOptions = document.querySelectorAll('#flagOptions .sprite-option');

    // Add event listeners
    freshBombOptions.forEach(option => {
        option.addEventListener('click', () => {
            freshBombOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedBombOption = option.dataset.sprite;
            selectedBombOptionType = option.dataset.type || 'local';
        });
    });

    freshFlagOptions.forEach(option => {
        option.addEventListener('click', () => {
            freshFlagOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedFlagOption = option.dataset.sprite;
            selectedFlagOptionType = option.dataset.type || 'local';
        });
    });

    // Clear all selections first
    freshBombOptions.forEach(opt => opt.classList.remove('selected'));
    freshFlagOptions.forEach(opt => opt.classList.remove('selected'));

    // Set selections based on previously chosen sprites, or default to first
    if (freshBombOptions.length > 0) {
        const matchingBomb = Array.from(freshBombOptions).find(opt => 
            opt.dataset.sprite === selectedBombSprite && 
            (opt.dataset.type || 'local') === selectedBombSpriteType
        );
        if (matchingBomb) {
            matchingBomb.classList.add('selected');
            selectedBombOption = matchingBomb.dataset.sprite;
            selectedBombOptionType = matchingBomb.dataset.type || 'local';
        } else {
            freshBombOptions[0].classList.add('selected');
            selectedBombOption = freshBombOptions[0].dataset.sprite;
            selectedBombOptionType = freshBombOptions[0].dataset.type || 'local';
        }
    }
    
    if (freshFlagOptions.length > 0) {
        const matchingFlag = Array.from(freshFlagOptions).find(opt => 
            opt.dataset.sprite === selectedFlagSprite && 
            (opt.dataset.type || 'local') === selectedFlagSpriteType
        );
        if (matchingFlag) {
            matchingFlag.classList.add('selected');
            selectedFlagOption = matchingFlag.dataset.sprite;
            selectedFlagOptionType = matchingFlag.dataset.type || 'local';
        } else {
            freshFlagOptions[0].classList.add('selected');
            selectedFlagOption = freshFlagOptions[0].dataset.sprite;
            selectedFlagOptionType = freshFlagOptions[0].dataset.type || 'local';
        }
    }
}

document.getElementById('confirmSprites').addEventListener('click', () => {
    if (selectedBombOption) {
        selectedBombSprite = selectedBombOption;
        selectedBombSpriteType = selectedBombOptionType;
    }
    if (selectedFlagOption) {
        selectedFlagSprite = selectedFlagOption;
        selectedFlagSpriteType = selectedFlagOptionType;
    }
    spriteSelectionDialog.close();
    startGame();
});

function showSpriteSelectionDialog() {
    // Initialize toggle buttons
    const toggleLocal = document.getElementById('toggleLocal');
    const toggleGiphy = document.getElementById('toggleGiphy');
    
    // Initialize toggle button listeners only once
    if (!toggleButtonsInitialized) {
        toggleLocal.addEventListener('click', () => {
            currentSpriteSource = 'local';
            toggleLocal.classList.add('active');
            toggleGiphy.classList.remove('active');
            showLocalSprites();
        });

        toggleGiphy.addEventListener('click', () => {
            currentSpriteSource = 'giphy';
            toggleGiphy.classList.add('active');
            toggleLocal.classList.remove('active');
            showGiphySprites();
        });
        toggleButtonsInitialized = true;
    }
    
    // Set initial state
    if (currentSpriteSource === 'local') {
        toggleLocal.classList.add('active');
        toggleGiphy.classList.remove('active');
        showLocalSprites();
    } else {
        toggleGiphy.classList.add('active');
        toggleLocal.classList.remove('active');
        showGiphySprites();
    }

    spriteSelectionDialog.showModal();
}

function showLocalSprites() {
    const bombOptions = document.getElementById('bombOptions');
    const flagOptions = document.getElementById('flagOptions');
    const bombLoading = document.getElementById('bombLoading');
    const flagLoading = document.getElementById('flagLoading');
    const bombError = document.getElementById('bombError');
    const flagError = document.getElementById('flagError');

    // Hide loading and error states
    bombLoading.style.display = 'none';
    flagLoading.style.display = 'none';
    bombError.style.display = 'none';
    flagError.style.display = 'none';

    // Add class to center local sprites
    bombOptions.classList.add('local-sprites');
    flagOptions.classList.add('local-sprites');
    bombOptions.classList.remove('giphy-sprites');
    flagOptions.classList.remove('giphy-sprites');

    // Show local sprites
    bombOptions.innerHTML = `
        <div class="sprite-option" data-sprite="Bomb.svg" data-type="local">
            <img src="assets/img/Bomb.svg" alt="Bomb 1">
        </div>
        <div class="sprite-option" data-sprite="Bomb2.svg" data-type="local">
            <img src="assets/img/Bomb2.svg" alt="Bomb 2">
        </div>
        <div class="sprite-option" data-sprite="Bomb3.svg" data-type="local">
            <img src="assets/img/Bomb3.svg" alt="Bomb 3">
        </div>
    `;

    flagOptions.innerHTML = `
        <div class="sprite-option" data-sprite="Flag.svg" data-type="local">
            <img src="assets/img/Flag.svg" alt="Flag 1">
        </div>
        <div class="sprite-option" data-sprite="Flag2.svg" data-type="local">
            <img src="assets/img/Flag2.svg" alt="Flag 2">
        </div>
        <div class="sprite-option" data-sprite="Flag3.svg" data-type="local">
            <img src="assets/img/Flag3.svg" alt="Flag 3">
        </div>
    `;

    initializeSpriteSelection();
}

function showGiphySprites() {
    // Load GIPHY images if not already loaded
    if (giphyBombImages.length === 0 || giphyFlagImages.length === 0) {
        loadGiphyImages();
    } else {
        // Re-render existing GIPHY images
        const bombOptions = document.getElementById('bombOptions');
        const flagOptions = document.getElementById('flagOptions');
        const bombLoading = document.getElementById('bombLoading');
        const flagLoading = document.getElementById('flagLoading');
        const bombError = document.getElementById('bombError');
        const flagError = document.getElementById('flagError');

        bombLoading.style.display = 'none';
        flagLoading.style.display = 'none';
        bombError.style.display = 'none';
        flagError.style.display = 'none';

        // Add class for GIPHY sprites (scrollable)
        bombOptions.classList.add('giphy-sprites');
        flagOptions.classList.add('giphy-sprites');
        bombOptions.classList.remove('local-sprites');
        flagOptions.classList.remove('local-sprites');

        bombOptions.innerHTML = '';
        flagOptions.innerHTML = '';

        giphyBombImages.forEach((img, index) => {
            const option = document.createElement('div');
            option.className = 'sprite-option';
            option.dataset.sprite = img.url;
            option.dataset.type = 'giphy';
            option.dataset.index = index;
            option.innerHTML = `<img src="${img.url}" alt="${img.title || 'Bomb ' + (index + 1)}" loading="lazy">`;
            bombOptions.appendChild(option);
        });

        giphyFlagImages.forEach((img, index) => {
            const option = document.createElement('div');
            option.className = 'sprite-option';
            option.dataset.sprite = img.url;
            option.dataset.type = 'giphy';
            option.dataset.index = index;
            option.innerHTML = `<img src="${img.url}" alt="${img.title || 'Flag ' + (index + 1)}" loading="lazy">`;
            flagOptions.appendChild(option);
        });

        initializeSpriteSelection();
    }
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

            cell.addEventListener('click', () => {
                clearFocus();
                revealCell(cellData);
            });
            cell.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                clearFocus();
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

// Reveal cell logic
// if steps on the mine - game over 
// if no mine - add score, reveal itself and neighbors recursively
// checks win condition
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
                let bombImageUrl;
                if (selectedBombSpriteType === 'giphy') {
                    bombImageUrl = selectedBombSprite;
                } else {
                    bombImageUrl = `assets/img/${selectedBombSprite}`;
                }
                cellData.element.style.backgroundImage = `url('${bombImageUrl}')`;
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
        let flagImageUrl;
        if(selectedFlagSpriteType === 'giphy') {
            flagImageUrl = selectedFlagSprite;
        } else {
            flagImageUrl = `assets/img/${selectedFlagSprite}`;
        }
        cellData.element.style.backgroundImage = `url('${flagImageUrl}')`;
    } else {
        cellData.element.style.backgroundImage = '';
    }
}

// Keyboard navigation
document.addEventListener('keydown', (event) => {
    if (isGameOver) return;
    
    // If focus was cleared by mouse click, restore it to first cell
    if (!focusedCell && grid.length > 0 && grid[0].length > 0) {
        updateFocus(grid[0][0]);
    }
    
    if (!focusedCell) return;

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

// Clear visual focus
function clearFocus() {
    if (focusedCell) {
        focusedCell.element.style.boxShadow = 'none';
        focusedCell = null;
    }
}

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