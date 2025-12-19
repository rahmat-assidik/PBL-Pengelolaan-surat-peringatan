// chart-dashboard.js with database integration
document.addEventListener("DOMContentLoaded", () => {
   ctxDistribusi = document.getElementById("suratPeringatanChart");
   ctxTren = document.getElementById("trenSuratSemester");

  let chartDistribusi = null;
  let chartTren = null;


  window.updateCharts = function(stats) {
  
    if (chartDistribusi) chartDistribusi.destroy();
    if (chartTren) chartTren.destroy();

    // Chart Distribusi
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
        layout: { padding: 0 },
        plugins: {
          title: {
            display: true,
            text: "Distribusi Jenis Surat Peringatan",
            font: { size: 14, weight: 'normal' },
          },
          legend: {
            position: "bottom",
            labels: { boxWidth: 12, font: { size: 12 } },
          },
        },
      },
    });

    // Chart tren SP per semester
    const trenLabels = stats.trenSP.map(item => item.period);
    const trenValues = stats.trenSP.map(item => item.count);

    const trenChartData = {
      labels: trenLabels,
        datasets: [{
          label: "Jumlah Surat per Semester",
          data: trenValues,
          borderColor: "#4BC0C0",
          backgroundColor: "rgba(75, 192, 192, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: "#4BC0C0",
          borderWidth: 1,
        }]
    };

    chartTren = new Chart(ctxTren, {
      type: "line",
      data: trenChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 0 },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, font: { size: 12 } },
          },
          x: {
            ticks: { font: { size: 12 } },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Tren Surat Peringatan per Semester",
            font: { size: 14, weight: 'normal' },
          },
          legend: { display: false },
        },
      },
    });
  };
});