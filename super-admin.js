function showSection(sectionId) {
    const sections = document.querySelectorAll('main > section');
    const navItems = document.querySelectorAll('.nav-item');

    sections.forEach(s => {
        if (s.id === `section-${sectionId}`) {
            s.classList.remove('hidden');
        } else {
            s.classList.add('hidden');
        }
    });

    navItems.forEach(item => {
        if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(sectionId)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// LIVE DASHBOARD LOGIC
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = Math.floor(progress * (end - start) + start);
        obj.innerHTML = currentVal.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function updateDashboardRange(range) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.innerText.toLowerCase() === range) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    showToast(`Sincronizando datos de ${range}...`, 'info');

    if (range === 'hoy') {
        animateValue('stat-sales', 100000, 245800, 1000);
        animateValue('stat-users', 10, 42, 800);
    } else if (range === 'semana') {
        animateValue('stat-sales', 500000, 1450000, 1000);
        animateValue('stat-users', 100, 850, 1000);
    } else {
        animateValue('stat-sales', 2000000, 5245800, 1000);
        animateValue('stat-users', 1000, 3420, 1000);
    }
}

setInterval(() => {
    const userStat = document.getElementById('stat-users');
    if (userStat && document.getElementById('section-dashboard').classList.contains('hidden') === false) {
        const current = parseInt(userStat.innerText.replace(/,/g, ''));
        const change = Math.floor(Math.random() * 5) - 2;
        userStat.innerText = (current + change).toLocaleString();
    }
}, 3000);

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    if (type === 'success') icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    if (type === 'error') icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function showModal(contentHtml) {
    const overlay = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-body');
    body.innerHTML = contentHtml;
    overlay.classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

function approveBusiness() {
    const checks = document.querySelectorAll('.validation-actions input[type="checkbox"]');
    const allChecked = Array.from(checks).every(c => c.checked);
    if (!allChecked) {
        showToast('Debes completar la lista de verificación primero', 'error');
        return;
    }
    showModal(`
        <div class="modal-header">
            <div class="modal-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--success);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h2 style="font-size: 1.25rem;">¿Confirmar Aprobación?</h2>
        </div>
        <p style="color: var(--text-muted); margin-bottom: 24px;">Estás a punto de habilitar a "Puerto de Sabores" para vender públicamente en el marketplace.</p>
        <div style="display: flex; gap: 12px;">
            <button class="btn-action btn-approve" onclick="executeApproval()" style="flex: 1;">Aprobar Ahora</button>
            <button class="btn-action" onclick="closeModal()" style="flex: 1; background: #F1F5F9; color: var(--text-main);">Cancelar</button>
        </div>
    `);
}

function executeApproval() {
    closeModal();
    showToast('Procesando aprobación...', 'info');
    setTimeout(() => {
        const statusLabel = document.getElementById('status-puerto');
        const actionBtn = document.getElementById('btn-revisar-puerto');
        if (statusLabel) {
            statusLabel.className = 'status-tag status-verified';
            statusLabel.textContent = 'Verificado';
        }
        if (actionBtn) {
            actionBtn.textContent = 'Ver Detalle';
            actionBtn.onclick = () => viewBusinessDetail('Puerto de Sabores');
        }
        showToast('Negocio aprobado exitosamente', 'success');
        showSection('businesses');
    }, 1500);
}

function suspendUser(btn, name) {
    showModal(`
        <div class="modal-header">
            <div class="modal-icon" style="background: rgba(239, 68, 68, 0.1); color: var(--danger);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
            </div>
            <h2 style="font-size: 1.25rem;">Suspender a ${name}</h2>
        </div>
        <p style="color: var(--text-muted); margin-bottom: 24px;">Esta acción restringirá el acceso del usuario a las compras de forma inmediata.</p>
        <div style="display: flex; gap: 12px;">
            <button class="btn-action btn-reject" onclick="executeSuspension('${name}')" style="flex: 1;">Confirmar Suspensión</button>
            <button class="btn-action" onclick="closeModal()" style="flex: 1; background: #F1F5F9; color: var(--text-main);">Cancelar</button>
        </div>
    `);
    window.lastSuspendBtn = btn;
}

function executeSuspension(name) {
    closeModal();
    const btn = window.lastSuspendBtn;
    const row = btn.closest('tr');
    const statusTag = row.querySelector('.status-tag');
    showToast(`Enviando notificación vía Resend...`, 'info');
    setTimeout(() => {
        statusTag.className = 'status-tag';
        statusTag.style.background = '#FEE2E2';
        statusTag.style.color = '#B91C1C';
        statusTag.textContent = 'Suspendido';
        btn.textContent = 'Reactivar';
        btn.style.color = 'var(--success)';
        btn.onclick = () => {
            showToast(`Usuario ${name} reactivado`, 'success');
            location.reload();
        };
        showToast(`Notificación enviada a ${name} exitosamente`, 'success');
        showToast(`${name} ha sido bloqueado en la plataforma`, 'error');
    }, 2000);
}

function viewReceipt(orderId) {
    showModal(`
        <div class="modal-header">
            <div class="modal-icon" style="background: rgba(59, 130, 246, 0.1); color: var(--info);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line></svg>
            </div>
            <h2 style="font-size: 1.25rem;">Comprobante ${orderId}</h2>
        </div>
        <div style="background: #F8FAFC; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 10px;">Vista previa de transferencia Banpro</p>
            <div style="width: 100%; height: 200px; border: 2px dashed #CBD5E1; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #94A3B8;">
                [IMAGEN DEL COMPROBANTE]
            </div>
        </div>
        <button class="btn-action btn-approve" onclick="closeModal()">Cerrar Visor</button>
    `);
}

function viewBusinessDetail(name) {
    showModal(`
        <div class="modal-header">
            <div class="modal-icon" style="background: rgba(212, 20, 90, 0.1); color: var(--primary);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9 12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            </div>
            <h2 style="font-size: 1.25rem;">${name}</h2>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 24px;">
            <div style="padding: 15px; background: #F8FAFC; border-radius: 12px;">
                <p style="font-size: 0.7rem; color: var(--text-muted);">Reputación</p>
                <p style="font-weight: 700; color: var(--warning);">★ 4.8 / 5.0</p>
            </div>
            <div style="padding: 15px; background: #F8FAFC; border-radius: 12px;">
                <p style="font-size: 0.7rem; color: var(--text-muted);">Ventas</p>
                <p style="font-weight: 700;">NIO 45,800</p>
            </div>
        </div>
        <button class="btn-action" onclick="closeModal()" style="width: 100%; background: #0F172A; color: white;">Cerrar Detalle</button>
    `);
}

function blockIP(ip) {
    showModal(`
        <div class="modal-header">
            <div class="modal-icon" style="background: rgba(239, 68, 68, 0.1); color: var(--danger);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>
            </div>
            <h2 style="font-size: 1.25rem;">Bloquear Dirección IP</h2>
        </div>
        <p style="color: var(--text-muted); margin-bottom: 24px;">Estás a punto de restringir permanentemente el acceso a la IP <strong>${ip}</strong>. Este usuario no podrá ni siquiera ver el marketplace.</p>
        <button class="btn-action btn-reject" style="width: 100%;" onclick="executeIPBlock('${ip}')">Confirmar Bloqueo de Red</button>
    `);
}

function executeIPBlock(ip) {
    closeModal();
    showToast(`IP ${ip} ha sido agregada a la lista negra`, 'error');
}

function clearSecurityLogs() {
    if (confirm('¿Deseas marcar todas las alertas como revisadas?')) {
        document.getElementById('security-logs-container').innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.2);">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <p>No hay alertas pendientes</p>
            </div>
        `;
        showToast('Logs de seguridad despejados', 'success');
    }
}

// Charts Initialization - REFINED MINIMALIST LOOK
window.onload = () => {
    animateValue('stat-sales', 100000, 245800, 2000);
    animateValue('stat-businesses', 50, 124, 1500);
    animateValue('stat-users', 0, 42, 2500);

    const ctxMain = document.getElementById('mainChart')?.getContext('2d');
    if (ctxMain) {
        new Chart(ctxMain, {
            type: 'line',
            data: {
                labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                datasets: [{
                    data: [12000, 19000, 15000, 22000, 21000, 28000, 24580],
                    borderColor: '#D4145A',
                    backgroundColor: 'rgba(212, 20, 90, 0.05)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0, // Cleaner pro look
                    pointHoverRadius: 6,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { display: false }, // Extreme minimalist pro look
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#94A3B8', font: { size: 10 } }
                    }
                }
            }
        });
    }

    const ctxRegion = document.getElementById('regionChart')?.getContext('2d');
    if (ctxRegion) {
        new Chart(ctxRegion, {
            type: 'doughnut',
            data: {
                labels: ['Bluefields', 'Bilwi'],
                datasets: [{
                    data: [65, 35],
                    backgroundColor: ['#D4145A', '#0F172A'],
                    borderWidth: 0,
                    cutout: '85%' // Thinner ring for premium feel
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }
};
