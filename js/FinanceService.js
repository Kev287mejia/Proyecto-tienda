/**
 * FinanceService.js - Logic for Seller Wallet and Transactions
 */

import { toast } from './ToastService.js';

export const FinanceService = {
    transactions: [
        { date: '2026-05-15', concept: 'Venta #ORD-8291', amount: 1200, commission: 120, net: 1080 },
        { date: '2026-05-14', concept: 'Venta #ORD-8288', amount: 450, commission: 45, net: 405 },
        { date: '2026-05-12', concept: 'Retiro a Banpro', amount: -5000, commission: 0, net: -5000 }
    ],

    renderHistory() {
        const container = document.getElementById('finance-table-body');
        if (!container) return;

        container.innerHTML = this.transactions.map((t, index) => `
            <tr class="animate-in" style="animation-delay: ${index * 0.1}s">
                <td>${t.date}</td>
                <td>${t.concept}</td>
                <td style="color: ${t.amount > 0 ? 'var(--success)' : 'var(--danger)'}">NIO ${t.amount.toLocaleString()}</td>
                <td>NIO ${t.commission}</td>
                <td style="font-weight: 700;">NIO ${t.net.toLocaleString()}</td>
            </tr>
        `).join('');
    },

    async requestPayout() {
        toast.show('Validando fondos y cuenta bancaria...', 'info');
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.show('¡Solicitud de retiro enviada! Recibirás tus fondos en un máximo de 24h hábiles.', 'success');
    }
};
