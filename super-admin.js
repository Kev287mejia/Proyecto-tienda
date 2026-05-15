// Global State Simulation
const state = {
    sales: 245800,
    businesses: [
        { id: 'b1', name: 'TecnoCaribe', owner: 'Juan Carlos', city: 'Bluefields', status: 'verified', sales: 45000 },
        { id: 'b2', name: 'Puerto de Sabores', owner: 'Bayardo Porta', city: 'Bluefields', status: 'pending', sales: 0 }
    ],
    documents: {
        'b2': {
            cedula_front: '../mock_cedula_front_1778802267324.png',
            cedula_back: '../mock_cedula_front_1778802267324.png', // Mock
            ruc: '../media__1778800901273.png', // Mock
            selfie: '../caribbean_auth_bg_1778801804990.png', // Mock
            status: 'pending',
            review_notes: ''
        }
    },
    users: 42,
    fraudAlerts: 0
};

document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    updateStats();
    renderBusinesses();
});

function showSection(sectionId) {
    document.querySelectorAll('main section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`section-${sectionId}`).classList.remove('hidden');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick').includes(sectionId)) item.classList.add('active');
    });
}

function renderBusinesses() {
    const container = document.querySelector('#section-businesses tbody');
    if (!container) return;

    container.innerHTML = state.businesses.map(b => `
        <tr>
            <td><strong>${b.name}</strong></td>
            <td>${b.owner}</td>
            <td>${b.city}</td>
            <td>NIO ${b.sales.toLocaleString()}</td>
            <td><span class="status-tag status-${b.status}">${b.status === 'verified' ? 'Verificado' : 'Pendiente'}</span></td>
            <td>
                ${b.status === 'pending' ? 
                    `<button class="btn-action-small" onclick="reviewValidation('${b.id}')">Revisar</button>` : 
                    `<button class="btn-action-small" onclick="viewBusinessDetail('${b.id}')">Detalle</button>`
                }
            </td>
        </tr>
    `).join('');
}

function reviewValidation(businessId) {
    const business = state.businesses.find(b => b.id === businessId);
    const docs = state.documents[businessId];
    
    if (!business || !docs) return;

    // Actualizar vista de validación con los datos reales
    document.querySelector('#section-validation h1').innerText = `Validando: ${business.name}`;
    document.querySelector('.doc-viewer img').src = docs.cedula_front;
    document.querySelector('#section-validation .validation-actions').setAttribute('data-current-id', businessId);
    
    showSection('validation');
}

function approveBusiness() {
    const id = document.querySelector('.validation-actions').getAttribute('data-current-id');
    const business = state.businesses.find(b => b.id === id);
    
    if (business) {
        business.status = 'verified';
        showToast(`Negocio ${business.name} aprobado exitosamente.`);
        renderBusinesses();
        showSection('dashboard');
    }
}

function rejectBusiness() {
    const notes = prompt("Por favor, ingresa el motivo del rechazo (Review Notes):");
    if (notes === null) return;

    const id = document.querySelector('.validation-actions').getAttribute('data-current-id');
    const business = state.businesses.find(b => b.id === id);
    
    if (business) {
        business.status = 'rejected';
        state.documents[id].review_notes = notes;
        showToast(`Registro rechazado. Motivo: ${notes}`);
        renderBusinesses();
        showSection('dashboard');
    }
}

function suspendUser(btn, userName) {
    if (confirm(`¿Estás seguro de suspender a ${userName}?`)) {
        const row = btn.closest('tr');
        const statusTag = row.querySelector('.status-tag');
        statusTag.innerText = 'Suspendido';
        statusTag.className = 'status-tag status-pending'; // Usamos estilos pendientes para resaltar
        statusTag.style.background = '#EF4444';
        btn.innerText = 'Reactivar';
        btn.style.color = 'var(--success)';
        btn.onclick = () => reactivateUser(btn, userName);
        showToast(`Usuario ${userName} suspendido.`);
    }
}

function reactivateUser(btn, userName) {
    const row = btn.closest('tr');
    const statusTag = row.querySelector('.status-tag');
    statusTag.innerText = 'Activo';
    statusTag.className = 'status-tag status-verified';
    statusTag.style.background = '';
    btn.innerText = 'Suspender';
    btn.style.color = 'var(--danger)';
    btn.onclick = () => suspendUser(btn, userName);
    showToast(`Usuario ${userName} reactivado.`);
}

function showToast(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Charts
function initCharts() {
    const mainCtx = document.getElementById('mainChart').getContext('2d');
    new Chart(mainCtx, {
        type: 'line',
        data: {
            labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
            datasets: [{
                label: 'Ventas NIO',
                data: [12000, 19000, 45000, 32000, 58000, 79000],
                borderColor: '#D4145A',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(212, 20, 90, 0.05)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
        }
    });

    const regionCtx = document.getElementById('regionChart').getContext('2d');
    new Chart(regionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Bluefields', 'Bilwi'],
            datasets: [{
                data: [65, 35],
                backgroundColor: ['#D4145A', '#0F172A'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            cutout: '80%'
        }
    });
}

function updateStats() {
    document.getElementById('stat-sales').innerText = state.sales.toLocaleString();
    document.getElementById('stat-businesses').innerText = state.businesses.length;
}
