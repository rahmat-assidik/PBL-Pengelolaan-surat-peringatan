document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");

  // Ambil akun dari localStorage (seed default jika belum ada)
  function seedAccountsIfMissing() {
    const raw = localStorage.getItem('accounts');
    if (!raw) {
      const defaults = [
        { username: 'admin', password: 'admin123' },
        { username: 'admin00', password: 'admin12' }
      ];
      localStorage.setItem('accounts', JSON.stringify(defaults));
      return defaults;
    }
    try { return JSON.parse(raw); } catch (e) { return []; }
  }
  const validAccounts = seedAccountsIfMissing();

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Cek apakah username & password cocok
    const matched = validAccounts.find(
      acc => acc.username === username && acc.password === password
    );

    if (matched) {
      // Generate auth token dan set expiry
      const authToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const expiryTime = new Date().getTime() + (30 * 60 * 1000); // 30 menit

      // Simpan data autentikasi
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("tokenExpiry", expiryTime.toString());
      
      try { 
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('authToken', authToken);
      } catch (e) {}

      // Redirect ke dashboard dengan path yang benar
      const currentPath = window.location.pathname;
      const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
      window.location.href = basePath + "dashboard.html";
    } else {
      // Tampilkan pesan error
      errorMessage.textContent = "Username atau password salah!";
      // Reset form
      passwordInput.value = "";
      
      // Tambah class error untuk animasi
      usernameInput.classList.add("input-error");
      passwordInput.classList.add("input-error");

      // Hapus class error setelah 400ms
      setTimeout(() => {
        usernameInput.classList.remove("input-error");
        passwordInput.classList.remove("input-error");
      }, 400);
    }
  });
});
