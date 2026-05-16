/**
 * GovernanceService.js - Administrative control for Super Admin
 */

import { toast } from './ToastService.js';

export const GovernanceService = {
    categories: ['Alimentos', 'Tecnología', 'Moda', 'Artesanías'],
    commissions: {
        'Alimentos': 10,
        'Tecnología': 15,
        'Moda': 12
    },

    /**
     * Add a log entry to the audit system
     * @param {string} user 
     * @param {string} action 
     */
    logAction(user, action) {
        const container = document.getElementById('admin-audit-logs');
        if (!container) return;

        const time = new Promise(resolve => {
            const now = new Date();
            resolve(`${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours()}:${now.getMinutes()}`);
        });

        time.then(t => {
            const log = document.createElement('div');
            log.style.marginBottom = '10px';
            log.innerHTML = `[${t}] <span style="color: #60A5FA;">${user}</span> ${action}`;
            container.prepend(log);
        });
    },

    async updateCommission(category, value) {
        toast.show(`Actualizando comisión de ${category} a ${value}%...`, 'info');
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.logAction('ADMIN_MASTER_01', `actualizó comisión de ${category} a ${value}%`);
        toast.show('Cambio económico aplicado globalmente.', 'success');
    },

    async createCategory(name) {
        if (!name) return;
        toast.show(`Creando categoría: ${name}...`, 'info');
        await new Promise(resolve => setTimeout(resolve, 1200));
        this.categories.push(name);
        this.logAction('ADMIN_MASTER_01', `creó la categoría global "${name}"`);
        toast.show('Taxonomía actualizada.', 'success');
    }
};
