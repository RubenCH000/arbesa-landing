// ========== IMPORTAR FIREBASE ==========
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    deleteDoc,
    query,
    orderBy
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// ========== CONFIGURACIÓN DE FIREBASE ==========
const firebaseConfig = {
    apiKey: "AIzaSyB8CTljs84r5ImivVrSaAeITcs2jWRFDCM",
    authDomain: "arbesa-landing.firebaseapp.com",
    projectId: "arbesa-landing",
    storageBucket: "arbesa-landing.firebasestorage.app",
    messagingSenderId: "752993027681",
    appId: "1:752993027681:web:0ad57cefc7ed9a97388c20"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ========== VARIABLES GLOBALES ==========
let empresasData = [];
let ventasData = [];
let currentUser = null;

// ========== VERIFICAR AUTENTICACIÓN ==========
onAuthStateChanged(auth, (user) => {
    console.log('🔐 Auth state changed:', user?.email);

    if (user) {
        currentUser = user;
        console.log('✅ Admin autenticado:', user.email);

        // Verificar si es administrador
        if (user.email === 'admin@arbesa.com' || user.email === 'rubencarrerahilario@gmail.com') {
            cargarDatosReales();
        } else {
            console.log('❌ Usuario no autorizado');
            // window.location.href = 'index.html';
        }
    } else {
        console.log('❌ No hay usuario autenticado');
        // window.location.href = 'index.html';
    }
});

// ========== CARGAR DATOS REALES ==========
async function cargarDatosReales() {
    console.log('🟢 Cargando datos reales...');
    await Promise.all([
        cargarEmpresas(),
        cargarVentas()
    ]);

    renderDashboard();
    renderEmpresas();
    renderVentas();
}

// ========== CARGAR EMPRESAS ==========
async function cargarEmpresas() {
    try {
        console.log('🟢 Cargando empresas...');
        const empresasRef = collection(db, 'empresas');
        const snapshot = await getDocs(empresasRef);

        empresasData = [];
        snapshot.forEach(doc => {
            empresasData.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(`🏢 Empresas cargadas: ${empresasData.length}`);

    } catch (error) {
        console.error('❌ Error cargando empresas:', error);
        empresasData = [];
    }
}

// ========== CARGAR VENTAS ==========
async function cargarVentas() {
    try {
        console.log('🟢 Cargando ventas...');
        const ventasRef = collection(db, 'ventas');
        const q = query(ventasRef, orderBy('fecha', 'desc'));
        const snapshot = await getDocs(q);

        ventasData = [];
        snapshot.forEach(doc => {
            ventasData.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(`💰 Ventas cargadas: ${ventasData.length}`);

    } catch (error) {
        console.error('❌ Error cargando ventas:', error);
        ventasData = [];
    }
}

// ========== RENDERIZAR DASHBOARD ==========
function renderDashboard() {
    const totalEmpresas = empresasData.length;
    const totalVentas = ventasData.length;
    const totalIngresos = ventasData.reduce((sum, v) => sum + (v.monto || 0), 0);

    const totalEmpresasEl = document.getElementById('totalEmpresas');
    const totalUsuariosEl = document.getElementById('totalUsuarios');
    const totalVentasEl = document.getElementById('totalVentas');
    const ingresosTotalesEl = document.getElementById('ingresosTotales');

    if (totalEmpresasEl) totalEmpresasEl.textContent = totalEmpresas;
    if (totalUsuariosEl) totalUsuariosEl.textContent = totalVentas;
    if (totalVentasEl) totalVentasEl.textContent = totalVentas;
    if (ingresosTotalesEl) ingresosTotalesEl.textContent = `$${totalIngresos}`;

    console.log(`📊 Dashboard: Empresas=${totalEmpresas}, Ventas=${totalVentas}, Ingresos=$${totalIngresos}`);
}

// ========== RENDERIZAR EMPRESAS ==========
function renderEmpresas() {
    const tbody = document.getElementById('empresasList');
    if (!tbody) return;

    if (empresasData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay empresas registradas</td></tr>';
        return;
    }

    tbody.innerHTML = empresasData.map(emp => `
        <tr>
            <td>${emp.id?.substring(0, 8) || 'N/A'}...</td>
            <td><strong>${emp.name || 'Sin nombre'}</strong></td>
            <td>${emp.email || 'Sin email'}</td>
            <td><span class="plan-badge">${emp.plan || 'Sin plan'}</span></td>
            <td><span class="status-badge status-${emp.status || 'active'}">${emp.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
            <td class="action-btns">
                <button class="action-btn view" onclick="viewEmpresa('${emp.id}')"><i class="fas fa-eye"></i></button>
                <button class="action-btn edit" onclick="editEmpresa('${emp.id}')"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="deleteEmpresa('${emp.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// ========== RENDERIZAR VENTAS ==========
function renderVentas() {
    const tbody = document.getElementById('ventasList');
    if (!tbody) return;

    if (ventasData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay ventas registradas</td></tr>';
        return;
    }

    tbody.innerHTML = ventasData.map(venta => `
        <tr>
            <td>${venta.id?.substring(0, 8) || 'N/A'}...</td>
            <td><strong>${venta.cliente || 'N/A'}</strong></td>
            <td>${venta.email || 'N/A'}</td>
            <td>${venta.plan || 'N/A'}</td>
            <td>$${venta.monto || 0}</td>
            <td>${venta.fechaFormateada || venta.fecha?.split('T')[0] || 'N/A'}</td>
            <td><span class="status-badge status-active">${venta.estado || 'completado'}</span></td>
        </tr>
    `).join('');
}

// ========== FUNCIONES CRUD EMPRESAS ==========
window.viewEmpresa = (id) => {
    const empresa = empresasData.find(e => e.id === id);
    alert(`📋 Empresa: ${empresa?.name}\n📧 Email: ${empresa?.email}\n📦 Plan: ${empresa?.plan}`);
};

window.editEmpresa = (id) => {
    alert(`✏️ Editar empresa ${id} - Funcionalidad en desarrollo`);
};

window.deleteEmpresa = async (id) => {
    if (confirm('¿Eliminar esta empresa?')) {
        try {
            await deleteDoc(doc(db, 'empresas', id));
            await cargarEmpresas();
            renderEmpresas();
            renderDashboard();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar');
        }
    }
};

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

// ========== CERRAR SESIÓN ==========
const cerrarSesionBtn = document.getElementById('cerrarSesion');
if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener('click', async () => {
        await signOut(auth);
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}

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
console.log('🟢 Admin panel cargado - sin gráficas');