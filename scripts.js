document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('#grid');
    const scoreDisplay = document.querySelector('#score');
    const resultScreen = document.querySelector('#result-screen');
    const resultMessage = document.querySelector('#result-message');
    const finalScore = document.querySelector('#final-score');
    const restartButton = document.querySelector('#restart-button');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    const gameContainer = document.querySelector('.game');
    const width = 8;
    const squares = [];
    const candyImages = [
        '1.png',
        '2.png',
        '3.png',
        '4.png'
    ];
    let score = 0;
    let gameIsStart = false;

    // Mostrar el puntaje inicial en el marcador
    scoreDisplay.textContent = score;

    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            let randomImage = Math.floor(Math.random() * candyImages.length);
            square.style.backgroundImage = `url(${candyImages[randomImage]})`;
            square.style.backgroundSize = 'cover';
            square.style.backgroundPosition = 'center';
            square.setAttribute('draggable', true);
            square.setAttribute('id', i);
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    function startGame() {
        startScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        gameIsStart = true;
    }

    startButton.addEventListener('click', startGame);

    let imageBeingDragged;
    let imageBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    squares.forEach(square => square.addEventListener('dragstart', dragStart));
    squares.forEach(square => square.addEventListener('dragend', dragEnd));
    squares.forEach(square => square.addEventListener('dragover', dragOver));
    squares.forEach(square => square.addEventListener('dragenter', dragEnter));
    squares.forEach(square => square.addEventListener('dragleave', dragLeave));
    squares.forEach(square => square.addEventListener('drop', dragDrop));

    function dragStart() {
        imageBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() {}

    function dragDrop() {
        imageBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = imageBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = imageBeingReplaced;
    }

    function dragEnd() {
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundImage = imageBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundImage = imageBeingDragged;
        } else {
            squares[squareIdBeingDragged].style.backgroundImage = imageBeingDragged;
        }
    }

    function moveDown() {
        for (i = 0; i < 55; i++) {
            if (squares[i + width].style.backgroundImage === '') {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = '';
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);
                if (isFirstRow && (squares[i].style.backgroundImage === '')) {
                    let randomImage = Math.floor(Math.random() * candyImages.length);
                    squares[i].style.backgroundImage = `url(${candyImages[randomImage]})`;
                }
            }
        }
    }

    function checkRowForThree() {
        for (i = 0; i < 61; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedImage = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedImage && !isBlank)) {
                if (gameIsStart) {
                    score += 10;
                }
                scoreDisplay.textContent = score;
                rowOfThree.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
                if (gameIsStart && score >= 100) {
                    gameWon();
                }
            }
        }
    }

    function checkColumnForThree() {
        for (i = 0; i < 47; i++) {
            let columnOfThree = [i, i + width, i + width * 2];
            let decidedImage = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedImage && !isBlank)) {
                if (gameIsStart) {
                    score += 10;
                }
                scoreDisplay.textContent = score;
                columnOfThree.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
                if (gameIsStart && score >= 100) {
                    gameWon();
                }
            }
        }
    }

    function gameWon() {
        resultMessage.textContent = '!Wewnien!';
        finalScore.textContent = score;
        resultScreen.style.display = 'block';
        resultScreen.classList.remove('hidden');
    }

    function resetGame() {
        score = 0;
        gameIsStart = false;
        scoreDisplay.textContent = score;
        resultScreen.style.display = 'none';
        squares.forEach(square => {
            let randomImage = Math.floor(Math.random() * candyImages.length);
            square.style.backgroundImage = `url(${candyImages[randomImage]})`;
        });
        gameIsStart = true;
    }

    restartButton.addEventListener('click', resetGame);

    window.setInterval(function () {
        moveDown();
        checkRowForThree();
        checkColumnForThree();
    }, 100);

});
