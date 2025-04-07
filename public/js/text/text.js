const textCanvas = document.getElementById('effect-canvas');
const textCtx = boidsCanvas.getContext('2d');


let textCanvasWidth = textCanvas.width;
let textCanvasHeight = textCanvas.height;
const fontSize = 12; // Size of each '0' character
const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+!@#$%^&*()_+[]{}|;:,.<>?';
const randomChar = () => randomChars[Math.floor(Math.random() * randomChars.length)];

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function randomScalingFunction() {
    const m = Math.random()
    return m**3;
}
let textLastFrameTime = performance.now();
let deltaTime = 0;

class FallingChar {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.char = randomChar();
    }

    update() {
        this.y += (this.z / textCanvasHeight) * deltaTime * 0.1;
        if (this.y > 1) {
            this.y = 0;
            this.char = randomChar();
        }
    }

    draw() {
        textCtx.fillStyle = `rgba(105, 255, 20, ${this.z})`;
        textCtx.fillText(this.char, textCanvasWidth*this.x, textCanvasHeight*this.y);
    }
}


const CHARS = [];

function initTextCanvas() {
    textCtx.font = `${fontSize}px monospace`;

    for (let i = 0; i < 1000; i ++) {
        CHARS.push(new FallingChar(Math.random(), Math.random(), randomScalingFunction()));
    }
}

let mouseLastFramePosition = { x: 0, y: 0 };



function drawText() {
    textCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';  
    textCtx.fillRect(0, 0, textCanvasWidth, textCanvasHeight);
    
    // Calculate delta time
    const now = performance.now();
    deltaTime = now - textLastFrameTime;
    textLastFrameTime = now;

    CHARS.forEach((char) => {
        char.update();
        char.draw();
    });

    requestAnimationFrame(drawText);
}

resizeTextCanvas();

function resizeTextCanvas() {
    textCanvas.width = window.innerWidth;
    textCanvas.height = window.innerHeight; // leave some room for sliders
    textCanvasWidth = textCanvas.width;
    textCanvasHeight = textCanvas.height;

}

function enableText() {
    window.addEventListener('resize', resizeTextCanvas);
    resizeTextCanvas();
    initTextCanvas();
    drawText();
}

