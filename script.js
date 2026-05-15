// State management
let cart = [];
let currentQty = 1;

// Header scroll effect
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

// CART & MODAL LOGIC
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.toggle('active');
        if (!drawer.classList.contains('active')) hideCheckout(); // Reset view when closing
    }
}

function openProductDetail(title, price, seller, location, imgSrc) {
    const modal = document.getElementById('product-modal');
    currentQty = 1;
    document.getElementById('modal-qty').innerText = currentQty;
    
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-price').innerText = price;
    document.getElementById('modal-seller').innerText = `por ${seller}`;
    document.getElementById('modal-location').innerText = location;
    document.getElementById('modal-image').style.background = `url(${imgSrc}) center/cover no-repeat`;
    
    window.currentProduct = { title, price, seller, location, imgSrc };
    modal.classList.add('active');
    if (window.lucide) lucide.createIcons();
}

function changeQty(delta) {
    currentQty = Math.max(1, currentQty + delta);
    document.getElementById('modal-qty').innerText = currentQty;
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
}

function confirmPurchase() {
    if (!window.currentProduct) return;
    
    const productToAdd = { 
        ...window.currentProduct, 
        qty: currentQty 
    };
    
    cart.push(productToAdd);
    updateCartUI();
    closeModal();
    setTimeout(() => toggleCart(), 300);
}

function updateCartUI() {
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
                <button class="btn btn-outline" onclick="toggleCart()" style="margin-top: 20px;">Seguir comprando</button>
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
                        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:var(--primary); font-size:0.65rem; padding:0; cursor:pointer;">Eliminar</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = itemsHtml;
        const totalStr = `NIO ${total.toLocaleString()}`;
        if (totalPriceEl) totalPriceEl.innerText = totalStr;
        document.getElementById('checkout-final-total').innerText = totalStr;
    }
    if (window.lucide) lucide.createIcons();
}

// CHECKOUT FLOW
function showCheckout() {
    document.getElementById('cart-view').style.display = 'none';
    document.getElementById('checkout-view').style.display = 'flex';
    lucide.createIcons();
}

function hideCheckout() {
    document.getElementById('cart-view').style.display = 'block';
    document.getElementById('checkout-view').style.display = 'none';
}

function processCheckout() {
    const address = document.getElementById('checkout-address').value;
    if (!address) {
        alert('Por favor, ingresa tu dirección para la entrega.');
        return;
    }

    const payment = document.querySelector('input[name="payment"]:checked').value;
    const paymentLabel = payment === 'cod' ? 'Pago contra entrega' : 'Banpro Móvil';
    
    const successModal = document.getElementById('success-modal');
    const summaryList = document.getElementById('summary-items-list');
    
    // Preparar resumen final
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
    
    toggleCart(); // Close drawer
    
    setTimeout(() => {
        if (successModal) {
            successModal.style.display = 'flex';
            successModal.classList.add('active');
        }
        cart = []; 
        updateCartUI();
        document.getElementById('checkout-address').value = '';
    }, 600);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function closeSuccess() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        successModal.style.display = 'none';
        successModal.classList.remove('active');
    }
}

// Global UI setup
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Animation on scroll
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .flash-deals').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
});
