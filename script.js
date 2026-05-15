// Header scroll effect
const header = document.getElementById('main-header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// PRODUCT INTERACTION LOGIC
function openProductDetail(title, price, seller, location, imgSrc) {
    const modal = document.getElementById('product-modal');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-price').innerText = price;
    document.getElementById('modal-seller').innerText = `por ${seller}`;
    document.getElementById('modal-location').innerText = location;
    document.getElementById('modal-image').style.background = `url(${imgSrc}) center/cover no-repeat`;
    
    modal.classList.add('active');
    lucide.createIcons(); // Refresh icons in modal
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
}

function confirmPurchase() {
    const title = document.getElementById('modal-title').innerText;
    const btn = event.target;
    const originalText = btn.innerText;
    
    btn.innerText = 'Procesando Pedido...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    setTimeout(() => {
        alert(`🎉 ¡PEDIDO REALIZADO!\n\nTu compra de "${title}" ha sido registrada.\n\nEl vendedor se pondrá en contacto contigo para el pago contra entrega en ${document.getElementById('modal-location').innerText}.`);
        closeModal();
        btn.innerText = originalText;
        btn.style.opacity = '1';
        btn.disabled = false;
    }, 1500);
}

// Animation on scroll
const observerOptions = {
    threshold: 0.1
};

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
