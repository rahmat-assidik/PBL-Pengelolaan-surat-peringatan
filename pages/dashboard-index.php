<?php
$page_title = 'Dashboard';
include 'shared-layout.php';
?>

            <section id="dashboard" class="content-section active">
                <div style="margin-bottom: var(--space-2xl);">
                    <h2 style="margin-bottom: var(--space-sm); color: var(--gray-900); font-size: 1.875rem; font-weight: 700; letter-spacing: -0.025em;">Dashboard</h2>
                    <p style="color: var(--gray-600); margin: 0; font-size: 1rem; line-height: 1.5;">
                        Selamat datang,
                        <strong id="userName" style="color: var(--gray-800);">User</strong>! Ini adalah halaman Dashboard utama.
                    </p>
                </div>
                <div class="card-grid">
                    <div class="card-container">
                        <i id="iconTotalMahasiswa" class="fas fa-users card-icon"></i>
                        <h3 class="card-title">Total Mahasiswa</h3>
                        <p class="card-value" id="totalMahasiswa">0</p>
                    </div>
                    <div class="card-container">
                        <i class="fas fa-file-circle-exclamation card-icon"></i>
                        <h3 class="card-title">Total surat peringatan aktif</h3>
                        <p class="card-value" id="totalSuratPeringatanAktif">0</p>
                    </div>
                    <div class="card-container">
                        <i class="fas fa-calendar-alt card-icon"></i>
                        <h3 class="card-title">Jumlah surat peringatan bulan ini</h3>
                        <p class="card-value" id="jumlahSuratPeringatanBulanIni">0</p>
                    </div>
                </div>
                <div class="chart-grid">
                    <div class="chart-container">
                        <canvas id="suratPeringatanChart" class="distribusi-sp"></canvas>
                    </div>
                    <div class="chart-container">
                        <canvas id="trenSuratSemester" class="surat-semester"></canvas>
                    </div>
                </div>
            </section>

<?php
$extra_scripts = '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="../assets/js/dashboard-display-card.js"></script>
<script src="../assets/js/chart-dashboard.js"></script>';
include 'shared-layout-footer.php';
?>
