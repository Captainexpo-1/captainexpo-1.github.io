let lastFrameTime = performance.now();
let fps = 0;

let rollingAverage = [60];

function getCurrentFPS() {
    const now = performance.now();
    const delta = now - lastFrameTime;
    lastFrameTime = now;
    fps = 1000 / delta;
    return parseInt(fps); // Returns FPS rounded to 2 decimal places
}

function regulatorUpdate() {
    const curFPS = getCurrentFPS();
    rollingAverage.push(curFPS);
    if (rollingAverage.length > 25) {
        rollingAverage.shift();
    }
    const avgFPS = rollingAverage.reduce((a, b) => a + b) / rollingAverage.length;
    console.log("Average FPS:", avgFPS, "Current FPS:", curFPS, "Boid Count:", settings.count);

    if (avgFPS < 60) {
        setBoidCount(settings.count - 1);
    }
    else if (avgFPS > 100) {
        setBoidCount(settings.count + 1);
        
    }

    requestAnimationFrame(regulatorUpdate);
}
