<?php
include 'config/config.php';

// Get statistics
$stats = [
    'total' => 0,
    'sp1' => 0,
    'sp2' => 0,
    'sp3' => 0
];

//Get total surat peringatan
$stmt = $conn->prepare("SELECT COUNT(*) as total FROM surat_peringatan");
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$stats['total'] = $row['total'];

//Get SP1 count
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM surat_peringatan WHERE tingkatan_sp = 'SP1'");
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$stats['sp1'] = $row['count'];

//Get SP2 count
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM surat_peringatan WHERE tingkatan_sp = 'SP2'");
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$stats['sp2'] = $row['count'];

//Get SP3 count
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM surat_peringatan WHERE tingkatan_sp = 'SP3'");
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$stats['sp3'] = $row['count'];

$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sistem Pengelolaan Surat Peringatan Mahasiswa</title>

    <!-- Bootstrap -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />

    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style-landingpage.css" />
  </head>
  <body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div class="container-fluid px-3">
        <a class="navbar-brand" href="#">
          <div class="brand-container">
            <img
              src="assets/img/logo polibatam.png"
              alt="Logo Polibatam"
              class="skibidi"
            />
            <span>Pengelolaan Surat Peringatan</span>
          </div>
        </a>

        <!-- Navbar Container with Hamburger and Login -->
        <div class="navbar-container">
          <button class="hamburger-btn" id="hamburgerBtn" title="Menu">
            <div class="hamburger-line"></div>
            <div class="hamburger-line"></div>
            <div class="hamburger-line"></div>
          </button>
          <a
            href="auth/login.php"
            class="btn btn-primary btn-sm login-btn-nav"
            id="loginButton"
          >
            Login
          </a>
        </div>
      </div>
    </nav>

    <!-- Mobile/Desktop Menu -->
    <div class="mobile-menu" id="mobileMenu">
      <ul class="mobile-menu-nav">
        <li><a href="#home" class="menu-link">Beranda</a></li>
        <li><a href="#features" class="menu-link">Fitur</a></li>
        <li><a href="#contact" class="menu-link">Kontak</a></li>
        <li style="border-top: 1px solid #e9ecef; margin: 1rem 0"></li>
        <li>
          <a href="cari-mahasiswa.php" class="menu-link">Cari Surat Peringatan</a>
        </li>
      </ul>
    </div>

    <!-- Menu Overlay -->
    <div class="menu-overlay" id="menuOverlay"></div>

    <!-- Hero Section -->
    <section class="hero-section" id="home" style="margin-top: 80px">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
            <h1 class="display-4 fw-bold">
              Sistem Pengelolaan Surat Peringatan
            </h1>
            <p class="lead mb-4">
              Sistem ini dikembangkan untuk mendukung kegiatan akademik yang
              tertib dan profesional. Proses penerbitan surat peringatan dapat
              dilakukan secara otomatis dan efisien.
            </p>
            <a href="cari-mahasiswa.php" class="btn btn-primary btn-lg">
              Ke Halaman Pencarian
            </a>
          </div>
          <div class="col-lg-6">
            <div class="hero-image-container">
              <img
                src="assets/img/Checklist.jpg"
                alt="Sistem Pengelolaan Ilustrasi"
                class="hero-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section py-5">
      <div class="container">
        <h2 class="text-center mb-5 section-title">Statistik Sistem</h2>
        <div class="row g-4">
          <!-- Total Card -->
          <div class="col-md-3 col-sm-6">
            <div class="stat-card stat-total">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div class="stat-number"><?php echo $stats['total']; ?></div>
              <div class="stat-label">Total Surat Peringatan</div>
            </div>
          </div>
          <!-- SP1 Card -->
          <div class="col-md-3 col-sm-6">
            <div class="stat-card stat-sp1">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div class="stat-number"><?php echo $stats['sp1']; ?></div>
              <div class="stat-label">SP1 (Peringatan Pertama)</div>
            </div>
          </div>
          <!-- SP2 Card -->
          <div class="col-md-3 col-sm-6">
            <div class="stat-card stat-sp2">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div class="stat-number"><?php echo $stats['sp2']; ?></div>
              <div class="stat-label">SP2 (Peringatan Kedua)</div>
            </div>
          </div>
          <!-- SP3 Card -->
          <div class="col-md-3 col-sm-6">
            <div class="stat-card stat-sp3">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div class="stat-number"><?php echo $stats['sp3']; ?></div>
              <div class="stat-label">SP3 (Peringatan Ketiga)</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-5" id="features">
      <div class="container">
        <h2 class="text-center mb-5">Fitur Utama</h2>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="text-center feature-card">
              <div class="feature-icon">
                <img src="assets/img/pencatatan.png" alt="Pencatatan Digital" />
              </div>
              <h3>Pencatatan Digital</h3>
              <p>
                Sistem pencatatan surat peringatan secara digital yang aman dan terorganisir.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="text-center feature-card">
              <div class="feature-icon">
                <img src="assets/img/monitoring.png" alt="Monitoring Icon" />
              </div>
              <h3>Monitoring Real-time</h3>
              <p>Pantau status dan riwayat surat peringatan dengan mudah dan cepat.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="text-center feature-card">
              <div class="feature-icon">
                <img
                  src="assets/img/notification-bell.png"
                  alt="Notifikasi Icon"
                />
              </div>
              <h3>Notifikasi Otomatis</h3>
              <p>Sistem notifikasi otomatis untuk setiap pembaruan status surat peringatan.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <!-- FAQ Section -->
    <section class="bg-light py-5" id="faq">
      <div class="container">
        <h2 class="text-center mb-5">Pertanyaan Umum (FAQ)</h2>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="accordion accordion-flush" id="faqAccordion">
              <!-- FAQ 1 -->
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                    Apa itu Surat Peringatan (SP)?
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    Surat Peringatan (SP) adalah surat resmi yang diterbitkan oleh institusi pendidikan kepada mahasiswa yang melanggar peraturan akademik. Terdapat tiga tingkatan: SP1 (peringatan pertama), SP2 (peringatan kedua), dan SP3 (peringatan terakhir sebelum tindakan lebih lanjut).
                  </div>
                </div>
              </div>

              <!-- FAQ 2 -->
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Apa saja alasan seorang mahasiswa menerima Surat Peringatan?
                  </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    Alasan umum penerima SP antara lain: ketidakhadiran tanpa keterangan, plagiarisme, melanggar peraturan kampus, perilaku tidak disiplin, keterlambatan pembayaran, atau prestasi akademik yang jauh di bawah standar minimum.
                  </div>
                </div>
              </div>

              <!-- FAQ 3 -->
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingThree">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    Bagaimana cara melihat status Surat Peringatan saya?
                  </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    Anda dapat melihat status surat peringatan dengan menggunakan fitur pencarian di halaman "Cari Surat Peringatan". Masukkan NIM atau nama Anda untuk melihat riwayat surat peringatan yang telah diterbitkan.
                  </div>
                </div>
              </div>

              <!-- FAQ 4 -->
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingFour">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                    Apa konsekuensi dari menerima SP3?
                  </button>
                </h2>
                <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    SP3 adalah surat peringatan terakhir. Jika mahasiswa masih melanggar peraturan setelah menerima SP3, dapat dikenakan sanksi akademik yang lebih berat, termasuk pembekuan akademik atau pengeluaran dari institusi.
                  </div>
                </div>
              </div>

              <!-- FAQ 5 -->
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingFive">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                    Bisakah Surat Peringatan dihapus dari riwayat saya?
                  </button>
                </h2>
                <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    Surat peringatan adalah bagian dari riwayat akademik resmi dan tidak dapat dihapus. Namun, jika terdapat kesalahan dalam penerbitan SP, mahasiswa dapat mengajukan banding ke bagian akademik untuk tinjauan kembali.
                  </div>
                </div>
              </div>

              <!-- FAQ 6 -->
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingSix">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                    Berapa lama Surat Peringatan berlaku?
                  </button>
                </h2>
                <div id="collapseSix" class="accordion-collapse collapse" aria-labelledby="headingSix" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    Surat peringatan tetap berlaku selama masa studi mahasiswa. Namun, jika mahasiswa berhasil menunjukkan perbaikan perilaku akademik dan tidak melanggar peraturan dalam jangka waktu tertentu, SP dapat ditinjau oleh pihak akademik.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <div class="container text-center">
        <p class="mb-0">
          &copy; 2025 Sistem Pengelolaan Surat Peringatan Mahasiswa. All rights
          reserved.
        </p>
      </div>
    </footer>

    <!-- JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/landing-page.js"></script>
  </body>
</html>
