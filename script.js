let chart;  

async function convert() {
    const amount = document.getElementById('amount').value;
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const period = document.getElementById('period').value;

    // Check for the same coins
    if (from === to) {
        document.getElementById('result').innerText = 'You cannot convert the same coin';
        return; // Stop function execution
    }

    try {
        const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`);
        const data = await response.json();
        const rate = data[to];
        const result = amount * rate;
        document.getElementById('result').innerText = `Result: ${result.toFixed(6)} ${to}`;

        await updateChart(from, to, period);
    } catch (error) {
        document.getElementById('result').innerText = 'Conversion error';
        console.error('Error:', error);
    }
}

async function updateChart(from, to, period) {
    try {
        let limit;
        switch (period) {
            case '24h':
                limit = 24;
                break;
            case '3d':
                limit = 72;
                break;
            case '7d':
                limit = 168;
                break;
            default:
                limit = 24;
        }

        const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histohour?fsym=${from}&tsym=${to}&limit=${limit}`);
        const data = await response.json();
        console.log('Data from API:', data); // Logging the data

        const prices = data.Data.Data.map(item => item.close);
        const labels = data.Data.Data.map(item => new Date(item.time * 1000).toLocaleTimeString());

        console.log('Labels:', labels); // Logging the labels
        console.log('Prices:', prices); // Logging the prices

        const ctx = document.getElementById('priceChart').getContext('2d');

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Price chart ${from}/${to} for ${period}`,
                    data: prices,
                    borderColor: '#3a86ff',
                    backgroundColor: 'rgba(58, 134, 255, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time',
                            color: '#fff',
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Price',
                            color: '#fff',
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading the chart:', error);
    }
}
