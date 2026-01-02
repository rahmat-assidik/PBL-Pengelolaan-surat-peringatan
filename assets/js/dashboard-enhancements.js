/*
  Dashboard Enhancements - Additional dashboard functionality
  - Recent activities display
  - Current time display
  - Quick actions
 */

// Function to load recent activities
async function loadRecentActivities() {
  try {
    const response = await fetch('../crud/dashboard_stats.php');
    const stats = await response.json();

    const activitiesContainer = document.getElementById('recentActivities');
    if (!activitiesContainer) return;

    // Create recent activities based on available data
    const activities = [];

    // Add activity for total mahasiswa
    if (stats.totalMahasiswa > 0) {
      activities.push({
        icon: 'fas fa-users text-primary',
        text: `Total ${stats.totalMahasiswa} mahasiswa terdaftar`,
        time: 'Sekarang'
      });
    }

    // Add activity for SP bulan ini
    if (stats.spBulanIni > 0) {
      activities.push({
        icon: 'fas fa-calendar-alt text-warning',
        text: `${stats.spBulanIni} surat peringatan dibuat bulan ini`,
        time: 'Bulan ini'
      });
    }

    // Add activity for total SP
    if (stats.totalSP > 0) {
      activities.push({
        icon: 'fas fa-file-circle-exclamation text-success',
        text: `Total ${stats.totalSP} surat peringatan`,
        time: 'Total'
      });
    }

    // Add activity for SP3
    if (stats.totalSP3 > 0) {
      activities.push({
        icon: 'fas fa-exclamation-triangle text-danger',
        text: `${stats.totalSP3} mahasiswa mendapat SP3`,
        time: 'Tingkat tertinggi'
      });
    }

    // If no activities, show default message
    if (activities.length === 0) {
      activitiesContainer.innerHTML = `
        <div class="list-group-item">
          <i class="fas fa-info-circle text-muted me-2"></i>
          Belum ada aktivitas
        </div>
      `;
      return;
    }

    // Render activities
    activitiesContainer.innerHTML = activities.map(activity => `
      <div class="list-group-item">
        <i class="${activity.icon} me-2"></i>
        <span>${activity.text}</span>
        <small class="text-muted float-end">${activity.time}</small>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error loading recent activities:', error);
    const activitiesContainer = document.getElementById('recentActivities');
    if (activitiesContainer) {
      activitiesContainer.innerHTML = `
        <div class="list-group-item text-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>
          Gagal memuat aktivitas
        </div>
      `;
    }
  }
}

// Function to update current time
function updateCurrentTime() {
  const timeElement = document.getElementById('currentTime');
  if (!timeElement) return;

  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  timeElement.innerHTML = `
    <i class="fas fa-calendar-day me-2"></i>
    ${now.toLocaleDateString('id-ID', options)}
  `;
}

// Print functions
function printDashboard() {
  // Hide modal before printing
  const modal = bootstrap.Modal.getInstance(document.getElementById('printModal'));
  modal.hide();

  // Wait for modal to hide, then print
  setTimeout(() => {
    window.print();
  }, 300);
}

function printStats() {
  // Create a new window with just the statistics
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
    <head>
      <title>Statistik Dashboard</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
        .stat-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #007bff; }
        .stat-label { color: #666; margin-top: 10px; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <h1>Statistik Dashboard Sistem Pengelolaan Surat Peringatan</h1>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number" id="print-totalMahasiswa"></div>
          <div class="stat-label">Total Mahasiswa</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="print-spBulanIni"></div>
          <div class="stat-label">SP Bulan Ini</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="print-totalSP"></div>
          <div class="stat-label">Total SP</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="print-totalSP3"></div>
          <div class="stat-label">SP3 Terakhir</div>
        </div>
      </div>
      <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
    </body>
    </html>
  `);

  // Get current stats and populate
  fetch('../crud/dashboard_stats.php')
    .then(response => response.json())
    .then(stats => {
      printWindow.document.getElementById('print-totalMahasiswa').textContent = stats.totalMahasiswa || 0;
      printWindow.document.getElementById('print-spBulanIni').textContent = stats.spBulanIni || 0;
      printWindow.document.getElementById('print-totalSP').textContent = stats.totalSP || 0;
      printWindow.document.getElementById('print-totalSP3').textContent = stats.totalSP3 || 0;

      // Print after content is loaded
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    })
    .catch(error => {
      console.error('Error loading stats for print:', error);
      printWindow.close();
    });

  // Hide modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('printModal'));
  modal.hide();
}

async function printCharts() {
  // Hide modal first
  const modal = bootstrap.Modal.getInstance(document.getElementById('printModal'));
  if (modal) modal.hide();

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  // Get the original charts from the dashboard
  const originalDistribusi = document.getElementById('suratPeringatanChart');
  const originalTren = document.getElementById('trenSuratSemester');
  
  // Convert charts to images if they exist
  const distribusiImage = originalDistribusi ? originalDistribusi.toDataURL('image/png') : null;
  const trenImage = originalTren ? originalTren.toDataURL('image/png') : null;
  
  // Get stats for display
  let statsText = '';
  try {
    const response = await fetch('../crud/dashboard_stats.php');
    const stats = await response.json();
    statsText = `
      <div class="stats-summary">
        <h4>Statistik Ringkas</h4>
        <table class="table table-bordered">
          <tr><td>Total Mahasiswa</td><td><strong>${stats.totalMahasiswa || 0}</strong></td></tr>
          <tr><td>SP Bulan Ini</td><td><strong>${stats.spBulanIni || 0}</strong></td></tr>
          <tr><td>Total SP</td><td><strong>${stats.totalSP || 0}</strong></td></tr>
          <tr><td>SP3 Terakhir</td><td><strong>${stats.totalSP3 || 0}</strong></td></tr>
        </table>
      </div>
    `;
  } catch (e) {
    statsText = '';
  }
  
  // Build the print page with images
  let chartHtml = '';
  
  if (distribusiImage) {
    chartHtml += `
      <div class="chart-section">
        <h3>Grafik Distribusi Surat Peringatan</h3>
        <img src="${distribusiImage}" alt="Grafik Distribusi" style="max-width: 100%; height: auto; border: 1px solid #ddd; padding: 10px;">
      </div>
    `;
  }
  
  if (trenImage) {
    chartHtml += `
      <div class="chart-section">
        <h3>Tren Surat Peringatan per Semester</h3>
        <img src="${trenImage}" alt="Grafik Tren" style="max-width: 100%; height: auto; border: 1px solid #ddd; padding: 10px;">
      </div>
    `;
  }
  
  if (!distribusiImage && !trenImage) {
    chartHtml = '<div class="alert alert-warning">Grafik tidak tersedia. Silakan refresh halaman dashboard terlebih dahulu.</div>';
  }
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cetak Grafik - Sistem Pengelolaan Surat Peringatan</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
          .chart-section { page-break-inside: avoid; margin-bottom: 30px; }
        }
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .print-container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; }
        .chart-section { margin-bottom: 40px; text-align: center; }
        .chart-section h3 { color: #333; margin-bottom: 15px; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .chart-section img { max-width: 100%; height: auto; }
        .stats-summary { margin-top: 30px; }
        .stats-summary h4 { color: #333; margin-bottom: 15px; }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #007bff; }
        .header h1 { color: #007bff; margin: 0; }
        .header p { color: #666; margin-top: 10px; }
        .print-button { position: fixed; top: 20px; right: 20px; }
      </style>
    </head>
    <body>
      <div class="print-container">
        <div class="header">
          <h1><i class="fas fa-chart-bar"></i> Grafik Dashboard</h1>
          <p>Sistem Pengelolaan Surat Peringatan Mahasiswa</p>
        </div>
        
        ${chartHtml}
        
        ${statsText}
        
        <div class="text-muted text-center mt-4 pt-3 border-top">
          <small>Dicetak pada: ${new Date().toLocaleString('id-ID')}</small>
        </div>
      </div>
      
      <div class="print-button no-print" style="position: fixed; top: 20px; right: 20px;">
        <button onclick="window.print()" class="btn btn-primary btn-lg">
          <i class="fas fa-print"></i> Cetak Sekarang
        </button>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  
  // Auto print after page loads
  printWindow.onload = function() {
    setTimeout(() => {
      // Don't auto print, let user choose
    }, 500);
  };
}

// Initialize dashboard enhancements
document.addEventListener('DOMContentLoaded', function() {
  // Load recent activities
  loadRecentActivities();

  // Update time immediately and then every second
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);

  // Refresh activities when dashboard is refreshed
  if (window.refreshCardsFromDatabase) {
    const originalRefresh = window.refreshCardsFromDatabase;
    window.refreshCardsFromDatabase = async function() {
      await originalRefresh();
      loadRecentActivities();
    };
  }
});
