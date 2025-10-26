document.addEventListener("DOMContentLoaded", () => {
    /* ========================================
                CEK STATUS LOGIN
            ======================================== */
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn !== "true") {
        // Jika belum login, paksa kembali ke halaman login
        window.location.href = "login-page.html";
        return;
    }

    /* ========================================
                TOGGLE SIDEBAR
            ======================================== */
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const overlay = document.getElementById('sidebarOverlay');

    toggleBtn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            // Mobile behavior
            sidebar
                .classList
                .toggle('show');
            overlay
                .classList
                .toggle('show');
        } else {
            // Desktop behavior
            sidebar
                .classList
                .toggle('collapsed');
            content
                .classList
                .toggle('expanded');

            // Simpan state sidebar ke localStorage
            if (sidebar.classList.contains('collapsed')) {
                localStorage.setItem('sidebarCollapsed', 'true');
            } else {
                localStorage.setItem('sidebarCollapsed', 'false');
            }
        }
    });

    // Restore sidebar state dari localStorage
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    if (sidebarCollapsed === 'true' && window.innerWidth > 768) {
        sidebar
            .classList
            .add('collapsed');
        content
            .classList
            .add('expanded');
    }

    // Close sidebar when clicking overlay (mobile)
    overlay.addEventListener('click', () => {
        sidebar
            .classList
            .remove('show');
        overlay
            .classList
            .remove('show');
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar
                .classList
                .remove('show');
            overlay
                .classList
                .remove('show');
        } else {
            sidebar
                .classList
                .remove('collapsed');
            content
                .classList
                .remove('expanded');
        }
    });

    /* ========================================
                LOGIKA SIDEBAR (navigasi konten)
            ======================================== */
    const links = document.querySelectorAll(".sidebar a");
    const sections = document.querySelectorAll(".content-section");

    if (links.length > 0 && sections.length > 0) {
        links.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();

                // Hapus "active" dari semua link sidebar
                links.forEach((l) => l.classList.remove("active"));
                link
                    .classList
                    .add("active");

                // Sembunyikan semua section
                sections.forEach((sec) => sec.classList.remove("active"));

                // Ambil id target dari data-target
                const target = link.getAttribute("data-target");
                const section = document.getElementById(target);

                // Tampilkan konten yang sesuai
                if (section) 
                    section
                        .classList
                        .add("active");
                
                // Close sidebar on mobile after selection
                if (window.innerWidth <= 768) {
                    sidebar
                        .classList
                        .remove('show');
                    overlay
                        .classList
                        .remove('show');
                }
            });
        });
    }

    /* ========================================
                FITUR LOGOUT
            ======================================== */
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            const confirmLogout = confirm("Apakah Anda yakin ingin logout?");
            if (!confirmLogout) 
                return;
            
            // Hapus status login dari localStorage
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("username");
            localStorage.removeItem("sidebarCollapsed");

            // Redirect ke halaman login
            window.location.href = "login-page.html";
        });
    }

    /* ========================================
                TAMPILKAN NAMA USER DI DASHBOARD
            ======================================== */
    const user = localStorage.getItem("username");
    const userElement = document.getElementById("userName");
    if (user && userElement) {
        userElement.textContent = user;
    }
});