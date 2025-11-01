// --- 3D TILT EFFECT ---
const card = document.querySelector('.glass-card');
const maxTilt = 10; // degrees
document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const rotateY = ((mouseX - centerX) / centerX) * maxTilt;
    const rotateX = -((mouseY - centerY) / centerY) * maxTilt;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});
document.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
});

// --- CUSTOM CURSOR WITH SMOOTH TRAILING AND SPEED-BASED SIZING ---
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let lastX = 0;
let lastY = 0;
let speed = 0;

const baseSize = 20; // Base cursor size in pixels
const maxSizeIncrease = 15; // Maximum additional size when moving fast
const smoothness = 0.15; // Lower = more delay/smoothness (0.1-0.3 recommended)

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Calculate speed based on distance moved
    const deltaX = mouseX - lastX;
    const deltaY = mouseY - lastY;
    speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    lastX = mouseX;
    lastY = mouseY;
});

function animateCursor() {
    // Smooth interpolation towards mouse position
    cursorX += (mouseX - cursorX) * smoothness;
    cursorY += (mouseY - cursorY) * smoothness;
    
    // Calculate size based on speed (capped at maxSizeIncrease)
    const sizeIncrease = Math.min(speed * 0.5, maxSizeIncrease);
    const currentSize = baseSize + sizeIncrease;
    
    // Apply position and size
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursor.style.width = currentSize + 'px';
    cursor.style.height = currentSize + 'px';
    
    // Gradually reduce speed for smooth size transition
    speed *= 0.9;
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// --- ANIMATED PARTICLE BACKGROUND ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 100; // How many particles you want

// Set canvas to full screen
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Size between 1 and 3
        this.speedX = Math.random() * 1 - 0.5; // Horizontal speed
        this.speedY = Math.random() * 1 - 0.5; // Vertical speed
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // Reset particle if it goes off screen
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
        }
    }
    draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Particle color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Animation loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas each frame
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

// Initial setup and event listeners
setCanvasSize();
initParticles();
animateParticles();
window.addEventListener('resize', () => {
    setCanvasSize();
    initParticles(); // Re-initialize particles on resize for better distribution
});
