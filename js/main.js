// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========== MENÚ MÓVIL ==========
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');
const navButtons = document.querySelector('.nav-buttons');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.style.display === 'flex';

        if (isOpen) {
            navMenu.style.display = 'none';
            navButtons.style.display = 'none';
        } else {
            navMenu.style.display = 'flex';
            navButtons.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navButtons.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '70px';
            navMenu.style.left = '0';
            navMenu.style.right = '0';
            navMenu.style.backgroundColor = 'var(--white)';
            navMenu.style.padding = '20px';
            navMenu.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            navButtons.style.position = 'absolute';
            navButtons.style.top = '300px';
            navButtons.style.left = '0';
            navButtons.style.right = '0';
            navButtons.style.backgroundColor = 'var(--white)';
            navButtons.style.padding = '20px';
        }
    });
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== DARK MODE ==========
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

themeToggle.addEventListener('click', toggleTheme);

// ========== SCROLL ANIMATIONS ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .product-card, .pricing-card, .testimonial-card, .demo-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// ========== FORM SUBMIT (placeholder) ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Gracias por contactarnos. Pronto recibirás respuesta.');
        contactForm.reset();
    });
}

// ========== LOGIN/REGISTER PLACEHOLDERS ==========
document.getElementById('loginBtn').addEventListener('click', (e) => {
    e.preventDefault();
    alert('🔐 Acceso a la plataforma\n\nActualmente en desarrollo. Pronto estará disponible.');
});

document.getElementById('registerBtn').addEventListener('click', (e) => {
    e.preventDefault();
    alert('📝 Registro de nueva cuenta\n\nActualmente en desarrollo. Pronto estará disponible.');
});