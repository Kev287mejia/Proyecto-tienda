let currentType = null;

function switchView(viewId) {
    const views = ['login', 'selection', 'register', 'success'];
    
    views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) {
            if (v === viewId) {
                el.classList.remove('hidden');
                el.style.animation = 'fadeIn 0.4s ease-out forwards';
            } else {
                el.classList.add('hidden');
            }
        }
    });
}

function handleLogin() {
    const email = document.getElementById('login-email').value.toLowerCase().trim();
    const btn = event.target;
    
    // Simular carga
    btn.innerHTML = '<div class="spinner"></div>';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        if (email === 'admin@eternallabs.com') {
            window.location.href = 'super-admin.html';
        } else if (email === 'vendedor@tienda.com') {
            window.location.href = 'admin.html';
        } else {
            // Usuario normal o cualquier otro
            window.location.href = 'index.html';
        }
    }, 1200);
}

function selectType(type) {
    currentType = type;
    const cards = document.querySelectorAll('.type-card');
    const btn = document.getElementById('btn-continue');

    cards.forEach(card => card.classList.remove('selected'));
    const selectedCard = type === 'client' ? cards[0] : cards[1];
    selectedCard.classList.add('selected');

    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';

    const clientFields = document.getElementById('fields-client');
    const businessFields = document.getElementById('fields-business');

    if (type === 'client') {
        clientFields.classList.remove('hidden');
        businessFields.classList.add('hidden');
    } else {
        clientFields.classList.add('hidden');
        businessFields.classList.remove('hidden');
    }
}

function handleSubmit() {
    const btn = event.target;
    btn.innerHTML = '<div class="spinner"></div>';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        const successMsg = document.getElementById('success-message');
        const btnSuccess = document.querySelector('#view-success .btn-primary');
        
        if (currentType === 'business') {
            successMsg.textContent = 'Tu cuenta de negocio ha sido creada. Ahora debes completar tu verificación para empezar a vender.';
            btnSuccess.textContent = 'Ir al Panel de Control';
            btnSuccess.onclick = () => window.location.href = 'admin.html';
        } else {
            successMsg.textContent = 'Tu cuenta ha sido creada exitosamente. ¡Bienvenido al Caribe!';
            btnSuccess.textContent = 'Ir al Marketplace';
            btnSuccess.onclick = () => window.location.href = 'index.html';
        }
        switchView('success');
    }, 1500);
}

// Estilos globales de animaciones
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes spin {
    to { transform: rotate(360deg); }
}
.spinner {
    width: 20px; height: 20px;
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 0.8s linear infinite;
    margin: 0 auto;
}
`;
document.head.appendChild(style);
