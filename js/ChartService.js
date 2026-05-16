export function initAdminCharts(salesData, regionData) {
    // Line Chart: Sales Performance
    const salesCtx = document.getElementById('chart-container-sales');
    if (salesCtx) {
        salesCtx.innerHTML = '<canvas id="mainChart"></canvas>';
        const ctx = document.getElementById('mainChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
                datasets: [{
                    label: 'Ventas (NIO)',
                    data: salesData || [12000, 19000, 3000, 5000, 20000, 35000],
                    borderColor: '#D4145A',
                    backgroundColor: 'rgba(212, 20, 90, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
            }
        });
    }

    // Pie Chart: Regional Breakdown
    const regionCtx = document.getElementById('chart-container-region');
    if (regionCtx) {
        regionCtx.innerHTML = `
            <div style="width: 140px; height: 140px;">
                <canvas id="regionChart"></canvas>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;"><span style="width: 8px; height: 8px; background: #D4145A; border-radius: 2px;"></span> Bluefields</span>
                    <span style="font-size: 0.75rem; font-weight: 700;">${regionData ? regionData[0] : 65}%</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;"><span style="width: 8px; height: 8px; background: #0F172A; border-radius: 2px;"></span> Bilwi</span>
                    <span style="font-size: 0.75rem; font-weight: 700;">${regionData ? regionData[1] : 35}%</span>
                </div>
            </div>
        `;
        const ctx = document.getElementById('regionChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Bluefields', 'Bilwi'],
                datasets: [{
                    data: regionData || [65, 35],
                    backgroundColor: ['#D4145A', '#0F172A'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                cutout: '70%'
            }
        });
    }
}
