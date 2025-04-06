const boidsCanvas = document.getElementById('effect-canvas');
const boidsCtx = boidsCanvas.getContext('2d');

function lerp(a, b, t) {
    return a + (b - a) * t;
}

let frameCount = 0;

// Resize canvas to fit window
function resizeBoidsCanvas() {
    boidsCanvas.width = window.innerWidth;
    boidsCanvas.height = window.innerHeight; // leave some room for sliders
}

const settings = {
    count: 250,           // Number of boids. Higher values increase density.
    speed: 10,            // Base speed of boids. Lower values make them calmer.
    perception: 100,      // Radius in which boids interact with others.
    alignment: 25,        // How strongly boids align with their neighbors.
    cohesion: 25,         // How strongly boids are drawn toward the group center.
    separation: 35        // How strongly boids avoid crowding others.
};



let mousePosition = { x: 0, y: 0 };



class Boid {
    constructor() {
        this.position = {
            x: Math.random() * boidsCanvas.width,
            y: Math.random() * boidsCanvas.height
        };
        const angle = Math.random() * Math.PI * 2;
        this.velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
        this.acceleration = { x: 0, y: 0 };
        this.maxForce = 0.2;
        this.maxSpeed = 2;
        this.size = 20;
    }
    
    edges() {
        // Wrap around the screen
        if (this.position.x > boidsCanvas.width) this.position.x = 0;
        else if (this.position.x < 0) this.position.x = boidsCanvas.width;
        if (this.position.y > boidsCanvas.height) this.position.y = 0;
        else if (this.position.y < 0) this.position.y = boidsCanvas.height;
    }

    update() {
        // Compute target velocities based on acceleration
        const targetVelocityX = this.velocity.x + this.acceleration.x;
        const targetVelocityY = this.velocity.y + this.acceleration.y;
    
        // Lerp towards the target velocity for smoother turning
        this.velocity.x = lerp(this.velocity.x, targetVelocityX, 0.1);
        this.velocity.y = lerp(this.velocity.y, targetVelocityY, 0.1);
    
        // Then update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    
        // Limit speed
        const speed = Math.hypot(this.velocity.x, this.velocity.y);
        const desiredSpeed = settings.speed;
        if (speed > desiredSpeed) {
            this.velocity.x = (this.velocity.x / speed) * desiredSpeed;
            this.velocity.y = (this.velocity.y / speed) * desiredSpeed;
        }
    
        // Reset acceleration
        this.acceleration.x = 0;
        this.acceleration.y = 0;
    }

    flock(boids) {
        const alignmentForce = this.align(boids);
        const cohesionForce = this.cohesion(boids);
        const separationForce = this.separation(boids);
        const avoidMouseForce = this.avoidMouse();

        // sliders values
        const alignMult = settings.alignment / 50;     // ~0 to 2
        const cohMult = settings.cohesion / 50;        // ~0 to 2
        const sepMult = settings.separation / 50;      // ~0 to 2

        this.acceleration.x += alignmentForce.x * alignMult;
        this.acceleration.y += alignmentForce.y * alignMult;
        this.acceleration.x += cohesionForce.x * cohMult;
        this.acceleration.y += cohesionForce.y * cohMult;
        this.acceleration.x += separationForce.x * sepMult;
        this.acceleration.y += separationForce.y * sepMult;
        this.acceleration.x += avoidMouseForce.x;
        this.acceleration.y += avoidMouseForce.y;
    }

    align(boids) {
        const perceptionRadius = settings.perception;
        const steering = { x: 0, y: 0 };
        let total = 0;
        for (const other of boids) {
            const d = boidDist(this.position, other.position);
            if (other !== this && d < perceptionRadius) {
                steering.x += other.velocity.x;
                steering.y += other.velocity.y;
                total++;
            }
        }
        if (total > 0) {
            steering.x /= total;
            steering.y /= total;
            // steer towards that direction
            const mag = Math.hypot(steering.x, steering.y);
            if (mag > 0) {
                steering.x = (steering.x / mag) * this.maxSpeed;
                steering.y = (steering.y / mag) * this.maxSpeed;
            }
            steering.x -= this.velocity.x;
            steering.y -= this.velocity.y;
            limitForce(steering, this.maxForce);
        }
        return steering;
    }

