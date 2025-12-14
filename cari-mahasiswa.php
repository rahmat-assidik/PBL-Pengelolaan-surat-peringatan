<?php
session_start();
include 'config/config.php';

// Fungsi untuk mendapatkan data surat peringatan dari database
/**
 * Mengambil data surat peringatan dengan filter pencarian

 * @param mysqli $conn - Koneksi database
 * @param string $search - Keyword pencarian (NIM atau Nama)
 * @param string $tingkatan - Filter Tingkatan SP
 * @return array - Array data surat peringatan (deduplicated by NIM, latest record)
 */
function getSuratPeringatan($conn, $search = '', $tingkatan = '') {
    $query = "SELECT * FROM surat_peringatan WHERE 1=1";
    
    $params = array();
    $types = '';
    
    if (!empty($search)) {
        $searchTerm = '%' . $search . '%';
        $query .= " AND (nim LIKE ? OR nama LIKE ? OR alasan_sp LIKE ?)";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $types .= 'sss';
    }
    
    if (!empty($tingkatan)) {
        $query .= " AND tingkatan_sp = ?";
        $params[] = $tingkatan;
        $types .= 's';
    }
    
    $query .= " ORDER BY created_at DESC";
    
    $stmt = $conn->prepare($query);
    
    if (!$stmt) {
        error_log("Prepare failed: " . $conn->error);
        return array();
    }
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    if (!$stmt->execute()) {
        error_log("Execute failed: " . $stmt->error);
        return array();
    }
    
    $result = $stmt->get_result();
    $data = $result ? $result->fetch_all(MYSQLI_ASSOC) : array();
    $stmt->close();
    
    return $data;
}

// Mendapatkan list tingkatan SP yang unik
/**
 * Mengambil daftar Tingkatan Surat Peringatan yang unik dari database
 * 
 * @param mysqli $conn - Koneksi database
 * @return array - Array daftar tingkatan SP yang tersedia
 */
function getTingkatanSPList($conn) {
    $query = "SELECT DISTINCT tingkatan_sp FROM surat_peringatan WHERE tingkatan_sp IS NOT NULL AND tingkatan_sp != '' ORDER BY tingkatan_sp";
    $stmt = $conn->prepare($query);
    
    if (!$stmt) {
        error_log("Prepare failed: " . $conn->error);
        return array();
    }
    
    if (!$stmt->execute()) {
        error_log("Execute failed: " . $stmt->error);
        return array();
    }
    
    $result = $stmt->get_result();
    $list = $result ? $result->fetch_all(MYSQLI_ASSOC) : array();
    $stmt->close();
    
    return $list;
}

// Handle AJAX request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');
    
    try {
        if ($_POST['action'] === 'search') {
            $search = isset($_POST['search']) ? trim($_POST['search']) : '';
            $tingkatan = isset($_POST['tingkatan']) ? trim($_POST['tingkatan']) : '';
            
            // Validasi input
            if (strlen($search) > 100) {
                echo json_encode(['error' => 'Input pencarian terlalu panjang']);
                exit();
            }
            
            $data = getSuratPeringatan($conn, $search, $tingkatan);
            echo json_encode($data);
        } else {
            echo json_encode(['error' => 'Action tidak valid']);
        }
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode(['error' => 'Terjadi kesalahan pada server']);
    }
    exit();
}

