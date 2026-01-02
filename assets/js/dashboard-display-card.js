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
    const jumlahSuratBulanIniEl = document.getElementById('jumlahSuratPeringatanBulanIni');
    const totalSPEl = document.getElementById('totalSP');
    const totalSP3El = document.getElementById('totalSP3');
    const userEl = document.getElementById('userName');

    if (totalMahasiswaEl) totalMahasiswaEl.textContent = stats.totalMahasiswa;
    if (jumlahSuratBulanIniEl) jumlahSuratBulanIniEl.textContent = stats.spBulanIni;
    if (totalSPEl) totalSPEl.textContent = stats.totalSP;
    if (totalSP3El) totalSP3El.textContent = stats.totalSP3;
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

window.refreshCardsFromDatabase = refreshCardsFromDatabase;

// Check if dashboard needs refresh from other pages
const needsRefresh = localStorage.getItem('dashboardNeedsRefresh');
if (needsRefresh) {
  localStorage.removeItem('dashboardNeedsRefresh');
  refreshCardsFromDatabase();
} else {
  refreshCardsFromDatabase();
}
