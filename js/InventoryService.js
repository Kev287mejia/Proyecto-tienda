/**
 * InventoryService.js - Modular logic for Seller Products and Stock
 */

import { toast } from './ToastService.js';

export const InventoryService = {
    products: [],

    async loadSellerProducts() {
        // Simulation of network fetch
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Mock data
        this.products = [
            { id: 1, name: 'Café Bluefields', category: 'Alimentos', price: 120, stock: 45, status: 'active' },
            { id: 2, name: 'Camisa Caribeña', category: 'Moda', price: 350, stock: 12, status: 'active' }
        ];
        
        this.renderTable();
    },

    renderTable() {
        const container = document.getElementById('products-table-body');
        if (!container) return;

        container.innerHTML = this.products.map((p, index) => `
            <tr class="animate-in" style="animation-delay: ${index * 0.1}s">
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; background: #eee; border-radius: 6px;"></div>
                        <strong>${p.name}</strong>
                    </div>
                </td>
                <td>${p.category}</td>
                <td>NIO ${p.price}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span>${p.stock}</span>
                        <div class="inventory-bar-bg"><div class="inventory-bar-fill" style="width: ${Math.min(p.stock, 100)}%; background: ${p.stock < 10 ? 'var(--danger)' : 'var(--success)'}"></div></div>
                    </div>
                </td>
                <td><span class="status-badge status-success">Activo</span></td>
                <td>
                    <button class="btn-admin" style="padding: 6px 12px; background: #F1F5F9; font-size: 0.75rem;">Editar</button>
                </td>
            </tr>
        `).join('');
    },

    async saveProduct(data) {
        toast.show('Publicando producto...', 'info');
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.show('¡Producto publicado con éxito!', 'success');
        
        if (window.switchSection) window.switchSection('products');
        this.loadSellerProducts();
    }
};
