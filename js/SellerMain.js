/**
 * SellerMain.js - Refactored with Services & Skeletons
 */

import * as ChartService from './ChartService.js';
import { InventoryService } from './InventoryService.js';
import { VerificationService } from './VerificationService.js';
import { FinanceService } from './FinanceService.js';
import { AuthService } from './AuthService.js';
import { toast } from './ToastService.js';

// Access Control List (ACL) - Check for Seller privileges
if (!AuthService.checkAccess('seller')) {
    // Execution stops here
}

const state = {
    user: JSON.parse(localStorage.getItem('eternal_profile')) || { name: 'Vendedor' },
    loading: true
};

async function init() {
    renderSkeletons();
    
    // Concurrent data loading
    await Promise.all([
        new Promise(r => setTimeout(r, 2000)), // Simulate network latency
        InventoryService.loadSellerProducts(),
        FinanceService.renderHistory()
    ]);

    state.loading = false;
    updateUI();
    initSparklines();
    ChartService.initAdminCharts();
    
    if (window.lucide) {
        lucide.createIcons();
    }
}

function renderSkeletons() {
    const tableBody = document.getElementById('products-table-body');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr><td colspan="6"><div class="skeleton" style="height: 40px; margin: 10px 0;"></div></td></tr>
            <tr><td colspan="6"><div class="skeleton" style="height: 40px; margin: 10px 0;"></div></td></tr>
            <tr><td colspan="6"><div class="skeleton" style="height: 40px; margin: 10px 0;"></div></td></tr>
        `;
    }
}

function updateUI() {
    const welcomeMsg = document.getElementById('welcome-msg');
    if (welcomeMsg) welcomeMsg.innerText = `¡Hola, ${state.user.name}!`;
    
    const profileName = document.getElementById('profile-name');
    if (profileName) profileName.innerText = state.user.name;
}

function initSparklines() {
    const config = (data, color) => ({
        type: 'line',
        data: {
            labels: data.map((_, i) => i),
            datasets: [{
                data: data,
                borderColor: color,
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                backgroundColor: color.replace('1)', '0.05)'),
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });

    const sparkData = [1200, 1500, 1100, 1800, 2200, 1900, 4250];

    const ctxSales = document.getElementById('sparkline-sales')?.getContext('2d');
    if (ctxSales) new Chart(ctxSales, config(sparkData, 'rgba(16, 185, 129, 1)'));

    const ctxOrders = document.getElementById('sparkline-orders')?.getContext('2d');
    if (ctxOrders) new Chart(ctxOrders, config([5, 8, 4, 10, 12, 9, 12], 'rgba(59, 130, 246, 1)'));

    const ctxViews = document.getElementById('sparkline-views')?.getContext('2d');
    if (ctxViews) new Chart(ctxViews, config([150, 200, 180, 250, 300, 280, 342], 'rgba(212, 20, 90, 1)'));
}

// Global Actions exposed to window
window.openModal = (id) => document.getElementById(id)?.classList.add('active');
window.closeModal = (id) => document.getElementById(id)?.classList.remove('active');

window.switchSection = (id) => {
    document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if (target) target.style.display = 'block';
    
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href')?.includes(id) || item.getAttribute('onclick')?.includes(`'${id}'`)) {
            item.classList.add('active');
        }
    });
};

window.simulateDocUpload = (type) => VerificationService.uploadDocument(type);
window.submitVerificationDocs = () => VerificationService.submitKYB();
window.saveProduct = () => InventoryService.saveProduct();
window.requestPayout = () => FinanceService.requestPayout();

document.addEventListener('DOMContentLoaded', init);
