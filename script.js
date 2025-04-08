const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwR3Bq1wpvMp_xADXMMapNXhuy09QZ7eA4tEZXTgsu4yTBAO13HIFPd3N0zhrNWiAEg/exec';

fetch(SHEET_URL)
  .then(res => {
    if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
    return res.json();
  })
  .then(data => {
    const labels = [];
    const phData = [];
    const tdsData = [];
    const turbData = [];

    data.forEach(row => {
      const time = formatTimestamp(row['Timestamp']);
      labels.push(time);
      phData.push(parseFloat(row['pH']) || 0);
      tdsData.push(parseFloat(row['TDS']) || 0);
      turbData.push(parseFloat(row['Turbidity']) || 0);
    });

    renderChart('phChart', 'pH', labels, phData, 'blue', 'lightblue');
    renderChart('tdsChart', 'TDS', labels, tdsData, 'green', 'lightgreen');
    renderChart('turbChart', 'Turbidity', labels, turbData, 'orange', 'peachpuff');
  })
  .catch(error => console.error("Lỗi khi fetch dữ liệu:", error));

function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB'); // Hiển thị hh:mm:ss
  } catch (e) {
    return timestamp;
  }
}

function renderChart(id, label, labels, data, borderColor, backgroundColor) {
  const ctx = document.getElementById(id);
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        tension: 0.3,
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Cho canvas co dãn tốt
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              size: 14 // nhỏ lại cho phù hợp mobile
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: label,
            font: {
              size: 16
            }
          },
          ticks: {
            stepSize: 0.2, // Hiển thị nhiều giá trị hơn
            autoSkip: true,
            font: {
              size: 12
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Timestamp',
            font: {
              size: 16
            }
          },
          ticks: {
            font: {
              size: 12
            },
            maxRotation: 45,
            minRotation: 30
          }
        }
      }
    }
  });
}
