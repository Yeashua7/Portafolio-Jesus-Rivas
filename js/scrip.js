// ===== VARIABLES GLOBALES =====
let musicPlaying = true;
let currentSection = 'home';

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== INICIALIZACIÓN DE LA APP =====
function initializeApp() {
    setupNavigation();
    setupMusicControl();
    setupScrollAnimations();
    setupContactForm();
    setupSkillLevels();
    setupParticles();
    
    // Smooth scroll para enlaces internos
    setupSmoothScroll();
    
    // Inicializar animaciones
    animateOnScroll();
}

// ===== NAVEGACIÓN =====
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu móvil
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Cerrar menu al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Highlight active section
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

// ===== CONTROL DE MÚSICA =====
function setupMusicControl() {
    const musicBtn = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    
    if (musicBtn && backgroundMusic) {
        // Configurar música de fondo
        backgroundMusic.volume = 0.3;
        
        // Intentar reproducir automáticamente
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

// ===== SMOOTH SCROLL =====
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Altura del navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ANIMACIONES DE SCROLL =====
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

    // Observar elementos que necesitan animación
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

// ===== NIVELES DE HABILIDADES =====
function setupSkillLevels() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    skillLevels.forEach(skill => {
        const level = skill.getAttribute('data-level');
        if (level) {
            skill.style.setProperty('--level', level + '%');
        }
    });
}

// ===== FORMULARIO DE CONTACTO =====
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Animación de labels
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
    
    // Validación básica
    if (!data.name || !data.email || !data.message) {
        showNotification('Por favor, completa todos los campos requeridos.', 'error');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showNotification('Por favor, ingresa un email válido.', 'error');
        return;
    }
    
    // Simular envío (aquí integrarías con tu backend)
    showNotification('¡Mensaje enviado exitosamente! Te contactaré pronto.', 'success');
    e.target.reset();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos de la notificación
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
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// ===== PARTÍCULAS FLOTANTES =====
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
    
    // Crear partículas
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
    
    // Remover y recrear partícula cuando termine la animación
    setTimeout(() => {
        container.removeChild(particle);
        createParticle(container);
    }, duration * 1000);
}

// ===== EFECTOS DE TYPING =====
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== UTILIDADES =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== EVENTOS DE RESIZE =====
window.addEventListener('resize', debounce(() => {
    // Reajustar elementos si es necesario
    updateLayout();
}, 250));

function updateLayout() {
    // Actualizar layout en cambios de tamaño
    const particles = document.querySelector('.particles-container');
    if (particles) {
        particles.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            createParticle(particles);
        }
    }
}

// ===== CSS DINÁMICO PARA ANIMACIONES =====
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

// ===== EASTER EGG =====
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

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
    
    // Efecto especial
    document.body.style.animation = 'rainbow 2s infinite';
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// Agregar animación rainbow
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);