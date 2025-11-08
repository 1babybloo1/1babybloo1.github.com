// Custom Cursor
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Add hover effect to cursor on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .menu-item, .stat-card, .link-card');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursor.style.backgroundColor = 'rgba(137, 207, 240, 0.5)';
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.backgroundColor = 'rgba(137, 207, 240, 0.3)';
    });
});

// Particle Effect for Side Menu
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = 80;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.vx = Math.random() * 0.5 - 0.25;
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.vx = Math.random() * 0.5 - 0.25;
        this.alpha = Math.random() * 0.5 + 0.5;
    }
    
    update() {
        this.y -= this.speedY;
        this.x += this.vx;
        
        if (this.y < 0) {
            this.y = canvas.height;
            this.x = Math.random() * canvas.width;
        }
        
        if (this.x < 0 || this.x > canvas.width) {
            this.vx *= -1;
        }
    }
    
    draw() {
        ctx.fillStyle = `rgba(137, 207, 240, ${this.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(137, 207, 240, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
const particles = [];
for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
}

// Animate particles
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Draw connections
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 80) {
                ctx.strokeStyle = `rgba(137, 207, 240, ${0.2 * (1 - distance / 80)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

// Smooth Scroll with Offset for Menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offset = 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Hide scroll indicator on scroll
const scrollIndicator = document.querySelector('.scroll-indicator');
let scrollTimeout;

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        scrollIndicator.classList.add('hidden');
    } else {
        scrollIndicator.classList.remove('hidden');
    }
});

// Intersection Observer for Fade In Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Staggered Animation for Stats and Link Items
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.stat-item, .link-card');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    item.classList.add('bounce-in');
                }, index * 150);
            });
            
            // Trigger counter animation for stat numbers
            if (entry.target.id === 'gallery') {
                setTimeout(() => {
                    animateCounters();
                }, 300);
            }
            
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe stats and links sections
const statsSection = document.querySelector('#gallery');
const linksSection = document.querySelector('#links');

if (statsSection) {
    statsObserver.observe(statsSection);
}

if (linksSection) {
    statsObserver.observe(linksSection);
}

// Counter Animation Function
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                counter.textContent = Math.floor(current);
                counter.classList.add('counting');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                counter.classList.remove('counting');
            }
        };
        
        updateCounter();
    });
}

// Parallax Effect for Neon Lights
let scrollY = 0;

window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;
    
    const neonLights = document.querySelectorAll('.neon-light');
    neonLights.forEach((light, index) => {
        const speed = (index + 1) * 0.05;
        light.style.transform = `translateY(${scrollY * speed}px)`;
    });
});

// Glass Background Parallax
window.addEventListener('scroll', () => {
    const glassBackground = document.querySelector('.glass-background');
    if (glassBackground) {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector('.hero-section').offsetHeight;
        
        if (scrolled < heroHeight) {
            const opacity = 1 - (scrolled / heroHeight) * 0.5;
            glassBackground.style.opacity = opacity;
        }
    }
});

// Add active state to menu items based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const menuItems = document.querySelectorAll('.menu-item');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// Add dynamic glow effect to cards on mouse move
document.querySelectorAll('.stat-card, .link-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.background = `
            radial-gradient(
                circle at ${x}px ${y}px,
                rgba(137, 207, 240, 0.25),
                rgba(137, 207, 240, 0.1)
            )
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.background = 'rgba(137, 207, 240, 0.1)';
    });
});

// Update canvas size on menu hover
const sideMenu = document.querySelector('.side-menu');
sideMenu.addEventListener('mouseenter', () => {
    canvas.width = 300;
});

sideMenu.addEventListener('mouseleave', () => {
    canvas.width = 80;
});

// Prevent default cursor on the entire page
document.body.style.cursor = 'none';
document.querySelectorAll('*').forEach(element => {
    element.style.cursor = 'none';
});

console.log('Portfolio website loaded successfully!');
