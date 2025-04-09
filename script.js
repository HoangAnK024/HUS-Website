const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbwR3Bq1wpvMp_xADXMMapNXhuy09QZ7eA4tEZXTgsu4yTBAO13HIFPd3N0zhrNWiAEg/exec";

// Khai báo biến lưu trữ biểu đồ toàn cục
let phChart = null;
let tdsChart = null;
let turbChart = null;

function loadAndRenderChart() {
  fetch(SHEET_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const slicedData = data.slice(-20);

      const labels = [];
      const phData = [];
      const tdsData = [];
      const turbData = [];

      slicedData.forEach((row) => {
        const time = formatTimestamp(row["Timestamp"]);
        labels.push(time);
        phData.push(parseFloat(row["pH"]) || 0);
        tdsData.push(parseFloat(row["TDS"]) || 0);
        turbData.push(parseFloat(row["Turbidity"]) || 0);
      });

      updateChart("phChart", "pH", labels, phData, "blue", "lightblue", (chart) => phChart = chart);
      updateChart("tdsChart", "TDS", labels, tdsData, "green", "lightgreen", (chart) => tdsChart = chart);
      updateChart("turbChart", "Turbidity", labels, turbData, "orange", "peachpuff", (chart) => turbChart = chart);
    })
    .catch((error) => console.error("Lỗi khi fetch dữ liệu:", error));
}

// Gọi lần đầu
loadAndRenderChart();
// Cập nhật mỗi 10 giây
setInterval(loadAndRenderChart, 10000);

// Chuyển timestamp sang giờ:phút:giây
function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-GB");
  } catch (e) {
    return timestamp;
  }
}

// Hàm cập nhật hoặc tạo mới biểu đồ
function updateChart(id, label, labels, data, borderColor, backgroundColor, setChartRef) {
  const ctx = document.getElementById(id);
  if (!ctx) return;

  let chart = Chart.getChart(id);

  if (chart) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
  } else {
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            tension: 0.3,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 14,
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: label,
              font: {
                size: 16,
              },
            },
            ticks: {
              stepSize: 0.2,
              autoSkip: true,
              font: {
                size: 12,
              },
            },
          },
          x: {
            title: {
              display: true,
              text: "Timestamp",
              font: {
                size: 16,
              },
            },
            ticks: {
              font: {
                size: 12,
              },
              maxRotation: 45,
              minRotation: 30,
            },
          },
        },
      },
    });

    setChartRef(chart); // lưu lại tham chiếu biểu đồ
  }
}
