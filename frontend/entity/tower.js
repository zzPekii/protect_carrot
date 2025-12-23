class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 120;
        // 攻击cd
        this.cooldown = 0;
    }

    update(dt, monsters, bullets) {
        this.cooldown -= dt;
        if (this.cooldown > 0) return;

        let target = null;
        let minDist = Infinity;

        monsters.forEach(m => {
            if (!m.alive) return;

            const dx = m.x - this.x;
            const dy = m.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= this.range && dist < minDist) {
                minDist = dist;
                target = m;
            }
        });

        if (target) {
            // create a bullet
            bullets.push(new Bullet(this.x, this.y, target))
            this.cooldown = 0.5;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#ffcc00';
        ctx.fill();
    }
}
