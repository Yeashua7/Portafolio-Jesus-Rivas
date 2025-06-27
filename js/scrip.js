// ===== VARIABLES GLOBALES =====
let musicPlaying = true;
let currentSection = 'home';

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupMusicControl();
    setupScrollAnimations();
    setupContactForm();
    setupSkillLevels();
    setupParticles();
    setupSmoothScroll();
    animateOnScroll();
}

function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function setupMusicControl() {
    const musicBtn = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    if (musicBtn && backgroundMusic) {
        backgroundMusic.volume = 0.3;
        const playPromise = backgroundMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicPlaying = true;
                updateMusicButton();
            }).catch(() => {
                musicPlaying = false;
                updateMusicButton();
            });
        }
        musicBtn.addEventListener('click', toggleMusic);
    }
}

function toggleMusic() {
    const backgroundMusic = document.getElementById('background-music');
    if (musicPlaying) {
        backgroundMusic.pause();
        musicPlaying = false;
    } else {
        backgroundMusic.play();
        musicPlaying = true;
    }
    updateMusicButton();
}

function updateMusicButton() {
    const musicBtn = document.getElementById('music-toggle');
    const icon = musicBtn.querySelector('i');
    if (musicPlaying) {
        icon.className = 'fas fa-volume-up';
        musicBtn.style.background = 'var(--gradient-primary)';
    } else {
        icon.className = 'fas fa-volume-mute';
        musicBtn.style.background = 'var(--gradient-secondary)';
    }
}

function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1 && document.querySelector(targetId)) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    const animateElements = document.querySelectorAll('.skill-item, .project-card, .stat-card, .timeline-item');
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.hero-content, .about-content');
    elements.forEach(el => {
        el.classList.add('fade-in-up');
    });
}

function setupSkillLevels() {
    const skillLevels = document.querySelectorAll('.skill-level');
    skillLevels.forEach(skill => {
        const level = skill.getAttribute('data-level');
        if (level) {
            skill.style.setProperty('--level', level + '%');
        }
    });
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    if (!data.name || !data.email || !data.message) {
        showNotification('Por favor, completa todos los campos requeridos.', 'error');
        return;
    }
    if (!isValidEmail(data.email)) {
        showNotification('Por favor, ingresa un email válido.', 'error');
        return;
    }
    showNotification('¡Mensaje enviado exitosamente! Te contactaré pronto.', 'success');
    e.target.reset();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--gradient-primary)' : type === 'error' ? 'var(--gradient-secondary)' : 'var(--bg-card)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-card);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function setupParticles() {
    createFloatingParticles();
}

function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(particleContainer);
    for (let i = 0; i < 20; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 4 + 2;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const duration = Math.random() * 20 + 10;
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: var(--primary-color);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        opacity: 0.3;
        animation: floatParticle ${duration}s infinite linear;
    `;
    container.appendChild(particle);
    setTimeout(() => {
        container.removeChild(particle);
        createParticle(container);
    }, duration * 1000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.3;
        }
        90% {
            opacity: 0.3;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .particles-container {
        overflow: hidden;
    }
    .particle {
        filter: blur(0.5px);
    }
`;
document.head.appendChild(style);

let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});
function activateEasterEgg() {
    showNotification('🚀 ¡Código Konami activado! Modo desarrollador ON', 'success');
    document.body.style.animation = 'rainbow 2s infinite';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

console.log('🚀 Portafolio de Jesús Rivas cargado exitosamente!');
console.log('💡 Tip: Prueba el código Konami: ↑↑↓↓←→←→BA');
