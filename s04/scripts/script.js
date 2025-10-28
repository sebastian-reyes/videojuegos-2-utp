const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// cargar sonidos
const soundHit = new Audio('audio/hit.ogg');
const soundCoin = new Audio('audio/coin.wav');
soundHit.volume = 0.6;
soundCoin.volume = 0.9;

let lastHitTime = 0;

//Rastreo de teclas
let keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

//Definicion del jugador
const player = {
    x: 50,
    y: 50,
    w: 30,
    h: 30,
    color: 'red',
    speed: 3
}

//Definicion del nivel
const levels = [
    {
        obstacles: [
            { x: 100, y: 150, w: 400, h: 20 },
            { x: 300, y: 250, w: 20, h: 100 }
        ],
        coins: [
            { x: 500, y: 50, collected: false },
            { x: 50, y: 300, collected: false }
        ]
    },
    {
        obstacles: [
            { x: 200, y: 100, w: 200, h: 20 },
            { x: 200, y: 200, w: 20, h: 100 },
            { x: 400, y: 200, w: 20, h: 100 }
        ],
        coins: [
            { x: 50, y: 50, collected: false },
            { x: 550, y: 350, collected: false },
            { x: 300, y: 180, collected: false }
        ]
    },
    {
        obstacles: [
            { x: 150, y: 100, w: 300, h: 20 },
            { x: 150, y: 200, w: 20, h: 150 },
        ],
        coins: [
            { x: 100, y: 100, collected: false },
            { x: 400, y: 300, collected: false },
            { x: 550, y: 50, collected: false },
            { x: 50, y: 350, collected: false }
        ]
    }
];

let currentLevel = 0;

function rectsCollide(r1, r2) {
    return (
        r1.x < r2.x + r2.w &&
        r1.x + r1.w > r2.x &&
        r1.y < r2.y + r2.h &&
        r1.y + r1.h > r2.y
    );
}

function drawRecrt(rect) {
    ctx.fillStyle = rect.color || 'white';
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
}

function update() {
    const level = levels[currentLevel];

    // Movimiento del jugador
    if (keys['w']) player.y -= player.speed;
    if (keys['s']) player.y += player.speed;
    if (keys['a']) player.x -= player.speed;
    if (keys['d']) player.x += player.speed;

    // Mantener dentro de los límites del canvas
    player.x = Math.max(0, Math.min(player.x, canvas.width - player.w));
    player.y = Math.max(0, Math.min(player.y, canvas.height - player.h));


    for (let obs of level.obstacles) {
        if (rectsCollide(player, obs)) {
            const now = Date.now();
            if (now - lastHitTime > 200) {
                try { soundHit.currentTime = 0; soundHit.play(); } catch (e) { }
                lastHitTime = now;
            }
            if (keys['w']) player.y += player.speed;
            if (keys['s']) player.y -= player.speed;
            if (keys['a']) player.x += player.speed;
            if (keys['d']) player.x -= player.speed;

            // Asegurarse de que el jugador sigue dentro de los límites del canvas después de la corrección
            player.x = Math.max(0, Math.min(player.x, canvas.width - player.w));
            player.y = Math.max(0, Math.min(player.y, canvas.height - player.h));
        }
    }

    for (let coin of level.coins) {
        if (!coin.collected) {
            if (player.x < coin.x + 20 && player.x + player.w > coin.x &&
                player.y < coin.y + 20 && player.y + player.h > coin.y) {
                coin.collected = true;
                try { soundCoin.currentTime = 0; soundCoin.play(); } catch (e) { }
            }
        }
    }

    const allCollected = level.coins.every(c => c.collected);
    if (allCollected) {
        if (currentLevel < levels.length - 1) {
            currentLevel++;
            resetLevel();
        } else {
            alert("¡Has completado todos los niveles!");
            currentLevel = 0;
            resetLevel();
        }
    }
}

function resetLevel() {
    player.x = 50;
    player.y = 50;
    levels[currentLevel].coins.forEach(c => c.collected = false);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRecrt(player);
    const level = levels[currentLevel];

    for (let obs of level.obstacles) {
        drawRecrt({ ...obs, color: 'gray' });
    }

    for (let coin of level.coins) {
        if (!coin.collected) {
            ctx.fillStyle = 'gold';
            ctx.beginPath();
            ctx.arc(coin.x + 10, coin.y + 10, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.fillStyle = 'white';
    ctx.fillText(`Nivel: ${currentLevel + 1}`, 10, 20);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

resetLevel();
gameLoop();
