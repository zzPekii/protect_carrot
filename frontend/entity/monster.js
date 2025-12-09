

class Monster {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 60;
        this.hp = 3;
        this.alive = true;
    }

    update(dt, game) {
        if (!this.alive) return;

        this.x += this.speed * dt;

        // reach carrot
        if (this.x >= 750) {
            this.alive = false;
            game.carrotLives -= 1;

            game.updateLivesText();

            if (game.carrotLives <= 0) {
                game.gameOver(false);
            }
        }
    }

    // 换成怪物贴图
    draw(ctx) {
        ctx.fillStyle = '#ff6699';
        ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
    }
}