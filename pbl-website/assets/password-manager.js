document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('changePasswordForm');
  const currentEl = document.getElementById('currentPassword');
  const newEl = document.getElementById('newPassword');
  const confirmEl = document.getElementById('confirmPassword');
  const msgEl = document.getElementById('passwordMessage');

  if (!form) return;




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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msgEl.textContent = '';

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

    try {
      const response = await fetch('../api/change_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: current,
          new_password: next
        })
      });

      const result = await response.json();

      if (result.success) {
        msgEl.style.color = 'green';
        msgEl.textContent = 'Kata sandi berhasil diubah. Silakan login ulang.';
        setTimeout(() => {
          try { sessionStorage.removeItem('username'); } catch (e) {}
          localStorage.removeItem('loggedIn');
          window.location.href = '../logout.php';
        }, 1200);
      } else {
        msgEl.style.color = 'red';
        msgEl.textContent = result.message || 'Terjadi kesalahan saat mengubah kata sandi.';
      }
    } catch (error) {
      msgEl.style.color = 'red';
      msgEl.textContent = 'Terjadi kesalahan koneksi. Silakan coba lagi.';
      console.error('Error:', error);
    }
  });
});