// Get data untuk initial load
$tingkatanList = getTingkatanSPList($conn);
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cari Surat Peringatan</title>

    <!-- Bootstrap -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />

    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/cari-mahasiswa.css" />
  </head>

  <body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div class="container-fluid px-3">
        <a class="navbar-brand" href="landing-page.php">
          <div class="brand-container">
            <img
              src="assets/img/logo polibatam.png"
              alt="Logo Polibatam"
              class="skibidi"
            />
            <span>Pengelolaan Surat Peringatan</span>
          </div>
        </a>

        <div class="navbar-container">
          <button class="hamburger-btn" id="hamburgerBtn" title="Menu">
            <div class="hamburger-line"></div>
            <div class="hamburger-line"></div>
            <div class="hamburger-line"></div>
          </button>
          <a href="../login.php" class="btn btn-primary btn-sm login-btn-nav"
            >Login</a
          >
        </div>
      </div>
    </nav>

    <!-- Mobile/Desktop Menu -->
    <div class="mobile-menu" id="mobileMenu">
      <ul class="mobile-menu-nav">
        <li><a href="landing-page.php#home" class="menu-link">Beranda</a></li>
        <li>
          <a href="landing-page.php#features" class="menu-link">Fitur</a>
        </li>
        <li>
          <a href="landing-page.php#contact" class="menu-link">Kontak</a>
        </li>
        <li style="border-top: 1px solid #e9ecef; margin: 1rem 0"></li>
        <li>
          <a href="cari-mahasiswa.php" class="menu-link active"
            >Cari Surat Peringatan</a
          >
        </li>
      </ul>
    </div>

    <!-- Menu Overlay -->
    <div class="menu-overlay" id="menuOverlay"></div>

    <!-- Ilustrasi + Penjelasan -->
    <section class="search-page">
      <div class="container">
        <div class="row align-items-center mb-5">
          <div class="col-md-6 text-center mb-4 mb-md-0 fade-scroll">
            <div class="hero-image-container">
              <img
                src="assets/img/search-page-img.png"
                alt="Ilustrasi Surat Peringatan"
                class="hero-image"
                style="max-height: 320px"
              />
            </div>
          </div>
          <div class="col-md-6 fade-scroll">
            <h2 class="fw-bold mb-3 text-primary">
              Temukan Surat Peringatan Lebih Cepat
            </h2>
            <p class="text-muted fs-5">
              Sistem ini membantu Anda mencari dan memantau surat peringatan
              secara efisien. Cukup masukkan <strong>nama</strong> atau
              <strong>NIM</strong>, dan dapatkan informasi lengkap seperti
              tingkat peringatan, alasan, ketua prodi, dan dosen wali dalam hitungan detik.
            </p>
            <p class="text-muted">
              Gunakan filter tingkat peringatan untuk mempersempit hasil
              pencarian Anda.
            </p>
          </div>
        </div>

        <!-- Form Pencarian -->
        <div class="text-center mb-4 fade-scroll">
          <h3 class="fw-bold">Cari Informasi Surat Peringatan</h3>
          <p class="text-muted">
            Ketik nama atau NIM mahasiswa untuk memulai pencarian.
          </p>
        </div>

        <div class="row justify-content-center fade-scroll">
          <div class="col-md-8 position-relative">
            <div class="mb-3 position-relative">
              <input
                type="text"
                id="searchInput"
                class="form-control form-control-lg pe-5"
                placeholder="Ketik nama atau NIM mahasiswa..."
              />
              <button id="clearBtn" title="Hapus pencarian">&times;</button>
              <div
                class="search-preview"
                id="searchPreview"
                style="display: none"
              ></div>
            </div>
            <div class="d-flex gap-2 mb-4">
              <select id="filterTingkatan" class="form-select">
                <option value="">Semua Tingkat Peringatan</option>
                <?php foreach ($tingkatanList as $t): ?>
                  <option value="<?php echo htmlspecialchars($t['tingkatan_sp']); ?>">
                    <?php echo htmlspecialchars($t['tingkatan_sp']); ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="text-center text-muted py-5 fade-scroll" id="emptyState">
          <img
            src="assets/img/search-icon.png"
            alt="Cari Surat Peringatan"
            class="search-icon mb-3"
          />
          <p>Ketik nama atau NIM mahasiswa untuk memulai pencarian.</p>
        </div>

        <!-- Hasil Pencarian -->
        <div class="row justify-content-center mt-5 fade-scroll">
          <div class="col-md-8">
            <div id="resultContainer"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <div class="container text-center">
        <p class="mb-0">
          &copy; 2025 Sistem Pengelolaan Surat Peringatan Mahasiswa
        </p>
      </div>
    </footer>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
    // ===== ELEMENTS =====
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const menuOverlay = document.getElementById("menuOverlay");
    const menuLinks = document.querySelectorAll(".menu-link");
    const searchInput = document.getElementById("searchInput");
    const clearBtn = document.getElementById("clearBtn");
    const filterTingkatan = document.getElementById("filterTingkatan");
    const searchPreview = document.getElementById("searchPreview");
    const resultContainer = document.getElementById("resultContainer");
    const emptyState = document.getElementById("emptyState");

    // ===== HAMBURGER MENU =====
    hamburgerBtn.addEventListener("click", () => {
      hamburgerBtn.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      menuOverlay.classList.toggle("active");
    });

    menuOverlay.addEventListener("click", () => {
      hamburgerBtn.classList.remove("active");
      mobileMenu.classList.remove("active");
      menuOverlay.classList.remove("active");
    });

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburgerBtn.classList.remove("active");
        mobileMenu.classList.remove("active");
        menuOverlay.classList.remove("active");
      });
    });

    // ===== SCROLL ANIMATION =====
    const scrollElements = document.querySelectorAll(".fade-scroll");

    function scrollAnimation() {
      scrollElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add("visible");
        }
      });
    }

    window.addEventListener("scroll", scrollAnimation);
    window.addEventListener("load", scrollAnimation);

    // ===== HELPER FUNCTION - ESCAPE HTML =====
    function escapeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, m => map[m]);
    }

    // ===== FILTER DATA =====
    let currentSearchData = []; // Data yang sudah di-filter berdasarkan tingkatan (untuk preview)
    let currentAllData = []; // Semua data tanpa filter tingkatan (untuk detail)
    
    async function filterData() {
      const query = searchInput.value.trim();
      const selectedTingkatan = filterTingkatan.value;

      if (!query) {
        searchPreview.style.display = "none";
        resultContainer.innerHTML = "";
        emptyState.style.display = "block";
        currentSearchData = [];
        currentAllData = [];
        return;
      }

      emptyState.style.display = "none";

      try {
        const formData = new FormData();
        formData.append('action', 'search');
        formData.append('search', query);
        // Jangan kirim filter tingkatan ke backend, ambil SEMUA data
        formData.append('tingkatan', '');

        const response = await fetch('cari-mahasiswa.php', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
          resultContainer.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
          currentSearchData = [];
          currentAllData = [];
          return;
        }
        
        // Simpan semua data tanpa filter
        currentAllData = data;
        
        // Filter data berdasarkan tingkatan yang dipilih untuk preview
        if (selectedTingkatan) {
          currentSearchData = data.filter(item => item.tingkatan_sp === selectedTingkatan);
        } else {
          currentSearchData = data;
        }
        
        displayPreview(currentSearchData);
      } catch (error) {
        console.error('Error:', error);
        resultContainer.innerHTML = '<div class="alert alert-danger">Terjadi kesalahan saat mengambil data</div>';
        currentSearchData = [];
        currentAllData = [];
      }
    }

    // ===== DISPLAY PREVIEW =====
    function displayPreview(data) {
      if (data.length === 0) {
        searchPreview.style.display = "none";
        resultContainer.innerHTML = '<div class="alert alert-info">Data surat peringatan tidak ditemukan</div>';
        return;
      }

      // Group by mahasiswa (nim + nama) dan hitung jumlah SP
      const groupedByStudent = {};
      data.forEach(item => {
        const key = item.nim; // Group by NIM
        if (!groupedByStudent[key]) {
          groupedByStudent[key] = {
            nim: item.nim,
            nama: item.nama,
            count: 0,
            latestTingkatan: item.tingkatan_sp
          };
        }
        groupedByStudent[key].count++;
      });

      // Buat preview HTML dari grouped data
      const previewHTML = Object.values(groupedByStudent)
        .map(
          (student) => `
            <div class="preview-item" onclick='selectSuratPeringatan("${escapeHtml(student.nim)}")'>
              <strong>${escapeHtml(student.nama)}</strong> <br />
              <small>${escapeHtml(student.nim)} - ${student.count} SP (${escapeHtml(student.latestTingkatan)})</small>
            </div>
          `
        )
        .join("");

      searchPreview.innerHTML = previewHTML;
      searchPreview.style.display = "block";
    }

    // ===== SELECT SURAT PERINGATAN =====
    function selectSuratPeringatan(nim) {
      // Cari SEMUA item dengan NIM yang sama dari currentAllData (tanpa filter)
      const itemsWithSameNim = currentAllData.filter(item => item.nim === nim);
      
      if (itemsWithSameNim.length === 0) {
        resultContainer.innerHTML = '<div class="alert alert-warning">Data tidak ditemukan</div>';
        return;
      }
      
      // Urutkan berdasarkan created_at DESC (terbaru di atas)
      itemsWithSameNim.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const firstItem = itemsWithSameNim[0];

      // isi kolom pencarian secara otomatis
      searchInput.value = `${firstItem.nama} (${firstItem.nim})`;

      // sembunyikan elemen yang tidak perlu
      emptyState.style.display = "none";
      searchPreview.style.display = "none";

      // Buat card header dengan info mahasiswa
      const headerCard = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15); color: white; animation: fadeInUp 0.5s ease-out;">
          <h3 style="margin: 0 0 12px 0; font-weight: 600; font-size: 22px;">${escapeHtml(firstItem.nama)}</h3>
          <p style="margin: 0; font-size: 14px; opacity: 0.95;"><strong>NIM:</strong> ${escapeHtml(firstItem.nim)}</p>
          <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.85;">Total Surat Peringatan: <strong>${itemsWithSameNim.length}</strong></p>
        </div>
      `;

      // Buat kartu untuk setiap SP
      const spCards = itemsWithSameNim.map((item, index) => {
        const tingkatanColor = item.tingkatan_sp === 'SP1' ? '#3b82f6' : (item.tingkatan_sp === 'SP2' ? '#f59e0b' : '#ef4444');
        const tingkatanBgLight = item.tingkatan_sp === 'SP1' ? '#eff6ff' : (item.tingkatan_sp === 'SP2' ? '#fffbeb' : '#fef2f2');
        const createdDate = new Date(item.created_at).toLocaleDateString('id-ID');
        const badge = index === 0 ? `<span style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-left: 8px;">Terbaru</span>` : '';
        const delayTime = (index * 0.1) + 0.5;
        
        return `
          <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-left: 5px solid ${tingkatanColor}; transition: all 0.3s ease; animation: fadeInUp 0.5s ease-out ${delayTime}s both; cursor: pointer;" onmouseover="this.style.boxShadow='0 8px 24px rgba(0, 0, 0, 0.15)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.08)'; this.style.transform='translateY(0)';">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h5 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">Surat Peringatan ${index + 1}</h5>
              <div>
                <span style="background: ${tingkatanBgLight}; color: ${tingkatanColor}; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; border: 1px solid ${tingkatanColor};">${escapeHtml(item.tingkatan_sp || 'N/A')}</span>
                ${badge}
              </div>
            </div>
            
            <div style="display: grid; gap: 12px; font-size: 14px; color: #374151;">
              <div>
                <span style="color: #6b7280; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Tingkat Peringatan</span><br>
                <span style="font-weight: 600; color: ${tingkatanColor}; font-size: 15px;">${escapeHtml(item.tingkatan_sp || 'N/A')}</span>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 12px;">
                <span style="color: #6b7280; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Ketua Program Studi</span><br>
                <span style="color: #1f2937;">${escapeHtml(item.ketua_prodi || 'N/A')}</span>
              </div>
              
              <div>
                <span style="color: #6b7280; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Dosen Wali</span><br>
                <span style="color: #1f2937;">${escapeHtml(item.wali_dosen || 'N/A')}</span>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 12px;">
                <span style="color: #6b7280; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Alasan Surat Peringatan</span><br>
                <span style="color: #1f2937; line-height: 1.6;">${escapeHtml(item.alasan_sp || 'N/A')}</span>
              </div>
              
              <div style="background: ${tingkatanBgLight}; padding: 10px 12px; border-radius: 8px; margin-top: 4px;">
                <span style="color: ${tingkatanColor}; font-size: 13px; font-weight: 500;">${createdDate}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
      // Tambahkan CSS animasi jika belum ada
      if (!document.getElementById('sp-animations')) {
        const style = document.createElement('style');
        style.id = 'sp-animations';
        style.textContent = `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      resultContainer.innerHTML = headerCard + spCards;
    }

    // ===== EVENT LISTENERS =====
    searchInput.addEventListener("input", filterData);
    filterTingkatan.addEventListener("change", filterData);

    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      resultContainer.innerHTML = "";
      searchPreview.style.display = "none";
      emptyState.style.display = "block";
    });
    </script>
  </body>
</html>
