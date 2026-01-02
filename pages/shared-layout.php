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
        
        <!-- Bootstrap 5 CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        
        <!-- Font Awesome Icons -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
        
        <!-- Google Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        
        <!-- Custom CSS -->
        <link rel="stylesheet" href="../assets/css/style-dashboard.css?v=<?php echo time(); ?>">
        
        <?php if (isset($extra_css)): ?>
            <?php echo $extra_css; ?>
        <?php endif; ?>
    </head>
    <body>
        <!-- HEADER -->
        <header class="main-header">
            <nav class="navbar navbar-expand navbar-white navbar-light">
                <!-- Left navbar links -->
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <button class="sidebar-toggle" id="sidebarToggle" type="button">
                            <i class="fas fa-bars"></i>
                        </button>
                    </li>
                    <li class="nav-item d-none d-md-inline-block">
                        <a class="brand-link" href="dashboard-index.php">
                            <img src="../assets/img/logo polibatam.png" alt="Logo" class="brand-image">
                            <span class="brand-text">Dashboard SP</span>
                        </a>
                    </li>
                </ul>

                <!-- Right navbar links -->
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item dropdown user-dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            <i class="fas fa-user-circle me-1"></i>
                            <span><?php echo htmlspecialchars($_SESSION['username'] ?? 'User'); ?></span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item" href="ubah-password.php">
                                <i class="fas fa-key me-2"></i>Ubah Password
                            </a>
                            <div class="dropdown-divider"></div>
                            <button class="dropdown-item text-danger" id="logoutButton">
                                <i class="fas fa-sign-out-alt me-2"></i>Logout
                            </button>
                        </div>
                    </li>
                </ul>
            </nav>
        </header>

        <!-- SIDEBAR OVERLAY (Mobile) -->
        <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <!-- SIDEBAR -->
        <aside class="main-sidebar" id="mainSidebar">
            <div class="sidebar">
                <nav class="sidebar-menu">
                    <ul class="nav nav-pills nav-sidebar flex-column">
                        <li class="nav-header">MENU</li>
                        <li class="nav-item">
                            <a href="dashboard-index.php" class="nav-link <?php echo $current_page === 'dashboard-index' ? 'active' : ''; ?>">
                                <i class="nav-icon fas fa-home"></i>
                                <p>Dashboard</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="data-mahasiswa.php" class="nav-link <?php echo $current_page === 'data-mahasiswa' ? 'active' : ''; ?>">
                                <i class="nav-icon fas fa-user-graduate"></i>
                                <p>Data Mahasiswa</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="surat-peringatan.php" class="nav-link <?php echo $current_page === 'surat-peringatan' ? 'active' : ''; ?>">
                                <i class="nav-icon fas fa-file-circle-exclamation"></i>
                                <p>Surat Peringatan</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="ubah-password.php" class="nav-link <?php echo $current_page === 'ubah-password' ? 'active' : ''; ?>">
                                <i class="nav-icon fas fa-key"></i>
                                <p>Ubah Password</p>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>

        <!-- CONTENT AREA -->
        <main class="content-wrapper" id="contentWrapper">

