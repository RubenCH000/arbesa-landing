// ========== FUNCIONES DE NOTIFICACIÓN ==========
function showNotification(type, title, message, details = null, redirectUrl = null) {
    const modal = document.getElementById('notificationModal');
    const icon = document.getElementById('notificationIcon');
    const titleEl = document.getElementById('notificationTitle');
    const messageEl = document.getElementById('notificationMessage');
    const detailsEl = document.getElementById('notificationDetails');
    const btn = document.getElementById('notificationBtn');

    icon.className = 'notification-icon ' + type;
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    icon.innerHTML = `<i class="fas ${icons[type] || 'fa-info-circle'}"></i>`;

    titleEl.textContent = title;
    messageEl.textContent = message;
    detailsEl.style.display = details ? 'block' : 'none';
    if (details) detailsEl.innerHTML = details;

    modal.classList.add('active');
    btn.onclick = () => {
        modal.classList.remove('active');
        if (redirectUrl) window.location.href = redirectUrl;
    };
    modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };
}

// ========== ACTUALIZAR MENÚ DE USUARIO ==========
function updateUserMenu() {
    const user = localStorage.getItem('user');
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');

    if (user) {
        const userData = JSON.parse(user);
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        userNameDisplay.textContent = userData.name?.split(' ')[0] || userData.email?.split('@')[0] || 'Usuario';
        dropdownUserName.textContent = userData.name || 'Usuario';
        dropdownUserEmail.textContent = userData.email || '';
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// ========== CHECK AND BUY ==========
window.checkAndBuy = function (event, planName, planPrice, productType) {
    event.preventDefault();
    console.log('🟢 Botón Comprar clickeado:', { planName, planPrice, productType });

    const user = localStorage.getItem('user');
    console.log('👤 Usuario logueado:', user);

    if (!user) {
        // Guardar plan pendiente
        const pendingPlan = { name: planName, price: planPrice, type: productType };
        localStorage.setItem('pendingPlan', JSON.stringify(pendingPlan));
        console.log('📦 Plan guardado en pendingPlan:', pendingPlan);

        // Abrir modal de registro
        const modal = document.getElementById('authModal');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (modal) {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            modal.style.display = 'flex';
            console.log('✅ Modal de registro abierto');
        } else {
            console.error('❌ Modal no encontrado');
            alert('Por favor inicia sesión o regístrate primero');
        }
    } else {
        // Redirigir a checkout
        const url = `checkout.html?plan=${encodeURIComponent(planName)}&price=${planPrice}&type=${productType}`;
        console.log('🔄 Redirigiendo a:', url);
        window.location.href = url;
    }
};

// ========== MODAL LOGIN/REGISTRO ==========
document.addEventListener('DOMContentLoaded', function () {
    updateUserMenu();

    const modal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const closeModal = document.getElementById('closeModal');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginBtn) loginBtn.onclick = (e) => { e.preventDefault(); loginForm.style.display = 'block'; registerForm.style.display = 'none'; modal.style.display = 'flex'; };
    if (registerBtn) registerBtn.onclick = (e) => { e.preventDefault(); loginForm.style.display = 'none'; registerForm.style.display = 'block'; modal.style.display = 'flex'; };
    if (closeModal) closeModal.onclick = () => modal.style.display = 'none';
    if (showRegister) showRegister.onclick = (e) => { e.preventDefault(); loginForm.style.display = 'none'; registerForm.style.display = 'block'; };
    if (showLogin) showLogin.onclick = (e) => { e.preventDefault(); loginForm.style.display = 'block'; registerForm.style.display = 'none'; };
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
});

// ========== REGISTRO CON FIREBASE ==========
const registerSubmit = document.getElementById('registerSubmit');
if (registerSubmit) {
    registerSubmit.onsubmit = async function (e) {
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

        // Verificar plan pendiente ANTES de registrar
        const pendingPlan = localStorage.getItem('pendingPlan');
        console.log('📦 Plan pendiente antes de registrar:', pendingPlan);

        const result = await window.createUserWithEmail(email, password, name);

        if (result.success) {
            // Guardar usuario
            localStorage.setItem('user', JSON.stringify({ name: name, email: email, uid: result.user.uid }));
            updateUserMenu();

            // Verificar plan pendiente DESPUÉS de registrar
            const pendingPlanAfter = localStorage.getItem('pendingPlan');
            console.log('📦 Plan pendiente después de registrar:', pendingPlanAfter);

            if (pendingPlanAfter) {
                const plan = JSON.parse(pendingPlanAfter);
                localStorage.removeItem('pendingPlan');
                document.getElementById('authModal').style.display = 'none';
                console.log('🔄 Redirigiendo a checkout con plan:', plan);
                window.location.href = `checkout.html?plan=${encodeURIComponent(plan.name)}&price=${plan.price}&type=${plan.type}`;
            } else {
                document.getElementById('authModal').style.display = 'none';
                showNotification('success', '¡Registro exitoso!', `Bienvenido ${name}`);
            }
            document.getElementById('registerForm').reset();
        } else {
            if (result.error.code === 'auth/email-already-in-use') {
                showNotification('error', 'Error', 'Este correo ya está registrado');
            } else {
                showNotification('error', 'Error', result.error.message);
            }
        }
    };
}

// ========== LOGIN CON FIREBASE ==========
const loginSubmit = document.getElementById('loginSubmit');
if (loginSubmit) {
    loginSubmit.onsubmit = async function (e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Verificar plan pendiente ANTES de login
        const pendingPlan = localStorage.getItem('pendingPlan');
        console.log('📦 Plan pendiente antes de login:', pendingPlan);

        const result = await window.signInWithEmail(email, password);

        if (result.success) {
            let userName = email.split('@')[0];
            localStorage.setItem('user', JSON.stringify({ name: userName, email: email, uid: result.user.uid }));
            updateUserMenu();

            // Verificar plan pendiente DESPUÉS de login
            const pendingPlanAfter = localStorage.getItem('pendingPlan');
            console.log('📦 Plan pendiente después de login:', pendingPlanAfter);

            if (pendingPlanAfter) {
                const plan = JSON.parse(pendingPlanAfter);
                localStorage.removeItem('pendingPlan');
                document.getElementById('authModal').style.display = 'none';
                console.log('🔄 Redirigiendo a checkout con plan:', plan);
                window.location.href = `checkout.html?plan=${encodeURIComponent(plan.name)}&price=${plan.price}&type=${plan.type}`;
            } else {
                document.getElementById('authModal').style.display = 'none';
                showNotification('success', '¡Sesión iniciada!', `Bienvenido de nuevo ${userName}`);
            }
            document.getElementById('loginForm').reset();
        } else {
            if (result.error.code === 'auth/user-not-found') {
                showNotification('error', 'Error', 'No existe una cuenta con este correo');
            } else if (result.error.code === 'auth/wrong-password') {
                showNotification('error', 'Error', 'Contraseña incorrecta');
            } else {
                showNotification('error', 'Error', result.error.message);
            }
        }
    };
}

// ========== MENÚ DE USUARIO ==========
const userMenuTrigger = document.getElementById('userMenuTrigger');
const userDropdown = document.getElementById('userDropdown');
if (userMenuTrigger) {
    userMenuTrigger.onclick = (e) => { e.stopPropagation(); userDropdown.classList.toggle('active'); };
    document.addEventListener('click', () => userDropdown.classList.remove('active'));
}

// Cambiar contraseña
const userChangePasswordBtn = document.getElementById('userChangePasswordBtn');
const changePasswordModal = document.getElementById('changePasswordModal');
const closePasswordModal = document.getElementById('closePasswordModal');

if (userChangePasswordBtn) {
    userChangePasswordBtn.onclick = (e) => {
        e.preventDefault();
        changePasswordModal.style.display = 'flex';
        userDropdown.classList.remove('active');
    };
}
if (closePasswordModal) closePasswordModal.onclick = () => changePasswordModal.style.display = 'none';
window.onclick = (e) => { if (e.target === changePasswordModal) changePasswordModal.style.display = 'none'; };

const changePasswordForm = document.getElementById('changePasswordForm');
if (changePasswordForm) {
    changePasswordForm.onsubmit = async function (e) {
        e.preventDefault();
        const current = document.getElementById('currentPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmNewPassword').value;

        if (newPass !== confirm) return showNotification('error', 'Error', 'Las contraseñas nuevas no coinciden');
        if (newPass.length < 6) return showNotification('error', 'Error', 'La nueva contraseña debe tener al menos 6 caracteres');

        const result = await window.updateUserPassword(current, newPass);
        if (result.success) {
            const user = JSON.parse(localStorage.getItem('user'));
            user.password = newPass;
            localStorage.setItem('user', JSON.stringify(user));
            changePasswordModal.style.display = 'none';
            showNotification('success', 'Contraseña actualizada', 'Tu contraseña ha sido cambiada exitosamente.');
            changePasswordForm.reset();
        } else {
            showNotification('error', 'Error', result.error.message || 'Contraseña actual incorrecta');
        }
    };
}

// Cerrar sesión
const userLogoutBtn = document.getElementById('userLogoutBtn');
if (userLogoutBtn) {
    userLogoutBtn.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        updateUserMenu();
        showNotification('success', 'Sesión cerrada', 'Has cerrado sesión correctamente.');
        if (userDropdown) userDropdown.classList.remove('active');
    };
}

// ========== NAVBAR SCROLL ==========
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (navbar) window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
});

// ========== DARK MODE ==========
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    themeToggle.onclick = () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };
}

// ========== MENÚ MÓVIL ==========
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');
const navButtons = document.querySelector('.nav-buttons');
if (menuToggle) {
    menuToggle.onclick = () => {
        const isOpen = navMenu?.style.display === 'flex';
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
    };
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ========== CONTACTO ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.onsubmit = (e) => {
        e.preventDefault();
        showNotification('success', '¡Mensaje enviado!', 'Gracias por contactarnos. Pronto recibirás respuesta.');
        contactForm.reset();
    };
}