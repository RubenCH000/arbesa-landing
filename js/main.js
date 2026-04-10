// ========== NAVBAR SCROLL EFFECT ==========
document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});

// ========== MENÚ MÓVIL ==========
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');
const navButtons = document.querySelector('.nav-buttons');

if (menuToggle) {
    menuToggle.addEventListener('click', function () {
        const isOpen = navMenu && navMenu.style.display === 'flex';

        if (isOpen) {
            if (navMenu) navMenu.style.display = 'none';
            if (navButtons) navButtons.style.display = 'none';
        } else {
            if (navMenu) {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '70px';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.backgroundColor = '#FFFFFF';
                navMenu.style.padding = '20px';
                navMenu.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            }
            if (navButtons) {
                navButtons.style.display = 'flex';
                navButtons.style.flexDirection = 'column';
                navButtons.style.position = 'absolute';
                navButtons.style.top = '300px';
                navButtons.style.left = '0';
                navButtons.style.right = '0';
                navButtons.style.backgroundColor = '#FFFFFF';
                navButtons.style.padding = '20px';
            }
        }
    });
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
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

if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            localStorage.setItem('theme', 'dark');
        } else {
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            localStorage.setItem('theme', 'light');
        }
    }

    themeToggle.addEventListener('click', toggleTheme);
}

// ========== SCROLL ANIMATIONS ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .product-card, .pricing-card, .testimonial-card, .demo-content').forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// ========== FORM SUBMIT ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Gracias por contactarnos. Pronto recibirás respuesta.');
        contactForm.reset();
    });
}

// ========== LOGIN/REGISTER PLACEHOLDERS ==========
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

if (loginBtn) {
    loginBtn.addEventListener('click', function (e) {
        e.preventDefault();
        alert('🔐 Acceso a la plataforma\n\nActualmente en desarrollo. Pronto estará disponible.');
    });
}

if (registerBtn) {
    registerBtn.addEventListener('click', function (e) {
        e.preventDefault();
        alert('📝 Registro de nueva cuenta\n\nActualmente en desarrollo. Pronto estará disponible.');
    });
}