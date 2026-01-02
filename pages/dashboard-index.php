<?php
$page_title = 'Dashboard';
include 'shared-layout.php';
?>

            <section class="content-section active">
                <!-- App Content Header -->
                <div class="app-content-header">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-sm-6">
                                <h3 class="mb-0">Dashboard</h3>
                            </div>
                            <div class="col-sm-6">
                                <ol class="breadcrumb float-sm-end">
                                    <li class="breadcrumb-item"><a href="#">Home</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- App Content -->
                <div class="app-content">
                    <div class="container-fluid">
                        <!-- Small Box Widgets -->
                        <div class="row">
                            <div class="col-lg-3 col-6">
                                <div class="small-box text-bg-primary">
                                    <div class="inner">
                                        <h3 id="totalMahasiswa">0</h3>
                                        <p>Total Mahasiswa</p>
                                    </div>
                                    <div class="icon">
                                        <i class="fas fa-users"></i>
                                    </div>
                                    <a href="data-mahasiswa.php" class="small-box-footer link-light text-decoration-none">
                                        Lihat Detail <i class="fas fa-arrow-circle-right"></i>
                                    </a>
                                </div>
                            </div>
                            
                            <div class="col-lg-3 col-6">
                                <div class="small-box text-bg-warning">
                                    <div class="inner">
                                        <h3 id="jumlahSuratPeringatanBulanIni">0</h3>
                                        <p>SP Bulan Ini</p>
                                    </div>
                                    <div class="icon">
                                        <i class="fas fa-calendar-alt"></i>
                                    </div>
                                    <a href="surat-peringatan.php" class="small-box-footer link-light text-decoration-none">
                                        Lihat Detail <i class="fas fa-arrow-circle-right"></i>
                                    </a>
                                </div>
                            </div>
                            
                            <div class="col-lg-3 col-6">
                                <div class="small-box text-bg-success">
                                    <div class="inner">
                                        <h3 id="totalSP">0</h3>
                                        <p>Total SP</p>
                                    </div>
                                    <div class="icon">
                                        <i class="fas fa-file-circle-exclamation"></i>
                                    </div>
                                    <a href="surat-peringatan.php" class="small-box-footer link-light text-decoration-none">
                                        Lihat Detail <i class="fas fa-arrow-circle-right"></i>
                                    </a>
                                </div>
                            </div>
                            
                            <div class="col-lg-3 col-6">
                                <div class="small-box text-bg-danger">
                                    <div class="inner">
                                        <h3 id="totalSP3">0</h3>
                                        <p>SP3 Terakhir</p>
                                    </div>
                                    <div class="icon">
                                        <i class="fas fa-exclamation-triangle"></i>
                                    </div>
                                    <a href="surat-peringatan.php" class="small-box-footer link-light text-decoration-none">
                                        Lihat Detail <i class="fas fa-arrow-circle-right"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Charts Row -->
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h3 class="card-title">
                                            <i class="fas fa-chart-bar mr-1"></i>
                                            Grafik Surat Peringatan
                                        </h3>
                                    </div>
                                    <div class="card-body">
                                        <canvas id="suratPeringatanChart" style="height: 300px;"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h3 class="card-title">
                                            <i class="fas fa-chart-line mr-1"></i>
                                            Tren SP
                                        </h3>
                                    </div>
                                    <div class="card-body">
                                        <canvas id="trenSuratSemester" style="height: 300px;"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Additional Dashboard Elements -->
                        <div class="row">
                            <!-- Recent Activities -->
                            <div class="col-lg-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h3 class="card-title">
                                            <i class="fas fa-history mr-1"></i>
                                            Aktivitas Terbaru
                                        </h3>
                                    </div>
                                    <div class="card-body">
                                        <div id="recentActivities" class="list-group list-group-flush">
                                            <div class="list-group-item">
                                                <i class="fas fa-spinner fa-spin me-2"></i>
                                                Memuat aktivitas...
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Quick Actions -->
                            <div class="col-lg-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h3 class="card-title">
                                            <i class="fas fa-bolt mr-1"></i>
                                            Aksi Cepat
                                        </h3>
                                    </div>
                                    <div class="card-body">
                                        <div class="d-grid gap-2">
                                            <a href="data-mahasiswa.php" class="btn btn-primary">
                                                <i class="fas fa-user-plus me-2"></i>
                                                Tambah Mahasiswa
                                            </a>
                                            <a href="surat-peringatan.php" class="btn btn-warning">
                                                <i class="fas fa-file-plus me-2"></i>
                                                Buat Surat Peringatan
                                            </a>
                                            <button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#printModal">
                                                <i class="fas fa-print me-2"></i>
                                                Cetak Laporan
                                            </button>
                                            <button class="btn btn-secondary" onclick="location.reload()">
                                                <i class="fas fa-sync-alt me-2"></i>
                                                Refresh Dashboard
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Summary Cards Row -->
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="card text-bg-info">
                                    <div class="card-body">
                                        <h5 class="card-title">
                                            <i class="fas fa-info-circle me-2"></i>
                                            Sistem Informasi
                                        </h5>
                                        <p class="card-text">
                                            Sistem Pengelolaan Surat Peringatan Mahasiswa<br>
                                            <small class="text-light">Versi 1.0.0</small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="card text-bg-light">
                                    <div class="card-body">
                                        <h5 class="card-title">
                                            <i class="fas fa-clock me-2"></i>
                                            Waktu Sistem
                                        </h5>
                                        <p class="card-text" id="currentTime">
                                            <i class="fas fa-spinner fa-spin me-2"></i>
                                            Memuat...
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="card text-bg-dark">
                                    <div class="card-body">
                                        <h5 class="card-title">
                                            <i class="fas fa-shield-alt me-2"></i>
                                            Status Sistem
                                        </h5>
                                        <p class="card-text">
                                            <span class="badge bg-success">Online</span><br>
                                            <small class="text-light">Semua sistem berjalan normal</small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

<?php
$extra_scripts = '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="../assets/js/dashboard-enhancements.js"></script>
<script src="../assets/js/dashboard-display-card.js"></script>
<script src="../assets/js/chart-dashboard.js"></script>';
include 'shared-layout-footer.php';
?>

<!-- Print Modal -->
<div class="modal fade" id="printModal" tabindex="-1" aria-labelledby="printModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="printModalLabel">
                    <i class="fas fa-print me-2"></i>
                    Cetak Laporan
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p class="text-muted mb-3">Pilih jenis laporan yang ingin dicetak:</p>
                
                <div class="d-grid gap-3">
                    <button class="btn btn-primary btn-lg text-start" onclick="printStats();">
                        <i class="fas fa-chart-bar me-2"></i>
                        Cetak Statistik Saja
                    </button>
                    
                    <button class="btn btn-success btn-lg text-start" onclick="printCharts();">
                        <i class="fas fa-chart-line me-2"></i>
                        Cetak Grafik Saja
                    </button>
                </div>
                
                <hr>
                
                <p class="text-muted small mb-0">
                    <i class="fas fa-info-circle me-1"></i>
                    Tips: Untuk menyimpan sebagai PDF, pilih "Simpan sebagai PDF" pada dialog pencetakan.
                </p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i>
                    Tutup
                </button>
            </div>
        </div>
    </div>
</div>

