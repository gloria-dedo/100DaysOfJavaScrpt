
let cellsNo = 20
let cellSize = 400 / cellsNo
let difficulty = 8

let score = 0

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const btnStart = document.querySelector('.btn-start')
const btnPause = document.querySelector('.btn-pause')
const scoreEl = document.querySelector('#score')

let direction
const DIR = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
}

// ctx.strokeStyle = '#616161'
ctx.strokeStyle = '#27373F'
ctx.fillStyle = '#fff'

let snake = []
let food = null
let paused = false
let needsGrowth = false
let gameOver = false

let lastUpdate, lastFood, tick
let state
let flash = false
let lastKeyPressed

function update() {
    tick = Date.now()
    
    if (gameOver) {
        flash = true
        return
    }
    
    if (tick - lastUpdate > 500 / difficulty) {
        if (lastKeyPressed && lastKeyPressed !== direction) {
            setDirection(lastKeyPressed)
        }
        
        moveSnake()
        lastUpdate = tick
    }
    
    if (!food || (tick - lastFood > foodTreshold())) {
        putFood()
    }
    
    if (headMeetsFood()) {
        needsGrowth = true
        food = null
        putFood()
        setScore(score + difficulty)
    }
}

function foodTreshold() {
    return (5000 / difficulty) * cellsNo
}

function hasCollisions() {
    const head = snake[0]
    const check = snake.concat([])
    check.shift()
    return check.find(
        c => c.x === head.x && c.y === head.y
    )
}

function snakeContains(cell) {
    return snake.find(c => c.x === cell.x && c.y === cell.y)
}

function headMeetsFood() {
    const head = snake[0]
    return food && (head.x == food.x && head.y === food.y)
}

function moveSnake() {
    const head = snake[0]
    const next = Object.assign({}, head)
    
    switch(direction) {
        case DIR.LEFT:
            --next.x;
            break;
        case DIR.UP:
            --next.y;
            break;
        case DIR.RIGHT:
            ++next.x;
            break;
        case DIR.DOWN:
            ++next.y;
            break;
    }
    
    if (next.x >= cellsNo) next.x = 0
    if (next.y >= cellsNo) next.y = 0
    if (next.x < 0) next.x = cellsNo - 1
    if (next.y < 0) next.y = cellsNo - 1
    
    // Check for collision before moving
    if (hasCollisions()) {
        gameOver = true
        return
    }

    if (!needsGrowth) {
        snake.pop()
    }
    
    needsGrowth = false
    snake.unshift(next);
}

function putFood() {
    do {
        food = {
            x: Math.floor(Math.random() * cellsNo),
            y: Math.floor(Math.random() * cellsNo)
        }
    } while (snakeContains(food))
    
    lastFood = tick
}

function draw() {
    ctx.clearRect(0, 0, 400, 400)
    drawCells()
    drawFood()
    
    if (flash && Math.floor(Date.now() / 100) % 2 === 0) {
        return
    }
    
    drawSnake()
    
    if (gameOver) {
        drawGameOver()
    }
}

function drawCells() {
    for (var i = 0; i < cellsNo; ++i)
        for (var j = 0; j < cellsNo; ++j) 
            drawCell(i, j)
}

function drawFood() {
    if (food) {    
        ctx.fillStyle = '#FFA000'
        fillCell(food.x, food.y)
        ctx.fillStyle = '#fff'
    }
}

function drawCell(i, j) {
    ctx.strokeRect(
        i * cellSize, 
        j * cellSize, 
        cellSize, cellSize
    )
}

function drawSnake() {
    snake.forEach(
     ({x, y}) => fillCell(x, y)
    )
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, 400, 400)
    
    ctx.fillStyle = 'white'
    ctx.font = '30px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('GAME OVER', 200, 180)
    
    ctx.font = '20px Arial'
    ctx.fillText(`Score: ${score}`, 200, 220)
    ctx.fillText('Press Start to play again', 200, 250)
}

function fillCell(x, y) {
    ctx.beginPath()
    ctx.rect(
        x * cellSize, 
        y * cellSize, 
        cellSize, cellSize
    )
    
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
} 

function setScore(next) {
    score = next
    scoreEl.textContent = `Score: ${score}`
}

function startGame() {
    btnStart.textContent = 'Restart'
    flash = false
    gameOver = false
    lastKeyPressed = null
    food = null
    setScore(0)
    direction = DIR.RIGHT // Start moving right for better gameplay
    lastFood = lastUpdate = Date.now()
    paused = false
    btnPause.textContent = 'Pause'
    
    const startX = Math.floor(cellsNo/2)
    snake = [
        {x: startX, y: 15},
        {x: startX-1, y: 15},
        {x: startX-2, y: 15},
        {x: startX-3, y: 15}
    ]
    
    setTimeout(putFood, 500)
}

