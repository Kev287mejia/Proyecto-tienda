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
        let profile = {
            id: 'u-' + Math.random().toString(36).substr(2, 9),
            email: email,
            full_name: 'Usuario Demo',
            phone: '+505 8888-8888',
            avatar_url: `https://ui-avatars.com/api/?name=Demo+User`,
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
            
            // Simulación de negocio vinculado
            let business = {
                id: 'b-' + Math.random().toString(36).substr(2, 9),
                owner_id: profile.id,
                name: 'CaribeTech Store',
                slug: 'caribetech',
                city: 'Bluefields',
                status: 'verified',
                verification_submitted: true,
                created_at: new Date().toISOString()
            };
            
            localStorage.setItem('eternal_profile', JSON.stringify(profile));
            localStorage.setItem('eternal_business', JSON.stringify(business));
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
    if (type === 'client') businessFields.classList.add('hidden');
    else businessFields.classList.remove('hidden');
}

function generateSlug(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function handleSubmit() {
    const btn = event.target;
    
    // 1. Crear Perfil (Esquema Recommended)
    const profile = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        email: document.getElementById('reg-email').value,
        full_name: document.getElementById('reg-name').value,
        phone: document.getElementById('reg-phone').value,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(document.getElementById('reg-name').value)}`,
        role: currentType === 'business' ? 'seller' : 'customer',
        is_active: true,
        created_at: new Date().toISOString()
    };

    // 2. Crear Negocio (Esquema Businesses Recommended)
    let business = null;
    if (currentType === 'business') {
        const bName = document.getElementById('reg-business-name').value;
        business = {
            id: 'b-' + Math.random().toString(36).substr(2, 9),
            owner_id: profile.id,
            name: bName,
            slug: generateSlug(bName),
            city: document.getElementById('reg-city').value,
            phone: profile.phone,
            email: profile.email,
            status: 'pending',
            verification_submitted: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }

    btn.innerHTML = '<div class="spinner"></div>';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        localStorage.setItem('eternal_profile', JSON.stringify(profile));
        if (business) localStorage.setItem('eternal_business', JSON.stringify(business));
        
        const successMsg = document.getElementById('success-message');
        const btnSuccess = document.querySelector('#view-success .btn-primary');
        
        if (currentType === 'business') {
            successMsg.textContent = `¡Felicidades ${profile.full_name}! Tu negocio "${business.name}" ha sido creado. Tu URL personalizada será: eternallabs.com/${business.slug}`;
            btnSuccess.textContent = 'Ir al Panel de Vendedor';
            btnSuccess.onclick = () => window.location.href = '../seller/';
        } else {
            successMsg.textContent = `¡Bienvenido ${profile.full_name}! Tu cuenta ha sido creada exitosamente.`;
            btnSuccess.textContent = 'Ir al Marketplace';
            btnSuccess.onclick = () => window.location.href = '../';
        }
        switchView('success');
    }, 1500);
}

// Global UI
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: #fff; animation: spin 0.8s linear infinite; margin: 0 auto; }
`;
document.head.appendChild(style);
