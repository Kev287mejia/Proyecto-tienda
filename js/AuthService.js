/**
 * AuthService.js - Access Control List (ACL) and Identity Management
 */

import { globalStore } from './Store.js';
import { toast } from './ToastService.js';

export const AuthService = {
    /**
     * Check if the current user has the required permissions
     * @param {string} requiredRole - 'admin' | 'seller' | 'user'
     */
    checkAccess(requiredRole) {
        const user = globalStore.getState().user;

        // If no user is logged in
        if (!user) {
            this.redirectUnauthorized('Inicia sesión para acceder a esta sección.');
            return false;
        }

        // Role hierarchy or specific check
        if (requiredRole === 'admin' && user.role !== 'admin') {
            this.redirectUnauthorized('Acceso denegado: Se requieren privilegios de Administrador Maestro.');
            return false;
        }

        if (requiredRole === 'seller' && user.role !== 'seller' && user.role !== 'admin') {
            this.redirectUnauthorized('Acceso denegado: Esta sección es exclusiva para vendedores.');
            return false;
        }

        return true;
    },

    redirectUnauthorized(message) {
        console.error(`ACL Block: ${message}`);
        
        // Show notification before redirecting (simulated)
        if (window.location.pathname.includes('super-admin') || window.location.pathname.includes('seller')) {
            toast.show(message, 'error');
            
            setTimeout(() => {
                // Redirect to login or marketplace
                window.location.href = '/'; 
            }, 2000);
        }
    },

    logout() {
        localStorage.removeItem('eternal_profile');
        globalStore.setState({ user: null });
        window.location.href = '/';
    }
};
