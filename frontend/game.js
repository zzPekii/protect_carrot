// 游戏类
class Game {
    constructor(ctx, livesText, statusText, waveText) {
        this.ctx = ctx;
        this.livesText = livesText;
        this.statusText = statusText;
        this.waveText = waveText

        this.monsters = []
        this.towers = []
        this.bullets = []
        this.carrotLives = 10

        this.running = false;
        this.lastTimestamp = 0;

        // wave manage
        this.wave = 1;           // 当前波次
        this.maxWaves = 2;       // 一共有几波
        this.spawnInterval = 0.6; // 每只怪间隔(秒)
        this.spawnTimer = 0;      // 计时器
        this.toSpawn = 0;         // 当前波还要生成多少只怪
        this.spawnedInWave = 0;   // 当前波已生成多少只
    }

    init() {
        this.carrotLives = 10
        this.monsters = []
        this.towers = []
        this.bullets = []
        this.statusText.textContent = ''
        this.updateLivesText()
        
        // create tower (still plain object)
        this.towers.push(new Tower(400, 200))

        this.startWave(1)
        this.updateWaveText()
    }

    start() {
        this.running = true;
        this.lastTimestamp = performance.now();
        requestAnimationFrame(this.loop.bind(this));
    }

    loop(timestamp) {
        if (!this.running) return;

        const dt = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame(this.loop.bind(this));
    }

    update(dt) {
        // create monster in interval times
        if (this.toSpawn > 0) {
            this.spawnTimer -= dt;
            if (this.spawnTimer <= 0) {
                const offset = this.spawnedInWave * 60;
                this.monsters.push(new Monster(50 - offset, 225));

                this.spawnedInWave++;
                this.toSpawn--;
                this.spawnTimer = this.spawnInterval;
            }
        }

        this.monsters.forEach(m => m.update(dt, this));
        this.monsters = this.monsters.filter(m => m.alive);

        this.towers.forEach(t => t.update(dt, this.monsters, this.bullets));

        this.bullets.forEach(b => b.update(dt));
        this.bullets = this.bullets.filter(b => b.alive);
        
        this.monsters = this.monsters.filter(m => m.alive);
        const waveFinished = (this.toSpawn === 0 && this.monsters.length === 0)
        if (waveFinished && this.carrotLives > 0) {
            if (this.wave >= this.maxWaves) {
                this.gameOver(true);
            } else {
                this.wave += 1
                this.startWave(this.wave);
            }
        }
    }

    startWave(waveNum) {
        this.wave = waveNum
        // 每波生成5个
        this.toSpawn = this.wave * 2
        this.spawnedInWave = 0;
        this.spawnTimer = 0;
        this.updateWaveText()
    }

    draw() {
        const c = this.ctx.canvas
        this.ctx.clearRect(0, 0, c.width, c.height)

        this.drawMap()
        this.towers.forEach(t => t.draw(this.ctx))
        this.bullets.forEach(b => b.draw(this.ctx))
        this.monsters.forEach(m => m.draw(this.ctx))
        this.drawCarrot()
    }

    drawMap() {
        this.ctx.beginPath();
        this.ctx.moveTo(50, 225);
        this.ctx.lineTo(750, 225);
        this.ctx.stroke();
    }

    drawCarrot() {
        this.ctx.fillStyle = '#ff9900';
        this.ctx.fillRect(750, 200, 40, 50);
    }

    updateLivesText() {
        this.livesText.textContent = `Carrot lives: ${this.carrotLives}`;
    }

    updateWaveText() {
        if (this.waveText) {
            this.waveText.textContent = `Wave: ${this.wave}`;
        }
    }

    gameOver(win) {
        this.running = false;
        this.statusText.textContent = win ? 'You Win!' : 'Carrot eaten!';
    }
}
