// Initialize State
let profile = JSON.parse(localStorage.getItem('eternal_profile')) || { full_name: 'Vendedor Demo', role: 'seller' };
let business = JSON.parse(localStorage.getItem('eternal_business')) || { name: 'Mi Tienda', status: 'pending', verification_submitted: false };

// UI Init
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    lucide.createIcons();
    initCharts();
});

function updateUI() {
    // Basic Info
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
        document.getElementById('business-status-msg').innerText = 'Tu negocio está activo y verificado.';
    } else if (business.verification_submitted) {
        if (warning) {
            warning.style.background = '#EFF6FF';
            warning.style.borderColor = '#DBEAFE';
            warning.querySelector('h4').innerText = 'Verificación en proceso';
            warning.querySelector('h4').style.color = '#1E40AF';
            warning.querySelector('p').innerText = 'Estamos revisando tus documentos. Te notificaremos pronto.';
            warning.querySelector('p').style.color = '#1E40AF';
            warning.querySelector('.btn-admin').style.display = 'none';
        }
        headerBadge.innerHTML = '<i data-lucide="clock" style="width:14px;"></i> En revisión';
    }

    // KYB Status in Settings
    const kybContainer = document.getElementById('kyb-status-container');
    if (kybContainer) {
        let statusHtml = '';
        if (!business.verification_submitted) {
            statusHtml = `<div style="color: var(--warning); font-weight: 600;">No has enviado tus documentos aún.</div>`;
        } else {
            statusHtml = `<div style="color: var(--info); font-weight: 600;">Documentos enviados el ${new Date().toLocaleDateString()}</div>
                          <div style="font-size: 0.8rem; margin-top: 5px;">Estado: <strong>Pendiente de aprobación</strong></div>`;
        }
        kybContainer.innerHTML = statusHtml;
    }
}

// Navigation
function switchSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionId) item.classList.add('active');
    });
    lucide.createIcons();
}

// Verification Logic
let uploadedDocs = {
    cedula_front: false,
    cedula_back: false,
    ruc: false,
    selfie: false
};

function simulateDocUpload(type) {
    const zone = event.currentTarget;
    const status = document.getElementById(`status-${type}`);
    
    zone.classList.add('uploaded');
    status.innerText = 'Cargado';
    uploadedDocs[type] = true;
    
    // Simular guardado local
    console.log(`Documento ${type} cargado exitosamente.`);
}

function submitVerificationDocs() {
    if (!uploadedDocs.cedula_front || !uploadedDocs.cedula_back || !uploadedDocs.ruc || !uploadedDocs.selfie) {
        alert('Por favor, sube todos los documentos requeridos.');
        return;
    }

    business.verification_submitted = true;
    business.status = 'pending'; // Reset just in case
    localStorage.setItem('eternal_business', JSON.stringify(business));
    
    alert('¡Documentos enviados! El equipo de EternalLabs revisará tu solicitud.');
    closeModal('verification-modal');
    updateUI();
}

// Modal Controls
function openModal(id) {
    document.getElementById(id).classList.add('active');
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Charts Init
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
