const Game = require("../game");
const Monster = require("../entity/monster");
const Bullet = require("../entity/bullet");
// const Tower = require("../entity/tower"); // 需要时再开

function fakeCtx() {
  return {
    canvas: { width: 800, height: 500 },
    clearRect() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    stroke() {},
    fillRect() {},
    arc() {},
    fill() {},
  };
}

function fakeText() {
  return { textContent: "" };
}

describe("Protecting carrot core logic", () => {
  test("init should reset state and start wave 1", () => {
    const game = new Game(fakeCtx(), fakeText(), fakeText(), fakeText());
    game.init();

    expect(game.carrotLives).toBe(10);
    expect(game.wave).toBe(1);
    // 你目前 startWave 里是 this.toSpawn = this.wave * 2
    expect(game.toSpawn).toBe(2);
    expect(game.monsters.length).toBe(0);
    expect(game.bullets.length).toBe(0);
    expect(game.towers.length).toBe(1);
  });

  test("wave should advance when current wave finished", () => {
    const game = new Game(fakeCtx(), fakeText(), fakeText(), fakeText());
    game.init();

    // 模拟：本波怪已经出完 + 场上没有怪
    game.toSpawn = 0;
    game.monsters = [];

    game.update(0.016);

    expect(game.wave).toBe(2);
  });

  test("tower should shoot bullet when monster in range", () => {
    const game = new Game(fakeCtx(), fakeText(), fakeText(), fakeText());
    game.init();

    const m = new Monster(420, 200);
    m.hp = 10;
    m.alive = true;

    game.monsters = [m];

    // 让塔立刻能开火
    game.towers[0].cooldown = 0;

    game.update(0.016);

    expect(game.bullets.length).toBeGreaterThan(0);
  });

  test("bullet should reduce monster hp and kill when hp <= 0", () => {
    const m = new Monster(100, 100);
    m.hp = 1;
    m.alive = true;

    const b = new Bullet(100, 100, m);

    // 让子弹立即命中（同坐标）
    b.update(0.016);

    expect(m.alive).toBe(false);
    expect(b.alive).toBe(false);
  });

  test("game should end with win when reaching maxWaves and wave finished", () => {
    const status = fakeText();
    const game = new Game(fakeCtx(), fakeText(), status, fakeText());
    game.maxWaves = 2;

    game.init();
    // 强行到最后一波
    game.startWave(2);

    game.toSpawn = 0;
    game.monsters = [];

    game.update(0.016);

    expect(game.running).toBe(false);
    expect(status.textContent).toMatch(/Win/i);
  });
});
