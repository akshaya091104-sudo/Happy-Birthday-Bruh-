/**
 * Particle System for the Starry Background
 */

const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let stars = [];
const particleCount = 0;
const starCount = 40;

// Resize canvas to fill the screen
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Particle Class (for tiny background dots)
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;
        this.opacity = Math.random();
        this.speed = Math.random() * 0.1;
        this.blinkSpeed = Math.random() * 0.02 + 0.005;
        this.blinkDir = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
        // Subtle drift
        this.y -= this.speed;
        if (this.y < 0) this.y = canvas.height;

        // Twinkling effect
        this.opacity += this.blinkSpeed * this.blinkDir;
        if (this.opacity > 1 || this.opacity < 0.2) {
            this.blinkDir *= -1;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Star Class (for larger, slightly golden stars)
class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.driftX = (Math.random() - 0.5) * 0.05;
        this.driftY = (Math.random() - 0.5) * 0.05;
    }

    update() {
        this.x += this.driftX;
        this.y += this.driftY;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.fillStyle = `rgba(216, 164, 63, ${this.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(216, 164, 63, 0.4)';
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
}

// Initialize particles & stars
function init() {
    particles = [];
    stars = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    stars.forEach(s => {
        s.update();
        s.draw();
    });

    requestAnimationFrame(animate);
}

// Start everything
init();
animate();

// Interactive Mouse Effect
window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Slight shift based on mouse move for depth
    const moveX = (window.innerWidth / 2 - mouseX) * 0.01;
    const moveY = (window.innerHeight / 2 - mouseY) * 0.01;
    
    document.querySelector('.hero-content').style.transform = `translate(${moveX}px, ${-20 + moveY}px)`;
});

// Intersection Observer for Reveal Animations
const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            

            
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

// Cake Blow Interaction
const blowBtn = document.getElementById('blow-btn');
const flames = document.querySelectorAll('.flame');

if (blowBtn) {
    blowBtn.addEventListener('click', () => {
        let delay = 0;
        flames.forEach(flame => {
            setTimeout(() => {
                flame.classList.add('out');
            }, delay);
            delay += 150; // Stagger each flame going out
        });

        setTimeout(() => {
            blowBtn.textContent = 'LEGENDARY! 🎉';
            blowBtn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
            blowBtn.style.borderColor = '#00b894';
            blowBtn.style.color = '#fff';
            createConfetti();
        }, delay);
    });
}

function createConfetti() {
    // Generate a burst of particles from the cake position
    const canvas = document.getElementById('star-canvas');
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const p = new Particle();
            p.reset();
            // Burst from the center of the screen (where cake section is likely centered)
            p.x = window.innerWidth / 2 + (Math.random() - 0.5) * 100;
            p.y = window.innerHeight * 0.7; // Roughly cake height
            p.size = Math.random() * 4 + 2;
            p.speed = Math.random() * 5 + 2;
            p.blinkSpeed = 0.05; // Fast twinkle for confetti
            particles.push(p);
        }, i * 10);
    }
}
// Birthday Letter Button Logic
const openEnvelopeBtn = document.getElementById('open-envelope-btn');
const closeLetterBtn = document.getElementById('close-letter-btn');
const closeLetterMobileBtn = document.getElementById('close-letter-mobile-btn');
const envelopeContainer = document.querySelector('.envelope-container');

const closeLetter = () => {
    // Close envelope
    envelopeContainer.classList.remove('is-open');
    
    // Remove typing animation classes instantly so it resets for next time
    const letterElements = envelopeContainer.querySelectorAll('.letter-para, .letter-closing, .letter-signature, .mobile-close-btn');
    letterElements.forEach(el => el.classList.remove('letter-reveal'));
};

if (openEnvelopeBtn && envelopeContainer) {
    openEnvelopeBtn.addEventListener('click', () => {
        // Open envelope and start paper sliding up
        envelopeContainer.classList.add('is-open');

        // Wait for sliding animation to mostly finish before starting text reveal
        setTimeout(() => {
            const letterElements = envelopeContainer.querySelectorAll('.letter-para, .letter-closing, .letter-signature, .mobile-close-btn');
            letterElements.forEach(el => {
                const delay = el.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    el.classList.add('letter-reveal');
                }, delay);
            });
        }, 1000); // 1 second delay matches the CSS transform timing roughly
    });
}

if (closeLetterBtn && envelopeContainer) {
    closeLetterBtn.addEventListener('click', closeLetter);
}

if (closeLetterMobileBtn && envelopeContainer) {
    closeLetterMobileBtn.addEventListener('click', closeLetter);
}
