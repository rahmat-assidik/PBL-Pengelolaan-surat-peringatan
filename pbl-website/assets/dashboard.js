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
        link.classList.add("active");

        // Sembunyikan semua section
        sections.forEach((sec) => sec.classList.remove("active"));

        // Ambil id target dari data-target
        const target = link.getAttribute("data-target");
        const section = document.getElementById(target);

        // Tampilkan konten yang sesuai
        if (section) section.classList.add("active");
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
      if (!confirmLogout) return;

      // Hapus status login dari localStorage
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("username");

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
