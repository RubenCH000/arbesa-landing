// ========== ADMIN PANEL ==========

// Verificar si es administrador
const user = localStorage.getItem('user');
if (user) {
    const userData = JSON.parse(user);
    if (userData.email !== 'admin@arbesa.com') {
        window.location.href = 'index.html';
    }
} else {
    window.location.href = 'index.html';
}

// Datos de ejemplo (en producción vendrían de una API/backend)
let empresasData = [
    { id: 1, name: "Tech Solutions MX", email: "contacto@techsolutions.com", phone: "555-1234", plan: "profesional", status: "active", date: "2026-01-15", users: 3 },
    { id: 2, name: "NetConnect", email: "info@netconnect.com", phone: "555-5678", plan: "empresarial", status: "active", date: "2026-02-20", users: 8 },
    { id: 3, name: "FiberNet", email: "admin@fibernet.com", phone: "555-9012", plan: "basico", status: "inactive", date: "2026-03-10", users: 1 }
];

let usuariosData = [
    { id: 1, name: "Carlos Mendoza", email: "carlos@techsolutions.com", empresa: "Tech Solutions MX", role: "admin", status: "active" },
    { id: 2, name: "Ana Rodríguez", email: "ana@netconnect.com", empresa: "NetConnect", role: "admin", status: "active" },
    { id: 3, name: "Roberto Sánchez", email: "roberto@fibernet.com", empresa: "FiberNet", role: "admin", status: "inactive" }
];

let ventasData = [
    { id: 1, cliente: "Tech Solutions MX", plan: "Profesional", monto: 79, fecha: "2026-01-15", estado: "completado" },
    { id: 2, cliente: "NetConnect", plan: "Empresarial", monto: 199, fecha: "2026-02-20", estado: "completado" },
    { id: 3, cliente: "FiberNet", plan: "Básico", monto: 29, fecha: "2026-03-10", estado: "completado" }
];

// ========== FUNCIONES DE RENDERIZADO ==========
function renderDashboard() {
    document.getElementById('totalEmpresas').textContent = empresasData.length;
    document.getElementById('totalUsuarios').textContent = usuariosData.length;
    document.getElementById('totalVentas').textContent = ventasData.length;

    const totalIngresos = ventasData.reduce((sum, v) => sum + v.monto, 0);
    document.getElementById('ingresosTotales').textContent = `$${totalIngresos}`;
}

function renderEmpresas() {
    const tbody = document.getElementById('empresasList');
    if (!tbody) return;

    if (empresasData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay empresas registradas</td></tr>';
        return;
    }

    tbody.innerHTML = empresasData.map(emp => `
        <tr>
            <td>#${emp.id}</td>
            <td><strong>${emp.name}</strong></td>
            <td>${emp.email}</td>
            <td><span class="plan-badge">${emp.plan}</span></td>
            <td><span class="status-badge status-${emp.status}">${emp.status === 'active' ? 'Activo' : emp.status === 'inactive' ? 'Inactivo' : 'Suspendido'}</span></td>
            <td>${emp.date}</td>
            <td class="action-btns">
                <button class="action-btn view" onclick="viewEmpresa(${emp.id})"><i class="fas fa-eye"></i></button>
                <button class="action-btn edit" onclick="editEmpresa(${emp.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="deleteEmpresa(${emp.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderUsuarios() {
    const tbody = document.getElementById('usuariosList');
    if (!tbody) return;

    tbody.innerHTML = usuariosData.map(user => `
        <tr>
            <td>#${user.id}</td>
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td>${user.empresa}</td>
            <td><span class="role-badge">${user.role}</span></td>
            <td><span class="status-badge status-${user.status}">${user.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
            <td class="action-btns">
                <button class="action-btn view" onclick="viewUser(${user.id})"><i class="fas fa-eye"></i></button>
                <button class="action-btn edit" onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderVentas() {
    const tbody = document.getElementById('ventasList');
    if (!tbody) return;

    tbody.innerHTML = ventasData.map(venta => `
        <tr>
            <td>#${venta.id}</td>
            <td><strong>${venta.cliente}</strong></td>
            <td>${venta.plan}</td>
            <td>$${venta.monto}</td>
            <td>${venta.fecha}</td>
            <td><span class="status-badge status-active">${venta.estado}</span></td>
        </tr>
    `).join('');
}

// ========== CRUD EMPRESAS ==========
function viewEmpresa(id) {
    const empresa = empresasData.find(e => e.id === id);
    alert(`📋 Empresa: ${empresa.name}\n📧 Email: ${empresa.email}\n📞 Teléfono: ${empresa.phone}\n📦 Plan: ${empresa.plan}\n👥 Usuarios: ${empresa.users}`);
}

function editEmpresa(id) {
    const empresa = empresasData.find(e => e.id === id);
    document.getElementById('empresaModalTitle').textContent = 'Editar Empresa';
    document.getElementById('empresaName').value = empresa.name;
    document.getElementById('empresaEmail').value = empresa.email;
    document.getElementById('empresaPhone').value = empresa.phone || '';
    document.getElementById('empresaPlan').value = empresa.plan;
    document.getElementById('empresaStatus').value = empresa.status;
    document.getElementById('empresaModal').style.display = 'flex';

    window.currentEditId = id;
}

function deleteEmpresa(id) {
    if (confirm('¿Eliminar esta empresa? Se eliminarán también sus usuarios.')) {
        empresasData = empresasData.filter(e => e.id !== id);
        usuariosData = usuariosData.filter(u => u.empresaId !== id);
        renderDashboard();
        renderEmpresas();
        renderUsuarios();
    }
}

// ========== CRUD USUARIOS ==========
function viewUser(id) {
    const user = usuariosData.find(u => u.id === id);
    alert(`👤 Usuario: ${user.name}\n📧 Email: ${user.email}\n🏢 Empresa: ${user.empresa}\n👔 Rol: ${user.role}`);
}

function editUser(id) {
    alert(`Editar usuario ${id} - Funcionalidad en desarrollo`);
}

function deleteUser(id) {
    if (confirm('¿Eliminar este usuario?')) {
        usuariosData = usuariosData.filter(u => u.id !== id);
        renderUsuarios();
    }
}

// ========== TAB NAVIGATION ==========
document.querySelectorAll('.nav-link[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = link.dataset.tab;

        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

        link.classList.add('active');
        document.getElementById(`tab-${tabId}`).classList.add('active');
    });
});

