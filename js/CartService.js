import { globalStore } from './Store.js';

export let currentQty = 1;

// Initial sync with store
let cart = globalStore.getState().cart;

// Subscribe to store changes to keep local cart reference updated
globalStore.subscribe((state) => {
    cart = state.cart;
    updateCartUI();
});

export function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.toggle('active');
        if (!drawer.classList.contains('active')) hideCheckout();
    }
}

export function openProductDetail(title, price, seller, location, imgSrc) {
    const modal = document.getElementById('product-modal');
    currentQty = 1;
    document.getElementById('modal-qty').innerText = currentQty;
    
    window.basePriceNum = parseInt(price.replace(/[^\d]/g, '')) || 0;
    
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-price').innerText = price;
    document.getElementById('modal-seller').innerText = `por ${seller}`;
    document.getElementById('modal-location').innerText = location;
    document.getElementById('modal-image').style.background = `url(${imgSrc}) center/cover no-repeat`;
    
    window.currentProduct = { title, price, seller, location, imgSrc };
    modal.classList.add('active');
    if (window.lucide) lucide.createIcons();
}

export function changeQty(delta) {
    currentQty = Math.max(1, currentQty + delta);
    document.getElementById('modal-qty').innerText = currentQty;
    
    const newTotal = window.basePriceNum * currentQty;
    document.getElementById('modal-price').innerText = `NIO ${newTotal.toLocaleString()}`;
}

export function closeModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.remove('active');
}

export function confirmPurchase() {
    if (!window.currentProduct) return;
    
    const productToAdd = { 
        ...window.currentProduct, 
        qty: currentQty 
    };
    
    const newCart = [...cart, productToAdd];
    globalStore.setState({ cart: newCart });
    
    if (navigator.vibrate) {
        navigator.vibrate(15);
    }

    closeModal();
    setTimeout(() => toggleCart(), 300);
}

export function updateCartUI() {
    const container = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');
    const countBadge = document.getElementById('cart-count');
    const totalPriceEl = document.getElementById('cart-total-price');

    if (!container || !countBadge) return;

    countBadge.innerText = cart.length;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-msg">
                <i data-lucide="shopping-cart" style="width: 48px; height: 48px; opacity: 0.2; margin-bottom: 20px;"></i>
                <p>Tu carrito está vacío</p>
                <button class="btn btn-outline" onclick="window.toggleCart()" style="margin-top: 20px;">Seguir comprando</button>
            </div>
        `;
        if (footer) footer.style.display = 'none';
    } else {
        if (footer) footer.style.display = 'block';
        let itemsHtml = '';
        let total = 0;

        cart.forEach((item, index) => {
            const priceNum = parseInt(item.price.replace(/[^\d]/g, '')) || 0;
            total += (priceNum * item.qty);
            
            itemsHtml += `
                <div class="cart-item-row">
                    <div style="width: 50px; height: 50px; border-radius: 10px; background: url(${item.imgSrc}) center/cover no-repeat; flex-shrink: 0;"></div>
                    <div class="cart-item-info">
                        <h4 style="margin: 0; font-size: 0.85rem;">${item.title}</h4>
                        <p style="margin: 2px 0; font-size: 0.75rem; color: var(--text-muted);">Cant: ${item.qty} • ${item.price}</p>
                        <button onclick="window.removeFromCart(${index})" style="background:none; border:none; color:var(--primary); font-size:0.65rem; padding:0; cursor:pointer;">Eliminar</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = itemsHtml;
        const totalStr = `NIO ${total.toLocaleString()}`;
        if (totalPriceEl) totalPriceEl.innerText = totalStr;
        const checkoutTotal = document.getElementById('checkout-final-total');
        if (checkoutTotal) checkoutTotal.innerText = totalStr;
    }
    if (window.lucide) lucide.createIcons();
}

export function removeFromCart(index) {
    const newCart = cart.filter((_, i) => i !== index);
    globalStore.setState({ cart: newCart });
}

export function showCheckout() {
    document.getElementById('cart-view').style.display = 'none';
    document.getElementById('checkout-view').style.display = 'flex';
    if (window.lucide) lucide.createIcons();
}

export function hideCheckout() {
    document.getElementById('cart-view').style.display = 'block';
    document.getElementById('checkout-view').style.display = 'none';
}

export function processCheckout() {
    const address = document.getElementById('checkout-address').value;
    if (!address) {
        alert('Por favor, ingresa tu dirección para la entrega.');
        return;
    }

    const paymentEl = document.querySelector('input[name="payment"]:checked');
    const payment = paymentEl ? paymentEl.value : 'cod';
    const paymentLabel = payment === 'cod' ? 'Pago contra entrega' : 'Billetera Móvil Banpro';
    
    const successModal = document.getElementById('success-modal');
    const summaryList = document.getElementById('summary-items-list');
    
    let summaryHtml = '';
    cart.forEach(item => {
        summaryHtml += `
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                <span>${item.qty}x ${item.title}</span>
                <span style="font-weight: 600;">${item.price}</span>
            </div>
        `;
    });
    summaryHtml += `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ddd; font-size: 0.8rem; opacity: 0.8;">
        <strong>Pago:</strong> ${paymentLabel}<br>
        <strong>Entrega:</strong> ${address}
    </div>`;
    
    if (summaryList) summaryList.innerHTML = summaryHtml;
    
    toggleCart();
    
    setTimeout(() => {
        if (successModal) {
            successModal.style.display = 'flex';
            successModal.classList.add('active');
        }
        globalStore.setState({ cart: [] });
        document.getElementById('checkout-address').value = '';
    }, 600);
}

export function closeSuccess() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        successModal.style.display = 'none';
        successModal.classList.remove('active');
    }
}
