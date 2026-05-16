import * as CartService from './CartService.js';
import * as ProductService from './ProductService.js';
import * as UIService from './UIService.js';

// Expose services to window for inline HTML handlers
window.toggleCart = CartService.toggleCart;
window.openProductDetail = CartService.openProductDetail;
window.changeQty = CartService.changeQty;
window.closeModal = CartService.closeModal;
window.confirmPurchase = CartService.confirmPurchase;
window.removeFromCart = CartService.removeFromCart;
window.showCheckout = CartService.showCheckout;
window.hideCheckout = CartService.hideCheckout;
window.processCheckout = CartService.processCheckout;
window.closeSuccess = CartService.closeSuccess;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI
    UIService.initScrollEffects();
    
    // Initial Skeletons
    ProductService.renderSkeletons();
    
    // Simulate Data Loading
    setTimeout(() => {
        ProductService.loadProducts(() => {
            UIService.setupScrollAnimations();
        });
    }, 2000);
});
