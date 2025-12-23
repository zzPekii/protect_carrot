const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const livesText = document.getElementById('livesText');
const statusText = document.getElementById('statusText');
const waveText = document.getElementById('waveText')

const game = new Game(ctx, livesText, statusText, waveText);
game.init();

// 主函数
// 按钮操控，暂时用这个
startBtn.addEventListener('click', () => {
    game.init();
    game.start();
});
