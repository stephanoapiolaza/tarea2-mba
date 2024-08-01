document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('#grid')
    const width = 8
    const squares = []
    const candyColors = [
        'red',
        'yellow',
        'blue',
        'green'
    ]

    // Create Board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            let randomColor = Math.floor(Math.random() * candyColors.length)
            square.style.backgroundColor = candyColors[randomColor]
            square.setAttribute('draggable', true)
            square.setAttribute('id', i)
            grid.appendChild(square)
            squares.push(square)
        }
    }
    createBoard()

    let colorBeingDragged
    let colorBeingReplaced
    let squareIdBeingDragged
    let squareIdBeingReplaced

    squares.forEach(square => square.addEventListener('dragstart', dragStart))
    squares.forEach(square => square.addEventListener('dragend', dragEnd))
    squares.forEach(square => square.addEventListener('dragover', dragOver))
    squares.forEach(square => square.addEventListener('dragenter', dragEnter))
    squares.forEach(square => square.addEventListener('dragleave', dragLeave))
    squares.forEach(square => square.addEventListener('drop', dragDrop))

    function dragStart() {
        colorBeingDragged = this.style.backgroundColor
        squareIdBeingDragged = parseInt(this.id)
        console.log(colorBeingDragged)
        console.log(this.id, 'dragstart')
    }

    function dragOver(e) {
        e.preventDefault()
        console.log(this.id, 'dragover')
    }

    function dragEnter(e) {
        e.preventDefault()
        console.log(this.id, 'dragenter')
    }

    function dragLeave() {
        console.log(this.id, 'dragleave')
    }

    function dragDrop() {
        console.log(this.id, 'dragdrop')
        colorBeingReplaced = this.style.backgroundColor
        squareIdBeingReplaced = parseInt(this.id)
        this.style.backgroundColor = colorBeingDragged
        squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced
    }

    function dragEnd() {
        console.log(this.id, 'dragend')
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ]
        let validMove = validMoves.includes(squareIdBeingReplaced)

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null
        } else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundColor = colorBeingReplaced
            squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged
        } else squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged
    }

    // Drop candies once some have been cleared
    function moveDown() {
        for (i = 0; i < 55; i ++) {
            if(squares[i + width].style.backgroundColor === '') {
                squares[i + width].style.backgroundColor = squares[i].style.backgroundColor
                squares[i].style.backgroundColor = ''
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
                const isFirstRow = firstRow.includes(i)
                if (isFirstRow && (squares[i].style.backgroundColor === '')) {
                  let randomColor = Math.floor(Math.random() * candyColors.length)
                  squares[i].style.backgroundColor = candyColors[randomColor]
                }
            }
        }
    }

    // Check for matches
    function checkRowForThree() {
        for (i = 0; i < 61; i ++) {
            let rowOfThree = [i, i+1, i+2]
            let decidedColor = squares[i].style.backgroundColor
            const isBlank = squares[i].style.backgroundColor === ''

            if(rowOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
                rowOfThree.forEach(index => {
                squares[index].style.backgroundColor = ''
                })
            }
        }
    }
    checkRowForThree()

    function checkColumnForThree() {
        for (i = 0; i < 47; i ++) {
            let columnOfThree = [i, i+width, i+width*2]
            let decidedColor = squares[i].style.backgroundColor
            const isBlank = squares[i].style.backgroundColor === ''

            if(columnOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
                columnOfThree.forEach(index => {
                squares[index].style.backgroundColor = ''
                })
            }
        }
    }
    checkColumnForThree()

    window.setInterval(function(){
        moveDown()
        checkRowForThree()
        checkColumnForThree()
    }, 100)
})
