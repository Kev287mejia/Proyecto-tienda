/**
 * ToastService.js - Premium Notification System
 * Features: Glassmorphism, animations, and multiple states (Success, Error, Info)
 */

class ToastService {
    constructor() {
        this.container = this._createContainer();
    }

    _createContainer() {
        let container = document.getElementById('pc-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'pc-toast-container';
            container.style.cssText = `
                position: fixed;
                bottom: 32px;
                right: 32px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 12px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    /**
     * Show a premium toast
     * @param {string} message 
     * @param {string} type - 'success' | 'error' | 'info' | 'warning'
     */
    show(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            info: '#3B82F6',
            warning: '#F59E0B'
        };

        toast.className = 'pc-toast animate-in';
        toast.style.cssText = `
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: white;
            padding: 16px 24px;
            border-radius: 16px;
            border-left: 4px solid ${colors[type]};
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            pointer-events: auto;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 600;
            font-size: 0.9rem;
            animation: pcToastIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        `;

        const icon = this._getIcon(type);
        toast.innerHTML = `
            <div style="color: ${colors[type]}; display: flex;">${icon}</div>
            <div style="flex: 1;">${message}</div>
        `;

        this.container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'pcToastOut 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }

    _getIcon(type) {
        // Basic SVG icons for portability without external deps if needed
        const icons = {
            success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
            info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
            warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
        };
        return icons[type];
    }
}

// Inject styles for toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pcToastIn {
        from { transform: translateX(100%) scale(0.9); opacity: 0; }
        to { transform: translateX(0) scale(1); opacity: 1; }
    }
    @keyframes pcToastOut {
        from { transform: translateX(0) scale(1); opacity: 1; }
        to { transform: translateX(100%) scale(0.9); opacity: 0; }
    }
`;
document.head.appendChild(style);

export const toast = new ToastService();
