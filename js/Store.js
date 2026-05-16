/**
 * Store.js - Centralized Reactive State Management
 * Implements the Observer Pattern and Cross-Tab Synchronization
 */

class Store {
    constructor(initialState = {}, storageKey = 'pc_global_state') {
        this.storageKey = storageKey;
        this.listeners = [];
        
        // Load initial state from localStorage or use default
        const savedState = localStorage.getItem(this.storageKey);
        this.state = savedState ? JSON.parse(savedState) : initialState;

        // Listen for changes from other tabs
        window.addEventListener('storage', (event) => {
            if (event.key === this.storageKey) {
                this.state = JSON.parse(event.newValue);
                this.notify();
            }
        });
    }

    getState() {
        return this.state;
    }

    /**
     * Update state and notify all subscribers
     * @param {Object} newState 
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        this.notify();
    }

    /**
     * Subscribe to state changes
     * @param {Function} callback 
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this.listeners.push(callback);
        // Immediate call with current state
        callback(this.state);
        
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notify() {
        this.listeners.forEach(callback => callback(this.state));
    }
}

// Singleton instance for the whole platform
export const globalStore = new Store({
    cart: [],
    user: JSON.parse(localStorage.getItem('eternal_profile')) || null,
    theme: 'light'
});
