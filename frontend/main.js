const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const livesText = document.getElementById('livesText');
const statusText = document.getElementById('statusText');


const game = new Game(ctx, livesText, statusText);
game.init();

// 主函数
// 按钮操控，暂时用这个
startBtn.addEventListener('click', () => {
    game.init();
    game.start();
});