    cohesion(boids) {
        const perceptionRadius = settings.perception;
        const steering = { x: 0, y: 0 };
        let total = 0;
        for (const other of boids) {
            const d = boidDist(this.position, other.position);
            if (other !== this && d < perceptionRadius) {
                steering.x += other.position.x;
                steering.y += other.position.y;
                total++;
            }
        }
        if (total > 0) {
            steering.x /= total;
            steering.y /= total;
            steering.x -= this.position.x;
            steering.y -= this.position.y;
            const mag = Math.hypot(steering.x, steering.y);
            if (mag > 0) {
                steering.x = (steering.x / mag) * this.maxSpeed;
                steering.y = (steering.y / mag) * this.maxSpeed;
            }
            steering.x -= this.velocity.x;
            steering.y -= this.velocity.y;
            limitForce(steering, this.maxForce);
        }
        return steering;
    }

    separation(boids) {
        const perceptionRadius = settings.perception / 2; // separation smaller radius
        const steering = { x: 0, y: 0 };
        let total = 0;
        for (const other of boids) {
            const d = boidDist(this.position, other.position);
            if (other !== this && d < perceptionRadius) {
                const diff = {
                    x: this.position.x - other.position.x,
                    y: this.position.y - other.position.y
                };
                const mag = Math.hypot(diff.x, diff.y) || 1;
                diff.x /= mag; 
                diff.y /= mag;
                steering.x += diff.x;
                steering.y += diff.y;
                total++;
            }
        }
        if (total > 0) {
            steering.x /= total;
            steering.y /= total;
            const mag = Math.hypot(steering.x, steering.y);
            if (mag > 0) {
                steering.x = (steering.x / mag) * this.maxSpeed;
                steering.y = (steering.y / mag) * this.maxSpeed;
            }
            steering.x -= this.velocity.x;
            steering.y -= this.velocity.y;
            limitForce(steering, this.maxForce);
        }
        return steering;
    }

    avoidMouse() {
        const perceptionRadius = 250; // radius to start avoiding mouse
        const steering = { x: 0, y: 0 };
        const d = boidDist(this.position, mousePosition);
        if (d < perceptionRadius) {
            const diff = {
                x: this.position.x - mousePosition.x,
                y: this.position.y - mousePosition.y
            };
            const mag = Math.hypot(diff.x, diff.y) || 1;
            diff.x /= mag; 
            diff.y /= mag;
            steering.x += diff.x;
            steering.y += diff.y;
            const magSteering = Math.hypot(steering.x, steering.y);
            if (magSteering > 0) {
                steering.x = (steering.x / magSteering) * this.maxSpeed;
                steering.y = (steering.y / magSteering) * this.maxSpeed;
            }
            steering.x -= this.velocity.x;
            steering.y -= this.velocity.y;
            limitForce(steering, this.maxForce);
        }
        return steering;
    }

    getColor() {
        // Cool color function
        const h = (frameCount * 0.5 + this.position.x) % 360;
        const s = 25;
        const l = 50;
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    draw(ctx) {
        const angle = Math.atan2(this.velocity.y, this.velocity.x);
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(this.size, 0);
        ctx.lineTo(-this.size, this.size / 2);
        ctx.lineTo(-this.size, -this.size / 2);
        ctx.closePath();
        ctx.fillStyle = this.getColor();
        ctx.fill();
        ctx.restore();
    }
}

function boidDist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function limitForce(vec, max) {
    const m = Math.hypot(vec.x, vec.y);
    if (m > max) {
        vec.x = (vec.x / m) * max;
        vec.y = (vec.y / m) * max;
    }
}

let boids = [];

function initBoids() {
    boids = [];
    const count = parseInt(settings.count, 10);
    for (let i = 0; i < count; i++) {
        boids.push(new Boid());
    }
}



// Init on load
initBoids();

function animate() {
    frameCount++;
    requestAnimationFrame(animate);
    boidsCtx.clearRect(0, 0, boidsCanvas.width, boidsCanvas.height);

    // Flock and update
    for (const boid of boids) {
        boid.flock(boids);
        boid.update();
        boid.edges();
        boid.draw(boidsCtx);
    }
}

function setBoidCount(value) {
    settings.count = value;
    const doInc = value > boids.length;
    const diff = Math.abs(value - boids.length);
    if (doInc) {
        for (let i = 0; i < diff; i++) {
            boids.push(new Boid());
        }
    } else {
        boids.splice(value, diff);
    }
}

function enableBoids(){
    document.getElementById('filter-div').style = "filter: blur(15px);"
    window.addEventListener('resize', resizeBoidsCanvas);
    resizeBoidsCanvas();
    boidsCanvas.addEventListener('mousemove', (event) => {
        const rect = boidsCanvas.getBoundingClientRect(); // Get canvas position and size
        mousePosition = {
            x: (event.clientX - rect.left) * (boidsCanvas.width / rect.width),
            y: (event.clientY - rect.top) * (boidsCanvas.height / rect.height)
        };
    });
    initBoids();
    animate();
    regulatorUpdate();
}