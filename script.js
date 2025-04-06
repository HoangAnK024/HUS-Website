const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwR3Bq1wpvMp_xADXMMapNXhuy09QZ7eA4tEZXTgsu4yTBAO13HIFPd3N0zhrNWiAEg/exec'; // <-- thay đúng link mới

fetch(SHEET_URL)
  .then(res => res.json())
  .then(data => {
    const labels = [];
    const phData = [];
    const tdsData = [];
    const turbData = [];

    data.forEach(row => {
      labels.push(row['Timestamp']);
      phData.push(parseFloat(row['pH']));
      tdsData.push(parseFloat(row['TDS']));
      turbData.push(parseFloat(row['Turbidity']));
    });

    renderChart('phChart', 'pH', labels, phData);
    renderChart('tdsChart', 'TDS', labels, tdsData);
    renderChart('turbChart', 'Turbidity', labels, turbData);
  })
  .catch(error => console.error("Lỗi khi fetch dữ liệu:", error));


  function renderChart(id, label, labels, data) {
    new Chart(document.getElementById(id), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          borderColor: 'blue',
          backgroundColor: 'lightblue',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 40 // Cỡ chữ legend
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
                size: 30 // Cỡ chữ tiêu đề trục Y
              }
            },
            ticks: {
              font: {
                size: 20 // Cỡ chữ nhãn trục Y
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Timestamp',
              font: {
                size: 30 // Cỡ chữ tiêu đề trục X
              }
            },
            ticks: {
              font: {
                size: 20 // Cỡ chữ nhãn trục X
              }
            }
          }
        }
      }
    });
  }
  
