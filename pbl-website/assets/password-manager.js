document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('changePasswordForm');
  const currentEl = document.getElementById('currentPassword');
  const newEl = document.getElementById('newPassword');
  const confirmEl = document.getElementById('confirmPassword');
  const msgEl = document.getElementById('passwordMessage');

  if (!form) return;




  function getCurrentUsername() {
    try {
      return sessionStorage.getItem('username') || localStorage.getItem('username');
    } catch (e) {
      return localStorage.getItem('username');
    }
  }


  document.querySelectorAll('.input-password-wrapper').forEach(wrapper => {
    const input = wrapper.querySelector('input');
    const btn = wrapper.querySelector('.toggle-password-visibility');
    if (input && btn) {
      btn.addEventListener('click', () => {
        if (input.type === 'password') {
          input.type = 'text';
          btn.querySelector('i').classList.remove('fa-eye');
          btn.querySelector('i').classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          btn.querySelector('i').classList.remove('fa-eye-slash');
          btn.querySelector('i').classList.add('fa-eye');
        }
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    msgEl.textContent = '';

    const username = getCurrentUsername();
    if (!username) {
      msgEl.style.color = 'red';
      msgEl.textContent = 'Tidak ada user yang terdeteksi. Silakan login ulang.';
      return;
    }

    const current = currentEl.value.trim();
    const next = newEl.value.trim();
    const confirm = confirmEl.value.trim();

    if (next.length < 6) {
      msgEl.style.color = 'red';
      msgEl.textContent = 'Kata sandi baru harus minimal 6 karakter.';
      return;
    }
    if (next !== confirm) {
      msgEl.style.color = 'red';
      msgEl.textContent = 'Konfirmasi kata sandi tidak cocok.';
      return;
    }

    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const account = accounts.find(a => a.username === username);
    
    if (!account) {
      msgEl.style.color = 'red';
      msgEl.textContent = 'Akun tidak ditemukan.';
      return;
    }

    if (account.password !== current) {
      msgEl.style.color = 'red';
      msgEl.textContent = 'Kata sandi saat ini salah.';
      return;
    }

    const idx = accounts.findIndex(a => a.username === username);


    accounts[idx].password = next;
    localStorage.setItem('accounts', JSON.stringify(accounts));

    msgEl.style.color = 'green';
    msgEl.textContent = 'Kata sandi berhasil diubah. Silakan login ulang.';


    setTimeout(() => {
      try { sessionStorage.removeItem('username'); } catch (e) {}
      localStorage.removeItem('loggedIn');
      window.location.href = 'login.php';
    }, 1200);
  });
});
