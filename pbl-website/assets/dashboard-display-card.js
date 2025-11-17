/*
  Dashboard card updater.
  - Updates dashboard card DOM values from localStorage data
  - Provides simple helper functions to add/remove SP and trigger a dashboard refresh
 */

// Clear all dummy data completely
localStorage.removeItem('dataMahasiswa');
localStorage.removeItem('dataSP');
localStorage.removeItem('spData');
localStorage.setItem('dataMahasiswa', JSON.stringify([]));
localStorage.setItem('dataSP', JSON.stringify([]));
localStorage.setItem('spData', JSON.stringify([]));

// Helper to compute and update the DOM cards directly (chart script runs earlier
// and listens to storage events; we'll trigger a storage event after updating)
function refreshCardsFromLocalStorage() {
  const mahasiswa = JSON.parse(localStorage.getItem('dataMahasiswa')) || [];
  const suratPeringatan = JSON.parse(localStorage.getItem('dataSP')) || [];

  const totalMahasiswa = mahasiswa.length;
  const totalSuratAktif = suratPeringatan.filter(s => s.status === 'Aktif').length;

  const currentMonth = new Date().getMonth();
  const suratBulanIni = suratPeringatan.filter(sp => {
    const t = new Date(sp.tanggal);
    return t.getMonth() === currentMonth && t.getFullYear() === new Date().getFullYear();
  }).length;

  const totalMahasiswaEl = document.getElementById('totalMahasiswa');
  const totalSuratAktifEl = document.getElementById('totalSuratPeringatanAktif');
  const jumlahSuratBulanIniEl = document.getElementById('jumlahSuratPeringatanBulanIni');
  const userEl = document.getElementById('userName');

  if (totalMahasiswaEl) totalMahasiswaEl.textContent = totalMahasiswa;
  if (totalSuratAktifEl) totalSuratAktifEl.textContent = totalSuratAktif;
  if (jumlahSuratBulanIniEl) jumlahSuratBulanIniEl.textContent = suratBulanIni;
  if (userEl) userEl.textContent = localStorage.getItem('username') || 'User';

  // Update any change-span text (there are a couple duplicated ids in markup)
  const suratChangeNodes = document.querySelectorAll('#suratPeringatanChange');
  suratChangeNodes.forEach(n => n.textContent = `+${suratBulanIni} bulan ini`);
  const mahasiswaChangeNodes = document.querySelectorAll('#mahasiswaChange');
  mahasiswaChangeNodes.forEach(n => n.textContent = `+${Math.max(0, totalMahasiswa - 0)} bulan ini`);
}

// Do initial refresh so the page reflects the empty values immediately
refreshCardsFromLocalStorage();
