/*
  Password Manager Handler
  - Handles password change form
  Note: Password toggle functionality is handled by app.js initPasswordToggles()
*/

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('changePasswordForm');
    const currentEl = document.getElementById('currentPassword');
    const newEl = document.getElementById('newPassword');
    const confirmEl = document.getElementById('confirmPassword');
    const msgEl = document.getElementById('passwordMessage');

    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        msgEl.textContent = '';
        msgEl.className = 'text-center mt-3 mb-0';

        const current = currentEl.value.trim();
        const next = newEl.value.trim();
        const confirm = confirmEl.value.trim();

        if (next.length < 6) {
            msgEl.style.color = '#dc3545';
            msgEl.textContent = 'Kata sandi baru harus minimal 6 karakter.';
            return;
        }
        if (next !== confirm) {
            msgEl.style.color = '#dc3545';
            msgEl.textContent = 'Konfirmasi kata sandi tidak cocok.';
            return;
        }

        try {
            const response = await fetch('../crud/change_password.php', {
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
                msgEl.style.color = '#28a745';
                msgEl.textContent = 'Kata sandi berhasil diubah. Silakan login ulang.';
                setTimeout(function() {
                    localStorage.removeItem('loggedIn');
                    window.location.href = '../auth/logout.php';
                }, 1200);
            } else {
                msgEl.style.color = '#dc3545';
                msgEl.textContent = result.message || 'Terjadi kesalahan saat mengubah kata sandi.';
            }
        } catch (error) {
            msgEl.style.color = '#dc3545';
            msgEl.textContent = 'Terjadi kesalahan koneksi. Silakan coba lagi.';
            console.error('Error:', error);
        }
    });
});

