// game controller
const gameState = {
    lastTimestamp: 0,
    running: false,
    carrotLives: 10,
    monsters: [],
    towers: [],
}

// 渲染维度
const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

// botton and text
const startBtn = document.getElementById('startBtn')
const livesText = document.getElementById('livesText')
const statusText = document.getElementById('statusText')

// initialize game func
function initGame() {
    gameState.carrotLives = 10
    gameState.monsters = []
    gameState.towers = []
    statusText.textContent = ''
    livesText.textContent = `Carrot lives : ${gameState.carrotLives}`

    // place a tower
    gameState.towers.push({
        x: 400,
        y: 200,
        range: 120,
        cooldown: 0,
    })
}

function gameLoop(timestamp) {
    if (!gameState.running) {
        // stop, do not update
        return
    }

    const dt = (timestamp - gameState.lastTimestamp) / 1000;
    gameState.lastTimestamp = timestamp


}

// update game logic
function update(dt) {
    // TODO update monster position, tower attack, collection, minus life. etc
}

// draw map
function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMap();
  drawTowers();
  drawMonsters();
  drawCarrot();
}

function drawMap() {
    // just simple path, a line
    ctx.beginPath();
    ctx.moveTo(50, 225);
    ctx.lineTo(750, 225);
    ctx.stroke();
}

function drawTowers() {
    gameState.towers.forEach(tower => {
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#ffcc00';
        ctx.fill();
    });
}

function drawMonsters() {
    gameState.monsters.forEach(m => {
        ctx.fillStyle = '#ff6699';
        ctx.fillRect(m.x - 10, m.y - 10, 20, 20);
    });
}

// ending
function drawCarrot() { 
    ctx.fillStyle = '#ff9900';
    ctx.fillRect(750, 200, 40, 50);
}

// start botton
startBtn.addEventListener('click', () => {
    initGame();
    gameState.running = true;
    gameState.lastTimestamp = performance.now();
    requestAnimationFrame(gameLoop);
});

// initialize
initGame();