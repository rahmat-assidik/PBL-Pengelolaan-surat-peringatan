// chart-dashboard.js with database integration
document.addEventListener("DOMContentLoaded", () => {
  const ctxDistribusi = document.getElementById("suratPeringatanChart");
  const ctxTren = document.getElementById("trenSuratSemester");

  let chartDistribusi = null;
  let chartTren = null;

  // Function to update charts with database data
  window.updateCharts = function(stats) {
    // Hapus chart sebelumnya
    if (chartDistribusi) chartDistribusi.destroy();
    if (chartTren) chartTren.destroy();

    // Bersihkan tampilan chart jika belum ada data
    const chartContainers = [ctxDistribusi.parentElement, ctxTren.parentElement];
    chartContainers.forEach(container => {
      const existingMsg = container.querySelector(".no-data-msg");
      if (existingMsg) existingMsg.remove();
    });

    // 4️⃣ Chart Distribusi SP (Pie)
    const distribusiData = {
      labels: ["SP1", "SP2", "SP3"],
      datasets: [{
        data: [
          stats.distribusiSP.SP1 || 0,
          stats.distribusiSP.SP2 || 0,
          stats.distribusiSP.SP3 || 0
        ],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
        borderColor: "#fff",
        borderWidth: 2,
      }]
    };

    chartDistribusi = new Chart(ctxDistribusi, {
      type: "pie",
      data: distribusiData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 10 },
        plugins: {
          title: {
            display: true,
            text: "Distribusi Jenis Surat Peringatan",
            font: { size: 14 },
          },
          legend: {
            position: "bottom",
            labels: { boxWidth: 12 },
          },
        },
      },
    });

    // 5️⃣ Chart Tren SP per Semester (Line)
    const trenLabels = stats.trenSP.map(item => item.period);
    const trenValues = stats.trenSP.map(item => item.count);

    const trenChartData = {
      labels: trenLabels,
      datasets: [{
        label: "Jumlah Surat per Semester",
        data: trenValues,
        borderColor: "#4BC0C0",
        backgroundColor: "rgba(75, 192, 192, 0.15)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#4BC0C0",
        borderWidth: 2,
      }]
    };

    chartTren = new Chart(ctxTren, {
      type: "line",
      data: trenChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 10 },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Tren Surat Peringatan per Semester",
            font: { size: 14 },
          },
          legend: { display: false },
        },
      },
    });
  };

  // Function to show "no data" message
  function showNoDataMessage(container, message) {
    const msg = document.createElement("div");
    msg.classList.add("no-data-msg");
    msg.textContent = message;
    container.appendChild(msg);
  }

  // Initial load - charts will be updated when dashboard-display-card.js calls updateCharts
});
