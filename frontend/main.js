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

    // place some monsters, moving in same time
    for (let i = 0; i < 5; i++) {
        gameState.monsters.push({
        x: 50 - i * 60,   // born separately
        y: 225,
        speed: 60,        // 60 pixel / s
        hp: 3,
        alive: true,
        });
    }
}

function gameLoop(timestamp) {
    if (!gameState.running) {
        // stop, do not update
        return
    }

    const dt = (timestamp - gameState.lastTimestamp) / 1000;
    gameState.lastTimestamp = timestamp

    update(dt);
    draw();

    requestAnimationFrame(gameLoop);
}

// update game logic
function update(dt) {
    // renew monster position
    gameState.monsters.forEach(m => {
        if (!m.alive) {
            return
        }
        m.x += m.speed * dt
        // if monster close to carrot(on the ending)
        if (m.x >= 750) {
            m.alive = false     // delete this monster
            gameState.carrotLives -= 1
            livesText.textContent = `Carrot lives: ${gameState.carrotLives}`

            if (gameState.carrotLives <= 0) {
                gameOver(false)
            }
        }
    })
    // destory monster when it eat carrot
    gameState.monsters = gameState.monsters.filter(m => m.alive)

    // update tower attack
    gameState.towers.forEach(t => {
        // renew attacking cd
        t.cooldown -= dt
        if (t.cooldown > 0) return

        // find a monster
        // need to edit distance
        let target = null;
        let minDist = Infinity;
        gameState.monsters.forEach(m => {
            const dx = m.x - t.x;
            const dy = m.y - t.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= t.range && dist < minDist) {
                minDist = dist;
                target = m;
            }
        });

        if (target) {
            // monster hp -1
            target.hp -= 1;
            t.cooldown = 0.5; // renew attacking cd
            if (target.hp <= 0) {
                target.alive = false;
            }
        }
    })

    // destory unlive monsters
    gameState.monsters = gameState.monsters.filter(m => m.alive)

    // win condition
    if (gameState.monsters.length === 0 && gameState.carrotLives > 0) {
        gameOver(true)
    }
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

// game over
function gameOver(win) {
  gameState.running = false;
  statusText.textContent = win ? 'You Win!' : 'Carrot ate by monsters';
}


// initialize
initGame();