// 子弹类
class Bullet {
    constructor (x, y, target) {
        this.x = x
        this.y = y
        this.target = target

        this.speed = 300
        this.damage = 1

        // 子弹半径，碰撞检测
        this.radius = 4
        this.hitR = 10

        this.alive = true
    }

    update(dt) {
        if (!this.alive) return;

        // 目标没了 or 已死
        if (!this.target || !this.target.alive) {
            this.alive = false;
            return;
        }

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 命中判定
        if (dist <= this.hitR) {
            this.hit();
            return;
        }

        const nx = dx / dist;
        const ny = dy / dist;

        // 飞行
        this.x += nx * this.speed * dt;
        this.y += ny * this.speed * dt;
    }

    // hit enemy and decrease hp
    hit() {
        if (!this.target || !this.target.alive) {
        this.alive = false;
        return;
        }

        this.target.hp -= this.damage;
        if (this.target.hp <= 0) {
        this.target.alive = false;
        }

        this.alive = false;
    }

    draw(ctx) {
        if (!this.alive) return;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#333";
        ctx.fill();
    }
}