function loop() {
    requestAnimationFrame(loop)
    draw()
    
    if (paused || gameOver) return
    update()
}

requestAnimationFrame(loop)

btnStart.addEventListener('click', startGame)
btnPause.addEventListener('click', togglePause)

function togglePause() {
    if (gameOver) return
    
    paused = !paused
    btnPause.textContent = paused ? 'Resume' : 'Pause'
}

window.addEventListener('keydown', onKeyDown)

function onKeyDown({keyCode}) {
    // Prevent reversing direction
    switch (true) {
        case (keyCode === DIR.DOWN && direction === DIR.UP):
        case (keyCode === DIR.UP && direction === DIR.DOWN):    
        case (keyCode === DIR.LEFT && direction === DIR.RIGHT):
        case (keyCode === DIR.RIGHT && direction === DIR.LEFT):
            return 
    }
    
    // Check if it's a valid direction key
    if ([DIR.LEFT, DIR.UP, DIR.RIGHT, DIR.DOWN].includes(keyCode)) {
        lastKeyPressed = keyCode
        
        // If game is paused and a direction key is pressed, unpause
        if (paused && !gameOver) {
            togglePause()
        }
    }
    
    // Space bar toggle pause
    if (keyCode === 32) {
        togglePause()
    }
}

function setDirection(keyCode) {
    direction = keyCode
}

function checkFood() {
    if (!food) return
    
    if (food.x >= cellsNo) {
        food.x = cellsNo - 1
    }
    
    if (food.y >= cellsNo) {
        food.y = cellsNo - 1
    }
}

class RangeSlider {
    constructor(el, cb) {
        this.input = el.querySelector('input')
        this.slider = el.querySelector('.range_inputSlider')
        this.value = el.querySelector('.range_inputValue')
        
        this.input.addEventListener('input', _ => this.onChange())
        this.input.addEventListener('keydown', e => {
            e.preventDefault()    
        })
        
        this.onChangeCallback = cb
        this.onChange()
    }
    
    onChange() {
        const max = parseInt(this.input.max)
        const min = parseInt(this.input.min)
        const value = parseInt(this.input.value)
        const percentage = (value - min) / (max - min)
        
        this.value.textContent = this.input.value
        this.slider.style.transform = `scaleX(${percentage})`
        this.onChangeCallback(this.input.value)
    }
}

// Initialize sliders
new RangeSlider(
    document.querySelector('.range-difficulty'), 
    value => difficulty = Number(value)
)
    
new RangeSlider(
    document.querySelector('.range-columns'),
    value => {
        cellsNo = Number(value)
        cellSize = 400 / cellsNo
        checkFood()
    }
)

// Touch controls
var isPointerDown, pointerStart, pointerPos

function onTouchStart(e) {
    const {clientX, clientY} = e.touches[0]
    isPointerDown = true
    pointerStart = {x: clientX, y: clientY}
    pointerPos = Object.assign({}, pointerStart)
}

function onTouchMove(e) {
    if (!isPointerDown) return
    const {clientX, clientY} = e.touches[0]
    pointerPos = {x: clientX, y: clientY}
}

function onTouchEnd() {
    if (!isPointerDown) return
    isPointerDown = false
    
    const deltaX = pointerStart.x - pointerPos.x
    const deltaY = pointerStart.y - pointerPos.y
    const keyCode = touchToKeyCode(deltaX, deltaY)
    
    if (keyCode) onKeyDown({keyCode})
}
 
function touchToKeyCode(x, y) {
    let keyCode
    const threshold = 10 // Minimum swipe distance
    
    if (Math.abs(x) < threshold && Math.abs(y) < threshold) {
        return null // Too small movement, ignore
    }
    
    if (Math.abs(x) > Math.abs(y)) {
        if (x < 0) {
            keyCode = DIR.RIGHT
        } else {
            keyCode = DIR.LEFT
        } 
    } else {
        if (y < 0) {
            keyCode = DIR.DOWN
        } else {
            keyCode = DIR.UP
        }
    }
    
    return keyCode
}

canvas.addEventListener('touchstart', onTouchStart)
window.addEventListener('touchmove', onTouchMove)
window.addEventListener('touchend', onTouchEnd)

// Initialize game
startGame()
