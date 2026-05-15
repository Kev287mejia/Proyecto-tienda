// Initialize State & Security (RLS Simulation)
let profile = JSON.parse(localStorage.getItem('eternal_profile'));
let business = JSON.parse(localStorage.getItem('eternal_business'));

// Redirect if not a seller
if (!profile || profile.role !== 'seller') {
    console.error('Acceso denegado: No tienes permisos de vendedor.');
    window.location.href = '../login/';
}

// Global Storage Simulation (Public vs Private)
const Storage = {
    public: 'https://eternallabs.storage/public/',
    private: 'https://eternallabs.storage/private/'
};

// Simulated Products Database (Filtered by owner_id)
let allProducts = JSON.parse(localStorage.getItem('eternal_products')) || [];
let products = allProducts.filter(p => p.business_id === business?.id);

// UI Init
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    renderProducts();
    lucide.createIcons();
    initCharts();
});

function updateUI() {
    if (!profile || !business) return;
    
    document.getElementById('profile-name').innerText = profile.full_name;
    document.getElementById('welcome-msg').innerText = `¡Hola, ${business.name}!`;
    
    // Status Logic
    const warning = document.getElementById('verification-warning');
    const headerBadge = document.getElementById('status-badge-header');
    
    if (business.status === 'verified') {
        if (warning) warning.style.display = 'none';
        headerBadge.innerHTML = '<i data-lucide="check-circle" style="width:14px;"></i> Verificado';
        headerBadge.className = 'status-badge status-success';
    }

    // KYB Status in Verification
    const kybContainer = document.getElementById('kyb-status-container');
    if (kybContainer) {
        if (business.verification_submitted) {
            kybContainer.innerHTML = `<div style="color: var(--info); font-weight: 700;">Documentos en revisión privada.</div>`;
        }
    }
}

// Product Management (RLS Applied)
function renderProducts() {
    const container = document.getElementById('products-table-body');
    if (!container) return;

    container.innerHTML = products.map(p => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background: url(${p.image_url}) center/cover; border: 1px solid #eee;"></div>
                    <div style="font-weight: 600;">${p.name}</div>
                </div>
            </td>
            <td>${getCategoryName(p.category_id)}</td>
            <td>NIO ${p.price.toLocaleString()}</td>
            <td>${p.stock} u.</td>
            <td><span class="status-badge ${p.is_active ? 'status-success' : 'status-pending'}">${p.is_active ? 'Activo' : 'Oculto'}</span></td>
            <td><button onclick="toggleProductStatus('${p.id}')" class="btn-action-small">Toggle</button></td>
        </tr>
    `).join('');
    lucide.createIcons();
}

function saveProduct() {
    const newProduct = {
        id: 'p' + Date.now(),
        business_id: business.id, // Mandatory owner_id
        name: document.getElementById('p-name').value,
        price: parseFloat(document.getElementById('p-price').value),
        stock: parseInt(document.getElementById('p-stock').value),
        category_id: document.getElementById('p-category').value,
        is_active: document.getElementById('p-active').checked,
        image_url: Storage.public + 'products/default.png', // Public Storage
        created_at: new Date().toISOString()
    };

    allProducts.push(newProduct);
    localStorage.setItem('eternal_products', JSON.stringify(allProducts));
    location.reload();
}

// Verification (Private Storage)
function simulateDocUpload(type) {
    const zone = event.currentTarget;
    zone.classList.add('uploaded');
    const path = `${Storage.private}verification-documents/${business.id}/${type}.pdf`; // Path Privado
    console.log(`Documento subido a bucket privado: ${path}`);
}

function submitVerificationDocs() {
    business.verification_submitted = true;
    localStorage.setItem('eternal_business', JSON.stringify(business));
    alert('Documentos enviados de forma segura.');
    location.reload();
}

// Helpers
function getCategoryName(id) {
    const cats = { '1': 'Alimentos', '2': 'Tecnología', '3': 'Moda', '4': 'Artesanías' };
    return cats[id] || 'General';
}
function initCharts() { /* Same logic ... */ }
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
