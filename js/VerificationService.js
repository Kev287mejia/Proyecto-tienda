/**
 * VerificationService.js - Modular logic for KYB (Seller) and Auditing (Admin)
 */

import { toast } from './ToastService.js';

export const VerificationService = {
    /**
     * Simulate document upload for sellers
     * @param {string} docType 
     */
    async uploadDocument(docType) {
        toast.show(`Subiendo ${docType}...`, 'info');
        
        // Simulation delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const statusEl = document.getElementById(`status-${docType}`);
        if (statusEl) {
            statusEl.innerText = 'Cargado ✓';
            statusEl.style.color = 'var(--success)';
        }
        
        toast.show(`${docType} cargado correctamente.`, 'success');
        return true;
    },

    /**
     * Submit all documents for review
     */
    async submitKYB() {
        toast.show('Enviando documentos para revisión ministerial...', 'info');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast.show('¡Solicitud enviada! Tiempo estimado de respuesta: 24-48h.', 'success');
        
        if (window.closeModal) window.closeModal('verification-modal');
    },

    /**
     * Audit logic for Super Admin
     * @param {string} businessId 
     * @param {string} action - 'approve' | 'reject'
     */
    async processAudit(businessId, action) {
        if (action === 'approve') {
            toast.show('Procesando aprobación institucional...', 'info');
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.show('Negocio verificado. Se ha habilitado su tienda.', 'success');
        } else {
            const reason = prompt("Motivo del rechazo:");
            if (!reason) return;
            toast.show('Notificando al vendedor sobre el rechazo...', 'warning');
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.show('Auditoría finalizada con observaciones.', 'info');
        }
    }
};
