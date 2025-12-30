<?php
/**
 * Shared Layout Template
 * Include this file at the top of each page after session check
 * Usage: include '../shared-layout.php';
 */

// Ensure session is started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Redirect to login if not authenticated
if (!isset($_SESSION['user_id'])) {
    header("Location: ../auth/login.php");
    exit();
}

// Get current page for active sidebar link
$current_page = basename($_SERVER['PHP_SELF'], '.php');
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?php echo isset($page_title) ? $page_title . ' - ' : ''; ?>Pengelolaan Surat Peringatan</title>
        <link rel="stylesheet" href="../assets/css/style-dashboard.css?v=<?php echo time(); ?>">
        <link rel="stylesheet" href="../assets/css/style-data-mahasiswa.css?v=<?php echo time(); ?>">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
            rel="stylesheet">
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
        <link href="https://cdn.jsdelivr.net/npm/remixicon@3.6.0/fonts/remixicon.css" rel="stylesheet">
        <?php if (isset($extra_css)): ?>
            <?php echo $extra_css; ?>
        <?php endif; ?>
        <script>
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', '<?php echo htmlspecialchars($_SESSION['username']); ?>');
        </script>
        <style>
    /* --- PENGATURAN DESKTOP (Web) --- */
    
    /* Sidebar default muncul di desktop */
    .sidebar-container {
        position: fixed;
        left: 0;
        top: 60px; /* Sesuaikan tinggi header */
        width: 250px;
        height: calc(100vh - 60px);
        transition: transform 0.3s ease;
        z-index: 1000;
        background: #fff;
    }

    /* Konten default tergeser ke kanan */
    .content {
        margin-left: 250px;
        transition: margin-left 0.3s ease;
        padding: 20px;
    }

    /* KETIKA HAMBURGER DIKLIK (DESKTOP) */
    /* Sidebar sembunyi ke kiri */
    .sidebar-container.hide-sidebar {
        transform: translateX(-100%);
    }
    /* Konten jadi full ke kiri */
    .content.full-width {
        margin-left: 0;
    }

    /* --- PENGATURAN MOBILE (Layar < 1024px) --- */
    @media (max-width: 1024px) {
        .sidebar-container {
            top: 0;
            height: 100vh;
            transform: translateX(-100%); /* Sembunyi default di mobile */
        }

        /* Konten di mobile selalu full */
        .content {
            margin-left: 0;
        }

        /* KETIKA HAMBURGER DIKLIK (MOBILE) */
        .sidebar-container.show {
            transform: translateX(0);
        }

        .sidebar-overlay.active {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 998;
        }
    }

    /* Pastikan tombol hamburger selalu nampak & di atas */
    .hamburger-btn {
        z-index: 1001;
        position: relative;
    }
</style>
    </head>
    <body>
        <!-- HEADER -->
        <header class="header-container">
            <div class="header-left">
                <button id="hamburgerBtn" class="hamburger-btn" style="background:none; border:none; color:black; font-size:1.5rem; margin-right:15px; cursor:pointer;">
            <i class="fas fa-bars"></i>
        </button>
                <div class="logo-text">
                    <img src="../assets/img/logo polibatam.png" class="logo-dashboard" alt="Logo">
                    <h1 class="header-text">Dashboard Pengelolaan Surat Peringatan</h1>
                </div>
            </div>
            <button id="logoutButton">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </button>
        </header>

        <!-- SIDEBAR OVERLAY (Mobile) -->
        <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <!-- SIDEBAR -->
        <div class="sidebar-container" id="sidebar">
            <div class="sidebar">
                <div class="sidebar-header">
                    <span class="description-header">Menu</span>
                </div>
                <div class="main">
                    <div class="list-item">
                        <a href="dashboard-index.php" class="<?php echo $current_page === 'dashboard-index' ? 'active' : ''; ?>">
                            <i class="fas fa-home"></i>
                            <span class="description">Dashboard</span>
                        </a>
                    </div>
                    <div class="list-item">
                        <a href="data-mahasiswa.php" class="<?php echo $current_page === 'data-mahasiswa' ? 'active' : ''; ?>">
                            <i class="fas fa-user-graduate"></i>
                            <span class="description">Data Mahasiswa</span>
                        </a>
                    </div>
                    <div class="list-item">
                        <a href="surat-peringatan.php" class="<?php echo $current_page === 'surat-peringatan' ? 'active' : ''; ?>">
                            <i class="fas fa-file-circle-exclamation"></i>
                            <span class="description">Surat Peringatan</span>
                        </a>
                    </div>
                    <div class="list-item">
                        <a href="ubah-password.php" class="<?php echo $current_page === 'ubah-password' ? 'active' : ''; ?>">
                            <i class="fas fa-eye-slash"></i>
                            <span class="description">Ubah Kata Sandi</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- CONTENT AREA -->
        <main class="content" id="content">
        <script src="../assets/js/logout-handler.js"></script>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const content = document.getElementById('content');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            const isMobile = window.innerWidth <= 1024;

            if (isMobile) {
                // Logika Mobile: Munculkan Sidebar + Overlay
                sidebar.classList.toggle('show');
                overlay.classList.toggle('active');
            } else {
                // Logika Desktop: Geser Sidebar keluar + Lebarkan Konten
                sidebar.classList.toggle('hide-sidebar');
                content.classList.toggle('full-width');
            }
        });
    }

    // Klik overlay untuk menutup (khusus mobile)
    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('show');
            overlay.classList.remove('active');
        });
    }
});
        </script>
</body>
</html>