// chart-dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  const totalMahasiswaEl = document.getElementById("totalMahasiswa");
  const totalSuratAktifEl = document.getElementById("totalSuratPeringatanAktif");
  const jumlahSuratBulanIniEl = document.getElementById("jumlahSuratPeringatanBulanIni");

  const ctxDistribusi = document.getElementById("suratPeringatanChart");
  const ctxTren = document.getElementById("trenSuratSemester");

  let chartDistribusi = null;
  let chartTren = null;

  // 🔁 Fungsi utama untuk update dashboard
  function updateDashboard() {
    const mahasiswa = JSON.parse(localStorage.getItem("dataMahasiswa")) || [];
    const suratPeringatan = JSON.parse(localStorage.getItem("dataSP")) || [];

    // Clear any existing dummy data on load
    if (mahasiswa.length > 0 && mahasiswa.some(m => m.id)) {
      localStorage.setItem("dataMahasiswa", JSON.stringify([]));
    }
    if (suratPeringatan.length > 0 && suratPeringatan.some(sp => sp.id)) {
      localStorage.setItem("dataSP", JSON.stringify([]));
    }

    // 1️⃣ Hitung total
    const totalMahasiswa = mahasiswa.length;
    const totalSuratAktif = suratPeringatan.filter(sp => sp.status === "Aktif").length;

    // 2️⃣ Hitung surat peringatan bulan ini
    const currentMonth = new Date().getMonth();
    const suratBulanIni = suratPeringatan.filter(sp => {
      const tgl = new Date(sp.tanggal);
      return tgl.getMonth() === currentMonth;
    }).length;

    // 3️⃣ Update Card di Dashboard
    totalMahasiswaEl.textContent = totalMahasiswa;
    totalSuratAktifEl.textContent = totalSuratAktif;
    jumlahSuratBulanIniEl.textContent = suratBulanIni;

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
    const spCount = { SP1: 0, SP2: 0, SP3: 0 };
    suratPeringatan.forEach(sp => {
      if (sp.jenis === "SP1") spCount.SP1++;
      else if (sp.jenis === "SP2") spCount.SP2++;
      else if (sp.jenis === "SP3") spCount.SP3++;
    });

    const distribusiData = {
      labels: ["SP1", "SP2", "SP3"],
      datasets: [{
        data: [spCount.SP1, spCount.SP2, spCount.SP3],
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
    // Hitung jumlah per semester, lalu pastikan semua semester antara min->max ada (isi 0 jika kosong)
    const trenDataRaw = {};
    suratPeringatan.forEach(sp => {
      const tgl = new Date(sp.tanggal);
      const semester = `Semester ${tgl.getFullYear()}-${tgl.getMonth() < 6 ? "1" : "2"}`;
      trenDataRaw[semester] = (trenDataRaw[semester] || 0) + 1;
    });

    // Jika tidak ada data, buat label kosong agar chart tidak crash
    let trenLabels = [];
    let trenValues = [];

    if (suratPeringatan.length === 0) {
      trenLabels = [];
      trenValues = [];
    } else {
      // Tentukan rentang semester berdasarkan tanggal terawal dan terakhir
      const dates = suratPeringatan.map(sp => new Date(sp.tanggal).getTime());
      const minT = Math.min(...dates);
      const maxT = Math.max(...dates);
      const minD = new Date(minT);
      const maxD = new Date(maxT);

      const semIndex = d => (d.getFullYear() * 2) + (d.getMonth() < 6 ? 0 : 1);
      const indexToKey = idx => {
        const year = Math.floor(idx / 2);
        const sem = (idx % 2 === 0) ? 1 : 2;
        return { key: `Semester ${year}-${sem}`, year, sem };
      };

      let startIdx = semIndex(minD);
      let endIdx = semIndex(maxD);

      // ensure at least a couple semesters for better visualization
      if (startIdx === endIdx) {
        startIdx = Math.max(0, startIdx - 1);
        endIdx = endIdx + 1;
      }

      for (let idx = startIdx; idx <= endIdx; idx++) {
        const { key, year, sem } = indexToKey(idx);
        // nicer label e.g. "2024 S1 (Jan–Jun)"
        const niceLabel = `${year} S${sem} (${sem === 1 ? 'Jan–Jun' : 'Jul–Dec'})`;
        trenLabels.push(niceLabel);
        trenValues.push(trenDataRaw[key] || 0);
      }
    }

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
  }

  // Fungsi untuk menampilkan teks "Tidak ada data"
  function showNoDataMessage(container, message) {
    const msg = document.createElement("div");
    msg.classList.add("no-data-msg");
    msg.textContent = message;
    container.appendChild(msg);
  }

  // Jalankan saat pertama kali
  updateDashboard();

  // 🔥 Update otomatis saat localStorage berubah (sinkron tab)
  window.addEventListener("storage", updateDashboard);
});
