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

// Formulario de contacto
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.onsubmit = function (e) {
        e.preventDefault();
        showNotification('success', '¡Mensaje enviado!', 'Gracias por contactarnos. Pronto recibirás respuesta.');
        contactForm.reset();
    };
}

// // ========== BOTONES LOGIN/REGISTER ==========
// const loginBtn = document.getElementById('loginBtn');
// const registerBtn = document.getElementById('registerBtn');
// const modal = document.getElementById('authModal');
// const loginForm = document.getElementById('loginForm');
// const registerForm = document.getElementById('registerForm');

// if (loginBtn) {
//     loginBtn.addEventListener('click', function (e) {
//         e.preventDefault();
//         if (modal) {
//             loginForm.style.display = 'block';
//             registerForm.style.display = 'none';
//             modal.classList.add('active');
//         } else {
//             alert('🔐 Acceso a la plataforma\n\nActualmente en desarrollo. Pronto estará disponible.');
//         }
//     });
// }

// if (registerBtn) {
//     registerBtn.addEventListener('click', function (e) {
//         e.preventDefault();
//         if (modal) {
//             loginForm.style.display = 'none';
//             registerForm.style.display = 'block';
//             modal.classList.add('active');
//         } else {
//             alert('📝 Registro de nueva cuenta\n\nActualmente en desarrollo. Pronto estará disponible.');
//         }
//     });
// }

// ========== MODAL DE NOTIFICACIÓN ==========
function showNotification(type, title, message, details = null, redirectUrl = null) {
    const modal = document.getElementById('notificationModal');
    const icon = document.getElementById('notificationIcon');
    const titleEl = document.getElementById('notificationTitle');
    const messageEl = document.getElementById('notificationMessage');
    const detailsEl = document.getElementById('notificationDetails');
    const btn = document.getElementById('notificationBtn');

    // Configurar icono y color según tipo
    icon.className = 'notification-icon ' + type;
    switch (type) {
        case 'success':
            icon.innerHTML = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon.innerHTML = '<i class="fas fa-times-circle"></i>';
            break;
        case 'warning':
            icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        case 'info':
            icon.innerHTML = '<i class="fas fa-info-circle"></i>';
            break;
    }

    titleEl.textContent = title;
    messageEl.textContent = message;

    if (details) {
        detailsEl.style.display = 'block';
        detailsEl.innerHTML = details;
    } else {
        detailsEl.style.display = 'none';
    }

    modal.classList.add('active');

    // Configurar botón
    btn.onclick = function () {
        modal.classList.remove('active');
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    };

    // Cerrar al hacer clic fuera
    modal.onclick = function (e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        }
    };
}

// ========== MODAL LOGIN/REGISTRO ==========
const closeModal = document.getElementById('closeModal');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

// Abrir modal
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        modal.classList.add('active');
    });
}

if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        modal.classList.add('active');
    });
}

// Cerrar modal
if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

// Cambiar entre login y registro
if (showRegister) {
    showRegister.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
}

if (showLogin) {
    showLogin.addEventListener('click', () => {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });
}

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Selección de plan
const planOptions = document.querySelectorAll('.plan-option');
let selectedPlan = 'helpdesk_basic';

planOptions.forEach(option => {
    option.addEventListener('click', () => {
        planOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedPlan = option.dataset.plan;
    });
});

// Procesar registro con email
const registerSubmit = document.getElementById('registerSubmit');
if (registerSubmit) {
    registerSubmit.onsubmit = function (e) {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirmPassword').value;

        if (password !== confirm) {
            showNotification('error', 'Error', 'Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            showNotification('error', 'Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const details = `
            <strong>👤 Nombre:</strong> ${name}<br>
            <strong>📧 Email:</strong> ${email}<br>
            <strong>📅 Fecha:</strong> ${new Date().toLocaleDateString()}
        `;

        showNotification(
            'success',
            '¡Registro exitoso!',
            'Tu cuenta ha sido creada correctamente.',
            details,
            'https://app.arbesa.com/dashboard'
        );

        document.getElementById('authModal').style.display = 'none';
        document.getElementById('registerForm').reset();
    };
}

// Procesar login con email
const loginSubmit = document.getElementById('loginSubmit');
if (loginSubmit) {
    loginSubmit.onsubmit = function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;

        showNotification(
            'success',
            '¡Sesión iniciada!',
            `Bienvenido de nuevo, ${email}`,
            null,
            'https://app.arbesa.com/dashboard'
        );

        document.getElementById('authModal').style.display = 'none';
        document.getElementById('loginForm').reset();
    };
}

function openRegisterModal() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    modal.classList.add('active');
}

window.loginWithGoogle = async function () {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const details = `
            <strong>👤 Nombre:</strong> ${user.displayName}<br>
            <strong>📧 Email:</strong> ${user.email}<br>
            <strong>🆔 UID:</strong> ${user.uid.substring(0, 15)}...
        `;

        showNotification(
            'success',
            '¡Bienvenido!',
            `Hola ${user.displayName}, has iniciado sesión correctamente.`,
            details,
            'https://app.arbesa.com/dashboard'
        );

        localStorage.setItem('user', JSON.stringify({
            name: user.displayName,
            email: user.email,
            uid: user.uid
        }));

        document.getElementById('authModal').style.display = 'none';

    } catch (error) {
        console.error(error);
        showNotification('error', 'Error de autenticación', error.message);
    }
};

// Si hay errores de validación
if (!_isFormValid) {
    showNotification('error', 'Formulario incompleto', 'Por favor completa todos los campos requeridos.');
    return;
}

// Verificar si está logueado antes de comprar
window.checkAndBuy = function (event, planName, planPrice, productType) {
    event.preventDefault();

    const user = localStorage.getItem('user');
    const isLoggedIn = user && JSON.parse(user).email;

    if (!isLoggedIn) {
        // Mostrar modal de login/registro
        const modal = document.getElementById('authModal');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        if (modal) {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            modal.style.display = 'flex';

            // Guardar plan seleccionado para después de login
            localStorage.setItem('pendingPlan', JSON.stringify({
                name: planName,
                price: planPrice,
                type: productType
            }));
        }
    } else {
        // Redirigir a checkout
        window.location.href = `checkout.html?plan=${encodeURIComponent(planName)}&price=${planPrice}&type=${productType}`;
    }
};

// Después de login exitoso
if (success && mounted) {
    const pendingPlan = localStorage.getItem('pendingPlan');
    if (pendingPlan) {
        const plan = JSON.parse(pendingPlan);
        localStorage.removeItem('pendingPlan');
        window.location.href = `checkout.html?plan=${encodeURIComponent(plan.name)}&price=${plan.price}&type=${plan.type}`;
    } else {
        // Redirigir a dashboard o cerrar modal
        document.getElementById('authModal').style.display = 'none';
        showNotification('success', '¡Bienvenido!', 'Has iniciado sesión correctamente.');
    }
}