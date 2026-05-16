export const productsData = [
    {
        id: 1,
        title: 'Audífonos Inalámbricos Pro',
        price: 'NIO 1,850',
        oldPrice: 'NIO 2,400',
        seller: 'TecnoCaribe',
        location: 'Bluefields',
        rating: '4.8',
        img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
        badge: '-23%',
        badgeClass: 'badge-discount'
    },
    {
        id: 2,
        title: 'Vestido Tropical Estampado',
        price: 'NIO 950',
        seller: 'Modas Maritza',
        location: 'Bilwi',
        rating: '4.9',
        img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 3,
        title: 'Café Gourmet del Caribe',
        price: 'NIO 450',
        seller: 'Granos de Oro',
        location: 'Bluefields',
        rating: '5.0',
        img: 'caribbean_coffee_product_1778800497641.png',
        badge: 'NUEVO',
        badgeClass: 'badge-new'
    }
];

export function renderSkeletons() {
    const grid = document.getElementById('product-grid-main');
    if (!grid) return;

    let skeletonsHtml = '';
    for (let i = 0; i < 3; i++) {
        skeletonsHtml += `
            <div class="skeleton-card">
                <div class="skeleton skeleton-img"></div>
                <div class="skeleton skeleton-text" style="width: 30%; margin-bottom: 15px;"></div>
                <div class="skeleton skeleton-text skeleton-title"></div>
                <div class="skeleton skeleton-text" style="width: 50%;"></div>
                <div class="skeleton skeleton-price"></div>
            </div>
        `;
    }
    grid.innerHTML = skeletonsHtml;
}

export function loadProducts(callback) {
    const grid = document.getElementById('product-grid-main');
    if (!grid) return;

    // Detect if we are in a subfolder to adjust image paths
    const isSubfolder = window.location.pathname.includes('/marketplace/') || 
                        window.location.pathname.includes('/product/') ||
                        window.location.pathname.includes('/register/');
    const basePath = isSubfolder ? '../' : '';

    let productsHtml = '';
    productsData.forEach((p, index) => {
        const delay = index * 0.1;
        const finalImg = p.img.startsWith('http') ? p.img : basePath + p.img;
        
        productsHtml += `
            <div class="product-card animate-in" 
                 style="animation-delay: ${delay}s"
                 onclick="window.openProductDetail('${p.title}', '${p.price}', '${p.seller}', '${p.location}', '${finalImg}')">
                <div class="product-img">
                    <img src="${finalImg}" alt="${p.title}">
                    ${p.badge ? `<div class="badge ${p.badgeClass}">${p.badge}</div>` : ''}
                    <div class="wishlist-btn"><i data-lucide="heart"></i></div>
                </div>
                <div class="product-info">
                    <div class="product-meta">
                        <span class="product-location"><i data-lucide="map-pin"></i> ${p.location}</span>
                        <span class="product-rating"><i data-lucide="star"></i> ${p.rating}</span>
                    </div>
                    <h3 class="product-title">${p.title}</h3>
                    <p class="product-seller">por ${p.seller}</p>
                    <div class="product-price">
                        ${p.price} ${p.oldPrice ? `<span class="old-price">${p.oldPrice}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    });

    grid.innerHTML = productsHtml;
    if (window.lucide) lucide.createIcons();
    if (callback) callback();
}
