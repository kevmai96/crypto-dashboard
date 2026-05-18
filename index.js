const coinSelect1 = document.getElementById('coin-select-1');
const coinSelect2 = document.getElementById('coin-select-2');
const ctx = document.getElementById('price-chart').getContext('2d');
let priceChart;

const chartConfig = {
    type: 'line',
    data: {
        datasets: [
            {
                label: 'Coin 1',
                borderColor: '#4a90e2',
                backgroundColor: 'rgba(74, 144, 226, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            },
            {
                label: 'Coin 2',
                borderColor: '#FF8E0D',
                backgroundColor: 'rgba(255, 142, 13, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: 'var(--text-primary)'
                }
            }
        }
    }
};

async function fetchCoinData(coinId) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.prices.map(item => ({
            x: item[0],
            y: item[1]
        }));
    } catch (error) {
        console.error(`Failed to fetch data for ${coinId}:`, error);
        return []; // Return empty array on error
    }
}

function updateChart(data1, data2, coinId1, coinId2) {
    if (priceChart) {
        priceChart.destroy();
    }
    chartConfig.data.datasets[0].data = data1;
    chartConfig.data.datasets[0].label = `${coinId1.charAt(0).toUpperCase() + coinId1.slice(1)} (USD)`;
    chartConfig.data.datasets[1].data = data2;
    chartConfig.data.datasets[1].label = `${coinId2.charAt(0).toUpperCase() + coinId2.slice(1)} (USD)`;
    priceChart = new Chart(ctx, chartConfig);
}

async function updateDashboard() {
    const coinId1 = coinSelect1.value;
    const coinId2 = coinSelect2.value;

    const [data1, data2] = await Promise.all([
        fetchCoinData(coinId1),
        fetchCoinData(coinId2)
    ]);

    updateChart(data1, data2, coinId1, coinId2);
}

coinSelect1.addEventListener('change', updateDashboard);
coinSelect2.addEventListener('change', updateDashboard);

// Initial load
updateDashboard();
