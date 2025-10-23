/*
  Dummy data generator for dashboard.
  - Creates sample `dataMahasiswa` and `dataSP` arrays and stores them in localStorage
  - Updates dashboard card DOM values so the page shows realistic demo numbers
  - Provides simple helper functions to add/remove SP and trigger a dashboard refresh
*/

// -- Dummy mahasiswa
const dummyMahasiswa = [
  { id: 1, nim: '18001', nama: 'Ayu Putri', prodi: 'Teknik Informatika' },
  { id: 2, nim: '18002', nama: 'Budi Santoso', prodi: 'Teknik Elektro' },
  { id: 3, nim: '18003', nama: 'Citra Dewi', prodi: 'Manajemen' },
  { id: 4, nim: '18004', nama: 'Dedi Kurnia', prodi: 'Teknik Sipil' },
  { id: 5, nim: '18005', nama: 'Eka Nugraha', prodi: 'Desain Produk' }
];

// -- Dummy surat peringatan (dataSP)
// beberapa tanggal dibuat untuk menghasilkan tren dan data bulan ini
const now = new Date();
const currentMonthISO = (d => new Date(d.getFullYear(), d.getMonth(), 5).toISOString())(now);
const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 10).toISOString();
const older = new Date(now.getFullYear() - 1, 2, 15).toISOString();

const dummySP = [
  { id: 1, mahasiswaId: 1, jenis: 'SP1', status: 'Aktif', tanggal: currentMonthISO },
  { id: 2, mahasiswaId: 2, jenis: 'SP2', status: 'Aktif', tanggal: currentMonthISO },
  { id: 3, mahasiswaId: 3, jenis: 'SP3', status: 'Nonaktif', tanggal: prevMonth },
  { id: 4, mahasiswaId: 4, jenis: 'SP1', status: 'Aktif', tanggal: older },
  { id: 5, mahasiswaId: 5, jenis: 'SP2', status: 'Aktif', tanggal: currentMonthISO },
  { id: 6, mahasiswaId: 2, jenis: 'SP3', status: 'Nonaktif', tanggal: prevMonth }
];

// Persist dummy data (overwrites existing) so chart-dashboard.js can read it
localStorage.setItem('dataMahasiswa', JSON.stringify(dummyMahasiswa));
localStorage.setItem('dataSP', JSON.stringify(dummySP));

// Also set a demo logged-in user for dashboard display
localStorage.setItem('username', 'Demo User');
localStorage.setItem('loggedIn', 'true');

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

// Expose simple API to add/remove SP for interactive demos
function addDummySP(sp) {
  const arr = JSON.parse(localStorage.getItem('dataSP')) || [];
  const nextId = arr.length ? Math.max(...arr.map(s => s.id)) + 1 : 1;
  const entry = Object.assign({ id: nextId, tanggal: new Date().toISOString(), status: 'Aktif' }, sp);
  arr.push(entry);
  localStorage.setItem('dataSP', JSON.stringify(arr));
  // notify other listeners (chart-dashboard listens to 'storage')
  window.dispatchEvent(new Event('storage'));
  refreshCardsFromLocalStorage();
}

function removeDummySP(id) {
  let arr = JSON.parse(localStorage.getItem('dataSP')) || [];
  arr = arr.filter(s => s.id !== id);
  localStorage.setItem('dataSP', JSON.stringify(arr));
  window.dispatchEvent(new Event('storage'));
  refreshCardsFromLocalStorage();
}

// Do initial refresh so the page reflects the dummy values immediately
refreshCardsFromLocalStorage();

// Make helpers accessible from console for quick testing
window.__demo = {
  addDummySP,
  removeDummySP,
  dummyMahasiswa,
  dummySP
};