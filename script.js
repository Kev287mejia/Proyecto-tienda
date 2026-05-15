// State management
let cart = [];

// Header scroll effect
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

// CART LOGIC
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.toggle('active');
        console.log('Toggle Cart:', drawer.classList.contains('active'));
    }
}

function openProductDetail(title, price, seller, location, imgSrc) {
    console.log('Opening product:', title);
    const modal = document.getElementById('product-modal');
    
    // Set UI elements
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-price').innerText = price;
    document.getElementById('modal-seller').innerText = `por ${seller}`;
    document.getElementById('modal-location').innerText = location;
    document.getElementById('modal-image').style.background = `url(${imgSrc}) center/cover no-repeat`;
    
    // Store current selection for cart
    window.currentProduct = { title, price, seller, location, imgSrc };
    
    // Open modal
    modal.classList.add('active');
    if (window.lucide) lucide.createIcons();
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
}

function confirmPurchase() {
    console.log('Adding to cart:', window.currentProduct);
    if (!window.currentProduct) return;
    
    // Add to state
    cart.push({ ...window.currentProduct });
    
    // Update UI
    updateCartUI();
    
    // Close modal and show cart
    closeModal();
    setTimeout(() => {
        toggleCart();
    }, 300);
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
            // Safe price parsing
            const priceNum = parseInt(item.price.replace(/[^\d]/g, '')) || 0;
            total += priceNum;
            
            itemsHtml += `
                <div class="cart-item-row">
                    <div style="width: 60px; height: 60px; border-radius: 12px; background: url(${item.imgSrc}) center/cover no-repeat; flex-shrink: 0;"></div>
                    <div class="cart-item-info">
                        <h4 style="margin: 0; font-size: 0.9rem;">${item.title}</h4>
                        <p style="margin: 4px 0; color: var(--primary); font-weight: 700;">${item.price}</p>
                        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:var(--text-muted); font-size:0.7rem; padding:0; cursor:pointer; text-decoration: underline;">Eliminar</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = itemsHtml;
        if (totalPriceEl) totalPriceEl.innerText = `NIO ${total.toLocaleString()}`;
    }
    
    if (window.lucide) lucide.createIcons();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function processCheckout() {
    console.log('Processing checkout for', cart.length, 'items');
    const drawer = document.getElementById('cart-drawer');
    const successModal = document.getElementById('success-modal');
    const summaryList = document.getElementById('summary-items-list');
    
    if (drawer) drawer.classList.remove('active');
    
    // Preparar el resumen antes de vaciar
    let summaryHtml = '';
    cart.forEach(item => {
        summaryHtml += `
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                <span style="font-weight: 500;">${item.title}</span>
                <span style="color: var(--primary); font-weight: 600;">${item.price}</span>
            </div>
        `;
    });
    if (summaryList) summaryList.innerHTML = summaryHtml;
    
    // Simulate API call
    setTimeout(() => {
        if (successModal) {
            successModal.style.display = 'flex';
            successModal.classList.add('active');
        }
        cart = []; 
        updateCartUI();
    }, 600);
}

function closeSuccess() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        successModal.style.display = 'none';
        successModal.classList.remove('active');
    }
}

// Initial setup
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
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});
