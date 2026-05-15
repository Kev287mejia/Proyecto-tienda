const sections = document.querySelectorAll('.admin-section');
const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');

function switchSection(sectionId) {
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
    
    // Update nav active state
    navItems.forEach(nav => {
        if (nav.getAttribute('data-section') === sectionId) {
            nav.classList.add('active');
        } else {
            nav.classList.remove('active');
        }
    });
}

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const sectionId = item.getAttribute('data-section');
        if (!sectionId) return;
        e.preventDefault();
        switchSection(sectionId);
    });
});

// EXPORT REPORT LOGIC
function openExportModal() {
    document.getElementById('export-modal').style.display = 'flex';
}

function closeExportModal() {
    document.getElementById('export-modal').style.display = 'none';
}

function generateReport(range) {
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = 'Preparando Documento...';
    btn.style.opacity = '0.7';

    setTimeout(() => {
        closeExportModal();
        
        // Populate the hidden report area
        const now = new Date();
        document.getElementById('report-date-print').innerText = `Rango: ${range} | Generado: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        
        // Simulated dynamic sales data
        const salesData = [
            { date: '12/05/2026', id: '#8492', customer: 'Juan Pérez', amount: 1850 },
            { date: '12/05/2026', id: '#8491', customer: 'María López', amount: 4200 },
            { date: '11/05/2026', id: '#8490', customer: 'Carlos Ruiz', amount: 2400 }
        ];

        let tableRows = '';
        let subtotal = 0;
        
        salesData.forEach(sale => {
            subtotal += sale.amount;
            tableRows += `
                <tr style="border-bottom: 1px solid #F1F5F9;">
                    <td style="padding: 12px; font-size: 13px;">${sale.date}</td>
                    <td style="padding: 12px; font-size: 13px;">${sale.id}</td>
                    <td style="padding: 12px; font-size: 13px;">${sale.customer}</td>
                    <td style="padding: 12px; font-size: 13px; text-align: right;">NIO ${sale.amount.toLocaleString()}</td>
                </tr>
            `;
        });

        document.getElementById('report-table-body').innerHTML = tableRows;
        document.getElementById('report-subtotal').innerText = `NIO ${subtotal.toLocaleString()}`;
        
        const commission = subtotal * 0.05;
        document.getElementById('report-commission').innerText = `NIO ${commission.toLocaleString()}`;
        document.getElementById('report-total-net').innerText = `NIO ${(subtotal - commission).toLocaleString()}`;

        // Print Logic
        const printContent = document.getElementById('printable-report').innerHTML;
        const originalContent = document.body.innerHTML;
        
        // Abrir ventana de impresión limpia
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head><title>Reporte de Ventas - EternalLabs</title></head>
                <body onload="window.print();window.close()">${printContent}</body>
            </html>
        `);
        printWindow.document.close();

        btn.innerText = originalText;
        btn.style.opacity = '1';
    }, 1500);
}

function showProductForm() {
    switchSection('product-form');
}

function handleProductSubmit() {
    const btn = event.target;
    btn.innerHTML = 'Publicando...';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        alert('¡Producto publicado con éxito!');
        switchSection('products');
        btn.innerHTML = 'Publicar Producto';
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    }, 1500);
}

// Sales Chart Initialization
const ctx = document.getElementById('salesChart')?.getContext('2d');
if (ctx) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
            datasets: [{
                label: 'Ventas (NIO)',
                data: [4200, 3100, 5900, 4200, 8450, 7100, 9500],
                borderColor: '#D4145A',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(212, 20, 90, 0.05)',
                pointRadius: 4,
                pointBackgroundColor: '#fff',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: '#F1F5F9' } },
                x: { grid: { display: false } }
            }
        }
    });
}

// Growth Chart Initialization
const growthCtx = document.getElementById('growthChart')?.getContext('2d');
if (growthCtx) {
    new Chart(growthCtx, {
        type: 'bar',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
            datasets: [{
                label: 'Crecimiento (%)',
                data: [5, 12, 18, 25, 32],
                backgroundColor: '#FF7E5F',
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}
