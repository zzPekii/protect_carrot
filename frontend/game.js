// 游戏类

class Game {
    constructor(ctx, livesText, statusText) {
        this.ctx = ctx;
        this.livesText = livesText;
        this.statusText = statusText;

        this.monsters = [];
        this.towers = [];
        this.bullets = [];
        this.carrotLives = 10;

        this.running = false;
        this.lastTimestamp = 0;
    }

    init() {
        this.carrotLives = 10;
        this.monsters = [];
        this.towers = [];
        this.statusText.textContent = '';
        this.updateLivesText();

        // create tower (still plain object)
        this.towers.push(new Tower(400, 200));


        // create monsters
        for (let i = 0; i < 5; i++) {
            this.monsters.push(new Monster(50 - i * 60, 225));
        }
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
        this.monsters.forEach(m => m.update(dt, this));
        this.monsters = this.monsters.filter(m => m.alive);
        this.towers.forEach(t => t.update(dt, this.monsters, this.bullets));
        this.bullets.forEach(b => b.update(dt));
        this.bullets = this.bullets.filter(b => b.alive);

        this.monsters = this.monsters.filter(m => m.alive);

        if (this.monsters.length === 0 && this.carrotLives > 0) {
            this.gameOver(true);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.drawMap();
        this.towers.forEach(t => t.draw(this.ctx));
        this.monsters.forEach(m => m.draw(this.ctx));
        this.bullets.forEach(b => b.draw(ctx));
        this.drawCarrot();
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

    gameOver(win) {
        this.running = false;
        this.statusText.textContent = win ? 'You Win!' : 'Carrot eaten!';
    }
}
