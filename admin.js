// Initialize State
let profile = JSON.parse(localStorage.getItem('eternal_profile')) || { full_name: 'Vendedor Demo', role: 'seller' };
let business = JSON.parse(localStorage.getItem('eternal_business')) || { name: 'Mi Tienda', status: 'pending', verification_submitted: false };

// Simulated Products Database (Supabase-ready schema)
let products = JSON.parse(localStorage.getItem('eternal_products')) || [
    {
        id: 'p1',
        business_id: business.id || 'b1',
        name: 'Café Gourmet Bluefields',
        slug: 'cafe-gourmet-bluefields',
        description: 'Café artesanal de la Costa Caribe.',
        price: 450,
        old_price: 600,
        stock: 24,
        category_id: '1',
        is_active: true,
        is_featured: true,
        image_url: '../caribbean_coffee_product_1778800497641.png',
        created_at: new Date().toISOString()
    }
];

// UI Init
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    renderProducts();
    lucide.createIcons();
    initCharts();
});

function updateUI() {
    document.getElementById('profile-name').innerText = profile.full_name;
    document.getElementById('welcome-msg').innerText = `¡Hola, ${business.name}!`;
    
    // Status Logic
    const warning = document.getElementById('verification-warning');
    const headerBadge = document.getElementById('status-badge-header');
    
    if (business.status === 'verified') {
        if (warning) warning.style.display = 'none';
        headerBadge.innerHTML = '<i data-lucide="check-circle" style="width:14px;"></i> Verificado';
        headerBadge.style.background = 'rgba(16, 185, 129, 0.1)';
        headerBadge.style.color = 'var(--success)';
    }

    // Update Stats
    document.querySelector('.stat-card:nth-child(3) .stat-value').innerText = products.filter(p => p.is_active).length;
}

// Navigation
function switchSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(sectionId)) item.classList.add('active');
    });
    lucide.createIcons();
}

function showProductForm() {
    switchSection('product-form');
}

// Product Management
function renderProducts() {
    const container = document.getElementById('products-table-body');
    if (!container) return;

    container.innerHTML = products.map(p => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background: url(${p.image_url}) center/cover no-repeat; border: 1px solid #eee;"></div>
                    <div style="font-weight: 600;">${p.name}</div>
                </div>
            </td>
            <td>${getCategoryName(p.category_id)}</td>
            <td>
                <div style="font-weight: 600;">NIO ${p.price.toLocaleString()}</div>
                ${p.old_price ? `<div style="font-size: 0.7rem; text-decoration: line-through; opacity: 0.5;">NIO ${p.old_price.toLocaleString()}</div>` : ''}
            </td>
            <td>
                ${p.stock} u.
                <div style="width: 100%; height: 4px; background: #eee; border-radius: 2px; margin-top: 4px;">
                    <div style="width: ${Math.min(100, (p.stock/50)*100)}%; height: 100%; background: ${p.stock < 10 ? 'var(--primary)' : 'var(--success)'}; border-radius: 2px;"></div>
                </div>
            </td>
            <td>
                <span class="status-badge ${p.is_active ? 'status-success' : 'status-pending'}">
                    ${p.is_active ? 'Activo' : 'Oculto'}
                </span>
            </td>
            <td>
                <button onclick="toggleProductStatus('${p.id}')" style="background:none; border:none; cursor:pointer; color:var(--info); font-size: 0.8rem;">
                    ${p.is_active ? 'Desactivar' : 'Activar'}
                </button>
            </td>
        </tr>
    `).join('');
    lucide.createIcons();
}

function getCategoryName(id) {
    const cats = { '1': 'Alimentos', '2': 'Tecnología', '3': 'Moda', '4': 'Artesanías' };
    return cats[id] || 'General';
}

function saveProduct() {
    const newProduct = {
        id: 'p' + (products.length + 1),
        business_id: business.id,
        name: document.getElementById('p-name').value,
        slug: document.getElementById('p-name').value.toLowerCase().replace(/ /g, '-'),
        description: document.getElementById('p-desc').value,
        price: parseFloat(document.getElementById('p-price').value),
        old_price: parseFloat(document.getElementById('p-old-price').value) || null,
        stock: parseInt(document.getElementById('p-stock').value),
        category_id: document.getElementById('p-category').value,
        is_active: document.getElementById('p-active').checked,
        is_featured: document.getElementById('p-featured').checked,
        image_url: '../caribbean_coffee_product_1778800497641.png', // Mock image
        created_at: new Date().toISOString()
    };

    if (!newProduct.name || !newProduct.price) {
        alert('Por favor completa los campos básicos.');
        return;
    }

    products.push(newProduct);
    localStorage.setItem('eternal_products', JSON.stringify(products));
    
    alert('¡Producto publicado con éxito!');
    renderProducts();
    switchSection('products');
}

function toggleProductStatus(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.is_active = !product.is_active;
        localStorage.setItem('eternal_products', JSON.stringify(products));
        renderProducts();
        updateUI();
    }
}

// Verification Logic
let uploadedDocs = { cedula_front: false, cedula_back: false, ruc: false, selfie: false };

function simulateDocUpload(type) {
    const zone = event.currentTarget;
    const status = document.getElementById(`status-${type}`);
    zone.classList.add('uploaded');
    status.innerText = 'Cargado';
    uploadedDocs[type] = true;
}

function submitVerificationDocs() {
    if (!uploadedDocs.cedula_front || !uploadedDocs.cedula_back || !uploadedDocs.ruc || !uploadedDocs.selfie) {
        alert('Por favor, sube todos los documentos.');
        return;
    }
    business.verification_submitted = true;
    localStorage.setItem('eternal_business', JSON.stringify(business));
    alert('Documentos enviados para revisión.');
    location.reload();
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function initCharts() {
    const ctx = document.getElementById('salesChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
                datasets: [{
                    label: 'Ventas (NIO)',
                    data: [1200, 1900, 3000, 2500, 4200, 3800, 5000],
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
    }
}
