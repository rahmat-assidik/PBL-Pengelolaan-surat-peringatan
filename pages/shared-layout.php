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
    </head>
    <body>
        <!-- HEADER -->
        <header class="header-container">
            <div class="header-left">
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
