let cart = [];

// Header scroll effect
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

// CART LOGIC
function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('active');
}

function openProductDetail(title, price, seller, location, imgSrc) {
    const modal = document.getElementById('product-modal');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-price').innerText = price;
    document.getElementById('modal-seller').innerText = `por ${seller}`;
    document.getElementById('modal-location').innerText = location;
    document.getElementById('modal-image').style.background = `url(${imgSrc}) center/cover no-repeat`;
    
    // Almacenamos los datos para el carrito
    window.currentProduct = { title, price, seller, location, imgSrc };
    
    modal.classList.add('active');
    lucide.createIcons();
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
}

function confirmPurchase() {
    const product = window.currentProduct;
    cart.push(product);
    updateCartUI();
    closeModal();
    toggleCart(); // Mostrar el carrito automáticamente
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');
    const countBadge = document.getElementById('cart-count');
    const totalPriceEl = document.getElementById('cart-total-price');

    countBadge.innerText = cart.length;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-msg">
                <i data-lucide="shopping-cart" style="width: 48px; height: 48px; opacity: 0.2; margin-bottom: 20px;"></i>
                <p>Tu carrito está vacío</p>
                <button class="btn btn-outline" onclick="toggleCart()" style="margin-top: 20px;">Seguir comprando</button>
            </div>
        `;
        footer.style.display = 'none';
    } else {
        footer.style.display = 'block';
        let itemsHtml = '';
        let total = 0;

        cart.forEach((item, index) => {
            const priceNum = parseInt(item.price.replace(/[^\d]/g, ''));
            total += priceNum;
            itemsHtml += `
                <div class="cart-item-row">
                    <img src="${item.imgSrc}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <p>${item.price}</p>
                        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:var(--primary); font-size:0.7rem; padding:0; cursor:pointer;">Eliminar</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = itemsHtml;
        totalPriceEl.innerText = `NIO ${total.toLocaleString()}`;
    }
    lucide.createIcons();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function processCheckout() {
    const drawer = document.getElementById('cart-drawer');
    const successModal = document.getElementById('success-modal');
    
    drawer.classList.remove('active');
    
    // Simular procesamiento
    setTimeout(() => {
        successModal.style.display = 'flex';
        successModal.classList.add('active');
        cart = []; // Vaciar carrito
        updateCartUI();
        lucide.createIcons();
    }, 800);
}

function closeSuccess() {
    document.getElementById('success-modal').style.display = 'none';
    document.getElementById('success-modal').classList.remove('active');
}

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
