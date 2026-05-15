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
    updateStats();
    renderBusinesses();
    initCharts();
});

function renderBusinesses() {
    const container = document.querySelector('#section-businesses tbody');
    if (!container) return;

    // Admin RLS: Can see ALL businesses
    container.innerHTML = state.businesses.map(b => `
        <tr>
            <td><strong>${b.name}</strong></td>
            <td>${b.owner}</td>
            <td>${b.city}</td>
            <td>NIO ${b.sales.toLocaleString()}</td>
            <td><span class="status-tag status-${b.status}">${b.status}</span></td>
            <td>
                <button class="btn-action-small" onclick="viewVerification('${b.id}')">Auditar</button>
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

function initCharts() { /* Same as before ... */ }
function updateStats() {
    document.getElementById('stat-sales').innerText = state.sales.toLocaleString();
    document.getElementById('stat-businesses').innerText = state.businesses.length;
}
