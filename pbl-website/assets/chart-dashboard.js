document.addEventListener('DOMContentLoaded', function () {
  const dataSP = JSON.parse(localStorage.getItem('dataSP')) || [];
  const dataMahasiswa = JSON.parse(localStorage.getItem('dataMahasiswa')) || [];

  // Elemen dashboard
  const totalMahasiswaEl = document.getElementById('totalMahasiswa');
  const totalSPAktifEl = document.getElementById('totalSuratPeringatanAktif');
  const jumlahSPBulanIniEl = document.getElementById('jumlahSuratPeringatanBulanIni');

  // === DATA CARD ===
  const totalMahasiswa = dataMahasiswa.length;
  const totalAktif = dataSP.filter(sp => sp.status === "Aktif").length;
  const bulanSekarang = new Date().toLocaleString('id-ID', { month: 'long' }).toLowerCase();
  const spBulanIni = dataSP.filter(sp => (sp.bulan || '').toLowerCase() === bulanSekarang).length;

  totalMahasiswaEl.textContent = totalMahasiswa;
  totalSPAktifEl.textContent = totalAktif;
  jumlahSPBulanIniEl.textContent = spBulanIni;

  // === DISTRIBUSI PER BULAN ===
  const ctxDistribusi = document.getElementById('suratPeringatanChart');
  const bulanList = [
    'januari', 'februari', 'maret', 'april', 'mei', 'juni',
    'juli', 'agustus', 'september', 'oktober', 'november', 'desember'
  ];

  const jumlahPerBulan = bulanList.map(bulan =>
    dataSP.filter(sp => (sp.bulan || '').toLowerCase() === bulan).length
  );

  const totalSP = jumlahPerBulan.reduce((a, b) => a + b, 0);

  // Jika tidak ada data, tampilkan pesan teks
  if (totalSP === 0) {
    ctxDistribusi.parentElement.innerHTML = `
      <div style="text-align:center; padding:2rem; color:#777;">
        <strong>Tidak ada data surat peringatan untuk ditampilkan.</strong>
      </div>
    `;
  } else {
    new Chart(ctxDistribusi, {
      type: 'pie',
      data: {
        labels: bulanList.map(b => b.charAt(0).toUpperCase() + b.slice(1)),
        datasets: [{
          data: jumlahPerBulan,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 105, 180, 0.6)',
            'rgba(0, 206, 209, 0.6)',
            'rgba(124, 252, 0, 0.6)',
            'rgba(255, 140, 0, 0.6)',
            'rgba(0, 191, 255, 0.6)',
            'rgba(238, 130, 238, 0.6)'
          ],
          borderWidth: 1,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Distribusi Surat Peringatan per Bulan',
            font: { size: 14 }
          },
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12 }
          }
        }
      }
    });
  }

  // === TREN PER SEMESTER ===
  const ctxSemester = document.getElementById('trenSuratSemester');

  function getSemesterFromBulan(bulan) {
    const b = (bulan || '').toLowerCase();
    const genap = ['januari', 'februari', 'maret', 'april', 'mei', 'juni'];
    const ganjil = ['juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
    if (genap.includes(b)) return 'Genap';
    if (ganjil.includes(b)) return 'Ganjil';
    return 'Tidak Diketahui';
  }

  let jumlahSPGanjil = 0;
  let jumlahSPGenap = 0;

  dataSP.forEach(sp => {
    const semester = getSemesterFromBulan(sp.bulan);
    if (semester === 'Ganjil') jumlahSPGanjil++;
    else if (semester === 'Genap') jumlahSPGenap++;
  });

  if (jumlahSPGanjil === 0 && jumlahSPGenap === 0) {
    ctxSemester.parentElement.innerHTML = `
      <div style="text-align:center; padding:1.5rem; color:#777;">
        <strong>Belum ada data tren surat peringatan.</strong>
      </div>
    `;
  } else {
    new Chart(ctxSemester, {
      type: 'line',
      data: {
        labels: ['Ganjil', 'Genap'],
        datasets: [{
          label: 'Tren Surat Peringatan per Semester',
          data: [jumlahSPGanjil, jumlahSPGenap],
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.15)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Tren Surat Peringatan per Semester',
            font: { size: 14 }
          },
          legend: { display: false }
        }
      }
    });
  }
});