// ========== MODAL ==========
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    });
});

document.getElementById('btnAddEmpresa')?.addEventListener('click', () => {
    document.getElementById('empresaModalTitle').textContent = 'Nueva Empresa';
    document.getElementById('empresaForm').reset();
    document.getElementById('empresaModal').style.display = 'flex';
    window.currentEditId = null;
});

document.getElementById('empresaForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const empresaData = {
        name: document.getElementById('empresaName').value,
        email: document.getElementById('empresaEmail').value,
        phone: document.getElementById('empresaPhone').value,
        plan: document.getElementById('empresaPlan').value,
        status: document.getElementById('empresaStatus').value,
        date: new Date().toISOString().split('T')[0],
        users: 0
    };

    if (window.currentEditId) {
        const index = empresasData.findIndex(e => e.id === window.currentEditId);
        if (index !== -1) {
            empresasData[index] = { ...empresasData[index], ...empresaData };
        }
    } else {
        const newId = Math.max(...empresasData.map(e => e.id), 0) + 1;
        empresasData.push({ id: newId, ...empresaData });
    }

    document.getElementById('empresaModal').style.display = 'none';
    renderDashboard();
    renderEmpresas();
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

// ========== INICIALIZACIÓN ==========
renderDashboard();
renderEmpresas();
renderUsuarios();
renderVentas();

// ========== CHARTS ==========
if (document.getElementById('salesChart')) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Ventas ($)',
                data: [29, 79, 199, 49, 99, 29],
                borderColor: '#49B8B0',
                backgroundColor: 'rgba(73, 184, 176, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

if (document.getElementById('plansChart')) {
    const ctx = document.getElementById('plansChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Básico', 'Profesional', 'Empresarial'],
            datasets: [{
                data: [12, 8, 5],
                backgroundColor: ['#49B8B0', '#2B9B93', '#1a6b65'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// ========== VARIABLES GLOBALES PARA GRÁFICAS ==========
let salesChart = null;
let plansChart = null;

// ========== FUNCIÓN PARA CREAR/DESTRUIR GRÁFICAS ==========
function initCharts() {
    // Destruir gráficas existentes si ya existen
    if (salesChart) {
        salesChart.destroy();
    }
    if (plansChart) {
        plansChart.destroy();
    }

    // Gráfica de ventas por mes
    const salesCtx = document.getElementById('salesChart')?.getContext('2d');
    if (salesCtx) {
        salesChart = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Ventas ($)',
                    data: [29, 79, 199, 49, 99, 29],
                    borderColor: '#49B8B0',
                    backgroundColor: 'rgba(73, 184, 176, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // Gráfica de planes más vendidos
    const plansCtx = document.getElementById('plansChart')?.getContext('2d');
    if (plansCtx) {
        plansChart = new Chart(plansCtx, {
            type: 'doughnut',
            data: {
                labels: ['Básico', 'Profesional', 'Empresarial'],
                datasets: [{
                    data: [12, 8, 5],
                    backgroundColor: ['#49B8B0', '#2B9B93', '#1a6b65'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', function () {
    renderDashboard();
    renderEmpresas();
    renderUsuarios();
    renderVentas();
    initCharts();  // ← Inicializar gráficas solo una vez
});