document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");

  //  Daftar akun valid (sesuai permintaanmu)
  const validAccounts = [
    { username: "admin",   password: "admin123" },
    { username: "admin",   password: "admin12"  },
    { username: "admin00", password: "admin123" },
    { username: "admin00", password: "admin12"  }
  ];

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    //  Cek apakah username & password cocok
    const matched = validAccounts.find(
      acc => acc.username === username && acc.password === password
    );

    if (matched) {
      alert("Berhasil Login");
      errorMessage.textContent = "";
      usernameInput.classList.remove("input-error");
      passwordInput.classList.remove("input-error");
      window.location.href = "dashboard.html";
    } else {
      errorMessage.textContent = "Username atau Password Salah";

      //  Tambahkan efek merah + shake
      usernameInput.classList.add("input-error");
      passwordInput.classList.add("input-error");

      //  Hapus efek setelah animasi selesai (supaya bisa muncul lagi kalau salah dua kali)
      setTimeout(() => {
        usernameInput.classList.remove("input-error");
        passwordInput.classList.remove("input-error");
      }, 400);
    }
  });
});
