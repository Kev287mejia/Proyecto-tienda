/**
 * AdminMain.js - Refactored for Super Admin
 */

import * as ChartService from './ChartService.js';
import { VerificationService } from './VerificationService.js';
import { GovernanceService } from './GovernanceService.js';
import { AuthService } from './AuthService.js';
import { toast } from './ToastService.js';

// Access Control List (ACL) - Check for Master privileges
if (!AuthService.checkAccess('admin')) {
    // Execution stops here due to redirection in checkAccess
}

const Storage = {
    public: 'https://eternallabs.storage/public/',
    private: 'https://eternallabs.storage/private/'
};

const state = {
    sales: 245800,
    businesses: JSON.parse(localStorage.getItem('eternal_all_businesses')) || [
        { id: 'b1', name: 'TecnoCaribe', owner: 'Juan Carlos', city: 'Bluefields', status: 'verified', sales: 45000 },
        { id: 'b2', name: 'Puerto de Sabores', owner: 'Bayardo Porta', city: 'Bluefields', status: 'pending', sales: 0 }
    ]
};

export function renderBusinesses() {
    const container = document.getElementById('business-table-body');
    if (!container) return;

    container.innerHTML = state.businesses.map((b, index) => `
        <tr class="animate-in" style="animation-delay: ${index * 0.1}s">
            <td><strong>${b.name}</strong></td>
            <td>${b.owner}</td>
            <td>${b.city}</td>
            <td>NIO ${b.sales.toLocaleString()}</td>
            <td><span class="status-tag status-${b.status}">${b.status === 'verified' ? 'Verificado' : 'Pendiente'}</span></td>
            <td>
                <button style="border: none; background: transparent; cursor: pointer; color: var(--info); font-weight: 700;" onclick="window.viewVerification('${b.id}')">Auditar</button>
            </td>
        </tr>
    `).join('');
}

export function viewVerification(id) {
    const titleEl = document.getElementById('doc-title');
    if (titleEl) titleEl.innerText = id === 'b2' ? 'Cédula de Identidad (Frontal) - Puerto de Sabores' : 'Documento de Identidad';
    showSection('validation');
}

export function showSection(sectionId) {
    document.querySelectorAll('main section').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(`section-${sectionId}`);
    if (target) target.classList.remove('hidden');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick')?.includes(`'${sectionId}'`)) {
            item.classList.add('active');
        }
    });
}

// Viewer Controls
let currentRotation = 0;
let currentZoom = 1;

export function rotateDoc() {
    currentRotation = (currentRotation + 90) % 360;
    applyViewerTransform();
}

export function zoomDoc(delta) {
    currentZoom = Math.min(Math.max(currentZoom * delta, 0.5), 3);
    applyViewerTransform();
}

function applyViewerTransform() {
    const canvas = document.getElementById('doc-canvas');
    if (canvas) {
        canvas.style.transform = `rotate(${currentRotation}deg) scale(${currentZoom})`;
    }
}

export function approveBusiness() {
    VerificationService.processAudit(null, 'approve');
    setTimeout(() => showSection('businesses'), 2000);
}

export function rejectBusiness() {
    VerificationService.processAudit(null, 'reject');
}

export function updateStats() {
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

// Global exposure
window.showSection = showSection;
window.viewVerification = viewVerification;
window.rotateDoc = rotateDoc;
window.zoomDoc = zoomDoc;
window.approveBusiness = approveBusiness;
window.rejectBusiness = rejectBusiness;
window.logAdminAction = (action) => GovernanceService.logAction('ADMIN_MASTER_01', action);

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        updateStats();
        renderBusinesses();
        ChartService.initAdminCharts();
    }, 1500);
});
