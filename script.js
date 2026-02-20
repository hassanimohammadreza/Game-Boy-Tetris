const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameOver = false;
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

let shakeOffset = { intensity: 0 };
let shakeTime = 0;

let score = 0;
document.getElementById("score").innerText = score;

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
const COLORS = ["#306230"];
const TETROMINOS = [
    [[1,1,1,1]],
    [[2,0,0],
     [2,2,2]],
    [[0,0,3],
     [3,3,3]],
    [[4,4],
     [4,4]],
    [[0,5,5],
     [5,5,0]],
    [[0,6,0],
     [6,6,6]],
    [[7,7,0],
     [0,7,7]]
];

let current = createTetromino();
let nextDrop = Date.now();

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

document.addEventListener("keydown", () => {
    if (audioCtx.state === "suspended") audioCtx.resume();
}, { once: true });

function playBeep(freq = 440, duration = 0.1) {
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = freq;
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.start();
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    oscillator.stop(audioCtx.currentTime + duration);
}

function createTetromino() {
    const type = Math.floor(Math.random() * TETROMINOS.length);
    return { shape: TETROMINOS[type], x: Math.floor(COLS/2)-1, y: 0 };
}

function drawBlock(x, y) {
    const px = x * BLOCK_SIZE;
    const py = y * BLOCK_SIZE;
    ctx.fillStyle = "#306230";
    ctx.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fillStyle = "#9bbc0f";
    ctx.fillRect(px, py, BLOCK_SIZE, 4);
    ctx.fillRect(px, py, 4, BLOCK_SIZE);
    ctx.fillStyle = "#0f380f";
    ctx.fillRect(px, py + BLOCK_SIZE - 4, BLOCK_SIZE, 4);
    ctx.fillRect(px + BLOCK_SIZE - 4, py, 4, BLOCK_SIZE);
}

function shake(duration = 100, intensity = 5) {
    shakeTime = duration;
    shakeOffset.intensity = intensity;
}

function drawBoard() {
    ctx.save();
    if (shakeTime > 0) {
        const dx = (Math.random()-0.5) * shakeOffset.intensity * 2;
        const dy = (Math.random()-0.5) * shakeOffset.intensity * 2;
        ctx.translate(dx, dy);
        shakeTime -= 16;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++) if(board[r][c]) drawBlock(c,r);
    for (let r=0; r<current.shape.length; r++) for (let c=0; c<current.shape[r].length; c++) if(current.shape[r][c]) drawBlock(current.x+c, current.y+r);
    ctx.restore();
}

function scaleGame() {
    const container = document.querySelector(".container");

    const scale = Math.min(
        1,
        window.innerWidth / container.offsetWidth,
        window.innerHeight / container.offsetHeight
    );

    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = "top center";
}

window.addEventListener("resize", scaleGame);
window.addEventListener("load", scaleGame);

function collision(xOffset, yOffset, shape) {
    for (let r=0; r<shape.length; r++) for (let c=0; c<shape[r].length; c++) {
        if(shape[r][c]){
            const newX = current.x+c+xOffset;
            const newY = current.y+r+yOffset;
            if(newX<0 || newX>=COLS || newY>=ROWS || (newY>=0 && board[newY][newX])) return true;
        }
    }
    return false;
}

function merge() {
    for (let r=0; r<current.shape.length; r++) for (let c=0; c<current.shape[r].length; c++) if(current.shape[r][c]) board[current.y+r][current.x+c]=1;
}

function clearLines() {
    let lines=0;
    for(let r=ROWS-1;r>=0;r--){
        if(board[r].every(cell=>cell!==0)){
            board.splice(r,1);
            board.unshift(Array(COLS).fill(0));
            lines++;
        }
    }
    if(lines>0){
        playBeep(200,0.2);
        score += lines*10;
        document.getElementById("score").innerText=score;
    }
}

function rotate(shape){
    const rows=shape.length;
    const cols=shape[0].length;
    let newShape=Array.from({length:cols},()=>Array(rows).fill(0));
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) newShape[c][rows-1-r]=shape[r][c];
    return newShape;
}

const restartButton = document.getElementById("restartButton");

function drawGameOver() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    ctx.save();
    ctx.fillStyle = "#0f380f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 250);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#9bbc0f";
    ctx.font = "bold 28px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40);
    ctx.globalAlpha = 1;
    ctx.restore();

    restartButton.style.display = "block";
}

restartButton.addEventListener("click", () => {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    score = 0;
    document.getElementById("score").innerText = score;
    current = createTetromino();
    gameOver = false;
    shakeTime = 0;
    shakeOffset.intensity = 0;

    restartButton.style.display = "none";
    playBeep(800, 0.1);
});



document.addEventListener("keydown", event => {
    if(gameOver) return;
    if(event.key==="ArrowLeft" && !collision(-1,0,current.shape)) current.x--;
    if(event.key==="ArrowRight" && !collision(1,0,current.shape)) current.x++;
    if(event.key==="ArrowDown" && !collision(0,1,current.shape)) current.y++;
    if(event.key==="ArrowUp"){
        const rotated = rotate(current.shape);
        if(!collision(0,0,rotated)){
            current.shape = rotated;
            playBeep(600,0.05);
        } else {
            if(!collision(-1,0,rotated)) current.x--;
            else if(!collision(1,0,rotated)) current.x++;
        }
    }
});

function update(){
    if(gameOver){
        drawGameOver();
        requestAnimationFrame(update);
        return;
    }

    const now=Date.now();
    if(now-nextDrop>500){
        if(!collision(0,1,current.shape)) current.y++;
        else{
            merge();
            playBeep(300,0.05);
            shake(80,4);
            clearLines();
            current=createTetromino();
        if(collision(0,0,current.shape)) {
            gameOver = true;
            playBeep(120,0.5);
            shake(200,5);
            restartButton.style.display = "block";
        }
        }
        nextDrop=now;
    }

    drawBoard();
    requestAnimationFrame(update);
}

update();
