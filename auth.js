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
    
    btn.innerHTML = '<div class="spinner"></div>';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        // Simulación de perfiles según el correo
        let profile = {
            id: 'u-' + Math.random().toString(36).substr(2, 9),
            email: email,
            full_name: 'Usuario Demo',
            phone: '+505 8888-8888',
            avatar_url: 'https://ui-avatars.com/api/?name=Demo+User',
            role: 'customer',
            is_active: true,
            created_at: new Date().toISOString()
        };

        if (email === 'admin@eternallabs.com') {
            profile.role = 'admin';
            profile.full_name = 'Super Administrador';
            localStorage.setItem('eternal_profile', JSON.stringify(profile));
            window.location.href = '../admin/';
        } else if (email === 'vendedor@tienda.com') {
            profile.role = 'seller';
            profile.full_name = 'Dueño de Negocio';
            localStorage.setItem('eternal_profile', JSON.stringify(profile));
            window.location.href = '../seller/';
        } else {
            localStorage.setItem('eternal_profile', JSON.stringify(profile));
            window.location.href = '../';
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

    const businessFields = document.getElementById('fields-business');
    if (type === 'client') {
        businessFields.classList.add('hidden');
    } else {
        businessFields.classList.remove('hidden');
    }
}

function handleSubmit() {
    const btn = event.target;
    
    // Captura de datos según esquema recomendado
    const profile = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        email: document.getElementById('reg-email').value,
        full_name: document.getElementById('reg-name').value,
        phone: document.getElementById('reg-phone').value,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(document.getElementById('reg-name').value)}`,
        role: currentType === 'business' ? 'seller' : 'customer',
        is_active: true,
        created_at: new Date().toISOString(),
        business_name: currentType === 'business' ? document.getElementById('reg-business-name').value : null,
        city: currentType === 'business' ? document.getElementById('reg-city').value : null
    };

    btn.innerHTML = '<div class="spinner"></div>';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        localStorage.setItem('eternal_profile', JSON.stringify(profile));
        
        const successMsg = document.getElementById('success-message');
        const btnSuccess = document.querySelector('#view-success .btn-primary');
        
        if (currentType === 'business') {
            successMsg.textContent = `¡Hola ${profile.full_name}! Tu cuenta de negocio "${profile.business_name}" ha sido creada. Ahora debes completar tu verificación.`;
            btnSuccess.textContent = 'Ir al Panel de Vendedor';
            btnSuccess.onclick = () => window.location.href = '../seller/';
        } else {
            successMsg.textContent = `¡Todo listo ${profile.full_name}! Tu cuenta ha sido creada exitosamente.`;
            btnSuccess.textContent = 'Ir al Marketplace';
            btnSuccess.onclick = () => window.location.href = '../';
        }
        switchView('success');
    }, 1500);
}

// Global Styles
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
