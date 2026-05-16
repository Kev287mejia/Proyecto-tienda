// Master State & Admin Security (RLS Simulation)
const profile = JSON.parse(localStorage.getItem('eternal_profile'));

// Redirect if not admin
if (!profile || profile.role !== 'admin') {
    alert('Acceso no autorizado: Se requieren privilegios MASTER.');
    window.location.href = '../login/';
}

// Global Storage Simulation
const Storage = {
    public: 'https://eternallabs.storage/public/',
    private: 'https://eternallabs.storage/private/'
};

const state = {
    sales: 245800,
    businesses: JSON.parse(localStorage.getItem('eternal_all_businesses')) || [
        { id: 'b1', name: 'TecnoCaribe', owner: 'Juan Carlos', city: 'Bluefields', status: 'verified', sales: 45000 },
        { id: 'b2', name: 'Puerto de Sabores', owner: 'Bayardo Porta', city: 'Bluefields', status: 'pending', sales: 0 }
    ],
    documents: {
        'b2': {
            cedula_front: Storage.private + 'verification-documents/b2/cedula_front.png',
            ruc: Storage.private + 'verification-documents/b2/ruc.pdf',
            status: 'pending'
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Simulated load time for Master Control Panel
    setTimeout(() => {
        updateStats();
        renderBusinesses();
        initCharts();
    }, 2500);
});

function renderBusinesses() {
    const container = document.getElementById('business-table-body');
    if (!container) return;

    // Admin RLS: Can see ALL businesses
    container.innerHTML = state.businesses.map((b, index) => `
        <tr class="animate-in" style="animation-delay: ${index * 0.1}s">
            <td><strong>${b.name}</strong></td>
            <td>${b.owner}</td>
            <td>${b.city}</td>
            <td>NIO ${b.sales.toLocaleString()}</td>
            <td><span class="status-tag status-${b.status}">${b.status === 'verified' ? 'Verificado' : 'Pendiente'}</span></td>
            <td>
                <button style="border: none; background: transparent; cursor: pointer; color: var(--info); font-weight: 700;" onclick="viewVerification('${b.id}')">Auditar</button>
            </td>
        </tr>
    `).join('');
}

function viewVerification(id) {
    const docs = state.documents[id];
    if (!docs) {
        alert('Este negocio aún no ha subido documentos privados.');
        return;
    }
    
    // Simulación de acceso a Bucket Privado (Solo Admin)
    console.log(`Accediendo a Storage Privado para Negocio ${id}: ${docs.cedula_front}`);
    
    // Abrir vista de validación (SPA Simulation for now)
    showSection('validation');
}

function showSection(sectionId) {
    document.querySelectorAll('main section').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(`section-${sectionId}`);
    if (target) target.classList.remove('hidden');
}

function approveBusiness() {
    showToast("Negocio verificado institucionalmente.");
    // Update logic ...
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function initCharts() {
    // Line Chart: Sales Performance
    const salesCtx = document.getElementById('chart-container-sales');
    if (salesCtx) {
        salesCtx.innerHTML = '<canvas id="mainChart"></canvas>';
        const ctx = document.getElementById('mainChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
                datasets: [{
                    label: 'Ventas (NIO)',
                    data: [12000, 19000, 3000, 5000, 20000, 35000],
                    borderColor: '#D4145A',
                    backgroundColor: 'rgba(212, 20, 90, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
            }
        });
    }

    // Pie Chart: Regional Breakdown
    const regionCtx = document.getElementById('chart-container-region');
    if (regionCtx) {
        regionCtx.innerHTML = `
            <div style="width: 140px; height: 140px;">
                <canvas id="regionChart"></canvas>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;"><span style="width: 8px; height: 8px; background: #D4145A; border-radius: 2px;"></span> Bluefields</span>
                    <span style="font-size: 0.75rem; font-weight: 700;">65%</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;"><span style="width: 8px; height: 8px; background: #0F172A; border-radius: 2px;"></span> Bilwi</span>
                    <span style="font-size: 0.75rem; font-weight: 700;">35%</span>
                </div>
            </div>
        `;
        const ctx = document.getElementById('regionChart').getContext('2d');
        new Chart(ctx, {
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
                cutout: '70%'
            }
        });
    }
}

function updateStats() {
    const stats = [
        { id: 'stat-sales', value: state.sales.toLocaleString(), trendId: 'stat-sales-trend', trend: '↑ 12.5% vs ayer' },
        { id: 'stat-businesses', value: state.businesses.length, trendId: 'stat-businesses-trend', trend: '+3 esta semana' },
        { id: 'stat-fraud', value: '0', trendId: 'stat-fraud-trend', trend: 'Protegido' },
        { id: 'stat-users', value: '42', trendId: 'stat-users-trend', trend: 'En tiempo real' }
    ];

    stats.forEach((s, index) => {
        const el = document.getElementById(s.id);
        const trendEl = document.getElementById(s.trendId);
        if (el) {
            el.innerHTML = `<span class="animate-in" style="display:inline-block; animation-delay: ${index * 0.1}s">${s.value}</span>`;
        }
        if (trendEl) {
            trendEl.innerHTML = `<span class="animate-in" style="display:inline-block; animation-delay: ${(index * 0.1) + 0.2}s">${s.trend}</span>`;
        }
    });
}
