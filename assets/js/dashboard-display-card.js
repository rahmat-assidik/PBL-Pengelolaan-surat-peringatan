/*
  Dashboard card updater with database integration.
  - Updates dashboard card DOM values from database via API
  - Provides simple helper functions to refresh dashboard data
 */

// Function to refresh dashboard cards from database
async function refreshCardsFromDatabase() {
  try {
    const response = await fetch('../crud/dashboard_stats.php');
    const stats = await response.json();

    const totalMahasiswaEl = document.getElementById('totalMahasiswa');
    const totalSuratAktifEl = document.getElementById('totalSuratPeringatanAktif');
    const jumlahSuratBulanIniEl = document.getElementById('jumlahSuratPeringatanBulanIni');
    const userEl = document.getElementById('userName');

    if (totalMahasiswaEl) totalMahasiswaEl.textContent = stats.totalMahasiswa;
    if (totalSuratAktifEl) totalSuratAktifEl.textContent = stats.totalSPAktif;
    if (jumlahSuratBulanIniEl) jumlahSuratBulanIniEl.textContent = stats.spBulanIni;
    if (userEl) userEl.textContent = localStorage.getItem('username') || 'User';


    // Trigger chart update
    if (window.updateCharts) {
      window.updateCharts(stats);
    }

  } catch (error) {
    console.error('Error refreshing dashboard cards:', error);
    // Fallback to empty values
    const totalMahasiswaEl = document.getElementById('totalMahasiswa');
    const totalSuratAktifEl = document.getElementById('totalSuratPeringatanAktif');
    const jumlahSuratBulanIniEl = document.getElementById('jumlahSuratPeringatanBulanIni');

    if (totalMahasiswaEl) totalMahasiswaEl.textContent = '0';
    if (totalSuratAktifEl) totalSuratAktifEl.textContent = '0';
    if (jumlahSuratBulanIniEl) jumlahSuratBulanIniEl.textContent = '0';
  }
}

// Do initial refresh so the page reflects the database values immediately
refreshCardsFromDatabase();
